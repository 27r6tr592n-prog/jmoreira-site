import type { Metadata } from "next"

import { ShopPage } from "@/components/shop/shop-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "E-commerce de peças hidráulicas e baterias em Rio Preto",
  description:
    "Peças hidráulicas e baterias automotivas, de moto e estacionárias em São José do Rio Preto. Entrega no mesmo dia, retirada grátis na sede e até 10x sem juros.",
  path: "/loja",
})

export default function EcommercePage() {
  return (
    <ShopPage
      category={null}
      crumbs={[{ name: "E-commerce", path: "/loja" }]}
      eyebrow="E-commerce JMoreira"
      title="Peças hidráulicas e baterias em Rio Preto"
      description="Peças hidráulicas e baterias com entrega no mesmo dia em Rio Preto ou retirada grátis na sede, no Jardim Alvorada. A mão de obra de instalação pode ser contratada à parte."
    />
  )
}
