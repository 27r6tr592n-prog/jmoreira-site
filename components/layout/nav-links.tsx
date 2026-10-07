"use client"

import { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { mainNav } from "@/lib/site"

export function NavLinks({ vertical = false, onNavigate }: { vertical?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement>(null)
  const barRef = useRef<HTMLLIElement>(null)
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  // Traço âmbar do menu do desktop: desliza até o item sob o mouse (ou com foco)
  // e volta para a página atual. Só transform (translateX + scaleX de um traço de 1 px).
  const moveTo = useCallback((link: HTMLElement | null, animate = true) => {
    const bar = barRef.current
    if (!bar) return
    if (!link) {
      bar.style.opacity = "0"
      return
    }
    const pad = 12 // px-3 do link: o traço fica do tamanho do texto
    bar.style.transition = animate ? "" : "none"
    bar.style.opacity = "1"
    bar.style.transform = `translateX(${link.offsetLeft + pad}px) scaleX(${Math.max(0, link.offsetWidth - pad * 2)})`
  }, [])

  const backToActive = useCallback(
    (animate = true) => moveTo(listRef.current?.querySelector<HTMLElement>("a[aria-current='page']") ?? null, animate),
    [moveTo],
  )

  useEffect(() => {
    if (vertical) return
    backToActive(false)
    // As fontes mudam a largura dos itens depois da primeira pintura
    void document.fonts?.ready.then(() => backToActive(false))
    const onResize = () => backToActive(false)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [vertical, pathname, backToActive])

  return (
    <ul
      ref={listRef}
      className={cn(vertical ? "flex flex-col gap-1" : "relative flex items-center gap-1")}
      onMouseLeave={vertical ? undefined : () => backToActive()}
      onBlur={
        vertical
          ? undefined
          : (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) backToActive()
            }
      }
    >
      {mainNav.map((item, i) => {
        const active = isActive(item.href)
        const highlight = "highlight" in item && item.highlight
        return (
          <li key={item.href} className={vertical ? "animate-rise-in" : undefined} style={vertical ? { animationDelay: `${60 + i * 45}ms` } : undefined}>
            <Link
              href={item.href}
              onClick={onNavigate}
              onMouseEnter={vertical ? undefined : (e) => moveTo(e.currentTarget)}
              onFocus={vertical ? undefined : (e) => moveTo(e.currentTarget)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center rounded-lg font-semibold transition-colors",
                vertical ? "h-12 px-3 text-base" : "h-10 px-3 text-sm",
                active
                  ? "bg-brand-soft text-brand-soft-ink"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              {highlight && (
                <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-cta shadow-[0_0_0_3px_rgb(245_158_11/0.25)]" />
              )}
              {item.label}
            </Link>
          </li>
        )
      })}
      {/* <li> (e não <span>) porque <ul> só aceita itens de lista */}
      {!vertical && (
        <li
          ref={barRef}
          aria-hidden
          className="pointer-events-none absolute -bottom-2 left-0 h-0.5 w-px origin-left rounded-full bg-cta opacity-0 transition-[transform,opacity] duration-300 ease-out"
        />
      )}
    </ul>
  )
}
