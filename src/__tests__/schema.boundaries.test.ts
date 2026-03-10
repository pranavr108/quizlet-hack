import { describe, it, expect } from 'vitest'
import { CardSchema, DeckSchema } from '@/lib/schemas'

const validCard = () => ({
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  deckId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  front: 'What is the mitochondria?',
  back: 'The powerhouse of the cell',
  interval: 1,
  easeFactor: 2.5,
  nextReviewAt: new Date('2026-03-08'),
  createdAt: new Date('2026-03-07'),
})

const validDeck = () => ({
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  name: 'Biochemistry',
  description: 'Krebs cycle and friends',
  createdAt: new Date('2026-03-07'),
})

describe('CardSchema boundary behavior', () => {
  it('rejects when front is a number instead of string', () => {
    const result = CardSchema.safeParse({ ...validCard(), front: 42 })
    expect(result.success).toBe(false)
  })

  it('rejects when back is a number instead of string', () => {
    const result = CardSchema.safeParse({ ...validCard(), back: 42 })
    expect(result.success).toBe(false)
  })

  it('rejects when interval is a string instead of number', () => {
    const result = CardSchema.safeParse({ ...validCard(), interval: '5' })
    expect(result.success).toBe(false)
  })

  it('rejects when nextReviewAt is a plain string instead of Date', () => {
    const result = CardSchema.safeParse({ ...validCard(), nextReviewAt: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('rejects a completely empty object', () => {
    const result = CardSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects null', () => {
    const result = CardSchema.safeParse(null)
    expect(result.success).toBe(false)
  })

  it('rejects undefined', () => {
    const result = CardSchema.safeParse(undefined)
    expect(result.success).toBe(false)
  })

  it('strips unknown fields', () => {
    const result = CardSchema.safeParse({ ...validCard(), unknownField: 'hello' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect('unknownField' in result.data).toBe(false)
    }
  })
})

describe('DeckSchema boundary behavior', () => {
  it('rejects when name is a number instead of string', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), name: 123 })
    expect(result.success).toBe(false)
  })

  it('rejects when createdAt is a plain string instead of Date', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), createdAt: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('rejects a completely empty object', () => {
    const result = DeckSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects null', () => {
    const result = DeckSchema.safeParse(null)
    expect(result.success).toBe(false)
  })

  it('strips unknown fields', () => {
    const result = DeckSchema.safeParse({ ...validDeck(), unknownField: 'hello' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect('unknownField' in result.data).toBe(false)
    }
  })
})
