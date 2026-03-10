import { CardContent } from '@/components/CardContent'

type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  interval: number
  ease_factor: number
  next_review_at: string
  created_at: string
}

type CardListProps = {
  cards: ReadonlyArray<Card>
  onDelete?: (id: string) => void
}

export const CardList = ({ cards, onDelete }: CardListProps) => {
  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <p>No cards yet — add one above or generate with AI.</p>
      </div>
    )
  }

  return (
    <ul className="card-list">
      {cards.map(card => (
        <li key={card.id} className="card-list-item">
          <div className="card-list-item-front">
            <CardContent text={card.front} />
          </div>
          <div className="card-list-item-back">
            <CardContent text={card.back} />
          </div>
          {onDelete && (
            <button
              className="btn btn-ghost"
              onClick={() => onDelete(card.id)}
              style={{ justifySelf: 'end' }}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
