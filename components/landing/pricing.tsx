"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  monthlyPrice: number;
  highlighted?: boolean;
  features: { label: string; included: boolean }[];
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    monthlyPrice: 0,
    features: [
      { label: "10 posts agendados/mês", included: true },
      { label: "1 conta do Instagram", included: true },
      { label: "Feed e Story", included: true },
      { label: "Calendário visual", included: true },
      { label: "Analytics", included: false },
      { label: "Agendamento em lote", included: false },
      { label: "Caption com IA", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    features: [
      { label: "100 posts agendados/mês", included: true },
      { label: "2 contas do Instagram", included: true },
      { label: "Todos os tipos de post", included: true },
      { label: "Calendário visual", included: true },
      { label: "Analytics básico", included: true },
      { label: "Agendamento em lote", included: false },
      { label: "Caption com IA", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 59,
    highlighted: true,
    features: [
      { label: "Posts agendados ilimitados", included: true },
      { label: "5 contas do Instagram", included: true },
      { label: "Todos os tipos de post", included: true },
      { label: "Calendário visual", included: true },
      { label: "Analytics avançado", included: true },
      { label: "Agendamento em lote", included: true },
      { label: "Caption com IA", included: true },
    ],
  },
  {
    id: "agency",
    name: "Agência",
    monthlyPrice: 119,
    features: [
      { label: "Posts agendados ilimitados", included: true },
      { label: "15 contas do Instagram", included: true },
      { label: "Todos os tipos de post", included: true },
      { label: "Calendário visual", included: true },
      { label: "Analytics avançado", included: true },
      { label: "Agendamento em lote", included: true },
      { label: "White label", included: true },
    ],
  },
];

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });
}

export function Pricing({ showHeading = true }: { showHeading?: boolean }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="precos" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {showHeading && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Planos e preços
            </h2>
            <p className="mt-4 text-muted-foreground">
              Comece grátis. Faça upgrade quando precisar de mais.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm", !annual && "font-semibold text-foreground")}>
            Mensal
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Alternar entre cobrança mensal e anual"
            onClick={() => setAnnual((a) => !a)}
            className={cn(
              "relative h-7 w-12 rounded-full border border-border transition-colors",
              annual ? "bg-primary" : "bg-secondary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                annual ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
          <span className={cn("text-sm", annual && "font-semibold text-foreground")}>
            Anual
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            -20%
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const price = annual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-xl border p-6",
                  plan.highlighted
                    ? "border-primary bg-card shadow-lg ring-1 ring-primary"
                    : "border-border bg-card"
                )}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full brand-gradient px-3 py-1 text-xs font-semibold text-white">
                    Mais popular
                  </span>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    {price === 0 ? "R$0" : `R$${formatPrice(price)}`}
                  </span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
                {annual && plan.monthlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground">cobrado anualmente</p>
                )}

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span
                        className={cn(
                          !feature.included && "text-muted-foreground/60"
                        )}
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/signup">
                    {plan.id === "free" ? "Começar grátis" : "Assinar " + plan.name}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
