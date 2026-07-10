import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hasActiveAccess, trialDaysRemaining } from "@/lib/plan";
import { CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Assinatura",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_status, trial_ends_at")
    .eq("id", user!.id)
    .single();

  const active = profile ? hasActiveAccess(profile) : false;
  const isTrialing = profile?.plan_status === "trial";
  const daysLeft = trialDaysRemaining(profile?.trial_ends_at ?? null);
  const expired = isTrialing && !active;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground">
          Um único plano, R$37,90/mês, com tudo liberado.
        </p>
      </div>

      {expired && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="font-medium text-destructive">
            Seu período grátis acabou.
          </p>
          <p className="mt-1 text-sm text-destructive/90">
            Assine por R$37,90/mês para continuar usando o PostFlow.
          </p>
        </div>
      )}

      {isTrialing && !expired && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-4 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            Você está no período gratuito —{" "}
            <strong>{daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"}</strong>.
          </span>
        </div>
      )}

      {active && !isTrialing && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Sua assinatura está ativa.</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plano PostFlow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight">R$37,90</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Posts ilimitados, contas ilimitadas, calendário visual, analytics
            avançado e suporte prioritário — tudo incluído.
          </p>
          <Button className="w-full" size="lg" disabled>
            Assinar (em breve)
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            O checkout de pagamento ainda está sendo integrado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
