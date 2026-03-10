'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/db/client'
import { getCardsByDeck, createCard } from '@/lib/db/cards'
import { CardList } from '@/components/CardList'
import { CreateCardForm } from '@/components/CreateCardForm'

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

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const [cards, setCards] = useState<ReadonlyArray<Card>>([])
  const [loading, setLoading] = useState(true)

  const loadCards = () => {
    getCardsByDeck(supabase, deckId).then(data => {
      setCards(data)
      setLoading(false)
    })
  }

  useEffect(() => { loadCards() }, [deckId])

  const handleAddCard = async (data: { front: string; back: string }) => {
    await createCard(supabase, { deck_id: deckId, ...data })
    loadCards()
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a href="/decks">← Back</a>
        <h2>Cards</h2>
        <a href={`/decks/${deckId}/generate`}>Generate Cards</a>
        <a href={`/study/${deckId}`}>Study</a>
      </div>
      <h3>Add Card</h3>
      <CreateCardForm onSubmit={handleAddCard} />
      <CardList cards={cards} />
    </div>
  )
}
