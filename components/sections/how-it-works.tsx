import { howItWorks } from "@/lib/services"
import { site } from "@/lib/site"
import { HowItWorksSteps, type Step } from "./how-it-works-steps"
import { SectionHeading } from "./section-heading"

// Fotos reais da JMoreira (Perfil da Empresa no Google), uma por passo
const photos = [
  { photo: "/fotos/equipe-atendimento.jpg", alt: "Central de atendimento da JMoreira com a equipe respondendo clientes" },
  { photo: "/fotos/recepcao.jpg", alt: "Recepção da sede da JMoreira" },
  { photo: "/fotos/moto-atendimento.jpg", alt: "Moto de atendimento identificada da JMoreira a caminho do cliente" },
  { photo: "/fotos/tecnico-eletricista.jpg", alt: "Técnico da JMoreira concluindo a instalação de uma luminária" },
]

const steps: Step[] = howItWorks.map((s, i) => ({ ...s, ...photos[i] }))

export function HowItWorks({ prep }: { prep?: string }) {
  return (
    <section aria-labelledby="como-funciona">
      <HowItWorksSteps
        steps={steps}
        heading={
          <SectionHeading
            id="como-funciona"
            eyebrow="Como funciona"
            title="Do WhatsApp ao serviço feito, em 4 passos"
            description="Sem surpresa no preço: você sabe quanto vai pagar antes de o técnico começar."
          />
        }
      />
      <div className="container-page pb-16 sm:pb-24">
        <div className="rounded-2xl border border-dashed bg-surface p-5 text-sm sm:text-base">
          <p>
            <strong>Dica para agilizar:</strong>{" "}
            {prep
              ? prep.replace(/^Para agilizar, /, "")
              : "mande uma foto do problema, o bairro e o melhor horário. Assim o técnico já sai com a peça certa."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">*{site.promises.arrivalCaveat}</p>
        </div>
      </div>
    </section>
  )
}
