"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

import type { Faq } from "@/lib/services"

/**
 * Acordeão do FAQ. A resposta fica sempre no HTML (SEO e leitura sem JS);
 * a altura abre e fecha em CSS (grid-template-rows 0fr → 1fr, exceção
 * documentada à regra transform/opacity) e o chevron gira 180°.
 */
export function FaqList({ faq }: { faq: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()

  return (
    <div className="rounded-2xl border bg-card px-5 shadow-soft sm:px-6">
      {faq.map((item, i) => {
        const isOpen = open === i
        const btn = `${base}-q${i}`
        const panel = `${base}-a${i}`
        return (
          <div key={item.q} className="not-last:border-b">
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 rounded-lg py-5 text-left text-base font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {item.q}
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-soft-ink transition-transform duration-200 ease-(--ease-out)",
                    isOpen && "rotate-180",
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              data-collapsible=""
              data-open={isOpen ? "" : undefined}
              inert={!isOpen}
              className="collapsible"
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-base text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
