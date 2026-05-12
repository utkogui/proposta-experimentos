import type { CSSProperties } from "react";
import {
  clientLogoAlt,
  clientLogoSrc,
  educationLogoSrc,
} from "@/lib/client-proof-logos";

type Variant = "default" | "education";

export function ClientsProofSection({
  files,
  variant = "default",
}: {
  files: string[];
  variant?: Variant;
}) {
  const education = variant === "education";
  const srcFor = (file: string) =>
    education ? educationLogoSrc(file) : clientLogoSrc(file);
  const altFor = (file: string) => clientLogoAlt(file);

  return (
    <section
      id="clientes"
      className={`fade-in clients-proof${education ? " clients-proof--education" : ""}`}
      aria-labelledby="clients-proof-heading"
    >
      <div className="clients-proof__layout">
        <header className="clients-proof__intro">
          <span className="section-label">
            {education ? "Confiança · Educação" : "Confiança"}
          </span>
          <h2 id="clients-proof-heading">
            {education
              ? "Quem confia na Matilha no ecossistema educacional"
              : "Quem já correu com a Matilha"}
          </h2>
          <p className="lead clients-proof__lead">
            {education ? (
              <>
                Placeholder: vitrine de marcas de ensino e instituições — editoras, redes,
                universidades e conselhos profissionais. Substitua os SVGs em{" "}
                <code className="clients-proof__inline-code">public/logo2-educacao</code>{" "}
                quando as logos oficiais estiverem prontas.
              </>
            ) : (
              <>
                Do ecossistema público ao entretenimento digital — unimos estratégia,
                design e execução técnica para marcas que precisam ir além do template.
              </>
            )}
          </p>

          <ul className="clients-proof__metrics" aria-label="Indicadores do estúdio">
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">
                {education ? "K12 ao EAD" : "Desde 2012"}
              </span>
              <span className="clients-proof__metric-label">
                {education
                  ? "produto e conteúdo educacional"
                  : "estúdio independente"}
              </span>
            </li>
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">
                {education ? "Redes & editoras" : "8 países"}
              </span>
              <span className="clients-proof__metric-label">
                {education
                  ? "projetos multi-unidade (placeholder)"
                  : "projetos entregues"}
              </span>
            </li>
            <li className="clients-proof__metric">
              <span className="clients-proof__metric-value">
                {education ? "WCAG & LGPD" : "Multidisciplinar"}
              </span>
              <span className="clients-proof__metric-label">
                {education
                  ? "experiência acessível e governança"
                  : "produto, marca e tech"}
              </span>
            </li>
          </ul>
        </header>

        <div className="clients-proof__panel">
          <p className="clients-proof__panel-caption">
            {education
              ? "Logos provisórios — animação destaca apenas esta grade educacional até incluir assets finais."
              : "Algumas organizações com quem trabalhamos — seleção representativa; outros projetos permanecem sob confidencialidade."}
          </p>
          {files.length === 0 ? (
            process.env.NODE_ENV === "development" ? (
              <p className="clients-proof__empty">
                {education ? (
                  <>
                    Nenhum SVG em <code>public/logo2-educacao</code>. Adicione os arquivos
                    ou rode o projeto após copiar os placeholders.
                  </>
                ) : (
                  <>
                    Nenhum logo em <code>public/logo2</code>. Rode{" "}
                    <code>npm run sync:logo2</code> na pasta do app para copiar de{" "}
                    <code>monorepo/logo2</code>.
                  </>
                )}
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
                      src={srcFor(file)}
                      alt={altFor(file)}
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
