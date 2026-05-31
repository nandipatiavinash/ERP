# Security and Implementation Audit

## Current Build Health

- `npm run build`: passing.
- `npm run typecheck`: passing when run after build, not concurrently with build.
- No broken imports found in the audited app routes/components.

## Findings

- Authorization is currently role-name based in app code. RLS also uses `is_admin()` and `is_operator()`. This is functional but not dynamic RBAC.
- The `roles` table has a check constraint that only allows `admin` and `operator`, so custom roles cannot be created until an additive migration removes that constraint.
- Attendance is manual. Status is selected by users instead of being calculated from check-in/check-out and employee shift timing.
- Employees are missing `joining_date`, `shift_start`, and `shift_end`, so attendance cannot calculate overtime or half-day accurately.
- Server actions validate most payloads with Zod, but permission checks are still coarse.
- Sensitive keys are kept in `.env.local`, which is ignored. `.env.example` contains no secrets.
- Supabase RLS is enabled on core tables. New permission tables must also enable RLS and be readable only by authenticated active users.
- Reports and master pages use real Supabase data and show empty states. Some pages still use client-side filtering/pagination after fetching all rows, which is acceptable for current small data but should move to range queries as volume grows.

## Plan

1. Add an additive migration for employee shift fields, attendance calculated fields, permissions, and role permissions.
2. Seed common permissions and assign all permissions to admin.
3. Preserve existing role behavior by mapping operator to production/report/roll permissions.
4. Update TypeScript database types.
5. Replace manual attendance entry with check-in/check-out actions.
6. Add role management permission matrix.
7. Gradually replace fixed `requireRole()` checks with permission checks, starting with attendance, employees, users, roles, reports, production, sales, and inventory routes.

## OWASP Notes

- Broken access control: improve with permission checks on pages and server actions, not just hidden navigation.
- Injection: Supabase query builder and Zod validation are used; continue avoiding string-built SQL.
- Authentication: Supabase Auth is used, and app profile validation is active.
- Security logging: audit triggers exist; extend to permission and attendance changes.
- Misconfiguration: service role key must stay server-only and only in `.env.local`/deployment secrets.
