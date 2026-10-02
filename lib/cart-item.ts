import type { CartItem } from "@/lib/store/cart"
import { isBattery, type CatalogProduct } from "@/lib/types"

/** Converte um produto do catálogo no formato guardado no carrinho. */
export function toCartItem(p: CatalogProduct): Omit<CartItem, "quantity"> {
  return {
    productId: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    image: p.images[0] ?? "/produtos/sem-foto.svg",
    price: p.price,
    stock: p.stock,
    weightKg: Number(p.weight_kg),
    isBattery: isBattery(p),
    tradeInSurcharge: p.trade_in_surcharge,
    tradeIn: p.trade_in_required ? true : null,
  }
}
