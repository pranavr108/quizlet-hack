import { getDocument } from 'pdfjs-dist'

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: buffer }).promise
  const pages: ReadonlyArray<string> = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, i) => {
      const page = await pdf.getPage(i + 1)
      const content = await page.getTextContent()
      return content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
    }),
  )
  return pages.join('\n\n')
}
