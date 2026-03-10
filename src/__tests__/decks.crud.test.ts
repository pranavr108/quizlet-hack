import { describe, it, expect, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/db/database.types'
import { createDeck, getDecks, deleteDeck } from '@/lib/db/decks'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const adminClient = () => createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY)

describe('Deck CRUD', () => {
  beforeEach(async () => {
    const client = adminClient()
    await client.from('cards').delete().gte('created_at', '1970-01-01')
    await client.from('decks').delete().gte('created_at', '1970-01-01')
  })

  it('user can create a deck named Biochemistry', async () => {
    const client = adminClient()
    const deck = await createDeck(client, { name: 'Biochemistry' })

    expect(deck.name).toBe('Biochemistry')
    expect(deck.id).toBeDefined()
  })

  it('user sees their decks listed', async () => {
    const client = adminClient()
    await createDeck(client, { name: 'Biochemistry' })
    await createDeck(client, { name: 'Neuroscience' })

    const decks = await getDecks(client)

    const names = decks.map(d => d.name)
    expect(names).toContain('Biochemistry')
    expect(names).toContain('Neuroscience')
    expect(decks).toHaveLength(2)
  })

  it('user can delete a deck', async () => {
    const client = adminClient()
    const deck = await createDeck(client, { name: 'To Be Deleted' })

    await deleteDeck(client, deck.id)

    const decks = await getDecks(client)
    const names = decks.map(d => d.name)
    expect(names).not.toContain('To Be Deleted')
  })
})
