'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStudySession } from '@/hooks/useStudySession'
import { CardContent } from '@/components/CardContent'
import './study-card-flip.css'

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
    return <p>Session complete!</p>
  }

  return (
    <div>
      <div className="study-card">
        <div className={`study-card-inner${showBack ? ' study-card-flipped' : ''}`}>
          <div data-face="front"><CardContent text={currentCard.front} /></div>
          <div data-face="back"><CardContent text={currentCard.back} /></div>
        </div>
      </div>
      {showBack ? (
        <>
          <button onClick={() => handleRate(1)}>Again</button>
          <button onClick={() => handleRate(3)}>Hard</button>
          <button onClick={() => handleRate(4)}>Good</button>
          <button onClick={() => handleRate(5)}>Easy</button>
        </>
      ) : (
        <button onClick={handleFlip}>Show Answer</button>
      )}
    </div>
  )
}
