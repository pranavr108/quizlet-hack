// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { CardList } from '@/components/CardList'

describe('Card list view', () => {
  it('displays front and back text for each card', () => {
    const cards = [
      { id: '1', deck_id: 'deck-1', front: 'What is ATP?', back: 'Adenosine triphosphate', interval: 1, ease_factor: 2.5, next_review_at: '2026-03-08', created_at: '2026-03-07' },
      { id: '2', deck_id: 'deck-1', front: 'What is DNA?', back: 'Deoxyribonucleic acid', interval: 1, ease_factor: 2.5, next_review_at: '2026-03-08', created_at: '2026-03-07' },
    ]

    render(<CardList cards={cards} />)

    expect(screen.getByText('What is ATP?')).toBeInTheDocument()
    expect(screen.getByText('Adenosine triphosphate')).toBeInTheDocument()
    expect(screen.getByText('What is DNA?')).toBeInTheDocument()
    expect(screen.getByText('Deoxyribonucleic acid')).toBeInTheDocument()
  })

  it('renders each card with distinct front and back faces for flip', () => {
    const cards = [
      { id: '1', deck_id: 'deck-1', front: 'What is ATP?', back: 'Adenosine triphosphate', interval: 1, ease_factor: 2.5, next_review_at: '2026-03-08', created_at: '2026-03-07' },
    ]

    render(<CardList cards={cards} />)

    const frontFace = screen.getByText('What is ATP?').closest('[data-face="front"]')
    const backFace = screen.getByText('Adenosine triphosphate').closest('[data-face="back"]')

    expect(frontFace).toBeInTheDocument()
    expect(backFace).toBeInTheDocument()
    expect(frontFace?.parentElement).toBe(backFace?.parentElement)
  })

  it('shows empty state when no cards exist', () => {
    render(<CardList cards={[]} />)

    expect(screen.getByText(/no cards/i)).toBeInTheDocument()
  })
})
