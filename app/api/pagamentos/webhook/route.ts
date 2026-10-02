import { getPaymentProvider } from "@/lib/payments"
import { getAdminClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/lib/supabase/types"

// Notificações do gateway (Mercado Pago). Sempre responde 200 rápido para o
// gateway não reenviar; a validação da assinatura fica no provider.

const statusToOrder: Record<string, OrderStatus> = {
  approved: "paid",
  pending: "awaiting_payment",
  rejected: "awaiting_payment",
  refunded: "cancelled",
  cancelled: "cancelled",
}

export async function POST(request: Request) {
  const provider = getPaymentProvider()
  try {
    const notification = await provider.handleNotification(request)
    if (!notification?.orderCode) return Response.json({ received: true })

    const supabase = getAdminClient()
    if (supabase) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: statusToOrder[notification.status] ?? "awaiting_payment",
          payment_provider: provider.id,
          payment_id: notification.externalId,
          payment_status: notification.status,
        })
        .eq("code", notification.orderCode)
      if (error) console.error("[webhook] erro ao atualizar pedido:", error.message)
    }
  } catch (err) {
    console.error("[webhook] falha ao processar:", err)
  }
  return Response.json({ received: true })
}
