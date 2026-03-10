import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcard App',
  description: 'AI-powered spaced repetition flashcards',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="page-header">
            <h1><a href="/">Flashcard App</a></h1>
            <a href="/decks">Decks</a>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
