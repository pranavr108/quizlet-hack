import { describe, it, expect, vi } from 'vitest'
import { generateFlashcards } from '@/lib/utils/gemini'

const validResponse = JSON.stringify([
  { front: 'What is the key finding?', back: 'The key finding is X' },
])

const createCapturingModel = () => {
  const calls: Array<string> = []
  return {
    model: {
      generateContent: vi.fn(async (prompt: string) => {
        calls.push(prompt)
        return { response: { text: () => validResponse } }
      }),
    },
    calls,
  }
}

describe('generateFlashcards academic mode', () => {
  it('uses an academic-paper-aware prompt when mode is academic', async () => {
    const { model, calls } = createCapturingModel()

    await generateFlashcards({ text: 'Some paper text', model, mode: 'academic' })

    const prompt = calls[0]
    expect(prompt).toMatch(/key (takeaway|finding)/i)
    expect(prompt).toMatch(/method/i)
    expect(prompt).toMatch(/technique/i)
  })

  it('includes the source text in the academic prompt', async () => {
    const { model, calls } = createCapturingModel()

    await generateFlashcards({ text: 'Neural networks improve prediction accuracy', model, mode: 'academic' })

    expect(calls[0]).toContain('Neural networks improve prediction accuracy')
  })

  it('uses the general prompt when mode is not specified', async () => {
    const { model, calls } = createCapturingModel()

    await generateFlashcards({ text: 'General notes', model })

    const prompt = calls[0]
    expect(prompt).not.toMatch(/key (takeaway|finding)/i)
  })
})
