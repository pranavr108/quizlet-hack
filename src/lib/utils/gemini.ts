import { parseGeneratedCards } from './generateCards'

type GenerateModel = {
  generateContent: (prompt: string) => Promise<{
    response: { text: () => string }
  }>
}

type GenerateMode = 'general' | 'academic'

type GenerateFlashcardsInput = {
  text: string
  model: GenerateModel
  mode?: GenerateMode
}

const generalPrompt = (text: string) =>
  `Generate flashcards from the following text. Return ONLY a valid JSON array of objects with "front" and "back" fields. No markdown code fences, no explanation.

Rules for card content:
- Use Markdown for formatting (e.g., **bold** for key terms in biological pathways).
- Wrap all mathematical or chemical formulas in standard LaTeX delimiters: $...$ for inline, $$...$$ for block.
- Keep questions concise and answers precise.

Text:
${text}`

const academicPrompt = (text: string) =>
  `You are an expert academic tutor. Analyze the following research paper/article and generate flashcards that help the reader deeply understand it. Return ONLY a valid JSON array of objects with "front" and "back" fields. No markdown code fences, no explanation.

Generate cards covering:
1. **Key findings and takeaways** — What are the main results and conclusions?
2. **Methods and techniques** — What methodology, experimental design, or analytical technique was used and why?
3. **Key concepts and definitions** — What domain-specific terms or frameworks does the paper introduce or rely on?
4. **Significance and implications** — Why do the findings matter? How do they advance the field?
5. **Limitations and future directions** — What are the acknowledged limitations or open questions?

Rules for card content:
- Use Markdown for formatting (e.g., **bold** for key terms).
- Wrap all mathematical or chemical formulas in standard LaTeX delimiters: $...$ for inline, $$...$$ for block.
- Questions should test understanding, not just recall (e.g., "Why did the authors use X method?" rather than "What method was used?").
- Answers should be precise but include enough context to be useful for review.

Paper text:
${text}`

export const generateFlashcards = async ({ text, model, mode = 'general' }: GenerateFlashcardsInput) => {
  try {
    const prompt = mode === 'academic' ? academicPrompt(text) : generalPrompt(text)
    const result = await model.generateContent(prompt)
    return parseGeneratedCards(result.response.text())
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
