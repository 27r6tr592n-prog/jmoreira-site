"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"

import { submitLead } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { errors as copyErrors, loading } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { services } from "@/lib/services"
import { site } from "@/lib/site"
import { leadSchema, type LeadInput } from "@/lib/validation"
import { Field, Honeypot } from "./field"
import { FormSuccess } from "./form-success"

export function ContactForm({ source = "contato", defaultService = "" }: { source?: string; defaultService?: string }) {
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, setValue, setError, reset, formState } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema, undefined, { raw: true }),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", service: defaultService, message: "", consent: false, website: "" },
  })
  const e = formState.errors

  if (sent) {
    return (
      <FormSuccess
        title="Mensagem recebida"
        text={`Respondemos pelo telefone ou WhatsApp informado, no horário de atendimento (${site.hours.short}). Se for urgente, chame no WhatsApp agora.`}
        waMessage="Olá, JMoreira! Acabei de enviar uma mensagem pelo site."
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
      className="relative space-y-4"
      onSubmit={handleSubmit((values) => {
        setServerError(null)
        startTransition(async () => {
          try {
            const result = await submitLead({ ...values, source, pagePath: pathname })
            if (result.ok) return setSent(true)
            setServerError(result.error)
            for (const [key, message] of Object.entries(result.fieldErrors ?? {})) setError(key as keyof LeadInput, { message })
          } catch {
            setServerError(copyErrors.network)
          }
        })
      })}
    >
      <Honeypot register={() => register("website")} />
      <Field id="contato-nome" label="Nome" error={e.name?.message}>
        {(a) => <Input {...a} autoComplete="name" {...register("name")} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contato-telefone" label="WhatsApp ou telefone" error={e.phone?.message}>
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
        <Field id="contato-email" label="E-mail" optional error={e.email?.message}>
          {(a) => <Input {...a} type="email" inputMode="email" autoComplete="email" spellCheck={false} {...register("email")} />}
        </Field>
      </div>
      <Field id="contato-servico" label="Assunto" optional>
        {(a) => (
          <select
            {...a}
            {...register("service")}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground dark:bg-surface"
          >
            <option value="">Escolha um assunto</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="E-commerce / pedido">E-commerce / pedido</option>
            <option value="Outro assunto">Outro assunto</option>
          </select>
        )}
      </Field>
      <Field id="contato-mensagem" label="Como podemos ajudar?" error={e.message?.message} hint="Conte o que aconteceu, o bairro e o melhor horário.">
        {(a) => <Textarea {...a} rows={4} {...register("message")} />}
      </Field>
      <div className="space-y-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
            aria-invalid={e.consent ? true : undefined}
            aria-describedby={e.consent ? "contato-consent-erro" : undefined}
            {...register("consent")}
          />
          <span>
            Autorizo a JMoreira a entrar em contato pelos dados informados, conforme a{" "}
            <Link href="/politicas#privacidade" className="font-semibold text-brand-ink underline underline-offset-2">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {e.consent && (
          <p id="contato-consent-erro" className="text-sm font-medium text-destructive">
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
        <Send aria-hidden />
        Enviar mensagem
      </Button>
    </form>
  )
}
