'use client'

import { useState } from 'react'

type CreateCardFormProps = {
  readonly onSubmit: (data: { front: string; back: string }) => void | Promise<void>
}

export const CreateCardForm = ({ onSubmit }: CreateCardFormProps) => {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { front?: string; back?: string } = {}

    if (front.trim().length === 0) newErrors.front = 'Front is required'
    if (back.trim().length === 0) newErrors.back = 'Back is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit({ front: front.trim(), back: back.trim() })
    setFront('')
    setBack('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="card-front">Front</label>
        <input id="card-front" type="text" value={front} onChange={(e) => setFront(e.target.value)} />
        {errors.front && <p role="alert">{errors.front}</p>}
      </div>
      <div>
        <label htmlFor="card-back">Back</label>
        <input id="card-back" type="text" value={back} onChange={(e) => setBack(e.target.value)} />
        {errors.back && <p role="alert">{errors.back}</p>}
      </div>
      <button type="submit">Add Card</button>
    </form>
  )
}
