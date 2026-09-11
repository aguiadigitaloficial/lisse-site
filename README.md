# Lisse Clinic

Landing page da Lisse Clinic construída com React, TypeScript, Tailwind CSS e Vite a partir do layout original do Figma.

## Requisitos

- Node.js 22
- npm com suporte ao `package-lock.json` v3

## Desenvolvimento

```bash
npm ci
npm run dev
```

O servidor local utiliza `http://localhost:5173` por padrão.

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
```

## Vercel

O projeto está configurado como uma SPA do Vite. O `vercel.json` encaminha
acessos diretos às páginas e seções para o React, evitando erros 404 ao
recarregar URLs internas.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
