/**
 * Cases em destaque para a página institucional de Educação (/p/educacao).
 * Banners e links são placeholders até haver cases publicados e logos definitivos.
 */

export type EducationSpotlightCard = {
  slug: string;
  /** Destino provisório — substituir por /cases/… quando existir página interna. */
  href: string;
  bannerUrl: string;
  spotlightKicker: string;
  title: string;
  titleAccent: string;
  spotlightLead: string;
  spotlightTags: readonly string[];
};

const EDU_BANNER = "/hero_final.gif";

export const EDUCATION_SPOTLIGHT_CARDS: readonly EducationSpotlightCard[] = [
  {
    slug: "ftd",
    href: "https://www.gruposomoseducacao.com.br/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "K12 · Conteúdo · Digital",
    title: "FTD /",
    titleAccent: "Somos Educação",
    spotlightLead:
      "Placeholder: ecossistema de materiais didáticos e plataformas digitais para escolas — entrada do aluno, professores e famílias com experiência unificada (detalhes do case em construção).",
    spotlightTags: ["Produto digital", "UX educacional", "Design systems"],
  },
  {
    slug: "lal",
    href: "https://www.lalschools.com/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "Bilíngue · Comunicação",
    title: "LAL",
    titleAccent: "Education",
    spotlightLead:
      "Placeholder: redes de escolas com proposta bilíngue — sites institucionais, captação e jornadas de matrícula pensadas para pais e alunos (conteúdo a validar com o time comercial).",
    spotlightTags: ["Branding", "Site institucional", "Jornada do aluno"],
  },
  {
    slug: "puc-pr",
    href: "https://www.pucpr.br/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "Ensino superior · Pesquisa",
    title: "PUC",
    titleAccent: "PR",
    spotlightLead:
      "Placeholder: presença digital de grande universidade — portais acadêmicos, eventos, cursos e reputação institucional com foco em clareza e acessibilidade.",
    spotlightTags: ["Portal", "Acessibilidade", "Conteúdo acadêmico"],
  },
  {
    slug: "grupo-marista",
    href: "https://www.marista.org.br/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "Rede · Missão",
    title: "Grupo",
    titleAccent: "Marista",
    spotlightLead:
      "Placeholder: rede de instituições de ensino — consistência de marca, narrativa pedagógica e produtos digitais que refletem valores maristas em várias unidades.",
    spotlightTags: ["Rede multi-unidade", "Identidade", "Conteúdo"],
  },
  {
    slug: "crf-sp",
    href: "https://www.crf-sp.org.br/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "Regulatório · Profissionais",
    title: "CRF-",
    titleAccent: "SP",
    spotlightLead:
      "Placeholder: conselho regional — serviços ao farmacêutico com informação normativa clara, áreas logadas e comunicação institucional (útil como referência de produto B2Profissional).",
    spotlightTags: ["Serviços digitais", "Conteúdo normativo", "UX jurídico"],
  },
  {
    slug: "scriba",
    href: "https://www.scribaeducation.com/",
    bannerUrl: EDU_BANNER,
    spotlightKicker: "Editora · Tecnologia",
    title: "Scriba",
    titleAccent: "Education",
    spotlightLead:
      "Placeholder: soluções editoriais e digitais para escolas e redes — catálogo, licenciamento e experiência de uso de materiais pedagógicos online.",
    spotlightTags: ["Edtech", "Editora", "Plataforma"],
  },
] as const;

export function getEducationSpotlightCards(): readonly EducationSpotlightCard[] {
  return EDUCATION_SPOTLIGHT_CARDS;
}
