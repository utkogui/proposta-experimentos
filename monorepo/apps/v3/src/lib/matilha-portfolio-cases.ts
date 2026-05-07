import {
  MEUPS_CASE_ORIGIN,
  MEUPS_PORTFOLIO_IMAGES,
  MEUPS_SERVICE_BANNER_URL,
} from "@/lib/meups-portfolio-images";

export type MatilhaPortfolioImage = {
  src: string;
  alt: string;
  caption: string;
};

export type MatilhaPortfolioCaseSlug =
  | "meu-playstation"
  | "mon-museu-oscar-niemeyer"
  | "charney-companies"
  | "pubg";

export type MatilhaPortfolioCaseDefinition = {
  slug: MatilhaPortfolioCaseSlug;
  /** Rota interna Next (mantém /meups-portfolio por compatibilidade) */
  internalPath: string;
  caseOrigin: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  services: readonly string[];
  challengeLead: string;
  challenge: string;
  /** Parágrafos opcionais entre Serviços e Desafio (panorama do projeto / mercado). */
  contextNotes?: readonly string[];
  portfolioLead: string;
  bannerUrl: string;
  portfolioImages: readonly MatilhaPortfolioImage[];
  deliveries: readonly { titulo: string; texto: string }[];
  quote?: { text: string; cite: string };
  team: readonly [string, string][];
  spotlightKicker: string;
  spotlightLead: string;
  spotlightTags: readonly string[];
  footerCredit: string;
};

export const MATILHA_PORTFOLIO_CASE_ORDER = [
  "meu-playstation",
  "mon-museu-oscar-niemeyer",
  "charney-companies",
  "pubg",
] as const satisfies readonly MatilhaPortfolioCaseSlug[];

const MON_ORIGIN =
  "https://matilha.digital/pt/cases/mon-museu-oscar-niemeyer/" as const;
const CHARNEY_ORIGIN =
  "https://matilha.digital/pt/cases/charney-companies/" as const;
const PUBG_ORIGIN = "https://matilha.digital/pt/cases/pubg/" as const;

export const MATILHA_PORTFOLIO_CASES: Record<
  MatilhaPortfolioCaseSlug,
  MatilhaPortfolioCaseDefinition
