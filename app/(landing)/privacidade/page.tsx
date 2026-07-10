import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: julho de 2025</p>

      <div className="prose prose-neutral mt-10 max-w-none space-y-8 dark:prose-invert">
        <section>
          <h2 className="text-xl font-semibold">1. Quais dados coletamos</h2>
          <p className="mt-2 text-muted-foreground">
            Coletamos seu nome, email e senha (criptografada) no cadastro; os
            dados da sua conta do Instagram necessários para publicar
            conteúdo (nome de usuário, foto de perfil e token de acesso); e
            dados de uso da plataforma (posts agendados, logs de acesso).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Por que coletamos</h2>
          <p className="mt-2 text-muted-foreground">
            Usamos esses dados para viabilizar o agendamento e publicação de
            posts, comunicar você sobre o status das publicações e melhorar o
            produto através de analytics agregados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Com quem compartilhamos</h2>
          <p className="mt-2 text-muted-foreground">
            Compartilhamos dados estritamente necessários com nossos
            fornecedores de infraestrutura: Supabase (banco de dados e
            autenticação), Meta/Instagram (publicação de conteúdo), SyncPay
            (processamento de pagamentos) e Vercel (hospedagem). Nunca
            vendemos seus dados a terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Por quanto tempo guardamos</h2>
          <p className="mt-2 text-muted-foreground">
            Mantemos seus dados enquanto sua conta estiver ativa. Após a
            exclusão da conta, os dados são retidos por até 30 dias para fins
            de backup e, então, removidos permanentemente, salvo obrigação
            legal de retenção.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Seus direitos (LGPD)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Acesso aos dados que temos sobre você</li>
            <li>Correção de dados incompletos ou desatualizados</li>
            <li>Exclusão da sua conta e dados, disponível em Configurações → Meus Dados</li>
            <li>Portabilidade — exportação dos seus dados em formato JSON</li>
            <li>Revogação do consentimento a qualquer momento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Encarregado de Dados (DPO)</h2>
          <p className="mt-2 text-muted-foreground">
            Para exercer seus direitos ou tirar dúvidas sobre privacidade,
            contate nosso DPO em{" "}
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
