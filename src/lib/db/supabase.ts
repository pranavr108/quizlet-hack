import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type SupabaseClientOptions = {
  url: string
  anonKey: string
}

export const createSupabaseClient = ({ url, anonKey }: SupabaseClientOptions) =>
  createClient<Database>(url, anonKey)
