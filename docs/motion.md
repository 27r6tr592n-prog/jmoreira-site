# Sistema de movimento

O diferencial do site é o movimento, mas ele obedece a um contrato: **nunca atrapalhar
quem tem um problema em casa e está no celular com pressa**. Tudo aqui foi medido
contra Lighthouse mobile ≥ 90 (ver o README) e respeita quem pede menos movimento.

## Regras

1. **Só `transform` e `opacity`.** Exceções documentadas (D18): `clip-path` na revelação
   de foto e no rótulo do WhatsApp; altura no colapso do drawer e no FAQ
   (`grid-template-rows`); `stroke-dashoffset` no anel do "voltar ao topo".
2. **Durações:** micro 150–250 ms, entradas 400–600 ms, página 300–400 ms, nada acima de 800 ms.
   Exceção: loops decorativos (aurora, marquee), que param com "Pausar animações".
3. **Curvas:** ease-out `[0.22, 1, 0.36, 1]` para entradas; mola `stiffness 400 / damping 30`
   para o que "pula" (drawer, header, badge, ícone do carrinho, WhatsApp).
4. **Movimento reduzido** (sistema **ou** botão "Pausar animações" no rodapé): tudo vira
   **fade de 120 ms**, sem deslocamento, parallax, 3D, seção fixada, voo ao carrinho nem Lenis.
5. **Efeitos caros só a partir de 768 px:** parallax, partículas 3D e seção fixada.
6. **CLS < 0,1:** nada anima tamanho de layout na carga; quem entra já ocupa o espaço final.

## Tokens

Os mesmos valores existem em CSS (`app/globals.css`) e em JS (`lib/motion.ts`).

| Nome | CSS | JS | Valor |
|---|---|---|---|
| micro | `--dur-micro` | `duration.micro` | 200 ms |
| entrada | `--dur-enter` | `duration.enter` | 500 ms |
| página | `--dur-page` | `duration.page` | 350 ms |
| reduzido | `--dur-reduced` | `duration.reduced` | 120 ms |
| máximo | — | `duration.max` | 800 ms |
| ease-out | `--ease-out` | `easeOut` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| mola | `--spring` (600 ms) | `spring` | k 400, c 30 (ζ = 0,75) |
| revelação | — | `REVEAL_Y`, `STAGGER` | 24 px, 80 ms |

### A mola em CSS

`--spring` é a resposta da mola k400/c30 amostrada em 31 pontos e escrita como
`linear(...)`. Assim o drawer, o header e o WhatsApp têm a mesma "física" do Motion
sem carregar a biblioteca. O `CartButton` usa a mesma curva na Web Animations API.

## Onde cada efeito mora

O Motion (`motion/react`, 45 kB gz) **não entra no JS inicial**. Fica só nas partes que
já carregam sob demanda, envolvidas em `<MotionScope>`:

| Com Motion (sob demanda) | Sem biblioteca (CSS + um pouco de JS) |
|---|---|
| Drawer do carrinho (`AnimatePresence`, colapso de altura) | Revelação ao rolar (`<Reveal>` + `RevealRoot`) |
| Catálogo da loja (`layout`, com `domMax`) | Header inteligente |
| Galeria do produto (crossfade) | Barra de progresso e "voltar ao topo" |
| "Como funciona" fixado (`useScroll`, só desktop) | Contadores, título palavra por palavra |
| | Voo ao carrinho, pulo e badge (Web Animations API) |
| | Botões (aperto, ripple), FAQ, erro de campo, WhatsApp, transição de página |

Por quê: com o Motion em todos os blocos, a home hidratava ~76 componentes animados e a
nota mobile ficava em 74–84. Movendo o que é simples para CSS (mesmos valores), ela foi
para 93–94 sem perder nenhum efeito (D25).

## Componentes

### `<Reveal>` / `<RevealItem>` / `<RevealImage>` / `<SplitWords>`

```tsx
<Reveal>…</Reveal>                         // sobe 24 px + fade, 500 ms
<Reveal variant="scale" delay={120}>…</Reveal>
<Reveal as="ul" stagger>                   // filhos em cascata de 80 ms
  {items.map((i) => <RevealItem as="li" key={i.id}>…</RevealItem>)}
</Reveal>
<RevealImage className="relative aspect-[4/3]"><Image fill … /></RevealImage>
<h2><SplitWords text="Problema em casa? Chame a JMoreira para já." /></h2>
```

