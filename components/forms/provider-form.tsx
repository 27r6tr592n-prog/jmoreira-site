"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"

import { submitProvider } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { errors as copyErrors, loading } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { providerSchema, specialtyOptions, type ProviderInput } from "@/lib/validation"
import { Field, Honeypot } from "./field"
import { FormSuccess } from "./form-success"

export function ProviderForm() {
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, setValue, setError, reset, formState } = useForm<ProviderInput>({
    resolver: zodResolver(providerSchema, undefined, { raw: true }),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "São José do Rio Preto",
      specialties: [],
      experienceYears: "",
      experienceNotes: "",
      hasCnpjMei: false,
      consent: false,
      website: "",
    },
  })
  const e = formState.errors

  if (sent) {
    return (
      <FormSuccess
        title="Cadastro recebido"
        text="Nossa equipe analisa os cadastros toda semana. Se o seu perfil combinar com a demanda da sua região, chamamos você no WhatsApp para a próxima etapa."
        waMessage="Olá, JMoreira! Acabei de me cadastrar como prestador pelo site."
        onReset={() => {
          reset()
          setSent(false)
        }}
      />
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
            const result = await submitProvider(values)
            if (result.ok) return setSent(true)
            setServerError(result.error)
            for (const [key, message] of Object.entries(result.fieldErrors ?? {})) setError(key as keyof ProviderInput, { message })
          } catch {
            setServerError(copyErrors.network)
          }
        })
      })}
    >
      <Honeypot register={() => register("website")} />
      <Field id="prest-nome" label="Nome completo" error={e.name?.message}>
        {(a) => <Input {...a} autoComplete="name" {...register("name")} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="prest-telefone" label="WhatsApp" error={e.phone?.message}>
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
        <Field id="prest-email" label="E-mail" optional error={e.email?.message}>
          {(a) => <Input {...a} type="email" inputMode="email" autoComplete="email" spellCheck={false} {...register("email")} />}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="prest-cidade" label="Cidade onde atende" error={e.city?.message}>
          {(a) => <Input {...a} autoComplete="address-level2" {...register("city")} />}
        </Field>
        <Field id="prest-anos" label="Anos de experiência" error={e.experienceYears?.message}>
          {(a) => <Input {...a} type="number" inputMode="numeric" autoComplete="off" min={0} max={60} placeholder="Ex.: 5" {...register("experienceYears")} />}
        </Field>
      </div>

      <fieldset aria-describedby={e.specialties ? "prest-esp-erro" : undefined}>
        <legend className="text-sm font-semibold">Especialidades</legend>
        <p className="text-xs text-muted-foreground">Marque todas em que você trabalha.</p>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {specialtyOptions.map((s) => (
            <label key={s} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 text-sm hover:bg-muted">
              <input type="checkbox" value={s} className="size-5 shrink-0 accent-[var(--brand)]" {...register("specialties")} />
              {s}
            </label>
          ))}
        </div>
        {e.specialties && (
          <p id="prest-esp-erro" className="mt-1.5 text-sm font-medium text-destructive">
            {e.specialties.message}
          </p>
        )}
      </fieldset>

      <Field
        id="prest-experiencia"
        label="Conte sobre sua experiência"
        optional
        error={e.experienceNotes?.message}
        hint="Onde já trabalhou, tipos de serviço que mais faz, cursos e certificações (NR-10, por exemplo)."
      >
        {(a) => <Textarea {...a} rows={4} {...register("experienceNotes")} />}
      </Field>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" className="size-5 shrink-0 accent-[var(--brand)]" {...register("hasCnpjMei")} />
        Tenho MEI ou CNPJ ativo
      </label>

      <div className="space-y-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
            aria-invalid={e.consent ? true : undefined}
            aria-describedby={e.consent ? "prest-consent-erro" : undefined}
            {...register("consent")}
          />
          <span>
            Autorizo a JMoreira a usar estes dados para avaliar meu cadastro e entrar em contato, conforme a{" "}
            <Link href="/politicas#privacidade" className="font-semibold text-brand-ink underline underline-offset-2">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {e.consent && (
          <p id="prest-consent-erro" className="text-sm font-medium text-destructive">
            {e.consent.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={pending} loadingLabel={loading.sending}>
        <UserPlus aria-hidden />
        Enviar cadastro
      </Button>
    </form>
  )
}
