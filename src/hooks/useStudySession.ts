import { useState, useCallback } from 'react'
import { createStudySession, answerCard } from '@/lib/utils/studySession'

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

export const useStudySession = (cards: ReadonlyArray<Card>, now: Date) => {
  const [session, setSession] = useState(() => createStudySession(cards, now))

  const answer = useCallback((quality: number) => {
    setSession(current => {
      const currentCard = current.dueCards[0]
      if (!currentCard) return current
      return answerCard(current, currentCard.id, quality)
    })
  }, [])

  return {
    currentCard: session.dueCards[0] ?? null,
    remaining: session.dueCards.length,
    answer,
  }
}
