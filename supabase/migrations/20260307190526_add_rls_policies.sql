create policy "Users can read their own decks"
  on decks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own decks"
  on decks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own decks"
  on decks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own decks"
  on decks for delete
  using (auth.uid() = user_id);

create policy "Users can read their own cards"
  on cards for select
  using (deck_id in (select id from decks where user_id = auth.uid()));

create policy "Users can insert cards into their own decks"
  on cards for insert
  with check (deck_id in (select id from decks where user_id = auth.uid()));

create policy "Users can update cards in their own decks"
  on cards for update
  using (deck_id in (select id from decks where user_id = auth.uid()));

create policy "Users can delete cards from their own decks"
  on cards for delete
  using (deck_id in (select id from decks where user_id = auth.uid()));
