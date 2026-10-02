import { site } from "@/lib/site"
import { formatBRL } from "@/lib/format"

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp.e164}?text=${encodeURIComponent(message)}`
}

const DEFAULT_MESSAGE = "Olá, JMoreira! Vim pelo site e preciso de atendimento."

/** Mensagem pré-preenchida conforme a página em que o visitante está. */
export function contextMessage(pathname: string, pageTitle?: string): string {
  if (pathname.startsWith("/servicos/") && pageTitle) {
    return `Olá, JMoreira! Vim pela página de ${pageTitle} e preciso de um orçamento.`
  }
  if (pathname === "/servicos") return "Olá, JMoreira! Vim pelo site e quero um orçamento de serviço."
  if (pathname.startsWith("/loja/") && pageTitle) {
    return `Olá, JMoreira! Tenho uma dúvida sobre o produto: ${pageTitle}.`
  }
  if (pathname.startsWith("/loja") || pathname.startsWith("/checkout")) {
    return "Olá, JMoreira! Estou no E-commerce do site e tenho uma dúvida sobre um produto."
  }
  if (pathname.startsWith("/seja-prestador")) {
    return "Olá, JMoreira! Quero saber mais sobre como ser prestador credenciado."
  }
  if (pathname.startsWith("/dicas/") && pageTitle) {
    return `Olá, JMoreira! Li a dica “${pageTitle}” e preciso de ajuda com isso.`
  }
  return DEFAULT_MESSAGE
}

export type OrderMessageItem = {
  name: string
  sku: string
  quantity: number
  unitPrice: number
  tradeIn?: boolean | null
}

export function orderMessage(input: {
  code?: string
  items: OrderMessageItem[]
  subtotal: number
  shipping?: { label: string; price: number } | null
  total: number
  customer?: { name: string; phone: string } | null
  cep?: string | null
  address?: string | null
}) {
  const lines: string[] = []
  lines.push(input.code ? `Olá, JMoreira! Quero confirmar o pedido *${input.code}*:` : "Olá, JMoreira! Quero fazer este pedido:")
  lines.push("")
  for (const item of input.items) {
    lines.push(`• ${item.quantity}× ${item.name} (${item.sku}): ${formatBRL(item.unitPrice * item.quantity)}`)
    if (item.tradeIn === true) lines.push("   ↳ Vou entregar a bateria usada")
    if (item.tradeIn === false) lines.push("   ↳ Sem bateria usada para troca")
  }
  lines.push("")
  lines.push(`Subtotal: ${formatBRL(input.subtotal)}`)
  if (input.shipping) {
    lines.push(`${input.shipping.label}: ${input.shipping.price === 0 ? "grátis" : formatBRL(input.shipping.price)}`)
  } else {
    lines.push("Entrega: a combinar")
  }
  lines.push(`*Total: ${formatBRL(input.total)}*`)
  if (input.customer) {
    lines.push("")
    lines.push(`Nome: ${input.customer.name}`)
    lines.push(`Telefone: ${input.customer.phone}`)
  }
  if (input.address) lines.push(`Endereço: ${input.address}`)
  else if (input.cep) lines.push(`CEP: ${input.cep}`)
  return lines.join("\n")
}
