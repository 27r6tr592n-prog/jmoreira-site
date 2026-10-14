import type { Metadata } from "next"
import Image from "next/image"
import { BadgeCheck, Clock, Handshake, HeartHandshake, ShieldCheck } from "lucide-react"

import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/motion/reveal"
import { FinalCta } from "@/components/sections/final-cta"
import { PageHero } from "@/components/sections/page-hero"
import { SectionHeading } from "@/components/sections/section-heading"
import { pageMetadata } from "@/lib/seo"
import { fullAddress, site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Quem somos",
  description:
    "Conheça a JMoreira Serviços: assistência técnica em elétrica, hidráulica e limpeza de placas solares em São José do Rio Preto, com E-commerce de peças, Leva e Traz e rede de mais de 2.500 prestadores.",
  path: "/quem-somos",
})

const values = [
  { icon: HeartHandshake, title: "Preço combinado antes", text: "Você aprova o orçamento antes de qualquer reparo. Sem surpresa no final." },
  { icon: Clock, title: "Chegar quando promete", text: "Chegada em até 120 minutos em Rio Preto, e aviso no WhatsApp se algo mudar." },
  { icon: BadgeCheck, title: "Técnico licenciado", text: "Só atende cliente quem passou pela nossa avaliação e pelo padrão JMoreira." },
  { icon: ShieldCheck, title: "Garantia de verdade", text: "90 dias sobre o serviço, e a gente volta se precisar." },
]

// Fotos publicadas pela própria JMoreira no Perfil da Empresa no Google.
// TODO cliente: confirmar a autorização de uso de imagem das pessoas que aparecem.
const team = [
  { role: "Central de atendimento", text: "Recebe seu chamado no WhatsApp, entende o problema e agenda a visita.", src: "/fotos/equipe-atendimento.jpg", position: "50% 40%" },
  { role: "Técnicos em campo", text: "Profissionais licenciados e uniformizados que vão até a sua casa ou empresa.", src: "/fotos/tecnico-eletricista.jpg", position: "50% 30%" },
  { role: "Frota de atendimento", text: "Motos e reboque identificados, para chegar rápido em toda Rio Preto.", src: "/fotos/moto-atendimento.jpg", position: "50% 55%" },
  { role: "Gestão", text: "Acompanha cada chamado, os prazos e a qualidade do serviço.", src: "/fotos/gestao.jpg", position: "50% 35%" },
]

export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Quem somos", path: "/quem-somos" }]}
        eyebrow="Quem somos"
        title="Serviço rápido, preço claro e técnico de confiança"
        description={`A JMoreira nasceu em São José do Rio Preto com uma ideia simples: quando algo quebra em casa, você precisa de alguém bom, rápido e honesto. “${site.slogan}”`}
      />

      <section aria-labelledby="historia" className="py-16 sm:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <SectionHeading id="historia" eyebrow="Nossa história" title="De uma equipe local a uma rede nacional" />
            {/* TODO cliente: completar com o ano de fundação e a história real da empresa. */}
            <p className="text-lg text-muted-foreground">
              Começamos atendendo chamados de elétrica e hidráulica em Rio Preto, com a sede no Jardim Alvorada. O boca a boca fez o
              resto.
            </p>
            <p className="text-lg text-muted-foreground">
              Com o tempo, montamos uma rede de prestadores em todo o Brasil e abrimos o E-commerce de peças hidráulicas e baterias para quem prefere resolver por conta própria.
            </p>
            <div className="rounded-2xl border-l-4 border-cta bg-surface p-5">
              <p className="text-sm font-bold tracking-wide text-brand-ink uppercase">Missão</p>
              <p className="mt-1 text-lg font-semibold">
                Levar os melhores serviços até você, com rapidez, preço justo e respeito pela sua casa.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-clip rounded-3xl border bg-surface shadow-lift">
            <Image
              src="/fotos/fachada-sede.jpg"
              alt="Fachada azul da sede da JMoreira Serviços, com o letreiro e o telefone, no Jardim Alvorada"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="parallax object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="numeros" className="bg-navy py-14 text-navy-foreground">
        <h2 id="numeros" className="sr-only">
          A JMoreira em números
        </h2>
        <ul className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { n: <CountUp value={site.rating.value} decimals={1} />, l: "nota no Google" },
            { n: <CountUp value={site.rating.count} />, l: "avaliações no Google" },
            { n: <CountUp value={2500} prefix="+" />, l: "prestadores na rede" },
            { n: <CountUp value={site.promises.arrivalMinutes} suffix=" min" />, l: "chegada em Rio Preto*" },
          ].map((s) => (
            <li key={s.l}>
              <p className="tabular text-4xl font-bold text-white sm:text-5xl">{s.n}</p>
              <p className="mt-1 text-sm text-white/70">{s.l}</p>
            </li>
          ))}
        </ul>
        <p className="container-page mt-6 text-center text-xs text-white/60">*{site.promises.arrivalCaveat}</p>
      </section>

      <section aria-labelledby="valores" className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading id="valores" eyebrow="Como trabalhamos" title="O que você pode esperar de nós" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="lift rounded-2xl border bg-card p-6 shadow-soft hover:shadow-lift">
                <Icon className="size-7 text-brand-ink" aria-hidden />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="estrutura" className="border-y bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading id="estrutura" eyebrow="Estrutura e equipe" title="Quem cuida do seu atendimento" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t, i) => (
              <Reveal as="li" key={t.role} delay={i * 90} className="lift group overflow-hidden rounded-2xl border bg-card hover:shadow-lift">
                <div className="relative aspect-[4/3] bg-surface">
                  <Image
                    src={t.src}
                    alt={`${t.role} da JMoreira`}
                    style={{ objectPosition: t.position }}
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{t.role}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="empresas" className="py-16 sm:py-20">
        <div className="container-page flex flex-col gap-4 rounded-3xl border bg-card p-8 sm:flex-row sm:items-center">
          <Handshake className="size-10 shrink-0 text-brand-ink" aria-hidden />
          <div>
            <h2 id="empresas" className="text-xl font-bold">
              Dados da empresa
            </h2>
            <p className="mt-1 text-muted-foreground">
              {site.legalName} · CNPJ {site.cnpj} · {fullAddress}
            </p>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
