import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type CreateDeckInput = {
  name: string
  description?: string
}

export const createDeck = async (
  client: SupabaseClient<Database>,
  input: CreateDeckInput,
) => {
  const { data, error } = await client
    .from('decks')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getDecks = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('decks').select()

  if (error) throw error
  return data
}

export const deleteDeck = async (client: SupabaseClient<Database>, id: string) => {
  const { error } = await client.from('decks').delete().eq('id', id)

  if (error) throw error
}
