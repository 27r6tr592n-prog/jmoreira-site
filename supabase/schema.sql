-- =============================================================================
-- JMoreira Serviços — schema do Supabase (PostgreSQL 15+)
-- Rode inteiro no SQL Editor do projeto. É idempotente para as tabelas.
-- Depois, rode supabase/seed.sql para popular o catálogo de exemplo.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
do $$ begin
  create type order_status as enum (
    'pending',            -- criado, aguardando contato (WhatsApp) ou pagamento
    'awaiting_payment',   -- enviado ao gateway
    'paid',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'delivered',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_channel as enum ('whatsapp', 'online');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_method as enum ('delivery', 'pickup');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'converted', 'discarded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type provider_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- categories — árvore de 2 níveis (ex.: hidraulica > registros-e-torneiras)
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  parent_id   uuid references categories(id) on delete restrict,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists categories_parent_idx on categories(parent_id);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  sku                text not null unique,
  name               text not null,
  brand              text not null,
  category_id        uuid not null references categories(id) on delete restrict,
  short_description  text not null,
  description        text not null,
  price              numeric(10,2) not null check (price >= 0),        -- preço à vista
  compare_at_price   numeric(10,2) check (compare_at_price is null or compare_at_price > price),
  stock              int  not null default 0 check (stock >= 0),
  images             text[] not null default '{}',
  -- Especificações técnicas livres: [{ "label": "Bitola", "value": "3/4\"" }, ...]
  specs              jsonb not null default '[]'::jsonb,
  weight_kg          numeric(6,2) not null default 0.5,
  -- Campos de bateria (nulos para hidráulica)
  amperage_ah        int,
  voltage_v          numeric(4,1),
  warranty_months    int,
  -- Preço anunciado pressupõe a entrega da bateria usada (base de troca).
  trade_in_required  boolean not null default false,
  trade_in_surcharge numeric(10,2),   -- acréscimo cobrado se o cliente não entregar a usada
  is_featured        boolean not null default false,
  is_active          boolean not null default true,
  sort_order         int not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_active_idx   on products(is_active, sort_order);
create index if not exists products_brand_idx    on products(brand);
create index if not exists products_search_idx   on products
  using gin (to_tsvector('portuguese', name || ' ' || brand || ' ' || short_description));

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,                 -- ex.: JM-260930-4821
  status           order_status    not null default 'pending',
  channel          order_channel   not null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  delivery_method  delivery_method not null,
  cep              text,
  address          jsonb,                                -- { street, number, complement, district, city, state }
  shipping_label   text,
  subtotal         numeric(10,2) not null check (subtotal >= 0),
  shipping_cost    numeric(10,2) not null default 0 check (shipping_cost >= 0),
  total            numeric(10,2) not null check (total >= 0),
  payment_provider text,                                 -- 'mercadopago' | null
  payment_id       text,
  payment_status   text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists orders_status_idx  on orders(status, created_at desc);
create index if not exists orders_payment_idx on orders(payment_id);

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- order_items — guarda um "retrato" do produto no momento da compra
-- ---------------------------------------------------------------------------
create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  sku          text not null,
  product_name text not null,
  unit_price   numeric(10,2) not null check (unit_price >= 0),
  quantity     int not null check (quantity > 0),
  line_total   numeric(10,2) generated always as (unit_price * quantity) stored,
  -- v3: cliente pediu a mão de obra de instalação junto (item separado, sob orçamento)
  installation_requested boolean not null default false
);
-- Para bancos criados antes da v3:
alter table order_items add column if not exists installation_requested boolean not null default false;
create index if not exists order_items_order_idx on order_items(order_id);

-- ---------------------------------------------------------------------------
-- leads — todos os formulários do site (contato, orçamento, serviços)
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,            -- 'contato' | 'servico' | ...
  name        text not null,
  phone       text not null,
  email       text,
  service     text,
  message     text,
  page_path   text,
  consent     boolean not null default false,  -- aceite LGPD
  status      lead_status not null default 'new',
  created_at  timestamptz not null default now()
);
create index if not exists leads_status_idx on leads(status, created_at desc);

-- ---------------------------------------------------------------------------
-- providers — cadastro de prestadores (/seja-prestador)
-- ---------------------------------------------------------------------------
create table if not exists providers (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  phone             text not null,
  email             text,
  city              text not null,
  specialties       text[] not null,
  experience_years  int not null check (experience_years >= 0),
  experience_notes  text,
  has_cnpj_mei      boolean not null default false,
  consent           boolean not null default false,
  status            provider_status not null default 'pending',
  created_at        timestamptz not null default now()
);
create index if not exists providers_status_idx on providers(status, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Público (anon): só lê categorias e produtos ativos.
-- Escritas (pedidos, leads, prestadores) passam pelo servidor com a service_role,
-- que ignora RLS. Assim nenhum dado de cliente fica exposto pela chave anon.
-- ---------------------------------------------------------------------------
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table leads       enable row level security;
alter table providers   enable row level security;

drop policy if exists "categorias públicas" on categories;
create policy "categorias públicas" on categories
  for select to anon, authenticated using (true);

drop policy if exists "produtos ativos públicos" on products;
create policy "produtos ativos públicos" on products
  for select to anon, authenticated using (is_active);

-- ---------------------------------------------------------------------------
-- Categorias (estáveis; os produtos ficam no seed.sql)
-- ---------------------------------------------------------------------------
insert into categories (slug, name, description, parent_id, sort_order) values
  ('hidraulica', 'Hidráulica', 'Peças para reparo e instalação hidráulica residencial.', null, 1),
  ('baterias',   'Baterias',   'Baterias automotivas, de moto e estacionárias.',          null, 2)
on conflict (slug) do nothing;

insert into categories (slug, name, parent_id, sort_order)
select v.slug, v.name, p.id, v.sort_order
from (values
  ('registros-e-torneiras',  'Registros e torneiras',          'hidraulica', 1),
  ('conexoes-e-tubos',       'Conexões e tubos PVC',           'hidraulica', 2),
  ('reparos-caixa-acoplada', 'Reparos de caixa acoplada',      'hidraulica', 3),
  ('sifoes-e-ralos',         'Sifões e ralos',                 'hidraulica', 4),
  ('valvulas-de-descarga',   'Válvulas de descarga',           'hidraulica', 5),
  ('boias',                  'Boias e torneiras-boia',         'hidraulica', 6),
  ('vedacao-e-adesivos',     'Veda-rosca e adesivos',          'hidraulica', 7),
  ('baterias-automotivas',   'Baterias automotivas',           'baterias',   1),
  ('baterias-estacionarias', 'Baterias estacionárias',         'baterias',   2),
  ('baterias-moto',          'Baterias de moto',               'baterias',   3)
) as v(slug, name, parent_slug, sort_order)
join categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;
