# Lisse — validação da entrega local

Data: 08/10/2026. Branch `main`, origin `aguiadigitaloficial/lisse-site`.
**Sem push, publicação ou alteração de domínio.** O commit é local; o conteúdo de avaliações ainda requer aprovação antes de publicar.

## Método de medição

Lighthouse 13.5.0, Chrome headless 154, Windows, build de produção, cache frio em uma nova instância por execução. Três execuções por página e perfil; as tabelas usam a mediana de cada métrica, não a melhor execução.

- Mobile padrão: 412 × 823, DPR 1,75, simulação de rede/CPU do Lighthouse.
- Desktop: configuração oficial desktop do Lighthouse, 1350 × 940, DPR 1.
- Antes: cópia do build anterior às otimizações; depois: build final em `http://127.0.0.1:4174`.
- O preview final serve os documentos específicos das rotas sem exigir barra final, espelhando os encaminhamentos configurados para a Vercel. O preview padrão do Vite retornava o HTML inicial em rotas sem barra, apesar de o React exibir a página correta; isso foi corrigido antes da rodada de entrega.
- As primeiras tentativas de calibrar o perfil desktop e as rodadas intermediárias não entram nas medianas. O perfil desktop válido foi executado explicitamente com `desktop-config.js`.
- Relatórios brutos ficam apenas na pasta ignorada `.codex-tools/audit/reports`: baseline mobile `before`, baseline desktop `before-desktop`, final `delivery`. Não entram no commit.

Em algumas execuções o motor de insights do Lighthouse registrou `LanternError: NO_LCP` para uma navegação secundária da SPA. As categorias e as métricas principais foram preenchidas, sem `runtimeError` nem avisos de execução no relatório. Não se considera essa saída parcial de insights uma medição independente de LCP.

Lighthouse local é uma medição de laboratório, não PageSpeed Insights na Vercel nem dados de usuários reais. A pontuação pública e os cabeçalhos do CDN permanecem pendentes de publicação autorizada. [Variabilidade oficial do Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).

## Medianas anteriores

LCP em segundos; TBT em milissegundos. P = desempenho, A = acessibilidade, B = boas práticas, S = SEO.

| Página | Perfil | P | A | B | S | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início | Mobile | 70 | 93 | 92 | 92 | 6,099 | 0 | 159,5 |
| Harmonização | Mobile | 68 | 93 | 96 | 92 | 11,954 | 0,00983 | 148 |
| Faloplastia | Mobile | 77 | 93 | 96 | 92 | 4,745 | 0 | 25,5 |
| Emagrecimento | Mobile | 73 | 93 | 96 | 92 | 5,879 | 0 | 61,5 |
| Início | Desktop | 98 | 93 | 92 | 92 | 1,101 | 0 | 26,5 |
| Harmonização | Desktop | 91 | 93 | 96 | 92 | 1,900 | 0 | 0 |
| Faloplastia | Desktop | 99 | 93 | 96 | 92 | 0,832 | 0 | 0 |
| Emagrecimento | Desktop | 98 | 93 | 96 | 92 | 0,977 | 0 | 0 |

## Medianas finais

| Página | Perfil | P | A | B | S | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início | Mobile | 92 | 100 | 100 | 100 | 3,238 | 0 | 10,5 |
| Harmonização | Mobile | 93 | 100 | 100 | 100 | 2,947 | 0 | 48 |
| Faloplastia | Mobile | 96 | 100 | 100 | 100 | 2,497 | 0 | 47 |
| Emagrecimento | Mobile | 94 | 100 | 100 | 100 | 2,797 | 0 | 49,5 |
| Início | Desktop | 100 | 100 | 100 | 100 | 0,610 | 0 | 0 |
| Harmonização | Desktop | 100 | 100 | 100 | 100 | 0,646 | 0 | 0 |
| Faloplastia | Desktop | 100 | 100 | 100 | 100 | 0,643 | 0 | 0 |
| Emagrecimento | Desktop | 100 | 100 | 100 | 100 | 0,603 | 0 | 0 |

Desempenho nas três repetições mobile: Início 92/92/92; Harmonização 93/93/93;
Faloplastia 96/96/96; Emagrecimento 94/94/95. Desktop 100/100/100 em todas.
São 24 auditorias finais e 24 baselines válidos, além das rodadas intermediárias.
Nenhuma mediana final ficou abaixo de 90. Ainda não se chegou a 100 de desempenho
no mobile: o caminho crítico de CSS/fontes/JavaScript e a pintura da imagem/título
principal sob CPU/rede simuladas continuam pesando, especialmente na homepage.
Não foram escondidos conteúdos ou removidos efeitos aprovados para subir a nota.
CSS legado compartilhado permanece onde sua retirada exigiria uma revisão visual
mais abrangente. CLS zero refere-se à janela medida pelo Lighthouse, não a uma
garantia para todas as interações posteriores.

## Otimizações entregues

