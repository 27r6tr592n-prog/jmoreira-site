# Decisões de escopo — briefing v2 (movimento)

Documento de design produzido com a skill `anthropic-skills:brainstorming`.
O cliente pediu explicitamente que as ambiguidades fossem resolvidas sem
perguntas, escolhendo sempre a opção mais conservadora para um negócio local.
Classificação: **arquitetural** (reestrutura o sistema de movimento e a
interface de componentes compartilhados).

---

## 1. Entendimento

**O que foi pedido (palavras do briefing)**
- Site sério e moderno para a JMoreira, com movimento "de nível alto" como diferencial.
- Stack: Next.js 15, Motion, Lenis, GSAP só se preciso, Three.js + R3F no herói.
- Regras rígidas: só `transform`/`opacity`, durações curtas, `prefers-reduced-motion`
  obrigatório, CLS < 0,1, efeitos caros desligados abaixo de 768 px.
- Lighthouse > 90 em performance **com** as animações. Se um efeito derrubar a nota,
  simplifica-se o efeito.

**O que eu assumi**
- O projeto atual (construído nas rodadas anteriores desta sessão) é a base. O "não
  reaproveite o código antigo" se refere ao WordPress.
- Sucesso = (1) todos os efeitos da seção 3 do briefing implementados, (2) site 100%
  utilizável com reduced motion, (3) Lighthouse mobile ≥ 90, (4) zero erro de TS,
  (5) fluxos de compra testados.

---

## 2. Decisões

### Base do projeto
| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D1 | **Evoluir o projeto existente** | Reescrever do zero | Conteúdo, loja, SEO e fluxos já testados. Reescrever só arrisca regressões |
| D2 | **Manter o logo e as fotos reais** já aprovados pelo cliente; `picsum` só onde não há foto própria (energia solar) | Voltar aos placeholders do briefing | O cliente pediu as fotos reais na rodada anterior |
| D3 | Horário **7h às 21h** (do briefing) | 8h–18h do Perfil no Google | O briefing manda "use exatamente estes". A divergência fica no README para o cliente |
| D4 | Não prometer "24h" | Usar "encanador 24h" em títulos | O atendimento não é 24h. A busca é atendida por um FAQ honesto |

### Bibliotecas
| # | Decisão | Motivo |
|---|---|---|
| D5 | **`motion`** (`motion/react`) com `LazyMotion` + `m.*`, **só nas partes que carregam sob demanda** (`<MotionScope>`: drawer, catálogo, galeria, seção fixada). Revisado em D25 | Na primeira versão o Motion estava em todo o site e custava a nota mobile |
| D6 | **`lenis`** em vez de `@studio-freight/lenis` | O pacote antigo foi renomeado e descontinuado; mesma API |
| D7 | **Sem GSAP** | A seção fixada sai com `position: sticky` + `useScroll` do Motion. GSAP somaria ~45 KB sem necessidade (o briefing só o pede "onde o Motion não dá conta") |
| D8 | **Three.js puro, sem React Three Fiber** | three + R3F passam do teto de 150 KB gz. Three puro, importado sob demanda, cabe. Medido no build (ver `docs/motion.md`) |

### Movimento
| # | Decisão | Motivo |
|---|---|---|
| D9 | **Header fixo sobreposto ao herói**; a "redução de 88 → 64 px" é feita com `transform` (fundo em `scaleY` + conteúdo em `translateY`), não animando `height`. A faixa azul de atendimento (horário, nota, telefone) fica acima dele e sai com o scroll | Respeita a regra "só transform/opacity" e não gera CLS; a faixa é informação útil logo na chegada |
| D10 | **`template.tsx` anima só navegações no cliente**; o primeiro carregamento entra sem animação | Animar a página inteira no SSR esconderia o conteúdo até a hidratação: pior LCP e página em branco sem JS |
| D11 | **Título do herói palavra por palavra em CSS puro**, só `transform` e **sem máscara** (as palavras nascem visíveis e sobem 0,45 em); título do CTA final com "janela" (`SplitWords`) ao entrar na tela | O h1 é o LCP: a versão com máscara fazia o navegador contar o título só ~0,6 s depois e o Lighthouse jogava o LCP para 4 s |
| D12 | Estados ocultos das revelações só com a classe `.js` (sem JS tudo aparece); se o JS não carregar em 4 s, o `<head>` remove `.js` | Quem não tem JS (e o Google) vê o conteúdo; JS quebrado não deixa a página em branco |
| D13 | **"Como funciona" fixado só em ≥ 768 px** e sem reduced motion; no celular, lista com revelação | Fixar seção por 4 telas no celular cansa e pesa |
| D14 | **Barra de confiança vira 4 contadores** (120 min, +2.500, 4,8, 86) | Pedido explícito; licenciados e visita viram selos menores |
| D15 | **Marquee só com nomes das marcas em texto** (sem logotipos) | Logotipos de terceiros exigem autorização. Bosch e Pioneiro entram no catálogo para o marquee não anunciar marca que a loja não vende. O cliente precisa confirmar as marcas |
| D16 | **Produto voa até o carrinho e só depois o drawer abre**; o header reaparece à força para o ícone estar visível | Senão o voo acontece atrás do drawer ou para um ícone escondido |
| D17 | **Drawer com mola em CSS (`linear()`)** sobre o Dialog do Base UI; itens com `AnimatePresence` | Mantém o foco preso e o Esc nativos do Base UI. A mola é reproduzida pela função `linear()` |
| D18 | **Exceções à regra "só transform/opacity"**, todas pedidas no briefing: colapso de altura no drawer e no FAQ, `clip-path` na revelação de imagem | O próprio briefing pede esses três efeitos |
| D19 | **Ripple por delegação global** (`data-ripple`) | Funciona em `<button>` e em links com visual de botão, sem cada componente virar client |
| D20 | **Botão flutuante do WhatsApp**: entra aos 2 s com mola, pulsa a cada 8 s, expande no hover/foco (rótulo revelado por `clip-path`, sem animação de layout). O balão de ajuda das rodadas anteriores sai | Segue o briefing e reduz ruído; a expansão por `layout` exigia o pacote maior do Motion em todas as páginas |
| D21 | **Mantidos** das rodadas anteriores: diagnóstico rápido, "atendemos seu bairro?", "qual bateria serve?", galeria de fotos, Instagram, botão "Pausar animações" | Agregam conversão. O botão de pausa atende à WCAG 2.2.2 (loops longos) e alimenta o mesmo `useReducedMotion` |
| D22 | Inclinação 3D removida dos cards de serviço | O briefing especifica outro hover (sobe 4 px, ícone gira, borda em gradiente) |

