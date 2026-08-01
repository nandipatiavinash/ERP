# 02 Database

## accounts_journal

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2036)-2048: `accounts_journal`

```sql
CREATE TABLE IF NOT EXISTS public.accounts_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    account_name TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2051)-2053: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journal" ON public.accounts_journal;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2083)-2088: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;


-- --- START OF MIGRATION: 020_add_journal_no.sql ---
-- Migration: Add journal_no to accounts_journal
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2088)-2093: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;


-- --- START OF MIGRATION: 021_change_is_internal_to_text.sql ---
-- Migration: Change is_internal column of customers from BOOLEAN to TEXT with account types
ALTER TABLE public.customers ALTER COLUMN is_internal DROP DEFAULT;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2131)-2132: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2245)-2246: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
  DROP CONSTRAINT IF EXISTS accounts_journal_account_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2248)-2249: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
  ADD CONSTRAINT accounts_journal_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.customers(id) ON DELETE CASCADE;
```

- [supabase/migrations/003_add_linked_customer_id.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/003_add_linked_customer_id.sql:2)-7: `customers`

```sql
ALTER TABLE public.customers ADD COLUMN linked_customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

/* Safely migrate any journal entries from suffix accounts to parent accounts
UPDATE public.accounts_journal
SET account_id = '6230c75e-3538-4585-81b0-6f2e4dc5a655', account_name = 'SREE NAGANATHA PLASTICS'
WHERE account_id = '27cbfc61-4a3f-4a3c-a59f-10329c6b1d3e';
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2126)-2132: `idx_sales_orders_billing_status_date`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;


-- --- START OF MIGRATION: 024_add_account_id_to_journal.sql ---
-- 1. Add account_id column referencing customers
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2144)-2146: `idx_accounts_journal_account_id`

```sql
CREATE INDEX IF NOT EXISTS idx_accounts_journal_account_id 
ON public.accounts_journal(account_id) 
WHERE deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2974)-2976: `idx_accounts_journal_journal_no_desc`

```sql
CREATE INDEX IF NOT EXISTS idx_accounts_journal_journal_no_desc 
ON public.accounts_journal (journal_no DESC NULLS LAST) 
WHERE deleted_at IS NULL;
```

- [supabase/migrations/004_journal_no_unique_and_indexes.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/004_journal_no_unique_and_indexes.sql:11)-13: `idx_accounts_journal_entry_date`

```sql
CREATE INDEX IF NOT EXISTS idx_accounts_journal_entry_date
  ON public.accounts_journal (entry_date)
  WHERE deleted_at IS NULL;
```

- [supabase/migrations/004_journal_no_unique_and_indexes.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/004_journal_no_unique_and_indexes.sql:16)-18: `idx_accounts_journal_account_name`

```sql
CREATE INDEX IF NOT EXISTS idx_accounts_journal_account_name
  ON public.accounts_journal (account_name)
  WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2055)-2061: `Allow read access to permitted users on accounts_journal`

```sql
CREATE POLICY "Allow read access to permitted users on accounts_journal"
ON public.accounts_journal FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2065)-2074: `Allow write access to permitted users on accounts_journal`

```sql
CREATE POLICY "Allow write access to permitted users on accounts_journal"
ON public.accounts_journal FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:211)-221: `accounts_journal read permitted`

```sql
CREATE POLICY "accounts_journal read permitted" ON public.accounts_journal
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.view')
  OR public.has_permission('reports.view')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:224)-241: `accounts_journal write permitted`

```sql
CREATE POLICY "accounts_journal write permitted" ON public.accounts_journal
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.edit')
);
```

### Triggers

Not found in source code.

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3007)-3022: `get_opening_balance`

```sql
CREATE OR REPLACE FUNCTION public.get_opening_balance(p_account_id uuid, p_from_date date)
RETURNS TABLE (
  total_debit numeric,
  total_credit numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
    COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit
  FROM public.accounts_journal
  WHERE account_id = p_account_id
    AND entry_date < p_from_date
    AND deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3026)-3045: `get_accounts_journal_summary_by_date`

```sql
CREATE OR REPLACE FUNCTION public.get_accounts_journal_summary_by_date(p_date date)
RETURNS TABLE (
  account_id uuid,
  account_name text,
  entry_type text,
  amount numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    aj.account_id,
    aj.account_name,
    aj.entry_type,
    SUM(aj.amount) AS amount
  FROM public.accounts_journal aj
  WHERE aj.entry_date <= p_date
    AND aj.deleted_at IS NULL
  GROUP BY aj.account_id, aj.account_name, aj.entry_type;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:55): `measure("Fetch journal entries (eq date)", supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:179): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:185): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:53): `.from("accounts_journal")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:61): `.from("accounts_journal")`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:19): `.from("accounts_journal")`
- [scratch/find-polysquare-lldp.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-polysquare-lldp.mjs:24): `.from("accounts_journal")`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:34): `const { data: aj } = await supabase.from("accounts_journal").select("*").eq("description", "73");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:38): `const { data: aj2 } = await supabase.from("accounts_journal").select("*").ilike("description", "73 (%");`
- [scratch/inspect_exact_order_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_exact_order_journal.mjs:23): `.from("accounts_journal")`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:23): `.from("accounts_journal")`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:22): `const { data: list1 } = await supabase.from("accounts_journal").select("*").eq("amount", 1147814);`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:26): `const { data: list2 } = await supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-12");`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:23): `.from("accounts_journal")`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:28): `.from("accounts_journal")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:25): `.from("accounts_journal")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:113): `.from("accounts_journal")`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:22): `.from("accounts_journal")`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:76): `const { data, error } = await supabase.from("accounts_journal").insert(journalInserts).select();`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:553): `.from("accounts_journal")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:571): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:578): `.from("accounts_journal")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:584): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:589): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:595): `const { error: jdErr } = await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:72): `.from("accounts_journal")`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:24): `const { data, error } = await supabase.from("accounts_journal").insert({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:172): `.from("accounts_journal")`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:59): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:97): `const { error: insertError } = await (supabase.from("accounts_journal") as any).insert(inserts);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:110): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:129): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:151): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:528): `await (adminSupabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:623): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:635): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:644): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:95): `await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:144): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:152): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:650): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:665): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:732): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:740): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:881): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:948): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1058): `const { error: journalErr } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1080): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1107): `.from("accounts_journal") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1513): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1560): `const { error: adjError } = await (supabase.from("accounts_journal") as any).insert(adjJournalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1590): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1592): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", adjJournalNo);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:50): `.from("accounts_journal")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:79): `.from("accounts_journal")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:36): `.from("accounts_journal")`

## attendance

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:112)-129: `attendance`

```sql
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  attendance_date date not null default current_date,
  check_in time,
  check_out time,
  check_in_at timestamptz,
  check_out_at timestamptz,
  working_hours numeric(8,2) default 0,
  overtime_hours numeric(8,2) default 0,
  status text not null check (status in ('present', 'absent', 'half_day', 'leave')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (employee_id, attendance_date)
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:539)-540: `employees`

```sql
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:540)-541: `attendance`

```sql
alter table public.attendance enable row level security;
alter table public.customers enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1166)-1167: `employees`

```sql
alter table public.employees drop constraint if exists employees_employee_code_key;
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1167)-1170: `attendance`

```sql
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;

-- Create unique indexes that only apply to active (non-deleted) records
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1778)-1782: `attendance`

```sql
ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS check_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS check_out_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS working_hours NUMERIC(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overtime_hours NUMERIC(8,2) DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2195)-2196: `attendance`

```sql
ALTER TABLE public.attendance
  DROP CONSTRAINT IF EXISTS attendance_employee_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2198)-2199: `attendance`

```sql
ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:529)-530: `idx_sales_date`

```sql
create index idx_sales_date on public.sales_orders (order_date desc) where deleted_at is null;
create index idx_attendance_date on public.attendance (attendance_date desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:530)-532: `idx_attendance_date`

```sql
create index idx_attendance_date on public.attendance (attendance_date desc) where deleted_at is null;

alter table public.roles enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:755)-757: `idx_attendance_date_employee`

```sql
create index if not exists idx_attendance_date_employee
on public.attendance (attendance_date desc, employee_id)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1172)-1173: `idx_employees_employee_code_unique`

```sql
create unique index if not exists idx_employees_employee_code_unique on public.employees (employee_code) where deleted_at is null;
create unique index if not exists idx_attendance_employee_date_unique on public.attendance (employee_id, attendance_date) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1173)-1182: `idx_attendance_employee_date_unique`

```sql
create unique index if not exists idx_attendance_employee_date_unique on public.attendance (employee_id, attendance_date) where deleted_at is null;


-- --- START OF MIGRATION: 009_fabric_roll_serial_naming.sql ---
create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1428)-1429: `idx_sales_orders_customer`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1429)-1438: `idx_attendance_date`

```sql
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);


-- --- START OF MIGRATION: 012_use_production_serial_for_rolls.sql ---
-- Migration: Use Production Entry Serial Number as Roll/Stock Number and Drop Audit Triggers
-- Relates to: Using the serial number generated on production entry as the universal roll/stock number,
-- and removing all legacy audit triggers since the audit_logs table was removed.

-- 1. Drop all legacy audit triggers to avoid 'public.audit_logs does not exist' errors
DROP TRIGGER IF EXISTS audit_roles ON public.roles CASCADE;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:567)-569: `masters admin write customers`

```sql
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:569)-570: `attendance read active users`

```sql
create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:570)-572: `attendance admin write`

```sql
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());

create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:591)-606: `audit insert active users`

```sql
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);


-- --- START OF MIGRATION: 002_attendance_permissions.sql ---

-- 1. Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:712)-715: `attendance permission write`

```sql
create policy "attendance permission write" on public.attendance
for all
using (public.is_admin() or public.has_permission('attendance.edit'))
with check (public.is_admin() or public.has_permission('attendance.create') or public.has_permission('attendance.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:793)-797: `attendance read permission scoped`

```sql
create policy "attendance read permission scoped" on public.attendance
for select using (
  public.has_permission('attendance.view')
  and public.can_manage_attendance_for(employee_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:800)-805: `attendance insert permission scoped`

```sql
create policy "attendance insert permission scoped" on public.attendance
for insert
with check (
  public.has_permission('attendance.create')
  and public.can_manage_attendance_for(employee_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:808)-817: `attendance update permission scoped`

```sql
create policy "attendance update permission scoped" on public.attendance
for update
using (
  public.has_permission('attendance.edit')
  and public.can_manage_attendance_for(employee_id)
)
with check (
  public.has_permission('attendance.edit')
  and public.can_manage_attendance_for(employee_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:826)-837: `employees read permission scoped`

```sql
create policy "employees read permission scoped" on public.employees
for select using (
  deleted_at is null
  and (
    public.has_permission('employees.view')
    or (
      public.has_permission('attendance.view')
      and public.can_manage_attendance_for(id)
    )
    or user_id = auth.uid()
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:497)-498: `touch_employees`

```sql
create trigger touch_employees before update on public.employees for each row execute function public.touch_updated_at();
create trigger touch_attendance before update on public.attendance for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:498)-499: `touch_attendance`

```sql
create trigger touch_attendance before update on public.attendance for each row execute function public.touch_updated_at();
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:517)-518: `audit_employees`

```sql
create trigger audit_employees after insert or update on public.employees for each row execute function public.audit_row_change();
create trigger audit_attendance after insert or update on public.attendance for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:518)-519: `audit_attendance`

```sql
create trigger audit_attendance after insert or update on public.attendance for each row execute function public.audit_row_change();
create trigger audit_customers after insert or update on public.customers for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:771)-788: `can_manage_attendance_for`

```sql
create or replace function public.can_manage_attendance_for(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or public.has_permission('employees.view')
    or exists (
      select 1
      from public.employees e
      where e.id = target_employee_id
        and e.user_id = auth.uid()
        and e.status = 'active'
        and e.deleted_at is null
    )
$$;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1007)-1012: `calculate_attendance`

```sql
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1071)-1076: `calculate_attendance`

```sql
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:70): `.from("attendance")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:88): `.from("attendance")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:94): `await supabase.from("attendance").delete().eq("id", attendance.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:100): `const { error: dAttErr } = await supabase.from("attendance").delete().eq("id", attendance.id);`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:24): `const { data: existing, error: readError } = await (supabase.from("attendance") as any)`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:35): `? (supabase.from("attendance") as any).update({`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:42): `: (supabase.from("attendance") as any).insert({`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:66): `const { data: existing, error: readError } = await (supabase.from("attendance") as any)`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:78): `const { error } = await (supabase.from("attendance") as any)`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:111): `.from("attendance")`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:123): `.from("attendance")`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`

## audit_logs

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:210)-219: `audit_logs`

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  action text not null,
  module text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:733)-742: `audit_logs`

```sql
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  module text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:544)-545: `sales_orders`

```sql
alter table public.sales_orders enable row level security;
alter table public.audit_logs enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:545)-547: `audit_logs`

```sql
alter table public.audit_logs enable row level security;

create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1429)-1438: `idx_attendance_date`

```sql
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);


-- --- START OF MIGRATION: 012_use_production_serial_for_rolls.sql ---
-- Migration: Use Production Entry Serial Number as Roll/Stock Number and Drop Audit Triggers
-- Relates to: Using the serial number generated on production entry as the universal roll/stock number,
-- and removing all legacy audit triggers since the audit_logs table was removed.

-- 1. Drop all legacy audit triggers to avoid 'public.audit_logs does not exist' errors
DROP TRIGGER IF EXISTS audit_roles ON public.roles CASCADE;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:588)-590: `sales admin write`

```sql
create policy "sales admin write" on public.sales_orders for all using (public.is_admin()) with check (public.is_admin());

create policy "audit read admin" on public.audit_logs for select using (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:590)-591: `audit read admin`

```sql
create policy "audit read admin" on public.audit_logs for select using (public.is_admin());
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:591)-606: `audit insert active users`

```sql
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);


-- --- START OF MIGRATION: 002_attendance_permissions.sql ---

-- 1. Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:821)-822: `audit read permitted users`

```sql
create policy "audit read permitted users" on public.audit_logs
for select using (public.is_admin() or public.has_permission('audit_logs.view'));
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

Not found in source code.

## client_order_items

### Schema Definition

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:19)-29: `client_order_items`

```sql
CREATE TABLE IF NOT EXISTS public.client_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.client_orders(id) ON DELETE CASCADE,
  item_type       TEXT NOT NULL CHECK (item_type IN ('fabric', 'finishing')),
  fabric_type_id  UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  finishing_product_id UUID REFERENCES public.finishing_products(id) ON DELETE SET NULL,
  quantity        NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit            TEXT NOT NULL DEFAULT 'pcs',
  unit_price      NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Alterations / FK / Constraints

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:42)-43: `client_orders`

```sql
ALTER TABLE public.client_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_order_items ENABLE ROW LEVEL SECURITY;
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:43)-46: `client_order_items`

```sql
ALTER TABLE public.client_order_items ENABLE ROW LEVEL SECURITY;

-- Admin / internal staff can read all
DROP POLICY IF EXISTS "client_orders_internal_all" ON public.client_orders;
```

- [supabase/migrations/048_add_production_fields_to_client_order_items.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/048_add_production_fields_to_client_order_items.sql:4)-10: `client_order_items`

```sql
ALTER TABLE public.client_order_items 
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT,
  ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:53)-61: `client_order_items_internal_all`

```sql
CREATE POLICY "client_order_items_internal_all" ON public.client_order_items
  FOR ALL TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.client_orders
      WHERE public.is_internal_staff()
        OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:87): `.from("client_order_items") as any)`

## client_orders

### Schema Definition

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:5)-16: `client_orders`

```sql
CREATE TABLE IF NOT EXISTS public.client_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number  TEXT NOT NULL UNIQUE,
  customer_id   UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  order_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  notes         TEXT,
  created_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:42)-43: `client_orders`

```sql
ALTER TABLE public.client_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_order_items ENABLE ROW LEVEL SECURITY;
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:43)-46: `client_order_items`

```sql
ALTER TABLE public.client_order_items ENABLE ROW LEVEL SECURITY;

-- Admin / internal staff can read all
DROP POLICY IF EXISTS "client_orders_internal_all" ON public.client_orders;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:47)-50: `client_orders_internal_all`

```sql
CREATE POLICY "client_orders_internal_all" ON public.client_orders
  FOR ALL TO authenticated
  USING (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()))
  WITH CHECK (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()));
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:53)-61: `client_order_items_internal_all`

```sql
CREATE POLICY "client_order_items_internal_all" ON public.client_order_items
  FOR ALL TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.client_orders
      WHERE public.is_internal_staff()
        OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

### Triggers

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:37)-39: `client_orders_touch_updated_at`

```sql
CREATE TRIGGER client_orders_touch_updated_at
  BEFORE UPDATE ON public.client_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_client_orders_updated_at();
```

### Views / RPCs

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:32)-34: `touch_client_orders_updated_at`

```sql
CREATE OR REPLACE FUNCTION public.touch_client_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
```

### Runtime Read/Write/Update/Delete Evidence

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:54): `.from("client_orders") as any)`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:109): `.from("client_orders")`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:170): `.from("client_orders") as any)`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:189): `.from("client_orders") as any)`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:14): `.from("client_orders")`

## customers

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:131)-143: `customers`

```sql
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text,
  gst_number text,
  address text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:540)-541: `attendance`

```sql
alter table public.attendance enable row level security;
alter table public.customers enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:541)-542: `customers`

```sql
alter table public.customers enable row level security;
alter table public.loom_production_entries enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1309)-1311: `customers`

```sql
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS alias TEXT,
ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT false;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2088)-2093: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;


-- --- START OF MIGRATION: 021_change_is_internal_to_text.sql ---
-- Migration: Change is_internal column of customers from BOOLEAN to TEXT with account types
ALTER TABLE public.customers ALTER COLUMN is_internal DROP DEFAULT;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2093)-2097: `customers`

```sql
ALTER TABLE public.customers ALTER COLUMN is_internal DROP DEFAULT;

ALTER TABLE public.customers 
  ALTER COLUMN is_internal TYPE TEXT 
  USING (CASE WHEN is_internal::text = 'true' THEN 'profit and loss a/c' ELSE 'client a/c' END);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2095)-2097: `customers`

```sql
ALTER TABLE public.customers 
  ALTER COLUMN is_internal TYPE TEXT 
  USING (CASE WHEN is_internal::text = 'true' THEN 'profit and loss a/c' ELSE 'client a/c' END);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2099)-2106: `customers`

```sql
ALTER TABLE public.customers ALTER COLUMN is_internal SET DEFAULT 'client a/c';


-- --- START OF MIGRATION: 022_add_billing_to_sales_orders.sql ---
-- Migration: Add billing fields to sales_orders for Sales Entry workflow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS bill_number TEXT,
ADD COLUMN IF NOT EXISTS bill_value NUMERIC(14,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2131)-2132: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2226)-2228: `sales_orders`

```sql
ALTER TABLE public.sales_orders
  ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  ADD CONSTRAINT sales_orders_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2248)-2249: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
  ADD CONSTRAINT accounts_journal_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.customers(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2260)-2267: `sales_orders`

```sql
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;


-- --- START OF MIGRATION: 028_add_opening_balances_to_customers.sql ---
-- Migration: Add opening balances to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS opening_debit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS opening_credit NUMERIC(12,2) NOT NULL DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2265)-2267: `customers`

```sql
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS opening_debit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS opening_credit NUMERIC(12,2) NOT NULL DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2405)-2406: `roto_products`

```sql
ALTER TABLE public.roto_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2409)-2410: `offset_products`

```sql
ALTER TABLE public.offset_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/003_add_linked_customer_id.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/003_add_linked_customer_id.sql:2)-7: `customers`

```sql
ALTER TABLE public.customers ADD COLUMN linked_customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

