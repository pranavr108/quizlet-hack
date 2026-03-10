// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { DeckList } from '@/components/DeckList'

describe('Deck list page', () => {
  it('displays deck names', () => {
    const decks = [
      { id: '1', name: 'Biochemistry', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07' },
      { id: '2', name: 'Neuroscience', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07' },
    ]

    render(<DeckList decks={decks} />)

    expect(screen.getByText('Biochemistry')).toBeInTheDocument()
    expect(screen.getByText('Neuroscience')).toBeInTheDocument()
  })

  it('shows empty state when no decks exist', () => {
    render(<DeckList decks={[]} />)

    expect(screen.getByText(/no decks/i)).toBeInTheDocument()
  })

  it('displays card count for each deck', () => {
    const decks = [
      { id: '1', name: 'Biochemistry', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07', card_count: 12 },
      { id: '2', name: 'Neuroscience', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07', card_count: 0 },
    ]

    render(<DeckList decks={decks} />)

    expect(screen.getByText(/12 cards/i)).toBeInTheDocument()
    expect(screen.getByText(/0 cards/i)).toBeInTheDocument()
  })

  it('displays last studied date when available', () => {
    const decks = [
      { id: '1', name: 'Biochemistry', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07', card_count: 5, last_studied_at: '2026-03-06' },
      { id: '2', name: 'Neuroscience', description: null, user_id: '00000000-0000-0000-0000-000000000000', created_at: '2026-03-07', card_count: 3, last_studied_at: null },
    ]

    render(<DeckList decks={decks} />)

    expect(screen.getByText(/2026-03-06/)).toBeInTheDocument()
    expect(screen.getByText(/never studied/i)).toBeInTheDocument()
  })
})
