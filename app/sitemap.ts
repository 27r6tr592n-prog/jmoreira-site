import type { MetadataRoute } from "next"

import { getCategories, getProducts } from "@/lib/catalog"
import { posts } from "@/lib/posts"
import { services } from "@/lib/services"
import { site } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  const now = new Date()
  const url = (path: string) => `${site.url}${path}`

  return [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/servicos"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({ url: url(`/servicos/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: url("/loja"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({ url: url(`/loja/categoria/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({
      url: url(`/loja/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: p.images.map((src) => (src.startsWith("http") ? src : url(src))),
    })),
    { url: url("/dicas"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: url(`/dicas/${p.slug}`), lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: url("/quem-somos"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/seja-prestador"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/contato"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/leva-e-traz"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/servico-particular"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/politicas"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
