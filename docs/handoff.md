# Handoff — Site JMoreira Serviços (v3)

Especificação para quem for manter ou estender o site. A fonte da verdade são os
tokens em `app/globals.css` (CSS) e `lib/motion.ts` (JS); este documento explica
o porquê de cada escolha. Detalhes do sistema de movimento: [`docs/motion.md`](./motion.md).

## Visão geral

Site de uma assistência técnica local (São José do Rio Preto/SP) com loja online.
Público: morador ou síndico com um problema agora (luz, vazamento, bateria), quase
sempre no celular. O trabalho de cada página é levar a uma de duas ações:
**chamar no WhatsApp** ou **comprar a peça**. Tudo o mais (números, fotos, passos,
avaliações) existe para dar confiança a essas duas ações.

## Layout

| Item | Valor | Por quê |
|---|---|---|
| Contêiner | `container-page`: largura máx. 80rem (1280 px), margem lateral 16 px → 24 px (≥640) → 32 px (≥1024) | gutter de 16 px no celular, sem rolagem horizontal |
| Grade | CSS grid do Tailwind; 1 coluna no celular, 2–4 colunas a partir de `sm`/`lg` | |
| Ritmo vertical | seções `py-16 sm:py-24` (64 → 96 px) | respiro uniforme entre blocos |
| Header | 64 px no celular; 88 px no desktop no topo, 64 px visíveis depois de 80 px de scroll | os heróis passam por baixo dele (`-mt-16 pt-16 lg:-mt-22 lg:pt-22`) |
| Rolagem até âncoras | `scroll-padding-top: 6rem` e Lenis com `offset: -88` | o header nunca cobre o alvo nem o foco |

## Tokens

### Cor

| Token | Valor | Uso |
|---|---|---|
| `--brand` | `#0b63d6` | botão principal, ícones, linha de progresso |
| `--brand-ink` | `#0b63d6` | texto azul sobre fundo claro (5,6:1) |
| `--brand-soft` / `--brand-soft-ink` | `#e8f1fd` / `#0a4fa8` | chips, ícones em fundo claro (7:1) |
| `--cta` / `--cta-foreground` | `#f59e0b` / `#0f172a` | ação principal (WhatsApp, adicionar ao carrinho). Âmbar **só com texto escuro** |
| `--navy` / `--navy-foreground` | `#0b1b33` / `#e6edf7` | faixa de números, rodapé, cards escuros |
| `--foreground` / `--muted-foreground` | `#0f172a` / `#5b6b80` | texto / texto secundário (≥ 4,5:1 sobre branco e `--surface`) |
| `--surface` / `--border` / `--input` | `#f8fafc` / `#e2e8f0` / `#8391a5` | fundos de seção, bordas, borda de campo (3:1) |
| `--whatsapp` | `#189a4a` | botão flutuante (ícone branco 3,6:1, componente gráfico) |
| `--success` / `--destructive` | `#15803d` / `#b91c1c` | "Adicionado!", erros |

O site usa **sempre o tema escuro** (classe `dark` no `<html>`, tokens em `:root.dark`; ver D36). Os valores claros acima continuam no CSS caso se queira voltar a seguir o aparelho.

### Tipografia

Par tipográfico (v3, D37): **Source Serif 4** nos títulos (peso 600, `letter-spacing: -0.01em`,
`text-wrap: balance`) e **IBM Plex Sans** no texto e na interface (400 texto, 500 rótulos, 600
botões, 700 preços). Só a serifada é pré-carregada (é a fonte do LCP). Parágrafos com
`text-wrap: pretty` e `line-height: 1.6`.

Escala: 13 / 14 / 16 / 18 px no texto (`text-xs` a `text-lg`) e razão 1,25 nos títulos:
20 / 25 / 31 / 39 / 49 / 61 px (`text-xl` a `text-6xl`, redefinidos no `@theme`).

| Papel | Classe | Tamanho |
|---|---|---|
| h1 do herói | `text-4xl sm:text-5xl lg:text-6xl`, `leading-[1.05]` | 39 → 49 → 61 px |
| h2 de seção | `text-3xl sm:text-4xl` | 31 → 39 px |
| Rótulo de seção | `eyebrow`: 14 px, bold, cor `--brand-ink`, com traço âmbar de 20 px antes | em frase normal (sem caixa-alta) |
| Números | `tabular` (`font-variant-numeric: tabular-nums`) | preços, contadores, badge |

### Forma, profundidade, espaço

| Token | Valor |
|---|---|
| `--radius` | 12 px (`rounded-xl`); cards `rounded-2xl` (18 px), painéis `rounded-3xl` (24 px), chips/botões redondos `rounded-full` |
| `--shadow-soft` | sombra padrão de card |
| `--shadow-lift` | sombra de card em destaque/hover (azulada) |
| Espaço | escala do Tailwind (4 px); alvos de toque ≥ 44 px (`min-h-11`, `size-11`) |

### Movimento

