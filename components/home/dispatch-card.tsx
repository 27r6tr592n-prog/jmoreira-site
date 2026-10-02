"use client"

import { useEffect, useRef, useState } from "react"
import { BadgeCheck, Check, MapPin, ShieldCheck, Truck, Wrench } from "lucide-react"
import { cn } from "cn"

import { motionDisabled } from "@/lib/motion"

// Ilustração do fluxo de atendimento (não são dados reais). Toca uma vez,
// quando o card aparece, e para no estado final. Decorativo: aria-hidden.

const steps = [
  { t: "Chamado recebido", d: "Foto do quadro de luz pelo WhatsApp" },
  { t: "Visita agendada", d: "Hoje, Jardim Alvorada" },
  { t: "Técnico a caminho", d: "Eletricista licenciado" },
  { t: "Orçamento e serviço", d: "Você aprova antes de começar" },
]
const status = ["Recebendo chamado", "Agendando visita", "Técnico a caminho", "Em atendimento", "Serviço concluído"]
// Quanto tempo cada etapa fica "em andamento" (ms)
const durations = [1000, 1100, 2400, 1400]

export function DispatchCard() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (motionDisabled()) {
      setPhase(steps.length)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let at = 500
        durations.forEach((ms, i) => {
          at += ms
          timers.push(setTimeout(() => setPhase(i + 1), at))
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  const done = phase >= steps.length

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div
        className="absolute -top-6 -right-4 z-10 hidden rotate-3 rounded-2xl bg-navy px-5 py-4 text-white shadow-lift sm:block"
        style={{ animation: "pop-in 0.5s var(--ease-spring) 0.6s both" }}
      >
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">Chegada</p>
        <p className="tabular text-4xl font-extrabold">
          120<span className="text-xl text-cta">min</span>
        </p>
      </div>

      <div className="glow-border animate-rise-in rounded-3xl border bg-card p-5 shadow-lift sm:p-6" style={{ animationDelay: "150ms" }}>
        <div className="flex flex-col items-start gap-2 pr-24 sm:pr-28">
          <p className="text-sm font-bold">Seu atendimento</p>
          <span
            key={phase}
            className={cn(
              "animate-rise-in inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
              done ? "bg-success-soft text-success" : "bg-brand-soft text-brand-soft-ink",
            )}
          >
            {done ? (
              <Check className="size-3.5" />
            ) : (
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
            )}
            {status[phase]}
          </span>
        </div>

        <ol className="mt-5">
          {steps.map((step, i) => {
            const isDone = i < phase
            const isCurrent = i === phase
            return (
              <li key={step.t} className="relative flex gap-3 pb-5 last:pb-0">
                {i < steps.length - 1 && (
                  <span className="absolute top-7 left-[13px] h-[calc(100%-1.25rem)] w-0.5 overflow-hidden bg-border">
                    <span
                      className="block h-full w-full origin-top bg-brand transition-transform duration-500 ease-out"
                      style={{ transform: `scaleY(${isDone ? 1 : 0})` }}
                    />
                  </span>
                )}
                <span
                  className={cn(
                    "relative grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300",
                    isDone ? "bg-brand text-white" : isCurrent ? "border-2 border-brand bg-card" : "border-2 border-border bg-card",
                  )}
                >
                  {isDone && <Check className="animate-pop-in size-4" strokeWidth={3} />}
                  {isCurrent && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
                      <span className="size-2 rounded-full bg-brand" />
                    </>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold transition-colors", !isDone && !isCurrent && "text-muted-foreground")}>{step.t}</p>
                  <p className="text-xs text-muted-foreground">{step.d}</p>
                  {i === 2 && isCurrent && (
                    <div className="animate-rise-in relative mt-2 h-7">
                      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
                      <div
                        className="absolute top-1/2 left-0 h-1 w-full origin-left -translate-y-1/2 rounded-full bg-brand"
                        style={{ animation: "fill-x 2.2s var(--ease-out) both" }}
                      />
                      <Truck
                        className="absolute top-0 size-7 rounded-md bg-card p-1 text-brand-ink"
                        style={{ animation: "drive 2.2s var(--ease-out) both" }}
                      />
                      <MapPin className="absolute top-0 right-0 size-7 p-1 text-cta" />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 grid grid-cols-3 gap-2 border-t pt-5 text-center">
          {[
            { icon: BadgeCheck, label: "Licenciado" },
            { icon: Wrench, label: "Peças no carro" },
            done ? { icon: ShieldCheck, label: "Garantia 90 dias" } : { icon: MapPin, label: "Rio Preto e região" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className={cn("space-y-1.5 rounded-xl bg-surface px-1 py-3", label.startsWith("Garantia") && "animate-pop-in bg-success-soft")}>
              <Icon className={cn("mx-auto size-5", label.startsWith("Garantia") ? "text-success" : "text-brand-ink")} />
              <p className="text-[0.7rem] leading-tight font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
