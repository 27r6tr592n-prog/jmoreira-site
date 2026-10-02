import { getProductBySlug, getProducts } from "@/lib/catalog"
import { formatBRL, installmentsFor } from "@/lib/format"
import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Produto da loja JMoreira"
export const size = ogSize
export const contentType = ogContentType

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return ogImage({ eyebrow: "Loja JMoreira", title: "Peças hidráulicas e baterias em Rio Preto" })
  const inst = installmentsFor(product.price)
  return ogImage({
    eyebrow: `Loja JMoreira · ${product.brand}`,
    title: product.name,
    footer: `${formatBRL(product.price)} à vista${inst.count > 1 ? ` ou ${inst.count}× sem juros` : ""} · Entrega em Rio Preto`,
  })
}
