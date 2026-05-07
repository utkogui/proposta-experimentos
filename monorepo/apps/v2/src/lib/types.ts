import { z } from "zod";

/**
 * Schema da Proposta. Cada cliente tem um JSON desse formato persistido.
 * Mudanças aqui podem invalidar propostas existentes — sempre prefira
 * adicionar campos opcionais a remover/renomear campos em produção.
 */

const Aspect = z.object({
  valor: z.string(),
  label: z.string(),
});

const Card = z.object({
  label: z.string(),
  titulo: z.string(),
  descricao: z.string().default(""),
  itens: z.array(z.string()).default([]),
});

const Step = z.object({
  titulo: z.string(),
  descricao: z.string(),
});

const Pilar = z.object({
  label: z.string(),
  titulo: z.string(),
  descricao: z.string(),
});

const CronogramaRow = z.object({
  label: z.string(),
  marks: z.array(z.boolean()),
  star: z.number().int().nullable().default(null),
});

const CronogramaPhase = z.object({
  nome: z.string(),
  rows: z.array(CronogramaRow),
});

const Stat = z.object({
  label: z.string(),
  valor: z.string(),
});

const Membro = z.object({
  label: z.string(),
  titulo: z.string(),
  descricao: z.string(),
});

const InvestBloco = z.object({
  label: z.string(),
  titulo: z.string(),
  preco: z.string(),
  sufixoPreco: z.string().default(""),
  pagamento: z.string(),
});

const Bridge = z.object({
  palavra: z.string(),
  caption: z.string(),
  index: z.string(),
  numero: z.string(),
});

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

const SectionKey = z.enum(PROPOSTA_SECTION_KEYS);

export function normalizeSectionOrder(
  order?: PropostaSectionKey[]
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

export const PropostaSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),

  cliente: z.object({
    nome: z.string(),
    contato: z.string(),
    logoUrl: z.string().default(""),
    logoBg: z.string().default(""),
  }),

  proposta: z.object({
    numero: z.string(),
    projeto: z.string(),
    data: z.string(),
    cidade: z.string(),
    label: z.string(),
  }),

  hero: z.object({
    titulo: z.string(),
    tituloAccent: z.string(),
    subtitulo: z.string(),
  }),

  aspects: z.array(Aspect).default([]),

  sectionOrder: z.array(SectionKey).default([...PROPOSTA_SECTION_KEYS]),

  solucao: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    cards: z.array(Card).default([]),
  }),

  objetivo: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    pilares: z.array(Pilar).default([]),
    headingConexao: z.string().default(""),
    leadConexao: z.string().default(""),
    callout: z.string().default(""),
  }),

  imersao: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    callout: z.string().default(""),
    steps: z.array(Step).default([]),
  }),

  cronograma: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    nota: z.string().default(""),
    columns: z.array(z.string()),
    phases: z.array(CronogramaPhase).default([]),
  }),

  equipe: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    membros: z.array(Membro).default([]),
  }),

  historico: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    stats: z.array(Stat).default([]),
  }),

  investimento: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    lead: z.string(),
    blocos: z.array(InvestBloco).default([]),
    totalLabel: z.string(),
    totalPreco: z.string(),
    observacoes: z
      .object({
        titulo: z.string().default("Observações"),
        texto: z.string().default(""),
        itens: z.array(z.string()).default([]),
      })
      .default({ titulo: "Observações", texto: "", itens: [] }),
  }),

  proximos: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    steps: z.array(Step).default([]),
  }),

  bridges: z
    .object({
      objetivo: Bridge,
      imersao: Bridge,
      cronograma: Bridge,
      equipe: Bridge,
      historico: Bridge,
      investimento: Bridge,
      proximos: Bridge,
    })
    .partial()
    .default({}),

  metadata: z.object({
    criadoEm: z.string(),
    atualizadoEm: z.string(),
  }),
});

export type Proposta = z.infer<typeof PropostaSchema>;
export type PropostaInput = z.input<typeof PropostaSchema>;

/** Resumo usado na lista do admin. */
export interface PropostaSummary {
  slug: string;
  clienteNome: string;
  projeto: string;
  numero: string;
  atualizadoEm: string;
}
