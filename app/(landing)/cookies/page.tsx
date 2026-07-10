import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Política de Cookies</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: julho de 2025</p>

      <div className="prose prose-neutral mt-10 max-w-none space-y-8 dark:prose-invert">
        <section>
          <h2 className="text-xl font-semibold">Cookies estritamente necessários</h2>
          <p className="mt-2 text-muted-foreground">
            Usados para manter sua sessão autenticada e o funcionamento básico
            do site. Não exigem consentimento, pois são essenciais para o
            serviço funcionar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies de performance</h2>
          <p className="mt-2 text-muted-foreground">
            Nos ajudam a entender como o site é usado, para que possamos
            melhorá-lo. Só são ativados mediante seu consentimento (opt-in).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies de marketing</h2>
          <p className="mt-2 text-muted-foreground">
            Usados para medir a eficácia de campanhas. Só são ativados
            mediante seu consentimento (opt-in).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Gerenciar preferências</h2>
          <p className="mt-2 text-muted-foreground">
            Você pode alterar sua escolha a qualquer momento limpando os dados
            de navegação do site ou entrando em contato conosco em{" "}
            <a
              href="mailto:privacidade@postflow.app"
              className="text-primary hover:underline"
            >
              privacidade@postflow.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
