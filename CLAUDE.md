# Rental Questionnaire

Private tracker for prospective tenants of Arun's apartment (950 €/month + utilities).
Single-user, Spanish UI. Next.js 15 (App Router) + Supabase (auth + Postgres) on Vercel.

- All DB tables are prefixed `rental_data_`.
- Auth: Supabase email/password, with a username shortcut (`rental` → `rental@kaminolabs.dev`, see `toLoginEmail` in `actions.ts`); every route except `/login` is protected by `src/middleware.ts`. No public form.
- Schema: `supabase/migrations/001_schema.sql` is the **all-inclusive, destructive** from-scratch schema (drops and recreates everything). `002+` are incremental additions; whenever one is added, also fold it into `001` so 001 always stands alone.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).
- Code layout: `src/app` (pages + server actions in `actions.ts`), `src/components/ApplicantForm.tsx`, `src/lib` (Supabase client, types).

## Working Mode — Full Automation

The owner explicitly chose full automation for this repo: **commit and push straight to `main`, no pull requests, no approval prompts.** Do not ask "should I push?". The owner tests manually after changes land.

**Workflow-file status after coding:** when a `workflows/*.md` step's code is implemented in a session, do NOT mark it `done`. Use `in_progress` with a "pending manual testing" criteria note. Only flip to `done` once the owner confirms (or it was verified in a live running app).

## Working Process

Loop for any feature: **Design → Code → Test → Review**, with `workflows/*.md` as the single source of truth.

- **Design**: write settled decisions into the relevant `workflows/*.md` step (`Status: not_started`), detailed enough for a fresh session to build from. Undecided items go to `workflows/backlog.md` / `workflows/ideas.md`; cross-cutting observations to `workflows/notes.md`.
- **Code**: implement the step, set `Status: in_progress` with a pending-testing note.
- **Test**: the owner tests manually. Works → `done`. Bug → back to Code, append a "BUG FOUND + FIXED" note.
- **Review**: `REVIEW.md` in a dedicated session; waits for confirmation before pushing (the one exception to full automation).

Every decision lives in a workflow file or this CLAUDE.md, never only in chat. `RESYNC.md` keeps this documentation aligned with the code.
