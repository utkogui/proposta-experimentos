# Monorepo — propostas (Next.js)

Três aplicações independentes no mesmo repositório, geridas com **npm workspaces**.

## Estrutura

```
monorepo/
  package.json          # workspaces raiz
  apps/
    v1/                 # pacote npm `cms-v1`
    v2/                 # pacote npm `cms-v2`
    v3/                 # pacote npm `cms-v3` — hub na `/` + propostas em `/p/[slug]`
```

Cada app mantém o seu próprio `src/`, `public/`, `data/` e config Next (`next.config.ts`, etc.).

### v3 (porta 3000)

- **`/`** — home com cartão para a proposta CP  
- **`/p/cp`** — página pública da proposta (fluxo herdado do v2)  
- **`/admin`** — CMS  
- **Templates por subdomínio** — em `cms-v3`, o middleware define `data-cms-template` / classe `cms-template-v1|v2|v3` conforme o host:
  - Local: `http://v1.localhost:3000`, `http://v2.localhost:3000`, `http://v3.localhost:3000` (Chrome aceita `.localhost` sem `/etc/hosts`).
  - Produção: `https://v2.seudominio.com` → template `v2`.
  - Apex (`seudominio.com`) ou host sem prefixo reconhecido → `CMS_DEFAULT_TEMPLATE` ou **`v3`**.
- **`apps/v1` e `apps/v2`** continuam no monorepo como referência até os estilos forem fundidos em overrides por template (nada foi removido).

Ver também **[docs/GIT_COMERCIAL.md](./docs/GIT_COMERCIAL.md)** para publicar só esta pasta no GitHub `comercial`.

## Requisitos

- Node.js 20.x (ver `engines` nos `package.json`)

## Instalação

Na pasta **`monorepo/`**:

```bash
npm install
```

(Uma única árvore de dependências na raiz; não é obrigatório `npm install` dentro de cada `apps/*/`.)

## Desenvolvimento

**As três apps ao mesmo tempo** (um único comando):

```bash
npm run dev
```

Portas (sem conflito):

| App | URL raiz |
|-----|-----------|
| **v3** | http://localhost:3000 |
| **v1** | http://localhost:3001 |
| **v2** | http://localhost:3002 |

Na **v3**: home em http://localhost:3000/ e proposta CP em http://localhost:3000/p/cp

Para correr só uma:

| App | Comando |
|-----|---------|
| v3  | `npm run dev:v3` |
| v1  | `npm run dev:v1` |
| v2  | `npm run dev:v2` |

## Build

```bash
npm run build          # todas as apps
npm run build:v1
npm run build:v2
npm run build:v3
```

### Erro `Cannot find module './XXX.js'` ou `reading 'call'` (Webpack / `.next`)

Cache `.next` ou grafo de chunks inconsistente é comum em monorepos com vários `next dev`. Na pasta **`monorepo/`**:

```bash
npm run clean
npm install
npm run dev
```

Em desenvolvimento as apps desativam cache persistente do Webpack (`webpack.cache = false`) para reduzir este tipo de falha.

## Próximos passos (opcional)

- Extrair código partilhado para `packages/*` (tipos, `lib/storage`, etc.) quando fizer sentido.
- Adicionar [Turborepo](https://turbo.build/) ou outro orquestrador se quiser cache de build entre apps.
