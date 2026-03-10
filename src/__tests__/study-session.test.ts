import { describe, it, expect } from 'vitest'
import { createStudySession, answerCard } from '@/lib/utils/studySession'

const makeCard = (overrides: { id: string; next_review_at: string }) => ({
  id: overrides.id,
  deck_id: 'deck-1',
  front: `Front ${overrides.id}`,
  back: `Back ${overrides.id}`,
  interval: 1,
  ease_factor: 2.5,
  next_review_at: overrides.next_review_at,
  created_at: '2026-03-01',
})

describe('Study session', () => {
  it('shows due cards ordered by next_review_at ascending', () => {
    const cards = [
      makeCard({ id: '3', next_review_at: '2026-03-09' }),
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
      makeCard({ id: '2', next_review_at: '2026-03-07' }),
    ]

    const session = createStudySession(cards, new Date('2026-03-10'))

    expect(session.dueCards.map(c => c.id)).toEqual(['1', '2', '3'])
  })

  it('excludes cards not yet due', () => {
    const cards = [
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
      makeCard({ id: '2', next_review_at: '2026-03-15' }),
    ]

    const session = createStudySession(cards, new Date('2026-03-10'))

    expect(session.dueCards.map(c => c.id)).toEqual(['1'])
  })

  it('state is immutable between card reviews', () => {
    const cards = [
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
      makeCard({ id: '2', next_review_at: '2026-03-07' }),
    ]

    const session = createStudySession(cards, new Date('2026-03-10'))
    const nextSession = answerCard(session, '1', 4)

    expect(session.dueCards).toHaveLength(2)
    expect(nextSession.dueCards).toHaveLength(1)
    expect(nextSession.dueCards[0].id).toBe('2')
  })
})
