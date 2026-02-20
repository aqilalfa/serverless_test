import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipe data untuk tabel finished_goods di Supabase
export type FinishedGood = {
  id: string
  name: string
  stock: number
  unit: string
  price: number
  last_restocked: string
  created_at?: string
}

// Tipe data untuk tabel raw_materials di Supabase
export type RawMaterial = {
  id: string
  name: string
  current: number
  unit: string
  reorder_level: number
  created_at?: string
}

export type ProductionOrder = {
  id: string
  product: string
  quantity: number
  status: string
  progress: number
  created_at?: string
}

export type Order = {
  id: string
  customer: string
  product: string
  quantity: number
  deadline: string
  notes: string
  created_at?: string
}

export type ProductCatalogItem = {
  id: string
  name: string
  price: number
  category: string
  image: string
  badge?: string
  created_at?: string
}
