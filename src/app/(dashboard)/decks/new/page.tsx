'use client'

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
      <h2>Create New Deck</h2>
      <CreateDeckForm onSubmit={handleSubmit} />
    </div>
  )
}
