import { describe, it, expect } from 'vitest'
import { CardSchema, DeckSchema } from '@/lib/schemas'

describe('schemas barrel export', () => {
  it('exports CardSchema', () => {
    expect(CardSchema).toBeDefined()
    expect(CardSchema.safeParse).toBeTypeOf('function')
  })

  it('exports DeckSchema', () => {
    expect(DeckSchema).toBeDefined()
    expect(DeckSchema.safeParse).toBeTypeOf('function')
  })
})
