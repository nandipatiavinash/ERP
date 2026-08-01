# 17 Cross Module Dependencies

## Production → Inventory → Sales → Accounts chain

Evidence from `revalidatePath` and shared tables in server actions:

### Production → Inventory

- `loom_production_entries`: 6 write operations evidenced
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:347): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:368): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:384): `await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:393): `const { error: dLpeErr } = await supabase.from("loom_production_entries").delete().eq("id", lpeId);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:62): `? (adminSupabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:63): `: (adminSupabase.from("loom_production_entries") as any).insert({ ...payload, created_by: user.id } as any);`

- `fabric_rolls`: 8 write operations evidenced
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:367): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:383): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:392): `const { error: dRollErr } = await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:319): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:448): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:572): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:578): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:590): `promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));`

- `roto_film_rolls`: 2 write operations evidenced
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:609): `await adminSupabase.from("roto_film_rolls").delete().eq("id", (metallic as any).source_film_roll_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:612): `await adminSupabase.from("roto_film_rolls").delete().eq("id", item.created_stock_id);`

### Sales → Accounts

- `sales_orders`: 6 write operations evidenced
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:172): `await supabase.from("sales_orders").delete().eq("id", orderId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:187): `await supabase.from("sales_orders").delete().eq("id", orderId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:195): `const { error: dOrderErr } = await supabase.from("sales_orders").delete().eq("id", orderId);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:164): `await (admin.from("sales_orders") as any).delete().eq("id", salesOrder.id);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:29): `? (supabase.from("sales_orders") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:30): `: (supabase.from("sales_orders") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);`

- `sales_order_items`: 2 write operations evidenced
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:186): `await supabase.from("sales_order_items").delete().eq("id", orderItem.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:194): `const { error: dItemErr } = await supabase.from("sales_order_items").delete().eq("id", orderItem.id);`

- `fabric_rolls`: 8 write operations evidenced
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:367): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:383): `await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:392): `const { error: dRollErr } = await supabase.from("fabric_rolls").delete().eq("id", rollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:319): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:448): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:572): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:578): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:590): `promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));`

### Accounts → Reports

- `accounts_journal`: 18 write operations evidenced
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:76): `const { data, error } = await supabase.from("accounts_journal").insert(journalInserts).select();`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:571): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:584): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:589): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:595): `const { error: jdErr } = await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:24): `const { data, error } = await supabase.from("accounts_journal").insert({`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:97): `const { error: insertError } = await (supabase.from("accounts_journal") as any).insert(inserts);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:528): `await (adminSupabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:95): `await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:650): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:665): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:948): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1058): `const { error: journalErr } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1080): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1513): `const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);`

## Shared Helper: revalidateAllReports

- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:2): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29): `export function revalidateAllReports() {`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:30): `revalidatePath("/reports");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:31): `revalidatePath("/reports/accounts");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:32): `revalidatePath("/reports/opening-balance");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:33): `revalidatePath("/reports/closing-stock");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:34): `revalidatePath("/reports/profit-loss");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:35): `revalidatePath("/reports/balance-sheet");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:36): `revalidatePath("/reports/sales-confirmation");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:37): `revalidatePath("/reports/stock");`

## Journal Number Generation

- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:165): `// DB-02 / DB-03 / PERF-01: Use the DB RPC get_next_journal_no()`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166): `export async function generateNextJournalNo(supabase: any): Promise<string> {`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:167): `const { data, error } = await supabase.rpc("get_next_journal_no");`

