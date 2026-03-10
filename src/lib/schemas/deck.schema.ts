import { z } from 'zod'

export const DeckSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
})

export type Deck = z.infer<typeof DeckSchema>
