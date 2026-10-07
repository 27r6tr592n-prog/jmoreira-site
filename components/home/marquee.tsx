import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { VelocitySkew } from "@/components/motion/velocity-skew"

// Marcas de bateria vendidas no E-commerce (texto, sem logotipos de terceiros).
const brands = ["Moura", "Heliar", "Bosch", "Pioneiro", "Zetta"]

// Cada metade da faixa precisa cobrir telas largas: 2 voltas por metade.
const half = [...brands, ...brands]

function Half() {
  return (
    <>
      {half.map((name, i) => (
        <span key={`${name}-${i}`} className="flex shrink-0 items-center gap-8 pr-8">
          <span
            className={
              i % 2
                ? "text-4xl font-bold tracking-tight text-transparent [-webkit-text-stroke:1.5px_var(--brand-ink)] sm:text-6xl"
                : "text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            }
          >
            {name}
          </span>
          <span className="size-2.5 rotate-45 rounded-[2px] bg-cta sm:size-3.5" />
        </span>
      ))}
    </>
  )
}

/** Faixa infinita com as marcas; para no hover/foco e com "Pausar animações"; inclina com a velocidade da rolagem. */
export function Marquee() {
  return (
    <section aria-labelledby="marcas" className="border-b bg-surface py-8 sm:py-10">
      <div className="container-page mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="marcas" className="eyebrow">
          Baterias das marcas que você conhece
        </h2>
        <Link
          href="/loja/categoria/baterias"
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline"
        >
          Ver baterias com instalação
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      <p className="sr-only">{brands.join(", ")}.</p>
      <div
        aria-hidden
        className="group overflow-hidden select-none [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      >
        {/* Rolagem rápida inclina as letras (desktop) */}
        <VelocitySkew>
          <div className="marquee-track">
            <Half />
            <Half />
          </div>
        </VelocitySkew>
      </div>
    </section>
  )
}
