# Work In Progress

## Current Phase: 8 — Polish & Deployment
## Status: In Progress

## Completed
- Phase 1: Schema Foundation (all 5 tasks done)
- Phase 2: Supabase Setup (all 7 tasks done)
- Phase 3: Auth Flow — SKIPPED (single-user local app, default user_id)
- Phase 4: Deck CRUD (all 7 tasks done)
- Phase 5: Card CRUD (all 6 tasks done)
- Phase 6: Study Engine (all 13 tasks done)
- Phase 7: AI Flashcard Generator & Async UI (all 9 tasks done)
- Phase 8 (partial): GitHub Actions CI workflow

## Remaining (Phase 8 — requires external accounts)
- [ ] Create Supabase cloud project + link + push migrations
- [ ] Configure Supabase Auth (optional)
- [ ] Create Vercel project + add env vars
- [ ] Trigger initial production deployment

## Known Issues
- `decks.crud.test.ts` "user sees their decks listed" fails due to stale data in local Supabase (expects 2 decks, finds 3). Not a code bug — needs DB cleanup.
