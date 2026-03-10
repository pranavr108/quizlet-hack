# Project: Personal Quizlet Clone

## Vision
A private, AI-integrated flashcard app focused on long-term retention using spaced repetition.
Users can create decks, study cards, and generate flashcards from PDFs/text via Gemini AI.

## Tech Stack
- **Language**: TypeScript (strict mode — no `any`, no type assertions)
- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend/DB**: Supabase (Auth + Postgres + Row Level Security)
- **Validation**: Zod (schemas defined first, types derived from schemas)
- **Testing**: Vitest + React Testing Library
- **AI**: Gemini API (PDF/text → JSON flashcards)

## Project Structure
```
src/
  app/              # Next.js App Router pages
  components/       # React components
  lib/
    schemas/        # Zod schemas (source of truth)
    types/          # Types derived from schemas
    db/             # Supabase queries
    utils/          # Pure utility functions (SM-2, etc.)
  hooks/            # Custom React hooks
  __tests__/        # Test files (behavior-driven, no 1:1 mapping)
```

## Session Initialization
> **Claude: At the start of every session, do the following before any code:**
> 1. Read `CLAUDE.md` (already loaded) and `WIP.md` if it exists
> 2. Create `WIP.md` and `LEARNINGS.md` if they don't exist
> 3. Summarize the current state and the next unchecked task
> 4. Wait for explicit approval before writing any production code

---

## Phase 1: Schema Foundation
> **Goal**: Define all data shapes at trust boundaries before any logic or UI.
> **Claude: Complete all tasks in order. No Phase 2 work until Phase 1 is fully checked.**

- [x] Create `src/lib/schemas/card.schema.ts` — Zod schema for `Card`
- [x] Create `src/lib/schemas/deck.schema.ts` — Zod schema for `Deck`
- [x] Create `src/lib/schemas/index.ts` — re-export all schemas
- [x] Derive and export TypeScript types from schemas (no manual `type` definitions)
- [x] Write tests validating schema boundary behavior (valid input passes, invalid input throws)

**Card schema must include:**
- `id: uuid`
- `deckId: uuid`
- `front: string (min 1)`
- `back: string (min 1)`
- `interval: number (days, default 1)`
- `easeFactor: number (default 2.5)`
- `nextReviewAt: date`
- `createdAt: date`

**Deck schema must include:**
- `id: uuid`
- `userId: uuid`
- `name: string (min 1)`
- `description: string (optional)`
- `createdAt: date`

---

## Phase 2: Supabase Setup
> **Goal**: Database tables, RLS policies, and local dev environment configured.
> **Setup**: Use local Supabase via `supabase start` (Docker). Cloud project optional later.

- [x] Initialize Supabase project (`supabase init`)
- [x] Create migration: `decks` table (matches Deck schema)
- [x] Create migration: `cards` table (matches Card schema, FK to decks)
- [x] Enable Row Level Security on both tables
- [x] RLS policy: users can only read/write their own decks and cards
- [x] Create `src/lib/db/supabase.ts` — typed Supabase client
- [x] Write tests for RLS behavior using Supabase local emulator

---

## Phase 3: Auth Flow — SKIPPED
> **Skipped**: Single-user local app. Default user_id set on decks, RLS opened for all access.
> Auth can be added later if needed — schema is forward-compatible.

---

## Phase 4: Deck CRUD
> **Goal**: Users can create, read, update, and delete decks.

- [x] Write test: "User can create a deck named 'Biochemistry'"
- [x] Write test: "User sees their decks listed on the dashboard"
- [x] Write test: "User can delete a deck"
- [x] Implement `src/lib/db/decks.ts` — pure DB functions (createDeck, getDecks, deleteDeck)
- [x] Create `app/(dashboard)/decks/page.tsx` — deck list
- [x] Create `app/(dashboard)/decks/new/page.tsx` — create deck form
- [x] Deck cards show: name, card count, last studied date

---

## Phase 5: Card CRUD
> **Goal**: Users can add, edit, and delete cards within a deck.

- [x] Write test: "User can add a card with front and back text"
- [x] Write test: "User can edit an existing card"
- [x] Write test: "User can delete a card"
- [x] Implement `src/lib/db/cards.ts` — pure DB functions (createCard, updateCard, deleteCard)
- [x] Create `app/(dashboard)/decks/[deckId]/page.tsx` — card list view
- [x] Card flip preview on hover (CSS only, no JS)

---

