"use server"

import { headers } from "next/headers"

import { getProducts } from "@/lib/catalog"
import { notices } from "@/lib/copy"
import { formatBRL, fromCents, maskCep, maskPhone, orderCode, toCents } from "@/lib/format"
import { getPaymentProvider } from "@/lib/payments"
import { subtotalOf, unitPrice } from "@/lib/pricing"
import { pickupOption, quoteShipping, type ShippingOption } from "@/lib/shipping"
import { site } from "@/lib/site"
import { getAdminClient } from "@/lib/supabase/server"
import { isBattery } from "@/lib/types"
import { checkoutSchema, type CheckoutInput } from "@/lib/validation"
import { orderMessage, whatsappUrl } from "@/lib/whatsapp"

export type PlaceOrderResult =
  | { ok: true; code: string; total: number; next: "redirect"; redirectUrl: string }
  | { ok: true; code: string; total: number; next: "whatsapp"; whatsappUrl: string; notice?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

async function baseUrl() {
  // Em produção use sempre a URL configurada (não confie no header Host).
  if (process.env.NEXT_PUBLIC_SITE_URL) return site.url
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "https"
  return host ? `${proto}://${host}` : site.url
}

export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message
    return { ok: false, error: "Confira os campos destacados.", fieldErrors }
  }
  const data = parsed.data
  if (data.website) return { ok: false, error: "Não foi possível registrar o pedido." }

  // 1. Recalcula tudo a partir do catálogo: o preço que veio do navegador é ignorado.
  const catalog = await getProducts()
  const lines = []
  for (const item of data.items) {
    const product = catalog.find((p) => p.id === item.productId)
    if (!product) return { ok: false, error: "Um dos produtos do carrinho não está mais disponível. Remova-o e tente de novo." }
    if (product.stock < item.quantity) {
      return {
        ok: false,
        error: product.stock > 0
          ? `Temos só ${product.stock} unidade(s) de ${product.name}. Ajuste a quantidade no carrinho.`
          : `${product.name} acabou de esgotar. Remova do carrinho ou fale com a gente no WhatsApp.`,
      }
    }
    const tradeIn = product.trade_in_required ? (item.tradeIn ?? true) : null
    lines.push({
      product,
      quantity: item.quantity,
      tradeIn,
      unit: unitPrice({ price: product.price, tradeInSurcharge: product.trade_in_surcharge, tradeIn }),
    })
  }
  const subtotal = subtotalOf(
    lines.map((l) => ({ price: l.product.price, quantity: l.quantity, tradeIn: l.tradeIn, tradeInSurcharge: l.product.trade_in_surcharge })),
  )

  // 2. Frete
  let shipping: ShippingOption
  if (data.deliveryMethod === "pickup") {
    shipping = pickupOption()
  } else {
    const quote = quoteShipping(
      data.cep ?? "",
      lines.map((l) => ({ weightKg: Number(l.product.weight_kg), quantity: l.quantity, isBattery: isBattery(l.product), inStock: true })),
      subtotal,
    )
    if (!quote.ok) return { ok: false, error: quote.error, fieldErrors: { cep: quote.error } }
    const option = quote.options.find((o) => o.id !== "pickup")
    if (!option || !option.available) {
      return { ok: false, error: option?.note ?? "Não entregamos nesse CEP. Escolha retirar na sede." }
    }
    shipping = option
  }
  const total = fromCents(toCents(subtotal) + toCents(shipping.price))
  // Na retirada, CEP e endereço digitados antes não fazem parte do pedido
  const cep = data.deliveryMethod === "delivery" && data.cep ? maskCep(data.cep) : null
  const code = orderCode()
  const phone = maskPhone(data.phone)
  const address =
    data.deliveryMethod === "delivery"
      ? `${data.street}, ${data.number}${data.complement ? ` (${data.complement})` : ""} — ${data.district}, ${data.city || site.address.city}`
      : null

  // 3. Registra o pedido
  const supabase = getAdminClient()
  let orderId: string = code
  if (supabase) {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        code,
        channel: data.channel,
        status: data.channel === "online" ? "awaiting_payment" : "pending",
        customer_name: data.name,
        customer_phone: phone,
        customer_email: data.email ?? null,
        delivery_method: data.deliveryMethod,
        cep,
        address: address
          ? { street: data.street, number: data.number, complement: data.complement, district: data.district, city: data.city }
          : null,
        shipping_label: shipping.label,
        subtotal,
        shipping_cost: shipping.price,
        total,
        notes: data.notes ?? null,
      })
      .select("id")
      .single()
    if (error || !order) {
      console.error("[pedido] erro ao gravar:", error?.message)
      return { ok: false, error: "Não conseguimos registrar o pedido agora. Tente de novo ou finalize pelo WhatsApp." }
    }
    orderId = order.id
    const { error: itemsError } = await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.product.id,
        sku: l.product.sku,
        product_name: l.tradeIn === false ? `${l.product.name} (sem bateria usada)` : l.product.name,
        unit_price: l.unit,
        quantity: l.quantity,
      })),
    )
    if (itemsError) console.error("[pedido] erro nos itens:", itemsError.message)
  } else {
    // Sem Supabase configurado: o pedido segue pelo WhatsApp e fica no log do servidor.
    console.info("[pedido:mock]", code, data.channel, formatBRL(total), lines.map((l) => `${l.quantity}x ${l.product.sku}`).join(", "))
  }

  const waUrl = whatsappUrl(
    orderMessage({
      code,
      items: lines.map((l) => ({ name: l.product.name, sku: l.product.sku, quantity: l.quantity, unitPrice: l.unit, tradeIn: l.tradeIn })),
      subtotal,
      shipping: { label: shipping.label, price: shipping.price },
      total,
      customer: { name: data.name, phone },
      cep,
      address,
    }),
  )

  // 4. Pagamento online
  if (data.channel === "online") {
    const provider = getPaymentProvider()
    const origin = await baseUrl()
    const result = await provider.createCheckout({
      orderId,
      orderCode: code,
      lines: lines.map((l) => ({ id: l.product.sku, title: l.product.name, quantity: l.quantity, unitPrice: l.unit })),
      shipping: { label: shipping.label, price: shipping.price },
      payer: { name: data.name, email: data.email!, phone },
      returnUrls: {
        success: `${origin}/checkout/confirmacao?pedido=${code}&status=aprovado`,
        pending: `${origin}/checkout/confirmacao?pedido=${code}&status=pendente`,
        failure: `${origin}/checkout/confirmacao?pedido=${code}&status=recusado`,
      },
      notificationUrl: `${origin}/api/pagamentos/webhook`,
    })
    if (result.status === "redirect") {
      if (supabase) {
        await supabase.from("orders").update({ payment_provider: provider.id, payment_id: result.externalId }).eq("code", code)
      }
      return { ok: true, code, total, next: "redirect", redirectUrl: result.redirectUrl }
    }
    return { ok: true, code, total, next: "whatsapp", whatsappUrl: waUrl, notice: notices.onlineUnavailable }
  }

  return { ok: true, code, total, next: "whatsapp", whatsappUrl: waUrl }
}
