# 08 Reports

## /reports/accounts

File: [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:1)

### Permissions

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:9): `await requirePermission("reports.accounts");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:110): `{ href: "/reports/accounts", label: "Account Reports", roles: ["admin"], permission: "reports.accounts" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:8): `export default async function AccountReportsPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:10): `const params = await searchParams;`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:24): `.order("customer_name");`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:38): `.gte("entry_date", from)`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:39): `.lte("entry_date", to)`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:62): `.order("entry_date", { ascending: true })`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:63): `.order("created_at", { ascending: true })`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:20): `.from("customers")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:21): `.select("id, customer_name, alias, is_internal, opening_debit, opening_credit, linked_customer_id")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:36): `.from("accounts_journal")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:37): `.select("*")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:60): `(supabase as any).rpc("get_opening_balance", { p_account_id: accountId, p_from_date: from }),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:100): `.rpc("get_accounts_journal_summary_by_date", { p_date: to });`

### Calculations Displayed

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:21): `.select("id, customer_name, alias, is_internal, opening_debit, opening_credit, linked_customer_id")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:59): `const [{ data: openingBalData }, { data: entries }] = await Promise.all([`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:60): `(supabase as any).rpc("get_opening_balance", { p_account_id: accountId, p_from_date: from }),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:66): `// Construct virtual entries dated before 'from' to represent the opening balance in the frontend`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:68): `if (openingBalData && openingBalData.length > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:69): `const { total_debit, total_credit } = openingBalData[0];`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:70): `if (Number(total_debit) > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:73): `journal_no: "OPENING",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:76): `entry_type: "debit" as const,`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:77): `amount: Number(total_debit),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:78): `description: "Opening Balance",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:82): `if (Number(total_credit) > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:85): `journal_no: "OPENING",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:88): `entry_type: "credit" as const,`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:89): `amount: Number(total_credit),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:90): `description: "Opening Balance",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:98): `// If nothing selected, fetch aggregated trial balance summary up to 'to' date`

### Bound Server Actions

- UI [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /reports/balance-sheet

File: [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:1)

### Permissions

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:2): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:17): `await requirePermission("reports.balance_sheet");`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:18): `const permissions = await getSessionPermissions();`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:51): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:122): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:115): `{ href: "/reports/balance-sheet", label: "Balance Sheet", roles: ["admin"], permission: "reports.balance_sheet" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:6): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:13): `searchParams,`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:15): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:19): `const params = await searchParams;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:51): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:53): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:122): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:124): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`

### Buttons And Event Handlers

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:81): `<Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:88): `<Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">`

### Forms And Validation

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:60): `<h3 className="text-lg font-bold text-amber-950">Submissions Required First</h3>`

### Inline Database Queries (page-level)

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:27): `.from("settings")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:28): `.select("value")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:32): `.from("settings")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:33): `.select("value")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:103): `.from("customers")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:104): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:110): `.rpc("get_accounts_journal_summary_by_date", { p_date: date });`

### Calculations Displayed

- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:10): `import { BalanceSheetClient } from "./BalanceSheetClient";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:12): `export default async function BalanceSheetPage({`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:17): `await requirePermission("reports.balance_sheet");`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:24): `// 1. Fetch closing stock and P&L submissions`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:29): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:38): `const closingStock = (csSetting as any)?.value || null;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:41): `const isCsMissing = !closingStock;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:48): `title="Balance Sheet"`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:49): `description="Company balance sheet statement of liabilities and assets."`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:53): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:62): `To view the Balance Sheet for any given day, both the Closing Stock and the Profit & Loss statement must be submitted first.`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:64): `<div className="text-left text-xs bg-white border border-amber-200 p-3 rounded mt-2 space-y-1 font-semibold text-slate-700">`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:66): `<span className={closingStock ? "text-emerald-600" : "text-rose-600"}>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:67): `{closingStock ? "✓" : "✗"}`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:69): `<span>Closing Stock Submission</span>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:82): `<Link href={\`/reports/closing-stock?date=${date}\`}>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:83): `Submit Closing Stock`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:101): `// 2. Fetch all active ledger accounts (customers table contains client, capital, loan, balance sheet a/c)`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:104): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:116): `title="Balance Sheet"`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:117): `description="Company balance sheet statement of liabilities and assets."`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:124): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:128): `<BalanceSheetClient`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:132): `closingStockValue={closingStock.grandTotal}`

