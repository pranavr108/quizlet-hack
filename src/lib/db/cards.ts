import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type CreateCardInput = {
  deck_id: string
  front: string
  back: string
}

export const createCard = async (
  client: SupabaseClient<Database>,
  input: CreateCardInput,
) => {
  const { data, error } = await client
    .from('cards')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

type UpdateCardInput = {
  front?: string
  back?: string
}

export const updateCard = async (
  client: SupabaseClient<Database>,
  id: string,
  input: UpdateCardInput,
) => {
  const { data, error } = await client
    .from('cards')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteCard = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from('cards').delete().eq('id', id)

  if (error) throw error
}

export const getCardsByDeck = async (
  client: SupabaseClient<Database>,
  deckId: string,
) => {
  const { data, error } = await client
    .from('cards')
    .select()
    .eq('deck_id', deckId)

  if (error) throw error
  return data
}
