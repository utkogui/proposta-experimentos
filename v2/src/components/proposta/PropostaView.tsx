import {
  PROPOSTA_SECTION_LABELS,
  normalizeSectionOrder,
  type Proposta,
  type PropostaSectionKey,
} from "@/lib/types";
import { PropostaScripts } from "./PropostaScripts";

const HERO_BG_URL = "/hero_final.gif";

/* ─── Global Reach Block ────────────────────────────────────────────── */
const GR_PAISES = [
  "Argentina", "França",
  "Brasil", "Inglaterra",
  "Coréia do Sul", "Israel",
  "EUA", "Alemanha",
];

// viewBox 0 0 300 200 — Mercator: x=(lon+180)/360*300, y=(90-lat)/180*200
const GR_COUNTRIES: Array<{ name: string; cx: number; cy: number }> = [
  { name: "EUA",           cx: 68,  cy: 56  },
  { name: "Brasil",        cx: 111, cy: 126 },
  { name: "Argentina",     cx: 101, cy: 138 },
  { name: "França",        cx: 152, cy: 46  },
  { name: "Inglaterra",    cx: 150, cy: 43  },
  { name: "Alemanha",      cx: 161, cy: 42  },
  { name: "Israel",        cx: 179, cy: 65  },
  { name: "Coréia do Sul", cx: 256, cy: 58  },
];

const GR_ESCRITORIOS: Array<{ nome: string; cx: number; cy: number }> = [
  { nome: "Escritório EUA",    cx: 68,  cy: 56  },
  { nome: "Escritório Brasil", cx: 111, cy: 126 },
];

// Arcos do Brasil para cada país: Q = ponto de controle para curvar elegante
// Brasil = (111, 126)
const GR_ROUTES: Array<{ d: string; len: number }> = [
  // → EUA (noroeste, curva pela costa)
  { d: "M111 126 Q62 100 68 56",    len: 110 },
  // → Argentina (sul, pequena curva)
  { d: "M111 126 Q118 136 101 138", len:  30 },
  // → França (nordeste, arco atlântico)
  { d: "M111 126 Q95 48 152 46",    len: 135 },
  // → Inglaterra (nordeste, acima da França)
  { d: "M111 126 Q92 44 150 43",    len: 138 },
  // → Alemanha (nordeste, controle central)
  { d: "M111 126 Q96 42 161 42",    len: 145 },
  // → Israel (leste + norte, arco sobre Mediterrâneo)
  { d: "M111 126 Q118 48 179 65",   len: 120 },
  // → Coréia do Sul (grande arco transoceânico pelo norte)
  { d: "M111 126 Q170 18 256 58",   len: 220 },
];

