import type { Metadata } from "next";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "Preços",
  description: "PostFlow: um único plano de R$37,90/mês com tudo liberado. 7 dias grátis.",
};

export default function PricingPage() {
  return (
    <div className="pt-8">
      <Pricing />
      <FAQ />
    </div>
  );
}
