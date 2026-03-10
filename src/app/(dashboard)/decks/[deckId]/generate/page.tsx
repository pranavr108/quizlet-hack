'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/db/client'
import { createCard } from '@/lib/db/cards'
import { GenerateView } from '@/components/GenerateView'

type GeneratedCard = { front: string; back: string }

export default function GeneratePage() {
  const { deckId } = useParams<{ deckId: string }>()
  const [cards, setCards] = useState<ReadonlyArray<GeneratedCard>>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string>()
  const [saving, setSaving] = useState(false)

  const handleGenerate = async (text: string) => {
    setError(undefined)
    setCards(undefined)
    setToast(undefined)
    setLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const result = await response.json()

      if (result.success) {
        setCards(result.cards)
        setToast(`Successfully generated ${result.cards.length} card${result.cards.length === 1 ? '' : 's'}`)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
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
      <GenerateView
        onGenerate={handleGenerate}
        cards={cards}
        error={error}
        loading={loading}
        toast={toast}
      />
      {cards && cards.length > 0 && (
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : `Save ${cards.length} cards to deck`}
        </button>
      )}
    </div>
  )
}
