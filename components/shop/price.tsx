import { cn } from "cn"

import { formatBRL, installmentsFor } from "@/lib/format"

/** Preço à vista + parcelado sem juros. */
export function Price({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: number
  compareAt?: number | null
  size?: "md" | "lg"
  className?: string
}) {
  const inst = installmentsFor(price)
  return (
    <div className={cn("space-y-0.5", className)}>
      {compareAt ? (
        <p className="text-sm text-muted-foreground">
          <span className="sr-only">Preço anterior: </span>
          <s className="tabular">{formatBRL(compareAt)}</s>
        </p>
      ) : null}
      <p className={cn("tabular font-bold tracking-tight", size === "lg" ? "text-3xl sm:text-4xl" : "text-xl")}>
        {formatBRL(price)}
        <span className={cn("ml-1.5 font-semibold text-muted-foreground", size === "lg" ? "text-base" : "text-xs")}>à vista</span>
      </p>
      {inst.count > 1 && (
        <p className={cn("tabular text-muted-foreground", size === "lg" ? "text-base" : "text-sm")}>
          ou {inst.count}× de {formatBRL(inst.value)} sem juros
        </p>
      )}
    </div>
  )
}
