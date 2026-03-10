import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link href="/decks">Go to your decks</Link>
    </div>
  )
}
