import { ogContentType, ogImage, ogSize } from "@/lib/og"
import { getPost, posts } from "@/lib/posts"

export const alt = "Dica de reparo da JMoreira"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  return ogImage({ eyebrow: `Dicas · ${post?.category ?? "Reparo"}`, title: post?.title ?? "Dicas de reparo" })
}