São só marcação (funcionam em Server Components). O `RevealRoot` (no layout) observa
todos os `[data-reveal]` com **um** IntersectionObserver (`rootMargin: -100px` embaixo,
uma vez), marca `data-shown` e, terminada a transição, `data-done`. Depois disso as
regras de revelação saem e o elemento volta a usar as próprias transições (hover dos cards).

- Sem JS: os estados ocultos dependem da classe `.js`, então tudo aparece.
- Se o JS não carregar em 4 s, o script do `<head>` remove `.js`.
- **Não use no LCP** (título do herói): ele usa `words-up`, que anima sem esconder.

### Header (`StickyHeader`)

| Gatilho | Efeito |
|---|---|
| scroll > 80 px | fundo com blur e sombra aparecem (opacidade); no desktop a camada encolhe de 88 para 64 px (`scaleY`) e a barra sobe 12 px |
| rolando para baixo depois de 480 px | some com a mola (`transform: translateY(-100%)`) |
| rolando para cima, foco dentro ou `revealHeader()` | volta |

O `transform` é explícito (não a utilidade `translate` do Tailwind v4) porque o voo ao
carrinho lê a posição do header com `DOMMatrix`.

### Voo ao carrinho (`lib/fly-to-cart.ts`)

1. Pede o header visível e mira onde o ícone **vai** estar.
2. Clona a miniatura (`[data-fly-source]`) em dois níveis: o de fora anda em X com
   ease-out, o de dentro em Y com ease-in e encolhe. A soma desenha um arco (700 ms).
3. Quando pousa, o item entra no carrinho: ícone pula, número do badge vira.
4. O drawer abre 380 ms depois.

Com movimento reduzido, o item entra direto e o drawer abre na hora.

### Hero

| Camada | Velocidade | Conteúdo |
|---|---|---|
| fundo | 0,3× | aurora (CSS), grade técnica, partículas 3D |
| meio | 0,6× | fotos reais da JMoreira |
| frente | 1× | texto e card do atendimento |

As partículas (`hero-particles.tsx`) são three.js puro: 520 pontos, animação toda no
vertex shader (`uTime`), DPR ≤ 1,5, pausa com a aba oculta e com o herói fora da tela,
amortecimento exponencial no mouse (igual a 60 ou 120 Hz). Carregam com `next/dynamic`
depois do `requestIdleCallback`, só ≥ 768 px e sem movimento reduzido. Tamanho: 136 kB gz
(orçamento: 150 kB).

### "Como funciona" fixado

A seção tem 340 vh; o conteúdo fica `sticky` por 240 vh de scroll (60 vh por passo).
A linha da esquerda é `scaleY` ligado ao progresso; o número ativo cresce para 1,35 com
a mola; os painéis com as fotos cruzam nas fronteiras (opacidade + 40 px). A versão
fixada só é baixada no desktop com movimento; até chegar, mostra-se a lista simples.

## Como desligar

- **Usuário:** "Pausar animações" no rodapé (`html[data-motion="off"]`, lembrado no
  `localStorage`) ou a preferência do sistema.
- **Código:** `useReducedMotion()` (React) ou `motionDisabled()` (fora do React), ambos em
  `lib/`. Para efeitos caros, `useRichMotion()` (desktop e sem movimento reduzido).
- **Um efeito só:** remova o componente; nenhum efeito é necessário para o conteúdo aparecer.

## Como testar

```bash
npm run build && npx next start -p 3200
node scripts/qa/e2e.mjs          # header, contadores, seção fixada, 3D, carrinho, checkouts, reduced motion
node scripts/qa/reveal-check.mjs # contrato da revelação (normal e reduzido)
node scripts/qa/a11y.mjs         # axe-core + teclado + zoom 200%
scripts/qa/lighthouse.sh http://localhost:3200/ /tmp/lh.json   # mobile
scripts/qa/lighthouse.sh http://localhost:3200/ /tmp/lh.json desktop
node scripts/qa/profile.mjs      # perfil de CPU da carga (celular, CPU 4× mais lenta)
```
