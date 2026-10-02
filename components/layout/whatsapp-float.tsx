"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { contextMessage, whatsappUrl } from "@/lib/whatsapp"

/**
 * Botão flutuante do WhatsApp em todas as páginas. Entra aos 2 s com mola,
 * pulsa a cada 8 s (anel em CSS, só transform/opacity) e, no hover/foco, se
 * expande mostrando o texto (clip-path em CSS). A mensagem usa o <h1> da página.
 */
export function WhatsAppFloat() {
  const pathname = usePathname()
  const [title, setTitle] = useState<string | undefined>()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h1 = document.querySelector("main h1")
      setTitle(h1?.getAttribute("data-wa-title") ?? h1?.textContent?.trim() ?? undefined)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  // Na página de produto existe a barra fixa de compra no celular: subimos o botão.
  const raised = /^\/loja\/[^/]+$/.test(pathname)
  const href = whatsappUrl(contextMessage(pathname, title))

  return (
    <aside
      aria-label="Atalho para o WhatsApp"
      className={cn(
        "fixed right-4 z-30",
        "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
        raised && "max-lg:bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
      )}
    >
      {/* Entra aos 2 s com a mola (CSS, var(--spring)); reduzido: só fade de 120 ms */}
      <div className="wa-enter relative">
        {/* Pulso a cada 8 s */}
        <span aria-hidden className="wa-pulse pointer-events-none absolute inset-0 rounded-full bg-whatsapp" />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar com a JMoreira no WhatsApp (abre em nova aba)"
          className="group/wa relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-white/70 transition-transform duration-200 hover:bg-whatsapp-hover focus-visible:ring-ring active:scale-95 dark:ring-black/30"
        >
          {/* Rótulo que se revela para a esquerda no hover/foco (clip-path, sem mexer no layout) */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 flex h-14 items-center rounded-full bg-whatsapp pr-16 pl-5 text-sm font-bold whitespace-nowrap shadow-lg [clip-path:inset(0_0_0_calc(100%-3.5rem)_round_9999px)] transition-[clip-path] duration-250 ease-(--ease-out) group-hover/wa:[clip-path:inset(0_round_9999px)] group-focus-visible/wa:[clip-path:inset(0_round_9999px)]"
          >
            <span className="translate-x-2 opacity-0 transition-[transform,opacity] duration-250 ease-(--ease-out) group-hover/wa:translate-x-0 group-hover/wa:opacity-100 group-focus-visible/wa:translate-x-0 group-focus-visible/wa:opacity-100">
              Chamar no WhatsApp
            </span>
          </span>
          <WhatsAppIcon className="relative size-7" />
        </a>
      </div>
    </aside>
  )
}
