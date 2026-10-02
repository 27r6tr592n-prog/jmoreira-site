import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ShopPage } from "@/components/shop/shop-page"
import { getCategories } from "@/lib/catalog"
import { pageMetadata } from "@/lib/seo"
import { categoryContent } from "@/lib/shop-content"

type Props = { params: Promise<{ categoria: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ categoria: c.slug }))
}

async function resolve(slug: string) {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return null
  const parent = category.parent_id ? categories.find((c) => c.id === category.parent_id) ?? null : null
  return { category, parent }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const found = await resolve(categoria)
  if (!found) return {}
  const c = categoryContent(found.category.slug, found.category.name)
  return pageMetadata({ title: c.title, description: c.description, path: `/loja/categoria/${categoria}` })
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params
  const found = await resolve(categoria)
  if (!found) notFound()
  const { category, parent } = found
  const c = categoryContent(category.slug, category.name)

  const crumbs = [
    { name: "Loja", path: "/loja" },
    ...(parent ? [{ name: parent.name, path: `/loja/categoria/${parent.slug}` }] : []),
    { name: category.name, path: `/loja/categoria/${category.slug}` },
  ]

  return (
    <ShopPage
      category={category.slug}
      crumbs={crumbs}
      eyebrow={parent ? parent.name : "Loja JMoreira"}
      title={c.h1}
      description={c.intro}
    />
  )
}
