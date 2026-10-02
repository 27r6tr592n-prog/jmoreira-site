import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { GoogleIcon } from "@/components/brand/icons"
import { Magnetic, RotatingWords, Spotlight } from "@/components/motion/fx"
import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { buttonVariants } from "@/components/ui/button"
import { cta } from "@/lib/copy"
import { formatBRL } from "@/lib/format"
import { site } from "@/lib/site"
import { DispatchCard } from "./dispatch-card"
import { HeroParticlesGate, ParallaxLayer } from "./hero-fx"
import { HeroPhotos } from "./hero-photos"

// Título palavra por palavra (CSS puro: roda antes do JS e não atrasa o LCP)
const shimmer =
  "bg-[linear-gradient(90deg,var(--brand-ink),var(--shimmer-mid),var(--brand-ink))] bg-[length:200%_auto] bg-clip-text text-transparent [animation:shimmer-text_4s_linear_3]"

function Word({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <span className="word">
      <span style={{ "--w": i } as React.CSSProperties}>
        {className ? <span className={className}>{children}</span> : children}
      </span>
    </span>
  )
}

function Words({ text, from, className }: { text: string; from: number; className?: string }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <Word i={from + i} className={className}>
        {w}
      </Word>
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

      <div className="container-page relative z-10 grid items-center gap-14 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="space-y-7">
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
            <span
              className="animate-rise-in inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-4 text-sm font-bold text-white shadow-soft"
              style={{ animationDelay: "80ms" }}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cta opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-cta" />
              </span>
              <RotatingWords words={["Eletricista", "Encanador", "Energia solar", "Pequenos reparos", "Baterias"]} className="min-w-[8.5rem]" />
            </span>
          </div>

          <h1 id="hero-title" className="words-up text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
            <Words text="Eletricista e encanador em Rio Preto," from={0} />{" "}
            <span className="relative whitespace-nowrap">
              <Words text="na sua casa" from={6} className={shimmer} />
              <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-1.5 left-0 h-3 w-full text-cta" preserveAspectRatio="none">
                {/* Sublinhado que se "desenha" depois que as palavras chegam */}
                <path
                  d="M2 9c60-6 140-8 296-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  style={{ strokeDashoffset: 1, animation: "draw-line 0.7s var(--ease-out) 0.7s forwards" }}
                />
              </svg>
            </span>{" "}
            <Words text="em até 2" from={9} />{" "}
            <Word i={12}>
              horas<span className="text-cta">*</span>
            </Word>
          </h1>

          <p className="animate-rise-in max-w-xl text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: "120ms" }}>
            Técnicos licenciados para elétrica, hidráulica e energia solar. Você aprova o orçamento antes, e a visita de{" "}
            {formatBRL(site.promises.visitFee)} sai de graça se fechar no dia.
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

          <p className="animate-rise-in text-sm text-muted-foreground" style={{ animationDelay: "320ms" }}>
            Atendimento {site.hours.label.toLowerCase()} · *{site.promises.arrivalCaveat}
          </p>
        </div>

        {/* Fotos reais flutuando atrás do card animado do atendimento */}
        <div className="relative lg:pl-6">
          {/* Camada 2 (0,6×): fotos reais. Camada 3 (1×): card do atendimento */}
          <ParallaxLayer speed={0.6} className="absolute inset-0">
            <HeroPhotos />
          </ParallaxLayer>
          <DispatchCard />
        </div>
      </div>
    </section>
  )
}
