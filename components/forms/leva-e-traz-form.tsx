"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Briefcase, Package, Send, Users, type LucideIcon } from "lucide-react"
import { cn } from "cn"

import { submitLevaETraz } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { errors as copyErrors, loading } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { levaETrazSchema, levaETrazSteps, levaETrazTypes, type LevaETrazInput } from "@/lib/validation"
import { ConsentField } from "./consent-field"
import { Field, Honeypot } from "./field"
import { FormSuccess } from "./form-success"

const typeIcons: Record<(typeof levaETrazTypes)[number], LucideIcon> = {
  Pessoas: Users,
  "Encomenda pequena": Package,
  "Transporte executivo": Briefcase,
}
const stepTitles = ["Trajeto", "Contato"] as const

function whatsappMessage(v: LevaETrazInput) {
  return [
    "Olá, JMoreira! Quero um orçamento de Leva e Traz.",
    `Tipo: ${v.type}`,
    `Origem: ${v.origin}`,
    `Destino: ${v.destination}`,
    v.preferences ? `Preferências: ${v.preferences}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Pedido de Leva e Traz em 2 etapas: (1) tipo, origem e destino; (2) telefone,
 * e-mail e preferências. Cada etapa valida antes de avançar; a troca de etapa
 * desliza 24 px (só fade com movimento reduzido) e o foco vai para o título da etapa.
 */
export function LevaETrazForm() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState<LevaETrazInput | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const stepTitle = useRef<HTMLHeadingElement>(null)
  // Só anima e move o foco depois da primeira troca de etapa (não na abertura da página)
  const [stepped, setStepped] = useState(false)
  const { register, handleSubmit, setValue, setError, trigger, reset, formState } = useForm<LevaETrazInput>({
    resolver: zodResolver(levaETrazSchema, undefined, { raw: true }),
    mode: "onTouched",
    defaultValues: { origin: "", destination: "", phone: "", email: "", preferences: "", consent: false, website: "" },
  })
  const e = formState.errors

  // Leva o foco ao título da etapa nova (leitor de tela anuncia onde está)
  useEffect(() => {
    if (stepped) stepTitle.current?.focus()
  }, [step, stepped])

  const go = (to: number) => {
    setStepped(true)
    setDirection(to > step ? "forward" : "back")
    setStep(to)
  }
  const next = async () => {
    if (await trigger([...levaETrazSteps[0]], { shouldFocus: true })) go(1)
  }

  if (sent) {
    return (
      <div className="success-in">
        <FormSuccess
          title="Pedido de Leva e Traz enviado"
          text="Retornamos pelo telefone ou WhatsApp informado com o valor e a confirmação do horário. Para agilizar, envie o pedido também pelo WhatsApp."
          waMessage={whatsappMessage(sent)}
          onReset={() => {
            reset()
            setStepped(false)
            setStep(0)
            setSent(null)
          }}
        />
      </div>
    )
  }

  return (
    <form
      noValidate
      className="relative space-y-6"
      onSubmit={handleSubmit((values) => {
        setServerError(null)
        startTransition(async () => {
          try {
            const result = await submitLevaETraz(values)
            if (result.ok) return setSent(values)
            setServerError(result.error)
            const fields = Object.keys(result.fieldErrors ?? {})
            for (const key of fields) setError(key as keyof LevaETrazInput, { message: result.fieldErrors![key] })
            if (fields.some((f) => (levaETrazSteps[0] as readonly string[]).includes(f))) go(0)
          } catch {
            setServerError(copyErrors.network)
          }
        })
      })}
    >
      <Honeypot register={() => register("website")} />

      {/* Progresso: 2 etapas */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
          Etapa {step + 1} de 2: {stepTitles[step]}
        </p>
        <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full origin-left rounded-full bg-cta transition-transform duration-500 ease-(--ease-out)"
            style={{ transform: `scaleX(${(step + 1) / 2})` }}
          />
        </div>
      </div>

      <div key={step} className={cn("space-y-5", stepped && (direction === "forward" ? "step-forward" : "step-back"))}>
        <h3 ref={stepTitle} tabIndex={-1} className="text-xl font-semibold outline-none">
          {step === 0 ? "Tipo de transporte e trajeto" : "Seus dados de contato"}
        </h3>

        {step === 0 ? (
          <>
            <fieldset aria-describedby={e.type ? "lt-tipo-erro" : undefined} aria-invalid={e.type ? true : undefined}>
              <legend className="mb-2 text-sm font-semibold">O que vamos levar?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {levaETrazTypes.map((t) => {
                  const Icon = typeIcons[t]
                  return (
                    <label
                      key={t}
                      className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-background p-3 text-sm font-semibold transition-colors has-checked:border-cta has-checked:bg-cta/10 has-focus-visible:ring-3 has-focus-visible:ring-ring/40"
                    >
                      <input type="radio" value={t} className="sr-only" {...register("type")} />
                      <Icon className="size-5 shrink-0 text-brand-ink" aria-hidden />
                      {t}
                    </label>
                  )
                })}
              </div>
              {e.type && (
                <p id="lt-tipo-erro" className="field-error mt-1.5 text-sm font-medium text-destructive">
                  {e.type.message}
                </p>
              )}
            </fieldset>
            <Field id="lt-origem" label="Origem" error={e.origin?.message} hint="Endereço ou bairro de onde vamos sair.">
              {(a) => <Input {...a} autoComplete="street-address" placeholder="Rua, número e bairro…" {...register("origin")} />}
            </Field>
            <Field id="lt-destino" label="Destino" error={e.destination?.message} hint="Endereço, bairro ou cidade de destino.">
              {(a) => <Input {...a} autoComplete="off" placeholder="Rua, número e bairro ou cidade…" {...register("destination")} />}
            </Field>
            <Button type="button" size="lg" className="w-full sm:w-auto" onClick={next}>
              Continuar
              <ArrowRight aria-hidden />
            </Button>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="lt-telefone" label="Telefone do contratante" error={e.phone?.message}>
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
              <Field id="lt-email" label="E-mail" error={e.email?.message}>
                {(a) => <Input {...a} type="email" inputMode="email" autoComplete="email" spellCheck={false} {...register("email")} />}
              </Field>
            </div>
            <Field
              id="lt-preferencias"
              label="Preferências"
              optional
              error={e.preferences?.message}
              hint="Data e horário, número de passageiros, tamanho da encomenda, retorno etc."
            >
              {(a) => <Textarea {...a} rows={3} {...register("preferences")} />}
            </Field>
            <ConsentField id="lt-consent" registration={register("consent")} error={e.consent?.message} />
            {serverError && (
              <p role="alert" className="field-error rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {serverError}
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="outline" size="lg" onClick={() => go(0)} disabled={pending}>
                <ArrowLeft aria-hidden />
                Voltar
              </Button>
              <Button type="submit" variant="cta" size="lg" loading={pending} loadingLabel={loading.sending}>
                <Send aria-hidden />
                Enviar pedido
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
