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

type StudySession = {
  dueCards: ReadonlyArray<Card>
}

export const createStudySession = (cards: ReadonlyArray<Card>, now: Date): StudySession => {
  const dueCards = cards
    .filter(card => new Date(card.next_review_at) <= now)
    .toSorted((a, b) => new Date(a.next_review_at).getTime() - new Date(b.next_review_at).getTime())

  return { dueCards }
}

export const answerCard = (session: StudySession, cardId: string, _quality: number): StudySession => ({
  dueCards: session.dueCards.filter(card => card.id !== cardId),
})
