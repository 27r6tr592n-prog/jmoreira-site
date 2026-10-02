"use client"

import { useEffect } from "react"

import { motionDisabled } from "@/lib/motion"

// Ripple por delegação: um único listener no documento atende todos os botões
// (Button e links com buttonVariants têm a classe group/button) e quem tiver
// [data-ripple]. A onda nasce no ponto do clique e só anima transform/opacity.
const SELECTOR = ".group\\/button, [data-ripple]"

export function RippleRoot() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || motionDisabled()) return
      const host = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR)
      if (!host || host.matches(":disabled, [aria-busy=true]")) return
      const rect = host.getBoundingClientRect()
      const size = Math.hypot(rect.width, rect.height) * 2
      // camada que recorta a onda no formato do botão sem mexer no overflow dele
      const clip = document.createElement("span")
      clip.setAttribute("aria-hidden", "true")
      clip.style.cssText = "position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none"
      const wave = document.createElement("span")
      wave.style.cssText = `position:absolute;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;width:${size}px;height:${size}px;border-radius:9999px;background:currentColor;opacity:0.22;transform:scale(0)`
      clip.appendChild(wave)
      if (getComputedStyle(host).position === "static") host.style.position = "relative"
      host.appendChild(clip)
      const anim = wave.animate(
        [
          { transform: "scale(0)", opacity: 0.22 },
          { transform: "scale(1)", opacity: 0 },
        ],
        { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      )
      anim.onfinish = anim.oncancel = () => clip.remove()
    }
    document.addEventListener("pointerdown", onDown, { passive: true })
    return () => document.removeEventListener("pointerdown", onDown)
  }, [])
  return null
}
