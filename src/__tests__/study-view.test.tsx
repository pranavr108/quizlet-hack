// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { StudyView } from '@/components/StudyView'

const makeCard = (overrides: { id: string; front: string; back: string }) => ({
  id: overrides.id,
  deck_id: 'deck-1',
  front: overrides.front,
  back: overrides.back,
  interval: 1,
  ease_factor: 2.5,
  next_review_at: '2026-03-05',
  created_at: '2026-03-01',
})

describe('Study view', () => {
  it('shows the front of the current card', () => {
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    expect(screen.getByText('What is ATP?')).toBeInTheDocument()
  })

  it('reveals the back after clicking show answer', async () => {
    const user = userEvent.setup()
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.click(screen.getByRole('button', { name: /show answer/i }))

    expect(screen.getByText('Adenosine triphosphate')).toBeInTheDocument()
  })

  it('advances to next card after rating', async () => {
    const user = userEvent.setup()
    const cards = [
      makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' }),
      makeCard({ id: '2', front: 'What is DNA?', back: 'Deoxyribonucleic acid' }),
    ]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.click(screen.getByRole('button', { name: /show answer/i }))
    await user.click(screen.getByRole('button', { name: /good/i }))

    expect(screen.getByText('What is DNA?')).toBeInTheDocument()
  })

  it('renders card with front and back faces for flip animation', () => {
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    const frontFace = screen.getByText('What is ATP?').closest('[data-face="front"]')
    const backFace = screen.getByText('Adenosine triphosphate').closest('[data-face="back"]')

    expect(frontFace).toBeInTheDocument()
    expect(backFace).toBeInTheDocument()
    expect(frontFace?.parentElement).toBe(backFace?.parentElement)
  })

  it('adds flipped state to card after clicking show answer', async () => {
    const user = userEvent.setup()
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    const cardInner = screen.getByText('What is ATP?').closest('[data-face="front"]')?.parentElement
    expect(cardInner).not.toHaveClass('study-card-flipped')

    await user.click(screen.getByRole('button', { name: /show answer/i }))

    expect(cardInner).toHaveClass('study-card-flipped')
  })

  it('flips card when spacebar is pressed', async () => {
    const user = userEvent.setup()
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.keyboard(' ')

    const cardInner = screen.getByText('What is ATP?').closest('[data-face="front"]')?.parentElement
    expect(cardInner).toHaveClass('study-card-flipped')
  })

  it('grades card with number keys 1-4 after flipping', async () => {
    const user = userEvent.setup()
    const cards = [
      makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' }),
      makeCard({ id: '2', front: 'What is DNA?', back: 'Deoxyribonucleic acid' }),
    ]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.keyboard(' ')
    await user.keyboard('3')

    expect(screen.getByText('What is DNA?')).toBeInTheDocument()
  })

  it('ignores number keys before card is flipped', async () => {
    const user = userEvent.setup()
    const cards = [
      makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' }),
      makeCard({ id: '2', front: 'What is DNA?', back: 'Deoxyribonucleic acid' }),
    ]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.keyboard('3')

    expect(screen.getByText('What is ATP?')).toBeInTheDocument()
  })

  it('renders card content with Markdown formatting', () => {
    const cards = [makeCard({ id: '1', front: 'The **mitochondria**', back: 'Powerhouse' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    const bold = screen.getByText('mitochondria')
    expect(bold.tagName).toBe('STRONG')
  })

  it('shows completion message when all cards reviewed', async () => {
    const user = userEvent.setup()
    const cards = [makeCard({ id: '1', front: 'What is ATP?', back: 'Adenosine triphosphate' })]

    render(<StudyView cards={cards} now={new Date('2026-03-10')} />)

    await user.click(screen.getByRole('button', { name: /show answer/i }))
    await user.click(screen.getByRole('button', { name: /good/i }))

    expect(screen.getByText(/session complete/i)).toBeInTheDocument()
  })
})
