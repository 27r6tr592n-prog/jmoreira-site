"use client"

import { useEffect, useRef, type ReactNode } from "react"
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
