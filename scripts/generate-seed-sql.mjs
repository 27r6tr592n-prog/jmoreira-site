// Gera supabase/seed.sql a partir de lib/mock-data.ts.
// Uso: npm run db:seed-sql   (rode depois do schema.sql)

import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { categories, products } from "../lib/mock-data.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const q = (v) => {
  if (v === null || v === undefined) return "null"
  if (typeof v === "number") return String(v)
  if (typeof v === "boolean") return v ? "true" : "false"
  return `'${String(v).replace(/'/g, "''")}'`
}
const arr = (list) => `array[${list.map(q).join(", ")}]::text[]`

const slugById = new Map(categories.map((c) => [c.id, c.slug]))

const columns = [
  "slug", "sku", "name", "brand", "category_id", "short_description", "description", "price",
  "compare_at_price", "stock", "images", "specs", "weight_kg", "amperage_ah", "voltage_v",
  "warranty_months", "trade_in_required", "trade_in_surcharge", "is_featured", "is_active", "sort_order",
]

const rows = products.map((p) => {
  const values = [
    q(p.slug), q(p.sku), q(p.name), q(p.brand),
    `(select id from categories where slug = ${q(slugById.get(p.category_id))})`,
    q(p.short_description), q(p.description), q(p.price), q(p.compare_at_price), q(p.stock),
    arr(p.images), `${q(JSON.stringify(p.specs))}::jsonb`, q(p.weight_kg), q(p.amperage_ah), q(p.voltage_v),
    q(p.warranty_months), q(p.trade_in_required), q(p.trade_in_surcharge), q(p.is_featured), q(p.is_active), q(p.sort_order),
  ]
  return `  (${values.join(", ")})`
})

const sql = `-- Gerado por scripts/generate-seed-sql.mjs a partir de lib/mock-data.ts. Não edite à mão.
-- Rode depois de supabase/schema.sql.

insert into products (${columns.join(", ")}) values
${rows.join(",\n")}
on conflict (slug) do update set
${columns.filter((c) => c !== "slug").map((c) => `  ${c} = excluded.${c}`).join(",\n")};
`

writeFileSync(join(root, "supabase", "seed.sql"), sql)
console.log(`supabase/seed.sql: ${products.length} produtos`)
