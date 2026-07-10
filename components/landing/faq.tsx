import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Minha conta do Instagram vai ser suspensa?",
    answer:
      "Não. O PostFlow usa a API oficial da Meta para publicar seus posts, seguindo todas as diretrizes do Instagram. Não simulamos comportamento humano nem burlamos limites da plataforma.",
  },
  {
    question: "Funciona com contas pessoais e empresariais?",
    answer:
      "O PostFlow funciona com contas do Instagram conectadas a uma Página do Facebook (contas comerciais/criador). É um requisito da própria API do Instagram para publicação automática.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. Você pode cancelar sua assinatura a qualquer momento em Configurações → Assinatura, sem multas ou taxas de cancelamento.",
  },
  {
    question: "O que acontece quando o trial acaba?",
    answer:
      "Ao final dos 14 dias, você pode escolher um plano pago para continuar usando todos os recursos, ou seguir no plano Gratuito com limites reduzidos. Seus dados e posts agendados são mantidos.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer:
      "Sim. Seus tokens de acesso ao Instagram são criptografados, nunca expostos ao navegador, e seguimos as exigências da LGPD — incluindo exportação e exclusão de dados a qualquer momento.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
