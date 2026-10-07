"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "cn"

import { Reveal } from "@/components/motion/reveal"
import { VelocitySkew } from "@/components/motion/velocity-skew"

export type GalleryPhoto = { src: string; alt: string; caption: string; position?: string; span?: string }

/**
 * Galeria em mosaico com fotos reais e visualização em tela cheia
 * (<dialog> nativo: Esc fecha, foco preso no diálogo, setas navegam).
 */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)
  const current = index === null ? null : photos[index]

  const open = (i: number) => {
    setIndex(i)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()
  const go = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length))

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
      // Esc também fecha quando o navegador não aplica o fechamento nativo
      if (e.key === "Escape") {
        e.preventDefault()
        d.close()
      }
    }
    const onClose = () => setIndex(null)
    d.addEventListener("keydown", onKey)
    d.addEventListener("close", onClose)
    return () => {
      d.removeEventListener("keydown", onKey)
      d.removeEventListener("close", onClose)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Rolagem rápida entorta a grade de leve (desktop); cada foto anda dentro da moldura (parallax) */}
      <VelocitySkew axis="y" max={2.5} factor={0.08}>
        <ul className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4">
          {photos.map((p, i) => (
            <Reveal as="li" key={p.src} variant="scale" delay={(i % 4) * 80} className={cn("min-w-0", p.span)}>
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative block size-full overflow-clip rounded-2xl bg-surface text-left shadow-soft focus-visible:ring-4 focus-visible:ring-ring/50"
                aria-label={`Ampliar foto: ${p.caption}`}
              >
                <span className="parallax absolute inset-0 block">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
                    style={{ objectPosition: p.position }}
                  />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-2 p-3 text-sm font-semibold text-white transition-transform duration-500 group-hover:translate-y-0">
                  <span className="line-clamp-2">{p.caption}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </VelocitySkew>

      <dialog
        ref={dialogRef}
        aria-label="Foto ampliada"
        className="lightbox m-auto w-[min(92vw,1100px)] max-w-none overflow-visible bg-transparent p-0 text-white"
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
      >
        {current && (
          <figure className="relative">
            <div key={current.src} className="animate-in fade-in zoom-in-95 relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy duration-300 sm:aspect-[16/10]">
              <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span>{current.caption}</span>
              <span className="tabular text-white/70">
                {index! + 1} / {photos.length}
              </span>
            </figcaption>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute -top-3 -right-3 grid size-11 place-items-center rounded-full bg-white text-navy shadow-lift hover:scale-105"
            >
              <X className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow-lift hover:bg-white"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow-lift hover:bg-white"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </figure>
        )}
      </dialog>
    </>
  )
}
