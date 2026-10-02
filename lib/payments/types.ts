// Contrato que qualquer gateway de pagamento implementa. Para trocar ou somar
// gateways (Pagar.me, Stripe, PagBank), crie um arquivo novo que implemente
// PaymentProvider e registre em ./index.ts. Nada fora de lib/payments conhece
// detalhes do gateway.

export type CheckoutLine = {
  id: string
  title: string
  quantity: number
  unitPrice: number
}

export type CreateCheckoutInput = {
  orderId: string
  orderCode: string
  lines: CheckoutLine[]
  shipping: { label: string; price: number } | null
  payer: { name: string; email: string; phone: string }
  /** URLs absolutas de retorno após o pagamento */
  returnUrls: { success: string; failure: string; pending: string }
  notificationUrl: string
}

export type CreateCheckoutResult =
  | {
      status: "redirect"
      /** URL do checkout hospedado pelo gateway */
      redirectUrl: string
      externalId: string
    }
  | {
      /** Gateway não configurado: o pedido fica registrado e seguimos pelo WhatsApp. */
      status: "unavailable"
      reason: string
    }

export type PaymentStatus = "approved" | "pending" | "rejected" | "refunded" | "cancelled"

export type PaymentNotification = {
  externalId: string
  orderCode: string | null
  status: PaymentStatus
}

export interface PaymentProvider {
  readonly id: string
  isConfigured(): boolean
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>
  /**
   * Valida a assinatura e traduz a notificação do gateway.
   * Retorna null para notificações que não são de pagamento ou inválidas.
   */
  handleNotification(request: Request): Promise<PaymentNotification | null>
}
