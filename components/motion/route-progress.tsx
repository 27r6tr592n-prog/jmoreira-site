"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Barra de carregamento entre páginas (azul-claro, por cima da barra de leitura).
 * Ao clicar num link interno ela avança até 70 % (800 ms) e, quando a página nova
 * chega, completa e some. Só transform/opacity, sem re-render do React.
 * Com movimento reduzido as transições viram instantâneas (regra global do CSS).
 */
export function RouteProgress() {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const loading = useRef(false)
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const set = (transform: string, opacity: string, transition: string) => {
    const el = ref.current
    if (!el) return
    el.style.transition = transition
    el.style.transform = transform
    el.style.opacity = opacity
  }

  const done = () => {
    if (!loading.current) return
    loading.current = false
    clear()
    set("scaleX(1)", "1", "transform 200ms var(--ease-out)")
    timers.current.push(
      window.setTimeout(() => set("scaleX(1)", "0", "opacity 250ms linear"), 200),
      window.setTimeout(() => set("scaleX(0)", "0", "none"), 480),
    )
  }

  // Página nova renderizada: completa a barra
  useEffect(() => {
    done()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Captura: roda antes do <Link> do Next (que chama preventDefault)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      loading.current = true
      clear()
      set("scaleX(0)", "1", "none")
      // força o navegador a registrar o ponto de partida antes de animar
      void ref.current?.offsetWidth
      set("scaleX(0.7)", "1", "transform 800ms var(--ease-out)")
      // Rede travada ou navegação cancelada: some sozinha
      timers.current.push(window.setTimeout(done, 8000))
    }
    window.addEventListener("click", onClick, true)
    return () => {
      window.removeEventListener("click", onClick, true)
      clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-[3px] origin-left bg-sky opacity-0 shadow-[0_0_10px_var(--sky)]"
      style={{ transform: "scaleX(0)" }}
    />
  )
}
