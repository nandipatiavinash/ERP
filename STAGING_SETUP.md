# ERP System - Staging Environment & Recent Changes Guide

> **Last Updated:** July 2026
> Conversation ID: e8838207-da78-4a8b-9e89-737debd7ddb4
> This document captures everything set up in this session for the RK Global ERP system.
> New agents should read this fully before making any changes.

---

## 1. Project Overview

**App:** Polymer Fabric ERP (Next.js 15, Supabase, Vercel)
**GitHub Repo:** https://github.com/nandipatiavinash/ERP
**Production URL:** https://erp-xi-rose.vercel.app
**Tech Stack:** Next.js 15.5.9, Supabase (PostgreSQL), Vercel, TypeScript

---

## 2. Two Environments: Production vs Staging

We set up two completely isolated environments during this session:

| | Production | Staging |
|---|---|---|
| **Purpose** | Live business operations | Safe testing and development |
| **GitHub Branch** | `main` | `staging` |
| **Vercel Target** | Production | Preview (GitHub-triggered) |
| **Supabase Project** | `pdgnbjiswfvladuhltcx` | `ywoygyqtoyxygftqkcbk` |
| **Supabase URL** | `https://pdgnbjiswfvladuhltcx.supabase.co` | `https://ywoygyqtoyxygftqkcbk.supabase.co` |
| **DB Password** | `<PROD_DB_PASSWORD>` | `<STAGING_DB_PASSWORD>` |

**RULE: NEVER push directly to `main`. Always commit to `staging` first, test, then merge.**

---

## 3. Vercel Environment Variables Setup

### How to deploy correctly
The ONLY correct way to deploy staging is via **git push to the staging branch**:

```bash
git checkout staging
# make changes
git add .
git commit -m "your message"
git push origin staging   # <-- This triggers Vercel automatically with correct env vars
```

Do NOT use `npx vercel --yes` from the CLI for staging — CLI deployments do not
properly inject branch-scoped environment variables.

### Variables configured in Vercel

**Production environment** (used when `main` branch is deployed):
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pdgnbjiswfvladuhltcx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key |

**Preview environment** (used for ALL non-main branch deployments, including staging):
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ywoygyqtoyxygftqkcbk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<STAGING_SUPABASE_ANON_KEY>` |
| `SUPABASE_SERVICE_ROLE_KEY` | `<STAGING_SUPABASE_SERVICE_ROLE_KEY>` |

---

## 4. Staging Database Details

- **Project ID:** `ywoygyqtoyxygftqkcbk`
- **Region:** ap-northeast-1 (Tokyo)
- **Pooler URL:** `postgresql://postgres.ywoygyqtoyxygftqkcbk:<DB_PASSWORD>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`

### Staging Login Credentials
All production users were cloned to staging with reset passwords:
- **Email:** Same as production
- **Password:** `password123` (for all users on staging)

---

## 5. Migration Fixes Applied (staging branch)

When setting up staging, the following bugs were found and fixed in migration files.
These fixes exist only on the `staging` branch. When merging to `main`, include them.

### supabase/migrations/001_initial_schema.sql

| Fix | Reason |
|---|---|
| Added `permissions`, `role_permissions` tables and `has_permission()` function | These were accidentally deleted from migrations |
| Added `UNIQUE (module, action)` on `permissions` | Required for `ON CONFLICT` upserts in later migrations |
| **Removed `CHECK` constraint on `roles.name`** | Original constraint only allowed `admin` and `operator`. Removed to support dynamic roles (supervisor, labour, accounts, etc.) |
| Moved `joining_date`, `shift_start`, `shift_end` into `employees` table definition | Were added via `ALTER TABLE` later which caused dependency errors |
| Moved `check_in_at`, `check_out_at`, `working_hours`, `overtime_hours` into `attendance` definition | Same reason as above |

### supabase/migrations/003_add_linked_customer_id.sql

| Fix | Reason |
|---|---|
| Commented out hardcoded `INSERT`/`DELETE` statements | Referenced specific production UUIDs that do not exist in a fresh database |

### supabase/migrations/005_cleanup_duplicate_journal_entries.sql

| Fix | Reason |
|---|---|
| Replaced Windows-1252 em-dash (byte 0x97) with ASCII dash | PostgreSQL rejected the file due to non-UTF-8 encoding |

---

## 6. Dynamic Roles Feature

During this session, we identified that the roles system needed to support dynamic roles
beyond just `admin` and `operator`. The `CHECK` constraint in the `roles` table was
removed to allow any string as a role name. The `/admin/permissions` page in the app
allows managing roles and permissions dynamically.

---

## 7. Initial Data Clone (Production -> Staging)

We cloned all production data to staging using a Node.js script. The process:

1. Reset staging schema with `npx supabase db reset`
2. Disabled user triggers via SQL to prevent side-effects during bulk insert
3. Ran `clone_data.mjs` which:
   - Reads schema column definitions from `src/lib/database.types.ts`
   - Fetches all rows table-by-table from production Supabase
   - Inserts them into staging Supabase
   - Handles circular FK (users <-> customers) by inserting nulls first, then updating
   - Skips generated/computed columns
4. Re-enabled triggers

The cloning scripts (`clone_data.mjs`, `disable_triggers.sql`, `enable_triggers.sql`)
were temporary and deleted after use.

### To re-clone staging from production in the future:

```bash
# Step 1: Reset staging schema
npx supabase db reset --yes --db-url "postgresql://postgres.ywoygyqtoyxygftqkcbk:reNykdHvUmXDZQ21@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Step 2: Recreate the cloning scripts (see conversation history)
# and run: node clone_data.mjs
```

---

## 8. Database Schema Commands

### Apply schema changes to staging only
```bash
npx supabase db push --db-url "postgresql://postgres.ywoygyqtoyxygftqkcbk:reNykdHvUmXDZQ21@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Full reset of staging (drops all tables, re-applies all migrations)
```bash
npx supabase db reset --yes --db-url "postgresql://postgres.ywoygyqtoyxygftqkcbk:reNykdHvUmXDZQ21@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Apply to production (caution!)
```bash
npx supabase db push --db-url "postgresql://postgres.pdgnbjiswfvladuhltcx:iQTtmLtTqAeuXRlu@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

---

## 9. Checking Vercel Logs

```bash
# View recent errors with full stack traces
npx vercel logs --expand -n 20

# Stream live logs
npx vercel logs --follow

# Only error level logs
npx vercel logs --level error
```

---

## 10. Common Error Reference

| Error | Cause | Fix |
|---|---|---|
| `Your project URL and Key are required` | Supabase env vars missing at build time | Push via git, not CLI. Ensure Preview env vars are set in Vercel. |
| `migration failed: column already exists` | Migration applied twice or columns defined twice | Check for duplicate `ALTER TABLE` vs inline column definitions |
| `invalid byte sequence for encoding UTF8` | Non-UTF-8 characters in SQL file | Open file in hex editor, find 0x97/0x93/0x94, replace with ASCII |
| `violates foreign key constraint` | Circular FK during data insert | Disable triggers, insert nulls for FK refs, insert referenced rows, then update |

---

## 11. Production Database (Read-Only Reference)

**WARNING: NEVER run DROP, TRUNCATE, or unfiltered DELETE on production.**

- **Project ID:** `pdgnbjiswfvladuhltcx`
- **URL:** `https://pdgnbjiswfvladuhltcx.supabase.co`
- **Pooler:** `postgresql://postgres.pdgnbjiswfvladuhltcx:iQTtmLtTqAeuXRlu@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`
