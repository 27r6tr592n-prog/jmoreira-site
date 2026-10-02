"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, m, type Variants } from "motion/react"
import { ShoppingBag, Trash2, Undo2 } from "lucide-react"

import { WhatsAppIcon } from "@/components/brand/icons"
import { MotionScope } from "@/components/motion/motion-scope"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cta, empty } from "@/lib/copy"
import { formatBRL } from "@/lib/format"
import { duration, easeOut } from "@/lib/motion"
import { unitPrice } from "@/lib/pricing"
import { cartCount, cartSubtotal, useCart, useCartHydration, type CartItem } from "@/lib/store/cart"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { orderMessage, whatsappUrl } from "@/lib/whatsapp"
import { QuantityStepper } from "./quantity-stepper"
import { TradeInToggle } from "./trade-in-toggle"

// Itens entram em cascata quando o drawer abre; ao remover, deslizam para
// a direita e a altura fecha (exceção documentada: height, para os vizinhos
// subirem sem pulo).
const listVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }
const itemVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: duration.enter, ease: easeOut } },
  exit: {
    opacity: 0,
    x: 64,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: {
      opacity: { duration: duration.micro },
      x: { duration: duration.micro, ease: easeOut },
      height: { duration: 0.25, delay: 0.15, ease: easeOut },
      paddingTop: { duration: 0.25, delay: 0.15 },
      paddingBottom: { duration: 0.25, delay: 0.15 },
    },
  },
}
const itemReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, x: 0, transition: { duration: duration.reduced, x: { duration: 0 } } },
  exit: { opacity: 0, transition: { duration: duration.reduced } },
}

export function CartDrawer() {
  const hydrated = useCartHydration()
  const reduced = useReducedMotion()
  const { items, isOpen, setOpen, setQuantity, setTradeIn, remove, restore, close } = useCart()

  // "Desfazer" dentro do próprio drawer: um toast fora dele ficaria inerte,
  // porque o drawer é um diálogo modal.
  const [removed, setRemoved] = useState<{ item: CartItem; index: number } | null>(null)
  useEffect(() => {
    if (!removed) return
    const t = setTimeout(() => setRemoved(null), 8000)
    return () => clearTimeout(t)
  }, [removed])
  useEffect(() => {
    if (!isOpen) setRemoved(null)
  }, [isOpen])

  const removeWithUndo = (productId: string) => {
    const index = items.findIndex((i) => i.productId === productId)
    const item = items[index]
    if (!item) return
    remove(productId)
    setRemoved({ item, index })
  }
  const list = hydrated ? items : []
  const count = cartCount(list)
  const subtotal = cartSubtotal(list)

  const waHref = whatsappUrl(
    orderMessage({
      items: list.map((i) => ({ name: i.name, sku: i.sku, quantity: i.quantity, unitPrice: unitPrice(i), tradeIn: i.tradeIn })),
      subtotal,
      total: subtotal,
    }),
  )

  return (
    <MotionScope>
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4 pr-14">
          <SheetTitle className="text-lg font-bold">
            Seu carrinho {count > 0 && <span className="tabular text-muted-foreground">({count})</span>}
          </SheetTitle>
          <SheetDescription>
            {count > 0 ? "Revise os itens. O frete é calculado no próximo passo." : "Nenhum item adicionado ainda."}
          </SheetDescription>
        </SheetHeader>

        <div aria-live="polite">
          {removed && (
            <div className="flex items-center justify-between gap-3 border-b bg-warning-soft px-5 py-2 text-sm text-warning-ink">
              <span className="min-w-0 truncate">
                <strong className="font-semibold">{removed.item.name}</strong> saiu do carrinho
              </span>
              <button
                type="button"
                onClick={() => {
                  restore(removed.item, removed.index)
                  setRemoved(null)
                }}
                className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-2 font-bold underline-offset-2 hover:underline"
              >
                <Undo2 className="size-4" aria-hidden />
                Desfazer
              </button>
            </div>
          )}
        </div>

        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand-soft-ink">
              <ShoppingBag className="size-8" aria-hidden />
            </span>
            <div className="space-y-1.5">
              <p className="text-lg font-bold">{empty.cartTitle}</p>
              <p className="text-sm text-muted-foreground">{empty.cartBody}</p>
            </div>
            <Link href="/loja" onClick={close} className={buttonVariants({ size: "lg" })}>
              {cta.shop}
            </Link>
          </div>
        ) : (
          <>
            <m.ul
              data-lenis-prevent=""
              initial="hidden"
              animate="show"
              variants={listVariants}
              className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 sm:px-5"
              aria-label="Itens do carrinho"
            >
              <AnimatePresence>
              {list.map((item) => (
                <m.li
                  key={item.productId}
                  variants={reduced ? itemReduced : itemVariants}
                  exit="exit"
                  className="flex gap-3 overflow-hidden border-b py-4 last:border-b-0"
                >
                  <Link
                    href={`/loja/${item.slug}`}
                    onClick={close}
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-surface"
                    tabIndex={-1}
                    aria-hidden
                  >
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">{item.brand}</p>
                        <Link
                          href={`/loja/${item.slug}`}
                          onClick={close}
                          className="line-clamp-2 text-sm leading-snug font-semibold hover:text-brand-ink hover:underline"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWithUndo(item.productId)}
                        className="-mt-1 grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    {item.tradeIn !== null && item.tradeInSurcharge != null && (
                      <TradeInToggle
                        compact
                        checked={item.tradeIn}
                        surcharge={item.tradeInSurcharge}
                        onChange={(v) => setTradeIn(item.productId, v)}
                      />
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <QuantityStepper
                        size="sm"
                        label={item.name}
                        value={item.quantity}
                        max={item.stock}
                        onChange={(q) => setQuantity(item.productId, q)}
                      />
                      <p className="tabular text-right font-bold">{formatBRL(unitPrice(item) * item.quantity)}</p>
                    </div>
                  </div>
                </m.li>
              ))}
              </AnimatePresence>
            </m.ul>

            <SheetFooter className="gap-3 border-t bg-surface px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="tabular text-xl font-extrabold">{formatBRL(subtotal)}</span>
              </div>
              <Link href="/checkout" onClick={close} className={buttonVariants({ variant: "cta", size: "lg", className: "w-full" })}>
                {cta.checkout}
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
              >
                <WhatsAppIcon className="size-5 text-whatsapp" />
                {cta.checkoutWhatsapp}
              </a>
              <p className="text-center text-xs text-muted-foreground">
                Retirada grátis na loja ou entrega no mesmo dia em Rio Preto.
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
    </MotionScope>
  )
}
