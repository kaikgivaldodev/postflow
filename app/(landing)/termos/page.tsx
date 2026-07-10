import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço",
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Termos de Serviço</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: julho de 2025</p>

      <div className="prose prose-neutral mt-10 max-w-none space-y-8 dark:prose-invert">
        <section>
          <h2 className="text-xl font-semibold">1. O que é o PostFlow</h2>
          <p className="mt-2 text-muted-foreground">
            O PostFlow é uma ferramenta de agendamento e publicação de conteúdo
            para Instagram. Não somos afiliados à Meta Platforms, Inc., e não
            nos responsabilizamos por suspensões, restrições ou bloqueios de
            conta aplicados pelo Instagram, ainda que decorrentes do uso da
            nossa ferramenta em conformidade com os termos da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Uso aceitável</h2>
          <p className="mt-2 text-muted-foreground">
            Você concorda em não usar o PostFlow para envio de spam, conteúdo
            ilegal, discurso de ódio, violação de direitos autorais ou
            qualquer atividade que viole as políticas do Instagram/Meta ou a
            legislação brasileira.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Pagamentos e reembolsos</h2>
          <p className="mt-2 text-muted-foreground">
            As assinaturas são cobradas de forma recorrente (mensal ou anual)
            via SyncPay. Reembolsos seguem o Código de Defesa do Consumidor
            (Lei 8.078/90), incluindo o direito de arrependimento em até 7
            dias após a contratação para o primeiro ciclo de cobrança.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Cancelamento</h2>
          <p className="mt-2 text-muted-foreground">
            Você pode cancelar sua assinatura a qualquer momento em
            Configurações → Assinatura. O acesso aos recursos pagos permanece
            até o fim do período já pago. Seus dados são mantidos por um
            período de backup antes da exclusão definitiva, conforme nossa
            Política de Privacidade.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Limitação de responsabilidade</h2>
          <p className="mt-2 text-muted-foreground">
            O PostFlow é fornecido &quot;como está&quot;. Não garantimos
            disponibilidade ininterrupta do serviço nem da API do Instagram,
            que está fora do nosso controle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Lei aplicável e foro</h2>
          <p className="mt-2 text-muted-foreground">
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil, incluindo o Código de Defesa do Consumidor e a Lei Geral
            de Proteção de Dados (LGPD). Fica eleito o foro da comarca da sede
            do prestador do serviço para dirimir eventuais controvérsias.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Contato</h2>
          <p className="mt-2 text-muted-foreground">
            Dúvidas sobre estes Termos podem ser enviadas para{" "}
            <a href="mailto:contato@postflow.app" className="text-primary hover:underline">
              contato@postflow.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
