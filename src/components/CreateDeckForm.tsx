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
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '480px' }}>
      <div className="form-group">
        <label htmlFor="deck-name" className="form-label">Deck Name</label>
        <input
          id="deck-name"
          type="text"
          className="form-input"
          placeholder="e.g. Biochemistry, Organic Chemistry…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p role="alert" className="form-error">{error}</p>}
      </div>
      <button type="submit" className="btn btn-primary">Create Deck</button>
    </form>
  )
}