/* ─── Logo Matilha animado ──────────────────────────────────────────────── */
function MatilhaLogo() {
  return (
    <svg
      className="brand-logo"
      viewBox="0 0 337 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Matilha"
    >
      {/* 1. Borda: rect com stroke que se desenha (perímetro ≈ 823) */}
      <rect
        className="brand-border"
        x="0.9" y="0.9" width="335.2" height="76.2"
        fill="none" stroke="white" strokeWidth="1.8"
      />

      {/* 2. M mark — aparece após a borda fechar */}
      <path
        className="brand-m"
        d="M31.8403 36.7447H32.1065L36.5863 49.7587H42.1385L46.6488 36.7447H46.9378V51.4807H51.448V27.3043H45.5611L39.6666 44.4327H39.1114L33.2245 27.3043H27.3148V51.4807H31.8403V36.7447Z"
        fill="white"
      />

      {/* 3. Separador + "Matilha estudio" — aparece por último */}
      <g className="brand-text" fill="white">
        <path d="M78.0425 15.9553H79.8162V62.0462H78.0425V15.9553Z"/>
        <path d="M128.725 29.6427V50.0057H124.97V36.4789H124.737L119.673 47.6785H115.802L110.708 36.4789H110.476V50.0057H106.721V29.6427H111.436L117.636 43.6059H117.868L124.039 29.6427H128.725Z"/>
        <path d="M146.252 47.2131H146.601V50.0057H145.029C143.496 50.0057 142.516 49.4239 142.09 48.2603C141.022 49.6179 139.422 50.2966 137.287 50.2966C135.735 50.2966 134.483 49.9378 133.533 49.2203C132.601 48.4833 132.135 47.4167 132.135 46.0204C132.135 44.7016 132.572 43.6738 133.445 42.9368C134.338 42.1805 135.502 41.7345 136.938 41.5987L141.478 41.1333V40.5224C141.478 39.7466 141.255 39.1551 140.809 38.7479C140.363 38.3406 139.771 38.137 139.034 38.137C137.539 38.137 136.666 38.8642 136.414 40.3187H132.688C132.844 38.7673 133.484 37.5261 134.609 36.5952C135.735 35.645 137.21 35.1698 139.034 35.1698C140.857 35.1698 142.342 35.645 143.487 36.5952C144.632 37.5261 145.204 38.9224 145.204 40.7842V46.1077C145.204 46.8446 145.553 47.2131 146.252 47.2131ZM141.478 44.3913V43.6932L138.219 44.0423C136.647 44.2168 135.861 44.8277 135.861 45.8749C135.861 46.9222 136.55 47.4458 137.927 47.4458C138.859 47.4458 139.684 47.2034 140.401 46.7185C141.119 46.2143 141.478 45.4386 141.478 44.3913Z"/>
        <path d="M154.644 50.2966C151.617 50.2966 150.104 48.8809 150.104 46.0495V38.3988H146.989V35.4607H147.979C148.872 35.4607 149.502 35.2959 149.871 34.9662C150.259 34.6171 150.453 34.045 150.453 33.2499V31.5045H153.829V35.4607H157.642V38.3988H153.829V45.5549C153.829 45.8846 153.858 46.1658 153.917 46.3986C153.994 46.6313 154.188 46.8543 154.499 47.0676C154.809 47.2616 155.236 47.3585 155.779 47.3585C156.226 47.3585 156.701 47.2906 157.205 47.1549V49.9766C156.274 50.19 155.42 50.2966 154.644 50.2966Z"/>
        <path d="M161.755 33.599C161.134 33.599 160.59 33.3759 160.125 32.9299C159.678 32.4838 159.455 31.9602 159.455 31.359C159.455 30.719 159.678 30.1857 160.125 29.7591C160.59 29.313 161.134 29.09 161.755 29.09C162.376 29.09 162.899 29.313 163.326 29.7591C163.773 30.1857 163.996 30.719 163.996 31.359C163.996 31.9602 163.773 32.4838 163.326 32.9299C162.88 33.3759 162.356 33.599 161.755 33.599ZM159.892 50.0057V35.4607H163.617V50.0057H159.892Z"/>
        <path d="M166.856 50.0057V29.3518H170.581V50.0057H166.856Z"/>
        <path d="M182.056 35.1698C183.803 35.1698 185.18 35.7031 186.189 36.7698C187.218 37.8364 187.732 39.3103 187.732 41.1914V50.0057H184.006V41.9478C184.006 40.8036 183.715 39.9309 183.133 39.3297C182.551 38.7091 181.804 38.3988 180.892 38.3988C179.941 38.3988 179.146 38.7188 178.505 39.3588C177.865 39.9794 177.545 40.9005 177.545 42.1223V50.0057H173.819V29.3518H177.545V37.177H177.778C178.806 35.8389 180.232 35.1698 182.056 35.1698Z"/>
        <path d="M204.899 47.4458C205.21 47.4458 205.539 47.3876 205.889 47.2713V49.8312C205.307 50.0445 204.657 50.1512 203.939 50.1512C202.153 50.1512 200.97 49.4918 200.388 48.173C199.34 49.5888 197.72 50.2966 195.527 50.2966C193.975 50.2966 192.723 49.9378 191.772 49.2203C190.841 48.4833 190.375 47.4167 190.375 46.0204C190.375 44.7016 190.812 43.6738 191.685 42.9368C192.578 42.1805 193.742 41.7345 195.178 41.5987L199.718 41.1333V40.5224C199.718 39.7466 199.495 39.1551 199.049 38.7479C198.603 38.3406 198.011 38.137 197.273 38.137C195.779 38.137 194.906 38.8642 194.654 40.3187H190.928C191.084 38.7673 191.724 37.5261 192.849 36.5952C193.975 35.645 195.449 35.1698 197.273 35.1698C199.097 35.1698 200.582 35.645 201.727 36.5952C202.871 37.5261 203.444 38.9224 203.444 40.7842V45.9331C203.444 46.9416 203.929 47.4458 204.899 47.4458ZM199.718 44.3913V43.6932L196.458 44.0423C194.887 44.2168 194.101 44.8277 194.101 45.8749C194.101 46.9222 194.79 47.4458 196.167 47.4458C197.099 47.4458 197.923 47.2034 198.641 46.7185C199.359 46.2143 199.718 45.4386 199.718 44.3913Z"/>
        <path d="M218.94 46.6604H229.127V50.0057H215.185V29.6427H228.836V32.9881H218.94V38.0497H227.468V41.3078H218.94V46.6604Z"/>
        <path d="M237.687 50.2966C235.688 50.2966 234.136 49.8603 233.03 48.9876C231.924 48.0955 231.322 46.8834 231.225 45.3513H234.805C234.999 46.8058 235.95 47.5331 237.658 47.5331C238.279 47.5331 238.783 47.4167 239.171 47.184C239.579 46.9319 239.782 46.5537 239.782 46.0495C239.782 45.5259 239.569 45.1283 239.142 44.8568C238.735 44.5659 238.094 44.3041 237.221 44.0714L235.853 43.7223C235.271 43.5865 234.767 43.4411 234.34 43.2859C233.932 43.1114 233.505 42.8787 233.059 42.5878C232.613 42.2775 232.273 41.8799 232.04 41.3951C231.808 40.8909 231.691 40.2994 231.691 39.6206C231.691 38.2243 232.215 37.1382 233.263 36.3625C234.311 35.5674 235.601 35.1698 237.134 35.1698C238.997 35.1698 240.423 35.5868 241.412 36.4207C242.402 37.2546 242.955 38.3212 243.071 39.6206H239.491C239.336 38.4958 238.56 37.9334 237.163 37.9334C236.581 37.9334 236.115 38.0691 235.766 38.3406C235.417 38.5927 235.242 38.9515 235.242 39.417C235.242 39.8824 235.417 40.2218 235.766 40.4351C236.135 40.629 236.755 40.8424 237.629 41.0751L238.997 41.4242C240.394 41.7732 241.461 42.2969 242.198 42.995C242.955 43.6932 243.333 44.6822 243.333 45.9622C243.333 47.3973 242.8 48.4833 241.733 49.2203C240.685 49.9378 239.336 50.2966 237.687 50.2966Z"/>
        <path d="M251.881 50.2966C248.854 50.2966 247.341 48.8809 247.341 46.0495V38.3988H244.226V35.4607H245.216C246.108 35.4607 246.739 35.2959 247.108 34.9662C247.496 34.6171 247.69 34.045 247.69 33.2499V31.5045H251.066V35.4607H254.879V38.3988H251.066V45.5549C251.066 45.8846 251.095 46.1658 251.153 46.3986C251.231 46.6313 251.425 46.8543 251.736 47.0676C252.046 47.2616 252.473 47.3585 253.016 47.3585C253.463 47.3585 253.938 47.2906 254.442 47.1549V49.9766C253.511 50.19 252.657 50.2966 251.881 50.2966Z"/>
        <path d="M264.786 29.6427H267.929L265.426 33.8608H262.574L264.786 29.6427ZM270.956 35.4607V50.0057H267.551L267.231 48.2894H266.998C265.969 49.6275 264.543 50.2966 262.719 50.2966C260.973 50.2966 259.585 49.7633 258.557 48.6967C257.548 47.63 257.044 46.1561 257.044 44.275V35.4607H260.769V43.5186C260.769 44.6629 261.06 45.5452 261.642 46.1658C262.224 46.767 262.981 47.0676 263.912 47.0676C264.863 47.0676 265.649 46.7573 266.27 46.1367C266.91 45.4968 267.231 44.5659 267.231 43.3441V35.4607H270.956Z"/>
        <path d="M284.694 29.3518H288.42V50.0057H285.393L285.073 48.2894H284.811C283.802 49.6275 282.356 50.2966 280.474 50.2966C278.495 50.2966 276.855 49.5985 275.555 48.2021C274.274 46.8058 273.634 44.9731 273.634 42.7041C273.634 40.3963 274.284 38.5637 275.584 37.2061C276.884 35.8486 278.514 35.1698 280.474 35.1698C282.298 35.1698 283.705 35.7225 284.694 36.8279V29.3518ZM278.378 45.8749C279.057 46.6701 279.95 47.0676 281.056 47.0676C282.162 47.0676 283.045 46.6701 283.705 45.8749C284.364 45.0798 284.694 44.0229 284.694 42.7041C284.694 41.4242 284.364 40.3866 283.705 39.5915C283.045 38.7964 282.162 38.3988 281.056 38.3988C279.95 38.3988 279.057 38.7964 278.378 39.5915C277.699 40.3866 277.36 41.4242 277.36 42.7041C277.36 44.0035 277.699 45.0604 278.378 45.8749Z"/>
        <path d="M293.526 33.599C292.905 33.599 292.362 33.3759 291.896 32.9299C291.45 32.4838 291.227 31.9602 291.227 31.359C291.227 30.719 291.45 30.1857 291.896 29.7591C292.362 29.313 292.905 29.09 293.526 29.09C294.147 29.09 294.671 29.313 295.098 29.7591C295.544 30.1857 295.767 30.719 295.767 31.359C295.767 31.9602 295.544 32.4838 295.098 32.9299C294.652 33.3759 294.128 33.599 293.526 33.599ZM291.663 50.0057V35.4607H295.389V50.0057H291.663Z"/>
        <path d="M305.733 50.2966C303.54 50.2966 301.707 49.5888 300.232 48.173C298.777 46.7379 298.049 44.915 298.049 42.7041C298.049 40.4933 298.777 38.6897 300.232 37.2934C301.687 35.8777 303.521 35.1698 305.733 35.1698C307.945 35.1698 309.779 35.8777 311.234 37.2934C312.689 38.6897 313.417 40.4933 313.417 42.7041C313.417 44.9344 312.689 46.7573 311.234 48.173C309.779 49.5888 307.945 50.2966 305.733 50.2966ZM305.733 47.0676C306.917 47.0676 307.877 46.6507 308.615 45.8168C309.352 44.9828 309.721 43.9453 309.721 42.7041C309.721 41.4823 309.352 40.4642 308.615 39.6497C307.877 38.8158 306.917 38.3988 305.733 38.3988C304.549 38.3988 303.589 38.8158 302.852 39.6497C302.134 40.4642 301.775 41.4823 301.775 42.7041C301.775 43.9453 302.143 44.9828 302.881 45.8168C303.618 46.6507 304.569 47.0676 305.733 47.0676Z"/>
      </g>
    </svg>
  );
}

