"use client"

import { useEffect, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { CalendarCheck, CircleCheckBig, MessageCircle, Truck } from "lucide-react"

import { Reveal, RevealItem } from "@/components/motion/reveal"
import { useRichMotion } from "@/lib/use-reduced-motion"

export const icons = [MessageCircle, CalendarCheck, Truck, CircleCheckBig]

// A versão fixada (e o Motion) só baixa no desktop com movimento
const Pinned = dynamic(() => import("./how-it-works-pinned"), { ssr: false })

export type Step = { title: string; description: string; photo: string; alt: string }

/**
 * "Como funciona": no desktop com movimento, a seção trava na tela e os 4 passos
 * avançam com o scroll (linha de progresso vertical + número ativo crescendo).
 * No celular e com movimento reduzido vira uma lista simples com revelação.
 */
export function HowItWorksSteps({ heading, steps }: { heading: ReactNode; steps: readonly Step[] }) {
  const rich = useRichMotion()
  // Troca para a versão fixada só depois que o pedaço dela chegou (sem buraco na página)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (rich) void import("./how-it-works-pinned").then(() => setReady(true))
  }, [rich])
  return rich && ready ? <Pinned heading={heading} steps={steps} /> : <Static heading={heading} steps={steps} />
}

function Static({ heading, steps }: { heading: ReactNode; steps: readonly Step[] }) {
  return (
    <div className="container-page pt-16 pb-10 sm:pt-24">
      {heading}
      <Reveal as="ol" stagger className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
        <span aria-hidden className="absolute top-6 right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--brand)_0_12px,transparent_12px_18px)] md:block" />
        <span aria-hidden className="absolute top-6 bottom-6 left-6 w-0.5 bg-[repeating-linear-gradient(180deg,var(--brand)_0_10px,transparent_10px_18px)] md:hidden" />
        {steps.map((step, i) => {
          const Icon = icons[i]
          return (
            <RevealItem as="li" key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-soft ring-8 ring-background">
                <Icon className="size-6" aria-hidden />
                <span className="tabular absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-cta text-xs font-bold text-cta-foreground">
                  {i + 1}
                </span>
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </RevealItem>
          )
        })}
      </Reveal>
    </div>
  )
}
