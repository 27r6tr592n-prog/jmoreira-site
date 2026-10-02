import "server-only"

import { mercadoPago } from "./mercadopago"
import type { PaymentProvider } from "./types"

export type * from "./types"

/** Gateway ativo. Hoje só Mercado Pago; o stub responde enquanto não houver token. */
export function getPaymentProvider(): PaymentProvider {
  return mercadoPago
}
