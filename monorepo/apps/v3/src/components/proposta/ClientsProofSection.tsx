import type { CSSProperties } from "react";
import {
  clientLogoAlt,
  clientLogoSrc,
} from "@/lib/client-proof-logos";

export function ClientsProofSection({ files }: { files: string[] }) {
  return (
    <section
      id="clientes"
      className="fade-in clients-proof"
      aria-labelledby="clients-proof-heading"
    >
      <div className="clients-proof__layout">
        <header className="clients-proof__intro">
          <span className="section-label">Confiança</span>
          <h2 id="clients-proof-heading">
            Quem já correu com a Matilha
          </h2>
          <p className="lead clients-proof__lead">
            Do ecossistema público ao entretenimento digital — unimos estratégia,
            design e execução técnica para marcas que precisam ir além do template.
          </p>

          <ul className="clients-proof__metrics" aria-label="Indicadores do estúdio">
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">Desde 2012</span>
              <span className="clients-proof__metric-label">
                estúdio independente
              </span>
            </li>
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">8 países</span>
              <span className="clients-proof__metric-label">
                projetos entregues
              </span>
            </li>
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">Multidisciplinar</span>
              <span className="clients-proof__metric-label">
                produto, marca e tech
              </span>
            </li>
          </ul>
        </header>

        <div className="clients-proof__panel">
          <p className="clients-proof__panel-caption">
            Algumas organizações com quem trabalhamos — seleção representativa;
            outros projetos permanecem sob confidencialidade.
          </p>
          {files.length === 0 ? (
            process.env.NODE_ENV === "development" ? (
              <p className="clients-proof__empty">
                Nenhum logo em <code>public/logo2</code>. Rode{" "}
                <code>npm run sync:logo2</code> na pasta do app para copiar de{" "}
                <code>monorepo/logo2</code>.
              </p>
            ) : null
          ) : (
          <div
            className="clients-proof__logo-grid"
            role="list"
            style={
              {
                "--logo-scan-count": files.length,
                "--logo-scan-duration": `${Math.max(14, files.length * 0.55)}s`,
              } as CSSProperties
            }
          >
            {files.map((file, i) => (
              <div
                key={file}
                className="clients-proof__logo-cell"
                role="listitem"
                style={
                  {
                    "--logo-enter-delay": `${Math.min(i, 48) * 42}ms`,
                    "--logo-float-delay": `${(i % 17) * 0.35}s`,
                    "--logo-scan-index": i,
                  } as CSSProperties
                }
              >
                <span className="clients-proof__logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="clients-proof__logo-img"
                    src={clientLogoSrc(file)}
                    alt={clientLogoAlt(file)}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
