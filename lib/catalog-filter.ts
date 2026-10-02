import type { CatalogProduct } from "@/lib/types"

export type SortKey = "relevancia" | "menor-preco" | "maior-preco"

export type CatalogFilters = {
  q: string
  /** slug de categoria (pai ou filha) */
  category: string | null
  brands: string[]
  min: number | null
  max: number | null
  inStock: boolean
  sort: SortKey
}

export const pricePresets = [
  { label: "Até R$ 50", min: null, max: 50 },
  { label: "R$ 50 a R$ 200", min: 50, max: 200 },
  { label: "R$ 200 a R$ 700", min: 200, max: 700 },
  { label: "Acima de R$ 700", min: 700, max: null },
] as const

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Mais relevantes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
]

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()

export function matchesCategory(p: CatalogProduct, category: string | null) {
  return !category || p.category.slug === category || p.parent.slug === category
}

export function filterProducts(products: CatalogProduct[], f: CatalogFilters) {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean)
  const result = products.filter((p) => {
    if (!matchesCategory(p, f.category)) return false
    if (f.brands.length && !f.brands.includes(p.brand)) return false
    if (f.min != null && p.price < f.min) return false
    if (f.max != null && p.price > f.max) return false
    if (f.inStock && p.stock <= 0) return false
    if (terms.length) {
      const haystack = normalize(`${p.name} ${p.brand} ${p.category.name} ${p.short_description} ${p.sku}`)
      if (!terms.every((t) => haystack.includes(t))) return false
    }
    return true
  })

  return result.sort((a, b) => {
    if (f.sort === "menor-preco") return a.price - b.price
    if (f.sort === "maior-preco") return b.price - a.price
    // Relevância: em estoque primeiro, depois destaques, depois a ordem do catálogo
    return (
      Number(b.stock > 0) - Number(a.stock > 0) ||
      Number(b.is_featured) - Number(a.is_featured) ||
      a.sort_order - b.sort_order
    )
  })
}

export function parseFilters(params: URLSearchParams, category: string | null): CatalogFilters {
  const num = (key: string) => {
    const raw = params.get(key)
    if (raw == null || raw === "") return null
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  const sort = params.get("ordem")
  return {
    q: params.get("q") ?? "",
    category,
    brands: (params.get("marca") ?? "").split(",").filter(Boolean),
    min: num("min"),
    max: num("max"),
    inStock: params.get("estoque") === "1",
    sort: sort === "menor-preco" || sort === "maior-preco" ? sort : "relevancia",
  }
}

export function filtersToParams(f: Omit<CatalogFilters, "category">) {
  const params = new URLSearchParams()
  if (f.q) params.set("q", f.q)
  if (f.brands.length) params.set("marca", f.brands.join(","))
  if (f.min != null) params.set("min", String(f.min))
  if (f.max != null) params.set("max", String(f.max))
  if (f.inStock) params.set("estoque", "1")
  if (f.sort !== "relevancia") params.set("ordem", f.sort)
  return params
}
