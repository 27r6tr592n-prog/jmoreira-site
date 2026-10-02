"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, CreditCard, Loader2, Lock, MapPin, ShoppingBag, Store, Truck, Wrench } from "lucide-react"
import { cn } from "cn"

import { placeOrder, type PlaceOrderResult } from "@/app/actions/orders"
import { WhatsAppIcon } from "@/components/brand/icons"
import { Field, Honeypot } from "@/components/forms/field"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cta, empty, errors as copyErrors, loading } from "@/lib/copy"
import { formatBRL, fromCents, maskCep, maskPhone, onlyDigits, toCents } from "@/lib/format"
import { unitPrice } from "@/lib/pricing"
import { pickupOption, quoteShipping } from "@/lib/shipping"
import { fullAddress, site } from "@/lib/site"
import { cartSubtotal, useCart, useCartHydration } from "@/lib/store/cart"
import { checkoutFormSchema, type CheckoutFormInput } from "@/lib/validation"

type Done = Extract<PlaceOrderResult, { ok: true; next: "whatsapp" }>

export function CheckoutForm() {
  const hydrated = useCartHydration()
  const items = useCart((s) => s.items)
  const clear = useCart((s) => s.clear)
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState<Done | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema, undefined, { raw: true }),
    mode: "onTouched",
    defaultValues: {
      channel: "whatsapp",
      name: "",
      phone: "",
      email: "",
      deliveryMethod: "delivery",
      cep: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: site.address.city,
      notes: "",
      website: "",
    },
  })
  const { register, handleSubmit, watch, setValue, setError, setFocus, formState } = form
  const fieldErrors = formState.errors
  const deliveryMethod = watch("deliveryMethod")
  const cep = watch("cep") ?? ""
  const channel = watch("channel")

  // Preenche o endereço pelo CEP (ViaCEP). Se falhar, o cliente digita normalmente.
  useEffect(() => {
    const digits = onlyDigits(cep)
    if (digits.length !== 8) return
    const controller = new AbortController()
    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { logradouro?: string; bairro?: string; localidade?: string; erro?: boolean } | null) => {
        if (!data || data.erro) return
        if (data.logradouro) setValue("street", data.logradouro, { shouldValidate: true })
        if (data.bairro) setValue("district", data.bairro, { shouldValidate: true })
        if (data.localidade) setValue("city", data.localidade)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [cep, setValue])

  const subtotal = cartSubtotal(items)
  const quote = useMemo(
    () =>
      deliveryMethod === "delivery" && onlyDigits(cep).length === 8
        ? quoteShipping(
            cep,
            items.map((i) => ({ weightKg: i.weightKg, quantity: i.quantity, isBattery: i.isBattery, inStock: i.stock > 0 })),
            subtotal,
          )
        : null,
    [deliveryMethod, cep, items, subtotal],
  )
  const shippingOption =
    deliveryMethod === "pickup" ? pickupOption() : quote?.ok ? quote.options.find((o) => o.id !== "pickup") ?? null : null
  const shippingBlocked = shippingOption != null && !shippingOption.available
  const total = fromCents(toCents(subtotal) + toCents(shippingOption?.available ? shippingOption.price : 0))

  // Avisa antes de sair da página com dados preenchidos e pedido não enviado.
  const isDirty = formState.isDirty
  useEffect(() => {
    if (!isDirty || done || redirecting) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isDirty, done, redirecting])

  const submit = (ch: "whatsapp" | "online") => {
    setValue("channel", ch)
    setServerError(null)
    if (shippingBlocked && shippingOption?.note) {
      setServerError(shippingOption.note)
      setFocus("cep")
      return
    }
    void handleSubmit(
      (values) => {
        startTransition(async () => {
          try {
            const result = await placeOrder({
              ...values,
              channel: ch,
              items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, tradeIn: i.tradeIn, installation: i.installation })),
            })
            if (!result.ok) {
              setServerError(result.error)
              for (const [key, message] of Object.entries(result.fieldErrors ?? {})) {
                if (key in values) setError(key as keyof CheckoutFormInput, { message })
              }
              return
            }
            if (result.next === "redirect") {
              setRedirecting(true)
              clear()
              window.location.assign(result.redirectUrl)
              return
            }
            clear()
            setDone(result)
            window.scrollTo({ top: 0, behavior: "smooth" })
            // Tenta abrir o WhatsApp direto; se o navegador bloquear, o botão grande está na tela.
            if (!result.notice) window.open(result.whatsappUrl, "_blank", "noopener,noreferrer")
          } catch {
            setServerError(copyErrors.network)
          }
        })
      },
      (errs) => {
        const first = Object.keys(errs)[0] as keyof CheckoutFormInput | undefined
        if (first) setFocus(first)
      },
    )()
  }

  if (done) return <OrderDone result={done} />

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground" role="status">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Carregando seu carrinho…
      </div>
    )
  }

  if (items.length === 0 && !redirecting) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand-soft-ink">
          <ShoppingBag className="size-8" aria-hidden />
        </span>
        <h2 className="text-2xl font-bold">{empty.cartTitle}</h2>
        <p className="text-muted-foreground">{empty.cartBody}</p>
        <Link href="/loja" className={buttonVariants({ size: "lg" })}>
          {cta.shop}
        </Link>
      </div>
    )
  }

  const busy = pending || redirecting

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit("online") }} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <Honeypot register={() => register("website")} />
      <div className="space-y-8">
        <fieldset className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 [&>legend+*]:clear-both">
          <legend className="float-left mb-2 w-full text-lg font-bold">1. Seus dados</legend>
          <Field id="nome" label="Nome completo" error={fieldErrors.name?.message}>
            {(a) => <Input {...a} autoComplete="name" {...register("name")} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="telefone" label="WhatsApp ou telefone" error={fieldErrors.phone?.message} hint="Usamos para confirmar o pedido e a entrega.">
              {(a) => (
                <Input
                  {...a}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(17) 99999-9999"
                  {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })}
                />
              )}
            </Field>
            <Field
              id="email"
              label="E-mail"
              optional={channel !== "online"}
              error={fieldErrors.email?.message}
              hint="Obrigatório para pagar online (enviamos o comprovante)."
            >
              {(a) => <Input {...a} type="email" inputMode="email" autoComplete="email" spellCheck={false} {...register("email")} />}
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6 [&>legend+*]:clear-both">
          <legend className="float-left mb-2 w-full text-lg font-bold">2. Entrega</legend>
          <div role="radiogroup" aria-label="Forma de entrega" className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: "delivery", title: "Receber em casa", text: "Mesmo dia em Rio Preto", icon: Truck },
                { value: "pickup", title: "Retirar na sede", text: "Grátis, pronta em até 2h", icon: Store },
              ] as const
            ).map((opt) => {
              const checked = deliveryMethod === opt.value
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40",
                    checked ? "border-brand bg-brand-soft" : "hover:border-brand-ink/30",
                  )}
                >
                  <input type="radio" value={opt.value} className="sr-only" {...register("deliveryMethod")} />
                  <opt.icon className={cn("mt-0.5 size-5 shrink-0", checked ? "text-brand-soft-ink" : "text-muted-foreground")} aria-hidden />
                  <span>
                    <span className={cn("block font-bold", checked && "text-brand-soft-ink")}>{opt.title}</span>
                    <span className="block text-sm text-muted-foreground">{opt.text}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {deliveryMethod === "pickup" ? (
            <p className="flex gap-3 rounded-xl bg-surface p-4 text-sm">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-ink" aria-hidden />
              <span>
                <strong className="block">Retire em: {fullAddress}</strong>
                {site.hours.label}. Avisamos pelo WhatsApp quando estiver separado. Para baterias, traga a bateria usada.
              </span>
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-6">
              <Field id="cep" label="CEP" error={fieldErrors.cep?.message} className="sm:col-span-2">
                {(a) => (
                  <Input
                    {...a}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    {...register("cep", { onChange: (e) => setValue("cep", maskCep(e.target.value)) })}
                  />
                )}
              </Field>
              <Field id="rua" label="Rua ou avenida" error={fieldErrors.street?.message} className="sm:col-span-4">
                {(a) => <Input {...a} autoComplete="address-line1" {...register("street")} />}
              </Field>
              <Field id="numero" label="Número" error={fieldErrors.number?.message} className="sm:col-span-2">
                {(a) => <Input {...a} autoComplete="off" placeholder="123 ou s/n" {...register("number")} />}
              </Field>
              <Field id="complemento" label="Complemento" optional className="sm:col-span-4">
                {(a) => <Input {...a} autoComplete="address-line2" placeholder="Apto, bloco, referência…" {...register("complement")} />}
              </Field>
              <Field id="bairro" label="Bairro" error={fieldErrors.district?.message} className="sm:col-span-3">
                {(a) => <Input {...a} autoComplete="address-level3" {...register("district")} />}
              </Field>
              <Field id="cidade" label="Cidade" className="sm:col-span-3">
                {(a) => <Input {...a} autoComplete="address-level2" {...register("city")} />}
              </Field>
              {quote && !quote.ok && <p className="text-sm text-destructive sm:col-span-6">{quote.error}</p>}
              {shippingOption && deliveryMethod === "delivery" && (
                <div
                  className={cn(
                    "rounded-xl p-4 text-sm sm:col-span-6",
                    shippingOption.available ? "bg-surface" : "bg-warning-soft text-warning-ink",
                  )}
                  aria-live="polite"
                >
                  <p className="flex justify-between gap-2 font-bold">
                    <span>{shippingOption.label}</span>
                    <span className="tabular">
                      {!shippingOption.available ? "Indisponível" : shippingOption.price === 0 ? "Grátis" : formatBRL(shippingOption.price)}
                    </span>
                  </p>
                  <p className={shippingOption.available ? "text-muted-foreground" : ""}>{shippingOption.eta}</p>
                  {shippingOption.note && <p className="mt-1 text-xs font-semibold">{shippingOption.note}</p>}
                </div>
              )}
            </div>
          )}
        </fieldset>

        <fieldset className="rounded-2xl border bg-card p-5 sm:p-6 [&>legend+*]:clear-both">
          <legend className="float-left mb-4 w-full text-lg font-bold">3. Observações</legend>
          <Field id="obs" label="Algo que devemos saber?" optional error={fieldErrors.notes?.message}>
            {(a) => <Textarea {...a} rows={3} placeholder="Melhor horário de entrega, ponto de referência, modelo do carro…" {...register("notes")} />}
          </Field>
        </fieldset>
      </div>

      {/* Resumo + pagamento */}
      <aside aria-labelledby="resumo" className="space-y-4 lg:sticky lg:top-28">
        <div className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
          <h2 id="resumo" className="text-lg font-bold">
            Resumo do pedido
          </h2>
          <ul className="mt-4 divide-y">
            {items.map((i) => (
              <li key={i.productId} className="flex gap-3 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-surface">
                  <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-2 font-semibold">{i.name}</p>
                  <p className="text-muted-foreground">
                    {i.quantity} × {formatBRL(unitPrice(i))}
                    {i.tradeIn === false && " (sem bateria usada)"}
                  </p>
                </div>
                <p className="tabular text-sm font-bold">{formatBRL(unitPrice(i) * i.quantity)}</p>
              </li>
            ))}
            {/* Mão de obra: itens separados, sem preço (orçados pelo técnico) */}
            {items
              .filter((i) => i.installation)
              .map((i) => (
                <li key={`${i.productId}-instalacao`} className="flex gap-3 py-3">
                  <span className="grid size-14 shrink-0 place-items-center rounded-lg border border-dashed bg-surface text-brand-ink">
                    <Wrench className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="line-clamp-2 font-semibold">Instalação: {i.name}</p>
                    <p className="text-muted-foreground">Mão de obra, item separado</p>
                  </div>
                  <p className="text-sm font-semibold">sob orçamento</p>
                </li>
              ))}
          </ul>
          <dl className="mt-2 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal das peças</dt>
              <dd className="tabular">{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Entrega</dt>
              <dd className="tabular">
                {!shippingOption
                  ? "Informe o CEP"
                  : !shippingOption.available
                    ? "Indisponível"
                    : shippingOption.price === 0
                      ? "Grátis"
                      : formatBRL(shippingOption.price)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t pt-3">
              <dt className="font-bold">Total das peças</dt>
              <dd className="tabular text-2xl font-bold">{formatBRL(total)}</dd>
            </div>
          </dl>
          {items.some((i) => i.installation) && (
            <p className="mt-3 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
              A instalação não entra neste total nem no pagamento online: o técnico confirma o valor da mão de obra antes do serviço.
            </p>
          )}
          <Link href="/loja" className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-brand-ink hover:underline">
            {cta.continueShopping}
          </Link>
        </div>

        {serverError && (
          <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <div className="space-y-3 rounded-2xl border bg-card p-5 sm:p-6">
          <Button
            type="submit"
            variant="cta"
            size="xl"
            className="w-full"
            disabled={busy && channel !== "online"}
            loading={busy && channel === "online"}
            loadingLabel={loading.redirectingPayment}
          >
            <CreditCard aria-hidden />
            {cta.payOnline}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            Pix, cartão em até 10x ou boleto, no ambiente seguro do Mercado Pago
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full"
            disabled={busy && channel !== "whatsapp"}
            loading={busy && channel === "whatsapp"}
            loadingLabel={loading.placingOrder}
            onClick={() => submit("whatsapp")}
          >
            <WhatsAppIcon className="size-5 text-whatsapp" />
            {cta.checkoutWhatsapp}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Confirmamos estoque e entrega por mensagem e você paga com Pix ou cartão.
          </p>
          <p className="border-t pt-3 text-center text-xs text-muted-foreground">
            Ao finalizar, você concorda com a nossa{" "}
            <Link href="/politicas" className="underline underline-offset-2">
              política de privacidade, trocas e entregas
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  )
}

function OrderDone({ result }: { result: Done }) {
  return (
    <div className="mx-auto max-w-xl space-y-6 py-10 text-center" role="status">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
        <CheckCircle2 className="size-9" aria-hidden />
      </span>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">Pedido {result.code} registrado</h2>
        <p className="text-lg text-muted-foreground">
          {result.notice ?? "Falta um passo: envie a mensagem no WhatsApp para confirmarmos estoque, entrega e pagamento."}
        </p>
      </div>
      <p className="tabular text-sm text-muted-foreground">Total: {formatBRL(result.total)}</p>
      <a
        href={result.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "cta", size: "xl", className: "w-full sm:w-auto" })}
      >
        <WhatsAppIcon className="size-5" />
        Enviar pedido no WhatsApp
      </a>
      <p className="text-sm text-muted-foreground">
        Atendimento {site.hours.label.toLowerCase()}. Guarde o código <strong>{result.code}</strong> para acompanhar.
      </p>
      <Link href="/loja" className={buttonVariants({ variant: "ghost" })}>
        {cta.continueShopping}
      </Link>
    </div>
  )
}
