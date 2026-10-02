# JMoreira Serviços — site institucional + loja

Novo site da **JMoreira Serviços** (São José do Rio Preto/SP): assistência técnica
emergencial (elétrica, hidráulica, energia solar) e loja online de peças hidráulicas
e baterias.

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui** (variante Base UI) para componentes base
- **Supabase** para catálogo, pedidos, leads e cadastro de prestadores
- **Zustand** (carrinho persistido em `localStorage`)
- **React Hook Form + Zod** em todos os formulários
- **MDX** para o blog (`/dicas`)
- Pensado para deploy na **Vercel**

O site funciona **sem nenhuma credencial**: sem Supabase configurado, o catálogo vem
de `lib/mock-data.ts` (mesma tipagem do banco) e os formulários registram os envios
no log do servidor. Sem Mercado Pago configurado, o pagamento online cria o pedido e
orienta o cliente a concluir pelo WhatsApp.

---

## 1. Instalação

Requisitos: Node.js 20.9+ (recomendado 22) e npm.

```bash
npm install
cp .env.example .env.local   # preencha o que tiver; tudo é opcional para rodar
npm run dev                  # http://localhost:3000
```

Build de produção:

```bash
npm run build && npm start
```

## 2. Variáveis de ambiente

| Variável | Obrigatória? | Para que serve |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim, em produção | URL canônica (sitemap, Open Graph, JSON-LD). Ex.: `https://jmoreiraassistencia.com.br` |
| `NEXT_PUBLIC_SUPABASE_URL` | Não | URL do projeto Supabase. Sem ela, usa os dados mockados |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Não | Chave pública (anon) do Supabase, para leitura do catálogo |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Chave **secreta**, usada só no servidor para gravar pedidos, leads e prestadores. Nunca exponha no cliente |
| `MERCADOPAGO_ACCESS_TOKEN` | Não | Token de produção ou teste do Mercado Pago. Sem ele, o pagamento online fica em modo “pendente” |
| `MERCADOPAGO_WEBHOOK_SECRET` | Não | Assinatura dos webhooks do Mercado Pago (veja `lib/payments/mercadopago.ts`) |

Nenhuma chave fica no código. Na Vercel, cadastre as variáveis em
*Project → Settings → Environment Variables*.

## 3. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode `supabase/schema.sql` (tabelas, índices, RLS e categorias).
3. Para popular o catálogo com os produtos de exemplo, rode `supabase/seed.sql`.
   Esse arquivo é gerado a partir de `lib/mock-data.ts` com:
   ```bash
   npm run db:seed-sql
   ```
4. Copie a URL e as chaves (*Project Settings → API*) para o `.env.local`.

Tabelas: `categories`, `products`, `orders`, `order_items`, `leads`, `providers`.
As políticas de RLS liberam **apenas leitura** de produtos/categorias ativos para o
público. Toda escrita passa pelo servidor com a `service_role`.

**Banco criado antes da v3?** O `schema.sql` já traz os dois ajustes, que podem ser
rodados sozinhos: `order_items.installation_requested` (mão de obra pedida junto com a
peça) e `leads.name` aceitando vazio (Leva e Traz e serviço particular não pedem nome).

> ⚠️ **Sem as chaves do Supabase, nenhum formulário chega a ninguém**: contato, Leva e
> Traz, serviço particular e prestadores só ficam no log do servidor. Até configurar,
> a tela de "enviado" de cada formulário oferece o WhatsApp com o pedido já escrito.

Os tipos TypeScript do banco ficam em `lib/supabase/types.ts`. Se o schema mudar,
regenere com `npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts`.

## 4. Pagamentos (Mercado Pago)

O módulo fica isolado em `lib/payments/`:

- `types.ts` — interface `PaymentProvider` (qualquer gateway novo implementa ela)
- `mercadopago.ts` — implementação via Checkout Pro (preferência + redirecionamento)
  usando a API REST direto, sem SDK. Funciona como stub enquanto não houver token
