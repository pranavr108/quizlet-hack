// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { CreateCardForm } from '@/components/CreateCardForm'

describe('Create card form', () => {
  it('renders front and back inputs and a submit button', () => {
    render(<CreateCardForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/front/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/back/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add card/i })).toBeInTheDocument()
  })

  it('does not call onSubmit when front is empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<CreateCardForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/back/i), 'Some answer')
    await user.click(screen.getByRole('button', { name: /add card/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when back is empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<CreateCardForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/front/i), 'Some question')
    await user.click(screen.getByRole('button', { name: /add card/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup()

    render(<CreateCardForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add card/i }))

    expect(screen.getByText(/front is required/i)).toBeInTheDocument()
    expect(screen.getByText(/back is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with front and back text', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CreateCardForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/front/i), 'What is ATP?')
    await user.type(screen.getByLabelText(/back/i), 'Adenosine triphosphate')
    await user.click(screen.getByRole('button', { name: /add card/i }))

    expect(onSubmit).toHaveBeenCalledWith({ front: 'What is ATP?', back: 'Adenosine triphosphate' })
  })

  it('clears inputs after submit', async () => {
    const user = userEvent.setup()

    render(<CreateCardForm onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText(/front/i), 'What is ATP?')
    await user.type(screen.getByLabelText(/back/i), 'Adenosine triphosphate')
    await user.click(screen.getByRole('button', { name: /add card/i }))

    expect(screen.getByLabelText(/front/i)).toHaveValue('')
    expect(screen.getByLabelText(/back/i)).toHaveValue('')
  })
})
