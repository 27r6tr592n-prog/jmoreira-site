import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "./types"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isCatalogFromSupabase = Boolean(url && anonKey)
export const canWriteToSupabase = Boolean(url && serviceKey)

let publicClient: SupabaseClient<Database> | null = null
let adminClient: SupabaseClient<Database> | null = null

/** Cliente com a chave anon: só lê o que o RLS libera (catálogo). */
export function getPublicClient() {
  if (!url || !anonKey) return null
  publicClient ??= createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  })
  return publicClient
}

/** Cliente com a service_role: grava pedidos, leads e prestadores. Só no servidor. */
export function getAdminClient() {
  if (!url || !serviceKey) return null
  adminClient ??= createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return adminClient
}
