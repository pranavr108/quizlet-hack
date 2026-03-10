'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/db/client'
import { createCard } from '@/lib/db/cards'
import { generateFlashcards } from '@/lib/utils/gemini'
import { GenerateView } from '@/components/GenerateView'

type GeneratedCard = { front: string; back: string }

export default function GeneratePage() {
  const { deckId } = useParams<{ deckId: string }>()
  const [cards, setCards] = useState<ReadonlyArray<GeneratedCard>>()
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const handleGenerate = async (text: string) => {
    setError(undefined)
    setCards(undefined)

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      setError('NEXT_PUBLIC_GEMINI_API_KEY is not set')
      return
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await generateFlashcards({ text, model })

    if (result.success) {
      setCards(result.cards)
    } else {
      setError(result.error)
    }
  }

  const handleSave = async () => {
    if (!cards) return
    setSaving(true)
    for (const card of cards) {
      await createCard(supabase, { deck_id: deckId, front: card.front, back: card.back })
    }
    window.location.href = `/decks/${deckId}`
  }

  return (
    <div>
      <a href={`/decks/${deckId}`}>← Back to deck</a>
      <h2>Generate Flashcards</h2>
      <GenerateView onGenerate={handleGenerate} cards={cards} error={error} />
      {cards && cards.length > 0 && (
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : `Save ${cards.length} cards to deck`}
        </button>
      )}
    </div>
  )
}
