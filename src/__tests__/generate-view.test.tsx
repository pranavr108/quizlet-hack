// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { GenerateView } from '@/components/GenerateView'

describe('Generate flashcards view', () => {
  it('renders a text input and generate button', () => {
    render(<GenerateView onGenerate={vi.fn()} />)

    expect(screen.getByLabelText(/paste text/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('calls onGenerate with the pasted text', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()

    render(<GenerateView onGenerate={onGenerate} />)

    await user.type(screen.getByLabelText(/paste text/i), 'ATP is adenosine triphosphate.')
    await user.click(screen.getByRole('button', { name: /generate/i }))

    expect(onGenerate).toHaveBeenCalledWith('ATP is adenosine triphosphate.')
  })

  it('displays generated cards when provided', () => {
    const cards = [
      { front: 'What is ATP?', back: 'Adenosine triphosphate' },
      { front: 'What is DNA?', back: 'Deoxyribonucleic acid' },
    ]

    render(<GenerateView onGenerate={vi.fn()} cards={cards} />)

    expect(screen.getByText('What is ATP?')).toBeInTheDocument()
    expect(screen.getByText('Adenosine triphosphate')).toBeInTheDocument()
    expect(screen.getByText('What is DNA?')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(<GenerateView onGenerate={vi.fn()} error="Failed to generate cards" />)

    expect(screen.getByText('Failed to generate cards')).toBeInTheDocument()
  })

  it('renders a file input that accepts PDF', () => {
    render(<GenerateView onGenerate={vi.fn()} />)

    const fileInput = screen.getByLabelText(/upload pdf/i)
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', '.pdf')
  })

  it('shows loading indicator while generating', () => {
    render(<GenerateView onGenerate={vi.fn()} loading={true} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled()
  })

  it('shows success toast when cards are generated', () => {
    const cards = [
      { front: 'What is ATP?', back: 'Adenosine triphosphate' },
    ]

    render(<GenerateView onGenerate={vi.fn()} cards={cards} toast="Successfully generated 1 card" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Successfully generated 1 card')
  })

  it('populates textarea with extracted text when PDF is uploaded', async () => {
    const user = userEvent.setup()
    const extractText = vi.fn().mockResolvedValue('Extracted PDF content here.')

    render(<GenerateView onGenerate={vi.fn()} extractText={extractText} />)

    const file = new File(['fake pdf'], 'notes.pdf', { type: 'application/pdf' })
    await user.upload(screen.getByLabelText(/upload pdf/i), file)

    expect(extractText).toHaveBeenCalledWith(file)
    expect(await screen.findByDisplayValue('Extracted PDF content here.')).toBeInTheDocument()
  })
})
