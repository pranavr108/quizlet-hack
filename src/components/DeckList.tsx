type Deck = {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  card_count?: number
  last_studied_at?: string | null
}

type DeckListProps = {
  decks: ReadonlyArray<Deck>
  onDelete?: (id: string) => void
}

export const DeckList = ({ decks, onDelete }: DeckListProps) => {
  if (decks.length === 0) {
    return <p>No decks yet.</p>
  }

  return (
    <ul>
      {decks.map(deck => (
        <li key={deck.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <a href={`/decks/${deck.id}`}>{deck.name}</a>
          {deck.card_count !== undefined && <span>{deck.card_count} cards</span>}
          {deck.last_studied_at !== undefined && (
            <span>{deck.last_studied_at ?? 'Never studied'}</span>
          )}
          {onDelete && <button onClick={() => onDelete(deck.id)}>Delete</button>}
        </li>
      ))}
    </ul>
  )
}
