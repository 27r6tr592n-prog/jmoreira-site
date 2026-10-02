import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

import type { CreateCheckoutInput, CreateCheckoutResult, PaymentNotification, PaymentProvider, PaymentStatus } from "./types"

// ─────────────────────────────────────────────────────────────────────────────
// Mercado Pago — Checkout Pro (o cliente paga no ambiente do Mercado Pago:
// Pix, cartão em até 12x, boleto). Usa a API REST direto, sem SDK.
//
// STUB: enquanto MERCADOPAGO_ACCESS_TOKEN não estiver definido, createCheckout
// devolve { status: "unavailable" } e o site orienta o cliente a concluir pelo
// WhatsApp. O pedido fica registrado do mesmo jeito.
//
// Para ativar:
//   1. Mercado Pago Developers → Suas integrações → Criar aplicação (Checkout Pro)
//   2. Copie o Access Token de TESTE para MERCADOPAGO_ACCESS_TOKEN e faça uma
//      compra de teste com os cartões de teste da documentação.
//   3. Em Webhooks, aponte para https://SEU_DOMINIO/api/pagamentos/webhook,
//      evento "Pagamentos", e copie a assinatura secreta para
//      MERCADOPAGO_WEBHOOK_SECRET.
//   4. Troque pelo Access Token de PRODUÇÃO.
//
// ATENÇÃO: este módulo não foi exercitado contra a API real (não havia
// credencial). Valide no ambiente de teste antes de ir para produção.
// Referências: /developers/pt/reference/preferences/_checkout_preferences/post
//              /developers/pt/docs/your-integrations/notifications/webhooks
// ─────────────────────────────────────────────────────────────────────────────

const API = "https://api.mercadopago.com"

function token() {
  return process.env.MERCADOPAGO_ACCESS_TOKEN || null
}

const statusMap: Record<string, PaymentStatus> = {
  approved: "approved",
  authorized: "pending",
  in_process: "pending",
  in_mediation: "pending",
  pending: "pending",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "refunded",
}

/** Valida o header x-signature: "ts=...,v1=<hmac sha256>" */
function validSignature(request: Request, dataId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) {
    console.warn("[mercadopago] MERCADOPAGO_WEBHOOK_SECRET ausente: webhook ignorado.")
    return false
  }
  const header = request.headers.get("x-signature") ?? ""
  const requestId = request.headers.get("x-request-id") ?? ""
  const parts = Object.fromEntries(header.split(",").map((p) => p.trim().split("=") as [string, string]))
  if (!parts.ts || !parts.v1) return false
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`
  const expected = createHmac("sha256", secret).update(manifest).digest("hex")
  const a = Buffer.from(expected)
  const b = Buffer.from(parts.v1)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const mercadoPago: PaymentProvider = {
  id: "mercadopago",

  isConfigured: () => Boolean(token()),

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const accessToken = token()
    if (!accessToken) {
      return { status: "unavailable", reason: "Pagamento online ainda não configurado." }
    }

    const items = input.lines.map((l) => ({
      id: l.id,
      title: l.title.slice(0, 250),
      quantity: l.quantity,
      unit_price: l.unitPrice,
      currency_id: "BRL",
    }))
    if (input.shipping && input.shipping.price > 0) {
      items.push({ id: "frete", title: input.shipping.label, quantity: 1, unit_price: input.shipping.price, currency_id: "BRL" })
    }

    const response = await fetch(`${API}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        // Evita preferência duplicada se o cliente clicar duas vezes
        "X-Idempotency-Key": input.orderId,
      },
      body: JSON.stringify({
        items,
        payer: { name: input.payer.name, email: input.payer.email },
        external_reference: input.orderCode,
        back_urls: input.returnUrls,
        auto_return: "approved",
        notification_url: input.notificationUrl,
        statement_descriptor: "JMOREIRA",
        payment_methods: { installments: 10 },
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("[mercadopago] preferência recusada:", response.status, await response.text())
      return { status: "unavailable", reason: "Não conseguimos abrir o pagamento agora." }
    }

    const data = (await response.json()) as { id: string; init_point: string; sandbox_init_point?: string }
    const isTest = accessToken.startsWith("TEST-")
    return {
      status: "redirect",
      redirectUrl: isTest && data.sandbox_init_point ? data.sandbox_init_point : data.init_point,
      externalId: data.id,
    }
  },

  async handleNotification(request: Request): Promise<PaymentNotification | null> {
    const accessToken = token()
    if (!accessToken) return null

    const url = new URL(request.url)
    const body = (await request.json().catch(() => null)) as { type?: string; data?: { id?: string } } | null
    const type = body?.type ?? url.searchParams.get("type")
    const dataId = body?.data?.id ?? url.searchParams.get("data.id")
    if (type !== "payment" || !dataId) return null
    if (!validSignature(request, dataId)) return null

    // Nunca confie no corpo da notificação: consulte o pagamento na API.
    const response = await fetch(`${API}/v1/payments/${encodeURIComponent(dataId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    if (!response.ok) return null
    const payment = (await response.json()) as { id: number; status: string; external_reference: string | null }
    return {
      externalId: String(payment.id),
      orderCode: payment.external_reference,
      status: statusMap[payment.status] ?? "pending",
    }
  },
}