- `index.ts` — escolhe o provedor conforme as variáveis de ambiente

Para ativar: crie uma aplicação em *Mercado Pago Developers*, coloque o Access Token
de **teste** em `MERCADOPAGO_ACCESS_TOKEN`, faça uma compra com os cartões de teste e
só então troque pelo token de produção. Configure a URL de notificação para
`https://SEU_DOMINIO/api/pagamentos/webhook` e a assinatura em
`MERCADOPAGO_WEBHOOK_SECRET`. O módulo não foi exercitado contra a API real (não havia
credencial): valide no ambiente de teste antes de publicar.

O preço é **sempre recalculado no servidor** a partir do catálogo; o valor enviado
pelo navegador é ignorado.

## 5. Frete

`lib/shipping.ts` calcula o frete por faixa de CEP, sem depender de serviço externo:

- **São José do Rio Preto** (CEP 15000-000 a 15099-999): entrega própria, no mesmo dia
  para itens em estoque com pedido até as 15h; grátis acima do valor configurado
- **Região** (demais CEPs 15xxx): entrega própria em 1 a 2 dias úteis
- **Demais localidades**: só peças hidráulicas, por transportadora (valor estimado)
- **Baterias** não são enviadas por transportadora (são produto perigoso e exigem a
  devolução da bateria usada); só entrega na região ou retirada
- **Retirada na loja**: grátis, na Rua Lázaro Camargo Enke, 2282

Os valores estão em `lib/config.ts`. Quando houver contrato com transportadora
(Melhor Envio, Correios etc.), troque a função `quoteShipping` pela chamada à API.

## 6. Movimento, animações e desempenho

O movimento é o diferencial do site. O manual completo (tokens, regras, cada efeito,
como desligar e como testar) está em [`docs/motion.md`](docs/motion.md); a especificação
de componentes e estados, em [`docs/handoff.md`](docs/handoff.md); as decisões, em
[`DECISIONS.md`](DECISIONS.md).

**Regras:** só `transform`/`opacity` (exceções documentadas), entradas de 500 ms com
ease-out `[0.22, 1, 0.36, 1]`, mola k400/c30, nada acima de 800 ms. Com "reduzir
movimento" do sistema **ou** o botão **Pausar animações** do rodapé, tudo vira um fade de
120 ms, sem parallax, 3D, seção fixada nem smooth scroll. Parallax, 3D e seção fixada só
a partir de 768 px.

| Onde | O quê | Arquivo |
|---|---|---|
| Todo o site | Smooth scroll (Lenis, só com mouse), barra de progresso âmbar, header que encolhe/some/volta, ripple e aperto nos botões, transição de página | `motion-provider.tsx`, `scroll-progress.tsx`, `sticky-header.tsx`, `ripple-root.tsx`, `app/template.tsx` |
| Todo o site | Revelação ao rolar (24 px, cascata de 80 ms), foto que se revela de baixo para cima, título palavra por palavra | `components/motion/reveal.tsx` + `reveal-root.tsx` |
| Herói | Parallax de 3 camadas, partículas 3D (three.js), título palavra por palavra | `hero.tsx`, `hero-fx.tsx`, `hero-particles.tsx` |
| Home | Contadores (120 min, +2.500, 4,8, 86), faixa infinita com as marcas de bateria, "Como funciona" fixado com linha de progresso | `trust-bar.tsx`, `marquee.tsx`, `how-it-works-*.tsx` |
| Loja | Voo da miniatura até o carrinho, pulo do ícone e flip do número, drawer com mola, filtros com animação de layout, crossfade na galeria, skeletons | `lib/fly-to-cart.ts`, `cart-button.tsx`, `cart-drawer.tsx`, `shop-catalog.tsx`, `product-gallery.tsx`, `skeletons.tsx` |
| Formulários | Campo treme no erro, mensagem com fade; botão com carregamento sem mudar de largura | `field.tsx`, `ui/button.tsx` |
| FAQ, WhatsApp | Acordeão com chevron girando; botão flutuante que entra aos 2 s, pulsa e se expande | `faq-list.tsx`, `whatsapp-float.tsx` |
| Mantidos | Diagnóstico rápido, "Atendemos seu bairro?", "Qual bateria serve?", galeria, Instagram | ver D21 |

