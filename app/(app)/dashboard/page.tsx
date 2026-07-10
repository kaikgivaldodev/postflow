import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan_id, plan_status, trial_ends_at")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {profile?.full_name ?? "por aqui"} 👋
        </h1>
        <p className="text-muted-foreground">
          Este é o seu painel. O agendamento de posts chega nos próximos passos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plano atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold capitalize">
              {profile?.plan_id ?? "free"}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {profile?.plan_status ?? "active"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts agendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
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
            <p className="text-2xl font-semibold">0</p>
            <p className="text-sm text-muted-foreground">Instagram</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
