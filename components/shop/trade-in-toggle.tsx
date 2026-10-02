"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { formatBRL } from "@/lib/format"

/** Opção de entregar a bateria usada (base de troca). Marcada por padrão. */
export function TradeInToggle({
  checked,
  surcharge,
  onChange,
  compact = false,
}: {
  checked: boolean
  surcharge: number
  onChange: (checked: boolean) => void
  compact?: boolean
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-2.5 ${compact ? "text-xs" : "text-sm"} leading-snug`}>
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span>
        <span className="font-semibold">Vou entregar a bateria usada</span>
        <span className="block text-muted-foreground">
          {checked ? "Preço já considera a troca." : `Sem a bateria usada, acréscimo de ${formatBRL(surcharge)}.`}
        </span>
      </span>
    </label>
  )
}
