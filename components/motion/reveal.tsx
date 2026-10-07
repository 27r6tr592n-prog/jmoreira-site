import { Fragment, type CSSProperties, type ReactNode } from "react"
import { cn } from "cn"

type Tag = "div" | "li" | "ul" | "ol" | "dl" | "section" | "article" | "figure" | "span" | "p"
type Extra = Partial<Record<`data-${string}` | `aria-${string}`, string>>

/**
 * Entra quando aparece na tela (uma vez, margem de -100 px): sobe 24 px com
 * fade em 500 ms, ease-out [0.22, 1, 0.36, 1]. Com `stagger`, vira um container
 * e os filhos <RevealItem> entram em cascata de 80 ms.
 *
 * Sem JavaScript de componente: é só marcação. O <RevealRoot> do layout observa
 * todos os [data-reveal] com um único IntersectionObserver e o CSS faz a
 * transição (só transform/opacity). Assim a home não hidrata dezenas de
 * componentes animados (ver DECISIONS D25). Não usar no LCP (título do herói).
 */
export function Reveal({
  as: Comp = "div",
  variant = "up",
  stagger = false,
  delay = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: Tag
  variant?: "up" | "scale"
  stagger?: boolean
  /** atraso em ms */
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
} & Extra) {
  return (
    <Comp
      data-reveal={stagger ? "stagger" : variant}
      className={className}
      style={delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Filho de um <Reveal stagger>: entra na sua vez (o índice é calculado pelo RevealRoot). */
export function RevealItem({
  as: Comp = "div",
  className,
  style,
  children,
  ...rest
}: { as?: Tag; className?: string; style?: CSSProperties; children?: ReactNode } & Extra) {
  return (
    <Comp data-reveal-item="" className={className} style={style} {...rest}>
      {children}
    </Comp>
  )
}

/**
 * Foto que se revela de baixo para cima (clip-path) enquanto o zoom de 1,08
 * volta a 1,0 (800 ms). O container define o tamanho (sem layout shift).
 * Exceção à regra "só transform/opacity", pedida no briefing.
 */
export function RevealImage({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <div
      data-reveal="image"
      className={cn("overflow-clip", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      <div data-reveal-inner="" className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}

/**
 * Título que entra palavra por palavra quando aparece na tela (uma vez), cada
 * palavra subindo de dentro de uma "janela". Para títulos abaixo da dobra; o h1
 * do herói usa `words-up` (anima no carregamento). Leitores de tela ouvem a
 * frase inteira (sr-only); as palavras são decorativas.
 */
export function SplitWords({ text }: { text: string }) {
  // Um aria-hidden só para todas as palavras: 2 <span> por palavra (janela + palavra)
  return (
    <span data-reveal="words">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="w">
              <span style={{ "--w": i } as CSSProperties}>{w}</span>
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  )
}