function GlobalReachBlock() {
  return (
    <section id="alcance" className="fade-in global-reach">
      <div className="global-reach__inner">
        <span className="section-label global-reach__label">Presença Global</span>

        {/* ─── Left ─── */}
        <div className="global-reach__left">
          <h2 className="global-reach__heading">
            Nosso trabalho<br />não tem fronteiras
          </h2>

          <div className="global-reach__badge">
            <span className="global-reach__badge-label">
              Países que já realizamos projetos
            </span>
            <span className="global-reach__badge-num">8</span>
          </div>

          <ul className="global-reach__list">
            {GR_PAISES.map((name, i) => (
              <li key={name} style={{ "--i": i } as React.CSSProperties}>
                <span className="global-reach__star" aria-hidden="true">✦</span>
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Map ─── */}
        <div className="global-reach__map-wrap">

          {/* Base dot-map (inverted to white on dark) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/1019996_OJO4YQ1.svg"
            alt=""
            aria-hidden="true"
            className="global-reach__basemap"
          />

          {/* SVG overlay — same viewBox as source map */}
          <svg
            className="global-reach__overlay"
            viewBox="0 0 300 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <filter id="gr-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Rotas do Brasil para cada país */}
            {GR_ROUTES.map((r, i) => (
              <path
                key={i}
                className="global-reach__route"
                d={r.d}
                fill="none"
                style={{
                  "--ri": i,
                  "--rlen": r.len,
                } as React.CSSProperties}
              />
            ))}

            {/* Country glow spots */}
            {GR_COUNTRIES.map((c, i) => (
              <circle
                key={c.name}
                className="global-reach__country-spot"
                cx={c.cx}
                cy={c.cy}
                r="4"
                style={{ "--ci": i } as React.CSSProperties}
              />
            ))}

            {/* Office dots (larger, on top) */}
            {GR_ESCRITORIOS.map((e, i) => (
              <circle
                key={e.nome}
                className="global-reach__dot"
                cx={e.cx}
                cy={e.cy}
                r="3.5"
                style={{ "--mi": i } as React.CSSProperties}
              />
            ))}
          </svg>

          {/* HTML labels for offices */}
          {GR_ESCRITORIOS.map((e, i) => (
            <div
              key={e.nome}
              className="global-reach__pin"
              style={{
                left: `${(e.cx / 300) * 100}%`,
                top:  `${(e.cy / 200) * 100}%`,
                "--mi": i,
              } as React.CSSProperties}
            >
              <span className="global-reach__pin-pulse" aria-hidden="true" />
              <span className="global-reach__pin-label">{e.nome}</span>
            </div>
          ))}

          {/* Hover tooltips for country spots */}
          {GR_COUNTRIES.map((c, i) => (
            <div
              key={`ctip-${c.name}`}
              className="global-reach__country-pin"
              style={{
                left: `${(c.cx / 300) * 100}%`,
                top:  `${(c.cy / 200) * 100}%`,
                "--ci": i,
              } as React.CSSProperties}
            >
              <span className="global-reach__country-label">{c.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

const LOADER_BLOCKS = Array.from({ length: 10 }, (_, i) => i);
const LOADER_GRID_VERTICAL = Array.from({ length: 11 }, (_, i) => i);
const LOADER_GRID_HORIZONTAL = Array.from({ length: 5 }, (_, i) => i);
const LOADER_MATILHA_LOGO_URL = "/02-logo-matilha-full.svg";
const LOADER_CLIENT_LOGO_URL = "/03%20-ciee-logo.svg";


export function PropostaView({ data: p }: { data: Proposta }) {
  const orderedSections = normalizeSectionOrder(p.sectionOrder);

  return (
    <>
      <div className="proposal-loader" id="proposal-loader" aria-hidden="true">
        <div className="proposal-loader__blocks">
          {LOADER_BLOCKS.map((block) => (
            <span className="proposal-loader__block" key={block} />
          ))}
        </div>
        <svg
          className="proposal-loader__grid"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g className="proposal-loader__grid-v">
            {LOADER_GRID_VERTICAL.map((i) => (
              <line
                key={`v${i}`}
                x1={(i + 1) * 100}
                y1={0}
                x2={(i + 1) * 100}
                y2={600}
                style={{ animationDelay: `${0.15 + i * 0.045}s` }}
              />
            ))}
          </g>
          <g className="proposal-loader__grid-h">
            {LOADER_GRID_HORIZONTAL.map((i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={(i + 1) * 100}
                x2={1200}
                y2={(i + 1) * 100}
                style={{ animationDelay: `${0.55 + i * 0.06}s` }}
              />
            ))}
          </g>
        </svg>
        <div className="proposal-loader__corner proposal-loader__corner--tl" aria-hidden="true" />
        <div className="proposal-loader__corner proposal-loader__corner--tr" aria-hidden="true" />
        <div className="proposal-loader__corner proposal-loader__corner--bl" aria-hidden="true" />
        <div className="proposal-loader__corner proposal-loader__corner--br" aria-hidden="true" />
        <div className="proposal-loader__greeting" aria-hidden="true">
          <span className="proposal-loader__greeting-label">Proposta para</span>
          <span className="proposal-loader__greeting-client">{p.cliente.nome}</span>
        </div>
        <div className="proposal-loader__inner">
          <div className="proposal-loader__lockup">
            <div className="proposal-loader__brand proposal-loader__brand--matilha">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOADER_MATILHA_LOGO_URL}
                alt="Matilha"
                className="proposal-loader__logo"
              />
              <span className="proposal-loader__brand-tag">Matilha</span>
            </div>
            <span className="proposal-loader__connector" aria-hidden="true">
              ×
            </span>
            <div className="proposal-loader__brand proposal-loader__brand--client">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOADER_CLIENT_LOGO_URL}
                alt={p.cliente.nome}
                className="proposal-loader__logo"
              />
              <span className="proposal-loader__brand-tag">{p.cliente.nome}</span>
            </div>
          </div>
          <div className="proposal-loader__info">
            <div className="proposal-loader__meta">
              <span className="proposal-loader__meta-label">Proposta</span>
              <span className="proposal-loader__meta-line">
                <span>{p.proposta.numero}</span>
                <span className="proposal-loader__meta-sep" aria-hidden="true">·</span>
                <span>{p.proposta.cidade.toUpperCase()}</span>
                <span className="proposal-loader__meta-sep" aria-hidden="true">·</span>
                <span>{p.proposta.data.toUpperCase()}</span>
              </span>
            </div>
            <div className="proposal-loader__status" aria-live="polite">
              <span className="proposal-loader__status-dot" aria-hidden="true" />
              <span
                className="proposal-loader__status-text"
                id="proposal-loader-status"
              >
                Carregando proposta
              </span>
              <span className="proposal-loader__status-dots" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav>
        <a className="brand" href="https://matilha.digital/" target="_blank" rel="noopener noreferrer">
          <MatilhaLogo />
        </a>
        <div className="nav-links">
          {orderedSections.map((key) => (
            <a href={`#${key}`} key={key}>
              {PROPOSTA_SECTION_LABELS[key]}
            </a>
          ))}
        </div>
      </nav>

      <section className="hero">
        <div
          className="hero-bg"
          id="hero-bg"
          aria-hidden="true"
          style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
        />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="triangle-accent" />
          <span className="section-label">{p.proposta.label}</span>
          <h1>
            {p.hero.titulo}
            {p.hero.tituloAccent && (
              <>
                {" "}
                <span className="accent">{p.hero.tituloAccent}</span>
              </>
            )}
          </h1>
          <p className="subtitle">{p.hero.subtitulo}</p>

          <div className="client-header">
            <div className="client-info">
              <div>
                <span className="field-label">Cliente</span>
                <span className="field-value client-name">
                  {p.cliente.nome}
                </span>
              </div>
              <div>
                <span className="field-label">Contato</span>
                <span className="field-value">{p.cliente.contato}</span>
              </div>
              <div>
                <span className="field-label">Proposta nº</span>
                <span className="field-value">{p.proposta.numero}</span>
              </div>
              <div>
                <span className="field-label">Projeto</span>
                <span className="field-value">{p.proposta.projeto}</span>
              </div>
            </div>
            {p.cliente.logoUrl && (
              <div
                className="client-logo-wrap"
                style={
                  p.cliente.logoBg
                    ? { background: p.cliente.logoBg }
                    : undefined
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cliente.logoUrl} alt={p.cliente.nome} />
              </div>
            )}
          </div>

          <p className="meta">
            Matilha Estúdio &nbsp;·&nbsp; {p.proposta.cidade} &nbsp;·&nbsp;{" "}
            {p.proposta.data}
          </p>

          {p.aspects.length > 0 && (
            <div className="aspects-box">
              {p.aspects.map((a, i) => (
                <div className="aspect-item" key={i}>
                  <div className="aspect-val">{a.valor}</div>
                  <div className="aspect-label">{a.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="divider" />

      {orderedSections.map((key) => (
        <SectionBlock key={key} sectionKey={key} data={p} />
      ))}

      <hr className="divider" />
      <GlobalReachBlock />

      <footer>
        <p className="contact-row">
          <a href="mailto:talk@matilha.digital">talk@matilha.digital</a>
        </p>
        <p
          className="contact-row"
          style={{ fontSize: "0.95rem", color: "var(--text-soft)" }}
        >
          +55 41 99737-6060
        </p>
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
          © 2012–2026 Matilha Estúdio de Design Ltda. · Proposta{" "}
          {p.proposta.numero} ·{" "}
          <span className="client-name">{p.cliente.nome}</span> ·{" "}
          {p.proposta.projeto}
        </p>
      </footer>

      <PropostaScripts />
    </>
  );
}

function SectionBlock({
  sectionKey,
  data: p,
}: {
  sectionKey: PropostaSectionKey;
  data: Proposta;
}) {
  return (
    <div className="section-group" data-section={sectionKey}>
      {sectionKey !== "solucao" && <hr className="divider" />}
      {renderSection(sectionKey, p)}
    </div>
  );
}

function renderSection(sectionKey: PropostaSectionKey, p: Proposta) {
  switch (sectionKey) {
    case "solucao":
      return (
        <section id="solucao" className="fade-in">
        <span className="section-label">{p.solucao.sectionLabel}</span>
        <h2>{p.solucao.heading}</h2>
        <p className="lead" style={{ marginBottom: "1.5rem" }}>
          {p.solucao.lead}
        </p>
        <div className="cards-2">
          {p.solucao.cards.map((c, i) => (
            <div className="card" key={i}>
              <div className="card-label">{c.label}</div>
              <h3>{c.titulo}</h3>
              {c.descricao && <p>{c.descricao}</p>}
              {c.itens.length > 0 && (
                <ul>
                  {c.itens.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
      );
    case "objetivo":
      return (
      <section id="objetivo" className="fade-in">
        <span className="section-label">{p.objetivo.sectionLabel}</span>
        <h2>{p.objetivo.heading}</h2>
        <p className="lead" style={{ marginBottom: "0.5rem" }}>
          {p.objetivo.lead}
        </p>
        <div
          className="pilares-grid"
          style={{
            gridTemplateColumns:
              p.objetivo.pilares.length % 2 === 0
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
          }}
        >
          {p.objetivo.pilares.map((pi, i) => (
            <div className="pilar" key={i}>
              <div className="pilar-name">{pi.label}</div>
              <h3>{pi.titulo}</h3>
              <p>{pi.descricao}</p>
            </div>
          ))}
        </div>

        {p.objetivo.headingConexao && (
          <h2 style={{ marginTop: "4rem" }}>{p.objetivo.headingConexao}</h2>
        )}
        {p.objetivo.leadConexao && (
          <p className="lead" style={{ marginBottom: "1rem" }}>
            {p.objetivo.leadConexao}
          </p>
        )}
        {p.objetivo.callout && (
          <p className="result-callout">{p.objetivo.callout}</p>
        )}
      </section>
      );
    case "imersao":
      return (
      <section id="imersao" className="fade-in">
        <span className="section-label">{p.imersao.sectionLabel}</span>
        <h2>{p.imersao.heading}</h2>
        <p className="lead" style={{ marginBottom: "1.5rem" }}>
          {p.imersao.lead}
        </p>
        {p.imersao.callout && (
          <p className="result-callout">{p.imersao.callout}</p>
        )}
        {p.imersao.steps.length > 0 && (
          <div className="steps" style={{ marginTop: "2.5rem" }}>
            {p.imersao.steps.map((s, i) => (
              <div className="step" key={i}>
                <span className="step-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="step-title">{s.titulo}</span>
                <span className="step-desc">{s.descricao}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      );
    case "cronograma":
      return (
      <section id="cronograma" className="fade-in">
        <span className="section-label">{p.cronograma.sectionLabel}</span>
        <h2>{p.cronograma.heading}</h2>
        <p className="lead" style={{ marginBottom: "1.5rem" }}>
          {p.cronograma.lead}
        </p>
        <div className="crono-scroll" aria-label="Cronograma da proposta">
          <table className="crono-table">
            <thead>
              <tr>
                <th>Etapa · Entregas-chave</th>
                {p.cronograma.columns.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.cronograma.phases.map((phase, pi) => (
                <Phase
                  key={pi}
                  phase={phase}
                  colsCount={p.cronograma.columns.length}
                />
              ))}
            </tbody>
          </table>
        </div>
        {p.cronograma.nota && <p className="nota">{p.cronograma.nota}</p>}
      </section>
      );
    case "equipe":
      return (
      <section id="equipe" className="fade-in">
        <span className="section-label">{p.equipe.sectionLabel}</span>
        <h2>{p.equipe.heading}</h2>
        <p className="lead" style={{ marginBottom: "0.5rem" }}>
          {p.equipe.lead}
        </p>
        <div className="cards-3">
          {p.equipe.membros.map((m, i) => (
            <div className="card" key={i}>
              <div className="card-label">{m.label}</div>
              <h3>{m.titulo}</h3>
              <p>{m.descricao}</p>
            </div>
          ))}
        </div>
      </section>
      );
    case "historico":
      return (
      <section id="historico" className="fade-in">
        <span className="section-label">{p.historico.sectionLabel}</span>
        <h2>{p.historico.heading}</h2>
        <p className="lead" style={{ marginBottom: "0.5rem" }}>
          {p.historico.lead}
        </p>
        <div
          className="stats-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(p.historico.stats.length, 5)}, 1fr)`,
          }}
        >
          {p.historico.stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.valor}</div>
            </div>
          ))}
        </div>
      </section>
      );
    case "investimento":
      return (
      <section id="investimento" className="fade-in">
        <span className="section-label">{p.investimento.sectionLabel}</span>
        <h2>{p.investimento.heading}</h2>
        <p className="lead" style={{ marginBottom: "1.25rem" }}>
          {p.investimento.lead}
        </p>
        <div className="invest-cards">
          {p.investimento.blocos.map((b, i) => (
            <div className="invest-card" key={i}>
              <div className="card-label">{b.label}</div>
              <h3>{b.titulo}</h3>
              <div className="price">
                {b.preco}
                {b.sufixoPreco && (
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    {b.sufixoPreco}
                  </span>
                )}
              </div>
              <p className="payment">{b.pagamento}</p>
            </div>
          ))}
        </div>

        <div className="invest-total">
          <span className="total-label">{p.investimento.totalLabel}</span>
          <span className="total-price">{p.investimento.totalPreco}</span>
        </div>

        <div className="obs-block">
          <h3>{p.investimento.observacoes.titulo}</h3>
          {p.investimento.observacoes.texto && (
            <p>{p.investimento.observacoes.texto}</p>
          )}
          {p.investimento.observacoes.itens.length > 0 && (
            <ul>
              {p.investimento.observacoes.itens.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
      );
    case "proximos":
      return (
      <section id="proximos" className="fade-in">
        <span className="section-label">{p.proximos.sectionLabel}</span>
        <h2>{p.proximos.heading}</h2>
        <div className="steps">
          {p.proximos.steps.map((s, i) => (
            <div className="step" key={i}>
              <span className="step-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="step-title">{s.titulo}</span>
              <span className="step-desc">{s.descricao}</span>
            </div>
          ))}
        </div>
      </section>
      );
  }
}

function Phase({
  phase,
  colsCount,
}: {
  phase: Proposta["cronograma"]["phases"][number];
  colsCount: number;
}) {
  return (
    <>
      <tr className="phase-row">
        <td colSpan={colsCount + 1}>{phase.nome}</td>
      </tr>
      {phase.rows.map((row, ri) => (
        <tr key={ri}>
          <td>{row.label}</td>
          {Array.from({ length: colsCount }).map((_, ci) => (
            <td key={ci}>
              {row.star === ci ? (
                <span className="crono-star">★</span>
              ) : row.marks[ci] ? (
                "●"
              ) : (
                ""
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
