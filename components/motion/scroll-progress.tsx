"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "cn"

import { useLenis } from "./motion-provider"

/**
 * Barra de leitura (3 px, âmbar) ligada ao progresso do scroll + voltar ao topo
 * com anel de progresso. Um listener de scroll com rAF escreve só transform e
 * stroke-dashoffset (sem re-render a cada quadro).
 */
export function ScrollProgress() {
  const lenis = useLenis()
  const bar = useRef<HTMLDivElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - p)
      setShow(p > 0.12)
    }
    const onScroll = () => (frame ||= requestAnimationFrame(update))
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div
        ref={bar}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-cta"
        style={{ transform: "scaleX(0)" }}
      />
      <button
        type="button"
        aria-label="Voltar ao topo"
        aria-hidden={!show || undefined}
        tabIndex={show ? 0 : -1}
        onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))}
        className={cn(
          "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-30 hidden size-12 place-items-center rounded-full bg-card text-foreground shadow-lift transition-[opacity,transform] duration-200 hover:-translate-y-1 md:grid",
          show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-12 -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle
            ref={ring}
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            style={{ strokeDashoffset: 1 }}
          />
        </svg>
        <ArrowUp className="relative size-5" aria-hidden />
      </button>
    </>
  )
}
