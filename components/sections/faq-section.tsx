import { JsonLd } from "@/components/seo/json-ld"
import type { Faq } from "@/lib/services"
import { Reveal } from "@/components/motion/reveal"
import { faqJsonLd } from "@/lib/seo"
import { FaqList } from "./faq-list"
import { SectionHeading } from "./section-heading"

export function FaqSection({
  faq,
  title = "Perguntas frequentes",
  description,
  className = "py-16 sm:py-24",
}: {
  faq: Faq[]
  title?: string
  description?: string
  className?: string
}) {
  return (
    <section aria-labelledby="perguntas" className={className}>
      <JsonLd data={faqJsonLd(faq)} />
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading id="perguntas" eyebrow="Dúvidas" title={title} description={description} />
        <Reveal delay={100}>
          <FaqList faq={faq} />
        </Reveal>
      </div>
    </section>
  )
}
