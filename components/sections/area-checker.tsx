"use client"

import { useId, useState } from "react"
import { CircleCheck, Info, MapPinned, Search } from "lucide-react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { Input } from "@/components/ui/input"
import { normalize } from "@/lib/catalog-filter"
import { nearbyCities, neighborhoods, site } from "@/lib/site"
import { whatsappUrl } from "@/lib/whatsapp"

type Result =
  | { kind: "bairro"; name: string }
  | { kind: "cidade"; name: string }
  | { kind: "desconhecido"; name: string }

function check(raw: string): Result | null {
  const q = normalize(raw.trim())
  if (q.length < 3) return null
  const bairro = neighborhoods.find((n) => normalize(n) === q) ?? neighborhoods.find((n) => normalize(n).includes(q))
  if (bairro) return { kind: "bairro", name: bairro }
  const cidade = nearbyCities.find((c) => normalize(c) === q) ?? nearbyCities.find((c) => normalize(c).includes(q))
  if (cidade) return { kind: "cidade", name: cidade }
  if (q.includes("rio preto")) return { kind: "bairro", name: "São José do Rio Preto" }
  return { kind: "desconhecido", name: raw.trim() }
}

/** "Atendemos seu bairro?" — resposta na hora, sem enviar nada a servidor. */
export function AreaChecker() {
  const uid = useId()
  const [value, setValue] = useState("")
  const result = check(value)

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-soft">
      <label htmlFor={`${uid}-q`} className="flex items-center gap-2 font-bold">
        <MapPinned className="size-5 text-brand-ink" aria-hidden />
        Atendemos seu bairro?
      </label>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id={`${uid}-q`}
          name="bairro"
          list={`${uid}-lista`}
          autoComplete="off"
          placeholder="Digite o bairro ou a cidade…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-10"
        />
        <datalist id={`${uid}-lista`}>
          {[...neighborhoods, ...nearbyCities].map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </div>

      <div aria-live="polite" className="min-h-0">
        {result && (
          <div
            key={`${result.kind}-${result.name}`}
            className={cn(
              "animate-rise-in mt-3 flex gap-3 rounded-xl p-3 text-sm",
              result.kind === "bairro" && "bg-success-soft text-success",
              result.kind === "cidade" && "bg-brand-soft text-brand-soft-ink",
              result.kind === "desconhecido" && "bg-warning-soft text-warning-ink",
            )}
          >
            {result.kind === "desconhecido" ? (
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
            ) : (
              <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            )}
            <div className="space-y-1">
              {result.kind === "bairro" && (
                <p>
                  <strong>Sim! Atendemos {result.name}.</strong> Chegada em até {site.promises.arrivalMinutes} minutos, das 7h às
                  21h.*
                </p>
              )}
              {result.kind === "cidade" && (
                <p>
                  <strong>Atendemos {result.name}.</strong> O prazo de chegada pode passar de {site.promises.arrivalMinutes} minutos:
                  confirme pelo WhatsApp.
                </p>
              )}
              {result.kind === "desconhecido" && (
                <p>
                  <strong>Não achamos “{result.name}” na lista,</strong> mas atendemos toda São José do Rio Preto e várias cidades da
                  região. Confirme pelo WhatsApp.
                </p>
              )}
              <a
                href={whatsappUrl(`Olá, JMoreira! Vocês atendem em ${result.name}? Preciso de um técnico.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 font-bold underline-offset-2 hover:underline"
              >
                <WhatsAppIcon className="size-4" />
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
