"use client"

import { useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react"
import { cn } from "cn"

import { MotionScope } from "@/components/motion/motion-scope"
import { spring } from "@/lib/motion"
import { icons, type Step } from "./how-it-works-steps"

/** Versão fixada (desktop com movimento). Carregada sob demanda junto com o Motion. */
export default function HowItWorksPinned(props: { heading: ReactNode; steps: readonly Step[] }) {
  return (
    <MotionScope>
      <Pinned {...props} />
    </MotionScope>
  )
}

function Pinned({ heading, steps }: { heading: ReactNode; steps: readonly Step[] }) {
  const ref = useRef<HTMLDivElement>(null)
  // 0 quando o topo da seção encosta no topo da tela, 1 quando o fim encosta no fim
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(steps.length - 1, Math.floor(v * steps.length))))

  return (
    // Altura = 1 tela + ~60% de tela por passo de scroll
    <div ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="container-page grid w-full grid-cols-12 items-center gap-8 pt-16 lg:gap-14">
          <div className="col-span-6 lg:col-span-5">
            {heading}
            <ol className="relative mt-10 space-y-6" aria-label="Passos do atendimento">
              {/* trilho e preenchimento (scaleY ligado ao scroll) */}
              <span aria-hidden className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 rounded-full bg-border" />
              <span aria-hidden className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 overflow-hidden rounded-full">
                <m.span className="block size-full origin-top bg-brand" style={{ scaleY: scrollYProgress }} />
              </span>
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex items-center gap-4" aria-current={active === i ? "step" : undefined}>
                  <m.span
                    className="relative grid size-10 shrink-0 place-items-center rounded-full border-2 border-border bg-background text-sm font-bold"
                    animate={{ scale: active === i ? 1.35 : 1 }}
                    transition={spring}
                  >
                    {/* camada preenchida aparece por opacidade (sem animar cor) */}
                    <m.span
                      aria-hidden
                      className="absolute -inset-0.5 rounded-full bg-brand"
                      animate={{ opacity: i <= active ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className={cn("tabular relative", i <= active ? "text-white" : "text-muted-foreground")}>{i + 1}</span>
                  </m.span>
                  <span
                    className={cn(
                      "text-base font-bold transition-opacity duration-200",
                      active === i ? "opacity-100" : "opacity-70", // 70%: contraste ≥ 4,5:1
                    )}
                  >
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative col-span-6 aspect-[4/5] lg:col-span-7 lg:aspect-[4/3]">
            {steps.map((step, i) => (
              <Panel key={step.title} step={step} index={i} total={steps.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Cada painel ocupa 1/4 do scroll; cruza com o vizinho nas fronteiras. */
function Panel({ step, index, total, progress }: { step: Step; index: number; total: number; progress: MotionValue<number> }) {
  const h = 0.04
  const start = index / total
  const end = (index + 1) / total
  const first = index === 0
  const last = index === total - 1
  const input = first ? [end - h, end + h] : last ? [start - h, start + h] : [start - h, start + h, end - h, end + h]
  const opacity = useTransform(progress, input, first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0])
  const y = useTransform(progress, input, first ? [0, -40] : last ? [40, 0] : [40, 0, 0, -40])
  const scale = useTransform(progress, [start, end], [1.08, 1])
  const Icon = icons[index]

  return (
    <m.article style={{ opacity, y }} className="absolute inset-0 overflow-hidden rounded-3xl bg-navy shadow-lift">
      <m.div style={{ scale }} className="absolute inset-0">
        <Image src={step.photo} alt={step.alt} fill sizes="(min-width: 1280px) 680px, 58vw" className="object-cover" />
      </m.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
      <span
        aria-hidden
        className="tabular absolute top-4 right-6 text-[7rem] leading-none font-bold text-white/15 select-none"
      >
        0{index + 1}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
        <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-cta text-cta-foreground">
          <Icon className="size-6" aria-hidden />
        </span>
        <h3 className="text-xl font-semibold lg:text-2xl">{step.title}</h3>
        <p className="mt-2 max-w-md text-white/85">{step.description}</p>
      </div>
    </m.article>
  )
}
