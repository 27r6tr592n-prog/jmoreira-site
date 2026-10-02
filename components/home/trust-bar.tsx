import { Star } from "lucide-react"

import { CountUp } from "@/components/motion/count-up"
import { Reveal, RevealItem } from "@/components/motion/reveal"
import { site } from "@/lib/site"

// Os quatro números que o cliente pediu para animar. O HTML já sai com o valor final.
const stats = [
  { value: site.promises.arrivalMinutes, suffix: " min", label: "prazo de chegada em Rio Preto*", decimals: 0 },
  { value: Number(site.promises.providers.replace(".", "")), prefix: "+", label: "prestadores cadastrados", decimals: 0 },
  { value: site.rating.value, label: `nota no ${site.rating.source}`, decimals: 1, star: true },
  { value: site.rating.count, label: "clientes avaliaram no Google", decimals: 0 },
] as const

export function TrustBar() {
  return (
    <section aria-label="A JMoreira em números" className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="container-page py-10 sm:py-12">
        <Reveal as="dl" stagger className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="flex flex-col-reverse gap-1 border-l-2 border-cta/70 pl-4">
              <dt className="text-sm text-white/75">{s.label}</dt>
              <dd className="flex items-baseline gap-1.5 font-heading text-3xl leading-none font-semibold text-white sm:text-5xl">
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

        <p className="mt-4 text-xs text-white/65">*{site.promises.arrivalCaveat}</p>
      </div>
    </section>
  )
}
