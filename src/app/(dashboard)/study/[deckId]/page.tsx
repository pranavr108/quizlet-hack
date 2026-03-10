'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/db/client'
import { getCardsByDeck } from '@/lib/db/cards'
import { StudyView } from '@/components/StudyView'

type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  interval: number
  ease_factor: number
  next_review_at: string
  created_at: string
}

export default function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const [cards, setCards] = useState<ReadonlyArray<Card>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    getCardsByDeck(supabase, deckId)
      .then(data => {
        setCards(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load cards')
        setLoading(false)
      })
  }, [deckId])

  if (loading) return <p className="status-loading">Loading study session…</p>
  if (error) return <p role="alert" className="form-error">{error}</p>
  if (!cards || cards.length === 0) {
    return (
      <div className="empty-state">
        <p>No cards to study yet.</p>
        <a href={`/decks/${deckId}`} className="btn btn-primary">Add Cards</a>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <a href={`/decks/${deckId}`} className="btn btn-ghost">← Back to Deck</a>
      </div>
      <div className="page-title-block">
        <h2>Study Session</h2>
      </div>
      <StudyView cards={cards} now={new Date()} />
    </div>
  )
}
