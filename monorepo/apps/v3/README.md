# Matilha CMS de Propostas

CMS interno para o time comercial da Matilha gerenciar propostas comerciais.
Cada cliente recebe uma URL única (`/p/<slug>`) com a proposta renderizada.

Stack: **Next.js 15 (App Router) · TypeScript · Tailwind · Redis · Render Disk**.

---

## Como rodar localmente

> Pré-requisito: Node 18.18+ (ou 20+ recomendado).

```bash
cd cms
npm install
cp .env.local.example .env.local
npm run seed        # cria a proposta base "ciee-pr"
npm run dev
```

Abra:

- **Admin**: http://localhost:3000/admin
  Senha padrão (do `.env.local.example`): `matilha2026`
- **Proposta pública**: http://localhost:3000/p/ciee-pr

Em desenvolvimento o CMS guarda dados em `./data/propostas/<slug>.json` e
uploads em `./public/uploads/`. Não precisa configurar banco nenhum.

### Scripts úteis

| Comando         | O que faz                                      |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | sobe o servidor de desenvolvimento             |
| `npm run build` | build de produção                              |
| `npm start`     | sobe a build de produção                       |
| `npm run seed`  | cria a proposta base CIEE-PR (slug `ciee-pr`)  |
| `npm run migrate:redis` | migra `data/propostas/*.json` para o Redis |

---

## Estrutura

```
cms/
├── data/propostas/             ← JSONs por slug (apenas em dev)
├── public/uploads/             ← logos enviados (apenas em dev)
├── src/
│   ├── app/
│   │   ├── (admin)/            ← root layout admin (Tailwind)
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx           (lista de propostas)
│   │   │       ├── login/page.tsx
│   │   │       └── [slug]/page.tsx    (editor)
│   │   ├── (public)/           ← root layout público (estilo Matilha)
│   │   │   ├── layout.tsx
│   │   │   ├── proposta.css
│   │   │   ├── page.tsx               (redirect → /admin)
│   │   │   └── p/[slug]/page.tsx      (proposta pública)
│   │   ├── api/admin/          ← rotas autenticadas
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── propostas/
│   │   │   ├── propostas/[slug]/
│   │   │   └── upload/
│   │   └── globals.css         ← Tailwind base
│   ├── components/proposta/    ← PropostaView (renderiza a proposta)
│   ├── lib/
│   │   ├── auth.ts             ← JWT + cookie
│   │   ├── storage.ts          ← FS local / Redis
│   │   ├── template.ts         ← proposta-base
│   │   ├── types.ts            ← schema Zod + tipos
│   │   └── env.ts              ← carrega .env em scripts
│   ├── middleware.ts           ← protege /admin e /api/admin
│   └── scripts/seed.ts
├── .env.local.example
├── tailwind.config.ts
└── package.json
```

### Modelo de dados

Cada proposta é um JSON com o schema definido em
[`src/lib/types.ts`](src/lib/types.ts) (validado com Zod). Campos editáveis no
admin:

- **Cliente**: nome, contato, logo
- **Dados da proposta**: número, projeto, data, cidade, label do hero
- **Hero**: título, título destaque, subtítulo, aspectos
- **Seções 01–08**: section label, heading, lead, listas (cards, pilares,
  steps, membros, stats, blocos de investimento, próximos passos)
- **Cronograma**: colunas, fases com linhas e marcações (●/★)
- **Bridges**: palavra gigante, captions e índices das transições

### Autenticação

Cookie HTTP-only com JWT (HS256, 30 dias). Protegido por:

- `ADMIN_PASSWORD` (env): senha master compartilhada
- `SESSION_SECRET` (env): segredo para assinar o JWT (mín. 32 chars)

O middleware (`src/middleware.ts`) bloqueia `/admin/*` (exceto `/admin/login`)
e `/api/admin/*` (exceto `/api/admin/login`) sem cookie válido.

---

## Deploy no Render

### 1. Subir o repositório

Commit e push da pasta `cms/` para um repo Git.

> A pasta `gluck-hackahunt-matilha-site/` é apenas referência histórica e não
> precisa ir para o repositório/deploy.

### 2. Criar serviços no Render

Na dashboard do Render:

- **Key Value**: cria o Redis e copia a **Internal Redis URL**.
- **Web Service**: conecta ao repo GitHub e usa Node.
- **Disk**: adiciona um Persistent Disk no Web Service em `/var/data`.

### 3. Definir env vars

No Web Service, em **Environment**:

| Nome              | Valor                                            |
| ----------------- | ------------------------------------------------ |
| `ADMIN_PASSWORD`  | senha que o time comercial vai usar              |
| `SESSION_SECRET`  | string aleatória de 32+ chars (`openssl rand -base64 48`) |
| `REDIS_URL`       | Internal Redis URL do Key Value                  |
| `UPLOAD_DIR`      | `/var/data/uploads`                              |

> Não defina `NODE_ENV` manualmente no Render. Quando `NODE_ENV=production`
> é usado durante o build, o npm pode ignorar dependências necessárias para
> compilar o Next.js, como TypeScript e Tailwind.

### 4. Deploy

Configuração do Web Service:

| Campo          | Valor                         |
| -------------- | ----------------------------- |
| Build Command  | `npm ci --include=dev && npm run build` |
| Start Command  | `npm start`                   |

`git push` → deploy automático.

### 5. Migrar dados de dev para prod

Se você quer levar os JSONs locais de `data/propostas/` para o Redis do Render,
defina temporariamente `REDIS_URL` com a External Redis URL e rode:

```bash
npm run migrate:redis
```

---

## Próximos passos sugeridos

Coisas que ficaram fora deste MVP e fazem sentido evoluir:

- **Versões/histórico** da proposta (quem editou o quê e quando)
- **Pré-visualização** ao vivo no editor (split view)
- **Botão "Duplicar de uma proposta existente"** já está no fluxo de criar,
  mas dá pra adicionar um botão de duplicação direto na lista
- **Autenticação por usuário** com email/senha (substituindo a senha master)
- **Editor WYSIWYG** ou markdown para os campos de texto longo
- **Exportar PDF** da proposta para envio
- **Status da proposta**: rascunho / enviada / aceita / arquivada
- **Domínio personalizado** com subdomínio do cliente

---

## Troubleshooting

### Build falha com erro do `@tailwindcss/oxide`

Você está em Node 18 e essa lib precisa Node 20+. O projeto usa Tailwind
v3 justamente para evitar isso. Se mesmo assim aparecer, rode:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Login não persiste

Verifique se o `SESSION_SECRET` no `.env.local` tem 32+ caracteres. Sem
isso o `jose` rejeita assinar o JWT.

### Página `/p/<slug>` retorna 404

Confira se a proposta foi criada. Em dev: existe o arquivo
`data/propostas/<slug>.json`? Se não, rode `npm run seed` ou crie pelo
admin.
