import { fromCents, toCents } from "@/lib/format"

export type PricedLine = {
  price: number
  quantity: number
  tradeInSurcharge: number | null
  /** true = cliente entrega a bateria usada. null = produto sem base de troca. */
  tradeIn: boolean | null
}

/** Preço unitário efetivo: soma o acréscimo quando a bateria usada não é entregue. */
export function unitPrice(line: Pick<PricedLine, "price" | "tradeInSurcharge" | "tradeIn">) {
  const surcharge = line.tradeIn === false && line.tradeInSurcharge ? line.tradeInSurcharge : 0
  return fromCents(toCents(line.price) + toCents(surcharge))
}

export function subtotalOf(lines: PricedLine[]) {
  return fromCents(lines.reduce((sum, l) => sum + toCents(unitPrice(l)) * l.quantity, 0))
}
