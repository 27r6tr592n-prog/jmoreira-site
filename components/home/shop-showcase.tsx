import Link from "next/link"
import { ArrowRight, BatteryCharging, Droplets, Recycle, Store, Truck } from "lucide-react"

import { Reveal, RevealItem } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { ProductCard } from "@/components/shop/product-card"
import { buttonVariants } from "@/components/ui/button"
import type { CatalogProduct } from "@/lib/types"

const categories = [
  { href: "/loja/categoria/baterias-automotivas", label: "Baterias automotivas", detail: "40Ah a 100Ah", icon: BatteryCharging },
  { href: "/loja/categoria/hidraulica", label: "Peças hidráulicas", detail: "Registros, reparos, boias", icon: Droplets },
  { href: "/loja/categoria/baterias-estacionarias", label: "Estacionárias", detail: "Nobreak e solar", icon: BatteryCharging },
]

export function ShopShowcase({ products }: { products: CatalogProduct[] }) {
  return (
    <section aria-labelledby="loja-destaques" className="border-y bg-surface py-16 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="loja-destaques"
            eyebrow="Novidade: loja JMoreira"
            title="Peças hidráulicas e baterias com entrega no mesmo dia"
            description="As mesmas peças que nossos técnicos usam. Compre online, receba em casa em Rio Preto ou retire na loja do Jardim Alvorada."
          />
          <Link href="/loja" className={buttonVariants({ variant: "outline", size: "lg", className: "shrink-0" })}>
            Ver todos os produtos
            <ArrowRight aria-hidden />
          </Link>
        </div>

        <Reveal as="ul" stagger className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Categorias da loja">
          {categories.map(({ href, label, detail, icon: Icon }) => (
            <RevealItem as="li" key={href}>
              <Link
                href={href}
                className="lift group flex items-center gap-3 rounded-2xl border bg-card p-4 hover:border-brand-ink/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-soft-ink transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{label}</span>
                  <span className="block text-sm text-muted-foreground">{detail}</span>
                </span>
                <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </RevealItem>
          ))}
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="flex [&>article]:flex-1">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-2.5">
            <Truck className="size-5 shrink-0 text-brand-ink" aria-hidden />
            Entrega no mesmo dia em Rio Preto (itens em estoque, pedidos até 15h)
          </li>
          <li className="flex items-center gap-2.5">
            <Store className="size-5 shrink-0 text-brand-ink" aria-hidden />
            Retirada grátis na loja, pronta em até 2 horas
          </li>
          <li className="flex items-center gap-2.5">
            <Recycle className="size-5 shrink-0 text-brand-ink" aria-hidden />
            Baterias com preço de troca: entregue a usada e pague menos
          </li>
        </ul>
      </div>
    </section>
  )
}
