import { Fragment } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { GoogleIcon } from "@/components/brand/icons"
import { Magnetic, Spotlight } from "@/components/motion/fx"
import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { buttonVariants } from "@/components/ui/button"
import { cta } from "@/lib/copy"
import { formatBRL } from "@/lib/format"
import { site } from "@/lib/site"
import { HeroParticlesGate, ParallaxLayer } from "./hero-fx"
import { HeroPhotos } from "./hero-photos"
import { HeroShortcuts } from "./hero-shortcuts"

// Título palavra por palavra (CSS puro: roda antes do JS e não atrasa o LCP)
function Words({ text, from }: { text: string; from: number }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="word">
        <span style={{ "--w": from + i } as React.CSSProperties}>{w}</span>
      </span>
    </Fragment>
  ))
}

export function Hero() {
  return (
    <section className="relative isolate -mt-16 overflow-hidden border-b bg-surface pt-16 lg:-mt-22 lg:pt-22" aria-labelledby="hero-title">
      {/* Camada 1 (fundo, 0,3×): aurora em CSS, grade técnica e partículas 3D (desktop) */}
      <ParallaxLayer speed={0.3} className="absolute inset-0 -z-10 overflow-hidden">
        <span
          className="aurora-blob -top-40 -left-32 size-[34rem] bg-[radial-gradient(circle,rgb(11_99_214/0.28),transparent_65%)]"
          style={{ animation: "aurora-a 16s ease-in-out infinite" }}
        />
        <span
          className="aurora-blob top-10 -right-40 size-[38rem] bg-[radial-gradient(circle,rgb(56_189_248/0.22),transparent_65%)]"
          style={{ animation: "aurora-b 20s ease-in-out infinite" }}
        />
        <span
          className="aurora-blob -bottom-48 left-1/3 size-[30rem] bg-[radial-gradient(circle,rgb(245_158_11/0.18),transparent_65%)]"
          style={{ animation: "aurora-c 18s ease-in-out infinite" }}
        />
        <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_30%,black_30%,transparent_75%)]" />
        <HeroParticlesGate />
      </ParallaxLayer>
      <Spotlight />

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-14 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="sd-exit space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#avaliacoes"
              className="animate-rise-in inline-flex min-h-11 items-center gap-2 rounded-full border bg-background/80 py-1.5 pr-3.5 pl-2 text-sm font-semibold shadow-soft backdrop-blur transition-colors hover:border-brand-ink/40"
            >
              <GoogleIcon className="size-5" />
              <span className="flex items-center gap-0.5" aria-hidden>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-cta" style={{ animation: `pop-in 0.4s var(--ease-spring) ${0.3 + i * 0.08}s both` }}>
                    {s}
                  </span>
                ))}
              </span>
              <span>
                <strong>{site.rating.value.toLocaleString("pt-BR")}</strong>
                <span className="text-muted-foreground"> · {site.rating.count} avaliações</span>
              </span>
            </a>
          </div>

          <h1 id="hero-title" className="words-up text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            <Words text="Eletricista e encanador em São José do Rio Preto" from={0} />
          </h1>

          <p className="animate-rise-in max-w-xl text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: "120ms" }}>
            Técnicos licenciados para elétrica, hidráulica e manutenção. Visita de {formatBRL(site.promises.visitFee)}, descontada
            se o serviço for aprovado no mesmo dia.
          </p>

          <div className="animate-rise-in flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "220ms" }}>
            <Magnetic className="w-full sm:w-auto">
              <WhatsAppCta
                message="Olá, JMoreira! Vim pelo site e preciso de um técnico."
                className="shine w-full shadow-[0_10px_30px_-8px_rgb(245_158_11/0.65)] sm:w-auto"
              />
            </Magnetic>
            <Link href="/loja" className={buttonVariants({ variant: "outline", size: "xl", className: "group bg-background/80 backdrop-blur" })}>
              {cta.shop}
              <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

        </div>

        {/* Camada 2 (0,6×): fotos reais. Camada 3 (1×): atalhos de serviços */}
        <div className="relative lg:pl-6">
          <ParallaxLayer speed={0.6} className="absolute inset-0">
            <HeroPhotos />
          </ParallaxLayer>
          <HeroShortcuts />
        </div>
      </div>
    </section>
  )
}
