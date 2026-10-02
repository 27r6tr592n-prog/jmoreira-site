"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { subtotalOf } from "@/lib/pricing"

export type CartItem = {
  productId: string
  slug: string
  sku: string
  name: string
  brand: string
  image: string
  price: number
  quantity: number
  stock: number
  weightKg: number
  isBattery: boolean
  tradeInSurcharge: number | null
  /** true = entrega a bateria usada; false = paga o acréscimo; null = não se aplica */
  tradeIn: boolean | null
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  /** `open: false` não abre o drawer (o voo até o carrinho abre depois de pousar) */
  add: (item: Omit<CartItem, "quantity">, quantity?: number, options?: { open?: boolean }) => void
  setQuantity: (productId: string, quantity: number) => void
  setTradeIn: (productId: string, tradeIn: boolean) => void
  remove: (productId: string) => void
  /** Devolve um item removido à mesma posição (botão "Desfazer") */
  restore: (item: CartItem, index: number) => void
  clear: () => void
  open: () => void
  close: () => void
  setOpen: (open: boolean) => void
}

// Decisão conservadora: item sem estoque não entra no carrinho; a página do
// produto oferece consultar o prazo pelo WhatsApp.
const maxFor = (item: Pick<CartItem, "stock">) => Math.max(0, item.stock)

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, quantity = 1, { open = true } = {}) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (item.stock <= 0) return state
          if (existing) {
            return {
              isOpen: open || state.isOpen,
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, ...item, tradeIn: i.tradeIn, quantity: Math.min(maxFor(item), i.quantity + quantity) }
                  : i,
              ),
            }
          }
          return { isOpen: open || state.isOpen, items: [...state.items, { ...item, quantity: Math.min(maxFor(item), quantity) }] }
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(0, Math.min(maxFor(i), quantity)) } : i))
            .filter((i) => i.quantity > 0),
        })),
      setTradeIn: (productId, tradeIn) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId && i.tradeIn !== null ? { ...i, tradeIn } : i)),
        })),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      restore: (item, index) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) return state
          const items = [...state.items]
          items.splice(Math.min(index, items.length), 0, item)
          return { items }
        }),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "jmoreira-carrinho",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
)

/** Reidrata o carrinho depois da montagem, evitando divergência com o HTML do servidor. */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    const unsub = useCart.persist.onFinishHydration(() => setHydrated(true))
    if (useCart.persist.hasHydrated()) setHydrated(true)
    else void useCart.persist.rehydrate()
    return unsub
  }, [])
  return hydrated
}

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0)

export const cartSubtotal = (items: CartItem[]) =>
  subtotalOf(items.map((i) => ({ price: i.price, quantity: i.quantity, tradeIn: i.tradeIn, tradeInSurcharge: i.tradeInSurcharge })))
