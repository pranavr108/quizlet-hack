import { describe, it, expect, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/db/database.types'
import { createDeck } from '@/lib/db/decks'
import { createCard, updateCard, deleteCard, getCardsByDeck } from '@/lib/db/cards'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const adminClient = () => createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY)

describe('Card CRUD', () => {
  beforeEach(async () => {
    const client = adminClient()
    await client.from('cards').delete().gte('created_at', '1970-01-01')
    await client.from('decks').delete().gte('created_at', '1970-01-01')
  })

  it('user can add a card with front and back text', async () => {
    const client = adminClient()
    const deck = await createDeck(client, { name: 'Biochemistry' })

    const card = await createCard(client, {
      deck_id: deck.id,
      front: 'What is ATP?',
      back: 'Adenosine triphosphate',
    })

    expect(card.front).toBe('What is ATP?')
    expect(card.back).toBe('Adenosine triphosphate')
    expect(card.deck_id).toBe(deck.id)
    expect(card.id).toBeDefined()
    expect(card.interval).toBe(1)
    expect(card.ease_factor).toBe(2.5)
  })

  it('user can edit an existing card', async () => {
    const client = adminClient()
    const deck = await createDeck(client, { name: 'Biochemistry' })
    const card = await createCard(client, {
      deck_id: deck.id,
      front: 'What is ATP?',
      back: 'Adenosine triphosphate',
    })

    const updated = await updateCard(client, card.id, {
      front: 'What is ADP?',
      back: 'Adenosine diphosphate',
    })

    expect(updated.front).toBe('What is ADP?')
    expect(updated.back).toBe('Adenosine diphosphate')
    expect(updated.id).toBe(card.id)
  })

  it('user can delete a card', async () => {
    const client = adminClient()
    const deck = await createDeck(client, { name: 'Biochemistry' })
    const card = await createCard(client, {
      deck_id: deck.id,
      front: 'What is ATP?',
      back: 'Adenosine triphosphate',
    })

    await deleteCard(client, card.id)

    const cards = await getCardsByDeck(client, deck.id)
    expect(cards).toHaveLength(0)
  })
})
