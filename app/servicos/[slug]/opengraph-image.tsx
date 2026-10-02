import { ogContentType, ogImage, ogSize } from "@/lib/og"
import { getService, services } from "@/lib/services"

export const alt = "Serviço JMoreira em São José do Rio Preto"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  return ogImage({ eyebrow: service?.hero.eyebrow ?? "Serviços", title: service?.seo.title ?? "JMoreira Serviços" })
}
