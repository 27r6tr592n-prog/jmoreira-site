import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Hero } from "@/components/home/hero"
import { Marquee } from "@/components/home/marquee"
import { PhotoGallery, type GalleryPhoto } from "@/components/home/photo-gallery"
import { ScrollBands } from "@/components/home/scroll-bands"
import { ShopShowcase } from "@/components/home/shop-showcase"
import { Testimonials } from "@/components/home/testimonials"
import { Triage } from "@/components/home/triage"
import { Reveal } from "@/components/motion/reveal"
import { TrustBar } from "@/components/home/trust-bar"
import { FaqSection } from "@/components/sections/faq-section"
import { FinalCta } from "@/components/sections/final-cta"
import { HowItWorks } from "@/components/sections/how-it-works"
import { SectionHeading } from "@/components/sections/section-heading"
import { ServiceArea } from "@/components/sections/service-area"
import { ServicesGrid } from "@/components/sections/services-grid"
import { buttonVariants } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/catalog"
import { generalFaq } from "@/lib/services"

// Fotos publicadas pela própria JMoreira no Perfil da Empresa no Google
const gallery: GalleryPhoto[] = [
  { src: "/fotos/fachada-sede.jpg", alt: "Fachada azul da sede da JMoreira com letreiro e telefone", caption: "Nossa sede no Jardim Alvorada", span: "col-span-2 row-span-2" },
  { src: "/fotos/equipe-atendimento.jpg", alt: "Central de atendimento da JMoreira com a equipe uniformizada", caption: "Central de atendimento", position: "50% 40%", span: "col-span-2" },
  { src: "/fotos/tecnico-eletricista.jpg", alt: "Técnico da JMoreira instalando uma luminária", caption: "Técnico em atendimento elétrico", position: "50% 30%", span: "row-span-2" },
  { src: "/fotos/tecnico-encanador.jpg", alt: "Técnico da JMoreira fazendo reparo hidráulico no banheiro", caption: "Reparo hidráulico", position: "50% 40%", span: "row-span-2" },
  { src: "/fotos/recepcao.jpg", alt: "Recepção da JMoreira com o letreiro da empresa", caption: "Recepção da sede" },
  { src: "/fotos/reboque-moto-2.jpg", alt: "Reboque de moto identificado da JMoreira", caption: "Reboque de motos" },
  { src: "/fotos/equipe-jmoreira.jpg", alt: "Equipe da JMoreira reunida na recepção", caption: "Equipe JMoreira", position: "50% 45%", span: "col-span-2" },
  { src: "/fotos/socorro-automotivo.jpg", alt: "Técnicos da JMoreira atendendo um carro na rua", caption: "Socorro automotivo", position: "50% 60%" },
  { src: "/fotos/moto-atendimento.jpg", alt: "Moto de atendimento com baú da JMoreira", caption: "Moto de atendimento", position: "50% 55%" },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts(4)

  return (
    <>
      <Hero />
      <TrustBar />
      <Marquee />

      <section aria-labelledby="diagnostico" className="relative overflow-clip py-16 sm:py-24">
        <div aria-hidden className="sd-drift-bg bg-blueprint absolute -inset-y-12 inset-x-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="container-page relative">
          <SectionHeading
            id="diagnostico"
            eyebrow="Diagnóstico rápido"
            title="Primeiros cuidados por tipo de problema"
          />
          <Reveal className="mt-10" delay={100}>
            <Triage />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="servicos" className="border-t py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="servicos"
              eyebrow="Serviços"
              title="Manutenção elétrica, hidráulica e predial"
            />
            <Link href="/servicos" className={buttonVariants({ variant: "outline", size: "lg", className: "shrink-0" })}>
              Ver todos os serviços
              <ArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-10">
            <ServicesGrid stack />
          </div>
        </div>
      </section>

      <ScrollBands />

      <div className="border-t">
        <HowItWorks />
      </div>

      <ShopShowcase products={featured} />
      <Testimonials />

      <section aria-labelledby="por-dentro" className="border-t bg-surface py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="por-dentro"
            eyebrow="Sede e equipe"
            title="Estrutura da JMoreira no Jardim Alvorada"
            description="Toque nas fotos para ampliar."
          />
          <div className="mt-10">
            <PhotoGallery photos={gallery} />
          </div>
        </div>
      </section>

      <ServiceArea />
      <FaqSection faq={generalFaq} />

      <FinalCta />
    </>
  )
}
