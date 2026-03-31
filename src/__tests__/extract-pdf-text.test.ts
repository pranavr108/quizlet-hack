import { describe, it, expect, vi } from 'vitest'
import { extractTextFromPdf } from '@/lib/utils/extractPdf'

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
}))

import { getDocument } from 'pdfjs-dist'

const mockGetDocument = vi.mocked(getDocument)

const createFakeFile = (content: string) =>
  new File([content], 'paper.pdf', { type: 'application/pdf' })

const makePage = (text: string) => ({
  getTextContent: async () => ({
    items: text.split(' ').map((str) => ({ str, hasEOL: false })),
  }),
})

describe('extractTextFromPdf', () => {
  it('extracts text from a single-page PDF', async () => {
    const page = makePage('Mitochondria are the powerhouse of the cell')
    mockGetDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: async () => page,
      }),
    } as ReturnType<typeof getDocument>)

    const result = await extractTextFromPdf(createFakeFile('fake'))

    expect(result).toBe('Mitochondria are the powerhouse of the cell')
  })

  it('concatenates text from multiple pages', async () => {
    const page1 = makePage('Page one content')
    const page2 = makePage('Page two content')
    mockGetDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 2,
        getPage: async (num: number) => (num === 1 ? page1 : page2),
      }),
    } as ReturnType<typeof getDocument>)

    const result = await extractTextFromPdf(createFakeFile('fake'))

    expect(result).toContain('Page one content')
    expect(result).toContain('Page two content')
  })

  it('throws on invalid PDF', async () => {
    mockGetDocument.mockReturnValue({
      promise: Promise.reject(new Error('Invalid PDF structure')),
    } as ReturnType<typeof getDocument>)

    await expect(extractTextFromPdf(createFakeFile('not a pdf'))).rejects.toThrow(
      'Invalid PDF structure',
    )
  })
})
