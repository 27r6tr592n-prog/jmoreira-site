"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"

import { submitPrivateService } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { errors as copyErrors, loading } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { bestTimeOptions, privateServiceSchema, type PrivateServiceInput } from "@/lib/validation"
import { ConsentField } from "./consent-field"
import { Field, Honeypot } from "./field"
import { FormSuccess } from "./form-success"

/** Pedido de serviço sob medida: o que precisa, endereço, telefone e melhor horário. */
export function PrivateServiceForm() {
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState<PrivateServiceInput | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, setValue, setError, reset, formState } = useForm<PrivateServiceInput>({
    resolver: zodResolver(privateServiceSchema, undefined, { raw: true }),
    mode: "onTouched",
    defaultValues: { need: "", address: "", phone: "", consent: false, website: "" },
  })
  const e = formState.errors

  if (sent) {
    return (
      <div className="success-in">
        <FormSuccess
          title="Pedido de serviço enviado"
          text="Retornamos pelo telefone informado com o orçamento e a data da visita. Para agilizar, envie também pelo WhatsApp."
          waMessage={[
            "Olá, JMoreira! Quero solicitar um serviço particular.",
            `O que preciso: ${sent.need}`,
            `Endereço: ${sent.address}`,
            `Melhor horário: ${sent.bestTime}`,
          ].join("\n")}
          onReset={() => {
            reset()
            setSent(null)
          }}
        />
      </div>
    )
  }

  return (
    <form
      noValidate
      className="relative space-y-5"
      onSubmit={handleSubmit((values) => {
        setServerError(null)
        startTransition(async () => {
          try {
            const result = await submitPrivateService(values)
            if (result.ok) return setSent(values)
            setServerError(result.error)
            for (const [key, message] of Object.entries(result.fieldErrors ?? {})) setError(key as keyof PrivateServiceInput, { message })
          } catch {
            setServerError(copyErrors.network)
          }
        })
      })}
    >
      <Honeypot register={() => register("website")} />
      <Field
        id="sp-servico"
        label="O que você precisa?"
        error={e.need?.message}
        hint="O serviço, o local (cômodo, área externa, prédio) e, se houver, medidas ou fotos que pode mandar depois."
      >
        {(a) => <Textarea {...a} rows={4} {...register("need")} />}
      </Field>
      <Field id="sp-endereco" label="Endereço do serviço" error={e.address?.message}>
        {(a) => <Input {...a} autoComplete="street-address" placeholder="Rua, número e bairro…" {...register("address")} />}
      </Field>
      <Field id="sp-telefone" label="Telefone" error={e.phone?.message}>
        {(a) => (
          <Input
            {...a}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(17) 99999-9999"
            {...register("phone", { onChange: (ev) => setValue("phone", maskPhone(ev.target.value)) })}
          />
        )}
      </Field>
      <fieldset aria-describedby={e.bestTime ? "sp-horario-erro" : undefined} aria-invalid={e.bestTime ? true : undefined}>
        <legend className="mb-2 text-sm font-semibold">Melhor horário para a visita</legend>
        <div className="flex flex-wrap gap-2">
          {bestTimeOptions.map((t) => (
            <label
              key={t}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border bg-background px-4 text-sm font-semibold transition-colors has-checked:border-cta has-checked:bg-cta/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/40"
            >
              <input type="radio" value={t} className="sr-only" {...register("bestTime")} />
              {t}
            </label>
          ))}
        </div>
        {e.bestTime && (
          <p id="sp-horario-erro" className="field-error mt-1.5 text-sm font-medium text-destructive">
            {e.bestTime.message}
          </p>
        )}
      </fieldset>
      <ConsentField id="sp-consent" registration={register("consent")} error={e.consent?.message} />
      {serverError && (
        <p role="alert" className="field-error rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" variant="cta" size="lg" className="w-full sm:w-auto" loading={pending} loadingLabel={loading.sending}>
        <Send aria-hidden />
        Enviar pedido
      </Button>
    </form>
  )
}
