// Tipos do banco no formato gerado por `supabase gen types typescript`.
// Mantidos à mão para refletir supabase/schema.sql. Se o schema mudar, regenere.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
export type OrderChannel = "whatsapp" | "online"
export type DeliveryMethod = "delivery" | "pickup"
export type LeadStatus = "new" | "contacted" | "converted" | "discarded"
export type ProviderStatus = "pending" | "approved" | "rejected"

type Table<Row, Required extends keyof Row> = {
  Row: Row
  Insert: Partial<Row> & Pick<Row, Required>
  Update: Partial<Row>
  Relationships: []
}

export type CategoryRow = {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  sort_order: number
  created_at: string
}

export type ProductRow = {
  id: string
  slug: string
  sku: string
  name: string
  brand: string
  category_id: string
  short_description: string
  description: string
  price: number
  compare_at_price: number | null
  stock: number
  images: string[]
  specs: Json
  weight_kg: number
  amperage_ah: number | null
  voltage_v: number | null
  warranty_months: number | null
  trade_in_required: boolean
  trade_in_surcharge: number | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type OrderRow = {
  id: string
  code: string
  status: OrderStatus
  channel: OrderChannel
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_method: DeliveryMethod
  cep: string | null
  address: Json | null
  shipping_label: string | null
  subtotal: number
  shipping_cost: number
  total: number
  payment_provider: string | null
  payment_id: string | null
  payment_status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string | null
  sku: string
  product_name: string
  unit_price: number
  quantity: number
  line_total: number
}

export type LeadRow = {
  id: string
  source: string
  name: string
  phone: string
  email: string | null
  service: string | null
  message: string | null
  page_path: string | null
  consent: boolean
  status: LeadStatus
  created_at: string
}

export type ProviderRow = {
  id: string
  name: string
  phone: string
  email: string | null
  city: string
  specialties: string[]
  experience_years: number
  experience_notes: string | null
  has_cnpj_mei: boolean
  consent: boolean
  status: ProviderStatus
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      categories: Table<CategoryRow, "slug" | "name">
      products: Table<
        ProductRow,
        "slug" | "sku" | "name" | "brand" | "category_id" | "short_description" | "description" | "price"
      >
      orders: Table<
        OrderRow,
        "code" | "channel" | "customer_name" | "customer_phone" | "delivery_method" | "subtotal" | "total"
      >
      order_items: Table<OrderItemRow, "order_id" | "sku" | "product_name" | "unit_price" | "quantity">
      leads: Table<LeadRow, "source" | "name" | "phone">
      providers: Table<
        ProviderRow,
        "name" | "phone" | "city" | "specialties" | "experience_years"
      >
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      order_status: OrderStatus
      order_channel: OrderChannel
      delivery_method: DeliveryMethod
      lead_status: LeadStatus
      provider_status: ProviderStatus
    }
    CompositeTypes: { [_ in never]: never }
  }
}
