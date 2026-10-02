"use client"

import { useSyncExternalStore } from "react"

import { DESKTOP_QUERY, MOTION_KEY } from "@/lib/motion"

// Movimento reduzido = preferência do sistema OU botão "Pausar animações".
// Store externo: todos os componentes reagem juntos quando um dos dois muda.

const EVENT = "jmoreira:motion"
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)"

// MediaQueryList criados uma vez só (getSnapshot roda a cada render de cada componente)
let reduceMq: MediaQueryList | null = null
let desktopMq: MediaQueryList | null = null
const reduceList = () => (reduceMq ??= window.matchMedia(REDUCE_QUERY))
const desktopList = () => (desktopMq ??= window.matchMedia(DESKTOP_QUERY))

function subscribe(callback: () => void) {
  const mq = reduceList()
  mq.addEventListener("change", callback)
  window.addEventListener(EVENT, callback)
  return () => {
    mq.removeEventListener("change", callback)
    window.removeEventListener(EVENT, callback)
  }
}

function getSnapshot() {
  return reduceList().matches || document.documentElement.dataset.motion === "off"
}

/** No servidor assumimos movimento ligado; o CSS cobre quem prefere reduzir antes da hidratação. */
const getServerSnapshot = () => false

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Liga/desliga o botão "Pausar animações" e avisa os componentes. */
export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = "off"
  else delete document.documentElement.dataset.motion
  try {
    localStorage.setItem(MOTION_KEY, paused ? "off" : "on")
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

function subscribeDesktop(callback: () => void) {
  const mq = desktopList()
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

/** true a partir de 768 px. Parallax, 3D e seção fixada só ligam aqui. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => desktopList().matches, () => false)
}

/** Efeitos "ricos" ativos: desktop e sem movimento reduzido. */
export function useRichMotion() {
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()
  return desktop && !reduced
}
