import type { Metadata } from "next"

import { PrivateServiceForm } from "@/components/forms/private-service-form"
import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/sections/page-hero"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Solicitar serviço particular",
  description:
    "Peça à JMoreira um serviço sob medida em São José do Rio Preto: descreva o que precisa, o endereço e o melhor horário, e receba o orçamento pelo telefone.",
  path: "/servico-particular",
})

export default function ServicoParticularPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Serviço particular", path: "/servico-particular" }]}
        eyebrow="Serviço particular"
        title="Solicitar serviço particular"
        description="Para o serviço que não está na lista ou que precisa de um orçamento sob medida."
      />
      <section aria-label="Formulário de pedido" className="py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-3 text-muted-foreground">
            <p>Descreva o serviço, o endereço e o melhor horário. Retornamos pelo telefone informado com o orçamento e a data da visita.</p>
            <p className="text-sm">Atendimento {site.hours.label.toLowerCase()}.</p>
          </Reveal>
          <Reveal variant="scale" delay={120} className="rounded-3xl border bg-card p-5 shadow-lift sm:p-8">
            <PrivateServiceForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
