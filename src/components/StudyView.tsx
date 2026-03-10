'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStudySession } from '@/hooks/useStudySession'
import { CardContent } from '@/components/CardContent'

type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  interval: number
  ease_factor: number
  next_review_at: string
  created_at: string
}

type StudyViewProps = {
  readonly cards: ReadonlyArray<Card>
  readonly now: Date
}

export const StudyView = ({ cards, now }: StudyViewProps) => {
  const { currentCard, answer } = useStudySession(cards, now)
  const [showBack, setShowBack] = useState(false)

  const handleRate = useCallback((quality: number) => {
    answer(quality)
    setShowBack(false)
  }, [answer])

  const handleFlip = useCallback(() => {
    setShowBack(true)
  }, [])

  useEffect(() => {
    if (!currentCard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (!showBack) handleFlip()
      }

      if (!showBack) return

      const gradeMap: Record<string, number> = { '1': 1, '2': 3, '3': 4, '4': 5 }
      const quality = gradeMap[e.key]
      if (quality !== undefined) handleRate(quality)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCard, showBack, handleRate, handleFlip])

  if (!currentCard) {
    return (
      <div className="session-complete">
        <h3>Session Complete</h3>
        <p>You've reviewed all due cards. Well done.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="study-card">
        <div className={`study-card-inner${showBack ? ' study-card-flipped' : ''}`}>
          <div data-face="front">
            <span className="study-card-face-label">Front</span>
            <div className="study-card-content"><CardContent text={currentCard.front} /></div>
          </div>
          <div data-face="back">
            <span className="study-card-face-label">Back</span>
            <div className="study-card-content"><CardContent text={currentCard.back} /></div>
          </div>
        </div>
      </div>

      <div className="study-actions">
        {showBack ? (
          <>
            <button className="grade-btn again" onClick={() => handleRate(1)}>
              Again<span className="grade-key"><kbd>1</kbd></span>
            </button>
            <button className="grade-btn" onClick={() => handleRate(3)}>
              Hard<span className="grade-key"><kbd>2</kbd></span>
            </button>
            <button className="grade-btn" onClick={() => handleRate(4)}>
              Good<span className="grade-key"><kbd>3</kbd></span>
            </button>
            <button className="grade-btn easy" onClick={() => handleRate(5)}>
              Easy<span className="grade-key"><kbd>4</kbd></span>
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleFlip}>
            Show Answer
          </button>
        )}
      </div>

      <p className="keyboard-hint">
        Press <kbd>Space</kbd> to flip · <kbd>1</kbd>–<kbd>4</kbd> to grade
      </p>
    </div>
  )
}
