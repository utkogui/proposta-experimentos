import type { Metadata } from "next";
import { MatilhaPortfolioView } from "@/components/meups/MatilhaPortfolioView";
import { PropostaScripts } from "@/components/proposta/PropostaScripts";
import { MATILHA_PORTFOLIO_CASES } from "@/lib/matilha-portfolio-cases";

const c = MATILHA_PORTFOLIO_CASES["charney-companies"];

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDescription,
};

export default function CharneyPortfolioPage() {
  return (
    <>
      <MatilhaPortfolioView caseDef={c} />
      <PropostaScripts />
    </>
  );
}
