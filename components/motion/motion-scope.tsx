"use client"

import type { ReactNode } from "react"
import { LazyMotion, MotionConfig, domAnimation, domMax } from "motion/react"

import { duration, easeOut } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

/**
 * Liga o Motion só onde ele é usado (drawer, catálogo, galeria do produto,
 * seção fixada). Essas partes já carregam sob demanda, então a biblioteca
 * não entra no JS inicial das páginas. Com movimento reduzido, toda transição
 * vira um fade de 120 ms. `layout` pede o pacote com animação de layout (FLIP).
 */
export function MotionScope({ children, layout = false }: { children: ReactNode; layout?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <LazyMotion features={layout ? domMax : domAnimation} strict>
      <MotionConfig
        reducedMotion={reduced ? "always" : "never"}
        transition={reduced ? { duration: duration.reduced } : { duration: duration.enter, ease: easeOut }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
