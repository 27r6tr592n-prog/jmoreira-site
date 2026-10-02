"use client"

import { useEffect } from "react"

// Um único IntersectionObserver para todos os [data-reveal] do site.
// Marca [data-shown] quando o elemento entra (margem de -100 px, uma vez) e,
// terminada a transição, [data-done] para devolver ao elemento as transições
// dele (ex.: hover dos cards). Um MutationObserver pega o que aparece depois
// (navegação no cliente, conteúdo condicional).

const ENTER_MS = 500
const STAGGER_MS = 80
const IMAGE_MS = 800

function finish(el: HTMLElement, items: number) {
  const delay = parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) || 0
  const total = delay + (el.dataset.reveal === "image" ? IMAGE_MS : ENTER_MS) + items * STAGGER_MS + 100
  window.setTimeout(() => (el.dataset.done = ""), total)
}

export function RevealRoot() {
  useEffect(() => {
    // Sinaliza ao script do <head> que as revelações estão ativas (senão ele mostra tudo)
    ;(window as Window & { __revealReady?: boolean }).__revealReady = true
    const pending = new Set<HTMLElement>()

    const show = (el: HTMLElement) => {
      pending.delete(el)
      io.unobserve(el)
      const items = el.dataset.reveal === "stagger" ? el.querySelectorAll("[data-reveal-item]").length : 0
      const words = el.dataset.reveal === "words" ? el.querySelectorAll(".w").length : 0
      el.dataset.shown = ""
      finish(el, Math.max(items, words * 0.6))
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show(e.target as HTMLElement)
      },
      { rootMargin: "0px 0px -100px 0px" },
    )

    const watch = (el: HTMLElement) => {
      if (pending.has(el) || "shown" in el.dataset) return
      if (el.dataset.reveal === "stagger") {
        el.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((item, i) => item.style.setProperty("--i", String(i)))
      }
      pending.add(el)
      io.observe(el)
    }
    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(watch)
    scan(document)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.dataset.reveal) watch(node)
          scan(node)
        }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // No fim da página, os últimos 100 px nunca cruzariam a margem: mostra o que sobrou na tela
    let frame = 0
    const atBottom = () => {
      frame = 0
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return
      for (const el of pending) if (el.getBoundingClientRect().top < window.innerHeight) show(el)
    }
    const onScroll = () => (frame ||= requestAnimationFrame(atBottom))
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
