// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStudySession } from '@/hooks/useStudySession'

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

describe('useStudySession', () => {
  it('exposes the first due card as currentCard', () => {
    const cards = [
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
      makeCard({ id: '2', next_review_at: '2026-03-07' }),
    ]

    const { result } = renderHook(() => useStudySession(cards, new Date('2026-03-10')))

    expect(result.current.currentCard?.id).toBe('1')
    expect(result.current.remaining).toBe(2)
  })

  it('advances to next card after answering', () => {
    const cards = [
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
      makeCard({ id: '2', next_review_at: '2026-03-07' }),
    ]

    const { result } = renderHook(() => useStudySession(cards, new Date('2026-03-10')))

    act(() => { result.current.answer(4) })

    expect(result.current.currentCard?.id).toBe('2')
    expect(result.current.remaining).toBe(1)
  })

  it('returns null currentCard when session is complete', () => {
    const cards = [
      makeCard({ id: '1', next_review_at: '2026-03-05' }),
    ]

    const { result } = renderHook(() => useStudySession(cards, new Date('2026-03-10')))

    act(() => { result.current.answer(4) })

    expect(result.current.currentCard).toBeNull()
    expect(result.current.remaining).toBe(0)
  })
})
