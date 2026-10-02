# Estratégia de SEO local — JMoreira Serviços

Gerado com a skill `marketing:seo-audit` antes do lançamento. Sem ferramenta de SEO
conectada (Ahrefs/Semrush), volumes e dificuldade são **estimativas qualitativas**
feitas a partir das buscas e dos concorrentes que aparecem para cada termo.

## Panorama da concorrência (set/2026)

- **Eletricista:** sites de nicho com domínio exato (`eletricistasaojoseriopreto.com.br`,
  `eletricista.riopreto.br`) e redes nacionais (0800). Prometem 24h e chegada em 35 a 70
  min, e têm páginas por bairro.
- **Encanador:** foco em caça-vazamento e desentupidora, com o argumento do laudo para
  revisar a conta no SeMAE.
- **Bateria:** lojas especializadas com "entrega e instalação grátis", 10x sem juros e
  chegada em 30 a 45 min.

**Posicionamento da JMoreira:** não competir em "24h" (o atendimento é das 7h às 21h e
prometer o que não se cumpre gera avaliação ruim). O que diferencia a empresa: preço
transparente (visita de R$ 60, descontada no fechamento), nota 4,8 com 86 avaliações,
técnicos licenciados e **serviço + peça no mesmo lugar** (loja própria).

## Mapa palavra-chave → página

| Página | Palavra-chave principal | Secundárias | Intenção |
|---|---|---|---|
| `/` | eletricista e encanador em Rio Preto | assistência técnica residencial Rio Preto, JMoreira | Comercial/navegacional |
| `/servicos` | serviços de manutenção em Rio Preto | eletricista, encanador, energia solar | Comercial |
| `/servicos/eletricista` | eletricista em São José do Rio Preto | troca de disjuntor, instalação de chuveiro, curto-circuito, eletricista de emergência | Transacional |
| `/servicos/encanador` | encanador em Rio Preto | encanador 24h Rio Preto (respondido no FAQ), vazamento, desentupimento, limpeza de caixa d'água | Transacional |
| `/servicos/energia-solar` | manutenção de energia solar em Rio Preto | limpeza de placas solares, instalação de energia solar | Comercial |
| `/servicos/manutencao-predial` | manutenção predial em Rio Preto | manutenção de condomínio, manutenção comercial | Comercial (B2B) |
| `/servicos/manutencao-residencial` | pequenos reparos em Rio Preto | marido de aluguel Rio Preto, reparos em casa | Transacional |
| `/servicos/frotas` | manutenção de frotas em Rio Preto | bateria para frota, socorro de bateria | Comercial (B2B) |
| `/loja` | loja de peças hidráulicas e baterias em Rio Preto | material hidráulico Rio Preto | Transacional |
| `/loja/categoria/baterias` | bateria automotiva Rio Preto | bateria de carro com entrega, bateria estacionária | Transacional |
| `/loja/categoria/hidraulica` | material hidráulico em Rio Preto | reparo de descarga, torneira-boia | Transacional |
| `/loja/[produto]` | {nome do produto} Rio Preto | marca + medida (ex.: bateria Moura 60Ah) | Transacional |
| `/dicas/*` | perguntas ("como identificar vazamento escondido") | People Also Ask | Informacional → serviço |

## Padrões on-page

- **Title:** `{palavra-chave principal} | JMoreira Serviços`, até cerca de 60 caracteres.
  Template no `app/layout.tsx`.
- **Meta description:** 140 a 160 caracteres, com a cidade, um diferencial (visita de
  R$ 60, chegada em até 2h, nota 4,8) e um CTA ("Chame no WhatsApp").
- **H1:** um por página, com a palavra-chave e a cidade. H2 para "O que fazemos",
  "Problemas que resolvemos", "Como funciona" e "Perguntas frequentes".
- **Primeiras 100 palavras:** cidade + serviço + diferencial.
- **URL:** curta, sem acento e com palavra-chave (`/servicos/eletricista`).
- **Alt de imagem:** descreve a cena (`Eletricista da JMoreira trocando disjuntor em quadro de luz`).

## Dados estruturados (JSON-LD)

| Onde | Tipo | Observação |
|---|---|---|
| Todas as páginas | `Electrician` + `Plumber` (LocalBusiness) | NAP, `geo`, horários, `areaServed`, `aggregateRating` 4,8/86, `sameAs` |
| Serviços | `Service` + `FAQPage` + `BreadcrumbList` | `provider` aponta para o `@id` da empresa |
| Produto | `Product` + `Offer` + `BreadcrumbList` | preço, estoque, marca, SKU, política de devolução de 7 dias (CDC) |
| Home e FAQ | `FAQPage` | — |
| Dicas | `BlogPosting` | autor = organização |

> O Google **não exibe estrelas** para `aggregateRating` declarado pela própria empresa
> em `LocalBusiness` (regra de *self-serving reviews*). O dado continua válido, mas as
> estrelas no resultado de busca vêm do **Perfil da Empresa no Google**.

## Linkagem interna

- Home → todos os serviços, as categorias da loja e 3 dicas.
- Cada serviço → 2 a 3 serviços relacionados + produtos ligados (encanador → hidráulica;
  frotas/energia solar → baterias) + a dica correspondente.
- Cada produto → categoria (breadcrumb), relacionados e o serviço de instalação.
- Cada dica → serviço correspondente + produtos citados.

## Checklist técnico

| Item | Status |
|---|---|
| `sitemap.xml` com páginas, serviços, categorias, produtos e dicas | Pronto (`app/sitemap.ts`) |
| `robots.txt` liberando o site e bloqueando `/checkout` e `/api` | Pronto (`app/robots.ts`) |
| Canonical por página (`metadataBase` + `alternates.canonical`) | Pronto |
| `lang="pt-BR"` e Open Graph `locale=pt_BR` | Pronto |
| Imagens Open Graph geradas por página | Pronto (`opengraph-image.tsx`) |
| `next/image`, lazy loading, fontes com `display: swap` | Pronto |
| Página 404 útil (com busca e contatos) | Pronto |
| Search Console + envio do sitemap | **Cliente**, depois do deploy |
| Perfil da Empresa no Google com o mesmo NAP do site | **Cliente** |
| Redirecionamentos 301 das URLs antigas do WordPress | **Cliente/dev**, mapear as URLs antigas antes de trocar o DNS (exemplo em `next.config.ts`) |

## Próximos passos (depois do lançamento)

1. **Páginas por bairro** (como fazem os concorrentes) só com conteúdo real, por exemplo
   atendimentos feitos no bairro e fotos. Página genérica com o nome do bairro trocado
   é conteúdo raso e pode prejudicar o site.
2. **Pedir avaliação no Google** depois de cada atendimento, com link direto enviado pelo
   WhatsApp. É o fator que mais pesa no ranking do Maps.
3. **Uma dica por mês** respondendo dúvidas reais que chegam pelo WhatsApp.
