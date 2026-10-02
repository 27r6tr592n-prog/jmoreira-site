import { Quote, Users } from "lucide-react"

import { GoogleIcon } from "@/components/brand/icons"
import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { mapsUrl, site } from "@/lib/site"

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
          eyebrow="Quem chamou, recomenda"
          title="Nota 4,8 no Google, com 86 avaliações"
          description="O que os clientes de Rio Preto dizem depois do atendimento."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_0.9fr]">
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
          <Reveal variant="scale" delay={330} className="flex flex-col justify-between gap-6 rounded-2xl bg-navy p-6 text-white">
            <div>
              <p className="tabular text-6xl font-extrabold">
                <CountUp value={site.rating.value} decimals={1} />
              </p>
              <Stars className="text-xl" />
              <p className="mt-2 text-sm text-white/75">{site.rating.count} avaliações no Google</p>
            </div>
            <div className="flex items-center gap-3 border-t border-white/15 pt-5">
              <Users className="size-6 shrink-0 text-cta" aria-hidden />
              <p className="text-sm">
                <strong className="text-base">+{site.promises.providers}</strong> prestadores cadastrados na rede JMoreira no Brasil
              </p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm font-bold text-cta underline-offset-4 hover:underline"
            >
              Ver avaliações no Google <span className="sr-only">(abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
