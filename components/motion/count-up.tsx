"use client"

import { useEffect, useRef } from "react"

import { formatNumber } from "@/lib/format"
import { motionDisabled } from "@/lib/motion"

// ease-out [0.22, 1, 0.36, 1] resolvida por bisseção (a mesma curva do resto do site)
function easeOut(t: number) {
  const [x1, y1, x2, y2] = [0.22, 1, 0.36, 1]
  const bez = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3
  let lo = 0
  let hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (bez(x1, x2, mid) < t) lo = mid
    else hi = mid
  }
  return bez(y1, y2, (lo + hi) / 2)
}

const DURATION = 800

/**
 * Número que sobe de zero até o valor quando entra na tela (uma vez, 800 ms).
 * O HTML do servidor já traz o valor final; leitores de tela ouvem só o final.
 * Se montar já visível ou com movimento reduzido, fica no valor final.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const text = (v: number) => `${prefix}${formatNumber(v, decimals)}${suffix}`
  const final = text(value)

  useEffect(() => {
    const el = ref.current
    if (!el || motionDisabled()) return
    const r = el.getBoundingClientRect()
    // Já está na tela: não "rebobina" (o usuário veria o número piscar)
    if (r.top < window.innerHeight && r.bottom > 0) return
    el.textContent = text(0)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION)
          el.textContent = text(value * easeOut(t))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: "0px 0px -60px 0px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = final
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, prefix, suffix])

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
