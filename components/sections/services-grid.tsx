import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Reveal, RevealItem } from "@/components/motion/reveal"
import { services, type Service } from "@/lib/services"
import { ServiceIcon } from "./service-icon"

export function ServiceCard({ service, headingLevel = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  return (
    <article className="lift gradient-border group relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand-soft-ink transition-colors group-hover:bg-brand group-hover:text-white">
          <ServiceIcon name={service.icon} className="size-6 transition-transform duration-300 group-hover:rotate-12" />
        </span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground">{service.audience}</span>
      </div>
      <Heading className="mt-5 text-xl font-bold">
        <Link href={`/servicos/${service.slug}`} className="after:absolute after:inset-0">
          {service.name}
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-muted-foreground">{service.card.summary}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {service.card.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-brand-ink" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
      <p className="mt-auto flex items-center gap-1 pt-6 text-sm font-bold text-brand-ink" aria-hidden>
        Ver serviço
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </p>
    </article>
  )
}

/**
 * Grade de serviços. Com `stack`, no celular os cartões grudam no topo e se
 * empilham como um baralho enquanto a página rola (.stack-card no globals.css).
 */
export function ServicesGrid({
  exclude,
  headingLevel,
  stack = false,
}: {
  exclude?: string
  headingLevel?: "h2" | "h3"
  stack?: boolean
}) {
  const list = exclude ? services.filter((s) => s.slug !== exclude) : services
  return (
    <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s, i) => (
        <RevealItem
          key={s.slug}
          className={stack ? "stack-card" : undefined}
          style={stack ? ({ "--stack": i } as React.CSSProperties) : undefined}
        >
          <ServiceCard service={s} headingLevel={headingLevel} />
        </RevealItem>
      ))}
    </Reveal>
  )
}