### Bound Server Actions

- UI [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:4) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /reports/closing-stock

File: [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:1)

### Permissions

- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:9): `await requirePermission("reports.closing_stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:113): `{ href: "/reports/closing-stock", label: "Closing Stock", roles: ["admin", "operator"], permission: "reports.closing_stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:8): `export default async function ClosingStockReportPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:10): `const params = await searchParams;`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:34): `.order("material_name"),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:39): `.order("purchase_date", { ascending: true }),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:43): `.order("consumption_date", { ascending: true }),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:47): `.order("sale_date", { ascending: true }),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:51): `.order("fabric_name"),`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:32): `.select("id, material_name, unit, department, current_stock")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:36): `.from("raw_material_purchases")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:37): `.select("raw_material_id, purchase_date, quantity, rate, total_amount")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:40): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:41): `.select("raw_material_id, consumption_date, quantity")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:44): `(supabase.from("material_sales") as any)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:45): `.select("raw_material_id, sale_date, quantity, type")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:49): `.from("fabric_types")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:50): `.select("id, fabric_name, selling_price")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:54): `.from("sales_orders")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:55): `.select("order_date, status, bill_number, sales_order_items(selected_roll_ids)")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:60): `.from("fabric_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:61): `.select("id, roll_number, fabric_type_id, weight, meters, production_date, status, current_stage")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:66): `.from("lamination_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:67): `.select("id, roll_id, fabric_type_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:72): `.from("offset_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:73): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:78): `.from("finishing_bundles")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:79): `.select("id, bundle_id, fabric_type_id, weight_kg, num_bags, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:84): `.from("roto_film_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:85): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:90): `.from("roto_metallic_rolls")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:91): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:161): `.from("settings")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:162): `.select("value")`

### Calculations Displayed

- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:4): `import { ClosingStockReportClient } from "./ClosingStockReportClient";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:8): `export default async function ClosingStockReportPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:9): `await requirePermission("reports.closing_stock");`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:15): `// Fetch raw materials, purchases, consumptions, material sales, fabric types, and rolls from all 5 departments`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:19): `{ data: consumptions },`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:32): `.select("id, material_name, unit, department, current_stock")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:37): `.select("raw_material_id, purchase_date, quantity, rate, total_amount")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:40): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:41): `.select("raw_material_id, consumption_date, quantity")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:43): `.order("consumption_date", { ascending: true }),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:45): `.select("raw_material_id, sale_date, quantity, type")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:61): `.select("id, roll_number, fabric_type_id, weight, meters, production_date, status, current_stage")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:67): `.select("id, roll_id, fabric_type_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:73): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:79): `.select("id, bundle_id, fabric_type_id, weight_kg, num_bags, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:85): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:91): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:101): `weight: Number(r.weight || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:102): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:103): `production_date: r.production_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:111): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:112): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:113): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:121): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:122): `meters: 0,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:123): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:131): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:132): `meters: Number(r.num_bags || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:133): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:141): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:142): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:143): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:151): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:152): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:153): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:159): `// Fetch existing closing stock submission for this date`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:160): `const { data: closingStockSetting } = await supabase`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:163): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:166): `const submittedClosingStock = (closingStockSetting as any)?.value || null;`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:169): `<ClosingStockReportClient`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:173): `consumptions={(consumptions ?? []) as any[]}`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:178): `submittedStock={submittedClosingStock}`

### Bound Server Actions

- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12) imports `saveClosingStock` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:235)
- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12) imports `saveClosingStock` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:10) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /reports/opening-balance

File: [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:1)

### Permissions

- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:1): `import { requirePermission, requireRole } from "@/lib/auth";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:6): `await requirePermission("reports.opening_balance");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:111): `{ href: "/reports/opening-balance", label: "Opening Balance", roles: ["admin"], permission: "reports.opening_balance" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:16): `.order("customer_name");`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:12): `.from("customers")`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:13): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`

### Calculations Displayed

- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:3): `import { OpeningBalanceClient } from "./OpeningBalanceClient";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:5): `export default async function OpeningBalancePage() {`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:6): `await requirePermission("reports.opening_balance");`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:13): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:19): `<OpeningBalanceClient`

### Bound Server Actions

- UI [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11) imports `saveAccountOpeningBalance` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:232)
- UI [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11) imports `saveAccountOpeningBalance` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)

## /reports

File: [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:1)

### Permissions

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:6): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:79): `await requirePermission("reports.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:109): `{ href: "/reports/sales-confirmation", label: "Sales Confirmation", roles: ["admin"], permission: "reports.sales_confirmation" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:110): `{ href: "/reports/accounts", label: "Account Reports", roles: ["admin"], permission: "reports.accounts" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:111): `{ href: "/reports/opening-balance", label: "Opening Balance", roles: ["admin"], permission: "reports.opening_balance" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:112): `{ href: "/reports/stock", label: "Stock Report", roles: ["admin", "operator"], permission: "reports.stock" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:113): `{ href: "/reports/closing-stock", label: "Closing Stock", roles: ["admin", "operator"], permission: "reports.closing_stock" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:114): `{ href: "/reports/profit-loss", label: "Profit & Loss", roles: ["admin"], permission: "reports.profit_loss" },`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:115): `{ href: "/reports/balance-sheet", label: "Balance Sheet", roles: ["admin"], permission: "reports.balance_sheet" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:78): `export default async function ReportsPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:80): `const params = await searchParams;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:92): `supabase.from("employees").select("employee_code, name, department, designation, salary, status").is("deleted_at", null).order("name").limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:102): `})).filter((row) => inText(row, search));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:109): `})).filter((row) => inText(row, search));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:120): `})).filter((row) => inText(row, search));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:130): `})).filter((row) => inText(row, search));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:134): `<PageHeader title="Reports" description="Production, inventory, sales, and HR reports with date filters and export." />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:139): `<button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply Filters</button>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:147): `<ReportTable title="Attendance Report" filename="attendance" rows={((attendanceResult.data ?? []) as AttendanceRow[]).map((row) => ({ date: row.attendance_date, employee: \`${row.employees?.employee_code ?? ""} ${row.employees?.name ?? ""}\`.trim(), check_in: row.check_in, check_out: row.check_out, working_hours: Number(row.working_hours ?? 0), overtime_hours: Number(row.overtime_hours ?? 0), status: row.status })).filter((row) => inText(row, search))} columns={["date", "employee", "check_in", "check_out", "working_hours", "overtime_hours", "status"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:163): `<Table>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:164): `<TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{reportColumnLabel(column)}</TableHead>)}</TableRow></TableHeader>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:165): `<TableBody>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:167): `<TableRow key={index}>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:170): `return <TableCell key={column}>{reportCell(column, value, row)}</TableCell>;`

### Buttons And Event Handlers

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:139): `<button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply Filters</button>`

### Forms And Validation

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:135): `<form className="no-print mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">`

