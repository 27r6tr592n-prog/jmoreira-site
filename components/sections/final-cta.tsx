import { Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { site, telHref } from "@/lib/site"
import { Spotlight } from "@/components/motion/fx"
import { Reveal, SplitWords } from "@/components/motion/reveal"
import { WhatsAppCta } from "./whatsapp-cta"

export function FinalCta({
  title = "Solicite atendimento pelo WhatsApp",
  message = "Olá, JMoreira! Vim pelo site e preciso de um técnico.",
}: {
  title?: string
  message?: string
}) {
  return (
    <section aria-labelledby="cta-final" className="sd-grow relative overflow-clip bg-brand text-white">
      <div aria-hidden className="sd-drift-bg absolute -inset-y-12 inset-x-0 bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <Spotlight color="rgb(255 255 255 / 0.16)" />
      <div className="container-page relative flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="cta-final" className="max-w-2xl text-3xl font-semibold sm:text-4xl">
          <SplitWords text={title} />
        </h2>
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
