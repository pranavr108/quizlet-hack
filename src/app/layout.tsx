import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flashcard App',
  description: 'AI-powered spaced repetition flashcards',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
        <header>
          <h1><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Flashcard App</a></h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
