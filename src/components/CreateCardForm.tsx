'use client'

import { useState } from 'react'

type CreateCardFormProps = {
  readonly onSubmit: (data: { front: string; back: string }) => void | Promise<void>
}

export const CreateCardForm = ({ onSubmit }: CreateCardFormProps) => {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ front, back })
    setFront('')
    setBack('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="card-front">Front</label>
        <input id="card-front" type="text" value={front} onChange={(e) => setFront(e.target.value)} />
      </div>
      <div>
        <label htmlFor="card-back">Back</label>
        <input id="card-back" type="text" value={back} onChange={(e) => setBack(e.target.value)} />
      </div>
      <button type="submit">Add Card</button>
    </form>
  )
}
