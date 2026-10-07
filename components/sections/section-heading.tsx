import { cn } from "cn"

import { Reveal, SplitWords } from "@/components/motion/reveal"

/**
 * Título de seção. Ao aparecer na tela: o traço âmbar do rótulo se desenha,
 * o título sobe palavra por palavra e a descrição entra logo depois.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  id?: string
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <h2 id={id} className="text-3xl font-semibold sm:text-4xl">
        {typeof title === "string" ? (
          <SplitWords text={title} />
        ) : (
          <Reveal as="span" className="block">
            {title}
          </Reveal>
        )}
      </h2>
      {description && (
        <Reveal as="p" delay={180} className="text-base text-muted-foreground sm:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  )
}
