'use client'

import { useState } from 'react'
import { CardContent } from '@/components/CardContent'

type GeneratedCard = {
  front: string
  back: string
}

type GenerateMode = 'general' | 'academic'

type GenerateViewProps = {
  readonly onGenerate: (text: string, mode: GenerateMode) => void
  readonly cards?: ReadonlyArray<GeneratedCard>
  readonly error?: string
  readonly loading?: boolean
  readonly toast?: string
  readonly extractText?: (file: File) => Promise<string>
}

export const GenerateView = ({ onGenerate, cards, error, loading, toast, extractText }: GenerateViewProps) => {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<GenerateMode>('general')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    onGenerate(text.trim(), mode)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !extractText) return
    setExtracting(true)
    setExtractError(undefined)
    try {
      const extracted = await extractText(file)
      setText(extracted)
      setMode('academic')
    } catch {
      setExtractError('Failed to extract text from PDF. Make sure the file is a valid PDF.')
    } finally {
      setExtracting(false)
    }
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
          {extracting && <p className="status-loading" style={{ marginTop: '0.5rem' }}>Extracting text from PDF…</p>}
          {extractError && <p className="form-error" style={{ marginTop: '0.5rem' }}>{extractError}</p>}
        </div>
        <fieldset className="form-group">
          <legend className="form-label">Generation mode</legend>
          <label style={{ marginRight: '1.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="mode"
              value="general"
              checked={mode === 'general'}
              onChange={() => setMode('general')}
              style={{ marginRight: '0.4rem' }}
            />
            General notes
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="mode"
              value="academic"
              checked={mode === 'academic'}
              onChange={() => setMode('academic')}
              style={{ marginRight: '0.4rem' }}
            />
            Academic paper
          </label>
        </fieldset>
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
