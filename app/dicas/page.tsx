import type { Metadata } from "next"

import { FinalCta } from "@/components/sections/final-cta"
import { PageHero } from "@/components/sections/page-hero"
import { PostsGrid } from "@/components/sections/posts-teaser"
import { posts } from "@/lib/posts"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Dicas de reparo e manutenção",
  description:
    "Dicas práticas de elétrica, hidráulica e baterias: como achar vazamento escondido, quando trocar a bateria do carro e o que fazer quando o disjuntor desarma.",
  path: "/dicas",
})

export default function DicasPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHero
        crumbs={[{ name: "Dicas", path: "/dicas" }]}
        eyebrow="Dicas de reparo"
        title="Dicas para cuidar da casa (e saber quando chamar o técnico)"
        description="Testes simples e seguros para entender o problema antes de gastar. Escritas pela equipe técnica da JMoreira."
      />
      <section aria-label="Lista de dicas" className="container-page py-12 sm:py-16">
        <PostsGrid posts={sorted} headingLevel="h2" />
      </section>
      <FinalCta title="Testou e não resolveu? A gente vai até você." />
    </>
  )
}
