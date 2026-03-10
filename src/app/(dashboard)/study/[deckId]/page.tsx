'use client'

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

  useEffect(() => {
    getCardsByDeck(supabase, deckId).then(data => {
      setCards(data)
      setLoading(false)
    })
  }, [deckId])

  if (loading) return <p>Loading...</p>
  if (!cards || cards.length === 0) return <p>No cards to study.</p>

  return (
    <div>
      <a href={`/decks/${deckId}`}>← Back to deck</a>
      <h2>Study Session</h2>
      <StudyView cards={cards} now={new Date()} />
    </div>
  )
}
