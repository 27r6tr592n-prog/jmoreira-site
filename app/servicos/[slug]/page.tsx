import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Phone, Star } from "lucide-react"

import { Breadcrumbs } from "@/components/sections/breadcrumbs"
import { FaqSection } from "@/components/sections/faq-section"
import { FinalCta } from "@/components/sections/final-cta"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PostCard } from "@/components/sections/posts-teaser"
import { SectionHeading } from "@/components/sections/section-heading"
import { ServiceCard } from "@/components/sections/services-grid"
import { ServiceIcon } from "@/components/sections/service-icon"
import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { Spotlight } from "@/components/motion/fx"
import { Reveal, RevealImage, RevealItem } from "@/components/motion/reveal"
import { JsonLd } from "@/components/seo/json-ld"
import { ProductCard } from "@/components/shop/product-card"
import { buttonVariants } from "@/components/ui/button"
import { getProducts } from "@/lib/catalog"
import { formatBRL } from "@/lib/format"
import { getPost } from "@/lib/posts"
import { pageMetadata, serviceJsonLd } from "@/lib/seo"
import { getService, services } from "@/lib/services"
import { site, telHref } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return pageMetadata({ title: service.seo.title, description: service.seo.description, path: `/servicos/${slug}` })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const allProducts = await getProducts()
  const products = service.shopCategory
    ? allProducts
        .filter((p) => (p.category.slug === service.shopCategory || p.parent.slug === service.shopCategory) && p.stock > 0)
        .slice(0, 4)
    : []
  const tip = service.tip ? getPost(service.tip) : null
  const related = service.related.map((s) => getService(s)).filter((s) => s !== null)
  const waMessage = `Olá, JMoreira! Vim pela página de ${service.name} e preciso de um orçamento.`

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <section className="relative -mt-16 overflow-hidden border-b bg-surface pt-16 lg:-mt-22 lg:pt-22">
        <div aria-hidden className="bg-blueprint absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-page relative py-10 sm:py-14">
          <Breadcrumbs items={[{ name: "Serviços", path: "/servicos" }, { name: service.name, path: `/servicos/${service.slug}` }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <p className="eyebrow flex items-center gap-2">
                <ServiceIcon name={service.icon} className="size-4" />
                {service.hero.eyebrow}
              </p>
              <h1 data-wa-title={service.name} className="text-4xl leading-[1.08] font-extrabold sm:text-5xl">
                {service.hero.title}
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">{service.hero.subtitle}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppCta message={waMessage} className="shine" />
                <a href={telHref} className={buttonVariants({ variant: "outline", size: "xl" })}>
                  <Phone aria-hidden />
                  Ligar {site.phone.display}
                </a>
              </div>
              <ul className="flex flex-wrap gap-2 text-sm">
                <li className="rounded-full border bg-background px-3 py-1">Chegada em até {site.promises.arrivalMinutes} min*</li>
                <li className="rounded-full border bg-background px-3 py-1">Visita {formatBRL(site.promises.visitFee)}, descontada no dia</li>
                <li className="rounded-full border bg-background px-3 py-1">Garantia de 90 dias</li>
              </ul>
              <p className="text-xs text-muted-foreground">*{site.promises.arrivalCaveat}</p>
            </div>
            <div className="relative">
              <RevealImage className="relative aspect-[4/3] rounded-3xl border bg-card shadow-lift">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: service.image.position }}
                />
              </RevealImage>
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-lift">
                <Star className="size-6 fill-cta text-cta" aria-hidden />
                <p className="text-sm">
                  <strong className="text-base">{site.rating.value.toLocaleString("pt-BR")}</strong> no Google
                  <span className="block text-xs text-muted-foreground">{site.rating.count} avaliações</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="incluso" className="py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-5">
            <SectionHeading id="incluso" eyebrow="O que fazemos" title={`O que está incluso no serviço de ${service.name.toLowerCase()}`} />
            <p className="text-muted-foreground">{service.intro}</p>
          </div>
          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {service.included.map((item) => (
              <RevealItem as="li" key={item.title} className="rounded-2xl border bg-card p-5 shadow-soft">
                <CheckCircle2 className="size-6 text-brand-ink" aria-hidden />
                <h3 className="mt-3 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="problemas" className="relative overflow-hidden border-y bg-navy py-16 text-navy-foreground sm:py-24">
        <Spotlight color="rgb(245 158 11 / 0.14)" size={600} />
        <div className="container-page relative">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-[0.14em] text-cta uppercase">Problemas que resolvemos</p>
            <h2 id="problemas" className="text-3xl font-extrabold text-white sm:text-4xl">
              Os chamados mais comuns de {service.name.toLowerCase()} em Rio Preto
            </h2>
          </div>
          <Reveal as="ul" stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.problems.map((p) => (
              <RevealItem
                as="li"
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-cta/40 hover:bg-white/10"
              >
                <AlertTriangle className="size-5 text-cta" aria-hidden />
                <h3 className="mt-3 font-bold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-white/75">{p.description}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <HowItWorks prep={service.prep} />

      {products.length > 0 && (
        <section aria-labelledby="pecas" className="border-y bg-surface py-16 sm:py-20">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                id="pecas"
                eyebrow="Loja JMoreira"
                title="Peças que usamos nesse serviço"
                description="Prefere comprar a peça e instalar você mesmo? Entrega no mesmo dia em Rio Preto ou retirada na loja."
              />
              <Link
                href={`/loja/categoria/${service.shopCategory}`}
                className={buttonVariants({ variant: "outline", size: "lg", className: "shrink-0" })}
              >
                Ver todas as peças
                <ArrowRight aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection faq={service.faq} title={`Dúvidas sobre ${service.name.toLowerCase()}`} />

      <section aria-labelledby="relacionados" className="border-t bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="relacionados" eyebrow="Veja também" title="Outros serviços da JMoreira" />
          <div className={`mt-8 grid gap-4 ${tip ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
            {tip && (
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <BookOpen className="size-4 text-brand-ink" aria-hidden />
                  Dica relacionada
                </p>
                <PostCard post={tip} />
              </div>
            )}
          </div>
        </div>
      </section>

      <FinalCta title={service.ctaTitle} message={waMessage} />
    </>
  )
}
