import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="h-[420px] w-[720px] rounded-full brand-gradient opacity-20" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-20 text-center sm:pt-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Comece grátis — sem cartão de crédito
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Agende seus posts no Instagram.
          <br />
          <span className="brand-gradient-text">Durma tranquilo.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          PostFlow publica seu conteúdo no horário certo, mesmo quando você
          está offline. Conecte sua conta, agende seus posts e acompanhe tudo
          no calendário.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/signup">
              Começar grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="#como-funciona">
              Ver como funciona
              <ChevronDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
