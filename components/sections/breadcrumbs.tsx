import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbJsonLd } from "@/lib/seo"

export type Crumb = { name: string; path: string }

/** Trilha de navegação visível + JSON-LD BreadcrumbList. */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Início", path: "/" }, ...items]
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Você está em" className={className}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {all.map((c, i) => {
            const last = i === all.length - 1
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="line-clamp-1 font-medium text-foreground">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-foreground hover:underline">
                      {c.name}
                    </Link>
                    <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
