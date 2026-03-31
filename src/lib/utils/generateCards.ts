import { z } from 'zod'

const GeneratedCardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
})

type GeneratedCard = z.infer<typeof GeneratedCardSchema>

type ParseSuccess = { success: true; cards: ReadonlyArray<GeneratedCard> }
type ParseFailure = { success: false; error: string }
type ParseResult = ParseSuccess | ParseFailure

const extractJson = (raw: string): string => {
  const fenced = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenced?.[1]) return fenced[1].trim()

  const bracketMatch = raw.match(/\[[\s\S]*\]/)
  if (bracketMatch?.[0]) return bracketMatch[0]

  return raw.trim()
}

export const parseGeneratedCards = (raw: string): ParseResult => {
  let parsed: unknown
  try {
    parsed = JSON.parse(extractJson(raw))
  } catch {
    return { success: false, error: 'Invalid JSON' }
  }

  const result = z.array(GeneratedCardSchema).safeParse(parsed)

  if (!result.success) {
    return { success: false, error: result.error.message }
  }

  return { success: true, cards: result.data }
}
