import {
  CalendarDays,
  Grid3x3,
  Users,
  BellRing,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Calendário visual de posts",
    description: "Visão mensal, semanal e diária. Arraste e solte para reagendar em segundos.",
  },
  {
    icon: Grid3x3,
    title: "Todos os formatos do Instagram",
    description: "Feed, Carrossel, Reels e Stories — com preview antes de publicar.",
  },
  {
    icon: Users,
    title: "Múltiplas contas em um só lugar",
    description: "Gerencie vários perfis do Instagram sem trocar de ferramenta.",
  },
  {
    icon: BellRing,
    title: "Notificações de publicação",
    description: "Receba um email quando um post for publicado — ou avise se algo falhar.",
  },
  {
    icon: BarChart3,
    title: "Analytics de desempenho",
    description: "Acompanhe alcance e engajamento direto no PostFlow (planos pagos).",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados protegidos",
    description: "Tokens criptografados, conformidade com a LGPD e infraestrutura segura.",
  },
];

export function Features() {
  return (
    <section id="recursos" className="border-t border-border bg-secondary/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tudo que você precisa para automatizar seu Instagram
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ferramentas pensadas para criadores, agências e times de marketing.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <feature.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
