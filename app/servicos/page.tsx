import type { Metadata } from "next"
import { BadgeCheck, BadgePercent, ShieldCheck, Timer } from "lucide-react"

import { FaqSection } from "@/components/sections/faq-section"
import { FinalCta } from "@/components/sections/final-cta"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PageHero } from "@/components/sections/page-hero"
import { SectionHeading } from "@/components/sections/section-heading"
import { ServicesGrid } from "@/components/sections/services-grid"
import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { formatBRL } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { generalFaq } from "@/lib/services"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Serviços de eletricista, encanador e manutenção em Rio Preto",
  description:
    "Eletricista, encanador, energia solar, manutenção predial, residencial e frotas em São José do Rio Preto. Chegada em até 2h e visita de R$ 60 descontada.",
  path: "/servicos",
})

const guarantees = [
  { icon: Timer, title: `Chegada em até ${site.promises.arrivalMinutes} minutos*`, text: "Na maior parte de Rio Preto, das 7h às 21h." },
  { icon: BadgePercent, title: `Visita de ${formatBRL(site.promises.visitFee)}`, text: site.promises.visitFeeRule },
  { icon: BadgeCheck, title: "Técnicos licenciados", text: "Profissionais aprovados pela JMoreira e identificados na visita." },
  { icon: ShieldCheck, title: "90 dias de garantia", text: "Em todo serviço, como prevê o Código de Defesa do Consumidor." },
]

export default function ServicosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Serviços", path: "/servicos" }]}
        eyebrow="Serviços em Rio Preto e região"
        title="Serviços de eletricista, encanador e manutenção em Rio Preto"
        description="Escolha o serviço ou chame direto no WhatsApp: a gente entende o problema e manda o técnico certo."
      >
        <WhatsAppCta message="Olá, JMoreira! Vim pela página de serviços e quero um orçamento." />
      </PageHero>

      <section aria-labelledby="lista-servicos" className="py-14 sm:py-20">
        <div className="container-page">
          <h2 id="lista-servicos" className="sr-only">
            Lista de serviços
          </h2>
          <ServicesGrid headingLevel="h3" />
        </div>
      </section>

      <section aria-labelledby="garantias" className="border-y bg-surface py-14 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="garantias"
            eyebrow="Em qualquer serviço"
            title="O que vale para todo atendimento JMoreira"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border bg-card p-5">
                <Icon className="size-7 text-brand-ink" aria-hidden />
                <p className="mt-4 font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">*{site.promises.arrivalCaveat}</p>
        </div>
      </section>

      <HowItWorks />
      <FaqSection faq={generalFaq} className="border-t bg-surface py-16 sm:py-24" />
      <FinalCta title="Não sabe qual serviço escolher? Descreva o problema." />
    </>
  )
}
