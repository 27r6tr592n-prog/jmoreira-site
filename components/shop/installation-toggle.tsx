"use client"

import { Wrench } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"

/** Texto padrão: peça e mão de obra são itens separados. */
export const installationNote =
  "A peça e a mão de obra são itens separados. Comprando só a peça, a instalação não está incluída."

/**
 * Opção de contratar a mão de obra de instalação junto com a peça.
 * Sem preço no site: o valor é orçado pelo técnico (decisão do cliente, v3).
 */
export function InstallationToggle({
  checked,
  onChange,
  compact = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  compact?: boolean
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-2.5 ${compact ? "text-xs" : "text-sm"} leading-snug`}>
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span>
        <span className="flex items-center gap-1.5 font-semibold">
          <Wrench className="size-3.5 text-brand-ink" aria-hidden />
          Contratar a instalação (mão de obra)
        </span>
        <span className="block text-muted-foreground">
          Item separado, sob orçamento: o técnico confirma o valor antes do serviço.
        </span>
      </span>
    </label>
  )
}
