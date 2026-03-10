'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/db/client'
import { createDeck } from '@/lib/db/decks'
import { CreateDeckForm } from '@/components/CreateDeckForm'

export default function NewDeckPage() {
  const router = useRouter()

  const handleSubmit = async (data: { name: string }) => {
    await createDeck(supabase, data)
    router.push('/decks')
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/decks" className="btn btn-ghost">← Back to Decks</a>
      </div>
      <div className="page-title-block">
        <h2>Create New Deck</h2>
      </div>
      <CreateDeckForm onSubmit={handleSubmit} />
    </div>
  )
}
