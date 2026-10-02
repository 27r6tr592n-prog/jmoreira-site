"use server"

import { errors } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { getAdminClient } from "@/lib/supabase/server"
import {
  leadSchema,
  levaETrazSchema,
  privateServiceSchema,
  providerSchema,
  type LeadInput,
  type LevaETrazInput,
  type PrivateServiceInput,
  type ProviderInput,
} from "@/lib/validation"

export type FormResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> }

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {}
  for (const i of issues) out[i.path.map(String).join(".")] ??= i.message
  return out
}

/** Formulários de contato e orçamento → tabela leads */
export async function submitLead(input: LeadInput & { source: string }): Promise<FormResult> {
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const d = parsed.data
  if (d.website) return { ok: true } // robô: finge sucesso e descarta

  const row = {
    source: input.source.slice(0, 40),
    name: d.name,
    phone: maskPhone(d.phone),
    email: d.email ?? null,
    service: d.service || null,
    message: d.message,
    page_path: d.pagePath ?? null,
    consent: d.consent,
  }

  const supabase = getAdminClient()
  if (!supabase) {
    console.info("[lead:mock]", row.source, row.name, row.phone, row.service ?? "")
    return { ok: true }
  }
  const { error } = await supabase.from("leads").insert(row)
  if (error) {
    console.error("[lead] erro ao gravar:", error.message)
    return { ok: false, error: errors.generic }
  }
  return { ok: true }
}

/** Cadastro de prestador → tabela providers (e um lead, para o comercial ver na mesma fila) */
export async function submitProvider(input: ProviderInput): Promise<FormResult> {
  const parsed = providerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const d = parsed.data
  if (d.website) return { ok: true }

  const row = {
    name: d.name,
    phone: maskPhone(d.phone),
    email: d.email ?? null,
    city: d.city,
    specialties: d.specialties,
    experience_years: d.experienceYears,
    experience_notes: d.experienceNotes || null,
    has_cnpj_mei: d.hasCnpjMei,
    consent: d.consent,
  }

  const supabase = getAdminClient()
  if (!supabase) {
    console.info("[prestador:mock]", row.name, row.phone, row.city, row.specialties.join("/"))
    return { ok: true }
  }
  const { error } = await supabase.from("providers").insert(row)
  if (error) {
    console.error("[prestador] erro ao gravar:", error.message)
    return { ok: false, error: errors.generic }
  }
  await supabase.from("leads").insert({
    source: "seja-prestador",
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.specialties.join(", "),
    message: `Cadastro de prestador: ${row.city}, ${row.experience_years} anos de experiência.`,
    page_path: "/seja-prestador",
    consent: row.consent,
  })
  return { ok: true }
}

type LeadRowInput = {
  source: string
  name: string | null
  phone: string
  email: string | null
  service: string | null
  message: string
  page_path: string | null
  consent: boolean
}

/** Mesmo caminho dos demais formulários: tabela leads (ou log, sem Supabase). */
async function saveLead(row: LeadRowInput): Promise<FormResult> {
  const supabase = getAdminClient()
  if (!supabase) {
    console.info(`[${row.source}:mock]`, row.phone, row.service ?? "", row.message.replace(/\n/g, " | "))
    return { ok: true }
  }
  const { error } = await supabase.from("leads").insert(row)
  if (error) {
    console.error(`[${row.source}] erro ao gravar:`, error.message)
    return { ok: false, error: errors.generic }
  }
  return { ok: true }
}

/** Leva e Traz → tabela leads (source "leva-e-traz"). Preço a combinar: nenhum valor é calculado. */
export async function submitLevaETraz(input: LevaETrazInput): Promise<FormResult> {
  const parsed = levaETrazSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const d = parsed.data
  if (d.website) return { ok: true }
  return saveLead({
    source: "leva-e-traz",
    name: null,
    phone: maskPhone(d.phone),
    email: d.email,
    service: `Leva e Traz: ${d.type}`,
    message: [`Origem: ${d.origin}`, `Destino: ${d.destination}`, d.preferences ? `Preferências: ${d.preferences}` : null]
      .filter(Boolean)
      .join("\n"),
    page_path: "/leva-e-traz",
    consent: d.consent,
  })
}

/** Serviço particular (pedido sob medida) → tabela leads (source "servico-particular"). */
export async function submitPrivateService(input: PrivateServiceInput): Promise<FormResult> {
  const parsed = privateServiceSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const d = parsed.data
  if (d.website) return { ok: true }
  return saveLead({
    source: "servico-particular",
    name: null,
    phone: maskPhone(d.phone),
    email: null,
    service: "Serviço particular",
    message: [`O que precisa: ${d.need}`, `Endereço: ${d.address}`, `Melhor horário: ${d.bestTime}`].join("\n"),
    page_path: "/servico-particular",
    consent: d.consent,
  })
}
