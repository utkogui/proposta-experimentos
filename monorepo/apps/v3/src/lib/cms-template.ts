import {
  normalizeSectionOrder,
  PROPOSTA_SECTION_KEYS,
  type PropostaSectionKey,
} from "./proposta-sections";

export type CmsTemplateId = "v1" | "v2" | "v3" | "v4";

export const CMS_TEMPLATE_COOKIE = "cms_template";

/** Propagado pelo middleware para os layouts no mesmo request. */
export const CMS_TEMPLATE_HEADER = "x-cms-template";

const ALLOWED: ReadonlySet<CmsTemplateId> = new Set(["v1", "v2", "v3", "v4"]);

/** v4: página institucional (educação / prospects) — sem blocos comerciais numerados 01–04 e 07. */
export const V4_FORCED_HIDDEN_SECTIONS: ReadonlySet<PropostaSectionKey> =
  new Set([
    "solucao",
    "objetivo",
    "imersao",
    "cronograma",
    "investimento",
  ]);

/** v4: substitui o rótulo de “Próximos passos” no nav e na seção. */
export const V4_PROXIMOS_PUBLIC_LABEL = "Método Matilha de trabalho";

function envDefault(): CmsTemplateId {
  const raw = process.env.CMS_DEFAULT_TEMPLATE?.trim().toLowerCase();
  if (raw === "v1" || raw === "v2" || raw === "v3" || raw === "v4") return raw;
  return "v3";
}

function normalizeHost(raw: string): string {
  return raw.split(":")[0]?.trim().toLowerCase() ?? "";
}

/**
 * Extrai o primeiro rótulo de host para localhost (ex.: v2.localhost → v2).
 */
function subdomainLocalhost(host: string): string | null {
  if (!host.endsWith(".localhost")) return null;
  const parts = host.split(".").filter(Boolean);
  if (parts.length < 2) return null;
  const sub = parts[0];
  return sub === "localhost" ? null : sub;
}

/**
 * Para domínios tipo v3.seudominio.com → v3; apex (seudominio.com) → null.
 */
function subdomainProduction(host: string): string | null {
  const parts = host.split(".").filter(Boolean);
  if (parts.length < 3) return null;
  return parts[0] ?? null;
}

function coerceTemplate(label: string | null): CmsTemplateId | null {
  if (!label) return null;
  const key = label.trim().toLowerCase();
  return ALLOWED.has(key as CmsTemplateId) ? (key as CmsTemplateId) : null;
}

/** Secções ocultas só pelo template (somando `sectionHidden` do JSON). */
export function templateForcedHiddenSections(
  template: CmsTemplateId,
): ReadonlySet<PropostaSectionKey> {
  if (template === "v4") return V4_FORCED_HIDDEN_SECTIONS;
  return new Set();
}

export function visibleSectionsForTemplate(
  template: CmsTemplateId,
  sectionOrder: PropostaSectionKey[] | undefined,
  sectionHidden: PropostaSectionKey[] | undefined,
): PropostaSectionKey[] {
  const forced = templateForcedHiddenSections(template);
  const fromDoc = (sectionHidden ?? []).filter((k) =>
    PROPOSTA_SECTION_KEYS.includes(k as PropostaSectionKey),
  ) as PropostaSectionKey[];
  const hidden = new Set<PropostaSectionKey>([...forced, ...fromDoc]);
  return normalizeSectionOrder(sectionOrder).filter((k) => !hidden.has(k));
}

export function sectionPublicNavLabel(
  template: CmsTemplateId,
  key: PropostaSectionKey,
  fallback: string,
): string {
  if (template === "v4" && key === "proximos") return V4_PROXIMOS_PUBLIC_LABEL;
  return fallback;
}

/**
 * Ordem: query `cms_template` → subdomínio no host (v4.localhost / v4.seudominio.com) →
 * cookie `cms_template` (útil em *.up.railway.app sem subdomínio) → `CMS_DEFAULT_TEMPLATE` / v3.
 */
export function resolveCmsTemplate(opts: {
  hostHeader: string;
  queryTemplate?: string | null;
  cookieTemplate?: string | null;
}): CmsTemplateId {
  const fromQuery = coerceTemplate(opts.queryTemplate ?? null);
  if (fromQuery) return fromQuery;

  const host = normalizeHost(opts.hostHeader);
  if (host) {
    const fromLocal = coerceTemplate(subdomainLocalhost(host));
    if (fromLocal) return fromLocal;
    const fromProd = coerceTemplate(subdomainProduction(host));
    if (fromProd) return fromProd;
  }

  const fromCookie = coerceTemplate(opts.cookieTemplate ?? null);
  if (fromCookie) return fromCookie;

  return envDefault();
}

/**
 * Define o template só a partir do Host (sem query nem cookie).
 * Preferir `resolveCmsTemplate` no middleware.
 */
export function resolveTemplateFromHost(hostHeader: string): CmsTemplateId {
  return resolveCmsTemplate({
    hostHeader,
    queryTemplate: null,
    cookieTemplate: null,
  });
}

export function parseTemplateCookie(value: string | undefined): CmsTemplateId {
  return coerceTemplate(value ?? "") ?? envDefault();
}
