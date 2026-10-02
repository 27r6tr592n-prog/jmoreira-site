import { BadgeCheck, BadgePercent, Clock, Star } from "lucide-react"

import { CountUp } from "@/components/motion/count-up"
import { Reveal, RevealItem } from "@/components/motion/reveal"
import { formatBRL } from "@/lib/format"
import { site } from "@/lib/site"

// Os quatro números que o cliente pediu para animar. O HTML já sai com o valor final.
const stats = [
  { value: site.promises.arrivalMinutes, suffix: " min", label: "prazo de chegada em Rio Preto*", decimals: 0 },
  { value: Number(site.promises.providers.replace(".", "")), prefix: "+", label: "prestadores cadastrados", decimals: 0 },
  { value: site.rating.value, label: `nota no ${site.rating.source}`, decimals: 1, star: true },
  { value: site.rating.count, label: "clientes avaliaram no Google", decimals: 0 },
] as const

const seals = [
  { icon: BadgeCheck, text: "Técnicos licenciados e identificados" },
  { icon: BadgePercent, text: `Visita de ${formatBRL(site.promises.visitFee)}, descontada se fechar no dia` },
  { icon: Clock, text: `Atendimento ${site.hours.label.toLowerCase()}` },
]

export function TrustBar() {
  return (
    <section aria-label="A JMoreira em números" className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="container-page py-10 sm:py-12">
        <Reveal as="dl" stagger className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="flex flex-col-reverse gap-1 border-l-2 border-cta/70 pl-4">
              <dt className="text-sm text-white/75">{s.label}</dt>
              <dd className="flex items-baseline gap-1.5 text-3xl leading-none font-extrabold tracking-tight text-white sm:text-5xl">
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  prefix={"prefix" in s ? s.prefix : ""}
                  suffix={"suffix" in s ? s.suffix : ""}
                />
                {"star" in s && <Star className="size-6 shrink-0 fill-cta text-cta sm:size-7" aria-label="estrelas" />}
              </dd>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal as="ul" stagger delay={200} className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {seals.map(({ icon: Icon, text }) => (
            <RevealItem
              as="li"
              key={text}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm"
            >
              <Icon className="size-4 text-cta" aria-hidden />
              {text}
            </RevealItem>
          ))}
        </Reveal>
        <p className="mt-4 text-xs text-white/65">*{site.promises.arrivalCaveat}</p>
      </div>
    </section>
  )
}
