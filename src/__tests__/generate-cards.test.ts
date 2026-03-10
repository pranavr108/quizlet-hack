import { describe, it, expect } from 'vitest'
import { parseGeneratedCards } from '@/lib/utils/generateCards'

describe('AI flashcard generator', () => {
  it('returns valid cards from structured Gemini response', () => {
    const geminiResponse = JSON.stringify([
      { front: 'What is ATP?', back: 'Adenosine triphosphate' },
      { front: 'What is DNA?', back: 'Deoxyribonucleic acid' },
    ])

    const result = parseGeneratedCards(geminiResponse)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.cards).toHaveLength(2)
      expect(result.cards[0].front).toBe('What is ATP?')
      expect(result.cards[0].back).toBe('Adenosine triphosphate')
      expect(result.cards[1].front).toBe('What is DNA?')
      expect(result.cards[1].back).toBe('Deoxyribonucleic acid')
    }
  })

  it('rejects malformed Gemini response with missing back field', () => {
    const geminiResponse = JSON.stringify([
      { front: 'What is ATP?' },
    ])

    const result = parseGeneratedCards(geminiResponse)

    expect(result.success).toBe(false)
  })

  it('rejects non-JSON Gemini response', () => {
    const result = parseGeneratedCards('Here are some flashcards for you!')

    expect(result.success).toBe(false)
  })

  it('rejects response with empty front text', () => {
    const geminiResponse = JSON.stringify([
      { front: '', back: 'Adenosine triphosphate' },
    ])

    const result = parseGeneratedCards(geminiResponse)

    expect(result.success).toBe(false)
  })
})