### Inline Database Queries (page-level)

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:87): `(supabase as any).rpc("get_fabric_stock_summary"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:92): `supabase.from("employees").select("employee_code, name, department, designation, salary, status").is("deleted_at", null).order("name").limit(500),`

### Calculations Displayed

- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:13): `type DailyProductionRow = Database["public"]["Tables"]["loom_production_entries"]["Row"] & {`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:48): `weight: "Weight",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:49): `meters: "Meters",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:50): `quantity: "Quantity",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:51): `rate: "Rate",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:52): `amount: "Amount",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:54): `working_hours: "Working Hours",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:55): `overtime_hours: "Overtime Hours",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:56): `current_stock: "Current Stock",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:57): `opening_stock: "Opening Stock",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:65): `if (column === "weight") return \`${formatNumber(value, 2)} kg\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:66): `if (column === "meters" || column === "quantity") {`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:67): `const unit = String(row.unit ?? (column === "meters" ? "m" : ""));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:70): `if (column === "rate" || column === "amount" || column === "salary") return \`₹${formatNumber(value, 2)}\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:71): `if (column.includes("hours")) return \`${formatNumber(value, 2)} hrs\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:74): `if ((column === "opening_stock" || column === "current_stock") && value != null) return \`${formatNumber(String(value), 2)} ${row.unit ?? ""}\`.trim();`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:79): `await requirePermission("reports.stock");`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:85): `const [productionResult, rollsResult, rawResult, rawPurchaseResult, salesResult, attendanceResult, employeeResult] = await Promise.all([`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:87): `(supabase as any).rpc("get_fabric_stock_summary"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:95): `const production = ((productionResult.data ?? []) as DailyProductionRow[]).map((row) => ({`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:100): `weight: Number(row.net_weight),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:101): `meters: Number(row.net_meters),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:104): `const fabricStock = ((rollsResult.data ?? []) as any[]).map((row) => ({`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:107): `weight: Number(row.weight ?? 0),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:108): `meters: Number(row.meters ?? 0),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:117): `quantity: Number(row.quantity),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:118): `rate: Number(row.rate),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:119): `amount: Number(row.total_amount),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:127): `quantity: Number(row.quantity_meters),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:128): `amount: Number(row.total_amount),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:134): `<PageHeader title="Reports" description="Production, inventory, sales, and HR reports with date filters and export." />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:135): `<form className="no-print mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:139): `<button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply Filters</button>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:142): `<ReportTable title="Daily Production" filename="daily-production" rows={production} columns={["date", "serial", "fabric", "loom", "weight", "meters"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:143): `<ReportTable title="Fabric Stock" filename="fabric-stock" rows={fabricStock as ReportRow[]} columns={["fabric", "rolls", "weight", "meters"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:144): `<ReportTable title="Raw Material Stock" filename="raw-material-stock" rows={(rawResult.data ?? []) as unknown as ReportRow[]} columns={["material_name", "unit", "opening_stock", "current_stock", "status"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:145): `<ReportTable title="Raw Material Purchases" filename="raw-material-purchases" rows={rawPurchases} columns={["date", "material", "supplier", "bill", "quantity", "rate", "amount"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:146): `<ReportTable title="Customer Wise Sales" filename="sales" rows={sales} columns={["date", "order", "customer", "fabric", "quantity", "amount", "status"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:147): `<ReportTable title="Attendance Report" filename="attendance" rows={((attendanceResult.data ?? []) as AttendanceRow[]).map((row) => ({ date: row.attendance_date, employee: \`${row.employees?.employee_code ?? ""} ${row.employees?.name ?? ""}\`.trim(), check_in: row.check_in, check_out: row.check_out, working_hours: Number(row.working_hours ?? 0), overtime_hours: Number(row.overtime_hours ?? 0), status: row.status })).filter((row) => inText(row, search))} columns={["date", "employee", "check_in", "check_out", "working_hours", "overtime_hours", "status"]} />`

### Bound Server Actions

- UI [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13) imports `saveSalesConfirmationRates` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:107)
- UI [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11) imports `saveAccountOpeningBalance` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:232)
- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12) imports `saveClosingStock` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:235)
- UI [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8) imports `saveProfitLoss` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:245)
- UI [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11) imports `saveAccountOpeningBalance` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)
- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12) imports `saveClosingStock` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
- UI [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8) imports `saveProfitLoss` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
- UI [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:4) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:10) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:4) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:10) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13) imports `saveSalesConfirmationRates` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)

## /reports/profit-loss

File: [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:1)

