import { describe, it, expect } from 'vitest'
import { CardSchema } from '@/lib/schemas/card.schema'

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

describe('CardSchema', () => {
  it('accepts a valid card', () => {
    const result = CardSchema.safeParse(validCard())
    expect(result.success).toBe(true)
  })

  it('rejects a card with empty front text', () => {
    const result = CardSchema.safeParse({ ...validCard(), front: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a card with empty back text', () => {
    const result = CardSchema.safeParse({ ...validCard(), back: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a card with invalid uuid for id', () => {
    const result = CardSchema.safeParse({ ...validCard(), id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects a card with invalid uuid for deckId', () => {
    const result = CardSchema.safeParse({ ...validCard(), deckId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('applies default interval of 1 when omitted', () => {
    const { interval, ...cardWithoutInterval } = validCard()
    const result = CardSchema.safeParse(cardWithoutInterval)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.interval).toBe(1)
    }
  })

  it('applies default easeFactor of 2.5 when omitted', () => {
    const { easeFactor, ...cardWithoutEase } = validCard()
    const result = CardSchema.safeParse(cardWithoutEase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.easeFactor).toBe(2.5)
    }
  })
})
