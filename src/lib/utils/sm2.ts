type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

type SM2Input = {
  easeFactor: number
  interval: number
  quality: ReviewQuality
}

type SM2Output = {
  easeFactor: number
  interval: number
  nextReviewAt: Date
}

export const calculateNextReview = (input: SM2Input): SM2Output => {
  const { easeFactor, interval, quality } = input

  const newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  if (quality < 3) {
    return {
      easeFactor: Math.max(1.3, newEaseFactor),
      interval: 1,
      nextReviewAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    }
  }

  const newInterval = interval === 1 ? 6 : Math.round(interval * easeFactor)

  return {
    easeFactor: Math.max(1.3, newEaseFactor),
    interval: newInterval,
    nextReviewAt: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
  }
}