### Permissions

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:2): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:17): `await requirePermission("reports.profit_loss");`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:18): `const permissions = await getSessionPermissions();`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:40): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:97): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:114): `{ href: "/reports/profit-loss", label: "Profit & Loss", roles: ["admin"], permission: "reports.profit_loss" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:6): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:13): `searchParams,`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:15): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:19): `const params = await searchParams;`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:40): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:42): `<DateFilter date={date} baseUrl="/reports/profit-loss" />`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:97): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:99): `<DateFilter date={date} baseUrl="/reports/profit-loss" />`

### Buttons And Event Handlers

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:54): `<Button asChild className="bg-amber-600 hover:bg-amber-700 text-white mt-2">`

### Forms And Validation

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:49): `<h3 className="text-lg font-bold text-amber-950">Closing Stock Required</h3>`

### Inline Database Queries (page-level)

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:26): `.from("settings")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:27): `.select("value")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:72): `.from("customers")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:73): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:77): `.rpc("get_accounts_journal_summary_by_date", { p_date: date }),`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:79): `.from("settings")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:80): `.select("value")`

### Calculations Displayed

- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:24): `// 1. Fetch closing stock submission from settings`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:25): `const { data: closingStockSetting } = await supabase`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:28): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:31): `const submittedClosingStock = (closingStockSetting as any)?.value || null;`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:33): `if (!submittedClosingStock) {`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:49): `<h3 className="text-lg font-bold text-amber-950">Closing Stock Required</h3>`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:51): `To open the Profit & Loss statement for any given day, the Closing Stock must be submitted first. No submission found for {date}.`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:55): `<Link href={\`/reports/closing-stock?date=${date}\`}>`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:56): `Go Submit Closing Stock`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:73): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:107): `closingStockValue={submittedClosingStock.grandTotal}`

### Bound Server Actions

- UI [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8) imports `saveProfitLoss` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:245)
- UI [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8) imports `saveProfitLoss` → [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
- UI [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:4) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /reports/sales-confirmation

File: [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:1)

### Permissions

- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:12): `await requirePermission("reports.sales_confirmation");`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:13): `const permissions = await getSessionPermissions();`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:158): `permissions={permissions}`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:109): `{ href: "/reports/sales-confirmation", label: "Sales Confirmation", roles: ["admin"], permission: "reports.sales_confirmation" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:8): `searchParams,`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:10): `searchParams: Promise<{ date?: string; from?: string; to?: string; tab?: string }>;`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:15): `const params = await searchParams;`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:41): `.gte("order_date", from)`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:42): `.lte("order_date", to)`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:45): `.order("order_number", { ascending: true }),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:73): `.order("order_date", { ascending: false });`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:24): `supabase.from("fabric_types").select("id, fabric_name, selling_price"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:25): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:26): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:27): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:28): `supabase.from("finishing_products").select("id, name"),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:38): `.from("sales_orders")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:39): `.select("*, customers(*), sales_order_items(*)")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:54): `.from("sales_order_items")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:55): `.select("sales_order_id")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:67): `.from("sales_orders")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:68): `.select("*, customers(*), sales_order_items(*)")`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:113): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, weight, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:114): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:115): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:116): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:117): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:118): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null)))`

### Calculations Displayed

- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:113): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, weight, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:114): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:115): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:116): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:117): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:118): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:121): `const fabricRolls = fabricRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight || 0), count: Number(r.meters || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:122): `const lamRolls = lamRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight_kg || 0), count: Number(r.meters || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:123): `const offsetRolls = offsetRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight_kg || 0), count: Number(r.meters || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:124): `const finishingRolls = finishingRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight_kg || 0), count: Number(r.num_bags || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:125): `const rotoFilmRolls = rotoFilmRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight_kg || 0), count: Number(r.meters || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:126): `const rotoMetRolls = rotoMetRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight_kg || 0), count: Number(r.meters || 0) }));`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:142): `description="Verify calculations, GST, rates, and outstanding balances for billed sales."`

### Bound Server Actions

- UI [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13) imports `saveSalesConfirmationRates` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:107)
- UI [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13) imports `saveSalesConfirmationRates` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)

## /reports/stock

File: [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:1)

### Permissions

- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:9): `await requirePermission("reports.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:112): `{ href: "/reports/stock", label: "Stock Report", roles: ["admin", "operator"], permission: "reports.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:8): `export default async function StockReportPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:10): `const params = await searchParams;`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:40): `.order("material_name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:45): `.gte("purchase_date", from)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:50): `.gte("consumption_date", from)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:55): `.gte("sale_date", from)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:79): `.gte("sale_date", from)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:80): `.lte("sale_date", to)`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:37): `.from("raw_materials")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:38): `.select("id, material_name, unit, current_stock, department")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:43): `.from("raw_material_purchases")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:44): `.select("id, raw_material_id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:48): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:49): `.select("raw_material_id, consumption_date, quantity")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:52): `(supabase.from("material_sales") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:53): `.select("raw_material_id, sale_date, quantity")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:58): `.from("fabric_types")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:59): `.select("id, fabric_name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:62): `.from("sales_orders")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:63): `.select(\``
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:77): `(supabase.from("material_sales") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:78): `.select("id, type, department, raw_material_id, sale_date, quantity, bill_number, customers(customer_name, alias)")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:83): `.from("roto_products")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:84): `.select("id, brand, width, height"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:86): `.from("offset_products")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:87): `.select("id, brand, width, height"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:89): `.from("lamination_products")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:90): `.select("id, name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:92): `.from("finishing_products")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:93): `.select("id, name"),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:96): `.from("fabric_rolls")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:97): `.select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:102): `.from("lamination_rolls")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:103): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:108): `.from("offset_rolls")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:109): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:114): `.from("finishing_bundles")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:115): `.select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:120): `.from("roto_film_rolls")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:121): `.select("id, roll_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:126): `.from("roto_metallic_rolls")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:127): `.select("id, roll_id, weight_kg, entry_date, status")`

### Calculations Displayed

- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:4): `import { StockReportClient } from "./StockReportClient";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:8): `export default async function StockReportPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:9): `await requirePermission("reports.stock");`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:19): `{ data: consumptions },`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:38): `.select("id, material_name, unit, current_stock, department")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:44): `.select("id, raw_material_id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:48): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:49): `.select("raw_material_id, consumption_date, quantity")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:50): `.gte("consumption_date", from)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:53): `.select("raw_material_id, sale_date, quantity")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:72): `sales_order_items(id, department, product_id, quantity, selected_roll_ids)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:76): `// All material sales (raw_material + waste) for the Sale section`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:78): `.select("id, type, department, raw_material_id, sale_date, quantity, bill_number, customers(customer_name, alias)")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:97): `.select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:103): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:109): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:115): `.select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:121): `.select("id, roll_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:127): `.select("id, roll_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:137): `weight: Number(r.weight || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:138): `production_date: r.production_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:146): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:147): `production_date: r.entry_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:155): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:156): `production_date: r.entry_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:164): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:165): `production_date: r.entry_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:173): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:174): `production_date: r.entry_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:182): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:183): `production_date: r.entry_date,`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:190): `<StockReportClient`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:195): `consumptions={(consumptions ?? []) as any[]}`

### Bound Server Actions

- UI [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:10) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## Execution Traces (Server Actions)

## Delete Operations In Module

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:23): `.is("deleted_at", null)`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:40): `.is("deleted_at", null);`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:106): `.is("deleted_at", null);`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:38): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:42): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:46): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:56): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:62): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:68): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:74): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:80): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:86): `.is("deleted_at", null)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:92): `.is("deleted_at", null)`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:15): `.is("deleted_at", null)`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:92): `supabase.from("employees").select("employee_code, name, department, designation, salary, status").is("deleted_at", null).order("name").limit(500),`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:75): `.is("deleted_at", null),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:44): `.is("deleted_at", null)`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:72): `.is("deleted_at", null)`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:113): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, weight, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:114): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:115): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:116): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:117): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:118): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:39): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:46): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:51): `.is("deleted_at", null),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:56): `.is("deleted_at", null),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:74): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:81): `.is("deleted_at", null),`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:98): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:104): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:110): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:116): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:122): `.is("deleted_at", null)`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:128): `.is("deleted_at", null)`

## Update Operations In Module

Not found in source code.

