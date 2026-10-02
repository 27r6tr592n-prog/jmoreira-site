import Image from "next/image"
import { Heart } from "lucide-react"

import { InstagramIcon } from "@/components/brand/icons"
import { Reveal } from "@/components/motion/reveal"
import { TiltCard } from "@/components/motion/fx"
import { SectionHeading } from "@/components/sections/section-heading"
import { site } from "@/lib/site"

// Posts publicados pela JMoreira (baixados do site antigo, com o logo da marca).
const posts = [
  { src: "/instagram/chuveiro-vazando.jpg", alt: "Post: chuveiro vazando água, o que pode ser?" },
  { src: "/instagram/torneira-espanada.jpg", alt: "Post: 3 passos simples para consertar uma torneira espanada" },
  { src: "/instagram/calhas-limpas.jpg", alt: "Post: qual a importância de manter as calhas limpas?" },
  { src: "/instagram/ventilador-de-teto.jpg", alt: "Post: ventilador de teto com controle remoto, quais as vantagens?" },
  { src: "/instagram/purificador-vazando.jpg", alt: "Post: 3 fatores que podem fazer o purificador de água vazar" },
]

export function InstagramStrip() {
  return (
    <section aria-labelledby="instagram" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-[linear-gradient(90deg,var(--ig-1),var(--ig-2),var(--ig-3))] opacity-[0.08] blur-3xl"
      />
      <div className="container-page relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="instagram"
            eyebrow="Instagram"
            title="Dicas rápidas no nosso Instagram"
            description="Toda semana, um problema comum da casa explicado em um post."
          />
          <a
            href={site.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shine inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,var(--ig-1),var(--ig-2),var(--ig-3))] px-5 font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <InstagramIcon className="size-5" />
            <span className="sm:hidden">Seguir no Instagram</span>
            <span className="hidden sm:inline">Seguir {site.social.instagram.handle}</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.src} delay={i * 90} className={i === 4 ? "col-span-2 md:col-span-1" : undefined}>
              <TiltCard className="rounded-2xl" max={10}>
                <a
                  href={site.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl shadow-soft"
                >
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,rgb(193_53_132/0.92),rgb(131_58_180/0.92),rgb(88_81_219/0.92))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex flex-col items-center gap-2 text-white">
                      <InstagramIcon className="size-8 scale-50 transition-transform duration-300 group-hover:scale-100" />
                      <span className="flex items-center gap-1.5 text-sm font-bold">
                        <Heart className="size-4 fill-current" aria-hidden />
                        Ver no Instagram
                      </span>
                    </span>
                  </span>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