### Lighthouse (build de produção, local)

Medido com Lighthouse 12 + Chromium do Playwright (home: 3 execuções):

| Página e perfil | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, mobile (simulado, CPU 4×) | **93–95** | 100 | 100 | 100 | 2,5 s | 170–230 ms | 0 |
| Home, desktop | **99** | 100 | 100 | 100 | 0,7 s | 0 ms | 0,004 |
| Loja, mobile | **90** | 100 | 100 | 100 | 2,9 s | 260 ms | 0 |
| Produto, mobile | **97** | 100 | 100 | 100 | 2,5 s | 40 ms | 0 |

O número na Vercel (rede e CPU reais) pode variar; rode `scripts/qa/lighthouse.sh` ou o
PageSpeed Insights depois do deploy. A loja é a página mais justa (grade com 37 produtos);
se cair abaixo de 90 com o catálogo real, pagine a grade.

JS inicial da home: **~165 kB gz** (era 225 kB antes da otimização). three.js (136 kB gz)
e Motion só carregam quando usados.

## 7. O que o cliente precisa fornecer ou conferir

**Material**
- [ ] **Logo vetorial (SVG)**: o site usa o símbolo oficial em PNG (`public/logo-jmoreira.png`,
      extraído do site antigo). Pedir ao designer a versão SVG para nitidez máxima
- [x] **Fotos reais** em uso: 12 fotos publicadas pela própria JMoreira no Perfil da
      Empresa no Google (`public/fotos/`) e 5 posts do Instagram (`public/instagram/`)
- [ ] **Autorização de imagem** das pessoas que aparecem nas fotos (equipe e técnicos)
- [ ] **Foto de limpeza de placas solares**: a única que segue provisória (`lib/services.ts`).
      A do site antigo e a do Google são de banco de imagens
- [ ] Fotos que **não** foram usadas por serem de banco de imagens sem licença confirmada:
      `banner.png` e `Group-11...png` do site antigo; painel solar, ar-condicionado,
      sifão e pintura do Perfil no Google
- [ ] **Fotos dos produtos**: hoje são ilustrações em `public/produtos/`. Basta trocar
      os arquivos ou cadastrar as URLs no campo `images` da tabela `products`
- [ ] **Imagem de compartilhamento**: as imagens do Open Graph são geradas por código
      (`opengraph-image.tsx`); se quiser uma arte própria, coloque
      `app/opengraph-image.png`

**Novidades da v3 a definir**
- [ ] **Leva e Traz: preços.** O site diz "valor a combinar". A pesquisa de preços da região
      (com fontes) está no PR da v3; se quiserem publicar valores, é só informar
- [ ] **Leva e Traz: transporte de pessoas e executivo** pode exigir autorização da
      prefeitura / ARTESP e seguro de passageiros. Confirmar a regularidade antes de divulgar
- [ ] **Mão de obra de instalação:** hoje "sob orçamento". Se houver tabela (ex.: instalar
      bateria, trocar torneira), dá para mostrar o valor no produto e no carrinho
- [ ] **Limpeza de placas solares:** confirmar se há verificação junto (hoje o site diz
      que a JMoreira faz **só** a limpeza)

**Dados a confirmar**
- [ ] **Horário divergente:** o briefing diz 7h às 21h, mas o Perfil da Empresa no
      Google mostra **8h às 18h**. Unificar (site, Google e WhatsApp). Hoje o site usa 7h–21h
- [ ] **"24 Horas" no logo e nos posts** ("Assistência 24 Horas") conflita com o horário
      de atendimento. Decidir a promessa e alinhar a marca
