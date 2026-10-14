import { Quote } from "lucide-react"

import { GoogleIcon } from "@/components/brand/icons"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { mapsUrl } from "@/lib/site"

// Depoimentos reais do Google, fornecidos pelo cliente (texto exato).
const reviews = [
  { text: "Prestador Lucas nota 10, super profissional", context: "Avaliação 5 estrelas no Google" },
  { text: "Ótimos profissionais e ótimo atendimento!", context: "Avaliação 5 estrelas no Google" },
  { text: "Técnico Rogério (eletricista e encanador) sensacional, recomendo demais a JMoreira", context: "Avaliação 5 estrelas no Google" },
]

// Estrelas em texto (um caractere cada): bem mais leve que 5 SVGs por card
function Stars({ className = "text-base" }: { className?: string }) {
  return (
    <span className={`leading-none tracking-[0.12em] text-cta ${className}`} aria-hidden>
      ★★★★★
    </span>
  )
}

export function Testimonials() {
  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="avaliacoes-titulo"
          eyebrow="Avaliações"
          title="Avaliações de clientes no Google"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal as="figure" key={r.text} delay={i * 110} className="lift flex flex-col rounded-2xl border bg-card p-6 shadow-soft hover:shadow-lift">
              <Quote className="size-7 text-brand-ink/30" aria-hidden />
              <blockquote className="mt-3 flex-1 text-xl leading-snug font-bold tracking-tight text-balance sm:text-2xl">“{r.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <GoogleIcon className="size-4" />
                <Stars />
                <span className="sr-only">5 de 5 estrelas.</span>
                {r.context.replace("Avaliação 5 estrelas no Google", "Google")}
              </figcaption>
            </Reveal>
          ))}
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-brand-ink underline-offset-4 hover:underline"
        >
          Ver todas as avaliações no Google <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    </section>
  )
}
