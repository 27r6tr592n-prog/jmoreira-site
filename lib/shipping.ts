import { shipping } from "@/lib/config"
import { formatBRL, onlyDigits } from "@/lib/format"

export type ShippingItem = {
  weightKg: number
  quantity: number
  isBattery: boolean
  inStock: boolean
}

export type ShippingOptionId = "local" | "region" | "carrier" | "pickup"

export type ShippingOption = {
  id: ShippingOptionId
  label: string
  price: number
  eta: string
  available: boolean
  /** Motivo quando indisponível, ou observação quando disponível. */
  note?: string
}

export type ShippingQuote =
  | { ok: true; zone: "local" | "region" | "other"; options: ShippingOption[] }
  | { ok: false; error: string }

export function zoneForCep(cep: string): "local" | "region" | "other" | null {
  const digits = onlyDigits(cep)
  if (digits.length !== 8) return null
  const n = Number(digits)
  const [localMin, localMax] = shipping.localCepRange
  const [regionMin, regionMax] = shipping.regionCepRange
  if (n >= localMin && n <= localMax) return "local"
  if (n >= regionMin && n <= regionMax) return "region"
  return "other"
}

export const pickupOption = (): ShippingOption => ({
  id: "pickup",
  label: shipping.pickup.label,
  price: 0,
  eta: shipping.pickup.leadTime,
  available: true,
})

/**
 * Cotação de frete por faixa de CEP. Roda igual no cliente e no servidor; o
 * servidor sempre recalcula no fechamento do pedido.
 */
export function quoteShipping(cep: string, items: ShippingItem[], subtotal: number): ShippingQuote {
  const zone = zoneForCep(cep)
  if (!zone) return { ok: false, error: "Digite os 8 números do CEP." }

  const hasBattery = items.some((i) => i.isBattery)
  const allInStock = items.every((i) => i.inStock)
  const weight = items.reduce((sum, i) => sum + i.weightKg * i.quantity, 0)
  const options: ShippingOption[] = []

  if (zone === "local") {
    const free = subtotal >= shipping.local.freeAbove
    options.push({
      id: "local",
      label: shipping.local.label,
      price: free ? 0 : shipping.local.price,
      eta: allInStock
        ? `Hoje, para pedidos até ${shipping.local.sameDayCutoffHour}h em dias úteis`
        : "Assim que o item chegar ao estoque (avisamos pelo WhatsApp)",
      available: true,
      note: free ? `Frete grátis acima de ${formatBRL(shipping.local.freeAbove)}` : undefined,
    })
  } else if (zone === "region") {
    const free = subtotal >= shipping.region.freeAbove
    options.push({
      id: "region",
      label: shipping.region.label,
      price: free ? 0 : shipping.region.price,
      eta: shipping.region.days,
      available: true,
      note: free ? `Frete grátis acima de ${formatBRL(shipping.region.freeAbove)}` : undefined,
    })
  } else {
    // Baterias chumbo-ácido são produto perigoso para transporte e exigem a
    // devolução da usada. Decisão conservadora: não enviamos para fora da região.
    const price = Math.round((shipping.carrier.base + shipping.carrier.perKg * weight) * 100) / 100
    options.push({
      id: "carrier",
      label: shipping.carrier.label,
      price,
      eta: shipping.carrier.days,
      available: !hasBattery,
      note: hasBattery
        ? "Baterias só são entregues em Rio Preto e região. Retire na loja ou remova a bateria do carrinho."
        : "Valor estimado. Confirmamos o frete final pelo WhatsApp antes do envio.",
    })
  }

  options.push(pickupOption())
  return { ok: true, zone, options }
}
