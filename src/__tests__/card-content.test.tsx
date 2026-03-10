// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { CardContent } from '@/components/CardContent'

describe('CardContent', () => {
  it('renders plain text as-is', () => {
    render(<CardContent text="Adenosine triphosphate" />)

    expect(screen.getByText('Adenosine triphosphate')).toBeInTheDocument()
  })

  it('renders Markdown bold text', () => {
    render(<CardContent text="The **mitochondria** is the powerhouse" />)

    const bold = screen.getByText('mitochondria')
    expect(bold.tagName).toBe('STRONG')
  })

  it('renders inline LaTeX with KaTeX', () => {
    render(<CardContent text="Michaelis-Menten: $v = \\frac{V_{max}[S]}{K_m + [S]}$" />)

    const katexElement = document.querySelector('.katex')
    expect(katexElement).toBeInTheDocument()
  })

  it('renders block LaTeX with KaTeX', () => {
    const { container } = render(<CardContent text={'$$\nE = mc^2\n$$'} />)

    const katexElement = container.querySelector('.katex-display')
    expect(katexElement).toBeInTheDocument()
  })
})
