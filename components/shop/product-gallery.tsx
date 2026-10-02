"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { AnimatePresence, m } from "motion/react"
import { ZoomIn } from "lucide-react"
import { cn } from "cn"

import { MotionScope } from "@/components/motion/motion-scope"
import { easeOut } from "@/lib/motion"

const viewLabels = ["vista principal", "detalhe", "medidas"]

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.length ? images : ["/produtos/sem-foto.svg"]
  const [active, setActive] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)

  // Lupa: com mouse, a foto amplia no ponto do cursor (no toque, nada muda)
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !frameRef.current) return
    const r = frameRef.current.getBoundingClientRect()
    frameRef.current.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`)
    frameRef.current.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        onPointerMove={onMove}
        className="group relative aspect-square overflow-hidden rounded-3xl border bg-surface [@media(hover:hover)]:cursor-zoom-in"
      >
        {/* Crossfade entre as fotos. TODO cliente: substituir pelas fotos reais do produto */}
        <MotionScope>
        <AnimatePresence initial={false}>
          <m.div
            key={list[active]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <Image
              src={list[active]}
              alt={`${name}, ${viewLabels[active] ?? `imagem ${active + 1}`}`}
              fill
              priority={active === 0}
              data-fly-source="main"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover transition-transform duration-300 ease-out [transform-origin:var(--zx,50%)_var(--zy,50%)] [@media(hover:hover)]:group-hover:scale-[1.8]"
            />
          </m.div>
        </AnimatePresence>
        </MotionScope>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 bottom-3 hidden items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-soft transition-opacity group-hover:opacity-0 [@media(hover:hover)]:flex"
        >
          <ZoomIn className="size-3.5" />
          Passe o mouse para ampliar
        </span>
      </div>
      {list.length > 1 && (
        <div role="group" aria-label="Escolher imagem" className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver ${viewLabels[i] ?? `imagem ${i + 1}`}`}
              aria-pressed={active === i}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 bg-surface transition-transform duration-200 hover:-translate-y-0.5",
                active === i ? "border-brand" : "border-transparent hover:border-border",
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
