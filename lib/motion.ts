// Sistema de movimento — tokens e variants (documentação em docs/motion.md).
// Os mesmos valores existem como variáveis CSS em app/globals.css.

import type { Transition } from "motion/react"

export const MOTION_KEY = "jmoreira-animacoes"

/** Durações em segundos (Motion usa segundos). Nada passa de 0,8 s. */
export const duration = {
  micro: 0.2, // hover, toque, troca de ícone (150–250 ms)
  enter: 0.5, // entradas de conteúdo (400–600 ms)
  page: 0.35, // transição de página (300–400 ms)
  reduced: 0.12, // fade único quando o movimento está reduzido
  max: 0.8,
} as const

/** Ease-out expo: padrão para entradas. */
export const easeOut = [0.22, 1, 0.36, 1] as const

/** Mola para toque, arraste e elementos que "pulam". */
export const spring: Transition = { type: "spring", stiffness: 400, damping: 30 }

/** Deslocamento e cascata padrão das revelações (o CSS de [data-reveal] usa os mesmos valores). */
export const REVEAL_Y = 24
export const STAGGER = 0.08

/** Script do <head>: aplica a preferência "Pausar animações" antes da pintura. */
export const motionBootScript = `try{if(localStorage.getItem('${MOTION_KEY}')==='off')document.documentElement.dataset.motion='off'}catch(e){}`

/** Leitura imperativa (fora do React): reduce do sistema ou botão de pausa. */
export function motionDisabled() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off"
  )
}

/** Efeitos que seguem o cursor só fazem sentido com mouse. */
export function finePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

/** Efeitos caros (parallax, 3D, seção fixada) só a partir de 768 px. */
export const DESKTOP_QUERY = "(min-width: 768px)"
