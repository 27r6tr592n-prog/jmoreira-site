import "server-only"

import { cache } from "react"

import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data"
import { getPublicClient } from "@/lib/supabase/server"
import type { CategoryRow, ProductRow } from "@/lib/supabase/types"
import type { CatalogProduct, Spec } from "@/lib/types"

function parseSpecs(raw: ProductRow["specs"]): Spec[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const { label, value } = item as Record<string, unknown>
      if (typeof label === "string" && typeof value === "string") return [{ label, value }]
    }
    return []
  })
}

function hydrate(rows: ProductRow[], cats: CategoryRow[]): CatalogProduct[] {
  const byId = new Map(cats.map((c) => [c.id, c]))
  return rows.flatMap((row) => {
    const category = byId.get(row.category_id)
    if (!category) return []
    const parent = (category.parent_id && byId.get(category.parent_id)) || category
    return [
      {
        ...row,
        price: Number(row.price),
        compare_at_price: row.compare_at_price == null ? null : Number(row.compare_at_price),
        trade_in_surcharge: row.trade_in_surcharge == null ? null : Number(row.trade_in_surcharge),
        specs: parseSpecs(row.specs),
        category: { slug: category.slug, name: category.name },
        parent: { slug: parent.slug, name: parent.name },
      },
    ]
  })
}

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  const supabase = getPublicClient()
  if (!supabase) return mockCategories
  const { data, error } = await supabase.from("categories").select("*").order("sort_order")
  if (error) {
    console.error("[catalog] categorias:", error.message)
    return mockCategories
  }
  return data
})

export const getProducts = cache(async (): Promise<CatalogProduct[]> => {
  const cats = await getCategories()
  const supabase = getPublicClient()
  if (!supabase) return hydrate(mockProducts.filter((p) => p.is_active), cats)
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  if (error) {
    console.error("[catalog] produtos:", error.message)
    return hydrate(mockProducts, mockCategories)
  }
  return hydrate(data, cats)
})

export async function getProductBySlug(slug: string) {
  const all = await getProducts()
  return all.find((p) => p.slug === slug) ?? null
}

export async function getFeaturedProducts(limit = 4) {
  const all = await getProducts()
  const featured = all.filter((p) => p.is_featured && p.stock > 0)
  return featured.slice(0, limit)
}

export async function getRelatedProducts(product: CatalogProduct, limit = 4) {
  const all = await getProducts()
  const sameCategory = all.filter((p) => p.id !== product.id && p.category.slug === product.category.slug)
  const sameParent = all.filter(
    (p) => p.id !== product.id && p.category.slug !== product.category.slug && p.parent.slug === product.parent.slug,
  )
  return [...sameCategory, ...sameParent].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0)).slice(0, limit)
}
