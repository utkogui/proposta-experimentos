import Image from "next/image";
import Link from "next/link";
import {
  getSpotlightCases,
  type MatilhaPortfolioCaseDefinition,
} from "@/lib/matilha-portfolio-cases";

function displayCaseTitle(c: MatilhaPortfolioCaseDefinition): string {
  return `${c.title}${c.titleAccent}`.trim();
}

/**
 * Grade de destaques para cases publicados pela Matilha, com link para páginas internas.
 */
export function CaseSpotlightSection() {
  const cases = getSpotlightCases();

  return (
    <section
      id="cases-matilha"
      className="fade-in case-spotlight"
      aria-labelledby="cases-matilha-heading"
    >
      <div className="case-spotlight__inner">
        <span className="section-label">Portfólio Matilha</span>
        <h2 id="cases-matilha-heading" className="case-spotlight__section-title">
          Cases de referência
        </h2>
        <p className="lead case-spotlight__section-lead">
          Quatro projetos reais da Matilha — Meu PlayStation, MON, Charney e PUBG —
          com texto expandido a partir dos próprios cases públicos e do contexto de
          cada marca (portal editorial, museu, incorporadora nos EUA e franquia
          global de jogos).
        </p>
        <div className="case-spotlight__grid">
          {cases.map((c) => (
            <Link
              key={c.slug}
              href={c.internalPath}
              className="case-spotlight__card case-spotlight__card--tile"
            >
              <div className="case-spotlight__thumb" aria-hidden="true">
                <Image
                  src={c.bannerUrl}
                  alt=""
                  fill
                  className="case-spotlight__thumb-img"
                  sizes="(max-width: 640px) 100vw, (max-width: 1079px) 50vw, 25vw"
                />
                <div className="case-spotlight__thumb-scrim" />
                <div className="case-spotlight__thumb-grid" />
                <span className="case-spotlight__thumb-badge">// CASE</span>
                <span className="case-spotlight__thumb-kicker">
                  {c.spotlightKicker}
                </span>
              </div>
              <div className="case-spotlight__body">
                <h3 className="case-spotlight__card-title">
                  {displayCaseTitle(c)}
                </h3>
                <p className="lead case-spotlight__lead">{c.spotlightLead}</p>
                <ul
                  className="case-spotlight__tags"
                  aria-label="Serviços do case"
                >
                  {c.spotlightTags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className="case-spotlight__cta">
                  Ver case completo
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
