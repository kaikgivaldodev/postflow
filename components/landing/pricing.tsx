import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Posts agendados ilimitados",
  "Contas do Instagram ilimitadas",
  "Todos os tipos de post (Feed, Carrossel, Reels, Stories)",
  "Calendário visual com arrastar e soltar",
  "Analytics avançado",
  "Agendamento em lote",
  "Caption com IA",
  "Suporte prioritário",
];

export function Pricing({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="precos" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {showHeading && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Um plano. Tudo incluído.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sem níveis escondidos, sem letras miúdas. 7 dias grátis pra testar.
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-primary bg-card p-8 shadow-lg ring-1 ring-primary">
          <h3 className="text-lg font-semibold">PostFlow</h3>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">R$37,90</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            7 dias grátis, depois R$37,90/mês. Cancele quando quiser.
          </p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button className="mt-8 w-full" size="lg" asChild>
            <Link href="/signup">Testar 7 dias grátis</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
