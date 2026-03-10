'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db/client'
import { getDecks, deleteDeck } from '@/lib/db/decks'
import { DeckList } from '@/components/DeckList'

type Deck = {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
}

export default function DecksPage() {
  const [decks, setDecks] = useState<ReadonlyArray<Deck>>([])
  const [loading, setLoading] = useState(true)

  const loadDecks = async () => {
    const data = await getDecks(supabase)
    setDecks(data)
    setLoading(false)
  }

  useEffect(() => { loadDecks() }, [])

  const handleDelete = async (id: string) => {
    await deleteDeck(supabase, id)
    loadDecks()
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Decks</h2>
        <a href="/decks/new">+ New Deck</a>
      </div>
      <DeckList decks={decks} onDelete={handleDelete} />
    </div>
  )
}
