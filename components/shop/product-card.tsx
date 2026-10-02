import Image from "next/image"
import Link from "next/link"
import { Recycle, Truck } from "lucide-react"

import { toCartItem } from "@/lib/cart-item"
import { notices } from "@/lib/copy"
import { isBattery, type CatalogProduct } from "@/lib/types"
import { AddToCartButton } from "./add-to-cart-button"
import { Price } from "./price"

export function ProductCard({ product, priority = false }: { product: CatalogProduct; priority?: boolean }) {
  const inStock = product.stock > 0
  const battery = isBattery(product)
  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0

  return (
    <article data-product-card="" className="lift group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {/* TODO cliente: substituir pela foto real do produto */}
        <Image
          src={product.images[0] ?? "/produtos/sem-foto.svg"}
          alt={product.name}
          data-fly-source=""
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          priority={priority}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-cta px-2 py-0.5 text-xs font-bold text-cta-foreground">−{discount}%</span>
          )}
          {!inStock && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-bold text-background">{notices.outOfStock}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{product.brand}</p>
          <h3 className="line-clamp-2 text-[0.95rem] leading-snug font-bold">
            <Link href={`/loja/${product.slug}`} className="after:absolute after:inset-0 hover:text-brand-ink">
              {product.name}
            </Link>
          </h3>
        </div>

        {battery && product.amperage_ah && (
          <ul className="flex flex-wrap gap-1.5 text-xs font-semibold" aria-label="Especificações principais">
            <li className="rounded-md bg-brand-soft px-2 py-0.5 text-brand-soft-ink">{product.amperage_ah} Ah</li>
            <li className="rounded-md bg-brand-soft px-2 py-0.5 text-brand-soft-ink">{product.voltage_v} V</li>
            {product.warranty_months && (
              <li className="rounded-md bg-brand-soft px-2 py-0.5 text-brand-soft-ink">Garantia {product.warranty_months} meses</li>
            )}
          </ul>
        )}

        <Price price={product.price} compareAt={product.compare_at_price} className="mt-auto" />

        <div className="space-y-1.5 text-xs">
          {inStock && (
            <p className="flex items-center gap-1.5 font-semibold text-success">
              <Truck className="size-3.5 shrink-0" aria-hidden />
              {notices.sameDay}
            </p>
          )}
          {product.trade_in_required && (
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <Recycle className="size-3.5 shrink-0" aria-hidden />
              {notices.tradeIn}
            </p>
          )}
        </div>

        {/* z-10 deixa o botão clicável acima do link que cobre o card */}
        <div className="relative z-10">
          <AddToCartButton item={toCartItem(product)} />
        </div>
      </div>
    </article>
  )
}
