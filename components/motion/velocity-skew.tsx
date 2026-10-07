"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { useLenis } from "./motion-provider"

/**
 * Inclina o conteúdo conforme a VELOCIDADE da rolagem (rolou rápido, inclina;
 * parou, volta ao normal com uma mola leve). Só transform.
 *
 * Depende do Lenis, que só existe no desktop com mouse e sem movimento
 * reduzido: no celular e com "Pausar animações" o componente é um <div> parado.
 * Fora da tela não faz nada (IntersectionObserver).
 */
export function VelocitySkew({
  axis = "x",
  max = 8,
  factor = 0.25,
  className,
  children,
}: {
  /** "x" inclina as letras (faixas); "y" entorta a grade (galeria) */
  axis?: "x" | "y"
  /** inclinação máxima em graus */
  max?: number
  /** graus por unidade de velocidade do Lenis */
  factor?: number
  className?: string
  children: ReactNode
}) {
  const lenis = useLenis()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!lenis || !el) return
    let visible = false
    let current = 0
    let target = 0
    let frame = 0
    const fn = axis === "x" ? "skewX" : "skewY"

    const tick = () => {
      current += (target - current) * 0.18
      target *= 0.88 // a velocidade "esfria" mesmo sem novos eventos
      if (Math.abs(current) < 0.02 && Math.abs(target) < 0.02) {
        current = 0
        el.style.transform = ""
        frame = 0
        return
      }
      el.style.transform = `${fn}(${(-current).toFixed(2)}deg)`
      frame = requestAnimationFrame(tick)
    }
    const off = lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      if (!visible) return
      target = Math.max(-max, Math.min(max, velocity * factor))
      frame ||= requestAnimationFrame(tick)
    })
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    return () => {
      off()
      io.disconnect()
      cancelAnimationFrame(frame)
      el.style.transform = ""
    }
  }, [lenis, axis, max, factor])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
