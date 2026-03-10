import { z } from 'zod'

const GeneratedCardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
})

type GeneratedCard = z.infer<typeof GeneratedCardSchema>

type ParseSuccess = { success: true; cards: ReadonlyArray<GeneratedCard> }
type ParseFailure = { success: false; error: string }
type ParseResult = ParseSuccess | ParseFailure

export const parseGeneratedCards = (raw: string): ParseResult => {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { success: false, error: 'Invalid JSON' }
  }

  const result = z.array(GeneratedCardSchema).safeParse(parsed)

  if (!result.success) {
    return { success: false, error: result.error.message }
  }

  return { success: true, cards: result.data }
}
