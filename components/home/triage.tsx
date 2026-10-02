"use client"

import Link from "next/link"
import { useId, useRef, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Car,
  CircleCheck,
  Droplets,
  Flame,
  MousePointerClick,
  PlugZap,
  ShowerHead,
  Sun,
  Timer,
  Waves,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { neighborhoods, site } from "@/lib/site"
import { triage, urgencyLabel, type TriageIcon, type Urgency } from "@/lib/triage"
import { whatsappUrl } from "@/lib/whatsapp"

const icons: Record<TriageIcon, LucideIcon> = {
  plug: PlugZap,
  zap: Zap,
  flame: Flame,
  droplets: Droplets,
  waves: Waves,
  shower: ShowerHead,
  car: Car,
  sun: Sun,
  wrench: Wrench,
}

const urgencyStyle: Record<Urgency, string> = {
  agora: "bg-destructive/10 text-destructive",
  hoje: "bg-warning-soft text-warning-ink",
  agendar: "bg-brand-soft text-brand-soft-ink",
}

export function Triage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [bairro, setBairro] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const selected = triage.find((t) => t.id === selectedId) ?? null

  const choose = (id: string) => {
    setSelectedId(id)
    // No celular o painel fica abaixo da grade: rola até ele
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }))
    }
  }

  const message = selected
    ? `Olá, JMoreira! Estou com este problema: ${selected.label.toLowerCase()}.${bairro.trim() ? ` Bairro: ${bairro.trim()}.` : ""} Podem me ajudar?`
    : "Olá, JMoreira! Vim pelo site e preciso de um técnico."

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-start">
      <div role="group" aria-label="Escolha o problema" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {triage.map((item) => {
          const Icon = icons[item.icon]
          const active = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(item.id)}
              className={cn(
                "lift group flex min-h-24 flex-col items-start justify-between gap-3 rounded-2xl border-2 bg-card p-4 text-left shadow-soft",
                active ? "border-brand bg-brand-soft" : "border-transparent hover:border-brand-ink/30",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl transition-colors",
                  active ? "bg-brand text-white" : "bg-brand-soft text-brand-soft-ink group-hover:bg-brand group-hover:text-white",
                  item.urgency === "agora" && !active && "bg-destructive/10 text-destructive",
                )}
              >
                <Icon className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden />
              </span>
              <span className={cn("text-sm leading-snug font-bold", active && "text-brand-soft-ink")}>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div ref={panelRef} className="scroll-mt-28 lg:sticky lg:top-28">
        <div aria-live="polite" className="glow-border rounded-3xl border bg-card p-6 shadow-lift sm:p-7">
          {!selected ? (
            // No celular o painel vazio vira só o atalho do WhatsApp (as opções já estão logo acima)
            <div className="flex flex-col items-center gap-4 text-center lg:py-8">
              <span className="hidden size-14 place-items-center rounded-2xl bg-brand-soft text-brand-soft-ink lg:grid">
                <MousePointerClick className="size-7 animate-bounce [animation-iteration-count:3]" aria-hidden />
              </span>
              <div className="hidden space-y-1 lg:block">
                <p className="text-lg font-bold">Escolha o que está acontecendo</p>
                <p className="text-sm text-muted-foreground">
                  Mostramos o que fazer agora, com segurança, enquanto o técnico não chega.
                </p>
              </div>
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-ink hover:underline"
              >
                <WhatsAppIcon className="size-4 text-whatsapp" />
                Não está na lista? Descreva no WhatsApp
              </a>
            </div>
          ) : (
            <div key={selected.id} className="space-y-5">
              <div className="animate-rise-in space-y-2">
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", urgencyStyle[selected.urgency])}>
                  {urgencyLabel[selected.urgency]}
                </span>
                <h3 className="text-2xl font-extrabold">{selected.label}</h3>
              </div>

              <div>
                <p className="text-sm font-bold">O que fazer agora</p>
                <ol className="mt-2 space-y-2">
                  {selected.now.map((step, i) => (
                    <li
                      key={step}
                      className="animate-rise-in flex gap-2.5 text-sm"
                      style={{ animationDelay: `${120 + i * 90}ms` }}
                    >
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="animate-rise-in flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ animationDelay: "400ms" }}>
                <Link href={selected.link.href} className="inline-flex min-h-10 items-center gap-1 font-bold text-brand-ink hover:underline">
                  {selected.link.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                {selected.tip && (
                  <Link href={selected.tip.href} className="inline-flex min-h-10 items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline">
                    <BookOpen className="size-4" aria-hidden />
                    {selected.tip.label}
                  </Link>
                )}
              </div>

              <div className="animate-rise-in space-y-3 border-t pt-5" style={{ animationDelay: "480ms" }}>
                <div className="space-y-1.5">
                  <label htmlFor={`${uid}-bairro`} className="block text-sm font-semibold">
                    Seu bairro <span className="font-normal text-muted-foreground">(opcional)</span>
                  </label>
                  <Input
                    id={`${uid}-bairro`}
                    name="bairro"
                    list={`${uid}-bairros`}
                    autoComplete="address-level3"
                    placeholder="Ex.: Boa Vista…"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                  <datalist id={`${uid}-bairros`}>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </div>
                <a
                  href={whatsappUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "cta", size: "lg", className: "shine w-full" })}
                >
                  <WhatsAppIcon className="size-5" />
                  Chamar técnico no WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="size-3.5" aria-hidden />
                  Chegada em até {site.promises.arrivalMinutes} min em Rio Preto*
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
