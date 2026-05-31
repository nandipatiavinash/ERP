# Polymer Fabric ERP

Production-ready starter ERP for a polymer fabric manufacturing company.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Supabase Auth
- Supabase PostgreSQL

## Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor or with Supabase CLI.
3. Copy `.env.example` to `.env.local` and fill Supabase values.
4. Install dependencies and run the app:

```bash
npm install
npm run dev
```

## First Admin

Create a user in Supabase Auth, then insert/update their profile row in `public.users` with the `admin` role. The migration creates the default `admin` and `operator` roles.
