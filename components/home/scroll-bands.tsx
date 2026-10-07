import { Fragment } from "react"

import { VelocitySkew } from "@/components/motion/velocity-skew"
import { services } from "@/lib/services"

// Só nomes do que a JMoreira oferece de fato (serviços, Leva e Traz e E-commerce)
const top = services.map((s) => s.name)
const bottom = ["Leva e Traz", "E-commerce", "Peças hidráulicas", "Baterias", "Instalação sob orçamento", "Serviço particular"]

// Cada fita corta o próprio texto (overflow-hidden): o que passa da fita nunca
// aparece sobre o fundo da página, e o teste de contraste enxerga o corte. Como
// overflow-hidden "rouba" a view(), as linhas usam a timeline nomeada --bands,
// declarada no contêiner de fora (.sd-bands no globals.css).
function Row({ items, className }: { items: string[]; className: string }) {
  // Repetida 2 vezes: mesmo deslocada 24 %, a faixa continua cobrindo telas de 1920 px
  const list = [...items, ...items]
  return (
    <div className={`flex w-max items-center gap-6 py-3 whitespace-nowrap sm:gap-10 sm:py-4 ${className}`}>
      {list.map((t, i) => (
        <Fragment key={i}>
          <span>{t}</span>
          <span className="size-2.5 shrink-0 rotate-45 rounded-[2px] bg-current opacity-60 sm:size-3.5" />
        </Fragment>
      ))}
    </div>
  )
}

/**
 * Duas faixas cruzadas (fita azul e fita âmbar) que andam em sentidos opostos
 * conforme a rolagem (CSS scroll-driven, ver .sd-drift-* no globals.css) e
 * inclinam as letras quando a rolagem é rápida (VelocitySkew, só desktop).
 * Decorativo: o conteúdo real está nas seções de serviços e no menu.
 */
export function ScrollBands() {
  return (
    <div aria-hidden className="sd-bands relative overflow-clip py-10 select-none sm:py-16">
      <div className="relative z-10 -mx-[5%] w-[110%] -rotate-2 overflow-hidden bg-brand font-heading text-3xl font-semibold text-white shadow-lift sm:text-6xl">
        <VelocitySkew>
          <Row items={top} className="sd-drift-left" />
        </VelocitySkew>
      </div>
      <div className="-mx-[5%] -mt-2 w-[110%] rotate-1 overflow-hidden bg-cta font-heading text-3xl font-semibold text-cta-foreground sm:-mt-3 sm:text-6xl">
        <VelocitySkew>
          <Row items={bottom} className="sd-drift-right" />
        </VelocitySkew>
      </div>
    </div>
  )
}
