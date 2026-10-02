import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/sections/breadcrumbs"
import { CheckoutForm } from "@/components/shop/checkout-form"

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ name: "E-commerce", path: "/loja" }, { name: "Finalizar compra", path: "/checkout" }]} />
      <h1 className="mt-6 mb-8 text-3xl font-semibold sm:text-4xl">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  )
}