- [x] Grafia da rua: mantida "Lázaro Camargo **Enke**", igual ao Google (os Correios
      grafam "Emke")
- [x] Coordenadas: calculadas a partir do Plus Code do Perfil no Google (5JM3+5C)
- [ ] Telefone principal: o Google mostra o WhatsApp (17) 99652-3680; o site destaca o
      fixo (17) 3214-4800. Escolher um como principal nos dois lugares
- [ ] Formas de pagamento aceitas no atendimento técnico
- [ ] Afirmações a confirmar nos textos: emissão de nota fiscal para empresas
      (manutenção predial e frotas), projeto e ART de engenheiro na energia solar,
      etapas e cursos do credenciamento de prestadores
- [ ] Os depoimentos não trazem nome de cliente (só os dos técnicos citados). Se quiser
      nomes, use os que aparecem publicamente no Google
- [ ] Preços, estoque, marcas e garantias dos produtos (os do catálogo são de exemplo)
- [ ] **Marcas da faixa corrida** (Moura, Heliar, Bosch, Pioneiro, Zetta): confirmar que a
      loja vende todas. Bosch 60Ah e Pioneiro 50Ah foram incluídas no catálogo de exemplo
- [ ] Regras de frete e valor mínimo para frete grátis (`lib/config.ts`)
- [ ] Escopo do serviço **Frotas** (texto em `lib/services.ts`)
- [ ] Lista de bairros e cidades atendidas (`lib/site.ts`)
- [ ] Textos de política de privacidade, trocas e entrega (`/politicas`): revisão jurídica

**Contas e chaves**
- [ ] Projeto Supabase + chaves
- [ ] Conta Mercado Pago + Access Token
- [ ] Google Search Console: enviar `https://SEU_DOMINIO/sitemap.xml`
- [ ] Perfil da Empresa no Google: usar exatamente o mesmo nome, endereço e telefone
      do site (consistência de NAP é o que mais pesa na busca local)

## 8. Estrutura

```
app/                  rotas (App Router)
  (páginas)           /, /servicos, /loja, /checkout, /quem-somos, /seja-prestador,
                      /dicas, /contato, /politicas
  actions/            server actions (leads, prestadores, pedidos)
  api/                webhook de pagamento
components/
  ui/                 shadcn/ui
  layout/             cabeçalho, rodapé, WhatsApp flutuante
  home/ sections/ shop/ forms/ brand/ seo/
content/dicas/        posts do blog em MDX
lib/
  site.ts             dados da empresa (fonte única)
  config.ts           regras de preço, parcelamento e frete
  mock-data.ts        catálogo de exemplo (mesma tipagem do Supabase)
  catalog.ts          acesso ao catálogo (Supabase ou mock)
  services.ts         conteúdo das páginas de serviço
  payments/           integração de pagamento
  supabase/           clientes e tipos
  store/cart.ts       carrinho (Zustand + localStorage)
supabase/             schema.sql e seed.sql
```

## 9. Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (checa tipos) |
| `npm run start` | Sobe o build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Só a checagem de tipos |
| `npm run db:seed-sql` | Gera `supabase/seed.sql` a partir do catálogo mockado |
| `node scripts/qa/e2e.mjs` | Ponta a ponta: header, contadores, seção fixada, 3D, carrinho, drawer, os dois checkouts, reduced motion, "Pausar animações" (precisa de `next start -p 3200`) |
| `node scripts/qa/a11y.mjs` | axe-core (WCAG 2.1 AA) em 11 páginas × 2 larguras + drawer/menu/erros, teclado, zoom 200%, alvos de 44 px |
| `node scripts/qa/reveal-check.mjs` | Contrato da revelação (normal e reduzido) |
| `scripts/qa/lighthouse.sh <url> <saida.json> [desktop]` | Lighthouse do build |
| `node scripts/qa/profile.mjs` | Perfil de CPU da carga (celular, CPU 4× mais lenta) |
