"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "cn"

import { finePointer, motionDisabled } from "@/lib/motion"

/**
 * Holofote que segue o cursor dentro do elemento pai (só com mouse).
 * O pai precisa de `relative` e `overflow-hidden`.
 */
export function Spotlight({ color = "rgb(56 140 255 / 0.18)", size = 520 }: { color?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent || !finePointer()) return
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect()
      el.style.setProperty("--sx", `${e.clientX - r.left}px`)
      el.style.setProperty("--sy", `${e.clientY - r.top}px`)
      el.style.opacity = "1"
    }
    const leave = () => (el.style.opacity = "0")
    parent.addEventListener("pointermove", move)
    parent.addEventListener("pointerleave", leave)
    return () => {
      parent.removeEventListener("pointermove", move)
      parent.removeEventListener("pointerleave", leave)
    }
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
      style={{ background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 60%)` }}
    />
  )
}

/** Palavra que gira com efeito de virada (decorativa; o texto fixo vai para o leitor de tela). */
export function RotatingWords({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (motionDisabled()) return
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [words.length, interval])
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden key={i} className="animate-[word-up_0.5s_var(--ease-out)_both] [grid-area:1/1]">
        {words[i]}
      </span>
    </span>
  )
}

/** Inclinação 3D + reflexo de luz seguindo o mouse. */
export function TiltCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || motionDisabled()) return
    let frame = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty("--rx", `${(0.5 - py) * max}deg`)
        el.style.setProperty("--ry", `${(px - 0.5) * max}deg`)
        el.style.setProperty("--gx", `${px * 100}%`)
        el.style.setProperty("--gy", `${py * 100}%`)
        el.dataset.tilt = ""
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty("--rx", "0deg")
      el.style.setProperty("--ry", "0deg")
      delete el.dataset.tilt
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(frame)
    }
  }, [max])
  return (
    <div
      ref={ref}
      className={cn(
        "group/tilt relative [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-200 ease-out [transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
      {/* Reflexo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-data-[tilt]/tilt:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / 0.16), transparent 45%)" }}
      />
    </div>
  )
}

/** O filho é "puxado" levemente na direção do cursor. */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || motionDisabled()) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const leave = () => (el.style.transform = "")
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    }
  }, [strength])
  return (
    <div ref={ref} className={cn("inline-flex transition-transform duration-300 ease-out", className)}>
      {children}
    </div>
  )
}
