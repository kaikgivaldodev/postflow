import type { Metadata } from "next";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "Preços",
  description: "Conheça os planos do PostFlow: Gratuito, Starter, Pro e Agência.",
};

export default function PricingPage() {
  return (
    <div className="pt-8">
      <Pricing />
      <FAQ />
    </div>
  );
}
