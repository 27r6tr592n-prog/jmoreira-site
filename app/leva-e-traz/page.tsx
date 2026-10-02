import type { Metadata } from "next"
import { Briefcase, Package, Users } from "lucide-react"

import { LevaETrazForm } from "@/components/forms/leva-e-traz-form"
import { Reveal, RevealItem } from "@/components/motion/reveal"
import { PageHero } from "@/components/sections/page-hero"
import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Leva e Traz em Rio Preto: pessoas, encomendas e transporte executivo",
  description:
    "Leva e Traz JMoreira em São José do Rio Preto e região: transporte de pessoas, encomendas pequenas e transporte executivo. Informe origem e destino; o valor é combinado antes.",
  path: "/leva-e-traz",
})

// Tipos atendidos (decisão do cliente, v3). Sem preço publicado: valor a combinar.
const kinds = [
  { icon: Users, title: "Pessoas", text: "Deslocamento de passageiros entre endereços de Rio Preto e da região." },
  { icon: Package, title: "Encomendas pequenas", text: "Coleta em um endereço e entrega em outro, para volumes pequenos." },
  { icon: Briefcase, title: "Transporte executivo", text: "Transporte de executivos e convidados com data e horário agendados." },
]

export default function LevaETrazPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Leva e Traz", path: "/leva-e-traz" }]}
        eyebrow="Leva e Traz"
        title="Leva e Traz em São José do Rio Preto"
        description="Transporte de pessoas, encomendas pequenas e transporte executivo entre endereços de Rio Preto e da região."
      />

      <section aria-labelledby="tipos" className="py-14 sm:py-20">
        <div className="container-page">
          <h2 id="tipos" className="sr-only">
            Tipos de transporte
          </h2>
          <Reveal as="ul" stagger className="grid gap-4 md:grid-cols-3">
            {kinds.map(({ icon: Icon, title, text }) => (
              <RevealItem as="li" key={title} className="rounded-2xl border bg-card p-6 shadow-soft">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand-soft-ink">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl">{title}</h3>
                <p className="mt-1 text-muted-foreground">{text}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="solicitar" aria-labelledby="solicitar-titulo" className="scroll-mt-24 border-t bg-surface py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-4">
            <p className="eyebrow">Pedido</p>
            <h2 id="solicitar-titulo" className="text-3xl sm:text-4xl">
              Solicitar Leva e Traz
            </h2>
            <p className="text-muted-foreground">
              Informe o tipo de transporte, a origem e o destino. O valor é combinado antes da confirmação, conforme trajeto,
              horário e tipo de transporte, e enviado pelo telefone ou WhatsApp que você informar.
            </p>
            <p className="text-sm text-muted-foreground">Atendimento {site.hours.label.toLowerCase()}.</p>
            <WhatsAppCta message="Olá, JMoreira! Quero um orçamento de Leva e Traz." size="lg" label="Pedir pelo WhatsApp" />
          </Reveal>
          <Reveal variant="scale" delay={120} className="rounded-3xl border bg-card p-5 shadow-lift sm:p-8">
            <LevaETrazForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
