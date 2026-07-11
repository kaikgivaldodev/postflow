import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trialDaysRemaining } from "@/lib/plan";
import { Plus, CalendarClock } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const POST_TYPE_LABEL: Record<string, string> = {
  feed: "Feed",
  story: "Story",
  reel: "Reels",
  carousel: "Carrossel",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: profile }, { count: postsThisMonth }, { count: accountsCount }, { data: upcomingPosts }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, plan_status, trial_ends_at")
        .eq("id", user!.id)
        .single(),
      supabase
        .from("scheduled_posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("created_at", startOfMonth.toISOString()),
      supabase
        .from("instagram_accounts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id),
      supabase
        .from("scheduled_posts")
        .select("id, post_type, caption, scheduled_at, status")
        .eq("user_id", user!.id)
        .in("status", ["scheduled", "draft"])
        .order("scheduled_at", { ascending: true })
        .limit(5),
    ]);

  const daysLeft = trialDaysRemaining(profile?.trial_ends_at ?? null);
  const isTrialing = profile?.plan_status === "trial";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, {profile?.full_name ?? "por aqui"} 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo da sua conta.
          </p>
        </div>
        <Button asChild>
          <Link href="/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status da conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {isTrialing ? "Trial" : "Ativo"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isTrialing
                ? `${daysLeft} ${daysLeft === 1 ? "dia restante" : "dias restantes"}`
                : "Assinatura em dia"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts criados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{postsThisMonth ?? 0}</p>
            <p className="text-sm text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contas conectadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{accountsCount ?? 0}</p>
            <p className="text-sm text-muted-foreground">Instagram</p>
            {(accountsCount ?? 0) === 0 && (
              <Link
                href="/settings/accounts"
                className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
              >
                Conectar conta →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Próximos posts</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingPosts && upcomingPosts.length > 0 ? (
            <ul className="divide-y divide-border">
              {upcomingPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {POST_TYPE_LABEL[post.post_type] ?? post.post_type}
                        {post.caption ? ` — ${post.caption.slice(0, 40)}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.scheduled_at).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium capitalize text-muted-foreground">
                    {post.status === "draft" ? "Rascunho" : "Agendado"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Você ainda não tem posts. Que tal criar o primeiro?
              </p>
              <Button size="sm" asChild>
                <Link href="/posts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar post
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
