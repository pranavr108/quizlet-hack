import './card-flip.css'

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
}

export const CardList = ({ cards }: CardListProps) => {
  if (cards.length === 0) {
    return <p>No cards yet.</p>
  }

  return (
    <ul>
      {cards.map(card => (
        <li key={card.id} className="card-flip">
          <div className="card-flip-inner">
            <div data-face="front">{card.front}</div>
            <div data-face="back">{card.back}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
