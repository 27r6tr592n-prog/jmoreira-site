import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Clock } from "lucide-react"

import { Breadcrumbs } from "@/components/sections/breadcrumbs"
import { FinalCta } from "@/components/sections/final-cta"
import { PostCard } from "@/components/sections/posts-teaser"
import { ServiceIcon } from "@/components/sections/service-icon"
import { JsonLd } from "@/components/seo/json-ld"
import { ProductCard } from "@/components/shop/product-card"
import { getProducts } from "@/lib/catalog"
import { formatPostDate, getPost, posts } from "@/lib/posts"
import { articleJsonLd, pageMetadata } from "@/lib/seo"
import { getService } from "@/lib/services"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    ...pageMetadata({ title: post.title, description: post.description, path: `/dicas/${slug}`, type: "article" }),
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { default: Content } = await import(`@/content/dicas/${slug}.mdx`)
  const service = getService(post.service)
  const products = post.productCategory
    ? (await getProducts())
        .filter((p) => (p.category.slug === post.productCategory || p.parent.slug === post.productCategory) && p.stock > 0)
        .slice(0, 3)
    : []
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <article>
        <header className="-mt-16 border-b bg-surface pt-16 lg:-mt-22 lg:pt-22">
          <div className="container-page max-w-3xl py-10 sm:py-14">
            <Breadcrumbs items={[{ name: "Dicas", path: "/dicas" }, { name: post.title, path: `/dicas/${post.slug}` }]} />
            <p className="eyebrow mt-6">{post.category}</p>
            <h1 className="mt-3 text-3xl leading-tight font-extrabold sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Equipe técnica JMoreira</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {post.readingMinutes} min de leitura
              </span>
            </p>
          </div>
        </header>

        <div className="container-page max-w-3xl py-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border bg-surface">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              style={{ objectPosition: post.image.position }}
            />
          </div>
          <div className="prose prose-lg prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-extrabold prose-headings:tracking-tight prose-a:font-semibold prose-a:text-brand-ink prose-blockquote:border-cta prose-blockquote:bg-surface prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-foreground">
            <Content />
          </div>
        </div>
      </article>

      {service && (
        <aside aria-label="Serviço relacionado" className="container-page max-w-3xl pb-10">
          <Link
            href={`/servicos/${service.slug}`}
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft hover:border-brand-ink/40"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
              <ServiceIcon name={service.icon} className="size-6" />
            </span>
            <span className="flex-1">
              <span className="block text-sm text-muted-foreground">Precisa de ajuda com isso?</span>
              <span className="block text-lg font-bold">{service.seo.title}</span>
            </span>
            <ArrowRight className="size-5 text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </aside>
      )}

      {products.length > 0 && (
        <section aria-labelledby="pecas-dica" className="border-t bg-surface py-12">
          <div className="container-page">
            <h2 id="pecas-dica" className="text-2xl font-extrabold">
              Peças citadas nesta dica
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="outras-dicas" className="container-page py-12 sm:py-16">
        <h2 id="outras-dicas" className="text-2xl font-extrabold">
          Outras dicas
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {others.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <FinalCta message={`Olá, JMoreira! Li a dica “${post.title}” e preciso de ajuda.`} />
    </>
  )
}
