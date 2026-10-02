import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { buttonVariants } from "@/components/ui/button"
import { cta } from "@/lib/copy"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Pedido recebido",
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ pedido?: string; status?: string }> }

// Página de retorno do Mercado Pago (back_urls). A confirmação definitiva do
// pagamento vem pelo webhook; aqui só informamos o cliente.
const states = {
  aprovado: {
    icon: CheckCircle2,
    tone: "bg-success-soft text-success",
    title: "Pagamento aprovado",
    text: "Recebemos seu pagamento. Vamos separar o pedido e avisar pelo WhatsApp quando sair para entrega ou estiver pronto para retirada.",
  },
  pendente: {
    icon: Clock,
    tone: "bg-warning-soft text-warning-ink",
    title: "Pagamento em análise",
    text: "Seu pagamento ainda está sendo processado (boleto e alguns cartões levam até 2 dias úteis). Avisamos assim que for aprovado.",
  },
  recusado: {
    icon: XCircle,
    tone: "bg-destructive/10 text-destructive",
    title: "Pagamento não aprovado",
    text: "O pagamento foi recusado pelo banco ou pela operadora. Seu pedido continua registrado: tente outro cartão ou finalize pelo WhatsApp com Pix.",
  },
} as const

export default async function ConfirmacaoPage({ searchParams }: Props) {
  const { pedido, status } = await searchParams
  const code = pedido && /^JM-\d{6}-\d{4}$/.test(pedido) ? pedido : null
  const state = states[status as keyof typeof states] ?? states.pendente
  const Icon = state.icon

  return (
    <div className="container-page flex max-w-xl flex-col items-center gap-6 py-16 text-center">
      <span className={`grid size-16 place-items-center rounded-full ${state.tone}`}>
        <Icon className="size-9" aria-hidden />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{state.title}</h1>
        {code && (
          <p className="text-lg">
            Pedido <strong>{code}</strong>
          </p>
        )}
        <p className="text-muted-foreground">{state.text}</p>
      </div>
      <WhatsAppCta
        message={code ? `Olá, JMoreira! Quero acompanhar o pedido ${code}.` : "Olá, JMoreira! Quero acompanhar meu pedido."}
        label="Falar sobre o pedido no WhatsApp"
        size="lg"
      />
      <p className="text-sm text-muted-foreground">Atendimento {site.hours.label.toLowerCase()}.</p>
      <Link href="/loja" className={buttonVariants({ variant: "ghost" })}>
        {cta.continueShopping}
      </Link>
    </div>
  )
}
