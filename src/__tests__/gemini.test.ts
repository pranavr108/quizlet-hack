import { describe, it, expect, vi } from 'vitest'
import { generateFlashcards } from '@/lib/utils/gemini'

const mockModel = (responseText: string) => ({
  generateContent: vi.fn().mockResolvedValue({
    response: { text: () => responseText },
  }),
})

describe('Gemini API client', () => {
  it('returns validated cards from text input', async () => {
    const model = mockModel(JSON.stringify([
      { front: 'What is ATP?', back: 'Adenosine triphosphate' },
    ]))

    const result = await generateFlashcards({
      text: 'ATP is adenosine triphosphate.',
      model,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.cards).toHaveLength(1)
      expect(result.cards[0].front).toBe('What is ATP?')
    }
    expect(model.generateContent).toHaveBeenCalledOnce()
  })

  it('returns failure when Gemini returns invalid card data', async () => {
    const model = mockModel('not valid json at all')

    const result = await generateFlashcards({
      text: 'Some text',
      model,
    })

    expect(result.success).toBe(false)
  })

  it('returns failure when API call throws', async () => {
    const model = {
      generateContent: vi.fn().mockRejectedValue(new Error('API error')),
    }

    const result = await generateFlashcards({
      text: 'Some text',
      model,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('API error')
    }
  })
})
