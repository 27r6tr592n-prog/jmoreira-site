"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { finePointer, motionDisabled } from "@/lib/motion"

// Fotos reais (Perfil da Empresa no Google) flutuando atrás do card do hero.
// Com mouse, se movem em camadas (parallax); sempre flutuam devagar.
const photos = [
  {
    src: "/fotos/fachada-sede.jpg",
    alt: "Fachada da sede da JMoreira no Jardim Alvorada",
    className: "-top-10 -left-16 w-56 -rotate-6 lg:-left-24 lg:w-64",
    depth: 18,
    delay: "0s",
  },
  {
    src: "/fotos/tecnico-eletricista.jpg",
    alt: "Técnico da JMoreira instalando uma luminária",
    className: "-right-10 -bottom-12 w-40 rotate-6 lg:-right-14 lg:w-44",
    depth: -24,
    delay: "-2s",
    tall: true,
  },
  {
    src: "/fotos/reboque-moto-1.jpg",
    alt: "Reboque de moto identificado da JMoreira",
    className: "-bottom-16 -left-10 w-48 rotate-3 lg:-left-16",
    depth: 12,
    delay: "-4s",
  },
]

export function HeroPhotos() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || motionDisabled()) return
    let frame = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5
        const y = e.clientY / window.innerHeight - 0.5
        el.style.setProperty("--px", String(x))
        el.style.setProperty("--py", String(y))
      })
    }
    window.addEventListener("pointermove", move)
    return () => {
      window.removeEventListener("pointermove", move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      {photos.map((p, i) => (
        <div
          key={p.src}
          className={`absolute ${p.className}`}
          style={{
            transform: `translate(calc(var(--px, 0) * ${p.depth}px), calc(var(--py, 0) * ${p.depth}px))`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lift dark:border-card"
            style={{ animation: `pop-in 0.7s var(--ease-spring) ${0.4 + i * 0.18}s both, float-y 6s ease-in-out ${p.delay} infinite` }}
          >
            <div className={`relative ${p.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={p.src} alt={p.alt} fill sizes="260px" className="object-cover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
