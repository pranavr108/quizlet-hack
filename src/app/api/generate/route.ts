import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateFlashcards } from '@/lib/utils/gemini'

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'Server misconfigured: missing API key' },
      { status: 500 },
    )
  }

  const body = await request.json()
  const text = body?.text

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Text is required' },
      { status: 400 },
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await generateFlashcards({ text, model })

  if (result.success) {
    return NextResponse.json({ success: true, cards: result.cards })
  }

  return NextResponse.json(
    { success: false, error: result.error },
    { status: 502 },
  )
}
