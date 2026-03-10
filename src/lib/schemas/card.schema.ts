import { z } from 'zod'

export const CardSchema = z.object({
  id: z.string().uuid(),
  deckId: z.string().uuid(),
  front: z.string().min(1),
  back: z.string().min(1),
  interval: z.number().default(1),
  easeFactor: z.number().default(2.5),
  nextReviewAt: z.date(),
  createdAt: z.date(),
})

export type Card = z.infer<typeof CardSchema>
