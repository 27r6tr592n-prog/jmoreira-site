"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ShoppingCart } from "lucide-react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { cta } from "@/lib/copy"
import { flyToCart } from "@/lib/fly-to-cart"
import { motionDisabled } from "@/lib/motion"
import { useCart, type CartItem } from "@/lib/store/cart"
import { whatsappUrl } from "@/lib/whatsapp"

export function AddToCartButton({
  item,
  quantity = 1,
  tradeIn,
  size = "default",
  className,
}: {
  /** Gerado no servidor com toCartItem(), para não serializar o produto inteiro */
  item: Omit<CartItem, "quantity">
  quantity?: number
  tradeIn?: boolean
  size?: "default" | "lg" | "xl"
  className?: string
}) {
  const add = useCart((s) => s.add)
  const setTradeIn = useCart((s) => s.setTradeIn)
  const openCart = useCart((s) => s.open)
  const [added, setAdded] = useState(false)
  const flying = useRef(false)
  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1800)
    return () => clearTimeout(t)
  }, [added])

  const onAdd = async (e: React.MouseEvent<HTMLElement>) => {
    if (flying.current) return
    flying.current = true
    setAdded(true)
    // O item entra quando a miniatura pousa: o badge vira e o carrinho pula nessa hora
    try {
      await flyToCart(e.currentTarget)
    } finally {
      add(item, quantity, { open: false })
      if (tradeIn !== undefined && item.tradeIn !== null) setTradeIn(item.productId, tradeIn)
      flying.current = false
      window.setTimeout(openCart, motionDisabled() ? 0 : 380)
    }
  }

  if (item.stock <= 0) {
    return (
      <a
        href={whatsappUrl(`Olá, JMoreira! Qual o prazo para chegar o produto ${item.name} (${item.sku})?`)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline", size, className: cn("w-full", className) })}
      >
        <WhatsAppIcon className="size-4 text-whatsapp" />
        {cta.askAvailability}
      </a>
    )
  }

  return (
    <Button
      variant="cta"
      size={size}
      className={cn("shine w-full", added && "bg-success text-white hover:bg-success dark:text-background", className)}
      onClick={onAdd}
    >
      {added ? <Check key="ok" className="animate-pop-in" aria-hidden /> : <ShoppingCart aria-hidden />}
      {added ? "Adicionado!" : cta.addToCart}
    </Button>
  )
}
