import { Link2, CalendarClock, LineChart } from "lucide-react";

const STEPS = [
  {
    icon: Link2,
    title: "Conecte sua conta do Instagram",
    description: "Autorize com 1 clique via login oficial da Meta. Seguro e reversível a qualquer momento.",
  },
  {
    icon: CalendarClock,
    title: "Crie e agende seus posts",
    description: "Feed, Reels, Stories ou Carrossel. Escreva a legenda, escolha a data e deixe com a gente.",
  },
  {
    icon: LineChart,
    title: "Acompanhe tudo no calendário",
    description: "Veja o que vai ser publicado, reagende com drag & drop e relaxe — nós cuidamos do resto.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-muted-foreground">
            Três passos entre você e um Instagram no automático.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-lg border border-border bg-card p-6">
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full brand-gradient text-sm font-semibold text-white">
                {i + 1}
              </span>
              <step.icon className="mt-4 h-8 w-8 text-primary" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
