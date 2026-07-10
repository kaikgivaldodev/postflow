import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="brand-gradient relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Comece hoje. Cancele quando quiser.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-white/90">
            14 dias de trial no plano Pro, sem cartão de crédito. Agende seu
            primeiro post em menos de 5 minutos.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" className="bg-white text-foreground hover:bg-white/90" asChild>
              <Link href="/signup">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
