import { Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { formatBRL } from "@/lib/format"
import { site, telHref } from "@/lib/site"
import { Spotlight } from "@/components/motion/fx"
import { Reveal, SplitWords } from "@/components/motion/reveal"
import { WhatsAppCta } from "./whatsapp-cta"

export function FinalCta({
  title = "Problema em casa? Chame a JMoreira para já.",
  message = "Olá, JMoreira! Vim pelo site e preciso de um técnico.",
}: {
  title?: string
  message?: string
}) {
  return (
    <section aria-labelledby="cta-final" className="relative overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <Spotlight color="rgb(255 255 255 / 0.16)" />
      <div className="container-page relative flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 id="cta-final" className="text-3xl font-extrabold sm:text-4xl">
            <SplitWords text={title} />
          </h2>
          <Reveal as="p" delay={200} className="text-lg text-white/85">
            Chame no WhatsApp, mande uma foto e receba a previsão de chegada. Visita de {formatBRL(site.promises.visitFee)},
            descontada se você fechar no dia.
          </Reveal>
        </div>
        <Reveal delay={120} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
          <WhatsAppCta message={message} className="shine" />
          <a href={telHref} className={buttonVariants({ variant: "outline-inverse", size: "xl" })}>
            <Phone aria-hidden />
            {site.phone.display}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