> = {
  "meu-playstation": {
    slug: "meu-playstation",
    internalPath: "/meups-portfolio",
    caseOrigin: MEUPS_CASE_ORIGIN,
    metaTitle: "Meu PlayStation · Case · Matilha",
    metaDescription:
      "Redesign do Meu PlayStation (MeuPS): site e app de referência em notícias PlayStation nas Américas — discovery, UI/UX e desenvolvimento com a Matilha.",
    title: "Meu ",
    titleAccent: "PlayStation",
    subtitle:
      "Canal editorial líder em notícias, análises e guias sobre o ecossistema PlayStation no Brasil, com alcance para toda a região — do lançamento de jogos à PS Plus e ao dia a dia da comunidade.",
    services: ["Design de Serviço", "UI | UX Design", "Desenvolvimento e Tech"],
    challengeLead: "Elevar experiência e interação em escala editorial",
    challenge:
      "O MeuPS publica conteúdo de alta frequência em um universo muito competitivo (notícias, reviews, listas, guias e cobertura de eventos). O desafio foi redesenhar o site para melhorar leitura, navegação, hierarquia de informação e engajamento, sem perder a identidade que já conquistou leitores e parceiros. Isso exige equilíbrio entre performance, monetização e uma experiência que funcione bem em desktop e mobile.",
    contextNotes: [
      "O Meu PlayStation — também conhecido como MeuPS — é um dos principais portais de notícias focados em PlayStation no Brasil; o domínio público meups.com.br reúne cobertura de PS5 e PS4, lançamentos, promoções e conteúdo para a comunidade de jogadores.",
      "Por ser um produto editorial em escala, pequenas fricções de UX se multiplicam: fluxos de descoberta de conteúdo, consistência de componentes e clareza de páginas de artigo impactam diretamente tempo de leitura, retorno e percepção de qualidade da marca.",
    ],
    portfolioLead:
      "Seleção de telas do redesign — as mesmas referências visuais publicadas no case da Matilha, mostrando home, feeds e artigos com nova hierarquia e linguagem de interface.",
    bannerUrl: MEUPS_SERVICE_BANNER_URL,
    portfolioImages: MEUPS_PORTFOLIO_IMAGES,
    deliveries: [
      {
        titulo: "Discovery (Design de Serviço)",
        texto:
          "Imersão no negócio e nos usuários: entrevistas, análise de jornadas e mapeamento de dores do site anterior. O time estruturou insumos vindos do cliente e da audiência para transformar achados em requisitos de produto e oportunidades priorizadas, inclusive olhando para cultura gamer e expectativas da comunidade MeuPS.",
      },
      {
        titulo: "Roadmap de Inovação",
        texto:
          "Consolidação de um backlog estratégico: iniciativas de curto e médio prazo para evolução contínua da plataforma — desde melhorias de conversão e hábitos de leitura até funcionalidades que fortalecem o relacionamento com a audiência em torno do ecossistema PlayStation.",
      },
      {
        titulo: "UI Design",
        texto:
          "Redesenho visual e de interação da experiência web (e bases para outros pontos de contato), com sistema de componentes, tipografia e grid pensados para escala editorial: páginas de capa, listagens densas e artigos longos com legibilidade e ritmo visual coerentes com a marca.",
      },
    ],
    quote: {
      text:
        "A pesquisa em serviço proporcionou uma imersão profunda em diferentes materiais do universo gamer, além do contato com usuários da plataforma, para que fosse possível encontrar oportunidades que estivessem alinhadas com o mercado e também com a comunidade já estabelecida pelo MeuPS.",
      cite: "— Time de Design de Serviço",
    },
    team: [
      ["Barbara Borges", "Lead Ops"],
      ["Rodrigo Vidinich", "Service Designer"],
      ["Bianca Falcão", "Service Designer"],
      ["Rodrigo Ramos", "UX/UI Designer"],
      ["Rodrigo Liva", "UX/UI Designer"],
      ["Barbara Lourenço", "UX/UI Designer"],
      ["Ilana Heymowski", "UX/UI Designer"],
    ],
    spotlightKicker: "Notícias · UX · Tech",
    spotlightLead:
      "Portal editorial MeuPS — discovery com comunidade gamer, novo UI para alta cadência de publicações e base técnica para evoluir com o produto.",
    spotlightTags: ["Design de Serviço", "UI · UX", "Desenvolvimento"],
    footerCredit: "Portfólio interno Meu PlayStation",
  },

  "mon-museu-oscar-niemeyer": {
    slug: "mon-museu-oscar-niemeyer",
    internalPath: "/mon-portfolio",
    caseOrigin: MON_ORIGIN,
    metaTitle: "MON · Museu Oscar Niemeyer · Case · Matilha",
    metaDescription:
      "Site institucional e loja do MON — maior museu de arte da América Latina em Curitiba: pesquisa em serviço, UX/UI e desenvolvimento com a Matilha.",
    title: "Museu Oscar ",
    titleAccent: "Niemeyer",
    subtitle:
      "Ícone cultural de Curitiba e um dos museus mais reconhecidos do Brasil — obra arquitetônica de Oscar Niemeyer que, no discurso oficial da instituição, é apresentado como o maior museu de arte da América Latina — reúne exposições, educação, visitação e loja, exigindo um digital à altura da marca.",
    services: ["Design de Serviço", "UI | UX Design", "Desenvolvimento e Tech"],
    challengeLead: "Site útil para visitantes e para operação interna do museu",
    challenge:
      "O site não serve apenas ao público que pesquisa horários, exposições e ingressos: também concentra necessidades internas de diferentes setores. O desafio foi tornar a experiência clara e agradável para quem visita e útil para quem trabalha no museu, reduzindo ruídos de navegação e tratando conteúdos dispersos como parte de um mesmo sistema de informação.",
    contextNotes: [
      "O Museu Oscar Niemeyer (MON), em Curitiba (PR), é referência pela arquitetura e pela dimensão de sua coleção e programação; atrai públicos diversos — estudantes, turistas, pesquisadores e moradores da cidade.",
      "Projetos em instituições desse porte costumam exigir alinhamento com identidade já consolidada, acessibilidade, ritmo de atualização de agenda cultural e, neste case, extensão do trabalho para a loja virtual e migração de conteúdo legado sem perda de rastreabilidade.",
    ],
    portfolioLead:
      "Interfaces do redesenho — publicadas no case oficial da Matilha — mostram navegação, páginas de conteúdo e componentes alinhados à linguagem visual do museu.",
    bannerUrl:
      "https://matilha.digital/wp-content/uploads/2025/08/66aa73688f80e540f837ce8b_cover-mon.webp",
    portfolioImages: [
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f42e23138dea80c02e81_MON_01.webp",
        alt: "MON — interface 01",
        caption: "Presença digital",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f432e9bf9a872ec25101_MON_02.webp",
        alt: "MON — interface 02",
        caption: "Navegação e conteúdo",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f43927892e7e371b8095_MON_03-p-1080-1024x482.webp",
        alt: "MON — interface 03",
        caption: "Experiência editorial",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f4481bd52eb1a121ece1_MON_04.webp",
        alt: "MON — interface 04",
        caption: "Componentes e hierarquia",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f44bc8efe3f43c63ec26_MON_05.webp",
        alt: "MON — interface 05",
        caption: "Momentos da interface",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3f4530c3cd0ce90538439_MON_06-p-1080-1024x444.webp",
        alt: "MON — interface 06",
        caption: "Detalhes visuais",
      },
    ],
    deliveries: [
      {
        titulo: "Pesquisa (Design de Serviço)",
        texto:
          "O MON já possuía pesquisa prévia; o time de service design da Matilha entrou para repriorizar temas, cruzar dores de públicos distintos (visitantes x operações) e garantir que decisões de interface não fossem apenas cosméticas, mas sustentadas por evidências e pelo teor institucional do museu.",
      },
      {
        titulo: "Redesign",
        texto:
          "Partimos dos direcionamentos de identidade visual existentes e dos temas priorizados na pesquisa, traduzindo tudo em padrões de layout, hierarquia tipográfica, comportamentos de navegação e um conjunto coerente de componentes para páginas de exposição, serviços e institucional.",
      },
      {
        titulo: "Desenvolvimento e tecnologia",
        texto:
          "Implementação front e back-end do protótipo navegável, inclusive da loja virtual do museu, além da migração estruturada do conteúdo já publicado — ponte fundamental entre design no Figma e operação real do site.",
      },
    ],
    quote: {
      text:
        "O projeto foi imersivo e desafiador. O MON é uma instituição importante em Curitiba e com muitas diretrizes de design e especificações da prefeitura. Para nós foi uma experiência diferente trocar com os designers do cliente de forma tão fluida e consistente.",
      cite: "— Time de UX Design e UX Writing",
    },
    team: [
      ["Barbara Borges", "Lead Ops"],
      ["Rodrigo Vidinich", "Service Designer"],
      ["Bianca Cordazzo", "UX Designer"],
      ["Thomas Freitas", "UX Designer"],
      ["Sarah A. Queiroz", "UX Writer"],
      ["Lilian Freitas", "Back End"],
      ["Vitor Ussui", "Dev Lead"],
    ],
    spotlightKicker: "Cultural · Serviço · E-commerce",
    spotlightLead:
      "Instituição de grande porte em Curitiba — pesquisa em serviço, novo UI sobre identidade existente, loja e migração de conteúdo.",
    spotlightTags: ["Design de Serviço", "UI · UX", "Desenvolvimento"],
    footerCredit: "Portfólio interno Museu Oscar Niemeyer (MON)",
  },

  "charney-companies": {
    slug: "charney-companies",
    internalPath: "/charney-portfolio",
    caseOrigin: CHARNEY_ORIGIN,
    metaTitle: "Charney Companies · Case · Matilha",
    metaDescription:
      "Novo site da Charney Companies — empresa integrada de desenvolvimento imobiliário, corretagem e gestão nos EUA — UI/UX e desenvolvimento com a Matilha.",
    title: "Charney ",
    titleAccent: "Companies",
    subtitle:
      "Empresa de real estate verticalmente integrada nos Estados Unidos: desenvolvimento de projetos residenciais e mixed-use, corretagem e gestão de propriedades — com narrativa de marca forte e necessidade de um digital à altura do posicionamento.",
    services: ["UI | UX Design", "Desenvolvimento e Tech"],
    challengeLead: "Site novo na nova marca Charney",
    challenge:
      "Depois de um redesign de marca, o site precisava comunicar os três pilares da empresa com clareza (desenvolvimento, corretagem, gestão), apoiar storytelling de projetos e conversões — sem herdar as limitações estruturais e visuais do portal anterior. Era um exercício de traduzir manual de marca em interface responsiva, tipografia e grids consistentes em páginas institucionais e de produto.",
    contextNotes: [
      "A Charney Companies é descrita publicamente como firma integrada de desenvolvimento, brokerage e property management, com operações fortes em Nova York — modelo em que site e CRM percursos precisam conversar com investidores, moradores e parceiros.",
      "Para um estúdio brasileiro, o case também representa colaboração internacional: alinhamento de ritmo com cliente nos EUA, especificações detalhadas de marca e entrega técnica full-stack do protótipo.",
    ],
    portfolioLead:
      "Referências visuais do projeto no ar — mesmas telas destacadas no portfólio da Matilha, evidenciando hierarquia de marca e páginas de negócio.",
    bannerUrl:
      "https://matilha.digital/wp-content/uploads/2025/08/66a93ff1d2e9aeb1516f3ff6_cover-charney.webp",
    portfolioImages: [
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66abde9b24eb282b46627fe9_charney1.webp",
        alt: "Charney Companies — interface 01",
        caption: "Presença institucional",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66abde9f834b5824d4505daa_charney2.webp",
        alt: "Charney Companies — interface 02",
        caption: "Narrativa e produto",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66aaba3418287e5685fe895e_charney3-p-1080-859x1024.webp",
        alt: "Charney Companies — interface 03",
        caption: "Experiência em páginas",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66abe041efa2a3df264e2847_charney4.webp",
        alt: "Charney Companies — interface 04",
        caption: "Layout e composição",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66abe0449c396fcaa1bf4f2e_charney5.webp",
        alt: "Charney Companies — interface 05",
        caption: "Detalhes de interface",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66aab9e6cc4b208dbe03627d_charney6-p-1080-866x1024.webp",
        alt: "Charney Companies — interface 06",
        caption: "Consistência visual",
      },
    ],
    deliveries: [
      {
        titulo: "Redesign do Website",
        texto:
          "Estudo do novo manual de marca e auditoria do site legado: problemas de arquitetura de informação, inconsistências visuais e pontos de atrito na jornada de quem busca empreendimentos ou serviços da Charney. A partir daí, definiu-se uma nova hierarquia de páginas, tratamento de imagens de obra e linguagem editorial alinhada ao tom institucional renovado.",
      },
      {
        titulo: "Desenvolvimento e tecnologia",
        texto:
          "Construção do protótipo em produção: front-end fiel ao design system acordado, integrações necessárias ao back-end e garantia de responsividade e performance para um site que funciona como vitrine principal da empresa nos Estados Unidos.",
      },
    ],
    team: [
      ["Paula Konno", "UI/UX Designer"],
      ["Nicolas Iargas", "Gerente de Projeto"],
      ["Guilher Utko", "Comercial"],
    ],
    spotlightKicker: "Imobiliário · Marca · Digital",
    spotlightLead:
      "Marca imobiliária integrada nos EUA — novo site após rebranding, storytelling de projetos e stack front/back pela Matilha.",
    spotlightTags: ["UI · UX", "Desenvolvimento"],
    footerCredit: "Portfólio interno Charney Companies",
  },

  pubg: {
    slug: "pubg",
    internalPath: "/pubg-portfolio",
    caseOrigin: PUBG_ORIGIN,
    metaTitle: "PUBG · Case · Matilha",
    metaDescription:
      "Redesign dos sites globais e regionais de PUBG: discovery com jogadores no mundo todo, UI/UX e desenvolvimento — case Matilha.",
    title: "",
    titleAccent: "PUBG",
    subtitle:
      "Marca por trás de um dos battle royales mais relevantes do planeta (referência da Krafton), com comunidades competitivas e casuais em todos os continentes. Os sites oficiais — globais e regionais — concentram notícias, esports, comunicação de produto e canais de suporte em vários idiomas.",
    services: ["Design de Serviço", "UI | UX Design", "Desenvolvimento e Tech"],
    challengeLead: "Experiência coerente entre site global e presenças regionais",
    challenge:
      "Os usuários encontram a marca em contextos diferentes: anúncios de temporada, torneios, novidades de parceiros e canais de suporte. O desafio foi entender essas expectativas com rigor (pesquisa internacional) e desenhar um redesenho que unifique padrões de navegação, componentes e tom visual sem diluir as necessidades locais de cada região.",
    contextNotes: [
      "PUBG mantém ecossistema de jogos e eventos com audiência massiva; o site institucional e regional é peça central de comunicação com jogadores, imprensa e parceiros — qualquer inconsistência entre mercados afeta confiança e suporte.",
      "O discovery descrito pela Matilha incluiu entrevistas e observação com jogadores em vários países, em inglês, combinando escuta qualitativa com análise de comportamento para orientar o redesign.",
    ],
    portfolioLead:
      "Momento do case na Matilha: fluxos de home, destaques de conteúdo e páginas alinhadas à identidade PUBG publicadas no portfólio oficial.",
    bannerUrl:
      "https://matilha.digital/wp-content/uploads/2025/09/66a3fae711a30f606e80d732_Case_P_1.webp",
    portfolioImages: [
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3fae711a30f606e80d732_Case_P_1.webp",
        alt: "PUBG — interface 01",
        caption: "Ecossistema digital",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3faea093122827fe6beed_Case_P_2.webp",
        alt: "PUBG — interface 02",
        caption: "Navegação global",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3faf083d41b357d0349bb_Case_P_3-p-1080.webp",
        alt: "PUBG — interface 03",
        caption: "Experiência regional",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3faf51398c248b4594828_Case_P_4.webp",
        alt: "PUBG — interface 04",
        caption: "Interfaces e conteúdo",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3faf8f95889acf9cdab53_Case_P_5.webp",
        alt: "PUBG — interface 05",
        caption: "Componentes da marca",
      },
      {
        src:
          "https://matilha.digital/wp-content/uploads/2025/09/66a3fafb56a55037be8dced6_Case_P_6-p-1080-1024x444.webp",
        alt: "PUBG — interface 06",
        caption: "Momentos do produto",
      },
    ],
    deliveries: [
      {
        titulo: "Discovery",
        texto:
          "Pesquisa com usuários em diferentes territórios: entrevistas com jogadores profissionais e amadores, exercícios de observação e análise comportamental. Os insights alimentaram mapas de prioridade para o redesign das plataformas existentes e reduziram decisões baseadas apenas em opinião interna.",
      },
      {
        titulo: "Redesign",
        texto:
          "Reformulação das interfaces levando em conta problemas do site anterior, consistência entre páginas globais e regionais, e uma linguagem visual compatível com a marca PUBG em alta resolução e uso em campanhas sazonais.",
      },
      {
        titulo: "Desenvolvimento e tecnologia",
        texto:
          "Implementação técnica do protótipo aprovado: camadas de front e back-end necessárias para publicação estável, integrações previstas no escopo e base para evolução contínua pós-lançamento.",
      },
    ],
    quote: {
      text:
        "Durante a etapa de discovery, fizemos entrevistas com jogadores profissionais e amadores ao redor do mundo, além de pesquisas de observação e análise comportamental, tudo conduzido em inglês.",
      cite: "— Time de Design de serviço",
    },
    team: [
      ["Piecarlo Melatti", "Head of UX, Front End, Back End"],
      ["Fernanda Bocchi", "UX/UI Designer"],
      ["Gabriel Ferreira", "UX/UI Designer"],
      ["Alan Maranho", "UX/UI Designer, Front End, Back End"],
      ["João Filipe", "Front End Developer"],
      ["Onélio Marchi", "Front end Developer"],
    ],
    spotlightKicker: "Games · Discovery · Global",
    spotlightLead:
      "Discovery internacional com jogadores, redesenho alinhado à marca Battle Royale e entrega full-stack dos sites globais e regionais.",
    spotlightTags: ["Design de Serviço", "UI · UX", "Desenvolvimento"],
    footerCredit: "Portfólio interno PUBG",
  },
};

export function getSpotlightCases(): readonly MatilhaPortfolioCaseDefinition[] {
  return MATILHA_PORTFOLIO_CASE_ORDER.map((slug) => MATILHA_PORTFOLIO_CASES[slug]);
}
