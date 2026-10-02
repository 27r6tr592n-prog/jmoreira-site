"use client"

import { useId, useState } from "react"
import { MapPin, Store, Truck } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cta } from "@/lib/copy"
import { formatBRL, maskCep } from "@/lib/format"
import { quoteShipping, type ShippingItem, type ShippingQuote } from "@/lib/shipping"

/** Simulação de frete na página do produto. O checkout recalcula no servidor. */
export function ShippingCalculator({ items, subtotal }: { items: ShippingItem[]; subtotal: number }) {
  const id = useId()
  const [cep, setCep] = useState("")
  const [quote, setQuote] = useState<ShippingQuote | null>(null)

  return (
    <div className="rounded-2xl border p-4">
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          setQuote(quoteShipping(cep, items, subtotal))
        }}
      >
        <label htmlFor={`${id}-cep`} className="flex items-center gap-2 text-sm font-bold">
          <Truck className="size-4 text-brand-ink" aria-hidden />
          Calcular frete e prazo
        </label>
        <div className="flex gap-2">
          <Input
            id={`${id}-cep`}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(maskCep(e.target.value))}
            aria-describedby={quote && !quote.ok ? `${id}-erro` : undefined}
            aria-invalid={quote && !quote.ok ? true : undefined}
            className="max-w-40"
          />
          <Button type="submit" variant="outline">
            {cta.calcShipping}
          </Button>
        </div>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Não sei meu CEP
        </a>
      </form>

      <div aria-live="polite">
        {quote && !quote.ok && (
          <p id={`${id}-erro`} className="mt-3 text-sm text-destructive">
            {quote.error}
          </p>
        )}
        {quote?.ok && (
          <ul className="mt-4 space-y-2">
            {quote.options.map((o) => (
              <li
                key={o.id}
                className={cn("flex items-start gap-3 rounded-xl bg-surface p-3 text-sm", !o.available && "opacity-80")}
              >
                {o.id === "pickup" ? (
                  <Store className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden />
                ) : (
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex justify-between gap-2 font-semibold">
                    <span>{o.label}</span>
                    <span className="tabular shrink-0">{!o.available ? "Indisponível" : o.price === 0 ? "Grátis" : formatBRL(o.price)}</span>
                  </p>
                  <p className="text-muted-foreground">{o.eta}</p>
                  {o.note && <p className={cn("mt-1 text-xs", o.available ? "text-muted-foreground" : "font-semibold text-warning-ink")}>{o.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
