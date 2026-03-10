import { describe, it, expect } from 'vitest'
import { DeckSchema } from '@/lib/schemas/deck.schema'

const validDeck = () => ({
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  name: 'Biochemistry',
  description: 'Krebs cycle and friends',
  createdAt: new Date('2026-03-07'),
})

describe('DeckSchema', () => {
  it('accepts a valid deck', () => {
    const result = DeckSchema.safeParse(validDeck())
    expect(result.success).toBe(true)
  })

  it('rejects a deck with empty name', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a deck with invalid uuid for id', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects a deck with invalid uuid for userId', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), userId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('accepts a deck without description', () => {
    const { description, ...deckWithoutDesc } = validDeck()
    const result = DeckSchema.safeParse(deckWithoutDesc)
    expect(result.success).toBe(true)
  })
})
