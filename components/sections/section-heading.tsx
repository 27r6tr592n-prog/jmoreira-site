import { cn } from "cn"

import { Reveal } from "@/components/motion/reveal"

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
    <Reveal className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-base text-muted-foreground sm:text-lg">{description}</p>}
    </Reveal>
  )
}
