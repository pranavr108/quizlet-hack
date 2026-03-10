create table cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references decks(id) on delete cascade,
  front text not null check (char_length(front) >= 1),
  back text not null check (char_length(back) >= 1),
  interval integer not null default 1,
  ease_factor numeric not null default 2.5,
  next_review_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
