import { howItWorks } from "@/lib/services"
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
    <section aria-labelledby="como-funciona" className={prep ? undefined : "pb-6 sm:pb-14"}>
      <HowItWorksSteps
        steps={steps}
        heading={
          <SectionHeading
            id="como-funciona"
            eyebrow="Atendimento"
            title="Como funciona o atendimento"
          />
        }
      />
      {/* Só a dica específica do serviço: a genérica repetia o passo 1 */}
      {prep && (
        <div className="container-page pb-16 sm:pb-24">
          <div className="rounded-2xl border border-dashed bg-surface p-5 text-sm sm:text-base">
            <p>
              <strong>Dica para agilizar:</strong> {prep.replace(/^Para agilizar, /, "")}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
