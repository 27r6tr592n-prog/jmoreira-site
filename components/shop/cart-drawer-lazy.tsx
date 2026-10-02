"use client"

import dynamic from "next/dynamic"

import { useCart } from "@/lib/store/cart"
import { useIdle } from "@/lib/use-idle"

// O drawer (e o Dialog do Base UI) sai do JS inicial: carrega quando a página
// fica ociosa ou, no mais tardar, quando o carrinho é aberto.
const CartDrawer = dynamic(() => import("./cart-drawer").then((m) => m.CartDrawer), { ssr: false })

export function CartDrawerLazy() {
  const idle = useIdle()
  const isOpen = useCart((s) => s.isOpen)
  return idle || isOpen ? <CartDrawer /> : null
}
