"use client"

import { revealHeader } from "@/components/layout/sticky-header"
import { motionDisabled } from "@/lib/motion"

const FLY_DURATION = 0.7

function onScreen(r: DOMRect) {
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
}

/**
 * Miniatura do produto voa do card (ou da galeria) até o ícone do carrinho.
 * Só transform/opacity: o clone fica fixo na origem e anda por translate/scale.
 * x desacelera e y acelera, o que desenha uma curva. Resolve quando pousa
 * (ou na hora, se não houver de onde/para onde voar ou o movimento estiver reduzido).
 */
export async function flyToCart(trigger: HTMLElement) {
  if (motionDisabled()) return
  const target = document.querySelector<HTMLElement>("[data-cart-target]")
  const source =
    trigger.closest("[data-product-card]")?.querySelector<HTMLImageElement>("[data-fly-source]") ??
    document.querySelector<HTMLImageElement>('[data-fly-source="main"]')
  if (!target || !source) return

  // Garante o header visível e mira onde o carrinho vai estar (descontando o translate atual)
  revealHeader()
  const header = target.closest("header")
  const shift = header ? new DOMMatrixReadOnly(getComputedStyle(header).transform).m42 : 0
  const t = target.getBoundingClientRect()
  const to = { x: t.left + t.width / 2, y: t.top - shift + t.height / 2 }

  // Se a foto saiu da tela (ex.: barra fixa do celular), sai de cima do botão
  let from = source.getBoundingClientRect()
  if (!onScreen(from)) {
    const b = trigger.getBoundingClientRect()
    from = new DOMRect(b.left + b.width / 2 - 40, b.top - 88, 80, 80)
  }

  // Dois níveis: o de fora anda em X (desacelera), o de dentro em Y (acelera)
  // e encolhe. A soma das duas curvas desenha um arco. Web Animations API: sem
  // biblioteca no JS inicial.
  const outer = document.createElement("div")
  outer.setAttribute("aria-hidden", "true")
  Object.assign(outer.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    zIndex: "70",
    pointerEvents: "none",
  })
  const clone = document.createElement("img")
  clone.src = source.currentSrc || source.src
  clone.alt = ""
  Object.assign(clone.style, {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
    boxShadow: "0 20px 40px -12px rgb(4 10 22 / 0.35)",
    background: "white",
  })
  outer.appendChild(clone)
  document.body.appendChild(outer)

  const dx = to.x - (from.left + from.width / 2)
  const dy = to.y - (from.top + from.height / 2)
  const scale = 28 / Math.max(from.width, 1)
  const duration = FLY_DURATION * 1000

  try {
    await Promise.all([
      outer.animate([{ transform: "none" }, { transform: `translateX(${dx}px)` }], {
        duration,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }).finished,
      clone.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: `translateY(${dy}px) scale(${scale})`, opacity: 0.85 },
        ],
        { duration, easing: "cubic-bezier(0.55, 0, 0.85, 0.35)", fill: "forwards" },
      ).finished,
    ])
  } catch {
    // animação cancelada: segue o fluxo normal
  } finally {
    outer.remove()
  }
}
