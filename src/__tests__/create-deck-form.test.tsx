// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { CreateDeckForm } from '@/components/CreateDeckForm'

describe('Create deck form', () => {
  it('renders a name input and submit button', () => {
    render(<CreateDeckForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('does not call onSubmit when name is empty', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<CreateDeckForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when submitting empty name', async () => {
    const user = userEvent.setup()

    render(<CreateDeckForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with deck name when form is submitted', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<CreateDeckForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Biochemistry')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Biochemistry' })
  })
})
