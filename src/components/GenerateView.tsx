'use client'

import { useState } from 'react'
import { CardContent } from '@/components/CardContent'

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
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="paste-text" className="form-label">Paste your notes</label>
          <textarea
            id="paste-text"
            className="form-textarea"
            placeholder="Paste lecture notes, textbook passages, or any study material…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="upload-pdf" className="form-label">Or upload a PDF</label>
          <input
            id="upload-pdf"
            type="file"
            accept=".pdf"
            className="form-input"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate Flashcards'}
        </button>
      </form>

      {loading && <div role="status" className="status-loading">Generating flashcards…</div>}
      {toast && <div role="alert" className="toast">{toast}</div>}
      {error && <p className="form-error" style={{ marginTop: '1rem' }}>{error}</p>}

      {cards && cards.length > 0 && (
        <>
          <hr className="section-rule" />
          <h3>Generated Cards</h3>
          <ul className="card-list">
            {cards.map((card, i) => (
              <li key={i} className="card-list-item">
                <div className="card-list-item-front">
                  <CardContent text={card.front} />
                </div>
                <div className="card-list-item-back">
                  <CardContent text={card.back} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