| Token | Valor | Uso |
|---|---|---|
| `--dur-micro` | 200 ms | hover, toque, troca de ícone |
| `--dur-enter` | 500 ms | entradas de conteúdo |
| `--dur-page` | 350 ms | transição de página |
| `--dur-reduced` | 120 ms | fade único com movimento reduzido |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | padrão de entrada |
| `--spring` | `linear(…)` amostrado da mola k400/c30 (600 ms) | drawer, header, badge, WhatsApp |

## Componentes

| Componente | Arquivo | Props / variantes | Observações |
|---|---|---|---|
| `Button` | `components/ui/button.tsx` | `variant`: default, cta, outline, secondary, ghost, inverse, outline-inverse, destructive, link · `size`: sm, default, lg, xl, icon, icon-sm, icon-lg · `loading`, `loadingLabel` | aperto 0,97 em `:active`; ripple pelo `RippleRoot`; `loading` põe spinner por cima sem mudar a largura e `aria-busy` |
| `Reveal` / `RevealItem` | `components/motion/reveal.tsx` | `as`, `variant` (up/scale), `stagger`, `delay` (ms) | marcação pura; o `RevealRoot` observa. Não usar no LCP |
| `RevealImage` | idem | `delay` | clip-path de baixo para cima + zoom 1,08 → 1 (800 ms) |
| `SplitWords` | idem | `text` | título palavra por palavra (CTA final); frase inteira em `sr-only` |
| `CountUp` | `components/motion/count-up.tsx` | `value`, `decimals`, `prefix`, `suffix` | HTML já traz o valor final; anima de 0 só se montar fora da tela |
| `StickyHeader` | `components/layout/sticky-header.tsx` | — | ver estados abaixo; `revealHeader()` força visível |
| `CartButton` | `components/shop/cart-button.tsx` | — | `data-cart-target` (alvo do voo); pulo com mola; badge com flip |
| `CartDrawer` | `components/shop/cart-drawer.tsx` (+ `cart-drawer-lazy.tsx`) | — | carrega sob demanda; itens em cascata; remoção com "Desfazer" |
| `FaqList` | `components/sections/faq-list.tsx` | `faq` | resposta sempre no HTML; abre por `grid-template-rows` |
| `Field` | `components/forms/field.tsx` | `id`, `label`, `error`, `hint`, `optional`, render prop | liga `aria-describedby`; shake de 4 px no erro |
| `WhatsAppFloat` | `components/layout/whatsapp-float.tsx` | — | mensagem usa o `<h1>` da página; sobe na página de produto (barra fixa) |
| `HowItWorksSteps` | `components/sections/how-it-works-steps.tsx` (+ `-pinned.tsx`) | `heading`, `steps` | fixada no desktop com movimento; lista no resto |
| `Marquee` | `components/home/marquee.tsx` | — | marcas em texto (sem logotipos de terceiros) |
| `HeroParticles` | `components/home/hero-particles.tsx` | — | three.js, 520 pontos, animação no shader |
| `HeroShortcuts` | `components/home/hero-shortcuts.tsx` | — | atalhos do herói (Leva e Traz em destaque); `prefetch={false}` |
| `InstallationToggle` | `components/shop/installation-toggle.tsx` | `checked`, `onChange` | mão de obra de instalação: item separado, sob orçamento |
| `LevaETrazForm` | `components/forms/leva-e-traz-form.tsx` | — | 2 etapas (trajeto → contato), validação por etapa, foco no título da etapa |
| `PrivateServiceForm` | `components/forms/private-service-form.tsx` | — | o que precisa, endereço, telefone, melhor horário |

## Estados e interações

| Elemento | Estado | Comportamento |
|---|---|---|
| Button | hover | cor `*-hover` (troca imediata, sem transição de cor) |
| Button | pressionado | `scale(0.97)` em 150 ms + ripple a partir do ponto do clique (550 ms, `currentColor` a 22%) |
| Button | loading | conteúdo invisível no lugar, spinner centralizado, `aria-busy`, leitor ouve `loadingLabel` |
| Button | desabilitado | 50% de opacidade, sem ponteiro |
| Header | topo | transparente, 88 px (desktop) |
| Header | > 80 px | fundo `bg-background/85` + blur + sombra; camada encolhe 88 → 64 px (scaleY) e a barra sobe 12 px |
| Header | rolando para baixo (> 480 px) | some (`translateY(-100%)`, mola) |
| Header | rolando para cima / foco dentro / produto voando | volta |
| Adicionar ao carrinho | clique | botão vira "Adicionado!" (1,8 s) → miniatura voa (700 ms) → item entra, ícone pula, badge vira → drawer abre 380 ms depois |
| Drawer | abrir | desliza da direita com a mola (600 ms); itens em cascata de 60 ms |
| Drawer | remover item | item sai para a direita (200 ms) e a altura fecha (250 ms); faixa "Desfazer" por 8 s |
| FAQ | clicar/Enter | abre em 300 ms; chevron gira 180° em 200 ms; um aberto por vez |
| Campo | erro | campo treme 4 px (320 ms); mensagem entra com fade + 4 px |
| Galeria do produto | trocar foto | crossfade de 300 ms; lupa 1,8× seguindo o mouse (só com mouse) |
| Catálogo | filtrar | cards que ficam deslizam ao novo lugar (layout), os que saem encolhem e somem |
| WhatsApp | carga | entra aos 2 s com a mola; pulso a cada 8 s |
| WhatsApp | hover/foco | rótulo "Chamar no WhatsApp" se revela para a esquerda (clip-path, 250 ms) |
| Produto / carrinho | contratar instalação | linha própria "Instalação: <peça>", "sob orçamento", fora do subtotal; dá para tirar só a instalação |
| Leva e Traz | Continuar / Voltar | valida a etapa; a nova etapa desliza 24 px na direção do avanço (500 ms); barra de progresso em `scaleX` |
| Formulários novos | enviado | cartão de sucesso entra com a mola, com WhatsApp já preenchido com o pedido |

