import { MatilhaPortfolioView } from "@/components/meups/MatilhaPortfolioView";
import { MATILHA_PORTFOLIO_CASES } from "@/lib/matilha-portfolio-cases";

export function MeUpsPortfolioView() {
  return (
    <MatilhaPortfolioView caseDef={MATILHA_PORTFOLIO_CASES["meu-playstation"]} />
  );
}
