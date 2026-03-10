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
    return (
      <div className="empty-state">
        <p>No decks yet — create your first one.</p>
        <a href="/decks/new" className="btn btn-primary">New Deck</a>
      </div>
    )
  }

  return (
    <div className="deck-grid">
      {decks.map(deck => (
        <div key={deck.id} className="deck-card">
          <a href={`/decks/${deck.id}`} className="deck-card-name" style={{ color: 'inherit', textDecoration: 'none' }}>
            {deck.name}
          </a>
          {deck.description && (
            <p className="deck-card-meta">{deck.description}</p>
          )}
          <div className="deck-card-meta">
            {deck.card_count !== undefined && <span>{deck.card_count} cards</span>}
            {deck.last_studied_at !== undefined && (
              <span style={{ marginLeft: '0.75rem' }}>
                {deck.last_studied_at ? `Studied ${new Date(deck.last_studied_at).toLocaleDateString()}` : 'Never studied'}
              </span>
            )}
          </div>
          <div className="deck-card-actions">
            <a href={`/decks/${deck.id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Open</a>
            <a href={`/study/${deck.id}`} className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>Study</a>
            {onDelete && (
              <button
                onClick={() => onDelete(deck.id)}
                className="btn btn-ghost"
                style={{ fontSize: '0.75rem', marginLeft: 'auto', color: 'var(--ink-3)' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
