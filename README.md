# Lisse Clinic

Landing page da Lisse Clinic construída com React, TypeScript, Tailwind CSS e Vite a partir do layout original do Figma.

## Requisitos

- Node.js 22 (validado com 22.23.3; use uma versão atual da série 22)
- npm com suporte ao `package-lock.json` v3

## Desenvolvimento

```bash
npm ci
npm run dev
```

O servidor local utiliza `http://localhost:5173` por padrão.
No Windows/PowerShell, use `npm.cmd` caso a política de execução bloqueie `npm.ps1`.

## Páginas

- Início: `/`
- Harmonização: `/harmonizacao`
- Faloplastia: `/faloplastia`
- Emagrecimento: `/emagrecimento`

As antigas URLs com `?modo=` continuam sendo convertidas automaticamente.

## Verificações

```bash
npm run lint
npm run build
git diff --check
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

O build inclui a verificação TypeScript (`tsc -b`). Não há uma suíte/comando de testes automatizados neste projeto.
O preview em `http://127.0.0.1:4174` serve o build de produção; não use o servidor de desenvolvimento para comparar Lighthouse.

## Vercel

O projeto continua sendo uma SPA React/Vite. Após o Vite, `scripts/prepare-pages.mjs`
cria documentos HTML para as quatro rotas, com título, descrição, Open Graph e
pré-carregamento da imagem apropriados. Isso não é uma migração para SSR.
O `vercel.json` mantém acesso direto e atualização das páginas internas.

- Framework preset: Vite
- Node.js: 22.x
- Root Directory: a pasta deste README, junto de `package.json`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Não são necessárias variáveis de ambiente ou backend para esta versão.
Arquivos com hash em `/assets/` têm cache de um ano e `immutable`; HTML deve ser
revalidado (`max-age=0, must-revalidate`). Os cabeçalhos da Vercel só podem ser
confirmados no ambiente publicado. O preview local não aplica `vercel.json`.
Nenhum domínio definitivo foi inventado. Configure-o apenas depois de autorizado.

Referência: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite) e
[política de cache](https://vercel.com/docs/caching/cache-control-headers).

## Conteúdo e manutenção

- Contato, redes sociais, agência, rotas e mensagens: `src/data/site.ts`.
- Cadastro profissional: `src/data/professionals.ts`; apresentação da homepage: `src/data/homeProfessionals.ts`.
- Avaliações: `src/data/reviews.ts`.
- **Antes de publicar:** substituir os depoimentos de exemplo da homepage e confirmar a origem/autorização dos depoimentos editoriais das especialidades. Não publicar nomes fictícios ou lorem ipsum como avaliações reais.
- Imagens originais são preservadas. `scripts/optimize-images.py` gera cópias WebP e os dois módulos de variantes responsivas (requer Python e Pillow apenas para regeneração, não para instalar/buildar/publicar).
- Fontes locais WOFF2 variáveis conservam Inter e Cormorant Infant e seus pesos utilizados.
- A avaliação nutricional usa uma ilustração SVG conceitual de bioimpedância, sem medições fictícias. Ela não representa uma marca ou modelo de equipamento da clínica.
- Páginas internas são carregadas por rota; a biblioteca de movimento é carregada perto das seções que a utilizam. Conteúdo continua disponível com movimento reduzido.

## Auditoria de desempenho

Resultados e limites desta entrega: [relatório de validação](docs/RELEASE_CHECK.md).
Lighthouse local não é PageSpeed Insights nem dado de usuários reais. A nota pública
deve ser medida depois de uma publicação autorizada; [as pontuações variam](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).

Para repetir, inicie o preview de produção e execute três vezes por URL e perfil,
com Chrome instalado. A ferramenta é temporária/de desenvolvimento, não entra no bundle:

```bash
npx --yes lighthouse@13.5.0 http://127.0.0.1:4174/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=.codex-tools/inicio-mobile-1.json
npx --yes lighthouse@13.5.0 http://127.0.0.1:4174/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=.codex-tools/inicio-desktop-1.json
```

Crie `.codex-tools` antes, varie os nomes `-1`, `-2`, `-3` e repita para
`/harmonizacao`, `/faloplastia` e `/emagrecimento`. Compare medianas, não a melhor execução.
Não versionar relatórios brutos, caches, `.env`, `.vercel`, `node_modules` ou `dist`.

## Entrega pelo GitHub Desktop

1. Em **File → Add Local Repository**, selecione esta pasta `lisse-clinic`; o origin é `aguiadigitaloficial/lisse-site`.
2. Confira a branch **main**, o commit em **History** e as alterações antes de enviar.
3. Resolva a pendência dos depoimentos antes de publicar. Quando desejar, use **Push origin**. Se o repositório estiver conectado à Vercel, o push poderá iniciar a publicação automaticamente.

Esta entrega não executa push nem publicação. Os remotes `origin` e `upstream` são preservados.
