import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { formatPostDate, type Post } from "@/lib/posts"

export function PostCard({ post, headingLevel = "h3" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  return (
    <article className="lift group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft hover:shadow-lift">
      <div className="relative aspect-[16/9] bg-surface">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition: post.image.position }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold text-muted-foreground">
          <span className="text-brand-ink">{post.category}</span> · {post.readingMinutes} min de leitura
        </p>
        <Heading className="text-lg leading-snug font-bold">
          <Link href={`/dicas/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-brand-ink">
            {post.title}
          </Link>
        </Heading>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.description}</p>
        <p className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden />
        </p>
      </div>
    </article>
  )
}

export function PostsGrid({ posts, headingLevel, animate = true }: { posts: Post[]; headingLevel?: "h2" | "h3"; animate?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((p, i) =>
        animate ? (
          <Reveal key={p.slug} delay={i * 90}>
            <PostCard post={p} headingLevel={headingLevel} />
          </Reveal>
        ) : (
          <PostCard key={p.slug} post={p} headingLevel={headingLevel} />
        ),
      )}
    </div>
  )
}
