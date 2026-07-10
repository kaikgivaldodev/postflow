import Link from "next/link";
import { Logo } from "@/components/layout/logo";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-7l-5.5-6.7L4.1 22H1l8.1-9.3L1.3 2h7.2l5 6.1L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.08 1.4-2.08 2.85V21h-4V9Z" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#recursos", label: "Recursos" },
      { href: "/pricing", label: "Preços" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/", label: "Início" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de Serviço" },
      { href: "/privacidade", label: "Política de Privacidade" },
      { href: "/cookies", label: "Política de Cookies" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Agende. Publique. Cresça. PostFlow publica seu conteúdo no
              horário certo, mesmo quando você está offline.
            </p>
            <div className="flex gap-3 pt-1">
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <InstagramIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter/X"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <TwitterIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <LinkedinIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} PostFlow. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
