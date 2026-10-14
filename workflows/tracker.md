# Feature: Applicant tracker

Private tracker for rental applicants (Spanish UI, single user, Supabase auth).

## Step 1: Schema
Status: in_progress
- `rental_data_applicants` table, RLS owner-only, `001_schema.sql` destructive/all-inclusive.
- Criteria: implemented; pending owner applying it to his Supabase project and testing.

## Step 2: Auth
Status: in_progress
- Email/password login, middleware protects all routes. User must be created manually in Supabase Auth dashboard (no sign-up page, by design).
- Criteria: implemented; pending manual testing.

## Step 3: List (with paragraph summary per applicant), search, filter by status
Status: in_progress
- Each row shows a generated Spanish paragraph (`summarize()` in `src/lib/applicants.ts`) built from all questionnaire fields, source, visit and notes.
- Criteria: implemented; pending manual testing.

## Step 4: Create / edit / delete applicant
Status: in_progress
- Form is split into three tabs: Cuestionario (first), Valoración (estado, valoración, contacto, visita, notas), Contacto (nombre, teléfono, email, origen). All tabs live in one form; a required field on a hidden tab switches to that tab.
- Criteria: implemented; pending manual testing.