### Reduced motion (contrato)
Com `prefers-reduced-motion` **ou** o botão "Pausar animações": Lenis desligado, sem
parallax, sem 3D, sem seção fixada, sem voo ao carrinho, contadores já no valor final
e todas as entradas reduzidas a um fade de 120 ms sem deslocamento.

### Verificação
| # | Decisão |
|---|---|
| D23 | Lighthouse medido localmente com Lighthouse CLI + Chrome for Testing, em perfil mobile e desktop, sobre o build de produção. O número real na Vercel pode variar |
| D24 | Testes de navegador com Playwright (`scripts/qa/*.mjs`, inclusive com `reducedMotion: "reduce"`). As skills `playwright-cli` e `agent-browser` foram carregadas; a CLI `agent-browser` não está instalada, então os roteiros rodam com a biblioteca Playwright |

### Desempenho (rodada final)
| # | Decisão | Motivo |
|---|---|---|
| D25 | **Revelação ao rolar, header, barra de progresso, contadores, WhatsApp, badge, FAQ, erro de campo e transição de página sem biblioteca**: CSS com os mesmos valores (24 px, 80 ms, 500 ms, ease-out, mola em `linear()`) e **um único** IntersectionObserver (`RevealRoot`). Voo ao carrinho com Web Animations API | Com o Motion nesses 76 elementos da home, a nota mobile ficava em 74–84. Sem ele no JS inicial: **93–94**, e nenhum efeito foi removido. O briefing autoriza "simplificar o efeito, não a meta"; aqui nem o efeito mudou, só a implementação |
| D26 | **Lenis carregado só com mouse/trackpad** (`import()` dinâmico) | No toque o Lenis não age (rolagem nativa); baixá-lo no celular era custo sem benefício |
| D27 | **Preço e números formatados à mão** (`formatNumber`/`formatBRL`), saída idêntica ao `Intl` | O primeiro `Intl.NumberFormat("pt-BR")` no navegador custava ~100 ms de CPU na abertura (perfil com CPU 4× mais lenta) |
| D28 | **Drawer do carrinho e menu do celular carregados sob demanda** (ociosidade ou primeiro clique); `sonner` removido (nenhum `toast()` no site) | Tira o Dialog do Base UI (18 kB) e o sonner (11 kB) do JS inicial |
| D29 | **FAQ abre por `grid-template-rows` (CSS)**, resposta sempre no HTML | Mantém o conteúdo indexável e legível sem JS; a altura é exceção prevista em D18 |
| D30 | **Header some com `transform` explícito** (não a utilidade `translate` do Tailwind v4) | O voo ao carrinho lê a posição do header pela matriz de `transform` |
| D31 | **`srcset` com menos larguras** (`deviceSizes` 640–1920) e estrelas/marcadores em texto/CSS | O HTML da home caiu de 415 para ~373 kB; menos a analisar antes da primeira pintura |

### Revisões aplicadas
| # | Decisão | Motivo |
|---|---|---|
| D32 | Rótulos de seção em **frase normal** com traço âmbar (antes: caixa-alta espaçada) | Skill `frontend-design`: caixa-alta espaçada acima de todo título soa a template |
| D33 | Copy: "120 min — prazo de chegada em Rio Preto*", "86 — clientes avaliaram no Google", CTA final "Problema em casa? Chame a JMoreira para já.", "Vazamento ou entupimento? Chame um encanador para já.", WhatsApp sempre "Chamar no WhatsApp" | `brand-review`: "tempo máximo" e "resolvemos hoje" prometiam mais do que o briefing sustenta; o slogan "para já" entra no lugar |
| D34 | Diagnóstico rápido: no celular o painel vazio vira só o atalho do WhatsApp; depoimentos com aspas maiores | `design-critique`: o painel vazio ocupava uma tela inteira abaixo das opções; os cards curtos tinham espaço morto |
| D35 | Títulos inativos da seção fixada com 70% de opacidade (antes 55%) e espaço entre "JMoreira" e "Serviços" no logo | Lighthouse/axe: contraste 4:1 e nome acessível sem o texto visível |
| D36 | **Tema escuro fixo** para todos os visitantes (classe `dark` no `<html>`; antes o tema seguia o modo claro/escuro do aparelho) | Pedido do cliente depois de ver o site publicado: o fundo branco do modo claro não era o visual aprovado. Contraste revalidado com axe-core (0 violações) |

---

## 3. Fora do escopo desta rodada
- Painel interno de pedidos (o briefing só cita `dataviz` "se aparecer").
- Integração real com Mercado Pago (segue como stub, sem credencial).
