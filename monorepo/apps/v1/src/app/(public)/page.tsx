export const metadata = {
  title: "CP · Guia de Transportadoras · Propostas",
  description: "Selecione a versão da proposta para visualizar.",
};

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        gap: "3rem",
        position: "relative",
      }}
    >
      {/* glow */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(249,200,14,.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* header */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        {/* monograma */}
        <div
          style={{
            width: 56,
            height: 56,
            background: "var(--accent)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            flexShrink: 0,
          }}
        >
          CP
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Matilha Estúdio · Maio 2026
        </span>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Guia de{" "}
          <span style={{ color: "var(--accent)" }}>Transportadoras</span>
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-soft)",
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          Selecione a versão da proposta que deseja visualizar.
        </p>
      </header>

      {/* cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: 640,
        }}
      >
        <LauncherCard
          tag="Versão 01"
          tech="HTML estático"
          title={<>Proposta<br />Standalone</>}
          desc="Arquivo HTML único, sem dependências de servidor. Funciona offline e é compartilhável por link direto."
          href="/proposta-cp.html"
        />
        <LauncherCard
          tag="Versão 02"
          tech="Next.js · CMS"
          title={<>Proposta<br />Plataforma</>}
          desc="Renderizada pelo CMS. Editável via painel admin em /admin. Sempre atualizada com os dados mais recentes."
          href="/p/cp"
        />
      </div>

      {/* footer */}
      <footer
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        <div>CP · Guia de Transportadoras · Proposta comercial</div>
        <div>Matilha Estúdio · Curitiba, PR · talk@matilha.digital</div>
      </footer>

      <style>{`
        .launcher-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: border-color .2s, background .2s, transform .2s;
          position: relative;
          overflow: hidden;
        }
        .launcher-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
        }
        .launcher-card:hover {
          border-color: rgba(249,200,14,.3);
          background: var(--bg-card-hover);
          transform: translateY(-2px);
        }
        .launcher-card:hover::before { transform: scaleX(1); }
        .launcher-card:hover .card-arrow {
          color: var(--accent);
          letter-spacing: 0.14em;
        }
      `}</style>
    </div>
  );
}

function LauncherCard({
  tag,
  tech,
  title,
  desc,
  href,
}: {
  tag: string;
  tech: string;
  title: React.ReactNode;
  desc: string;
  href: string;
}) {
  return (
    <a className="launcher-card" href={href}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent)",
        }}
      >
        {tag}
      </span>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
          padding: "0.25rem 0.65rem",
          alignSelf: "flex-start",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            background: "var(--accent)",
            borderRadius: "50%",
            flexShrink: 0,
            display: "block",
          }}
        />
        {tech}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--text-soft)",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {desc}
      </p>

      <span
        className="card-arrow"
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
          transition: "color .2s, letter-spacing .2s",
        }}
      >
        abrir →
      </span>
    </a>
  );
}
