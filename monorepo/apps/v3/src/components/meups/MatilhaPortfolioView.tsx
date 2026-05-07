import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PropostaAmbientBackdrop } from "@/components/proposta/PropostaAmbientBackdrop";
import type { MatilhaPortfolioCaseDefinition } from "@/lib/matilha-portfolio-cases";

function MatilhaBrandMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/02-logo-matilha-full.svg"
      alt="Matilha Estúdio"
      className="meups-nav__logo-img"
    />
  );
}

function caseOriginLabel(caseOrigin: string): string {
  try {
    const { pathname } = new URL(caseOrigin);
    return pathname.replace(/^\//, "").replace(/\/$/, "") || pathname;
  } catch {
    return caseOrigin;
  }
}

type Props = {
  caseDef: MatilhaPortfolioCaseDefinition;
};

export function MatilhaPortfolioView({ caseDef: c }: Props) {
  const heroBannerAlt = `${`${c.title}${c.titleAccent}`.trim()} — case Matilha Estúdio`;

  return (
    <>
      <PropostaAmbientBackdrop />
      <div className="proposta-main meups-portfolio">
        <nav className="meups-nav">
          <a
            className="brand meups-nav__brand"
            href="https://matilha.digital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MatilhaBrandMark />
          </a>
          <div className="nav-links">
            <a href="#meups-servicos">Serviços</a>
            <a href="#meups-desafio">Desafio</a>
            <a href="#meups-galeria">Galeria</a>
            <a href="#meups-entrega">Entrega</a>
            <a href="#meups-equipe">Equipe</a>
            <Link href="/">Propostas</Link>
          </div>
        </nav>

        <header className="meups-hero">
          <div className="meups-hero__glow" aria-hidden="true" />
          <div className="meups-hero__inner">
            <div className="meups-hero__content">
              <span className="section-label">// CASE</span>
              <h1 className="meups-hero__title">
                {c.title}
                {c.titleAccent ? (
                  <span className="accent">{c.titleAccent}</span>
                ) : null}
              </h1>
              <p className="meups-hero__subtitle">{c.subtitle}</p>
              <div className="meups-chip-row fade-in-delay">
                {c.services.map((s) => (
                  <span key={s} className="meups-chip">
                    {s}
                  </span>
                ))}
              </div>
              <p className="meups-meta">
                Case publicado pela Matilha ·{" "}
                <a
                  href={c.caseOrigin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {caseOriginLabel(c.caseOrigin)}
                </a>
              </p>
            </div>
            <figure className="meups-hero__banner">
              <Image
                src={c.bannerUrl}
                alt={heroBannerAlt}
                width={1920}
                height={820}
                className="meups-hero__banner-img"
                sizes="(max-width: 1160px) 100vw, 1120px"
                priority
              />
            </figure>
          </div>
        </header>

        <hr className="divider" />

        <section id="meups-servicos" className="fade-in meups-block">
          <span className="section-label">// Serviços</span>
          <ul className="meups-list-check">
            {c.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {c.contextNotes?.length ? (
          <>
            <hr className="divider" />
            <section id="meups-contexto" className="fade-in meups-block">
              <span className="section-label">// Contexto</span>
              {c.contextNotes.map((para, i) => (
                <p key={i} className="lead">
                  {para}
                </p>
              ))}
            </section>
          </>
        ) : null}

        <hr className="divider" />

        <section id="meups-desafio" className="fade-in meups-block">
          <span className="section-label">// Desafio</span>
          <h2 className="meups-h2">{c.challengeLead}</h2>
          <p className="lead">{c.challenge}</p>
        </section>

        <hr className="divider" />

        <section id="meups-galeria" className="fade-in meups-gallery">
          <span className="section-label">// Interface</span>
          <h2 className="meups-h2">Momentos do produto</h2>
          <p className="lead meups-gallery__lead">{c.portfolioLead}</p>
          <div className="meups-gallery__grid" role="list">
            {c.portfolioImages.map((shot, i) => (
              <div
                key={shot.src}
                className="meups-gallery__shot"
                role="listitem"
                style={{ "--meups-i": i } as CSSProperties}
              >
                <div className="meups-gallery__shot-chrome" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="meups-gallery__shot-media">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1200}
                    height={675}
                    className="meups-gallery__img"
                    sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                </div>
                <span className="meups-gallery__shot-caption">
                  {shot.caption}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section id="meups-entrega" className="fade-in meups-block">
          <span className="section-label">// Entrega</span>
          <div className="meups-deliver-cards">
            {c.deliveries.map((e) => (
              <article key={e.titulo} className="meups-deliver-card">
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </article>
            ))}
          </div>
          {c.quote ? (
            <blockquote className="meups-quote fade-in">
              <p>
                {"\u201c"}
                {c.quote.text}
                {"\u201d"}
              </p>
              <cite>{c.quote.cite}</cite>
            </blockquote>
          ) : null}
        </section>

        <hr className="divider" />

        <section id="meups-equipe" className="fade-in meups-block">
          <span className="section-label">// Equipe</span>
          <h2 className="meups-h2">Quem construiu</h2>
          <ul className="meups-team">
            {c.team.map(([nome, cargo]) => (
              <li key={nome}>
                <strong>{nome}</strong>
                <span>{cargo}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="divider" />

        <section className="fade-in meups-cta">
          <h2 className="meups-h2">Vamos transformar sua ideia juntos</h2>
          <p className="contact-row">
            <a href="mailto:talk@matilha.digital">talk@matilha.digital</a>
          </p>
          <p className="meta-footer">
            <a
              href={c.caseOrigin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver case no site Matilha
            </a>
            {" · "}
            <Link href="/">Voltar às propostas</Link>
          </p>
        </section>

        <footer className="meups-footer">
          <p className="meta-footer">
            Brasil · Curitiba, PR — Rua Emiliano Perneta, 680 ·{" "}
            <a
              href="https://matilha.digital/"
              target="_blank"
              rel="noopener noreferrer"
            >
              matilha.digital
            </a>
          </p>
          <p className="meta-footer">
            © 2012–2026 Matilha Estúdio de Design Ltda. · {c.footerCredit}
          </p>
        </footer>
      </div>
    </>
  );
}
