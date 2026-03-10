'use client'

import { useState } from 'react'

type CreateDeckFormProps = {
  readonly onSubmit: (data: { name: string }) => void | Promise<void>
}

export const CreateDeckForm = ({ onSubmit }: CreateDeckFormProps) => {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
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
      <button type="submit">Create</button>
    </form>
  )
}