## Responsivo

| Faixa | Mudanças |
|---|---|
| < 640 px | 1 coluna; fotos flutuantes do herói escondidas; barra fixa de compra na página de produto |
| < 768 px | **sem** parallax, partículas 3D e seção fixada; Lenis só com mouse/trackpad |
| ≥ 768 px | parallax de 3 camadas (0,3 / 0,6 / 1), partículas, "Como funciona" fixado (2 colunas) |
| ≥ 1024 px | navegação completa no header; header de 88 px que encolhe; seção fixada 5/7 colunas |

## Casos de borda

- **Sem JavaScript:** os estados ocultos das revelações só valem com a classe `.js`; sem JS tudo aparece. O FAQ abre tudo via `<noscript>`.
- **JS que não carrega:** se o `RevealRoot` não sinalizar em 4 s, o script do `<head>` tira a classe `.js` e o conteúdo aparece.
- **Sem WebGL:** as partículas não montam; fica a aurora em CSS.
- **Carrinho vazio:** drawer mostra estado vazio com "Ver peças e baterias"; checkout idem.
- **Produto sem estoque:** botão vira "Consultar disponibilidade" no WhatsApp (não entra no carrinho).
- **Nomes longos:** títulos de produto com `line-clamp-2`; nomes no drawer com `truncate`.
- **Fim da página:** elementos nos últimos 100 px (que nunca cruzariam a margem de -100 px) aparecem quando o scroll chega ao fim.
- **Navegação no cliente:** a página entra com fade + 12 px; a primeira carga não anima (não atrasa o LCP).

## Movimento (resumo)

| Elemento | Gatilho | Animação | Duração | Curva |
|---|---|---|---|---|
| Blocos (`Reveal`) | entrar na tela (-100 px, uma vez) | opacidade 0 → 1, y 24 → 0 | 500 ms (+80 ms por item) | ease-out |
| Foto (`RevealImage`) | entrar na tela | clip-path de baixo para cima + zoom 1,08 → 1 | 800 ms | ease-out |
| h1 do herói | carga | palavras sobem 0,45 em (sem esconder) | 500 ms, +40 ms por palavra | ease-out |
| Título do CTA final | entrar na tela | palavras sobem de dentro de uma janela | 500 ms, +50 ms por palavra | ease-out |
| Contadores | entrar na tela | 0 → valor | 800 ms | ease-out |
| Barra de progresso | scroll | `scaleX` = progresso | contínuo | — |
| "Como funciona" | scroll (fixado) | linha `scaleY`, número ativo 1 → 1,35, painéis cruzando | contínuo / mola | spring |
| Marquee | sempre (pausa no hover/foco) | `translateX` -50% | 38 s, linear | — |
| Página | navegação no cliente | fade + 12 px | 350 ms | ease-out |

Com **movimento reduzido** (sistema ou botão "Pausar animações" no rodapé): tudo vira fade de 120 ms,
sem deslocamento, parallax, 3D, seção fixada nem Lenis.

## Acessibilidade

- **Ordem de foco:** skip link → faixa de atendimento (telefone) → logo → navegação → telefone → carrinho → conteúdo → rodapé.
- **Drawer e menu:** diálogos modais (Base UI): foco preso, `Esc` fecha e devolve o foco ao botão que abriu.
- **FAQ:** `<h3><button aria-expanded aria-controls>` + `role="region"`; painel fechado é `inert`.
- **Formulários:** rótulo visível, `aria-invalid`, `aria-describedby` para dica/erro, foco no primeiro erro ao enviar.
- **Contadores e títulos animados:** valor/frase final em `sr-only`; a parte animada é `aria-hidden`.
- **Decorativos:** marquee, partículas, fotos flutuantes, ripple e clone do voo são `aria-hidden`.
- **WCAG 2.2.2:** botão "Pausar animações" no rodapé (lembrado entre visitas).
- **Verificação:** `node scripts/qa/a11y.mjs` (axe-core em 11 páginas × 2 larguras + estados abertos + teclado + zoom 200% + alvos de 44 px).
