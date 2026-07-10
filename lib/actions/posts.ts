"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { postSchema, parseHashtags } from "@/lib/validations/posts";
import type { ActionState } from "@/lib/actions/auth";

function parseFormData(formData: FormData) {
  const mediaUrlsRaw = formData.get("mediaUrls");
  let mediaUrls: string[] = [];
  try {
    mediaUrls = mediaUrlsRaw ? JSON.parse(String(mediaUrlsRaw)) : [];
  } catch {
    mediaUrls = [];
  }

  return postSchema.safeParse({
    postType: formData.get("postType"),
    caption: formData.get("caption") ?? "",
    hashtags: formData.get("hashtags") ?? "",
    mediaUrls,
    scheduledAt: formData.get("scheduledAt"),
    accountId: formData.get("accountId") ?? "",
    status: formData.get("status") ?? "scheduled",
  });
}

export async function createPostAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("scheduled_posts").insert({
    user_id: user.id,
    account_id: parsed.data.accountId || null,
    post_type: parsed.data.postType,
    caption: parsed.data.caption,
    hashtags: parseHashtags(parsed.data.hashtags),
    media_urls: parsed.data.mediaUrls,
    scheduled_at: new Date(parsed.data.scheduledAt).toISOString(),
    status: parsed.data.status,
  });

  if (error) {
    return { error: "Não foi possível salvar o post. Tente novamente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  redirect("/calendar");
}

export async function updatePostAction(
  postId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("scheduled_posts")
    .update({
      account_id: parsed.data.accountId || null,
      post_type: parsed.data.postType,
      caption: parsed.data.caption,
      hashtags: parseHashtags(parsed.data.hashtags),
      media_urls: parsed.data.mediaUrls,
      scheduled_at: new Date(parsed.data.scheduledAt).toISOString(),
      status: parsed.data.status,
    })
    .eq("id", postId)
    .eq("user_id", user.id); // IDOR — garante que só o dono edita (seção 7)

  if (error) {
    return { error: "Não foi possível atualizar o post. Tente novamente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  redirect("/calendar");
}

export async function deletePostAction(postId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id); // IDOR — garante que só o dono exclui (seção 7)

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
}

export async function reschedulePostAction(
  postId: string,
  newScheduledAt: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("scheduled_posts")
    .update({ scheduled_at: newScheduledAt })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Não foi possível reagendar o post." };
  }

  revalidatePath("/calendar");
  return {};
}
