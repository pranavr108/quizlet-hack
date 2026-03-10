import { describe, it, expect } from 'vitest'
import { calculateNextReview } from '@/lib/utils/sm2'

describe('SM-2 algorithm', () => {
  it('increases interval on correct answer (quality >= 3)', () => {
    const first = calculateNextReview({ easeFactor: 2.5, interval: 1, quality: 4 })
    expect(first.interval).toBe(6)

    const second = calculateNextReview({ easeFactor: first.easeFactor, interval: first.interval, quality: 4 })
    expect(second.interval).toBeGreaterThan(first.interval)
  })

  it('resets interval on incorrect answer (quality < 3)', () => {
    const result = calculateNextReview({ easeFactor: 2.5, interval: 15, quality: 2 })
    expect(result.interval).toBe(1)
  })

  it('adjusts ease factor based on quality rating', () => {
    const high = calculateNextReview({ easeFactor: 2.5, interval: 6, quality: 5 })
    const mid = calculateNextReview({ easeFactor: 2.5, interval: 6, quality: 3 })
    const low = calculateNextReview({ easeFactor: 2.5, interval: 6, quality: 0 })

    expect(high.easeFactor).toBeGreaterThan(mid.easeFactor)
    expect(mid.easeFactor).toBeGreaterThan(low.easeFactor)
  })

  it('never returns easeFactor below 1.3', () => {
    const result = calculateNextReview({ easeFactor: 1.3, interval: 1, quality: 0 })
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
  })
})
