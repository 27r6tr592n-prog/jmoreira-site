"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import type Lenis from "lenis"

import { useCart } from "@/lib/store/cart"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const LenisContext = createContext<Lenis | null>(null)

/** Instância do Lenis (null quando o smooth scroll está desligado). */
export const useLenis = () => useContext(LenisContext)

/**
 * Raiz do sistema de movimento: Lenis (smooth scroll, lerp 0.1), desligado com
 * movimento reduzido, no toque e com o carrinho aberto. O Motion não fica aqui:
 * cada parte que usa `m.*` se envolve em <MotionScope> e carrega sob demanda.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const cartOpen = useCart((s) => s.isOpen)
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Smooth scroll só com mouse/trackpad: no toque o Lenis não age (rolagem nativa)
    // e baixar o pacote seria custo à toa no celular.
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    let instance: Lenis | null = null
    let cancelled = false
    void import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return
      instance = new LenisCtor({ lerp: 0.1, autoRaf: true, anchors: { offset: -88 } })
      lenisRef.current = instance
      setLenis(instance)
    })
    return () => {
      cancelled = true
      if (instance) {
        // O Lenis tem um setTimeout de 400 ms (onNativeScroll) que, se disparar depois
        // do destroy, recoloca as classes no <html> (com "lenis-stopped" a página
        // travaria). Neutraliza esse método na instância destruída.
        ;(instance as unknown as { updateClassName: () => void }).updateClassName = () => {}
        instance.destroy()
      }
      lenisRef.current = null
      setLenis(null)
      const root = document.documentElement
      for (const c of Array.from(root.classList)) if (c === "lenis" || c.startsWith("lenis-")) root.classList.remove(c)
    }
  }, [reduced])

  // Drawer aberto: a rolagem é dele, não da página
  useEffect(() => {
    const l = lenisRef.current
    if (!l) return
    if (cartOpen) l.stop()
    else l.start()
  }, [cartOpen, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
