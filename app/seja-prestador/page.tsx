import type { Metadata } from "next"
import { Award, BadgeCheck, CalendarClock, ClipboardCheck, GraduationCap, MapPinned, MessageSquareText, Wallet } from "lucide-react"

import { ProviderForm } from "@/components/forms/provider-form"
import { FaqSection } from "@/components/sections/faq-section"
import { PageHero } from "@/components/sections/page-hero"
import { SectionHeading } from "@/components/sections/section-heading"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Seja um prestador JMoreira",
  description:
    "Eletricista, encanador ou técnico de manutenção? Cadastre-se na rede JMoreira, faça os cursos do padrão de atendimento e receba o selo de prestador licenciado.",
  path: "/seja-prestador",
})

// TODO cliente: confirmar etapas, requisitos e o conteúdo dos cursos.
const benefits = [
  { icon: MessageSquareText, title: "Chamados na sua região", text: "Receba serviços perto de onde você já trabalha, sem gastar com anúncio." },
  { icon: CalendarClock, title: "Agenda flexível", text: "Você informa os horários em que pode atender." },
  { icon: Wallet, title: "Valores combinados antes", text: "Você sabe quanto vai receber antes de aceitar o chamado." },
  { icon: MapPinned, title: "Rede nacional", text: `Faça parte de uma rede com mais de ${site.promises.providers} prestadores no Brasil.` },
]

const steps = [
  { icon: ClipboardCheck, title: "Cadastro", text: "Preencha o formulário com suas especialidades e experiência." },
  { icon: BadgeCheck, title: "Avaliação", text: "Conferimos documentos e referências e fazemos uma conversa rápida pelo WhatsApp." },
  { icon: GraduationCap, title: "Cursos do padrão JMoreira", text: "Atendimento ao cliente, orçamento por escrito e segurança no trabalho." },
  { icon: Award, title: "Selo de licenciado", text: "Aprovado, você recebe o selo de Prestador Licenciado JMoreira e começa a receber chamados." },
]

const faq = [
  { q: "Preciso ter MEI ou CNPJ?", a: "Não é obrigatório para se cadastrar, mas é recomendado: facilita o recebimento e a emissão de nota para empresas." },
  { q: "Os cursos são pagos?", a: "Os cursos do padrão de atendimento JMoreira são oferecidos aos prestadores aprovados na avaliação." },
  { q: "Quais documentos vou precisar?", a: "Documento com foto, comprovante de endereço e, para eletricistas, certificados como NR-10 ajudam na avaliação." },
  { q: "Em quanto tempo recebo resposta?", a: "Analisamos os cadastros toda semana. Se o seu perfil combinar com a demanda da região, chamamos no WhatsApp." },
]

export default function SejaPrestadorPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Seja prestador", path: "/seja-prestador" }]}
        eyebrow="Trabalhe com a JMoreira"
        title="Seja um prestador licenciado JMoreira"
        description="Você entra com a experiência; a gente entra com os clientes, o treinamento e o selo que mostra que você é de confiança."
      />

      <section aria-labelledby="vantagens" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="vantagens" eyebrow="Vantagens" title="Por que fazer parte da rede" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border bg-card p-6 shadow-soft">
                <Icon className="size-7 text-brand-ink" aria-hidden />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="etapas" className="border-y bg-surface py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              id="etapas"
              eyebrow="Do cadastro ao selo"
              title="Como funciona o credenciamento"
              description="O selo de Prestador Licenciado é o que o cliente vê quando você chega. Ele mostra que você passou pela avaliação e pelos cursos da JMoreira."
            />
            <ol className="mt-8 space-y-5">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
                    <Icon className="size-5" aria-hidden />
                    <span className="tabular absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-cta text-[0.65rem] font-extrabold text-cta-foreground">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-lift sm:p-8">
            <h2 className="text-2xl font-extrabold">Faça seu cadastro</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Leva cerca de 3 minutos.</p>
            <ProviderForm />
          </div>
        </div>
      </section>

      <FaqSection faq={faq} title="Dúvidas de quem quer se cadastrar" />
    </>
  )
}
