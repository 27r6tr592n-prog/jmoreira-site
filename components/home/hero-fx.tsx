"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"

import { useRichMotion } from "@/lib/use-reduced-motion"

// three.js só é baixado quando este componente é renderizado (desktop, com movimento)
const HeroParticles = dynamic(() => import("./hero-particles"), { ssr: false })

/**
 * Camada de parallax do herói. `speed` é a velocidade relativa ao scroll:
 * 1 acompanha o conteúdo, 0,3 fica bem para trás (fundo).
 * Desligado abaixo de 768 px e com movimento reduzido.
 */
export function ParallaxLayer({ speed, className, children }: { speed: number; className?: string; children?: ReactNode }) {
  const rich = useRichMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Mesmo elemento no servidor e no cliente (sem remontar as fotos); o
  // rastreamento de scroll só liga com movimento rico. Só transform.
  useEffect(() => {
    const el = ref.current
    if (!rich || !el) return
    let frame = 0
    const update = () => {
      frame = 0
      // só os primeiros 1200 px importam (depois disso o herói já saiu da tela)
      const y = Math.min(window.scrollY, 1200) * (1 - speed)
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
    }
    const onScroll = () => (frame ||= requestAnimationFrame(update))
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
      el.style.transform = ""
    }
  }, [rich, speed])

  return (
    <div ref={ref} aria-hidden className={className}>
      {children}
    </div>
  )
}

/** Partículas: só no desktop, sem movimento reduzido e depois que a página fica ociosa. */
export function HeroParticlesGate() {
  const rich = useRichMotion()
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if (!rich) return
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const id = ric(() => setIdle(true), { timeout: 2500 })
    return () => cancel(id)
  }, [rich])
  return rich && idle ? <HeroParticles /> : null
}
