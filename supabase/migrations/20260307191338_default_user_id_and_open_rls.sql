-- Default user ID for single-user local mode
alter table decks alter column user_id set default '00000000-0000-0000-0000-000000000000'::uuid;

-- Drop existing RLS policies
drop policy "Users can read their own decks" on decks;
drop policy "Users can insert their own decks" on decks;
drop policy "Users can update their own decks" on decks;
drop policy "Users can delete their own decks" on decks;
drop policy "Users can read their own cards" on cards;
drop policy "Users can insert cards into their own decks" on cards;
drop policy "Users can update cards in their own decks" on cards;
drop policy "Users can delete cards from their own decks" on cards;

-- Open access policies (single-user local app)
create policy "Allow all access to decks" on decks for all using (true) with check (true);
create policy "Allow all access to cards" on cards for all using (true) with check (true);
