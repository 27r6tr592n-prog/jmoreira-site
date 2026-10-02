"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "cn"

/** Outros componentes pedem o header visível (ex.: produto voando para o carrinho). */
export const REVEAL_HEADER_EVENT = "jmoreira:reveal-header"
export function revealHeader() {
  window.dispatchEvent(new Event(REVEAL_HEADER_EVENT))
}

const SOLID_AT = 80 // px: ganha fundo, blur e sombra; no desktop encolhe de 88 para 64 px
const HIDE_AFTER = 480 // px: abaixo disso nunca some
const DELTA = 6 // px: ignora tremidas do trackpad

/**
 * Header inteligente: transparente sobre o herói; depois de 80 px ganha fundo
 * com blur e sombra e encolhe (só transform/opacity: a camada de fundo escala
 * em Y e a barra sobe 12 px). Some ao rolar para baixo e volta ao rolar para cima.
 */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const holdUntil = useRef(0)

  useEffect(() => {
    let frame = 0
    let prev = window.scrollY
    const update = () => {
      frame = 0
      const y = window.scrollY
      setSolid(y > SOLID_AT)
      if (Math.abs(y - prev) < DELTA) return
      const focusInside = ref.current?.contains(document.activeElement)
      if (y < HIDE_AFTER || focusInside || performance.now() < holdUntil.current) setHidden(false)
      else setHidden(y > prev)
      prev = y
    }
    const onScroll = () => (frame ||= requestAnimationFrame(update))
    const show = () => {
      holdUntil.current = performance.now() + 1800
      setHidden(false)
    }
    setSolid(window.scrollY > SOLID_AT)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener(REVEAL_HEADER_EVENT, show)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener(REVEAL_HEADER_EVENT, show)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header
      ref={ref}
      data-solid={solid ? "" : undefined}
      data-hidden={hidden ? "" : undefined}
      onFocusCapture={() => setHidden(false)}
      // Some/volta com a mola k400/c30 (var(--spring), 600 ms). `transform` explícito
      // (e não a utilidade translate do Tailwind v4) para o voo ao carrinho ler a posição.
      className="group/header pointer-events-none sticky top-0 z-40 h-16 [transition:transform_600ms_var(--spring)] data-hidden:[transform:translateY(-100%)] lg:h-22"
    >
      {/* Fundo: aparece por opacidade e, no desktop, encolhe por scaleY (88 → 64 px) */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 origin-top border-b bg-background/85 opacity-0 shadow-soft backdrop-blur-md",
          "transition-[opacity,transform] duration-250 ease-(--ease-out)",
          "group-data-solid/header:opacity-100 lg:group-data-solid/header:scale-y-[0.7273]",
        )}
      />
      <div
        className={cn(
          "pointer-events-auto relative transition-transform duration-250 ease-(--ease-out)",
          "lg:translate-y-3 lg:group-data-solid/header:translate-y-0",
        )}
      >
        {children}
      </div>
    </header>
  )
}
