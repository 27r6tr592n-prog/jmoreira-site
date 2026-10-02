"use server"

import { errors } from "@/lib/copy"
import { maskPhone } from "@/lib/format"
import { getAdminClient } from "@/lib/supabase/server"
import { leadSchema, providerSchema, type LeadInput, type ProviderInput } from "@/lib/validation"

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
