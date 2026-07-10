import { Star } from "lucide-react";

const LOGOS = ["Aurora", "Nimbus", "Vertex", "Solano", "Cedro", "Prisma"];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-secondary/30 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Mais de 2.400 criadores</span>{" "}
              já automatizaram seu Instagram com o PostFlow
            </p>
          </div>

          <div className="grid w-full grid-cols-3 items-center gap-x-8 gap-y-4 opacity-60 sm:grid-cols-6">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-center text-sm font-semibold tracking-wide text-muted-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
