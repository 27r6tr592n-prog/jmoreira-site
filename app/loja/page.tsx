import type { Metadata } from "next"

import { ShopPage } from "@/components/shop/shop-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Loja de peças hidráulicas e baterias em Rio Preto",
  description:
    "Peças hidráulicas e baterias automotivas, de moto e estacionárias em São José do Rio Preto. Entrega no mesmo dia, retirada grátis na loja e até 10x sem juros.",
  path: "/loja",
})

export default function LojaPage() {
  return (
    <ShopPage
      category={null}
      crumbs={[{ name: "Loja", path: "/loja" }]}
      eyebrow="Loja JMoreira"
      title="Peças hidráulicas e baterias em Rio Preto"
      description="As peças que nossos técnicos usam, com entrega no mesmo dia em Rio Preto ou retirada grátis na loja do Jardim Alvorada."
    />
  )
}
