import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/posts/post-form";

export const metadata: Metadata = {
  title: "Novo Post",
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts } = await supabase
    .from("instagram_accounts")
    .select("id, ig_username")
    .eq("user_id", user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo post</h1>
        <p className="text-muted-foreground">
          Crie e agende um post para o Instagram.
        </p>
      </div>

      <PostForm accounts={accounts ?? []} />
    </div>
  );
}
