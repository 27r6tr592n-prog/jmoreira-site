"use client"

import { useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "cn"

import { setMotionPaused } from "@/lib/use-reduced-motion"

/** Pausa/retoma todas as animações do site (WCAG 2.2.2). */
export function MotionToggle({ className }: { className?: string }) {
  const [off, setOff] = useState(false)

  useEffect(() => {
    setOff(document.documentElement.dataset.motion === "off")
  }, [])

  const toggle = () => {
    const next = !off
    setOff(next)
    // Avisa todos os componentes (useReducedMotion), o Lenis e o 3D
    setMotionPaused(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={off}
      className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg text-sm hover:text-white hover:underline", className)}
    >
      {off ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
      {off ? "Ativar animações" : "Pausar animações"}
    </button>
  )
}
