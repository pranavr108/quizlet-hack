'use client'

import { useState } from 'react'

type GeneratedCard = {
  front: string
  back: string
}

type GenerateViewProps = {
  readonly onGenerate: (text: string) => void
  readonly cards?: ReadonlyArray<GeneratedCard>
  readonly error?: string
  readonly loading?: boolean
  readonly toast?: string
  readonly extractText?: (file: File) => Promise<string>
}

export const GenerateView = ({ onGenerate, cards, error, loading, toast, extractText }: GenerateViewProps) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    onGenerate(text.trim())
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !extractText) return
    const extracted = await extractText(file)
    setText(extracted)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="paste-text">Paste text</label>
        <textarea
          id="paste-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor="upload-pdf">Upload PDF</label>
        <input
          id="upload-pdf"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>Generate</button>
      </form>
      {loading && <div role="status">Generating flashcards...</div>}
      {toast && <div role="alert">{toast}</div>}
      {error && <p>{error}</p>}
      {cards && (
        <ul>
          {cards.map((card, i) => (
            <li key={i}>
              <span>{card.front}</span>
              <span>{card.back}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
