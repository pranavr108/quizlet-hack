import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify([
              { front: 'What is ATP?', back: 'Adenosine triphosphate' },
            ]),
          },
        }),
      }
    }
  },
}))

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key')
  })

  it('returns generated cards from text input', async () => {
    const { POST } = await import('@/app/api/generate/route')

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ATP is adenosine triphosphate.' }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.cards).toHaveLength(1)
    expect(body.cards[0].front).toBe('What is ATP?')
  })

  it('returns 400 when text is missing', async () => {
    const { POST } = await import('@/app/api/generate/route')

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('returns 500 when GEMINI_API_KEY is not set', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')

    const { POST } = await import('@/app/api/generate/route')

    const request = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Some text' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})
