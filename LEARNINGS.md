# Learnings

> Capture surprises, gotchas, decisions, and patterns discovered during development.

## Decisions
- **Auth skipped**: Single-user local app doesn't need auth. `decks.user_id` defaults to `00000000-0000-0000-0000-000000000000`. RLS policies replaced with open access. Schema is forward-compatible if auth is added later.
- **Dropped user_id FK**: The default user_id UUID doesn't exist in `auth.users`, so the FK constraint had to be dropped for inserts to work without auth.
- **Delete filter for UUIDs**: `.delete().neq('id', '')` doesn't match UUID columns. Use `.delete().gte('created_at', '1970-01-01')` to delete all rows.
- **UI Architecture Shift**: Transitioned from CSS-only hover states for card flips to React state (click/tap) to ensure mobile touch support. Added Radix/Shadcn UI requirements to avoid writing boilerplate UI components from scratch.
- **Rich Text Support**: Added `react-markdown` and `rehype-katex` to support complex biological formulas and LaTeX in flashcards, moving beyond plain string text.
- **React Hooks Ordering**: When adding `useEffect`/`useCallback` to a component with an early return, all hooks must be declared before any early return to satisfy React's rules of hooks. Guard the effect body with a conditional instead.
- **KaTeX block math in jsdom**: `$$...$$` must have newlines around the expression (e.g., `$$\nE = mc^2\n$$`) for `remark-math` to recognize it as display math and produce `.katex-display`.