- JavaScript inicial: 416,29 KB → 277,23 KB; gzip 139,54 KB → 87,72 KB (redução de aproximadamente 37% na transferência comprimida).
- Código/dados de especialidades em chunk próprio (~39 KB); pré-carregado somente nos documentos dessas rotas. A homepage não o baixa até navegar para uma especialidade.
- GSAP/ScrollTrigger em chunk separado (~113 KB), solicitado próximo das seções que usam movimento. Sem nova biblioteca de interface.
- Sete arquivos de fontes substituídos por dois WOFF2 variáveis, preservando famílias e pesos necessários.
- 107 variantes WebP (~5,8 MB no repositório, não baixadas todas de uma vez), com `srcset`, `sizes`, dimensões e carregamento tardio. Originais preservados; transparência do ornamento preservada.
- Imagem principal prioritária e pré-carregada por rota. Fotografias clínicas mantêm enquadramento e recebem qualidade de compressão mais alta; nenhum retoque generativo.
- Carrosséis de fotos e animações da hero pausam fora da tela e com a aba oculta. Movimento reduzido permanece disponível.
- Contraste de pequenos textos/botões e área de interação dos indicadores de avaliações corrigidos sem mudar a composição.
- SVG conceitual de bioimpedância (~5 KB) substitui exclusivamente a fotografia da avaliação nutricional, conforme pedido adicional. Sem dados de paciente ou números clínicos inventados.
- Node 22, documentos estáticos por rota, favicon, idioma, metadados, robots e política de cache configurados. Sem domínio definitivo inventado.
- Atualizações pontuais de duas dependências transitivas de desenvolvimento (`brace-expansion` e `source-map-js`); `npm audit` sem vulnerabilidades conhecidas na checagem da entrega. Tipos de Node 22 adicionados apenas ao desenvolvimento.

## Rodapé e navegação

- Agência: `https://aguiadigital.com`; Instagram: `https://www.instagram.com/lisseclinic/`, ambos com nova aba e `noopener noreferrer`.
- Telefone: `tel:+5531985566396`; WhatsApp com número confirmado e texto conforme a página, sem enviar mensagem.
- Endereço clicável para a rota configurada da Av. Miguel Perrela, 663; Sala 201 permanece no texto.
- Início/Sobre/Tratamentos retornam às âncoras da homepage; Resultados aparece somente em Harmonização e Emagrecimento. Feedbacks permanece na página correspondente.
- Navegação após carregar o chunk interno aguarda a montagem antes de rolar para a âncora.
- Teclado: foco visível confirmado nos links de WhatsApp/agência; menu mobile abre e fecha com Escape. Links externos foram conferidos sem iniciar chamadas ou enviar mensagens.

## Verificações e limites

- `npm ci` com o lockfile final aprovado em diretório isolado usando Node 22.23.3; lint, TypeScript/build e `git diff --check` aprovados. O projeto não possui suíte de testes automatizados; nenhuma foi declarada como executada.
- Conferência DOM/geometria das quatro páginas em 360 × 640, 768 × 1024 e 1440 × 900 CSS px: sem rolagem horizontal e sem destinos locais inexistentes no rodapé.
- A IAB estava com zoom de 75%; as medidas acima foram confirmadas com `innerWidth/innerHeight`, ajustando o viewport. Os perfis Lighthouse usam sua própria emulação, sem esse zoom.
- Imagem de bioimpedância carregada, proporção 1:1 preservada nos três tamanhos. Arte vetorial renderizada e inspecionada separadamente.
- Capturas da aba de teste da IAB apresentaram imagem incorreta/desalinhada, mesmo com DOM e foco corretos. A aba de entrega permitiu conferir a nova ilustração na página, mas **não se declara inspeção visual completa das quatro páginas em todos os tamanhos**. Capturas geradas pelo Lighthouse permitiram conferir as primeiras dobras; revisão visual completa no localhost ainda é recomendada.
- Áreas de toque foram revisadas em CSS; não houve teste em dispositivo físico. Conferência por leitor de tela real também não foi executada. Nota 100 de acessibilidade automatizada não substitui esses testes.

## Pendências antes de publicar

1. A homepage ainda contém avaliações provisórias com “Nome do cliente” e texto de exemplo. As especialidades têm depoimentos marcados como `editorial` em `src/data/reviews.ts`, cuja autenticidade/autorização precisa ser confirmada. Nenhum depoimento foi inventado nesta entrega; aguarda-se conteúdo real ou autorização para retirar os cards provisórios.
2. Aprovar a ilustração conceitual de bioimpedância e revisar visualmente o localhost, considerando a limitação das capturas da IAB.
3. Após publicação autorizada, medir PageSpeed mobile/desktop na URL pública e confirmar rotas, metadados e cache reais da Vercel. Não há promessa de 100 no ambiente público.

Para enviar quando essas pendências estiverem resolvidas: GitHub Desktop → projeto `lisse-site` (pasta local `lisse-clinic`) → branch `main` → conferir **History** → **Push origin**. Um repositório conectado à Vercel pode disparar deploy automaticamente ao receber o push.
