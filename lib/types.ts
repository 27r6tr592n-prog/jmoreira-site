import type { ProductRow } from "@/lib/supabase/types"

export type Spec = { label: string; value: string }

export type CategoryRef = { slug: string; name: string }

/** Produto pronto para a interface: specs tipadas e categoria resolvida. */
export type CatalogProduct = Omit<ProductRow, "specs"> & {
  specs: Spec[]
  category: CategoryRef
  parent: CategoryRef
}

export const isBattery = (p: Pick<CatalogProduct, "parent">) => p.parent.slug === "baterias"

/** Peças para as quais a mão de obra de instalação pode ser contratada (consumíveis ficam de fora). */
export const isInstallable = (p: Pick<CatalogProduct, "category">) => p.category.slug !== "vedacao-e-adesivos"
