# Rental Questionnaire

Private tracker for prospective tenants. Next.js 15 + Supabase + Vercel.

## Setup

1. In your Supabase project, run `supabase/migrations/001_schema.sql` in the SQL editor. **It is destructive**: it drops and recreates all `rental_data_*` tables. Later `002+` files are incremental.
2. In Supabase → Authentication → Users → Add user (tick _Auto Confirm User_), create email `rental@kaminolabs.dev` with your password. At login you type just `rental` (any username without `@` is mapped to `<username>@kaminolabs.dev`). There is no sign-up page.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key. Set the same two variables in Vercel.
4. `npm install && npm run dev`

## Scripts

`dev`, `build`, `start`, `lint`, `typecheck`, `format`
