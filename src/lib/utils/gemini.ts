import { parseGeneratedCards } from './generateCards'

type GenerateModel = {
  generateContent: (prompt: string) => Promise<{
    response: { text: () => string }
  }>
}

type GenerateFlashcardsInput = {
  text: string
  model: GenerateModel
}

export const generateFlashcards = async ({ text, model }: GenerateFlashcardsInput) => {
  try {
    const result = await model.generateContent(
      `Generate flashcards from the following text. Return ONLY a valid JSON array of objects with "front" and "back" fields. No markdown code fences, no explanation.

Rules for card content:
- Use Markdown for formatting (e.g., **bold** for key terms in biological pathways).
- Wrap all mathematical or chemical formulas in standard LaTeX delimiters: $...$ for inline, $$...$$ for block.
- Keep questions concise and answers precise.

Text:
${text}`
    )
    return parseGeneratedCards(result.response.text())
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
