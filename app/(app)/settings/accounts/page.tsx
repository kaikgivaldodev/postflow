import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/settings/account-card";

export const metadata: Metadata = {
  title: "Contas do Instagram",
};

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: "Você cancelou a conexão com o Instagram.",
  oauth_state_mismatch: "A sessão de conexão expirou. Tente novamente.",
  limit_reached: "Limite de contas conectadas atingido para o seu plano.",
  token_exchange_failed: "Não foi possível concluir a conexão com o Instagram. Tente novamente.",
  unknown: "Algo deu errado ao conectar sua conta. Tente novamente.",
};

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts } = await supabase
    .from("instagram_accounts")
    .select("id, ig_username, profile_picture_url, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] ?? ERROR_MESSAGES.unknown : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contas do Instagram</h1>
        <p className="text-muted-foreground">
          Conecte suas contas profissionais do Instagram para agendar e publicar posts automaticamente.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {searchParams.success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          Conta conectada com sucesso!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conectar nova conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sua conta do Instagram precisa ser do tipo Business ou Criador de conteúdo. Você vai
            fazer login diretamente com sua conta do Instagram.
          </p>
          <Button asChild>
            <a href="/api/instagram/connect">Conectar conta do Instagram</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contas conectadas</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts && accounts.length > 0 ? (
            <ul className="divide-y divide-border">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma conta conectada ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
