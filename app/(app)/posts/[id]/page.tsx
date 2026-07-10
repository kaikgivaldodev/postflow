import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/posts/post-form";

export const metadata: Metadata = {
  title: "Editar Post",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: post }, { data: accounts }] = await Promise.all([
    supabase
      .from("scheduled_posts")
      .select("id, post_type, caption, hashtags, media_urls, scheduled_at, account_id")
      .eq("id", id)
      .eq("user_id", user!.id) // IDOR — só o dono pode editar (seção 7)
      .single(),
    supabase.from("instagram_accounts").select("id, ig_username").eq("user_id", user!.id),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar post</h1>
        <p className="text-muted-foreground">Atualize os detalhes do seu post.</p>
      </div>

      <PostForm accounts={accounts ?? []} post={post} />
    </div>
  );
}