/* Safely migrate any journal entries from suffix accounts to parent accounts
UPDATE public.accounts_journal
SET account_id = '6230c75e-3538-4585-81b0-6f2e4dc5a655', account_name = 'SREE NAGANATHA PLASTICS'
WHERE account_id = '27cbfc61-4a3f-4a3c-a59f-10329c6b1d3e';
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:9)-10: `users`

```sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:13)-15: `fabric_types`

```sql
ALTER TABLE public.fabric_types
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:18)-22: `finishing_products`

```sql
ALTER TABLE public.finishing_products
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2126)-2132: `idx_sales_orders_billing_status_date`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;


-- --- START OF MIGRATION: 024_add_account_id_to_journal.sql ---
-- 1. Add account_id column referencing customers
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);
```

- [supabase/migrations/004_journal_no_unique_and_indexes.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/004_journal_no_unique_and_indexes.sql:26)-28: `idx_customers_is_internal`

```sql
CREATE INDEX IF NOT EXISTS idx_customers_is_internal
  ON public.customers (is_internal)
  WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:565)-566: `masters admin write employees`

```sql
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:566)-567: `masters read active users customers`

```sql
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:567)-569: `masters admin write customers`

```sql
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:705)-708: `customers permission write`

```sql
create policy "customers permission write" on public.customers
for all
using (public.is_admin() or public.has_permission('customers.edit') or public.has_permission('customers.delete'))
with check (public.is_admin() or public.has_permission('customers.create') or public.has_permission('customers.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:915)-923: `customers read permitted users`

```sql
create policy "customers read permitted users" on public.customers
for select using (
  deleted_at is null
  and (
    public.has_permission('customers.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3153)-3156: `rolls read authenticated`

```sql
CREATE POLICY "rolls read authenticated" ON public.fabric_rolls FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 6. Relax SELECT policies on customers
DROP POLICY IF EXISTS "customers read permitted users" ON public.customers;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3158)-3161: `customers read authenticated`

```sql
CREATE POLICY "customers read authenticated" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 7. Relax SELECT policies on loom_production_entries
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:272)-285: `customers permission write`

```sql
CREATE POLICY "customers permission write" ON public.customers
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('customers.edit')
  OR public.has_permission('customers.delete')
  OR public.has_permission('reports.opening_balance')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('customers.create')
  OR public.has_permission('customers.edit')
  OR public.has_permission('reports.opening_balance')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:498)-499: `touch_attendance`

```sql
create trigger touch_attendance before update on public.attendance for each row execute function public.touch_updated_at();
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:499)-500: `touch_customers`

```sql
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
create trigger touch_production before update on public.loom_production_entries for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:518)-519: `audit_attendance`

```sql
create trigger audit_attendance after insert or update on public.attendance for each row execute function public.audit_row_change();
create trigger audit_customers after insert or update on public.customers for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:519)-520: `audit_customers`

```sql
create trigger audit_customers after insert or update on public.customers for each row execute function public.audit_row_change();
create trigger audit_production after insert or update on public.loom_production_entries for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1648)-1691: `get_roll_allocations_for_fabric`

```sql
create or replace function public.get_roll_allocations_for_fabric(p_fabric_type_id uuid)
returns table (
  roll_id uuid,
  dispatch_date date,
  client_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (allocation.roll_id)
    allocation.roll_id,
    allocation.dispatch_date,
    allocation.client_name
  from (
    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_orders so on so.selected_roll_ids @> array[fr.id]::uuid[]
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'

    union all

    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_order_items soi on soi.selected_roll_ids @> array[fr.id]::uuid[]
    join public.sales_orders so on so.id = soi.sales_order_id
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'
  ) allocation
  order by allocation.roll_id, allocation.dispatch_date desc;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:56): `measure("Fetch active customers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:70): `measure("Fetch active suppliers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:238): `measure("Fetch customers list", supabase.from("customers").select("*").is("deleted_at", null).order("customer_name"))`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:46): `.from("customers")`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:24): `.from("customers")`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:36): `const { data: salesAc } = await supabase.from("customers").select("*").ilike("customer_name", "Sales A/c").maybeSingle();`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:40): `const { data: custMatch } = await supabase.from("customers").select("*").eq("id", order.customer_id).maybeSingle();`
- [scratch/inspect_sales_ac.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sales_ac.mjs:22): `const { data: cust } = await supabase.from("customers").select("*").eq("id", "9712f58b-5514-4acf-a837-971c46cdefa2");`
- [scratch/inspect_sales_ac.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sales_ac.mjs:26): `const { data: list } = await supabase.from("customers").select("*").ilike("customer_name", "%Sales%");`
- [scratch/inspect_sv_polytech_rows.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sv_polytech_rows.mjs:23): `.from("customers")`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:10): `.from("customers")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:61): `.from("customers")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:77): `.from("customers")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:113): `.from("customers")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:137): `await supabase.from("customers").delete().eq("id", custId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:155): `await supabase.from("customers").delete().eq("id", custId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:174): `await supabase.from("customers").delete().eq("id", custId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:189): `await supabase.from("customers").delete().eq("id", custId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:197): `const { error: dCustErr } = await supabase.from("customers").delete().eq("id", custId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:539): `.from("customers")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:566): `await supabase.from("customers").delete().eq("id", accountId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:572): `await supabase.from("customers").delete().eq("id", accountId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:585): `await supabase.from("customers").delete().eq("id", accountId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:590): `await supabase.from("customers").delete().eq("id", accountId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:596): `const { error: cdErr } = await supabase.from("customers").delete().eq("id", accountId);`
- [scratch/test-material-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-material-sales.mjs:25): `.from("customers")`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:22): `.from("customers") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:97): `const { data: activeClients } = await (supabase.from("customers") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:106): `const { data: existing } = await (supabase.from("customers") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:113): `await (supabase.from("customers") as any).insert({`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:67): `.from("customers")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:497): `adminSupabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:498): `adminSupabase.from("customers").select("id, customer_name").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:64): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:65): `supabase.from("customers").select("id, customer_name").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:618): `supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:619): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:889): `.from("customers") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1008): `.from("customers") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1022): `.from("customers") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1481): `supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1482): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1525): `.from("customers")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:57): `.from("customers")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:22): `.from("customers")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:37): `.from("customers")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:37): `.from("customers")`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:29): `.from("customers")`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:18): `const { data: customer, error } = await (supabase.from("customers") as any)`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:16): `.from("customers")`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:20): `supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:44): `.from("customers")`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:31): `.from("customers") as any)`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:20): `.from("customers")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:103): `.from("customers")`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:12): `.from("customers")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:72): `.from("customers")`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:26): `supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:31): `supabase.from("customers").select("id, customer_name, alias").eq("status", "active").eq("is_internal", "client a/c").is("deleted_at", null).order("customer_name"),`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:40): `const { data: cust } = await (supabase.from("customers") as any)`

## employees

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:94)-110: `employees`

```sql
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique,
  name text not null,
  department text not null,
  designation text not null,
  salary numeric(12,2) not null default 0 check (salary >= 0),
  joining_date date,
  shift_start time,
  shift_end time,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:538)-539: `settings`

```sql
alter table public.settings enable row level security;
alter table public.employees enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:539)-540: `employees`

```sql
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:744)-745: `employees`

```sql
alter table public.employees
  add column if not exists user_id uuid references public.users(id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1165)-1166: `raw_materials`

```sql
alter table public.raw_materials drop constraint if exists raw_materials_material_name_key;
alter table public.employees drop constraint if exists employees_employee_code_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1166)-1167: `employees`

```sql
alter table public.employees drop constraint if exists employees_employee_code_key;
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1773)-1776: `employees`

```sql
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS joining_date DATE,
  ADD COLUMN IF NOT EXISTS shift_start TIME,
  ADD COLUMN IF NOT EXISTS shift_end TIME;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2188)-2189: `employees`

```sql
ALTER TABLE public.employees
  DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2191)-2192: `employees`

```sql
ALTER TABLE public.employees
  ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2198)-2199: `attendance`

```sql
ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:747)-749: `idx_employees_user_id`

```sql
create unique index if not exists idx_employees_user_id
on public.employees (user_id)
where user_id is not null and deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:751)-753: `idx_employees_status_name`

```sql
create index if not exists idx_employees_status_name
on public.employees (status, name)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1171)-1172: `idx_raw_materials_material_name_unique`

```sql
create unique index if not exists idx_raw_materials_material_name_unique on public.raw_materials (material_name) where deleted_at is null;
create unique index if not exists idx_employees_employee_code_unique on public.employees (employee_code) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1172)-1173: `idx_employees_employee_code_unique`

```sql
create unique index if not exists idx_employees_employee_code_unique on public.employees (employee_code) where deleted_at is null;
create unique index if not exists idx_attendance_employee_date_unique on public.attendance (employee_id, attendance_date) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2122)-2123: `idx_raw_materials_name`

```sql
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2123)-2126: `idx_employees_name`

```sql
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;

-- 3. Composite index for sales order billing status & date lookups
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:563)-564: `settings admin write`

```sql
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:564)-565: `masters read active users employees`

```sql
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:565)-566: `masters admin write employees`

```sql
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:698)-701: `employees permission write`

```sql
create policy "employees permission write" on public.employees
for all
using (public.is_admin() or public.has_permission('employees.edit') or public.has_permission('employees.delete'))
with check (public.is_admin() or public.has_permission('employees.create') or public.has_permission('employees.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:826)-837: `employees read permission scoped`

```sql
create policy "employees read permission scoped" on public.employees
for select using (
  deleted_at is null
  and (
    public.has_permission('employees.view')
    or (
      public.has_permission('attendance.view')
      and public.can_manage_attendance_for(id)
    )
    or user_id = auth.uid()
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:496)-497: `touch_settings`

```sql
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();
create trigger touch_employees before update on public.employees for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:497)-498: `touch_employees`

```sql
create trigger touch_employees before update on public.employees for each row execute function public.touch_updated_at();
create trigger touch_attendance before update on public.attendance for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:516)-517: `audit_settings`

```sql
create trigger audit_settings after insert or update on public.settings for each row execute function public.audit_row_change();
create trigger audit_employees after insert or update on public.employees for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:517)-518: `audit_employees`

```sql
create trigger audit_employees after insert or update on public.employees for each row execute function public.audit_row_change();
create trigger audit_attendance after insert or update on public.attendance for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:771)-788: `can_manage_attendance_for`

```sql
create or replace function public.can_manage_attendance_for(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or public.has_permission('employees.view')
    or exists (
      select 1
      from public.employees e
      where e.id = target_employee_id
        and e.user_id = auth.uid()
        and e.status = 'active'
        and e.deleted_at is null
    )
$$;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:53): `.from("employees")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:82): `await supabase.from("employees").delete().eq("id", empId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:95): `await supabase.from("employees").delete().eq("id", empId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:101): `const { error: dEmpErr } = await supabase.from("employees").delete().eq("id", empId);`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:98): `const { error: clearError } = await (supabase.from("employees") as any)`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:104): `const { error: linkError } = await (supabase.from("employees") as any)`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:137): `.from("employees")`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:101): `.from("employees")`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:19): `supabase.from("employees").select("id, user_id, employee_code, name").eq("status", "active").is("deleted_at", null).order("name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:92): `supabase.from("employees").select("employee_code, name, department, designation, salary, status").is("deleted_at", null).order("name").limit(500),`

## fabric_rolls

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:174)-190: `fabric_rolls`

```sql
create table public.fabric_rolls (
  id uuid primary key default gen_random_uuid(),
  roll_number text not null unique,
  production_entry_id uuid not null unique references public.loom_production_entries(id),
  fabric_type_id uuid not null references public.fabric_types(id),
  loom_id uuid not null references public.looms(id),
  weight numeric(12,3) not null check (weight >= 0),
  meters numeric(12,2) not null check (meters >= 0),
  production_date date not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'voided')),
  current_stage text not null default 'loom' check (current_stage in ('loom', 'roto_printing', 'lamination', 'finishing', 'offset_printing')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:542)-543: `loom_production_entries`

```sql
alter table public.loom_production_entries enable row level security;
alter table public.fabric_rolls enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:543)-544: `fabric_rolls`

```sql
alter table public.fabric_rolls enable row level security;
alter table public.sales_orders enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1519)-1520: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries DROP CONSTRAINT IF EXISTS loom_production_entries_serial_number_key CASCADE;
ALTER TABLE public.fabric_rolls DROP CONSTRAINT IF EXISTS fabric_rolls_roll_number_key CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1520)-1523: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls DROP CONSTRAINT IF EXISTS fabric_rolls_roll_number_key CASCADE;

-- 2. Create partial unique indexes to guarantee uniqueness per fabric type for active records
CREATE UNIQUE INDEX IF NOT EXISTS uq_lpe_fabric_type_serial ON public.loom_production_entries (fabric_type_id, serial_number) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2211)-2214: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  DROP CONSTRAINT IF EXISTS fabric_rolls_production_entry_id_fkey,
  DROP CONSTRAINT IF EXISTS fabric_rolls_fabric_type_id_fkey,
  DROP CONSTRAINT IF EXISTS fabric_rolls_loom_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2216)-2219: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  ADD CONSTRAINT fabric_rolls_production_entry_id_fkey FOREIGN KEY (production_entry_id) REFERENCES public.loom_production_entries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2241)-2242: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries
  ADD CONSTRAINT stage_production_entries_roll_id_fkey FOREIGN KEY (roll_id) REFERENCES public.fabric_rolls(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2434)-2435: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls ADD CONSTRAINT fabric_rolls_status_check
  CHECK (status IN ('available', 'reserved', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:73)-77: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:4)-5: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/046_make_fabric_rolls_nullable.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/046_make_fabric_rolls_nullable.sql:3)-5: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  ALTER COLUMN production_entry_id DROP NOT NULL,
  ALTER COLUMN loom_id DROP NOT NULL;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:527)-528: `idx_production_recent`

```sql
create index idx_production_recent on public.loom_production_entries (created_at desc) where deleted_at is null;
create index idx_rolls_fabric_status on public.fabric_rolls (fabric_type_id, status) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:528)-529: `idx_rolls_fabric_status`

```sql
create index idx_rolls_fabric_status on public.fabric_rolls (fabric_type_id, status) where deleted_at is null;
create index idx_sales_date on public.sales_orders (order_date desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1426)-1427: `idx_rolls_type_status`

```sql
CREATE INDEX IF NOT EXISTS idx_rolls_type_status ON public.fabric_rolls(fabric_type_id, status) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1523)-1524: `uq_lpe_fabric_type_serial`

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_lpe_fabric_type_serial ON public.loom_production_entries (fabric_type_id, serial_number) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX IF NOT EXISTS uq_rolls_fabric_type_serial ON public.fabric_rolls (fabric_type_id, roll_number) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1524)-1532: `uq_rolls_fabric_type_serial`

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_rolls_fabric_type_serial ON public.fabric_rolls (fabric_type_id, roll_number) WHERE (deleted_at IS NULL);

-- 3. Create or replace trigger function prepare_production_entry with fabric-type-specific serial generation (1, 2, 3...)
CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  last_end numeric(12,2);
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:584)-585: `rolls read active users`

```sql
create policy "rolls read active users" on public.fabric_rolls for select using (auth.uid() is not null and deleted_at is null);
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:585)-587: `rolls admin write`

```sql
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());

create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:726)-729: `rolls permission write`

```sql
create policy "rolls permission write" on public.fabric_rolls
for all
using (public.is_admin() or public.has_permission('production.edit'))
with check (public.is_admin() or public.has_permission('production.create') or public.has_permission('production.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:939)-948: `rolls read permitted users`

```sql
create policy "rolls read permitted users" on public.fabric_rolls
for select using (
  deleted_at is null
  and (
    public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3148)-3151: `raw materials read authenticated`

```sql
CREATE POLICY "raw materials read authenticated" ON public.raw_materials FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 5. Relax SELECT policies on fabric_rolls
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3153)-3156: `rolls read authenticated`

```sql
CREATE POLICY "rolls read authenticated" ON public.fabric_rolls FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 6. Relax SELECT policies on customers
DROP POLICY IF EXISTS "customers read permitted users" ON public.customers;
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:119)-138: `rolls permission write`

```sql
CREATE POLICY "rolls permission write" ON public.fabric_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.create')
  OR public.has_permission('production.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:132)-149: `rolls read permitted users`

```sql
CREATE POLICY "rolls read permitted users" ON public.fabric_rolls
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('fabric.production')
    or public.has_permission('fabric.stock')
    or public.has_permission('roto_printing.production')
    or public.has_permission('lamination.production')
    or public.has_permission('offset_printing.production')
    or public.has_permission('finishing.production')
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:500)-501: `touch_production`

```sql
create trigger touch_production before update on public.loom_production_entries for each row execute function public.touch_updated_at();
create trigger touch_rolls before update on public.fabric_rolls for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:501)-502: `touch_rolls`

```sql
create trigger touch_rolls before update on public.fabric_rolls for each row execute function public.touch_updated_at();
create trigger touch_sales before update on public.sales_orders for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:520)-521: `audit_production`

```sql
create trigger audit_production after insert or update on public.loom_production_entries for each row execute function public.audit_row_change();
create trigger audit_rolls after insert or update on public.fabric_rolls for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:521)-522: `audit_rolls`

```sql
create trigger audit_rolls after insert or update on public.fabric_rolls for each row execute function public.audit_row_change();
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:430)-439: `sync_rolls_for_sales_order`

```sql
create or replace function public.sync_rolls_for_sales_order()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and old.status = 'confirmed' and new.status <> 'confirmed' then
    update public.fabric_rolls
    set status = 'available', updated_at = now(), updated_by = new.updated_by
    where id = any(old.selected_roll_ids)
      and status = 'sold';
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1456)-1487: `create_or_sync_fabric_roll`

```sql
CREATE OR REPLACE FUNCTION public.create_or_sync_fabric_roll()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    INSERT INTO public.fabric_rolls (
      roll_number,
      production_entry_id,
      fabric_type_id,
      loom_id,
      weight,
      meters,
      production_date,
      status,
      current_stage,
      created_by,
      updated_by
    )
    VALUES (
      new.serial_number,
      new.id,
      new.fabric_type_id,
      new.loom_id,
      new.net_weight,
      new.net_meters,
      new.entry_date,
      CASE WHEN new.deleted_at IS NULL THEN 'available' ELSE 'voided' END,
      'loom',
      new.created_by,
      new.updated_by
    );
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1648)-1691: `get_roll_allocations_for_fabric`

```sql
create or replace function public.get_roll_allocations_for_fabric(p_fabric_type_id uuid)
returns table (
  roll_id uuid,
  dispatch_date date,
  client_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (allocation.roll_id)
    allocation.roll_id,
    allocation.dispatch_date,
    allocation.client_name
  from (
    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_orders so on so.selected_roll_ids @> array[fr.id]::uuid[]
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'

    union all

    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_order_items soi on soi.selected_roll_ids @> array[fr.id]::uuid[]
    join public.sales_orders so on so.id = soi.sales_order_id
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'
  ) allocation
  order by allocation.roll_id, allocation.dispatch_date desc;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1742)-1766: `get_fabric_stock_summary`

```sql
create or replace function public.get_fabric_stock_summary()
returns table (
  fabric_type_id uuid,
  fabric_name text,
  rolls bigint,
  weight numeric,
  meters numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fr.fabric_type_id,
    ft.fabric_name,
    count(*) as rolls,
    coalesce(sum(fr.weight), 0) as weight,
    coalesce(sum(fr.meters), 0) as meters
  from public.fabric_rolls fr
  left join public.fabric_types ft on ft.id = fr.fabric_type_id
  where fr.status = 'available'
    and fr.deleted_at is null
  group by fr.fabric_type_id, ft.fabric_name
  order by ft.fabric_name;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1990)-2000: `apply_stage_production`

```sql
CREATE OR REPLACE FUNCTION public.apply_stage_production()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.fabric_rolls
    SET current_stage = NEW.stage,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2671)-2678: `apply_lamination_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Fabric roll is always consumed
    UPDATE public.fabric_rolls
    SET status = 'consumed', current_stage = 'lamination', updated_at = now()
    WHERE id = NEW.fabric_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2708)-2715: `apply_offset_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type = 'FABRIC' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'offset_printing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:20): `const { data: rolls } = await supabase.from("fabric_rolls").select("*").limit(1);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:89): `measure("Fetch fabric consumption entries", supabase.from("fabric_rolls").select("*, loom_production_entries(*)").eq("status", "consumed").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:101): `measure("Fetch available fabric rolls", supabase.from("fabric_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:32): `.from("fabric_rolls")`
- [scratch/check-new-roll-lpe.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-new-roll-lpe.mjs:30): `.from("fabric_rolls")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:71): `.from("fabric_rolls")`
- [scratch/check-rolls-status.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rolls-status.mjs:20): `.from("fabric_rolls")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:41): `.from("fabric_rolls")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:38): `.from("fabric_rolls")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:57): `.from("fabric_rolls")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:63): `.from("fabric_rolls")`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:42): `.from("fabric_rolls")`
- [scratch/inspect-loom-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-loom-schema.mjs:11): `const { data: roll } = await supabase.from("fabric_rolls").select("*").limit(1);`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:51): `.from("fabric_rolls")`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:342): `.from("fabric_rolls")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:367): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:383): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:392): `const { error: dRollErr } = await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:66): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:112): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:244): `const { data: fr } = await adminSupabase.from("fabric_rolls").select("roll_number").eq("id", sourceRollId).maybeSingle();`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:319): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:389): `const { data: r } = await adminSupabase.from("fabric_rolls").select("roll_number").eq("id", sourceRollId).maybeSingle();`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:448): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:572): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:578): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:590): `promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:79): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:662): `await (adminSupabase.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:141): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:159): `const { data: roll } = await (supabase.from("fabric_rolls") as any).select("current_stage").eq("id", rollId).maybeSingle();`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:170): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:211): `const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:723): `.from("fabric_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:838): `supabase.from("fabric_rolls").select("id, weight").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1211): `const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:71): `.from("fabric_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:127): `? supabase.from("fabric_rolls").select("id, roll_number").in("id", stockIdsByDept.fabric)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:86): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:25): `.from("fabric_rolls")`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:16): `.from("fabric_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:45): `.from("fabric_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:49): `.from("fabric_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:57): `.from("fabric_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:54): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:43): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:51): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:60): `.from("fabric_rolls")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:113): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, weight, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:96): `.from("fabric_rolls")`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:25): `.from("fabric_rolls")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:64): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:70): `selectedRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:77): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:113): `uniqueRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## fabric_types

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:37)-49: `fabric_types`

```sql
create table public.fabric_types (
  id uuid primary key default gen_random_uuid(),
  fabric_name text not null,
  width numeric(10,2) not null check (width > 0),
  gsm numeric(10,2) not null check (gsm > 0),
  selling_price numeric(12,2) not null default 0 check (selling_price >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:534)-535: `looms`

```sql
alter table public.looms enable row level security;
alter table public.fabric_types enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:535)-536: `fabric_types`

```sql
alter table public.fabric_types enable row level security;
alter table public.raw_materials enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1158)-1159: `fabric_types`

```sql
alter table public.fabric_types
  add column if not exists description text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2206)-2208: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries
  ADD CONSTRAINT loom_production_entries_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT loom_production_entries_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2216)-2219: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  ADD CONSTRAINT fabric_rolls_production_entry_id_fkey FOREIGN KEY (production_entry_id) REFERENCES public.loom_production_entries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2226)-2228: `sales_orders`

```sql
ALTER TABLE public.sales_orders
  ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  ADD CONSTRAINT sales_orders_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2782)-2785: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls RENAME COLUMN fabric_roll_id TO fabric_type_id;

ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2784)-2785: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2789)-2792: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2791)-2792: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2796)-2799: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2798)-2799: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:92)-99: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:13)-15: `fabric_types`

```sql
ALTER TABLE public.fabric_types
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT;
```

- [supabase/migrations/050_add_production_specs_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/050_add_production_specs_to_finishing_products.sql:4)-11: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:524)-525: `idx_looms_active`

```sql
create index idx_looms_active on public.looms (status) where deleted_at is null;
create index idx_fabric_types_active on public.fabric_types (status) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:525)-526: `idx_fabric_types_active`

```sql
create index idx_fabric_types_active on public.fabric_types (status) where deleted_at is null;
create index idx_raw_material_purchases_date on public.raw_material_purchases (purchase_date desc) where deleted_at is null;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:555)-556: `masters admin write looms`

```sql
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:556)-557: `masters read active users fabric`

```sql
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:557)-558: `masters admin write fabric`

```sql
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:677)-680: `fabric types permission write`

```sql
create policy "fabric types permission write" on public.fabric_types
for all
using (public.is_admin() or public.has_permission('fabric_types.edit') or public.has_permission('fabric_types.delete'))
with check (public.is_admin() or public.has_permission('fabric_types.create') or public.has_permission('fabric_types.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:878)-888: `fabric types read permitted users`

```sql
create policy "fabric types read permitted users" on public.fabric_types
for select using (
  deleted_at is null
  and (
    public.has_permission('fabric_types.view')
    or public.has_permission('production.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3138)-3141: `looms read authenticated`

```sql
CREATE POLICY "looms read authenticated" ON public.looms FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 3. Relax SELECT policies on fabric_types
DROP POLICY IF EXISTS "fabric types read permitted users" ON public.fabric_types;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3143)-3146: `fabric types read authenticated`

```sql
CREATE POLICY "fabric types read authenticated" ON public.fabric_types FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 4. Relax SELECT policies on raw_materials
DROP POLICY IF EXISTS "raw materials read permitted users" ON public.raw_materials;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:73)-79: `fabric_types_read_policy`

```sql
CREATE POLICY "fabric_types_read_policy" ON public.fabric_types
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:492)-493: `touch_looms`

```sql
create trigger touch_looms before update on public.looms for each row execute function public.touch_updated_at();
create trigger touch_fabric_types before update on public.fabric_types for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:493)-494: `touch_fabric_types`

```sql
create trigger touch_fabric_types before update on public.fabric_types for each row execute function public.touch_updated_at();
create trigger touch_raw_materials before update on public.raw_materials for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:512)-513: `audit_looms`

```sql
create trigger audit_looms after insert or update on public.looms for each row execute function public.audit_row_change();
create trigger audit_fabric_types after insert or update on public.fabric_types for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:513)-514: `audit_fabric_types`

```sql
create trigger audit_fabric_types after insert or update on public.fabric_types for each row execute function public.audit_row_change();
create trigger audit_raw_materials after insert or update on public.raw_materials for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1719)-1739: `get_daily_fabric_output`

```sql
create or replace function public.get_daily_fabric_output(p_entry_date date)
returns table (
  name text,
  meters numeric,
  weight numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(ft.fabric_name, 'Fabric') as name,
    coalesce(sum(lpe.net_meters), 0) as meters,
    coalesce(sum(lpe.net_weight), 0) as weight
  from public.loom_production_entries lpe
  left join public.fabric_types ft on ft.id = lpe.fabric_type_id
  where lpe.entry_date = p_entry_date
    and lpe.deleted_at is null
  group by ft.fabric_name
  order by ft.fabric_name;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1742)-1766: `get_fabric_stock_summary`

```sql
create or replace function public.get_fabric_stock_summary()
returns table (
  fabric_type_id uuid,
  fabric_name text,
  rolls bigint,
  weight numeric,
  meters numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fr.fabric_type_id,
    ft.fabric_name,
    count(*) as rolls,
    coalesce(sum(fr.weight), 0) as weight,
    coalesce(sum(fr.meters), 0) as meters
  from public.fabric_rolls fr
  left join public.fabric_types ft on ft.id = fr.fabric_type_id
  where fr.status = 'available'
    and fr.deleted_at is null
  group by fr.fabric_type_id, ft.fabric_name
  order by ft.fabric_name;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2911)-2937: `get_next_serial_numbers`

```sql
CREATE OR REPLACE FUNCTION public.get_next_serial_numbers()
RETURNS TABLE (
  fabric_type_id uuid,
  next_serial integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id AS fabric_type_id,
    COALESCE(
      (
        SELECT CAST(lpe.serial_number AS integer)
        FROM public.loom_production_entries lpe
        WHERE lpe.fabric_type_id = ft.id
          AND lpe.deleted_at IS NULL
          AND lpe.serial_number ~ '^[0-9]+$'
        ORDER BY lpe.created_at DESC
        LIMIT 1
      ),
      0
    ) + 1 AS next_serial
  FROM public.fabric_types ft
  WHERE ft.deleted_at IS NULL;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:204): `measure("Fetch fabric types definitions", supabase.from("fabric_types").select("*")),`
- [scratch/check_fabric_types.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_fabric_types.mjs:22): `.from("fabric_types")`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:36): `.from("fabric_types")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:302): `.from("fabric_types")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:334): `await supabase.from("fabric_types").delete().eq("id", ftId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:348): `await supabase.from("fabric_types").delete().eq("id", ftId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:369): `await supabase.from("fabric_types").delete().eq("id", ftId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:385): `await supabase.from("fabric_types").delete().eq("id", ftId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:394): `const { error: dFtErr } = await supabase.from("fabric_types").delete().eq("id", ftId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:97): `const { data: f } = await adminSupabase.from("fabric_types").select("fabric_name").eq("id", fabricTypeId).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:317): `.from("fabric_types") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:489): `const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:575): `const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:279): `const { error } = await (supabase.from("fabric_types") as any).update(payload).eq("id", id);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:282): `const { error } = await (supabase.from("fabric_types") as any).insert(payload);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:44): `.from("fabric_types")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:46): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:19): `.from("fabric_types")`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:30): `.from("fabric_types")`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:26): `supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:23): `supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:25): `supabase.from("fabric_types").select("id, fabric_name").order("fabric_name"),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:29): `.from("fabric_types")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:30): `.from("fabric_types")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:30): `.from("fabric_types")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:49): `.from("fabric_types")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:24): `supabase.from("fabric_types").select("id, fabric_name, selling_price"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:58): `.from("fabric_types")`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:23): `supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:119): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name, status").is("deleted_at", null).order("fabric_name"),`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:18): `.from("fabric_types")`

## finishing_bundles

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2603)-2618: `finishing_bundles`

```sql
CREATE TABLE IF NOT EXISTS public.finishing_bundles (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id                 TEXT NOT NULL,
  finish_type               TEXT NOT NULL CHECK (finish_type IN ('LAMINATED', 'NW', 'PLAIN')),
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_nw_material_id     UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  num_bags                  INTEGER NOT NULL CHECK (num_bags > 0),
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2620)-2629: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2795)-2796: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles DROP CONSTRAINT IF EXISTS finishing_bundles_source_fabric_roll_id_fkey;
ALTER TABLE public.finishing_bundles RENAME COLUMN source_fabric_roll_id TO fabric_type_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2796)-2799: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2798)-2799: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:73)-77: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:80)-83: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles DROP CONSTRAINT IF EXISTS finishing_bundles_finish_type_check;

-- Migrate existing records in finishing_bundles to new type names
UPDATE public.finishing_bundles SET finish_type = 'FABRIC' WHERE finish_type = 'PLAIN';
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:58)-59: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:59)-74: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS s_no INTEGER;


-- 3. MIGRATE DATA & CAPITALIZE IDS

-- A. Roto Film Rolls (Generate sequential s_no grouped by roll_id)
WITH seq_assigned AS (
  SELECT id, row_number() OVER (PARTITION BY roll_id ORDER BY created_at) as new_s_no
  FROM public.roto_film_rolls
)
UPDATE public.roto_film_rolls r
SET 
  s_no = s.new_s_no,
  roll_id = UPPER(r.roll_id)
FROM seq_assigned s
WHERE r.id = s.id;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:129)-130: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.finishing_bundles ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:130)-131: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ALTER COLUMN s_no SET NOT NULL;

```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:8)-9: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:9)-17: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;

-- 2. Add enhancement columns to product_purchase_items
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2622)-2629: `Allow read access to permitted users on finishing_bundles`

```sql
CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2631)-2640: `Allow write access to permitted users on finishing_bundles`

```sql
CREATE POLICY "Allow write access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3188)-3191: `Allow read access to authenticated on offset_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on offset_rolls" ON public.offset_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 14. Relax SELECT policies on finishing_bundles
DROP POLICY IF EXISTS "Allow read access to permitted users on finishing_bundles" ON public.finishing_bundles;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3192)-3198: `Allow read access to authenticated on finishing_bundles`

```sql
CREATE POLICY "Allow read access to authenticated on finishing_bundles" ON public.finishing_bundles FOR SELECT TO authenticated USING (deleted_at IS NULL);


-- --- NEW SYSTEM PERMISSIONS ---
INSERT INTO public.permissions (module, action, description)
VALUES ('reports', 'filter_by_date', 'Filter by Date')
ON CONFLICT (module, action) DO NOTHING;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:129)-140: `finishing_bundles write permitted`

```sql
CREATE POLICY "finishing_bundles write permitted" ON public.finishing_bundles
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('finishing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('finishing.production')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2772)-2774: `finishing_bundle_consumes_inputs`

```sql
CREATE TRIGGER finishing_bundle_consumes_inputs
AFTER INSERT OR DELETE ON public.finishing_bundles
FOR EACH ROW EXECUTE FUNCTION public.apply_finishing_consumption();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:29): `const { data: finishing } = await supabase.from("finishing_bundles").select("*").limit(1);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:143): `measure("Fetch finishing consumption (gte date)", supabase.from("finishing_bundles").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:149): `measure("Fetch finishing production (eq date)", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:155): `measure("Fetch available finishing bundles", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:411): `.from("finishing_bundles")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:420): `.from("finishing_bundles") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:596): `promises.push((adminSupabase.from("finishing_bundles") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:443): `const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:539): `const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_offset_roll_id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:612): `.from("finishing_bundles") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:641): `const { data: bundle } = await (supabase.from("finishing_bundles") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:651): `.from("finishing_bundles") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:223): `const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:841): `supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1223): `const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:142): `? supabase.from("finishing_bundles").select("id, bundle_id").in("id", stockIdsByDept.finishing)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:89): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, num_bags, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:47): `.from("finishing_bundles")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:25): `.from("finishing_bundles")`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:14): `.from("finishing_bundles")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:78): `.from("finishing_bundles")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:116): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:114): `.from("finishing_bundles")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:67): `supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:73): `selectedRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:80): `supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:116): `uniqueRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## finishing_products

### Schema Definition

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:25)-32: `finishing_products`

```sql
CREATE TABLE IF NOT EXISTS public.finishing_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:34)-38: `finishing_products`

```sql
ALTER TABLE public.finishing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finishing_products read authenticated"
ON public.finishing_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:73)-77: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:18)-22: `finishing_products`

```sql
ALTER TABLE public.finishing_products
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT;
```

- [supabase/migrations/049_add_selling_price_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/049_add_selling_price_to_finishing_products.sql:4)-5: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0);
```

- [supabase/migrations/050_add_production_specs_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/050_add_production_specs_to_finishing_products.sql:4)-11: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:36)-38: `finishing_products read authenticated`

```sql
CREATE POLICY "finishing_products read authenticated"
ON public.finishing_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:40)-42: `finishing_products write admin`

```sql
CREATE POLICY "finishing_products write admin"
ON public.finishing_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:83)-89: `finishing_products_read_policy`

```sql
CREATE POLICY "finishing_products_read_policy" ON public.finishing_products
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:208): `measure("Fetch finishing products definitions", supabase.from("finishing_products").select("*"))`
- [scratch/check_columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_columns.mjs:23): `const { data: finishing } = await supabase.from("finishing_products").select("*").limit(1);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:316): `const { error } = await (supabase.from("finishing_products") as any).update(payload).eq("id", id);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:319): `const { error } = await (supabase.from("finishing_products") as any).insert(payload);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:60): `.from("finishing_products")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:50): `supabase.from("finishing_products").select("id, name"),`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:24): `.from("finishing_products")`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:36): `.from("finishing_products")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:28): `supabase.from("finishing_products").select("id, name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:92): `.from("finishing_products")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:36): `supabase.from("finishing_products").select("id, name")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:123): `supabase.from("finishing_products").select("id, name")`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:36): `supabase.from("finishing_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:26): `.from("finishing_products")`

## lamination_products

### Schema Definition

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:4)-11: `lamination_products`

```sql
CREATE TABLE IF NOT EXISTS public.lamination_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:13)-17: `lamination_products`

```sql
ALTER TABLE public.lamination_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lamination_products read authenticated"
ON public.lamination_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:68)-69: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.lamination_products(id) ON DELETE RESTRICT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:15)-17: `lamination_products read authenticated`

```sql
CREATE POLICY "lamination_products read authenticated"
ON public.lamination_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:19)-21: `lamination_products write admin`

```sql
CREATE POLICY "lamination_products write admin"
ON public.lamination_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:206): `measure("Fetch lamination products definitions", supabase.from("lamination_products").select("*")),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:49): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:27): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:89): `.from("lamination_products")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:35): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:122): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:35): `supabase.from("lamination_products").select("id, name, status").is("deleted_at", null).order("name"),`

## lamination_rolls

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2520)-2536: `lamination_rolls`

```sql
CREATE TABLE IF NOT EXISTS public.lamination_rolls (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id           TEXT UNIQUE NOT NULL,
  lam_type          TEXT NOT NULL CHECK (lam_type IN ('BOX', 'F_S', 'H_S', 'NW', 'PLAIN')),
  fabric_roll_id    UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  film_roll_id      UUID REFERENCES public.roto_metallic_rolls(id) ON DELETE RESTRICT,
  nw_material_id    UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  weight_kg         NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters            NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2538)-2547: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2781)-2782: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls DROP CONSTRAINT IF EXISTS lamination_rolls_fabric_roll_id_fkey;
ALTER TABLE public.lamination_rolls RENAME COLUMN fabric_roll_id TO fabric_type_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2782)-2785: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls RENAME COLUMN fabric_roll_id TO fabric_type_id;

ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2784)-2785: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:68)-69: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.lamination_products(id) ON DELETE RESTRICT;
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:57)-58: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD CONSTRAINT offset_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.lamination_rolls ADD CONSTRAINT lamination_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:58)-59: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD CONSTRAINT lamination_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_film_rolls ADD CONSTRAINT roto_film_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:56)-57: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:57)-58: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:127)-128: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.lamination_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:128)-129: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.offset_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:4)-5: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:5)-6: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2540)-2547: `Allow read access to permitted users on lamination_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2549)-2558: `Allow write access to permitted users on lamination_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3180)-3183: `Allow read access to authenticated on roto_metallic_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_metallic_rolls" ON public.roto_metallic_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 12. Relax SELECT policies on lamination_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on lamination_rolls" ON public.lamination_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3184)-3187: `Allow read access to authenticated on lamination_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on lamination_rolls" ON public.lamination_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 13. Relax SELECT policies on offset_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on offset_rolls" ON public.offset_rolls;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:95)-106: `lamination_rolls write permitted`

```sql
CREATE POLICY "lamination_rolls write permitted" ON public.lamination_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('lamination.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('lamination.production')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2702)-2704: `lamination_roll_consumes_inputs`

```sql
CREATE TRIGGER lamination_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.lamination_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_lamination_consumption();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2743)-2750: `apply_finishing_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2824)-2831: `apply_offset_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2845)-2852: `apply_finishing_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:23): `const { data: lam } = await supabase.from("lamination_rolls").select("*").limit(1);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:107): `measure("Fetch lamination consumption (gte date)", supabase.from("lamination_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:113): `measure("Fetch lamination production (eq date)", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:119): `measure("Fetch available lamination rolls", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [scratch/check_lam_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_lam_rolls.mjs:22): `.from("lamination_rolls")`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:20): `const { data: lam } = await supabase.from("lamination_rolls").select("id, roll_id, lam_type, fabric_type_id, status, fabric_types(fabric_name)").eq("status", "available");`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:284): `.from("lamination_rolls")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:293): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:325): `const { data: lr } = await adminSupabase.from("lamination_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:380): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:392): `const { data: r } = await adminSupabase.from("lamination_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:450): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:574): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:580): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:592): `promises.push((adminSupabase.from("lamination_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:285): `const { data: hasLamination } = await (supabase.from("lamination_rolls") as any).select("id").eq("film_roll_id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:387): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:398): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:435): `const { data: roll } = await (supabase.from("lamination_rolls") as any).select("status, film_roll_id").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:448): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:582): `const { data: lamRoll } = await (supabase.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:658): `await (adminSupabase.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:248): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:265): `.from("lamination_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:215): `const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:839): `supabase.from("lamination_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1215): `const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:77): `.from("lamination_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:130): `? supabase.from("lamination_rolls").select("id, roll_id").in("id", stockIdsByDept.lamination)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:87): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:61): `.from("lamination_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:68): `.from("lamination_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:35): `.from("lamination_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:48): `.from("lamination_rolls")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:25): `.from("lamination_rolls")`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:14): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:59): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:66): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:36): `.from("lamination_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:66): `.from("lamination_rolls")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:114): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:102): `.from("lamination_rolls")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:65): `supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:71): `selectedRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:78): `supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:114): `uniqueRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## loom_production_entries

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:145)-172: `loom_production_entries`

```sql
create table public.loom_production_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  serial_number text not null unique,
  fabric_type_id uuid not null references public.fabric_types(id),
  loom_id uuid not null references public.looms(id),
  gross_weight numeric(12,3) not null check (gross_weight > 0),
  core_weight numeric(12,3) not null default 0 check (core_weight >= 0),
  net_weight numeric(12,3) generated always as (gross_weight - core_weight) stored,
  initial_meters numeric(12,2) not null default 0 check (initial_meters >= 0),
  end_meters numeric(12,2) not null check (end_meters >= 0),
  net_meters numeric(12,2) generated always as (end_meters - initial_meters) stored,
  average_meter_weight numeric(12,3) generated always as (
    case when (end_meters - initial_meters) > 0
      then ((gross_weight - core_weight) / (end_meters - initial_meters)) * 1000
      else null
    end
  ) stored,
  initial_meter_overridden boolean not null default false,
  remarks text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (gross_weight >= core_weight),
  check (end_meters >= initial_meters)
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:541)-542: `customers`

```sql
alter table public.customers enable row level security;
alter table public.loom_production_entries enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:542)-543: `loom_production_entries`

```sql
alter table public.loom_production_entries enable row level security;
alter table public.fabric_rolls enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1519)-1520: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries DROP CONSTRAINT IF EXISTS loom_production_entries_serial_number_key CASCADE;
ALTER TABLE public.fabric_rolls DROP CONSTRAINT IF EXISTS fabric_rolls_roll_number_key CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1520)-1523: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls DROP CONSTRAINT IF EXISTS fabric_rolls_roll_number_key CASCADE;

-- 2. Create partial unique indexes to guarantee uniqueness per fabric type for active records
CREATE UNIQUE INDEX IF NOT EXISTS uq_lpe_fabric_type_serial ON public.loom_production_entries (fabric_type_id, serial_number) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2202)-2204: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries
  DROP CONSTRAINT IF EXISTS loom_production_entries_fabric_type_id_fkey,
  DROP CONSTRAINT IF EXISTS loom_production_entries_loom_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2206)-2208: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries
  ADD CONSTRAINT loom_production_entries_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT loom_production_entries_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2216)-2219: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  ADD CONSTRAINT fabric_rolls_production_entry_id_fkey FOREIGN KEY (production_entry_id) REFERENCES public.loom_production_entries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:526)-527: `idx_raw_material_purchases_date`

```sql
create index idx_raw_material_purchases_date on public.raw_material_purchases (purchase_date desc) where deleted_at is null;
create index idx_production_recent on public.loom_production_entries (created_at desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:527)-528: `idx_production_recent`

```sql
create index idx_production_recent on public.loom_production_entries (created_at desc) where deleted_at is null;
create index idx_rolls_fabric_status on public.fabric_rolls (fabric_type_id, status) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:759)-761: `idx_production_entry_date`

```sql
create index if not exists idx_production_entry_date
on public.loom_production_entries (entry_date desc)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1426)-1427: `idx_rolls_type_status`

```sql
CREATE INDEX IF NOT EXISTS idx_rolls_type_status ON public.fabric_rolls(fabric_type_id, status) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1427)-1428: `idx_production_entry_date`

```sql
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1523)-1524: `uq_lpe_fabric_type_serial`

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_lpe_fabric_type_serial ON public.loom_production_entries (fabric_type_id, serial_number) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX IF NOT EXISTS uq_rolls_fabric_type_serial ON public.fabric_rolls (fabric_type_id, roll_number) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1608)-1610: `idx_production_loom_created`

```sql
create index if not exists idx_production_loom_created
on public.loom_production_entries (loom_id, created_at desc)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2149)-2150: `idx_raw_material_purchases_material`

```sql
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_material ON public.raw_material_purchases(raw_material_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2150)-2151: `idx_loom_production_entries_fabric`

```sql
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2906)-2908: `idx_lpe_fabric_created`

```sql
CREATE INDEX IF NOT EXISTS idx_lpe_fabric_created 
ON public.loom_production_entries (fabric_type_id, created_at DESC) 
WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:570)-572: `attendance admin write`

```sql
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());

create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:572)-574: `production read active users`

```sql
create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
create policy "production insert admin operator" on public.loom_production_entries
for insert with check ((public.is_admin() or public.is_operator()) and created_by = auth.uid());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:573)-574: `production insert admin operator`

```sql
create policy "production insert admin operator" on public.loom_production_entries
for insert with check ((public.is_admin() or public.is_operator()) and created_by = auth.uid());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:575)-582: `production update admin anytime operator own 12h`

```sql
create policy "production update admin anytime operator own 12h" on public.loom_production_entries
for update using (
  public.is_admin()
  or (public.is_operator() and created_by = auth.uid() and created_at >= now() - interval '12 hours')
) with check (
  public.is_admin()
  or (public.is_operator() and created_by = auth.uid() and created_at >= now() - interval '12 hours')
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:927)-935: `production read permitted users`

```sql
create policy "production read permitted users" on public.loom_production_entries
for select using (
  deleted_at is null
  and (
    public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3158)-3161: `customers read authenticated`

```sql
CREATE POLICY "customers read authenticated" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 7. Relax SELECT policies on loom_production_entries
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3163)-3166: `production read authenticated`

```sql
CREATE POLICY "production read authenticated" ON public.loom_production_entries FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 8. Relax SELECT policies on sales_orders
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:7)-14: `production insert permitted`

```sql
CREATE POLICY "production insert permitted" ON public.loom_production_entries
FOR INSERT WITH CHECK (
  public.is_admin()
  OR (
    (public.has_permission('production.create') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
  )
);
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:16)-31: `production update permitted`

```sql
CREATE POLICY "production update permitted" ON public.loom_production_entries
FOR UPDATE USING (
  public.is_admin()
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
) WITH CHECK (
  public.is_admin()
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:65)-82: `production update permitted`

```sql
CREATE POLICY "production update permitted" ON public.loom_production_entries
FOR UPDATE USING (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
) WITH CHECK (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:87)-97: `production read permitted users`

```sql
CREATE POLICY "production read permitted users" ON public.loom_production_entries
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('production.view')
    or public.has_permission('fabric.production')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:499)-500: `touch_customers`

```sql
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
create trigger touch_production before update on public.loom_production_entries for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:500)-501: `touch_production`

```sql
create trigger touch_production before update on public.loom_production_entries for each row execute function public.touch_updated_at();
create trigger touch_rolls before update on public.fabric_rolls for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:502)-504: `touch_sales`

```sql
create trigger touch_sales before update on public.sales_orders for each row execute function public.touch_updated_at();

create trigger prepare_production before insert or update on public.loom_production_entries for each row execute function public.prepare_production_entry();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:504)-505: `prepare_production`

```sql
create trigger prepare_production before insert or update on public.loom_production_entries for each row execute function public.prepare_production_entry();
create trigger production_creates_roll after insert or update on public.loom_production_entries for each row execute function public.create_or_sync_fabric_roll();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:505)-506: `production_creates_roll`

```sql
create trigger production_creates_roll after insert or update on public.loom_production_entries for each row execute function public.create_or_sync_fabric_roll();
create trigger prepare_sales before insert on public.sales_orders for each row execute function public.prepare_sales_order();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:519)-520: `audit_customers`

```sql
create trigger audit_customers after insert or update on public.customers for each row execute function public.audit_row_change();
create trigger audit_production after insert or update on public.loom_production_entries for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:520)-521: `audit_production`

```sql
create trigger audit_production after insert or update on public.loom_production_entries for each row execute function public.audit_row_change();
create trigger audit_rolls after insert or update on public.fabric_rolls for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1630)-1645: `get_last_end_meters_by_loom`

```sql
create or replace function public.get_last_end_meters_by_loom()
returns table (
  loom_id uuid,
  end_meters numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (lpe.loom_id)
    lpe.loom_id,
    lpe.end_meters
  from public.loom_production_entries lpe
  where lpe.deleted_at is null
  order by lpe.loom_id, lpe.created_at desc;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1719)-1739: `get_daily_fabric_output`

```sql
create or replace function public.get_daily_fabric_output(p_entry_date date)
returns table (
  name text,
  meters numeric,
  weight numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(ft.fabric_name, 'Fabric') as name,
    coalesce(sum(lpe.net_meters), 0) as meters,
    coalesce(sum(lpe.net_weight), 0) as weight
  from public.loom_production_entries lpe
  left join public.fabric_types ft on ft.id = lpe.fabric_type_id
  where lpe.entry_date = p_entry_date
    and lpe.deleted_at is null
  group by ft.fabric_name
  order by ft.fabric_name;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2911)-2937: `get_next_serial_numbers`

```sql
CREATE OR REPLACE FUNCTION public.get_next_serial_numbers()
RETURNS TABLE (
  fabric_type_id uuid,
  next_serial integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id AS fabric_type_id,
    COALESCE(
      (
        SELECT CAST(lpe.serial_number AS integer)
        FROM public.loom_production_entries lpe
        WHERE lpe.fabric_type_id = ft.id
          AND lpe.deleted_at IS NULL
          AND lpe.serial_number ~ '^[0-9]+$'
        ORDER BY lpe.created_at DESC
        LIMIT 1
      ),
      0
    ) + 1 AS next_serial
  FROM public.fabric_types ft
  WHERE ft.deleted_at IS NULL;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:95): `measure("Fetch loom production (eq date)", supabase.from("loom_production_entries").select("*, looms(*), fabric_types(*)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:44): `.from("loom_production_entries")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:38): `.from("loom_production_entries")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:48): `.from("loom_production_entries")`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:34): `.from("loom_production_entries")`
- [scratch/inspect-loom-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-loom-schema.mjs:8): `const { data: entry } = await supabase.from("loom_production_entries").select("*").limit(1);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:320): `.from("loom_production_entries")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:347): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:368): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:384): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:393): `const { error: dLpeErr } = await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:28): `.from("loom_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:62): `? (adminSupabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:63): `: (adminSupabase.from("loom_production_entries") as any).insert({ ...payload, created_by: user.id } as any);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:91): `.from("loom_production_entries") as any)`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:29): `.from("loom_production_entries")`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`

## looms

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:26)-35: `looms`

```sql
create table public.looms (
  id uuid primary key default gen_random_uuid(),
  loom_number text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:533)-534: `users`

```sql
alter table public.users enable row level security;
alter table public.looms enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:534)-535: `looms`

```sql
alter table public.looms enable row level security;
alter table public.fabric_types enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1155)-1156: `looms`

```sql
alter table public.looms
  add column if not exists description text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1164)-1165: `looms`

```sql
alter table public.looms drop constraint if exists looms_loom_number_key;
alter table public.raw_materials drop constraint if exists raw_materials_material_name_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1167)-1170: `attendance`

```sql
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;

-- Create unique indexes that only apply to active (non-deleted) records
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2206)-2208: `loom_production_entries`

```sql
ALTER TABLE public.loom_production_entries
  ADD CONSTRAINT loom_production_entries_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT loom_production_entries_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2216)-2219: `fabric_rolls`

```sql
ALTER TABLE public.fabric_rolls
  ADD CONSTRAINT fabric_rolls_production_entry_id_fkey FOREIGN KEY (production_entry_id) REFERENCES public.loom_production_entries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3133)-3136: `users`

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Relax SELECT policies on looms
DROP POLICY IF EXISTS "looms read permitted users" ON public.looms;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:524)-525: `idx_looms_active`

```sql
create index idx_looms_active on public.looms (status) where deleted_at is null;
create index idx_fabric_types_active on public.fabric_types (status) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1170)-1171: `idx_looms_loom_number_unique`

```sql
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
create unique index if not exists idx_raw_materials_material_name_unique on public.raw_materials (material_name) where deleted_at is null;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:552)-554: `users admin update`

```sql
create policy "users admin update" on public.users for update using (public.is_admin()) with check (public.is_admin());

create policy "masters read active users looms" on public.looms for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:554)-555: `masters read active users looms`

```sql
create policy "masters read active users looms" on public.looms for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:555)-556: `masters admin write looms`

```sql
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:670)-673: `looms permission write`

```sql
create policy "looms permission write" on public.looms
for all
using (public.is_admin() or public.has_permission('looms.edit') or public.has_permission('looms.delete'))
with check (public.is_admin() or public.has_permission('looms.create') or public.has_permission('looms.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:865)-874: `looms read permitted users`

```sql
create policy "looms read permitted users" on public.looms
for select using (
  deleted_at is null
  and (
    public.has_permission('looms.view')
    or public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3138)-3141: `looms read authenticated`

```sql
CREATE POLICY "looms read authenticated" ON public.looms FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 3. Relax SELECT policies on fabric_types
DROP POLICY IF EXISTS "fabric types read permitted users" ON public.fabric_types;
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:65)-82: `production update permitted`

```sql
CREATE POLICY "production update permitted" ON public.loom_production_entries
FOR UPDATE USING (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
) WITH CHECK (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:491)-492: `touch_users`

```sql
create trigger touch_users before update on public.users for each row execute function public.touch_updated_at();
create trigger touch_looms before update on public.looms for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:492)-493: `touch_looms`

```sql
create trigger touch_looms before update on public.looms for each row execute function public.touch_updated_at();
create trigger touch_fabric_types before update on public.fabric_types for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:511)-512: `audit_users`

```sql
create trigger audit_users after insert or update on public.users for each row execute function public.audit_row_change();
create trigger audit_looms after insert or update on public.looms for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:512)-513: `audit_looms`

```sql
create trigger audit_looms after insert or update on public.looms for each row execute function public.audit_row_change();
create trigger audit_fabric_types after insert or update on public.fabric_types for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:522)-524: `audit_sales`

```sql
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();

create index idx_looms_active on public.looms (status) where deleted_at is null;
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:226): `measure("Fetch looms definitions", supabase.from("looms").select("*").is("deleted_at", null))`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:290): `.from("looms")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:313): `await supabase.from("looms").delete().eq("id", loomId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:335): `await supabase.from("looms").delete().eq("id", loomId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:349): `await supabase.from("looms").delete().eq("id", loomId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:370): `await supabase.from("looms").delete().eq("id", loomId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:386): `await supabase.from("looms").delete().eq("id", loomId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:395): `const { error: dLoomErr } = await supabase.from("looms").delete().eq("id", loomId);`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:27): `supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),`

## material_sales

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2274)-2292: `material_sales`

```sql
CREATE TABLE IF NOT EXISTS public.material_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bill_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('raw_material', 'waste')),
    department TEXT, -- null if waste
    raw_material_id UUID REFERENCES public.raw_materials(id) ON DELETE CASCADE, -- null if waste
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    inc_gst BOOLEAN NOT NULL DEFAULT FALSE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    journal_no TEXT, -- Reference to the accounts_journal entry group
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2295)-2298: `material_sales`

```sql
ALTER TABLE public.material_sales ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to permitted users on material_sales" ON public.material_sales;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2302)-2307: `Allow read access to permitted users on material_sales`

```sql
CREATE POLICY "Allow read access to permitted users on material_sales"
ON public.material_sales FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2309)-2320: `Allow write access to permitted users on material_sales`

```sql
CREATE POLICY "Allow write access to permitted users on material_sales"
ON public.material_sales FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:245)-252: `material_sales read permitted`

```sql
CREATE POLICY "material_sales read permitted" ON public.material_sales
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
  OR public.has_permission('accounts.material')
  OR public.has_permission('reports.view')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:255)-268: `material_sales write permitted`

```sql
CREATE POLICY "material_sales write permitted" ON public.material_sales
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('accounts.material')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('accounts.material')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2396)-2398: `material_sales_updates_stock`

```sql
CREATE TRIGGER material_sales_updates_stock
AFTER INSERT OR UPDATE OR DELETE ON public.material_sales
FOR EACH ROW EXECUTE FUNCTION public.apply_material_sales_stock();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2323)-2334: `apply_material_sales_stock`

```sql
CREATE OR REPLACE FUNCTION public.apply_material_sales_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    IF NEW.deleted_at IS NULL AND NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/inspect_material_sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_sales.mjs:23): `.from("material_sales")`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1063): `const { error: saleErr } = await (supabase.from("material_sales") as any).insert({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1099): `.from("material_sales") as any)`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:35): `.from("material_sales")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:44): `(supabase.from("material_sales") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:52): `(supabase.from("material_sales") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:77): `(supabase.from("material_sales") as any)`

## offset_products

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1337)-1344: `offset_products`

```sql
CREATE TABLE IF NOT EXISTS public.offset_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1347)-1349: `offset_products`

```sql
ALTER TABLE public.offset_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on offset_products" ON public.offset_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2409)-2410: `offset_products`

```sql
ALTER TABLE public.offset_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:92)-99: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/048_add_production_fields_to_client_order_items.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/048_add_production_fields_to_client_order_items.sql:4)-10: `client_order_items`

```sql
ALTER TABLE public.client_order_items 
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT,
  ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/050_add_production_specs_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/050_add_production_specs_to_finishing_products.sql:4)-11: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2118)-2119: `idx_roto_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_roto_products_brand ON public.roto_products (brand);
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2119)-2122: `idx_offset_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);

-- 2. Non-composite indexes for name/material_name sorting
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1350)-1351: `Allow read access to authenticated users on offset_products`

```sql
CREATE POLICY "Allow read access to authenticated users on offset_products" 
ON public.offset_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1354)-1356: `Allow write access to admins on offset_products`

```sql
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:49)-59: `offset_products write permitted`

```sql
CREATE POLICY "offset_products write permitted" ON public.offset_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('offset_products.create')
  OR public.has_permission('offset_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('offset_products.create')
);
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:207): `measure("Fetch offset products definitions", supabase.from("offset_products").select("*")),`
- [scratch/check_columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_columns.mjs:22): `const { data: offset } = await supabase.from("offset_products").select("*").limit(1);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:127): `.from("offset_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:154): `await supabase.from("offset_products").delete().eq("id", prodId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:173): `await supabase.from("offset_products").delete().eq("id", prodId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:188): `await supabase.from("offset_products").delete().eq("id", prodId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:196): `const { error: dProdErr } = await supabase.from("offset_products").delete().eq("id", prodId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:435): `.from("offset_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:450): `.from("offset_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:456): `await supabase.from("offset_products").delete().eq("id", offset.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:472): `await supabase.from("offset_products").delete().eq("id", offset.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:485): `await supabase.from("offset_products").delete().eq("id", offset.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:492): `const { error: doErr } = await supabase.from("offset_products").delete().eq("id", offset.id);`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:22): `.from("offset_products")`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:36): `await supabase.from("offset_products").delete().eq("id", offsetData[0].id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:331): `const { data: p } = await adminSupabase.from("offset_products").select("brand").eq("id", offsetProductId).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:476): `.from("offset_products") as any)`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:200): `? (supabase.from("offset_products") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:201): `: (supabase.from("offset_products") as any).insert(payload);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:214): `.from("offset_products") as any)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:55): `.from("offset_products")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:48): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:36): `supabase.from("offset_products").select("id, brand").eq("status", "active")`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:101): `.from("offset_products")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:42): `.from("offset_products")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:26): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:86): `.from("offset_products")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:34): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:121): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:34): `supabase.from("offset_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:36): `supabase.from("offset_products").select("id, brand, status").eq("status", "active"),`

## offset_rolls

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2562)-2577: `offset_rolls`

```sql
CREATE TABLE IF NOT EXISTS public.offset_rolls (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id                   TEXT UNIQUE NOT NULL,
  offset_type               TEXT NOT NULL CHECK (offset_type IN ('NW', 'NW_LAM', 'PLAIN_LAM', 'FABRIC')),
  brand_id                  UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  status                    TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2579)-2588: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2788)-2789: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls DROP CONSTRAINT IF EXISTS offset_rolls_source_fabric_roll_id_fkey;
ALTER TABLE public.offset_rolls RENAME COLUMN source_fabric_roll_id TO fabric_type_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2789)-2792: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2791)-2792: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:73)-77: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:57)-58: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD CONSTRAINT offset_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.lamination_rolls ADD CONSTRAINT lamination_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:57)-58: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:58)-59: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:128)-129: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.offset_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:129)-130: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.finishing_bundles ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:5)-6: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:6)-7: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2581)-2588: `Allow read access to permitted users on offset_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2590)-2599: `Allow write access to permitted users on offset_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on offset_rolls"
ON public.offset_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3184)-3187: `Allow read access to authenticated on lamination_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on lamination_rolls" ON public.lamination_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 13. Relax SELECT policies on offset_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on offset_rolls" ON public.offset_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3188)-3191: `Allow read access to authenticated on offset_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on offset_rolls" ON public.offset_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 14. Relax SELECT policies on finishing_bundles
DROP POLICY IF EXISTS "Allow read access to permitted users on finishing_bundles" ON public.finishing_bundles;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:112)-123: `offset_rolls write permitted`

```sql
CREATE POLICY "offset_rolls write permitted" ON public.offset_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('offset_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('offset_printing.production')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2737)-2739: `offset_roll_consumes_inputs`

```sql
CREATE TRIGGER offset_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.offset_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_offset_consumption();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:26): `const { data: offset } = await supabase.from("offset_rolls").select("*").limit(1);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:125): `measure("Fetch offset consumption (gte date)", supabase.from("offset_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:131): `measure("Fetch offset production (eq date)", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:137): `measure("Fetch available offset rolls", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [scratch/check_offset_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_offset_rolls.mjs:22): `.from("offset_rolls")`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:32): `const { data: offset } = await supabase.from("offset_rolls").select("id, roll_id, offset_type, fabric_type_id, status").eq("status", "available");`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:347): `.from("offset_rolls")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:356): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:395): `const { data: r } = await adminSupabase.from("offset_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:452): `await (adminSupabase.from("offset_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:582): `promises.push((adminSupabase.from("offset_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:594): `promises.push((adminSupabase.from("offset_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:440): `const { data: hasOffset } = await (supabase.from("offset_rolls") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:497): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:508): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:534): `const { data: roll } = await (supabase.from("offset_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:544): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:594): `const { data: offsetRoll } = await (supabase.from("offset_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:666): `await (adminSupabase.from("offset_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:281): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:296): `.from("offset_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:219): `const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:840): `supabase.from("offset_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1219): `const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:83): `.from("offset_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:133): `? supabase.from("offset_rolls").select("id, roll_id").in("id", stockIdsByDept["offset-printing"])`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:88): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:75): `.from("offset_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:82): `.from("offset_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:41): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:47): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:25): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:14): `.from("offset_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:72): `.from("offset_rolls")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:115): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:108): `.from("offset_rolls")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:66): `supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:72): `selectedRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:79): `supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:115): `uniqueRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## permissions

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:597)-606: `permissions`

```sql
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:643)-644: `permissions`

```sql
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:644)-647: `role_permissions`

```sql
alter table public.role_permissions enable row level security;

-- --- START OF MIGRATION: 003_permission_policies.sql ---
drop policy if exists "roles admin write" on public.roles;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2158)-2160: `role_permissions`

```sql
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2162)-2164: `role_permissions`

```sql
ALTER TABLE public.role_permissions
  ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
  ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1623)-1624: `idx_role_permissions_role`

```sql
create index if not exists idx_role_permissions_role
on public.role_permissions (role_id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2151)-2160: `idx_sales_order_items_order`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);


-- --- START OF MIGRATION: 025_convert_soft_delete_to_cascade_hard_delete.sql ---
-- Migration: Convert soft delete constraints to cascade hard delete constraints

-- 1. Table: role_permissions
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:591)-606: `audit insert active users`

```sql
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);


-- --- START OF MIGRATION: 002_attendance_permissions.sql ---

-- 1. Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:656)-659: `permissions role managers write`

```sql
create policy "permissions role managers write" on public.permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:663)-666: `role permissions role managers write`

```sql
create policy "role permissions role managers write" on public.role_permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:857)-861: `role permissions readable by permitted users`

```sql
create policy "role permissions readable by permitted users" on public.role_permissions
for select using (
  public.has_permission('roles.view')
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = role_permissions.role_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3192)-3198: `Allow read access to authenticated on finishing_bundles`

```sql
CREATE POLICY "Allow read access to authenticated on finishing_bundles" ON public.finishing_bundles FOR SELECT TO authenticated USING (deleted_at IS NULL);


-- --- NEW SYSTEM PERMISSIONS ---
INSERT INTO public.permissions (module, action, description)
VALUES ('reports', 'filter_by_date', 'Filter by Date')
ON CONFLICT (module, action) DO NOTHING;
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1001)-1003: `audit_role_permissions`

```sql
create trigger audit_role_permissions
after insert or delete on public.role_permissions
for each row execute function public.audit_role_permission_change();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [list-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/list-permissions.mjs:20): `const { data, error } = await supabase.from("permissions").select("id, module, action, description").order("module");`
- [scratch/apply-date-permission.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/apply-date-permission.mjs:9): `.from("permissions")`
- [scratch/inspect-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-permissions.mjs:20): `const { data: perms } = await supabase.from("permissions").select("*").order("module");`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:31): `supabase.from("permissions").select("*").order("module").order("action"),`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:16): `supabase.from("permissions").select("id, module, action").order("module").order("action"),`

## product_purchase_items

### Schema Definition

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:17)-34: `product_purchase_items`

```sql
CREATE TABLE IF NOT EXISTS public.product_purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.product_purchases(id) ON DELETE CASCADE,
  department TEXT NOT NULL, -- 'fabric', 'roto-printing', 'lamination', 'offset-printing', 'finishing'
  fabric_type_id UUID REFERENCES public.fabric_types(id),
  roto_product_id UUID REFERENCES public.roto_products(id),
  offset_product_id UUID REFERENCES public.offset_products(id),
  lamination_type TEXT,
  offset_type TEXT,
  quantity NUMERIC(12, 2) NOT NULL, -- meters / bags
  weight NUMERIC(12, 2) NOT NULL, -- kg
  rate NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  created_stock_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Alterations / FK / Constraints

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:37)-38: `product_purchases`

```sql
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_purchase_items ENABLE ROW LEVEL SECURITY;
```

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:38)-41: `product_purchase_items`

```sql
ALTER TABLE public.product_purchase_items ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies
DROP POLICY IF EXISTS "Allow read access to authenticated on product_purchases" ON public.product_purchases;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:9)-17: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;

-- 2. Add enhancement columns to product_purchase_items
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:12)-17: `product_purchase_items`

```sql
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:50)-51: `Allow read access to authenticated on product_purchase_items`

```sql
CREATE POLICY "Allow read access to authenticated on product_purchase_items" 
  ON public.product_purchase_items FOR SELECT TO authenticated USING (deleted_at IS NULL);
```

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:54)-55: `Allow write access to authenticated on product_purchase_items`

```sql
CREATE POLICY "Allow write access to authenticated on product_purchase_items" 
  ON public.product_purchase_items FOR ALL TO authenticated;
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:459): `.from("product_purchase_items") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:562): `.from("product_purchase_items") as any)`

## product_purchases

### Schema Definition

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:2)-14: `product_purchases`

```sql
CREATE TABLE IF NOT EXISTS public.product_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_date DATE NOT NULL,
  supplier_name TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  remarks TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Alterations / FK / Constraints

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:37)-38: `product_purchases`

```sql
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_purchase_items ENABLE ROW LEVEL SECURITY;
```

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:38)-41: `product_purchase_items`

```sql
ALTER TABLE public.product_purchase_items ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies
DROP POLICY IF EXISTS "Allow read access to authenticated on product_purchases" ON public.product_purchases;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:42)-43: `Allow read access to authenticated on product_purchases`

```sql
CREATE POLICY "Allow read access to authenticated on product_purchases" 
  ON public.product_purchases FOR SELECT TO authenticated USING (deleted_at IS NULL);
```

- [supabase/migrations/043_product_purchases.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/043_product_purchases.sql:46)-47: `Allow write access to authenticated on product_purchases`

```sql
CREATE POLICY "Allow write access to authenticated on product_purchases" 
  ON public.product_purchases FOR ALL TO authenticated;
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:69): `measure("Fetch product purchases (gte date)", supabase.from("product_purchases").select("id, purchase_date, supplier_name, bill_number, total_amount, remarks, product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)").gte("purchase_date", "2026-07-13").is("deleted_at", null)),`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:35): `.from("product_purchases")`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:27): `.from("product_purchases")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:49): `.from("product_purchases") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:490): `await adminSupabase.from("product_purchases").delete().eq("id", purchaseId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:552): `.from("product_purchases") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:654): `.from("product_purchases") as any)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:89): `.from("product_purchases")`

## products

### Schema Definition

Not found in source code.

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1325)-1327: `roto_products`

```sql
ALTER TABLE public.roto_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_products" ON public.roto_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1347)-1349: `offset_products`

```sql
ALTER TABLE public.offset_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on offset_products" ON public.offset_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2405)-2406: `roto_products`

```sql
ALTER TABLE public.roto_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2409)-2410: `offset_products`

```sql
ALTER TABLE public.offset_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:13)-17: `lamination_products`

```sql
ALTER TABLE public.lamination_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lamination_products read authenticated"
ON public.lamination_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:34)-38: `finishing_products`

```sql
ALTER TABLE public.finishing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finishing_products read authenticated"
ON public.finishing_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:68)-69: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.lamination_products(id) ON DELETE RESTRICT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:73)-77: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:92)-99: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:18)-22: `finishing_products`

```sql
ALTER TABLE public.finishing_products
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT;
```

- [supabase/migrations/048_add_production_fields_to_client_order_items.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/048_add_production_fields_to_client_order_items.sql:4)-10: `client_order_items`

```sql
ALTER TABLE public.client_order_items 
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT,
  ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/049_add_selling_price_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/049_add_selling_price_to_finishing_products.sql:4)-5: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0);
```

- [supabase/migrations/050_add_production_specs_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/050_add_production_specs_to_finishing_products.sql:4)-11: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2118)-2119: `idx_roto_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_roto_products_brand ON public.roto_products (brand);
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2119)-2122: `idx_offset_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);

-- 2. Non-composite indexes for name/material_name sorting
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1328)-1329: `Allow read access to authenticated users on roto_products`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_products" 
ON public.roto_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1332)-1334: `Allow write access to admins on roto_products`

```sql
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1350)-1351: `Allow read access to authenticated users on offset_products`

```sql
CREATE POLICY "Allow read access to authenticated users on offset_products" 
ON public.offset_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1354)-1356: `Allow write access to admins on offset_products`

```sql
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:35)-45: `roto_products write permitted`

```sql
CREATE POLICY "roto_products write permitted" ON public.roto_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:49)-59: `offset_products write permitted`

```sql
CREATE POLICY "offset_products write permitted" ON public.offset_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('offset_products.create')
  OR public.has_permission('offset_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('offset_products.create')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:63)-73: `roto_product_colors write permitted`

```sql
CREATE POLICY "roto_product_colors write permitted" ON public.roto_product_colors
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:15)-17: `lamination_products read authenticated`

```sql
CREATE POLICY "lamination_products read authenticated"
ON public.lamination_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:19)-21: `lamination_products write admin`

```sql
CREATE POLICY "lamination_products write admin"
ON public.lamination_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:36)-38: `finishing_products read authenticated`

```sql
CREATE POLICY "finishing_products read authenticated"
ON public.finishing_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:40)-42: `finishing_products write admin`

```sql
CREATE POLICY "finishing_products write admin"
ON public.finishing_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:83)-89: `finishing_products_read_policy`

```sql
CREATE POLICY "finishing_products_read_policy" ON public.finishing_products
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:41): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:47): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:107): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:113): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:178): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:184): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:251): `.from("products")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:257): `.from("products")`

## profiles

### Schema Definition

Not found in source code.

### Alterations / FK / Constraints

Not found in source code.

### Indexes

Not found in source code.

### RLS Policies

Not found in source code.

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [scratch/check-user-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-permissions.mjs:10): `.from("profiles")`

## raw_material_consumptions

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1857)-1869: `raw_material_consumptions`

```sql
CREATE TABLE IF NOT EXISTS public.raw_material_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumption_date DATE NOT NULL DEFAULT CURRENT_DATE,
    raw_material_id UUID NOT NULL REFERENCES public.raw_materials(id),
    department TEXT NOT NULL,
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1872)-1874: `raw_material_consumptions`

```sql
ALTER TABLE public.raw_material_consumptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2181)-2182: `raw_material_consumptions`

```sql
ALTER TABLE public.raw_material_consumptions
  DROP CONSTRAINT IF EXISTS raw_material_consumptions_raw_material_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2184)-2185: `raw_material_consumptions`

```sql
ALTER TABLE public.raw_material_consumptions
  ADD CONSTRAINT raw_material_consumptions_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1876)-1883: `Allow read access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow read access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1887)-1898: `Allow write access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow write access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:171)-183: `raw_material_consumptions read permitted`

```sql
CREATE POLICY "raw_material_consumptions read permitted" ON public.raw_material_consumptions
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:186)-207: `raw_material_consumptions write permitted`

```sql
CREATE POLICY "raw_material_consumptions write permitted" ON public.raw_material_consumptions
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1941)-1943: `raw_consumption_updates_stock`

```sql
CREATE TRIGGER raw_consumption_updates_stock
AFTER INSERT OR UPDATE ON public.raw_material_consumptions
FOR EACH ROW EXECUTE FUNCTION public.apply_raw_material_consumption();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:244): `.from("raw_material_consumptions")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:262): `.from("raw_material_consumptions")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:268): `await supabase.from("raw_material_consumptions").delete().eq("id", consumption.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:275): `const { error: dConsErr } = await supabase.from("raw_material_consumptions").delete().eq("id", consumption.id);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:63): `? (supabase.from("raw_material_consumptions") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:64): `: (supabase.from("raw_material_consumptions") as any).insert({ ...payload, created_by: user.id });`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:88): `.from("raw_material_consumptions") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:113): `.from("raw_material_consumptions") as any)`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:34): `.from("raw_material_consumptions")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:38): `.from("raw_material_consumptions")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:42): `.from("raw_material_consumptions")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:40): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:48): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`

## raw_material_purchases

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:65)-80: `raw_material_purchases`

```sql
create table public.raw_material_purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_date date not null default current_date,
  raw_material_id uuid not null references public.raw_materials(id),
  supplier_name text,
  bill_number text,
  quantity numeric(12,3) not null check (quantity > 0),
  rate numeric(12,2) not null default 0 check (rate >= 0),
  total_amount numeric(14,2) generated always as (quantity * rate) stored,
  remarks text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:536)-537: `raw_materials`

```sql
alter table public.raw_materials enable row level security;
alter table public.raw_material_purchases enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:537)-538: `raw_material_purchases`

```sql
alter table public.raw_material_purchases enable row level security;
alter table public.settings enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2174)-2175: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases
  DROP CONSTRAINT IF EXISTS raw_material_purchases_raw_material_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2177)-2178: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases
  ADD CONSTRAINT raw_material_purchases_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:2)-5: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases RENAME COLUMN total_amount TO total_amount_old;

-- Add a new regular column
ALTER TABLE public.raw_material_purchases ADD COLUMN total_amount numeric(14,2);
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:5)-8: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases ADD COLUMN total_amount numeric(14,2);

-- Copy existing data to preserve history
UPDATE public.raw_material_purchases SET total_amount = COALESCE(total_amount_old, quantity * rate);
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:11)-14: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases DROP COLUMN total_amount_old;

-- Drop and recreate write policy to include accounts.purchase permission
DROP POLICY IF EXISTS "raw purchases permission write" ON public.raw_material_purchases;
```

- [supabase/migrations/051_add_jobwork_flag.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/051_add_jobwork_flag.sql:2)-3: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases
  ADD COLUMN IF NOT EXISTS is_jobwork BOOLEAN NOT NULL DEFAULT FALSE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:525)-526: `idx_fabric_types_active`

```sql
create index idx_fabric_types_active on public.fabric_types (status) where deleted_at is null;
create index idx_raw_material_purchases_date on public.raw_material_purchases (purchase_date desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:526)-527: `idx_raw_material_purchases_date`

```sql
create index idx_raw_material_purchases_date on public.raw_material_purchases (purchase_date desc) where deleted_at is null;
create index idx_production_recent on public.loom_production_entries (created_at desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2149)-2150: `idx_raw_material_purchases_material`

```sql
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_material ON public.raw_material_purchases(raw_material_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
```

- [supabase/migrations/004_journal_no_unique_and_indexes.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/004_journal_no_unique_and_indexes.sql:21)-23: `idx_raw_material_purchases_supplier_name`

```sql
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_supplier_name
  ON public.raw_material_purchases (supplier_name)
  WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:559)-560: `masters admin write raw`

```sql
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:560)-561: `raw purchases read active users`

```sql
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:561)-562: `raw purchases admin write`

```sql
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:691)-694: `raw purchases permission write`

```sql
create policy "raw purchases permission write" on public.raw_material_purchases
for all
using (public.is_admin() or public.has_permission('raw_materials.edit'))
with check (public.is_admin() or public.has_permission('raw_materials.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:904)-911: `raw purchases read permitted users`

```sql
create policy "raw purchases read permitted users" on public.raw_material_purchases
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:15)-26: `raw purchases permission write`

```sql
CREATE POLICY "raw purchases permission write" ON public.raw_material_purchases
FOR ALL
USING (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
);
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:30)-40: `raw purchases read permitted users`

```sql
CREATE POLICY "raw purchases read permitted users" ON public.raw_material_purchases
FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    public.is_admin()
    OR public.has_permission('raw_materials.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('accounts.purchase')
  )
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:494)-495: `touch_raw_materials`

```sql
create trigger touch_raw_materials before update on public.raw_materials for each row execute function public.touch_updated_at();
create trigger touch_raw_material_purchases before update on public.raw_material_purchases for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:495)-496: `touch_raw_material_purchases`

```sql
create trigger touch_raw_material_purchases before update on public.raw_material_purchases for each row execute function public.touch_updated_at();
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:507)-508: `sales_sync_rolls`

```sql
create trigger sales_sync_rolls after insert or update on public.sales_orders for each row execute function public.sync_rolls_for_sales_order();
create trigger raw_purchase_updates_stock after insert or update on public.raw_material_purchases for each row execute function public.apply_raw_material_purchase();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:508)-510: `raw_purchase_updates_stock`

```sql
create trigger raw_purchase_updates_stock after insert or update on public.raw_material_purchases for each row execute function public.apply_raw_material_purchase();

create trigger audit_roles after insert or update on public.roles for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:514)-515: `audit_raw_materials`

```sql
create trigger audit_raw_materials after insert or update on public.raw_materials for each row execute function public.audit_row_change();
create trigger audit_raw_material_purchases after insert or update on public.raw_material_purchases for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:515)-516: `audit_raw_material_purchases`

```sql
create trigger audit_raw_material_purchases after insert or update on public.raw_material_purchases for each row execute function public.audit_row_change();
create trigger audit_settings after insert or update on public.settings for each row execute function public.audit_row_change();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:63): `measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:76): `measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))`
- [scratch/find-duplicates.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-duplicates.mjs:19): `.from("raw_material_purchases")`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:22): `const { data: rm } = await supabase.from("raw_material_purchases").select("*").eq("bill_number", "73");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:23): `.from("raw_material_purchases")`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:35): `.from("raw_material_purchases")`
- [scratch/inspect_material_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_purchases.mjs:23): `.from("raw_material_purchases")`
- [scratch/inspect-created-times.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-created-times.mjs:19): `.from("raw_material_purchases")`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:19): `.from("raw_material_purchases")`
- [scratch/inspect-purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-purchases.mjs:19): `.from("raw_material_purchases")`
- [scratch/list_recent_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_recent_purchases.mjs:23): `.from("raw_material_purchases")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:226): `.from("raw_material_purchases")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:255): `await supabase.from("raw_material_purchases").delete().eq("id", purchase.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:269): `await supabase.from("raw_material_purchases").delete().eq("id", purchase.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:276): `const { error: dPurErr } = await supabase.from("raw_material_purchases").delete().eq("id", purchase.id);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:56): `const { data: insertedRows, error } = await (supabase.from("raw_material_purchases") as any).insert(inserts).select("id");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:112): `.from("raw_material_purchases") as any)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:128): `.from("raw_material_purchases") as any)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:136): `.from("raw_material_purchases") as any)`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:44): `.from("raw_material_purchases")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:36): `.from("raw_material_purchases")`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:43): `.from("raw_material_purchases")`

## raw_materials

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:51)-63: `raw_materials`

```sql
create table public.raw_materials (
  id uuid primary key default gen_random_uuid(),
  material_name text not null unique,
  unit text not null,
  opening_stock numeric(12,3) not null default 0 check (opening_stock >= 0),
  current_stock numeric(12,3) not null default 0 check (current_stock >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:535)-536: `fabric_types`

```sql
alter table public.fabric_types enable row level security;
alter table public.raw_materials enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:536)-537: `raw_materials`

```sql
alter table public.raw_materials enable row level security;
alter table public.raw_material_purchases enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1164)-1165: `looms`

```sql
alter table public.looms drop constraint if exists looms_loom_number_key;
alter table public.raw_materials drop constraint if exists raw_materials_material_name_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1165)-1166: `raw_materials`

```sql
alter table public.raw_materials drop constraint if exists raw_materials_material_name_key;
alter table public.employees drop constraint if exists employees_employee_code_key;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1301)-1303: `raw_materials`

```sql
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS critical_level NUMERIC DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1603)-1604: `raw_materials`

```sql
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS description TEXT;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2177)-2178: `raw_material_purchases`

```sql
ALTER TABLE public.raw_material_purchases
  ADD CONSTRAINT raw_material_purchases_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2184)-2185: `raw_material_consumptions`

```sql
ALTER TABLE public.raw_material_consumptions
  ADD CONSTRAINT raw_material_consumptions_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:767)-769: `idx_raw_materials_status_name`

```sql
create index if not exists idx_raw_materials_status_name
on public.raw_materials (status, material_name)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1170)-1171: `idx_looms_loom_number_unique`

```sql
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
create unique index if not exists idx_raw_materials_material_name_unique on public.raw_materials (material_name) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1171)-1172: `idx_raw_materials_material_name_unique`

```sql
create unique index if not exists idx_raw_materials_material_name_unique on public.raw_materials (material_name) where deleted_at is null;
create unique index if not exists idx_employees_employee_code_unique on public.employees (employee_code) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1612)-1614: `idx_raw_materials_department`

```sql
create index if not exists idx_raw_materials_department
on public.raw_materials (department, material_name)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2119)-2122: `idx_offset_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);

-- 2. Non-composite indexes for name/material_name sorting
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2122)-2123: `idx_raw_materials_name`

```sql
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:557)-558: `masters admin write fabric`

```sql
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:558)-559: `masters read active users raw`

```sql
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:559)-560: `masters admin write raw`

```sql
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:684)-687: `raw materials permission write`

```sql
create policy "raw materials permission write" on public.raw_materials
for all
using (public.is_admin() or public.has_permission('raw_materials.edit') or public.has_permission('raw_materials.delete'))
with check (public.is_admin() or public.has_permission('raw_materials.create') or public.has_permission('raw_materials.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:691)-694: `raw purchases permission write`

```sql
create policy "raw purchases permission write" on public.raw_material_purchases
for all
using (public.is_admin() or public.has_permission('raw_materials.edit'))
with check (public.is_admin() or public.has_permission('raw_materials.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:892)-900: `raw materials read permitted users`

```sql
create policy "raw materials read permitted users" on public.raw_materials
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:904)-911: `raw purchases read permitted users`

```sql
create policy "raw purchases read permitted users" on public.raw_material_purchases
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1876)-1883: `Allow read access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow read access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1887)-1898: `Allow write access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow write access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3143)-3146: `fabric types read authenticated`

```sql
CREATE POLICY "fabric types read authenticated" ON public.fabric_types FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 4. Relax SELECT policies on raw_materials
DROP POLICY IF EXISTS "raw materials read permitted users" ON public.raw_materials;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3148)-3151: `raw materials read authenticated`

```sql
CREATE POLICY "raw materials read authenticated" ON public.raw_materials FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 5. Relax SELECT policies on fabric_rolls
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:15)-26: `raw purchases permission write`

```sql
CREATE POLICY "raw purchases permission write" ON public.raw_material_purchases
FOR ALL
USING (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
);
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:30)-40: `raw purchases read permitted users`

```sql
CREATE POLICY "raw purchases read permitted users" ON public.raw_material_purchases
FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    public.is_admin()
    OR public.has_permission('raw_materials.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('accounts.purchase')
  )
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:142)-167: `raw materials permission write`

```sql
CREATE POLICY "raw materials permission write" ON public.raw_materials
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('raw_materials.delete')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.material')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('raw_materials.create')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.material')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:171)-183: `raw_material_consumptions read permitted`

```sql
CREATE POLICY "raw_material_consumptions read permitted" ON public.raw_material_consumptions
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:186)-207: `raw_material_consumptions write permitted`

```sql
CREATE POLICY "raw_material_consumptions write permitted" ON public.raw_material_consumptions
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:493)-494: `touch_fabric_types`

```sql
create trigger touch_fabric_types before update on public.fabric_types for each row execute function public.touch_updated_at();
create trigger touch_raw_materials before update on public.raw_materials for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:494)-495: `touch_raw_materials`

```sql
create trigger touch_raw_materials before update on public.raw_materials for each row execute function public.touch_updated_at();
create trigger touch_raw_material_purchases before update on public.raw_material_purchases for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:513)-514: `audit_fabric_types`

```sql
create trigger audit_fabric_types after insert or update on public.fabric_types for each row execute function public.audit_row_change();
create trigger audit_raw_materials after insert or update on public.raw_materials for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:514)-515: `audit_raw_materials`

```sql
create trigger audit_raw_materials after insert or update on public.raw_materials for each row execute function public.audit_row_change();
create trigger audit_raw_material_purchases after insert or update on public.raw_material_purchases for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:386)-396: `apply_raw_material_purchase`

```sql
create or replace function public.apply_raw_material_purchase()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.raw_materials
    set current_stock = current_stock + new.quantity,
        updated_at = now(),
        updated_by = new.updated_by
    where id = new.raw_material_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1817)-1827: `apply_raw_material_purchase`

```sql
CREATE OR REPLACE FUNCTION public.apply_raw_material_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1901)-1911: `apply_raw_material_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_raw_material_consumption()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock - NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2323)-2334: `apply_material_sales_stock`

```sql
CREATE OR REPLACE FUNCTION public.apply_material_sales_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    IF NEW.deleted_at IS NULL AND NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:62): `measure("Fetch materials", supabase.from("raw_materials").select("*").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:197): `measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),`
- [scratch/check-materials.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-materials.mjs:19): `.from("raw_materials")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:211): `.from("raw_materials")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:238): `await supabase.from("raw_materials").delete().eq("id", matId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:256): `await supabase.from("raw_materials").delete().eq("id", matId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:270): `await supabase.from("raw_materials").delete().eq("id", matId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:277): `const { error: dMatErr } = await supabase.from("raw_materials").delete().eq("id", matId);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:77): `.from("raw_materials") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:87): `.from("raw_materials") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:18): `.from("raw_materials") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:994): `.from("raw_materials") as any)`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:29): `.from("raw_materials")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:26): `.from("raw_materials")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:27): `.from("raw_materials")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:35): `.from("raw_materials")`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:20): `.from("raw_materials")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:29): `.from("raw_materials")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:37): `.from("raw_materials")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:29): `.from("raw_materials")`

## role_permissions

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:609)-615: `role_permissions`

```sql
create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:643)-644: `permissions`

```sql
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:644)-647: `role_permissions`

```sql
alter table public.role_permissions enable row level security;

-- --- START OF MIGRATION: 003_permission_policies.sql ---
drop policy if exists "roles admin write" on public.roles;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2158)-2160: `role_permissions`

```sql
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2162)-2164: `role_permissions`

```sql
ALTER TABLE public.role_permissions
  ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
  ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1623)-1624: `idx_role_permissions_role`

```sql
create index if not exists idx_role_permissions_role
on public.role_permissions (role_id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2151)-2160: `idx_sales_order_items_order`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);


-- --- START OF MIGRATION: 025_convert_soft_delete_to_cascade_hard_delete.sql ---
-- Migration: Convert soft delete constraints to cascade hard delete constraints

-- 1. Table: role_permissions
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:663)-666: `role permissions role managers write`

```sql
create policy "role permissions role managers write" on public.role_permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:857)-861: `role permissions readable by permitted users`

```sql
create policy "role permissions readable by permitted users" on public.role_permissions
for select using (
  public.has_permission('roles.view')
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = role_permissions.role_id)
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1001)-1003: `audit_role_permissions`

```sql
create trigger audit_role_permissions
after insert or delete on public.role_permissions
for each row execute function public.audit_role_permission_change();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:40): `.from("role_permissions")`
- [scratch/check-user-details.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-details.mjs:25): `.from("role_permissions")`
- [scratch/check-user-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-permissions.mjs:24): `.from("role_permissions")`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:180): `const { error: deleteError } = await (supabase.from("role_permissions") as any).delete().eq("role_id", roleId);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:184): `const { error: insertError } = await (supabase.from("role_permissions") as any).insert(rows as any);`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:32): `supabase.from("role_permissions").select("permission_id").eq("role_id", roleId),`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:17): `supabase.from("role_permissions").select("role_id, permission_id"),`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:91): `.from("role_permissions")`

## roles

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:4)-12: `roles`

```sql
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:532)-533: `roles`

```sql
alter table public.roles enable row level security;
alter table public.users enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:545)-547: `audit_logs`

```sql
alter table public.audit_logs enable row level security;

create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:644)-647: `role_permissions`

```sql
alter table public.role_permissions enable row level security;

-- --- START OF MIGRATION: 003_permission_policies.sql ---
drop policy if exists "roles admin write" on public.roles;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2162)-2164: `role_permissions`

```sql
ALTER TABLE public.role_permissions
  ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
  ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2170)-2171: `users`

```sql
ALTER TABLE public.users
  ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:530)-532: `idx_attendance_date`

```sql
create index idx_attendance_date on public.attendance (attendance_date desc) where deleted_at is null;

alter table public.roles enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1429)-1438: `idx_attendance_date`

```sql
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);


-- --- START OF MIGRATION: 012_use_production_serial_for_rolls.sql ---
-- Migration: Use Production Entry Serial Number as Roll/Stock Number and Drop Audit Triggers
-- Relates to: Using the serial number generated on production entry as the universal roll/stock number,
-- and removing all legacy audit triggers since the audit_logs table was removed.

-- 1. Drop all legacy audit triggers to avoid 'public.audit_logs does not exist' errors
DROP TRIGGER IF EXISTS audit_roles ON public.roles CASCADE;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:547)-548: `roles readable by active users`

```sql
create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:548)-550: `roles admin write`

```sql
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own or admin" on public.users for select using (id = auth.uid() or public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:649)-652: `roles permission write`

```sql
create policy "roles permission write" on public.roles
for all
using (public.is_admin() or public.has_permission('roles.edit') or public.has_permission('roles.delete'))
with check (public.is_admin() or public.has_permission('roles.create') or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:656)-659: `permissions role managers write`

```sql
create policy "permissions role managers write" on public.permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:663)-666: `role permissions role managers write`

```sql
create policy "role permissions role managers write" on public.role_permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:846)-853: `roles readable by permitted users`

```sql
create policy "roles readable by permitted users" on public.roles
for select using (
  deleted_at is null
  and (
    public.has_permission('roles.view')
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = roles.id)
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:857)-861: `role permissions readable by permitted users`

```sql
create policy "role permissions readable by permitted users" on public.role_permissions
for select using (
  public.has_permission('roles.view')
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = role_permissions.role_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1332)-1334: `Allow write access to admins on roto_products`

```sql
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1354)-1356: `Allow write access to admins on offset_products`

```sql
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1374)-1376: `Allow write access to admins on roto_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_colors" 
ON public.roto_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3083)-3089: `Allow write access to admins on roto_product_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_product_colors" 
ON public.roto_product_colors FOR ALL TO authenticated 
USING (auth.uid() IN (
    SELECT u.id FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE r.name = 'admin'
));
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:490)-491: `touch_roles`

```sql
create trigger touch_roles before update on public.roles for each row execute function public.touch_updated_at();
create trigger touch_users before update on public.users for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:508)-510: `raw_purchase_updates_stock`

```sql
create trigger raw_purchase_updates_stock after insert or update on public.raw_material_purchases for each row execute function public.apply_raw_material_purchase();

create trigger audit_roles after insert or update on public.roles for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:510)-511: `audit_roles`

```sql
create trigger audit_roles after insert or update on public.roles for each row execute function public.audit_row_change();
create trigger audit_users after insert or update on public.users for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:237)-253: `current_role_name`

```sql
create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.name
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = auth.uid()
    and u.status = 'active'
    and u.deleted_at is null
    and r.is_active = true
    and r.deleted_at is null
  limit 1
$$;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:25)-42: `is_internal_staff`

```sql
CREATE OR REPLACE FUNCTION public.is_internal_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid()
      AND r.name != 'client'
      AND u.status = 'active'
      AND u.deleted_at IS NULL
      AND r.is_active = true
      AND r.deleted_at IS NULL
  )
$$;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:34): `.from("roles")`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:45): `const { data: roles } = await supabase.from("roles").select("id, name");`
- [scripts/check-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/check-schema.mjs:44): `const { data: roles, error: rolesErr } = await supabase.from("roles").select("name").limit(5);`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:55): `.from("roles")`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:130): `const { error } = await (supabase.from("roles") as any).insert({`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:149): `.from("roles") as any)`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:167): `.from("roles") as any)`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:18): `supabase.from("roles").select("id, name").eq("is_active", true).is("deleted_at", null).order("name"),`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:30): `(supabase.from("roles") as any).select("*").eq("id", roleId).is("deleted_at", null).single(),`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:15): `supabase.from("roles").select("*").is("deleted_at", null).order("name"),`

## roto_colors

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1359)-1364: `roto_colors`

```sql
CREATE TABLE IF NOT EXISTS public.roto_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    color_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1367)-1369: `roto_colors`

```sql
ALTER TABLE public.roto_colors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_colors" ON public.roto_colors;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2870)-2875: `roto_colors`

```sql
ALTER TABLE public.roto_colors
  ADD COLUMN created_by UUID REFERENCES public.users(id),
  ADD COLUMN updated_by UUID REFERENCES public.users(id),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN deleted_at TIMESTAMPTZ;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:9)-17: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;

-- 2. Add enhancement columns to product_purchase_items
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:12)-17: `product_purchase_items`

```sql
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1370)-1371: `Allow read access to authenticated users on roto_colors`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_colors" 
ON public.roto_colors FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1374)-1376: `Allow write access to admins on roto_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_colors" 
ON public.roto_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2886)-2898: `roto_colors permission write`

```sql
CREATE POLICY "roto_colors permission write" ON public.roto_colors
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() 
    OR public.has_permission('roto_colors.edit') 
    OR public.has_permission('roto_colors.delete')
  )
  WITH CHECK (
    public.is_admin() 
    OR public.has_permission('roto_colors.create') 
    OR public.has_permission('roto_colors.edit')
  );
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2878)-2881: `touch_roto_colors`

```sql
CREATE TRIGGER touch_roto_colors
  BEFORE UPDATE ON public.roto_colors
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:232): `measure("Fetch roto colors definitions", supabase.from("roto_colors").select("*").is("deleted_at", null))`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:463): `.from("roto_colors")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:478): `.from("roto_colors")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:484): `await supabase.from("roto_colors").delete().eq("id", color.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:493): `const { error: dcErr } = await supabase.from("roto_colors").delete().eq("id", color.id);`
- [scripts/check-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/check-schema.mjs:28): `const { data: colors, error: colorErr } = await supabase.from("roto_colors").select("*").limit(1);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:147): `const { data: c } = await adminSupabase.from("roto_colors").select("color_name").eq("id", colorId).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:145): `.from("roto_colors") as any)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:66): `.from("roto_colors")`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:55): `.from("roto_colors")`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:25): `supabase.from("roto_colors").select("id, color_name").eq("status", "active").order("color_name"),`

## roto_film_rolls

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2439)-2454: `roto_film_rolls`

```sql
CREATE TABLE IF NOT EXISTS public.roto_film_rolls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id         TEXT UNIQUE NOT NULL,
  brand_id        UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  film_type       TEXT NOT NULL CHECK (film_type IN ('gloss', 'matt')),
  color_id        UUID REFERENCES public.roto_colors(id) ON DELETE SET NULL,
  weight_kg       NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters          NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2456)-2465: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:58)-59: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ADD CONSTRAINT lamination_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_film_rolls ADD CONSTRAINT roto_film_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:59)-60: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD CONSTRAINT roto_film_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_metallic_rolls ADD CONSTRAINT roto_metallic_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:55)-56: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:59)-74: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS s_no INTEGER;


-- 3. MIGRATE DATA & CAPITALIZE IDS

-- A. Roto Film Rolls (Generate sequential s_no grouped by roll_id)
WITH seq_assigned AS (
  SELECT id, row_number() OVER (PARTITION BY roll_id ORDER BY created_at) as new_s_no
  FROM public.roto_film_rolls
)
UPDATE public.roto_film_rolls r
SET 
  s_no = s.new_s_no,
  roll_id = UPPER(r.roll_id)
FROM seq_assigned s
WHERE r.id = s.id;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:126)-127: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.roto_metallic_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:6)-7: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:7)-8: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2458)-2465: `Allow read access to permitted users on roto_film_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2467)-2476: `Allow write access to permitted users on roto_film_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3172)-3175: `sales items read authenticated`

```sql
CREATE POLICY "sales items read authenticated" ON public.sales_order_items FOR SELECT TO authenticated USING (true);

-- 10. Relax SELECT policies on roto_film_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_film_rolls" ON public.roto_film_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3176)-3179: `Allow read access to authenticated on roto_film_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_film_rolls" ON public.roto_film_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 11. Relax SELECT policies on roto_metallic_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:61)-72: `roto_film_rolls write permitted`

```sql
CREATE POLICY "roto_film_rolls write permitted" ON public.roto_film_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
);
```

### Triggers

Not found in source code.

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2646)-2653: `apply_roto_metallic_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_split = FALSE THEN
      UPDATE public.roto_film_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_film_roll_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:161): `measure("Fetch roto consumption (gte date)", supabase.from("roto_film_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:167): `measure("Fetch roto production (eq date)", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:173): `measure("Fetch available roto rolls", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("status", "available").is("deleted_at", null))`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:24): `const { data: film } = await supabase.from("roto_film_rolls").select("id, roll_id, s_no, status").eq("status", "available");`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scripts/check-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/check-schema.mjs:36): `const { data: films, error: filmErr } = await supabase.from("roto_film_rolls").select("*").limit(1);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:161): `.from("roto_film_rolls")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:171): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:195): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:609): `await adminSupabase.from("roto_film_rolls").delete().eq("id", (metallic as any).source_film_roll_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:612): `await adminSupabase.from("roto_film_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:159): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:168): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:194): `const { data: roll } = await (supabase.from("roto_film_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:204): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:230): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:263): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:337): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:217): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:232): `.from("roto_film_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:842): `supabase.from("roto_film_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:136): `? supabase.from("roto_film_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:90): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:79): `.from("roto_film_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:86): `.from("roto_film_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:36): `.from("roto_film_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:84): `.from("roto_film_rolls")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:117): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:120): `.from("roto_film_rolls")`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:27): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:28): `supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:26): `.from("roto_film_rolls")`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:18): `.from("roto_film_rolls")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:68): `supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:74): `selectedRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:81): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:117): `uniqueRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## roto_metallic_rolls

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2480)-2494: `roto_metallic_rolls`

```sql
CREATE TABLE IF NOT EXISTS public.roto_metallic_rolls (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id              TEXT UNIQUE NOT NULL,
  source_film_roll_id  UUID NOT NULL REFERENCES public.roto_film_rolls(id) ON DELETE RESTRICT,
  is_split             BOOLEAN NOT NULL DEFAULT FALSE,
  weight_kg            NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters               NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  status               TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2496)-2505: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:59)-60: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD CONSTRAINT roto_film_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_metallic_rolls ADD CONSTRAINT roto_metallic_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
```

- [supabase/migrations/041_allow_sold_status.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/041_allow_sold_status.sql:60)-61: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ADD CONSTRAINT roto_metallic_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));

```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:55)-56: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:56)-57: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:126)-127: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.roto_metallic_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/042_redefine_roll_ids_and_sno.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/042_redefine_roll_ids_and_sno.sql:127)-128: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.lamination_rolls ALTER COLUMN s_no SET NOT NULL;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:7)-8: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

- [supabase/migrations/044_product_purchase_enhancements.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/044_product_purchase_enhancements.sql:8)-9: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2498)-2505: `Allow read access to permitted users on roto_metallic_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2507)-2516: `Allow write access to permitted users on roto_metallic_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3176)-3179: `Allow read access to authenticated on roto_film_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_film_rolls" ON public.roto_film_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 11. Relax SELECT policies on roto_metallic_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3180)-3183: `Allow read access to authenticated on roto_metallic_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_metallic_rolls" ON public.roto_metallic_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 12. Relax SELECT policies on lamination_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on lamination_rolls" ON public.lamination_rolls;
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:78)-89: `roto_metallic_rolls write permitted`

```sql
CREATE POLICY "roto_metallic_rolls write permitted" ON public.roto_metallic_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2665)-2667: `metallic_roll_consumes_film`

```sql
CREATE TRIGGER metallic_roll_consumes_film
AFTER INSERT OR DELETE ON public.roto_metallic_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_roto_metallic_consumption();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2802)-2810: `apply_lamination_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:28): `const { data: metallic } = await supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, status").eq("status", "available");`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:219): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:601): `.from("roto_metallic_rolls")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:607): `await adminSupabase.from("roto_metallic_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:199): `const { data: hasMetallic } = await (supabase.from("roto_metallic_rolls") as any).select("id").eq("source_film_roll_id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:245): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:280): `const { data: roll } = await (supabase.from("roto_metallic_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:290): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:346): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:420): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:187): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:202): `.from("roto_metallic_rolls") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:843): `supabase.from("roto_metallic_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:139): `? supabase.from("roto_metallic_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:91): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:65): `.from("roto_metallic_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:72): `.from("roto_metallic_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:42): `.from("roto_metallic_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:90): `.from("roto_metallic_rolls")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:118): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:126): `.from("roto_metallic_rolls")`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:29): `supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:32): `.from("roto_metallic_rolls")`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:22): `.from("roto_metallic_rolls")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:69): `supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:75): `selectedRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] })`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:82): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:118): `uniqueRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`

## roto_product_colors

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3065)-3072: `roto_product_colors`

```sql
CREATE TABLE IF NOT EXISTS public.roto_product_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roto_product_id UUID NOT NULL REFERENCES public.roto_products(id) ON DELETE CASCADE,
    color_id UUID NOT NULL REFERENCES public.roto_colors(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (roto_product_id, color_id)
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3075)-3078: `roto_product_colors`

```sql
ALTER TABLE public.roto_product_colors ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_product_colors" ON public.roto_product_colors;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3079)-3080: `Allow read access to authenticated users on roto_product_colors`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_product_colors" 
ON public.roto_product_colors FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3083)-3089: `Allow write access to admins on roto_product_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_product_colors" 
ON public.roto_product_colors FOR ALL TO authenticated 
USING (auth.uid() IN (
    SELECT u.id FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE r.name = 'admin'
));
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:63)-73: `roto_product_colors write permitted`

```sql
CREATE POLICY "roto_product_colors write permitted" ON public.roto_product_colors
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:77): `.from("roto_product_colors")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:86): `.from("roto_product_colors")`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:126): `.from("roto_product_colors") as any)`

## roto_products

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1314)-1322: `roto_products`

```sql
CREATE TABLE IF NOT EXISTS public.roto_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    num_cylinders INTEGER NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1325)-1327: `roto_products`

```sql
ALTER TABLE public.roto_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_products" ON public.roto_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2405)-2406: `roto_products`

```sql
ALTER TABLE public.roto_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:92)-99: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/048_add_production_fields_to_client_order_items.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/048_add_production_fields_to_client_order_items.sql:4)-10: `client_order_items`

```sql
ALTER TABLE public.client_order_items 
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT,
  ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/050_add_production_specs_to_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/050_add_production_specs_to_finishing_products.sql:4)-11: `finishing_products`

```sql
ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2118)-2119: `idx_roto_products_brand`

```sql
CREATE INDEX IF NOT EXISTS idx_roto_products_brand ON public.roto_products (brand);
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1328)-1329: `Allow read access to authenticated users on roto_products`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_products" 
ON public.roto_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1332)-1334: `Allow write access to admins on roto_products`

```sql
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:35)-45: `roto_products write permitted`

```sql
CREATE POLICY "roto_products write permitted" ON public.roto_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:63)-73: `roto_product_colors write permitted`

```sql
CREATE POLICY "roto_product_colors write permitted" ON public.roto_product_colors
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);
```

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:205): `measure("Fetch roto products definitions", supabase.from("roto_products").select("*")),`
- [scratch/check_columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_columns.mjs:21): `const { data: roto } = await supabase.from("roto_products").select("*").limit(1);`
- [scratch/check_roto_products.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_roto_products.mjs:22): `.from("roto_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:410): `.from("roto_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:423): `.from("roto_products")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:429): `await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:445): `await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:457): `await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:473): `await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:486): `await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:491): `const { error: drErr } = await supabase.from("roto_products").delete().eq("id", roto.id);`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:41): `.from("roto_products")`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:56): `await supabase.from("roto_products").delete().eq("id", rotoData[0].id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:138): `.from("roto_products")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:251): `const { data: p } = await adminSupabase.from("roto_products").select("brand").eq("id", rotoProductId).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:129): `.from("roto_products") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:356): `.from("roto_products") as any)`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:66): `const { error } = await (supabase.from("roto_products") as any).update(payload).eq("id", id);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:69): `const { data, error } = await (supabase.from("roto_products") as any).insert(payload).select("id").single();`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:140): `.from("roto_products") as any)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:50): `.from("roto_products")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:47): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:35): `supabase.from("roto_products").select("id, brand").eq("status", "active"),`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:60): `.from("roto_products")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:25): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:83): `.from("roto_products")`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:24): `supabase.from("roto_products").select("id, brand, customer_id").eq("status", "active").order("brand"),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:33): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:120): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:33): `supabase.from("roto_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:35): `supabase.from("roto_products").select("id, brand, status").eq("status", "active"),`

## sales_deliveries

### Schema Definition

Not found in source code.

### Alterations / FK / Constraints

Not found in source code.

### Indexes

Not found in source code.

### RLS Policies

Not found in source code.

### Triggers

Not found in source code.

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [scratch/inspect_deliveries_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_deliveries_73.mjs:23): `.from("sales_deliveries")`

## sales_order_items

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1379)-1386: `sales_order_items`

```sql
CREATE TABLE IF NOT EXISTS public.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    product_id UUID NOT NULL,
    quantity NUMERIC NOT NULL,
    selected_roll_ids UUID[] DEFAULT '{}'::uuid[]
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1389)-1391: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2083)-2088: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;


-- --- START OF MIGRATION: 020_add_journal_no.sql ---
-- Migration: Add journal_no to accounts_journal
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2231)-2232: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
  DROP CONSTRAINT IF EXISTS sales_order_items_sales_order_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2234)-2235: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
  ADD CONSTRAINT sales_order_items_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2254)-2259: `sales_orders`

```sql
ALTER TABLE public.sales_orders DROP CONSTRAINT IF EXISTS sales_orders_order_number_key;


-- --- START OF MIGRATION: 027_add_billing_details_to_items.sql ---
-- Migration: Add billing details to sales order items and sales orders for Sales Confirmation Report
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2259)-2260: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:88)-99: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

- [supabase/migrations/010_dynamic_lamination_and_finishing_products.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/010_dynamic_lamination_and_finishing_products.sql:92)-99: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1620)-1621: `idx_sales_order_items_roll_ids`

```sql
create index if not exists idx_sales_order_items_roll_ids
on public.sales_order_items using gin (selected_roll_ids);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2150)-2151: `idx_loom_production_entries_fabric`

```sql
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2151)-2160: `idx_sales_order_items_order`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);


-- --- START OF MIGRATION: 025_convert_soft_delete_to_cascade_hard_delete.sql ---
-- Migration: Convert soft delete constraints to cascade hard delete constraints

-- 1. Table: role_permissions
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1392)-1399: `Allow read access to authenticated users on sales_order_items`

```sql
CREATE POLICY "Allow read access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1402)-1413: `Allow write access to authenticated users on sales_order_items`

```sql
CREATE POLICY "Allow write access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3168)-3171: `sales read authenticated`

```sql
CREATE POLICY "sales read authenticated" ON public.sales_orders FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 9. Relax SELECT policies on sales_order_items
DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3172)-3175: `sales items read authenticated`

```sql
CREATE POLICY "sales items read authenticated" ON public.sales_order_items FOR SELECT TO authenticated USING (true);

-- 10. Relax SELECT policies on roto_film_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_film_rolls" ON public.roto_film_rolls;
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:98)-115: `sales_order_items write permitted`

```sql
CREATE POLICY "sales_order_items write permitted" ON public.sales_order_items
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:118)-127: `sales_order_items read permitted`

```sql
CREATE POLICY "sales_order_items read permitted" ON public.sales_order_items
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
);
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:62)-69: `client_sales_order_items_policy`

```sql
CREATE POLICY "client_sales_order_items_policy" ON public.sales_order_items
  FOR ALL TO authenticated
  USING (
    sales_order_id IN (
      SELECT id FROM public.sales_orders
      WHERE customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

### Triggers

Not found in source code.

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1648)-1691: `get_roll_allocations_for_fabric`

```sql
create or replace function public.get_roll_allocations_for_fabric(p_fabric_type_id uuid)
returns table (
  roll_id uuid,
  dispatch_date date,
  client_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (allocation.roll_id)
    allocation.roll_id,
    allocation.dispatch_date,
    allocation.client_name
  from (
    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_orders so on so.selected_roll_ids @> array[fr.id]::uuid[]
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'

    union all

    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_order_items soi on soi.selected_roll_ids @> array[fr.id]::uuid[]
    join public.sales_orders so on so.id = soi.sales_order_id
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'
  ) allocation
  order by allocation.roll_id, allocation.dispatch_date desc;
```

### Runtime Read/Write/Update/Delete Evidence

- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:71): `.from("sales_order_items")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:162): `.from("sales_order_items")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:180): `.from("sales_order_items")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:186): `await supabase.from("sales_order_items").delete().eq("id", orderItem.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:194): `const { error: dItemErr } = await supabase.from("sales_order_items").delete().eq("id", orderItem.id);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:160): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:76): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:115): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:129): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:157): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:163): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:275): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:298): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:319): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:329): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:337): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:399): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:440): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:490): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:528): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:749): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:806): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1162): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1296): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1306): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1329): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1339): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1347): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1375): `.from("sales_order_items") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1386): `.from("sales_order_items") as any)`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:54): `.from("sales_order_items")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:43): `.from("sales_order_items")`

## sales_orders

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:192)-208: `sales_orders`

```sql
create table public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  order_date date not null default current_date,
  customer_id uuid not null references public.customers(id),
  fabric_type_id uuid not null references public.fabric_types(id),
  quantity_meters numeric(12,2) not null check (quantity_meters > 0),
  rate numeric(12,2) not null check (rate >= 0),
  total_amount numeric(14,2) generated always as (quantity_meters * rate) stored,
  selected_roll_ids uuid[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'cancelled')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:543)-544: `fabric_rolls`

```sql
alter table public.fabric_rolls enable row level security;
alter table public.sales_orders enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:544)-545: `sales_orders`

```sql
alter table public.sales_orders enable row level security;
alter table public.audit_logs enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1416)-1420: `sales_orders`

```sql
ALTER TABLE public.sales_orders 
ALTER COLUMN fabric_type_id DROP NOT NULL,
ALTER COLUMN quantity_meters DROP NOT NULL,
ALTER COLUMN rate DROP NOT NULL,
ALTER COLUMN total_amount DROP NOT NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2099)-2106: `customers`

```sql
ALTER TABLE public.customers ALTER COLUMN is_internal SET DEFAULT 'client a/c';


-- --- START OF MIGRATION: 022_add_billing_to_sales_orders.sql ---
-- Migration: Add billing fields to sales_orders for Sales Entry workflow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS bill_number TEXT,
ADD COLUMN IF NOT EXISTS bill_value NUMERIC(14,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2104)-2106: `sales_orders`

```sql
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS bill_number TEXT,
ADD COLUMN IF NOT EXISTS bill_value NUMERIC(14,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2222)-2224: `sales_orders`

```sql
ALTER TABLE public.sales_orders
  DROP CONSTRAINT IF EXISTS sales_orders_customer_id_fkey,
  DROP CONSTRAINT IF EXISTS sales_orders_fabric_type_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2226)-2228: `sales_orders`

```sql
ALTER TABLE public.sales_orders
  ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  ADD CONSTRAINT sales_orders_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2234)-2235: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
  ADD CONSTRAINT sales_order_items_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2254)-2259: `sales_orders`

```sql
ALTER TABLE public.sales_orders DROP CONSTRAINT IF EXISTS sales_orders_order_number_key;


-- --- START OF MIGRATION: 027_add_billing_details_to_items.sql ---
-- Migration: Add billing details to sales order items and sales orders for Sales Confirmation Report
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2259)-2260: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2260)-2267: `sales_orders`

```sql
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;


-- --- START OF MIGRATION: 028_add_opening_balances_to_customers.sql ---
-- Migration: Add opening balances to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS opening_debit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS opening_credit NUMERIC(12,2) NOT NULL DEFAULT 0;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3051)-3052: `sales_orders`

```sql
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS is_draft_billing BOOLEAN NOT NULL DEFAULT FALSE;
```

- [supabase/migrations/051_add_jobwork_flag.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/051_add_jobwork_flag.sql:6)-7: `sales_orders`

```sql
ALTER TABLE public.sales_orders
  ADD COLUMN IF NOT EXISTS is_jobwork BOOLEAN NOT NULL DEFAULT FALSE;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:528)-529: `idx_rolls_fabric_status`

```sql
create index idx_rolls_fabric_status on public.fabric_rolls (fabric_type_id, status) where deleted_at is null;
create index idx_sales_date on public.sales_orders (order_date desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:529)-530: `idx_sales_date`

```sql
create index idx_sales_date on public.sales_orders (order_date desc) where deleted_at is null;
create index idx_attendance_date on public.attendance (attendance_date desc) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:763)-765: `idx_sales_order_date_status`

```sql
create index if not exists idx_sales_order_date_status
on public.sales_orders (order_date desc, status)
where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1427)-1428: `idx_production_entry_date`

```sql
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1428)-1429: `idx_sales_orders_customer`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1616)-1618: `idx_sales_orders_roll_ids`

```sql
create index if not exists idx_sales_orders_roll_ids
on public.sales_orders using gin (selected_roll_ids)
where deleted_at is null and status = 'confirmed';
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2123)-2126: `idx_employees_name`

```sql
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;

-- 3. Composite index for sales order billing status & date lookups
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2126)-2132: `idx_sales_orders_billing_status_date`

```sql
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;


-- --- START OF MIGRATION: 024_add_account_id_to_journal.sql ---
-- 1. Add account_id column referencing customers
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:585)-587: `rolls admin write`

```sql
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());

create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:587)-588: `sales read active users`

```sql
create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
create policy "sales admin write" on public.sales_orders for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:588)-590: `sales admin write`

```sql
create policy "sales admin write" on public.sales_orders for all using (public.is_admin()) with check (public.is_admin());

create policy "audit read admin" on public.audit_logs for select using (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:719)-722: `sales permission write`

```sql
create policy "sales permission write" on public.sales_orders
for all
using (public.is_admin() or public.has_permission('sales.edit'))
with check (public.is_admin() or public.has_permission('sales.create') or public.has_permission('sales.edit'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:952)-959: `sales read permitted users`

```sql
create policy "sales read permitted users" on public.sales_orders
for select using (
  deleted_at is null
  and (
    public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3163)-3166: `production read authenticated`

```sql
CREATE POLICY "production read authenticated" ON public.loom_production_entries FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 8. Relax SELECT policies on sales_orders
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3168)-3171: `sales read authenticated`

```sql
CREATE POLICY "sales read authenticated" ON public.sales_orders FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 9. Relax SELECT policies on sales_order_items
DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:77)-93: `sales permission write`

```sql
CREATE POLICY "sales permission write" ON public.sales_orders
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:102)-112: `sales read permitted users`

```sql
CREATE POLICY "sales read permitted users" ON public.sales_orders
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('sales.view')
    or public.has_permission('sales.order_confirmation')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:53)-58: `client_sales_orders_policy`

```sql
CREATE POLICY "client_sales_orders_policy" ON public.sales_orders
  FOR ALL TO authenticated
  USING (
    customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR created_by = auth.uid()
  );
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:62)-69: `client_sales_order_items_policy`

```sql
CREATE POLICY "client_sales_order_items_policy" ON public.sales_order_items
  FOR ALL TO authenticated
  USING (
    sales_order_id IN (
      SELECT id FROM public.sales_orders
      WHERE customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:501)-502: `touch_rolls`

```sql
create trigger touch_rolls before update on public.fabric_rolls for each row execute function public.touch_updated_at();
create trigger touch_sales before update on public.sales_orders for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:502)-504: `touch_sales`

```sql
create trigger touch_sales before update on public.sales_orders for each row execute function public.touch_updated_at();

create trigger prepare_production before insert or update on public.loom_production_entries for each row execute function public.prepare_production_entry();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:505)-506: `production_creates_roll`

```sql
create trigger production_creates_roll after insert or update on public.loom_production_entries for each row execute function public.create_or_sync_fabric_roll();
create trigger prepare_sales before insert on public.sales_orders for each row execute function public.prepare_sales_order();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:506)-507: `prepare_sales`

```sql
create trigger prepare_sales before insert on public.sales_orders for each row execute function public.prepare_sales_order();
create trigger sales_sync_rolls after insert or update on public.sales_orders for each row execute function public.sync_rolls_for_sales_order();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:507)-508: `sales_sync_rolls`

```sql
create trigger sales_sync_rolls after insert or update on public.sales_orders for each row execute function public.sync_rolls_for_sales_order();
create trigger raw_purchase_updates_stock after insert or update on public.raw_material_purchases for each row execute function public.apply_raw_material_purchase();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:521)-522: `audit_rolls`

```sql
create trigger audit_rolls after insert or update on public.fabric_rolls for each row execute function public.audit_row_change();
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:522)-524: `audit_sales`

```sql
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();

create index idx_looms_active on public.looms (status) where deleted_at is null;
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:415)-421: `prepare_sales_order`

```sql
create or replace function public.prepare_sales_order()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number = public.next_year_number('ORD', 'sales_orders', 'order_number');
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1648)-1691: `get_roll_allocations_for_fabric`

```sql
create or replace function public.get_roll_allocations_for_fabric(p_fabric_type_id uuid)
returns table (
  roll_id uuid,
  dispatch_date date,
  client_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (allocation.roll_id)
    allocation.roll_id,
    allocation.dispatch_date,
    allocation.client_name
  from (
    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_orders so on so.selected_roll_ids @> array[fr.id]::uuid[]
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'

    union all

    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_order_items soi on soi.selected_roll_ids @> array[fr.id]::uuid[]
    join public.sales_orders so on so.id = soi.sales_order_id
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'
  ) allocation
  order by allocation.roll_id, allocation.dispatch_date desc;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:82): `measure("Fetch draft sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "draft").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:83): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").eq("order_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:191): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").gte("order_date", "2026-07-01").lte("order_date", "2026-07-14").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:198): `measure("Fetch sales orders basic info", supabase.from("sales_orders").select("id, status, sales_order_items(id, department, selected_roll_ids)").is("deleted_at", null))`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:16): `.from("sales_orders")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:39): `.from("sales_orders")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:10): `.from("sales_orders")`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:10): `.from("sales_orders")`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:10): `.from("sales_orders")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:79): `.from("sales_orders")`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:50): `.from("sales_orders")`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:26): `const { data: so } = await supabase.from("sales_orders").select("*").ilike("order_number", "%73%");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:30): `const { data: sd } = await supabase.from("sales_orders").select("*").ilike("order_number", "DP-%73%");`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:23): `.from("sales_orders")`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:23): `.from("sales_orders")`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:23): `.from("sales_orders")`
- [scratch/inspect_updated_at.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_updated_at.mjs:22): `.from("sales_orders")`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:27): `.from("sales_orders")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:144): `.from("sales_orders")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:172): `await supabase.from("sales_orders").delete().eq("id", orderId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:187): `await supabase.from("sales_orders").delete().eq("id", orderId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:195): `const { error: dOrderErr } = await supabase.from("sales_orders").delete().eq("id", orderId);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:130): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:164): `await (admin.from("sales_orders") as any).delete().eq("id", salesOrder.id);`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:52): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:29): `? (supabase.from("sales_orders") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:30): `: (supabase.from("sales_orders") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:56): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:77): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:171): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:192): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:370): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:406): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:413): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:517): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:538): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:571): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:597): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:654): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:680): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:699): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:757): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:782): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:796): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1130): `.from("sales_orders")`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1251): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1394): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1429): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1459): `.from("sales_orders") as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1575): `.from("sales_orders") as any)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:33): `(supabase.from("sales_orders") as any)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:39): `(supabase.from("sales_orders") as any)`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:26): `const { data: orders } = await (supabase.from("sales_orders") as any)`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:42): `.from("sales_orders") as any)`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:54): `.from("sales_orders")`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:38): `.from("sales_orders")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:67): `.from("sales_orders")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:62): `.from("sales_orders")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:38): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:27): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:22): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:33): `.from("sales_orders")`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:38): `.from("sales_orders")`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:55): `const { data } = await (supabase.from("sales_orders") as any)`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:63): `const { data } = await (supabase.from("sales_orders") as any)`

## settings

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:82)-92: `settings`

```sql
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:537)-538: `raw_material_purchases`

```sql
alter table public.raw_material_purchases enable row level security;
alter table public.settings enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:538)-539: `settings`

```sql
alter table public.settings enable row level security;
alter table public.employees enable row level security;
```

### Indexes

Not found in source code.

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:561)-562: `raw purchases admin write`

```sql
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:562)-563: `settings read active users`

```sql
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:563)-564: `settings admin write`

```sql
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:289)-298: `settings write permitted`

```sql
CREATE POLICY "settings write permitted" ON public.settings
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('reports.view')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('reports.view')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:495)-496: `touch_raw_material_purchases`

```sql
create trigger touch_raw_material_purchases before update on public.raw_material_purchases for each row execute function public.touch_updated_at();
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:496)-497: `touch_settings`

```sql
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();
create trigger touch_employees before update on public.employees for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:515)-516: `audit_raw_material_purchases`

```sql
create trigger audit_raw_material_purchases after insert or update on public.raw_material_purchases for each row execute function public.audit_row_change();
create trigger audit_settings after insert or update on public.settings for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:516)-517: `audit_settings`

```sql
create trigger audit_settings after insert or update on public.settings for each row execute function public.audit_row_change();
create trigger audit_employees after insert or update on public.employees for each row execute function public.audit_row_change();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:220): `measure("Fetch setting records", supabase.from("settings").select("*"))`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:505): `.from("settings")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:516): `.from("settings")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:522): `await supabase.from("settings").delete().eq("id", setting.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:527): `.from("settings")`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:159): `const { data: existing } = await (supabase.from("settings") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:165): `const { error } = await (supabase.from("settings") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:170): `const { error } = await (supabase.from("settings") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:203): `const { data: existing } = await (supabase.from("settings") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:209): `const { error } = await (supabase.from("settings") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:214): `const { error } = await (supabase.from("settings") as any)`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:27): `.from("settings")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:32): `.from("settings")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:161): `.from("settings")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:26): `.from("settings")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:79): `.from("settings")`

## stage_production_entries

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1947)-1960: `stage_production_entries`

```sql
CREATE TABLE IF NOT EXISTS public.stage_production_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    roll_id UUID NOT NULL REFERENCES public.fabric_rolls(id),
    stage TEXT NOT NULL CHECK (stage IN ('roto_printing', 'lamination', 'offset_printing', 'finishing')),
    product_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1963)-1965: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entries" ON public.stage_production_entries;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2238)-2239: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries
  DROP CONSTRAINT IF EXISTS stage_production_entries_roll_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2241)-2242: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries
  ADD CONSTRAINT stage_production_entries_roll_id_fkey FOREIGN KEY (roll_id) REFERENCES public.fabric_rolls(id) ON DELETE CASCADE;
```

### Indexes

- [supabase/migrations/004_journal_no_unique_and_indexes.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/004_journal_no_unique_and_indexes.sql:31)-33: `idx_stage_production_entries_roll_id`

```sql
CREATE INDEX IF NOT EXISTS idx_stage_production_entries_roll_id
  ON public.stage_production_entries (roll_id)
  WHERE deleted_at IS NULL;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1967)-1974: `Allow read access to permitted users on stage_production_entries`

```sql
CREATE POLICY "Allow read access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1978)-1987: `Allow write access to permitted users on stage_production_entries`

```sql
CREATE POLICY "Allow write access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/007_fix_production_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/007_fix_production_rls.sql:38)-55: `stage_production write permitted`

```sql
CREATE POLICY "stage_production write permitted" ON public.stage_production_entries
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
  OR public.has_permission('lamination.production')
  OR public.has_permission('offset_printing.production')
  OR public.has_permission('finishing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
  OR public.has_permission('lamination.production')
  OR public.has_permission('offset_printing.production')
  OR public.has_permission('finishing.production')
);
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2030)-2032: `stage_production_updates_roll`

```sql
CREATE TRIGGER stage_production_updates_roll
AFTER INSERT OR UPDATE ON public.stage_production_entries
FOR EACH ROW EXECUTE FUNCTION public.apply_stage_production();
```

### Views / RPCs

Not found in source code.

### Runtime Read/Write/Update/Delete Evidence

- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:356): `.from("stage_production_entries")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:376): `.from("stage_production_entries")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:382): `await supabase.from("stage_production_entries").delete().eq("id", stageEntry.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:391): `const { error: dStageErr } = await supabase.from("stage_production_entries").delete().eq("id", stageEntry.id);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:719): `? (adminSupabase.from("stage_production_entries") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:720): `: (adminSupabase.from("stage_production_entries") as any).insert({ ...payload, created_by: user.id });`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:744): `.from("stage_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:769): `.from("stage_production_entries") as any)`

## users

### Schema Definition

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:14)-24: `users`

```sql
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  full_name text not null,
  email text not null unique,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### Alterations / FK / Constraints

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:532)-533: `roles`

```sql
alter table public.roles enable row level security;
alter table public.users enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:533)-534: `users`

```sql
alter table public.users enable row level security;
alter table public.looms enable row level security;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:545)-547: `audit_logs`

```sql
alter table public.audit_logs enable row level security;

create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:744)-745: `employees`

```sql
alter table public.employees
  add column if not exists user_id uuid references public.users(id);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1325)-1327: `roto_products`

```sql
ALTER TABLE public.roto_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_products" ON public.roto_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1347)-1349: `offset_products`

```sql
ALTER TABLE public.offset_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on offset_products" ON public.offset_products;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1367)-1369: `roto_colors`

```sql
ALTER TABLE public.roto_colors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_colors" ON public.roto_colors;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1389)-1391: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1872)-1874: `raw_material_consumptions`

```sql
ALTER TABLE public.raw_material_consumptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1963)-1965: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entries" ON public.stage_production_entries;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2051)-2053: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journal" ON public.accounts_journal;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2167)-2168: `users`

```sql
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_id_fkey;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2170)-2171: `users`

```sql
ALTER TABLE public.users
  ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2191)-2192: `employees`

```sql
ALTER TABLE public.employees
  ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2295)-2298: `material_sales`

```sql
ALTER TABLE public.material_sales ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to permitted users on material_sales" ON public.material_sales;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2456)-2465: `roto_film_rolls`

```sql
ALTER TABLE public.roto_film_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2496)-2505: `roto_metallic_rolls`

```sql
ALTER TABLE public.roto_metallic_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2538)-2547: `lamination_rolls`

```sql
ALTER TABLE public.lamination_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2579)-2588: `offset_rolls`

```sql
ALTER TABLE public.offset_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2620)-2629: `finishing_bundles`

```sql
ALTER TABLE public.finishing_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2870)-2875: `roto_colors`

```sql
ALTER TABLE public.roto_colors
  ADD COLUMN created_by UUID REFERENCES public.users(id),
  ADD COLUMN updated_by UUID REFERENCES public.users(id),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN deleted_at TIMESTAMPTZ;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3075)-3078: `roto_product_colors`

```sql
ALTER TABLE public.roto_product_colors ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_product_colors" ON public.roto_product_colors;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3133)-3136: `users`

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Relax SELECT policies on looms
DROP POLICY IF EXISTS "looms read permitted users" ON public.looms;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:9)-10: `users`

```sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
```

### Indexes

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1626)-1628: `idx_users_auth_lookup`

```sql
create index if not exists idx_users_auth_lookup
on public.users (id, role_id, status)
where deleted_at is null;
```

### RLS Policies

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:547)-548: `roles readable by active users`

```sql
create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:548)-550: `roles admin write`

```sql
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own or admin" on public.users for select using (id = auth.uid() or public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:550)-551: `users read own or admin`

```sql
create policy "users read own or admin" on public.users for select using (id = auth.uid() or public.is_admin());
create policy "users admin insert" on public.users for insert with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:551)-552: `users admin insert`

```sql
create policy "users admin insert" on public.users for insert with check (public.is_admin());
create policy "users admin update" on public.users for update using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:552)-554: `users admin update`

```sql
create policy "users admin update" on public.users for update using (public.is_admin()) with check (public.is_admin());

create policy "masters read active users looms" on public.looms for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:554)-555: `masters read active users looms`

```sql
create policy "masters read active users looms" on public.looms for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:555)-556: `masters admin write looms`

```sql
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:556)-557: `masters read active users fabric`

```sql
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:557)-558: `masters admin write fabric`

```sql
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:558)-559: `masters read active users raw`

```sql
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:559)-560: `masters admin write raw`

```sql
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:560)-561: `raw purchases read active users`

```sql
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:561)-562: `raw purchases admin write`

```sql
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:562)-563: `settings read active users`

```sql
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:563)-564: `settings admin write`

```sql
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:564)-565: `masters read active users employees`

```sql
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:565)-566: `masters admin write employees`

```sql
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:566)-567: `masters read active users customers`

```sql
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:567)-569: `masters admin write customers`

```sql
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:569)-570: `attendance read active users`

```sql
create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:570)-572: `attendance admin write`

```sql
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());

create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:572)-574: `production read active users`

```sql
create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
create policy "production insert admin operator" on public.loom_production_entries
for insert with check ((public.is_admin() or public.is_operator()) and created_by = auth.uid());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:584)-585: `rolls read active users`

```sql
create policy "rolls read active users" on public.fabric_rolls for select using (auth.uid() is not null and deleted_at is null);
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:585)-587: `rolls admin write`

```sql
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());

create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:587)-588: `sales read active users`

```sql
create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
create policy "sales admin write" on public.sales_orders for all using (public.is_admin()) with check (public.is_admin());
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:590)-591: `audit read admin`

```sql
create policy "audit read admin" on public.audit_logs for select using (public.is_admin());
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:591)-606: `audit insert active users`

```sql
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);


-- --- START OF MIGRATION: 002_attendance_permissions.sql ---

-- 1. Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:821)-822: `audit read permitted users`

```sql
create policy "audit read permitted users" on public.audit_logs
for select using (public.is_admin() or public.has_permission('audit_logs.view'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:841)-842: `users read own or permitted`

```sql
create policy "users read own or permitted" on public.users
for select using (id = auth.uid() or public.is_admin() or public.has_permission('users.view'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:846)-853: `roles readable by permitted users`

```sql
create policy "roles readable by permitted users" on public.roles
for select using (
  deleted_at is null
  and (
    public.has_permission('roles.view')
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = roles.id)
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:857)-861: `role permissions readable by permitted users`

```sql
create policy "role permissions readable by permitted users" on public.role_permissions
for select using (
  public.has_permission('roles.view')
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = role_permissions.role_id)
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:865)-874: `looms read permitted users`

```sql
create policy "looms read permitted users" on public.looms
for select using (
  deleted_at is null
  and (
    public.has_permission('looms.view')
    or public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:878)-888: `fabric types read permitted users`

```sql
create policy "fabric types read permitted users" on public.fabric_types
for select using (
  deleted_at is null
  and (
    public.has_permission('fabric_types.view')
    or public.has_permission('production.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:892)-900: `raw materials read permitted users`

```sql
create policy "raw materials read permitted users" on public.raw_materials
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:904)-911: `raw purchases read permitted users`

```sql
create policy "raw purchases read permitted users" on public.raw_material_purchases
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:915)-923: `customers read permitted users`

```sql
create policy "customers read permitted users" on public.customers
for select using (
  deleted_at is null
  and (
    public.has_permission('customers.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:927)-935: `production read permitted users`

```sql
create policy "production read permitted users" on public.loom_production_entries
for select using (
  deleted_at is null
  and (
    public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:939)-948: `rolls read permitted users`

```sql
create policy "rolls read permitted users" on public.fabric_rolls
for select using (
  deleted_at is null
  and (
    public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:952)-959: `sales read permitted users`

```sql
create policy "sales read permitted users" on public.sales_orders
for select using (
  deleted_at is null
  and (
    public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1328)-1329: `Allow read access to authenticated users on roto_products`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_products" 
ON public.roto_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1332)-1334: `Allow write access to admins on roto_products`

```sql
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1350)-1351: `Allow read access to authenticated users on offset_products`

```sql
CREATE POLICY "Allow read access to authenticated users on offset_products" 
ON public.offset_products FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1354)-1356: `Allow write access to admins on offset_products`

```sql
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1370)-1371: `Allow read access to authenticated users on roto_colors`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_colors" 
ON public.roto_colors FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1374)-1376: `Allow write access to admins on roto_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_colors" 
ON public.roto_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1392)-1399: `Allow read access to authenticated users on sales_order_items`

```sql
CREATE POLICY "Allow read access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1402)-1413: `Allow write access to authenticated users on sales_order_items`

```sql
CREATE POLICY "Allow write access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1876)-1883: `Allow read access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow read access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1887)-1898: `Allow write access to permitted users on raw_material_consumptions`

```sql
CREATE POLICY "Allow write access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1967)-1974: `Allow read access to permitted users on stage_production_entries`

```sql
CREATE POLICY "Allow read access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1978)-1987: `Allow write access to permitted users on stage_production_entries`

```sql
CREATE POLICY "Allow write access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2055)-2061: `Allow read access to permitted users on accounts_journal`

```sql
CREATE POLICY "Allow read access to permitted users on accounts_journal"
ON public.accounts_journal FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2065)-2074: `Allow write access to permitted users on accounts_journal`

```sql
CREATE POLICY "Allow write access to permitted users on accounts_journal"
ON public.accounts_journal FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2302)-2307: `Allow read access to permitted users on material_sales`

```sql
CREATE POLICY "Allow read access to permitted users on material_sales"
ON public.material_sales FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2309)-2320: `Allow write access to permitted users on material_sales`

```sql
CREATE POLICY "Allow write access to permitted users on material_sales"
ON public.material_sales FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2458)-2465: `Allow read access to permitted users on roto_film_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2467)-2476: `Allow write access to permitted users on roto_film_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2498)-2505: `Allow read access to permitted users on roto_metallic_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2507)-2516: `Allow write access to permitted users on roto_metallic_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2540)-2547: `Allow read access to permitted users on lamination_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2549)-2558: `Allow write access to permitted users on lamination_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2581)-2588: `Allow read access to permitted users on offset_rolls`

```sql
CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2590)-2599: `Allow write access to permitted users on offset_rolls`

```sql
CREATE POLICY "Allow write access to permitted users on offset_rolls"
ON public.offset_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2622)-2629: `Allow read access to permitted users on finishing_bundles`

```sql
CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2631)-2640: `Allow write access to permitted users on finishing_bundles`

```sql
CREATE POLICY "Allow write access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3079)-3080: `Allow read access to authenticated users on roto_product_colors`

```sql
CREATE POLICY "Allow read access to authenticated users on roto_product_colors" 
ON public.roto_product_colors FOR SELECT TO authenticated USING (true);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3083)-3089: `Allow write access to admins on roto_product_colors`

```sql
CREATE POLICY "Allow write access to admins on roto_product_colors" 
ON public.roto_product_colors FOR ALL TO authenticated 
USING (auth.uid() IN (
    SELECT u.id FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE r.name = 'admin'
));
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3138)-3141: `looms read authenticated`

```sql
CREATE POLICY "looms read authenticated" ON public.looms FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 3. Relax SELECT policies on fabric_types
DROP POLICY IF EXISTS "fabric types read permitted users" ON public.fabric_types;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3143)-3146: `fabric types read authenticated`

```sql
CREATE POLICY "fabric types read authenticated" ON public.fabric_types FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 4. Relax SELECT policies on raw_materials
DROP POLICY IF EXISTS "raw materials read permitted users" ON public.raw_materials;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3148)-3151: `raw materials read authenticated`

```sql
CREATE POLICY "raw materials read authenticated" ON public.raw_materials FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 5. Relax SELECT policies on fabric_rolls
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3153)-3156: `rolls read authenticated`

```sql
CREATE POLICY "rolls read authenticated" ON public.fabric_rolls FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 6. Relax SELECT policies on customers
DROP POLICY IF EXISTS "customers read permitted users" ON public.customers;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3158)-3161: `customers read authenticated`

```sql
CREATE POLICY "customers read authenticated" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 7. Relax SELECT policies on loom_production_entries
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3163)-3166: `production read authenticated`

```sql
CREATE POLICY "production read authenticated" ON public.loom_production_entries FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 8. Relax SELECT policies on sales_orders
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3168)-3171: `sales read authenticated`

```sql
CREATE POLICY "sales read authenticated" ON public.sales_orders FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 9. Relax SELECT policies on sales_order_items
DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3172)-3175: `sales items read authenticated`

```sql
CREATE POLICY "sales items read authenticated" ON public.sales_order_items FOR SELECT TO authenticated USING (true);

-- 10. Relax SELECT policies on roto_film_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_film_rolls" ON public.roto_film_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3176)-3179: `Allow read access to authenticated on roto_film_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_film_rolls" ON public.roto_film_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 11. Relax SELECT policies on roto_metallic_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3180)-3183: `Allow read access to authenticated on roto_metallic_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on roto_metallic_rolls" ON public.roto_metallic_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 12. Relax SELECT policies on lamination_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on lamination_rolls" ON public.lamination_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3184)-3187: `Allow read access to authenticated on lamination_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on lamination_rolls" ON public.lamination_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 13. Relax SELECT policies on offset_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on offset_rolls" ON public.offset_rolls;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3188)-3191: `Allow read access to authenticated on offset_rolls`

```sql
CREATE POLICY "Allow read access to authenticated on offset_rolls" ON public.offset_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 14. Relax SELECT policies on finishing_bundles
DROP POLICY IF EXISTS "Allow read access to permitted users on finishing_bundles" ON public.finishing_bundles;
```

- [supabase/migrations/002_change_total_amount_and_rls.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/002_change_total_amount_and_rls.sql:30)-40: `raw purchases read permitted users`

```sql
CREATE POLICY "raw purchases read permitted users" ON public.raw_material_purchases
FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    public.is_admin()
    OR public.has_permission('raw_materials.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('accounts.purchase')
  )
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:14)-18: `users insert permitted`

```sql
CREATE POLICY "users insert permitted" ON public.users
FOR INSERT WITH CHECK (
  public.is_admin()
  OR public.has_permission('users.create')
);
```

- [supabase/migrations/008_fix_admin_hardcoded_policies.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/008_fix_admin_hardcoded_policies.sql:21)-31: `users update permitted`

```sql
CREATE POLICY "users update permitted" ON public.users
FOR UPDATE USING (
  public.is_admin()
  OR public.has_permission('users.edit')
  OR public.has_permission('users.delete')
) WITH CHECK (
  public.is_admin()
  OR public.has_permission('users.create')
  OR public.has_permission('users.edit')
  OR public.has_permission('users.delete')
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:87)-97: `production read permitted users`

```sql
CREATE POLICY "production read permitted users" ON public.loom_production_entries
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('production.view')
    or public.has_permission('fabric.production')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:102)-112: `sales read permitted users`

```sql
CREATE POLICY "sales read permitted users" ON public.sales_orders
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('sales.view')
    or public.has_permission('sales.order_confirmation')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('reports.view')
  )
);
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:132)-149: `rolls read permitted users`

```sql
CREATE POLICY "rolls read permitted users" ON public.fabric_rolls
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('fabric.production')
    or public.has_permission('fabric.stock')
    or public.has_permission('roto_printing.production')
    or public.has_permission('lamination.production')
    or public.has_permission('offset_printing.production')
    or public.has_permission('finishing.production')
  )
);
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:47)-49: `client_read_self`

```sql
CREATE POLICY "client_read_self" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_internal_staff());
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:53)-58: `client_sales_orders_policy`

```sql
CREATE POLICY "client_sales_orders_policy" ON public.sales_orders
  FOR ALL TO authenticated
  USING (
    customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR created_by = auth.uid()
  );
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:62)-69: `client_sales_order_items_policy`

```sql
CREATE POLICY "client_sales_order_items_policy" ON public.sales_order_items
  FOR ALL TO authenticated
  USING (
    sales_order_id IN (
      SELECT id FROM public.sales_orders
      WHERE customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:73)-79: `fabric_types_read_policy`

```sql
CREATE POLICY "fabric_types_read_policy" ON public.fabric_types
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:83)-89: `finishing_products_read_policy`

```sql
CREATE POLICY "finishing_products_read_policy" ON public.finishing_products
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:47)-50: `client_orders_internal_all`

```sql
CREATE POLICY "client_orders_internal_all" ON public.client_orders
  FOR ALL TO authenticated
  USING (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()))
  WITH CHECK (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()));
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:53)-61: `client_order_items_internal_all`

```sql
CREATE POLICY "client_order_items_internal_all" ON public.client_order_items
  FOR ALL TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.client_orders
      WHERE public.is_internal_staff()
        OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );
```

### Triggers

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:490)-491: `touch_roles`

```sql
create trigger touch_roles before update on public.roles for each row execute function public.touch_updated_at();
create trigger touch_users before update on public.users for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:491)-492: `touch_users`

```sql
create trigger touch_users before update on public.users for each row execute function public.touch_updated_at();
create trigger touch_looms before update on public.looms for each row execute function public.touch_updated_at();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:510)-511: `audit_roles`

```sql
create trigger audit_roles after insert or update on public.roles for each row execute function public.audit_row_change();
create trigger audit_users after insert or update on public.users for each row execute function public.audit_row_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:511)-512: `audit_users`

```sql
create trigger audit_users after insert or update on public.users for each row execute function public.audit_row_change();
create trigger audit_looms after insert or update on public.looms for each row execute function public.audit_row_change();
```

### Views / RPCs

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:237)-253: `current_role_name`

```sql
create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.name
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = auth.uid()
    and u.status = 'active'
    and u.deleted_at is null
    and r.is_active = true
    and r.deleted_at is null
  limit 1
$$;
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:25)-42: `is_internal_staff`

```sql
CREATE OR REPLACE FUNCTION public.is_internal_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid()
      AND r.name != 'client'
      AND u.status = 'active'
      AND u.deleted_at IS NULL
      AND r.is_active = true
      AND r.deleted_at IS NULL
  )
$$;
```

### Runtime Read/Write/Update/Delete Evidence

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:214): `measure("Fetch users", supabase.from("users").select("*, roles(name)").is("deleted_at", null))`
- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:28): `.from("users")`
- [scratch/check-user-columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-columns.mjs:28): `.from('users')`
- [scratch/check-user-details.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-details.mjs:10): `.from("users")`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:82): `const { error: profileErr } = await supabase.from("users").upsert({`
- [scratch/diagnose-login-error.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/diagnose-login-error.mjs:57): `.from("users")`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:30): `.from('users')`
- [scratch/list-users.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users.mjs:9): `.from("users")`
- [scratch/test-full-login-flow.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-full-login-flow.mjs:37): `.from("users")`
- [scratch/test-login-query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-login-query.mjs:24): `.from("users")`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:79): `const { error: profileError } = await supabase.from("users").upsert({`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:37): `.from("users") as any)`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:19): `.from("users") as any)`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:46): `const { error: profileError } = await admin.from("users").upsert({`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:75): `.from("users") as any)`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:111): `.from("users") as any)`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:17): `supabase.from("users").select("*, roles(name)").is("deleted_at", null).order("full_name", { ascending: true }),`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:22): `.from("users")`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:16): `.from("users")`

