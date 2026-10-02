import { Suspense } from "react"
import { CreditCard, Recycle, Store, Truck } from "lucide-react"

import type { Crumb } from "@/components/sections/breadcrumbs"
import { PageHero } from "@/components/sections/page-hero"
import { getCategories, getProducts } from "@/lib/catalog"
import { matchesCategory } from "@/lib/catalog-filter"
import { pricing } from "@/lib/config"
import { isBattery } from "@/lib/types"
import { BatteryFinder, type FinderProduct } from "./battery-finder"
import { ProductCard } from "./product-card"
import { ShopCatalog } from "./shop-catalog"

const perks = [
  { icon: Truck, title: "Entrega no mesmo dia", text: "Em Rio Preto, pedidos até 15h" },
  { icon: Store, title: "Retirada grátis", text: "Jardim Alvorada, pronta em até 2h" },
  { icon: CreditCard, title: `Até ${pricing.maxInstallments}x sem juros`, text: "Ou Pix e cartão à vista" },
  { icon: Recycle, title: "Troca da bateria usada", text: "Entregue a velha e pague menos" },
]

export async function ShopPage({
  category,
  crumbs,
  eyebrow,
  title,
  description,
}: {
  category: string | null
  crumbs: Crumb[]
  eyebrow: string
  title: string
  description: string
}) {
  const [all, categories] = await Promise.all([getProducts(), getCategories()])
  // A listagem não precisa da descrição longa nem das especificações: payload menor.
  const products = all.map((p) => ({ ...p, description: "", specs: [] }))
  const initial = products.filter((p) => matchesCategory(p, category))
  // "Qual bateria serve?" aparece nas páginas de baterias
  const showFinder = category?.startsWith("baterias") ?? false
  const finderProducts: FinderProduct[] = showFinder
    ? all
        .filter((p) => isBattery(p) && p.amperage_ah)
        .map((p) => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          image: p.images[0] ?? "/produtos/sem-foto.svg",
          price: p.price,
          amperage: p.amperage_ah!,
          inStock: p.stock > 0,
          category: p.category.slug,
        }))
    : []

  return (
    <>
      <PageHero crumbs={crumbs} eyebrow={eyebrow} title={title} description={description}>
        {/* No celular: grade 2×2 compacta (só o título), para os produtos aparecerem logo */}
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-2 rounded-xl border bg-background px-2.5 py-2 sm:gap-3 sm:p-3">
              <Icon className="size-5 shrink-0 text-brand-ink sm:size-6" aria-hidden />
              <span className="min-w-0">
                <span className="block text-xs leading-tight font-bold sm:text-sm">{title}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </PageHero>

      {showFinder && (
        <div className="container-page pt-10 sm:pt-14">
          <BatteryFinder products={finderProducts} />
        </div>
      )}

      <section aria-labelledby="lista-produtos" className="container-page py-10 sm:py-14">
        <h2 id="lista-produtos" className="sr-only">
          Produtos
        </h2>
        {/* O fallback já é a grade completa: quem chega sem JavaScript (e o Google) vê os produtos. */}
        <Suspense
          fallback={
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {initial.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          }
        >
          <ShopCatalog products={products} categories={categories} category={category} />
        </Suspense>
      </section>
    </>
  )
}
