import { pricing } from "@/lib/config"

// Formatação pt-BR feita à mão: no navegador, o primeiro Intl.NumberFormat("pt-BR")
// carrega os dados de idioma e custava ~100 ms de CPU na abertura (celular lento).
// Saída idêntica à do Intl: "R$ 1.234,56" (com espaço não separável).

/** 1234.5 → "1.234,50" (decimals = 2) */
export function formatNumber(value: number, decimals = 0) {
  const negative = value < 0
  const fixed = Math.abs(value).toFixed(decimals)
  const [int, frac] = fixed.split(".")
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${negative ? "-" : ""}${grouped}${frac ? `,${frac}` : ""}`
}

export const formatBRL = (value: number) => `${value < 0 ? "-" : ""}R$\u00a0${formatNumber(Math.abs(value), 2)}`

/** Arredonda para centavos sem erro de ponto flutuante acumulado. */
export const toCents = (value: number) => Math.round(value * 100)
export const fromCents = (cents: number) => cents / 100

/** Melhor parcelamento sem juros respeitando a parcela mínima. */
export function installmentsFor(price: number) {
  const byMinimum = Math.floor(price / pricing.minInstallment)
  const count = Math.max(1, Math.min(pricing.maxInstallments, byMinimum))
  return { count, value: fromCents(Math.ceil(toCents(price) / count)) }
}

export const onlyDigits = (value: string) => value.replace(/\D/g, "")

export function maskCep(value: string) {
  const d = onlyDigits(value).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Código legível do pedido, ex.: JM-260930-4821 */
export function orderCode(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, "")
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `JM-${ymd}-${rand}`
}