## Phase 6: Study Engine (SM-2 Algorithm & UX Polish)
> **Goal**: Build a frictionless, keyboard-navigable study session with rich-text rendering and pure-function state management.
> **Claude: The SM-2 algorithm must remain a pure function. Flashcard UI must support touch devices and Markdown/LaTeX.**

- [x] Write test: "SM-2 increases interval on correct answer"
- [x] Write test: "SM-2 resets interval on incorrect answer"
- [x] Write test: "SM-2 adjusts ease factor based on quality rating (0–5)"
- [x] Write test: "SM-2 never returns easeFactor below 1.3"
- [x] Implement `src/lib/utils/sm2.ts` — pure SM-2 function
- [x] Write test: "Study session shows due cards in correct order"
- [x] Write test: "Study session state is immutable between card reviews"
- [x] Implement `src/hooks/useStudySession.ts` — immutable session state
- [x] Write test: "Markdown component renders LaTeX correctly (e.g., $v = \frac{V_{max}[S]}{K_m + [S]}$ for enzyme kinetics)"
- [x] Integrate `react-markdown` and `rehype-katex` into the Card display component.
- [x] Update card flip animation: remove CSS-only `:hover`, replace with React state (click/tap to flip) for mobile touch support.
- [x] Add global keyboard event listeners to the study view: `Spacebar` to flip, `1-4` keys to grade card difficulty.
- [x] Create `app/(dashboard)/study/[deckId]/page.tsx` — study view combining the above components.

**SM-2 function signature:**

```ts
type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

type SM2Input = {
  easeFactor: number;
  interval: number;
  quality: ReviewQuality;
};

type SM2Output = {
  easeFactor: number;
  interval: number;
  nextReviewAt: Date;
};

const calculateNextReview = (input: SM2Input): SM2Output => { ... }
---
```
## Phase 7: AI Flashcard Generator & Async UI
> ** Goal : Users can upload a PDF or paste text, and Gemini generates formatted flashcards. The UI must gracefully handle long network requests and API errors. **
> **Claude: All Gemini responses must be validated through the Zod schema. Build robust loading and error states.**

- [x] Write test: "Generator returns valid Card[] from structured text"

- [x] Write test: "Generator rejects malformed Gemini response (schema validation)"

- [x] Create src/lib/utils/gemini.ts — Gemini API client (PDF + text input)

- [x] Update Gemini prompt instructions:
Return only valid JSON array of { front, back } objects.

Use Markdown for complex biological pathways (e.g., bolding key enteric neuron signaling molecules).

Wrap all mathematical or chemical formulas in standard LaTeX delimiters.

- [x] Parse and validate Gemini output through Zod before any DB write.

- [x] Write test: "Generator UI displays skeleton loader while awaiting API response"

- [x] Implement Shadcn UI / Radix primitives for user feedback (e.g., a Toast notification for "Successfully generated 15 cards" or "Error: Failed to parse document").

- [x] Create app/(dashboard)/decks/[deckId]/generate/page.tsx — generator UI with Suspense boundaries.

- [x] Support both: paste text and upload PDF (client-side PDF → text extraction).
**Environment variables required:**
```
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```


## Phase 8: Polish & Deployment
> **Goal**: Deploy the application to production securely, ensuring database migrations sync correctly and environment variables are protected.
> **Claude: Ensure strict typing is maintained in the CI/CD pipeline and no production secrets are committed.**

- [x] Create a production project in the Supabase Dashboard.
- [x] Link your local Supabase instance to the remote project using `supabase link --project-ref <YOUR-PROJECT-ID>`.
- [x] Push local database migrations to the production database using `supabase db push`.
- [ ] Configure Supabase Authentication (optional, if transitioning from single-user local) to ensure Row Level Security (RLS) protects the cloud database.
- [ ] Create a Vercel project and link it to your GitHub repository.
- [ ] Add all required Production Environment Variables directly in the Vercel Dashboard before the first deployment:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
- [x] Write a GitHub Actions workflow `.github/workflows/test.yml` to run Vitest before Vercel triggers a build.
- [ ] Trigger the initial production deployment on Vercel and verify that the LLM generator UI correctly proxies requests through the Next.js server to protect the Gemini API key.

## Definition of Done (per feature)
- [ ] Failing test written first
- [ ] Minimum code written to pass test
- [ ] Refactor assessed (only applied if adds clear value)
- [ ] No `any` types introduced
- [ ] LEARNINGS.md updated if anything surprising was discovered
- [ ] Commit approved before running `git commit`

---

## Deferred / Out of Scope (v1)
- Social features (sharing decks)
- Mobile app
- Multiple AI providers
- Stripe / payments
