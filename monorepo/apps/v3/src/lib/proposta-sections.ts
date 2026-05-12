/**
 * Ordem e rótulos das secções — sem Zod nem schema.
 * Usado pelo middleware (cms-template) sem puxar dependências pesadas para o Edge.
 */

export const PROPOSTA_SECTION_KEYS = [
  "solucao",
  "objetivo",
  "imersao",
  "cronograma",
  "equipe",
  "historico",
  "investimento",
  "proximos",
] as const;

export type PropostaSectionKey = (typeof PROPOSTA_SECTION_KEYS)[number];

export const PROPOSTA_SECTION_LABELS: Record<PropostaSectionKey, string> = {
  solucao: "Solução",
  objetivo: "Objetivo",
  imersao: "Imersão",
  cronograma: "Cronograma",
  equipe: "Equipe",
  historico: "Histórico",
  investimento: "Investimento",
  proximos: "Próximos passos",
};

export function normalizeSectionOrder(
  order?: PropostaSectionKey[],
): PropostaSectionKey[] {
  const seen = new Set<PropostaSectionKey>();
  const valid = (order ?? []).filter((key): key is PropostaSectionKey => {
    if (!PROPOSTA_SECTION_KEYS.includes(key)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [
    ...valid,
    ...PROPOSTA_SECTION_KEYS.filter((key) => !seen.has(key)),
  ];
}

/** Secções visíveis respeitando ordem e `sectionHidden` do documento. */
export function visibleSectionKeys(
  sectionOrder: PropostaSectionKey[] | undefined,
  sectionHidden: PropostaSectionKey[] | undefined,
): PropostaSectionKey[] {
  const hidden = new Set(
    (sectionHidden ?? []).filter((k) =>
      PROPOSTA_SECTION_KEYS.includes(k as PropostaSectionKey),
    ) as PropostaSectionKey[],
  );
  return normalizeSectionOrder(sectionOrder).filter((k) => !hidden.has(k));
}
