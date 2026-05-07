import type { Metadata } from "next";
import { MeUpsPortfolioView } from "@/components/meups/MeUpsPortfolioView";
import { PropostaScripts } from "@/components/proposta/PropostaScripts";
import { MATILHA_PORTFOLIO_CASES } from "@/lib/matilha-portfolio-cases";

const c = MATILHA_PORTFOLIO_CASES["meu-playstation"];

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDescription,
};

export default function MeUpsPortfolioPage() {
  return (
    <>
      <MeUpsPortfolioView />
      <PropostaScripts />
    </>
  );
}
