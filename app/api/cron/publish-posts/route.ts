import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { decrypt } from "@/lib/encryption";
import { startContainerCreation, advancePendingCarousel, type PostType } from "@/lib/meta-api/publish";
import { getContainerStatus, publishContainer } from "@/lib/meta-api/media";
import { parseGraphErrorToPortuguese, isTransientGraphError } from "@/lib/meta-api/errors";

export const maxDuration = 60;

const CONTAINER_TIMEOUT_MS = 30 * 60 * 1000;
const BATCH_SIZE = 15;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get("x-cron-secret") === secret) return true;
  if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
  return false;
}

type DuePost = {
  id: string;
  post_type: string;
  caption: string | null;
  hashtags: string[];
  media_urls: string[];
  account_id: string | null;
  media_container_id: string | null;
  carousel_child_container_ids: string[] | null;
  container_created_at: string | null;
  instagram_accounts: { ig_user_id: string; access_token: string } | null;
};

type Outcome = "published" | "pending" | "failed";

async function advancePost(
  supabase: ReturnType<typeof createAdminClient>,
  post: DuePost
): Promise<Outcome> {
  if (!post.account_id || !post.instagram_accounts) {
    await supabase
      .from("scheduled_posts")
      .update({
        status: "failed",
        error_message: "Nenhuma conta do Instagram vinculada a este post.",
      })
      .eq("id", post.id);
    return "failed";
  }

  if (post.container_created_at) {
    const age = Date.now() - new Date(post.container_created_at).getTime();
    if (age > CONTAINER_TIMEOUT_MS) {
      await supabase
        .from("scheduled_posts")
        .update({
          status: "failed",
          error_message: "Tempo esgotado processando a mídia no Instagram.",
          media_container_id: null,
          carousel_child_container_ids: null,
        })
        .eq("id", post.id);
      return "failed";
    }
  }

  const igUserId = post.instagram_accounts.ig_user_id;
  const pageAccessToken = decrypt(post.instagram_accounts.access_token);
  const caption = [post.caption, ...(post.hashtags ?? [])].filter(Boolean).join("\n\n");

  try {
    let containerId = post.media_container_id;

    if (!containerId) {
      if (post.carousel_child_container_ids && post.carousel_child_container_ids.length > 0) {
        const result = await advancePendingCarousel(
          igUserId,
          pageAccessToken,
          post.carousel_child_container_ids,
          caption
        );
        if (result.kind === "pending") {
          return "pending";
        }
        containerId = result.containerId;
        await supabase
          .from("scheduled_posts")
          .update({ media_container_id: containerId, carousel_child_container_ids: null })
          .eq("id", post.id);
      } else {
        const result = await startContainerCreation({
          igUserId,
          pageAccessToken,
          postType: post.post_type as PostType,
          caption,
          mediaUrls: post.media_urls,
        });

        if (result.kind === "pending") {
          await supabase
            .from("scheduled_posts")
            .update({
              carousel_child_container_ids: result.childContainerIds,
              container_created_at: new Date().toISOString(),
            })
            .eq("id", post.id);
          return "pending";
        }

        containerId = result.containerId;
        await supabase
          .from("scheduled_posts")
          .update({
            media_container_id: containerId,
            container_created_at: new Date().toISOString(),
          })
          .eq("id", post.id);
      }
    }

    const status = await getContainerStatus(containerId, pageAccessToken);

    if (status.statusCode === "IN_PROGRESS") {
      return "pending";
    }

    if (status.statusCode === "ERROR" || status.statusCode === "EXPIRED") {
      await supabase
        .from("scheduled_posts")
        .update({
          status: "failed",
          error_message: `Falha ao processar mídia no Instagram (${status.statusCode}).`,
          media_container_id: null,
        })
        .eq("id", post.id);
      return "failed";
    }

    const { igMediaId } = await publishContainer(igUserId, containerId, pageAccessToken);
    await supabase
      .from("scheduled_posts")
      .update({
        status: "published",
        ig_post_id: igMediaId,
        media_container_id: null,
        carousel_child_container_ids: null,
        error_message: null,
      })
      .eq("id", post.id);

    const storagePaths = post.media_urls
      .map((url) => {
        const marker = "/post-media/";
        const idx = url.indexOf(marker);
        return idx !== -1 ? url.slice(idx + marker.length) : null;
      })
      .filter((p): p is string => p !== null);
    if (storagePaths.length > 0) {
      await supabase.storage.from("post-media").remove(storagePaths);
    }

    return "published";
  } catch (error) {
    if (isTransientGraphError(error)) {
      return "pending";
    }
    await supabase
      .from("scheduled_posts")
      .update({
        status: "failed",
        error_message: parseGraphErrorToPortuguese(error),
      })
      .eq("id", post.id);
    return "failed";
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: duePosts } = await supabase
    .from("scheduled_posts")
    .select(
      "id, post_type, caption, hashtags, media_urls, account_id, media_container_id, carousel_child_container_ids, container_created_at, instagram_accounts(ig_user_id, access_token)"
    )
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(BATCH_SIZE);

  const results = { processed: 0, published: 0, pending: 0, failed: 0 };

  for (const post of (duePosts ?? []) as unknown as DuePost[]) {
    results.processed++;
    const outcome = await advancePost(supabase, post);
    results[outcome]++;
  }

  return NextResponse.json(results);
}
