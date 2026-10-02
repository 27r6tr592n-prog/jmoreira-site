"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "cn"

type Props = {
  value: number
  max: number
  min?: number
  onChange: (value: number) => void
  label: string
  size?: "sm" | "md"
  className?: string
}

export function QuantityStepper({ value, max, min = 1, onChange, label, size = "md", className }: Props) {
  const btn = size === "sm" ? "size-9" : "size-11"
  return (
    <div
      role="group"
      aria-label={`Quantidade de ${label}`}
      className={cn("inline-flex items-center rounded-xl border border-input bg-background", className)}
    >
      <button
        type="button"
        className={cn(btn, "grid place-items-center rounded-l-xl text-foreground hover:bg-muted disabled:opacity-40")}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <output aria-live="polite" className={cn("tabular min-w-8 text-center font-semibold", size === "sm" ? "text-sm" : "text-base")}>
        {value}
      </output>
      <button
        type="button"
        className={cn(btn, "grid place-items-center rounded-r-xl text-foreground hover:bg-muted disabled:opacity-40")}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}
