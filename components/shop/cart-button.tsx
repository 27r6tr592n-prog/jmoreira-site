"use client"

import { useEffect, useRef } from "react"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { motionDisabled } from "@/lib/motion"
import { cartCount, useCart, useCartHydration } from "@/lib/store/cart"

// Mola k400/c30 amostrada (a mesma de var(--spring) no CSS), para a Web Animations API
const SPRING =
  "linear(0, 0.065, 0.212, 0.386, 0.555, 0.7, 0.815, 0.901, 0.959, 0.996, 1.017, 1.026, 1.028, 1.026, 1.022, 1.017, 1.012, 1.008, 1.005, 1.003, 1.001, 1, 0.999, 0.999, 0.999, 0.999, 0.999, 1, 1, 1, 1)"

export function CartButton() {
  const hydrated = useCartHydration()
  const items = useCart((s) => s.items)
  const open = useCart((s) => s.open)
  const count = hydrated ? cartCount(items) : 0
  const previous = useRef<number | null>(null)
  const bag = useRef<HTMLSpanElement>(null)

  // Quando um item entra: o ícone "pula" (sobe a 1,3 e volta com a mola)
  useEffect(() => {
    if (!hydrated) return
    const grew = previous.current !== null && count > previous.current
    previous.current = count
    if (!grew || motionDisabled() || !bag.current) return
    bag.current.animate([{ transform: "translateY(-3px) scale(1.3)" }, { transform: "none" }], { duration: 600, easing: SPRING })
  }, [count, hydrated])

  const label = count === 0 ? "Abrir carrinho, vazio" : `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
  const shown = count > 99 ? "99+" : String(count)

  return (
    <Button variant="ghost" size="icon" onClick={open} aria-label={label} data-cart-target="" className="relative">
      <span ref={bag} className="grid place-items-center">
        <ShoppingBag className="size-6" aria-hidden />
      </span>
      {count > 0 && (
        <span
          aria-hidden
          className="badge-pop tabular absolute top-1 right-1 grid h-5 min-w-5 place-items-center overflow-hidden rounded-full bg-cta px-1 text-[0.7rem] leading-5 font-bold text-cta-foreground [perspective:200px]"
        >
          {/* Flip do número: a key nova remonta o span e o número entra girando */}
          <span key={shown} className="badge-flip block">
            {shown}
          </span>
        </span>
      )}
    </Button>
  )
}
