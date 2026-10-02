import { z } from "zod"

import { onlyDigits } from "@/lib/format"

const name = z
  .string()
  .trim()
  .min(3, "Digite seu nome completo.")
  .max(120, "Use no máximo 120 caracteres.")

const phone = z
  .string()
  .trim()
  .refine((v) => {
    const d = onlyDigits(v)
    return d.length === 10 || d.length === 11
  }, "Digite o telefone com DDD, por exemplo (17) 99652-3680.")

const optionalEmail = z
  .string()
  .trim()
  .max(160)
  .refine((v) => v === "" || z.email().safeParse(v).success, "Confira o e-mail: falta o @ ou o domínio.")
  .optional()
  .transform((v) => (v ? v : undefined))

const consent = z.boolean().refine((v) => v, "Marque a autorização para podermos responder você.")

// Campo invisível: robôs preenchem, pessoas não.
const honeypot = z.string().max(0).optional()

export const leadSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  service: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10, "Conte um pouco mais: o que aconteceu e onde?").max(1500, "Use no máximo 1.500 caracteres."),
  consent,
  pagePath: z.string().max(200).optional(),
  website: honeypot,
})
export type LeadInput = z.input<typeof leadSchema>

const requiredEmail = z
  .string()
  .trim()
  .min(1, "Digite seu e-mail.")
  .max(160)
  .refine((v) => z.email().safeParse(v).success, "Confira o e-mail: falta o @ ou o domínio.")

/** Leva e Traz: o que é transportado (decisão do cliente, v3). Preço a combinar. */
export const levaETrazTypes = ["Pessoas", "Encomenda pequena", "Transporte executivo"] as const

export const levaETrazSchema = z.object({
  type: z.enum(levaETrazTypes, { error: "Escolha o tipo de transporte." }),
  origin: z.string().trim().min(5, "Informe o endereço ou bairro de origem.").max(200, "Use no máximo 200 caracteres."),
  destination: z
    .string()
    .trim()
    .min(5, "Informe o endereço, bairro ou cidade de destino.")
    .max(200, "Use no máximo 200 caracteres."),
  phone,
  email: requiredEmail,
  preferences: z.string().trim().max(600, "Use no máximo 600 caracteres.").optional(),
  consent,
  website: honeypot,
})
export type LevaETrazInput = z.input<typeof levaETrazSchema>
/** Campos de cada etapa do formulário (validação por etapa) */
export const levaETrazSteps = [
  ["type", "origin", "destination"],
  ["phone", "email", "preferences", "consent"],
] as const

/** Serviço particular: pedido sob medida (formulário curto) */
export const bestTimeOptions = ["Manhã (7h às 12h)", "Tarde (12h às 18h)", "Noite (18h às 21h)"] as const

export const privateServiceSchema = z.object({
  need: z
    .string()
    .trim()
    .min(10, "Descreva o serviço: o que precisa ser feito e em qual cômodo ou local.")
    .max(1500, "Use no máximo 1.500 caracteres."),
  address: z.string().trim().min(5, "Informe o endereço do serviço: rua, número e bairro.").max(200, "Use no máximo 200 caracteres."),
  phone,
  bestTime: z.enum(bestTimeOptions, { error: "Escolha o melhor horário para a visita." }),
  consent,
  website: honeypot,
})
export type PrivateServiceInput = z.input<typeof privateServiceSchema>

export const specialtyOptions = [
  "Eletricista",
  "Encanador",
  "Limpeza de placas solares",
  "Pedreiro e reparos gerais",
  "Pintor",
  "Ar-condicionado",
  "Serralheiro",
  "Vidraceiro",
  "Chaveiro",
] as const

export const providerSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  city: z.string().trim().min(2, "Digite a cidade onde você trabalha.").max(80),
  specialties: z.array(z.enum(specialtyOptions)).min(1, "Escolha pelo menos uma especialidade."),
  experienceYears: z
    .union([z.string(), z.number()])
    .transform((v) => String(v).trim())
    .refine((v) => v !== "", "Digite quantos anos de experiência você tem.")
    .refine((v) => /^\d{1,2}$/.test(v), "Use só números, por exemplo 5.")
    .transform(Number),
  experienceNotes: z.string().trim().max(1000, "Use no máximo 1.000 caracteres.").optional(),
  hasCnpjMei: z.boolean(),
  consent,
  website: honeypot,
})
export type ProviderInput = z.input<typeof providerSchema>

const checkoutFields = z.object({
  channel: z.enum(["whatsapp", "online"]),
  name,
  phone,
  email: optionalEmail,
  deliveryMethod: z.enum(["delivery", "pickup"]),
  cep: z.string().trim().optional(),
  street: z.string().trim().max(160).optional(),
  number: z.string().trim().max(20).optional(),
  complement: z.string().trim().max(80).optional(),
  district: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional(),
  website: honeypot,
})

type CheckoutFields = z.output<typeof checkoutFields>

function checkoutRules(data: CheckoutFields, ctx: z.RefinementCtx) {
  if (data.channel === "online" && !data.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Para pagar online, precisamos do e-mail para enviar o comprovante." })
  }
  if (data.deliveryMethod === "delivery") {
    if (onlyDigits(data.cep ?? "").length !== 8) {
      ctx.addIssue({ code: "custom", path: ["cep"], message: "Digite os 8 números do CEP." })
    }
    if (!data.street || data.street.length < 3) {
      ctx.addIssue({ code: "custom", path: ["street"], message: "Digite a rua ou avenida." })
    }
    if (!data.number) {
      ctx.addIssue({ code: "custom", path: ["number"], message: "Digite o número (ou “s/n”)." })
    }
    if (!data.district) {
      ctx.addIssue({ code: "custom", path: ["district"], message: "Digite o bairro." })
    }
  }
}

/** Validação do formulário no navegador (sem os itens, que vêm do carrinho) */
export const checkoutFormSchema = checkoutFields.superRefine(checkoutRules)
export type CheckoutFormInput = z.input<typeof checkoutFormSchema>

/** Validação completa no servidor */
export const checkoutSchema = checkoutFields
  .extend({
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().min(1).max(50),
          tradeIn: z.boolean().nullable(),
          /** mão de obra de instalação (item separado, sob orçamento) */
          installation: z.boolean().optional(),
        }),
      )
      .min(1, "Seu carrinho está vazio."),
  })
  .superRefine(checkoutRules)
export type CheckoutInput = z.input<typeof checkoutSchema>
