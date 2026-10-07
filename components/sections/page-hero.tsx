import { cn } from "cn"

import { Breadcrumbs, type Crumb } from "./breadcrumbs"

/** Cabeçalho das páginas internas. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("relative -mt-16 overflow-clip border-b bg-surface pt-16 lg:-mt-22 lg:pt-22", className)}>
      <div aria-hidden className="sd-drift-bg bg-blueprint absolute -inset-y-12 inset-x-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-page relative py-8 sm:py-14">
        <Breadcrumbs items={crumbs} />
        <div className="sd-exit mt-5 max-w-3xl space-y-3 sm:mt-6 sm:space-y-4">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="text-3xl font-semibold sm:text-5xl">{title}</h1>
          {description && <p className="text-base text-muted-foreground sm:text-xl">{description}</p>}
        </div>
        {children && <div className="mt-6 sm:mt-8">{children}</div>}
      </div>
    </section>
  )
}
