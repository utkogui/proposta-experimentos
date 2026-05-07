# Repositório `github.com:utkogui/comercial`

Este monorepo também é publicado como repositório dedicado **`comercial`** (conteúdo = pasta `monorepo/` na raiz do clone).

## No clone principal (`proposta-experimentos` ou outro)

Da **raiz do repositório Git** que contém a pasta `monorepo/`:

```bash
git remote add comercial git@github.com:utkogui/comercial.git
# se já existir: git remote set-url comercial git@github.com:utkogui/comercial.git

git subtree split --prefix=monorepo -b publish-monorepo-comercial
git push comercial publish-monorepo-comercial:main
```

Atualizações seguintes (após commits que mexem em `monorepo/`):

```bash
git subtree split --prefix=monorepo -b publish-monorepo-comercial
git push comercial publish-monorepo-comercial:main --force-with-lease
```

No repo **`proposta-experimentos`** (raiz acima de `monorepo/`), podes usar o atalho:

```bash
npm run push:comercial
```

`--force-with-lease` pode ser necessário porque `git subtree split` gera histórico rebased para o prefixo; use só se souber que ninguém mais fez push direto em `comercial`.

## Alternativa: clone só do `comercial`

Quem clonar `git@github.com:utkogui/comercial.git` vê **apenas** o que antes era `monorepo/` (workspaces `apps/v1`, `v2`, `v3` incluídos).

```bash
git clone git@github.com:utkogui/comercial.git
cd comercial
npm install
npm run dev
```

## Remote antigo `origin`

O projeto pode continuar com `origin` apontando para outro repo (ex.: `proposta-cp`); `comercial` é um remote **adicional**.
