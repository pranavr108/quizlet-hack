'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/db/client'
import { getCardsByDeck, createCard, deleteCard } from '@/lib/db/cards'
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
  const [error, setError] = useState<string>()

  const loadCards = () => {
    getCardsByDeck(supabase, deckId)
      .then(data => {
        setCards(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load cards')
        setLoading(false)
      })
  }

  useEffect(() => { loadCards() }, [deckId])

  const handleAddCard = async (data: { front: string; back: string }) => {
    await createCard(supabase, { deck_id: deckId, ...data })
    loadCards()
  }

  const handleDeleteCard = async (id: string) => {
    await deleteCard(supabase, id)
    loadCards()
  }

  if (loading) return <p className="status-loading">Loading cards…</p>
  if (error) return <p role="alert" className="form-error">{error}</p>

  return (
    <div>
      <div className="page-actions">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <a href="/decks" className="btn btn-ghost">← Decks</a>
          <h2>Cards</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href={`/study/${deckId}`} className="btn btn-secondary">Study</a>
          <a href={`/decks/${deckId}/generate`} className="btn btn-primary">Generate with AI</a>
        </div>
      </div>

      <hr className="section-rule" />

      <h3>Add a Card</h3>
      <CreateCardForm onSubmit={handleAddCard} />

      <h3>{cards.length} {cards.length === 1 ? 'Card' : 'Cards'}</h3>
      <CardList cards={cards} onDelete={handleDeleteCard} />
    </div>
  )
}
