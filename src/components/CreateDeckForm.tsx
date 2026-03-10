'use client'

import { useState } from 'react'

type CreateDeckFormProps = {
  readonly onSubmit: (data: { name: string }) => void | Promise<void>
}

export const CreateDeckForm = ({ onSubmit }: CreateDeckFormProps) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    onSubmit({ name: name.trim() })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="deck-name">Name</label>
      <input
        id="deck-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Create</button>
    </form>
  )
}
