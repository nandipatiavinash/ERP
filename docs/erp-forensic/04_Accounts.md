# 04 Accounts

## /accounts/journal

File: [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:1)

### Permissions

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:8): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:38): `await requirePermission("accounts.journal");`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:39): `const permissions = await getSessionPermissions();`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:164): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:97): `{ href: "/accounts/journal", label: "Journal Entry", roles: ["admin"], permission: "accounts.journal" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:11): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:36): `searchParams?: Promise<{ edit?: string; date?: string }>;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:40): `const searchParams = await props.searchParams;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:41): `const editJournalNo = searchParams?.edit ?? "";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:42): `const date = searchParams?.date || todayInIndia();`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:54): `.order("entry_date", { ascending: false })`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:55): `.order("created_at", { ascending: false }),`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:61): `.order("customer_name")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:75): `editRows = rows.filter(r => r.journal_no === editJournalNo);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:133): `const totalDebit = rows.filter(r => r.entry_type === "debit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:134): `const totalCredit = rows.filter(r => r.entry_type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:164): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:165): `<DateFilter date={date} baseUrl="/accounts/journal" />`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:173): `<Table>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:174): `<TableHeader className="bg-emerald-50/45">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:175): `<TableRow>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:176): `<TableHead className="w-[120px]">Date</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:177): `<TableHead>Account details</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:178): `<TableHead className="text-right w-[150px]">Amount (₹)</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:179): `<TableHead className="w-[140px] text-right">Actions</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:182): `<TableBody>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:184): `<TableRow key={entry.journal_no} className="hover:bg-slate-50/40">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:185): `<TableCell className="align-top font-medium">{formatDate(entry.entry_date)}</TableCell>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:186): `<TableCell className="p-3">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:205): `<TableCell className="p-3 text-right">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:214): `<TableCell className="align-top text-right">`

### Buttons And Event Handlers

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:233): `<form action={softDeleteJournalEntryGroup}>`

### Forms And Validation

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:233): `<form action={softDeleteJournalEntryGroup}>`

### Inline Database Queries (page-level)

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:50): `.from("accounts_journal")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:51): `.select("*")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:57): `.from("customers")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:58): `.select("id, customer_name, alias, gst_number")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:79): `.from("accounts_journal")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:80): `.select("*")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:91): `const { data: nextJournalNoData } = await (supabase as any).rpc("get_next_journal_no");`

### Calculations Displayed

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:19): `entry_type: "debit" | "credit";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:20): `amount: string | number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:24): `function isAutoGenerated(description: string | null): boolean {`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:27): `if (/^Balance\s+adjustment/i.test(desc)) return true;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:58): `.select("id, customer_name, alias, gst_number")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:90): `// 3. Generate next Journal Number`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:99): `total: number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:103): `entry_type: "debit" | "credit";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:104): `amount: number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:116): `total: 0,`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:124): `amount: Number(row.amount),`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:127): `if (row.entry_type === "debit") {`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:128): `groupedJE[key].total += Number(row.amount);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:133): `const totalDebit = rows.filter(r => r.entry_type === "debit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:134): `const totalCredit = rows.filter(r => r.entry_type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:140): `description="Record and view double-entry accounting journal entries (debits and credits)."`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:160): `<span className="text-sm font-normal text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:161): `Debits: ₹{formatNumber(totalDebit, 2)} | Credits: ₹{formatNumber(totalCredit, 2)}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:178): `<TableHead className="text-right w-[150px]">Amount (₹)</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:191): `<span className={line.entry_type === "credit" ? "pl-6 text-slate-500" : "font-semibold text-slate-800"}>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:194): `<span className="text-xs text-muted-foreground ml-2 block sm:inline">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:198): `<span className="text-xs font-mono font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded bg-slate-50">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:199): `{line.entry_type === "debit" ? "Dr" : "Cr"}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:209): `₹{formatNumber(line.amount, 2)}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:219): `className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-8 px-3 border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm"`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:227): `desc.startsWith("balance adjustment for bill") ||`

### Bound Server Actions

- UI [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7) imports `softDeleteJournalEntryGroup` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:227)
- UI [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:10) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7) imports `softDeleteJournalEntryGroup` → [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)

## /accounts/material

File: [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:1)

### Permissions

- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:13): `await requirePermission("accounts.material");`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:14): `const permissions = await getSessionPermissions();`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:107): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:101): `{ href: "/accounts/material", label: "Material Sales", roles: ["admin"], permission: "accounts.material" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:5): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:9): `searchParams,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:11): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:16): `const params = await searchParams;`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:27): `.order("customer_name"),`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:33): `.order("material_name"),`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:53): `.order("created_at", { ascending: false }),`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:96): `const clients = ((clientsRes.data ?? []) as any[]).filter((c) => isActualClient(c.customer_name));`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:107): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:109): `<DateFilter date={date} baseUrl="/accounts/material" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:22): `.from("customers")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:23): `.select("id, customer_name, alias")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:29): `.from("raw_materials")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:30): `.select("id, material_name, department, unit, current_stock")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:35): `.from("material_sales")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:36): `.select(\``

### Calculations Displayed

- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:30): `.select("id, material_name, department, unit, current_stock")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:43): `quantity,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:45): `inc_gst,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:46): `amount,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:73): `"roundoff",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:74): `"round off",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:77): `"cgst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:78): `"sgst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:79): `"igst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:80): `"gst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:86): `"opening balance",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:104): `description="Record raw material or waste sales directly into ledger accounts."`

### Bound Server Actions

- UI [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5) imports `saveMaterialSalesEntry` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:114)
- UI [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5) imports `deleteMaterialSalesEntry` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:117)
- UI [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5) imports `saveMaterialSalesEntry` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:957)
- UI [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5) imports `deleteMaterialSalesEntry` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)

## /accounts/product-purchase

File: [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:1)

### Permissions

- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:17): `await requirePermission("accounts.product_purchase");`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:18): `const permissions = await getSessionPermissions();`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:99): `{ href: "/accounts/product-purchase", label: "Product Purchase", roles: ["admin"], permission: "accounts.product_purchase" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:8): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:13): `searchParams,`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:15): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:20): `const params = await searchParams;`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:42): `.order("customer_name"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:48): `.order("fabric_name"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:53): `.order("brand"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:58): `.order("brand"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:64): `.order("name"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:69): `.order("color_name"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:75): `.order("roll_number"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:81): `.order("roll_id"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:87): `.order("roll_id"),`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:96): `.order("created_at", { ascending: false })`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:182): `<DateFilter date={date} baseUrl="/accounts/product-purchase" />`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:196): `<Table>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:197): `<TableHeader className="bg-slate-50/50">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:198): `<TableRow className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-500">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:199): `<TableHead className="pl-4">Supplier</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:200): `<TableHead>Bill No</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:201): `<TableHead>Items Info</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:202): `<TableHead className="text-right">Total Amount (₹)</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:203): `<TableHead className="w-20 text-center pr-4">Actions</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:206): `<TableBody>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:208): `<TableRow key={row.id} className="hover:bg-slate-50/30 border-b border-slate-100 last:border-0">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:209): `<TableCell className="pl-4 font-semibold text-slate-800 text-xs py-3.5">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:212): `<TableCell className="text-slate-600 text-xs font-mono">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:215): `<TableCell className="text-xs text-slate-600 space-y-1">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:236): `<TableCell className="text-right font-black text-slate-900 text-xs tabular-nums">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:239): `<TableCell className="text-center pr-4">`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:37): `.from("customers")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:38): `.select("id, customer_name, alias")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:44): `.from("fabric_types")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:45): `.select("id, fabric_name")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:50): `.from("roto_products")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:51): `.select("id, brand, width, height")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:55): `.from("offset_products")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:56): `.select("id, brand, width, height")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:60): `.from("finishing_products")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:61): `.select("id, name")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:66): `.from("roto_colors")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:67): `.select("id, color_name")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:71): `.from("fabric_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:72): `.select("id, roll_number, weight, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:77): `.from("lamination_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:78): `.select("id, roll_id, s_no, weight_kg, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:83): `.from("offset_rolls")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:84): `.select("id, roll_id, s_no, weight_kg, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:89): `.from("product_purchases")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:90): `.select(\``
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:127): `? supabase.from("fabric_rolls").select("id, roll_number").in("id", stockIdsByDept.fabric)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:130): `? supabase.from("lamination_rolls").select("id, roll_id").in("id", stockIdsByDept.lamination)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:133): `? supabase.from("offset_rolls").select("id, roll_id").in("id", stockIdsByDept["offset-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:136): `? supabase.from("roto_film_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:139): `? supabase.from("roto_metallic_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:142): `? supabase.from("finishing_bundles").select("id, bundle_id").in("id", stockIdsByDept.finishing)`

### Calculations Displayed

- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:23): `// Fetch Catalogs + Available stock rolls for linkage + Colors list for Roto specs`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:72): `.select("id, roll_number, weight, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:78): `.select("id, roll_id, s_no, weight_kg, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:84): `.select("id, roll_id, s_no, weight_kg, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:91): `id, purchase_date, supplier_name, bill_number, total_amount, remarks,`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:92): `product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:102): `// Map created stock IDs to their generated roll_id / roll_number for user visibility`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:103): `const stockIdsByDept: Record<string, string[]> = {`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:113): `if (item.created_stock_id) {`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:114): `stockIdsByDept[item.department]?.push(item.created_stock_id);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:126): `stockIdsByDept.fabric.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:127): `? supabase.from("fabric_rolls").select("id, roll_number").in("id", stockIdsByDept.fabric)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:129): `stockIdsByDept.lamination.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:130): `? supabase.from("lamination_rolls").select("id, roll_id").in("id", stockIdsByDept.lamination)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:132): `stockIdsByDept["offset-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:133): `? supabase.from("offset_rolls").select("id, roll_id").in("id", stockIdsByDept["offset-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:135): `stockIdsByDept["roto-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:136): `? supabase.from("roto_film_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:138): `stockIdsByDept["roto-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:139): `? supabase.from("roto_metallic_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:141): `stockIdsByDept.finishing.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:142): `? supabase.from("finishing_bundles").select("id, bundle_id").in("id", stockIdsByDept.finishing)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:146): `const stockMap = new Map<string, string>();`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:147): `(dbFabricRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_number));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:148): `(dbLamRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:149): `(dbOffsetRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:150): `(dbFilmRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:151): `(dbMetallicRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:152): `(dbFinishBundles || []).forEach((r: any) => stockMap.set(r.id, r.bundle_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:158): `description="Record finished product purchases from external suppliers to stock and accounting journals."`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:180): `<div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-100 shadow-sm">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:202): `<TableHead className="text-right">Total Amount (₹)</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:217): `const generatedId = item.created_stock_id ? stockMap.get(item.created_stock_id) : null;`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:221): `<span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:225): `{formatNumber(item.quantity, 0)} {item.department === "finishing" ? "bags" : "mtrs"} / {formatNumber(item.weight, 1)} kg`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:229): `{generatedId && <span>Stock ID: <strong className="text-slate-700 font-semibold">{generatedId}</strong></span>}`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:237): `₹{formatNumber(row.total_amount, 2)}`

### Bound Server Actions

- UI [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:7) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:5) imports `saveProductPurchase` → [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)
- UI [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5) imports `deleteProductPurchase` → [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)

## /accounts/purchase

File: [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:1)

### Permissions

- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:6): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:23): `await requirePermission("accounts.purchase"); // Matches navGroups permission for this page`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:24): `const permissions = await getSessionPermissions();`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:117): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:98): `{ href: "/accounts/purchase", label: "Purchase Entry", roles: ["admin"], permission: "accounts.purchase" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:9): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:19): `searchParams,`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:21): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:26): `const params = await searchParams;`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:35): `.order("material_name", { ascending: true }),`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:42): `.order("customer_name"),`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:48): `.order("created_at", { ascending: false }),`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:91): `const activeMaterials = (materials ?? []).filter((m: any) => m.status === "active");`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:92): `const customerList = ((customers ?? []) as any[]).filter((c) => isActualClient(c.customer_name));`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:117): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:118): `<DateFilter date={date} baseUrl="/accounts/purchase" />`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:126): `<Table>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:127): `<TableHeader>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:128): `<TableRow>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:129): `<TableHead>Date</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:130): `<TableHead>Material</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:131): `<TableHead>Client</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:132): `<TableHead>Bill</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:133): `<TableHead>Qty</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:134): `<TableHead>Rate</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:135): `<TableHead>Total</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:136): `<TableHead className="w-16"></TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:139): `<TableBody>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:148): `<TableRow key={purchase.id}>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:149): `<TableCell>{formatDate(purchase.purchase_date)}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:150): `<TableCell className="font-medium">{materialLabel}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:151): `<TableCell>{purchase.supplier_name ?? "-"}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:152): `<TableCell>{purchase.bill_number ?? "-"}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:153): `<TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:156): `<TableCell>{"₹"}{formatNumber(purchase.rate, 2)}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:157): `<TableCell>{"₹"}{formatNumber(getEnteredBillValue(purchase.remarks, purchase.total_amount), 2)}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:158): `<TableCell>`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:32): `.select("id, material_name, unit, department, status")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:37): `.from("customers")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:38): `.select("id, customer_name, alias")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:44): `.from("raw_material_purchases")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:45): `.select("id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount, remarks, raw_materials(material_name, unit, department)")`

### Calculations Displayed

- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:14): `const match = remarks?.match(/\[TOTAL_BILL_VALUE:([0-9]+(?:\.[0-9]+)?)\]/);`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:45): `.select("id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount, remarks, raw_materials(material_name, unit, department)")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:68): `"roundoff",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:69): `"round off",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:72): `"cgst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:73): `"sgst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:74): `"igst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:75): `"gst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:81): `"opening balance",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:99): `description="Accounting purchase entry and ledger updates."`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:134): `<TableHead>Rate</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:135): `<TableHead>Total</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:154): `{formatNumber(purchase.quantity, 0)} {purchase.raw_materials?.unit ?? ""}`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:156): `<TableCell>{"₹"}{formatNumber(purchase.rate, 2)}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:157): `<TableCell>{"₹"}{formatNumber(getEnteredBillValue(purchase.remarks, purchase.total_amount), 2)}</TableCell>`

### Bound Server Actions

- UI [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5) imports `deleteRawMaterialPurchase` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:136)
- UI [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:8) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5) imports `deleteRawMaterialPurchase` → [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)

## /accounts/sales

File: [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:1)

### Permissions

- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:17): `await requirePermission("accounts.sales");`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:18): `const permissions = await getSessionPermissions();`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:158): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:100): `{ href: "/accounts/sales", label: "Sales Entry", roles: ["admin"], permission: "accounts.sales" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:10): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:13): `searchParams,`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:15): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:20): `const params = await searchParams;`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:38): `.order("order_date", { ascending: false }),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:45): `.order("order_date", { ascending: false }),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:158): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:160): `<DateFilter date={date} baseUrl="/accounts/sales" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:33): `(supabase.from("sales_orders") as any)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:34): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:39): `(supabase.from("sales_orders") as any)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:40): `.select("id, order_number, order_date, bill_number, bill_value, customers(customer_name), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:46): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:47): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:48): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:49): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:50): `supabase.from("finishing_products").select("id, name"),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:86): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:87): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:88): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:89): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, num_bags, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:90): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:91): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null)))`

### Calculations Displayed

- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:34): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:40): `.select("id, order_number, order_date, bill_number, bill_value, customers(customer_name), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:86): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:87): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:88): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:89): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, num_bags, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:90): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:91): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:97): `weight: Number(r.weight || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:98): `meters: Number(r.meters || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:100): `loom_production_entries: r.loom_production_entries`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:105): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:106): `meters: Number(r.meters || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:112): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:113): `meters: Number(r.meters || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:119): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:120): `meters: Number(r.num_bags || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:126): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:127): `meters: Number(r.meters || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:133): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:134): `meters: Number(r.meters || 0),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:153): `description="View confirmed deliveries, enter billing details, and generate journal entries."`

### Bound Server Actions

- UI [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5) imports `saveSalesOrderBillingDirect` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:128)
- UI [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:7) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:14) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5) imports `saveSalesOrderBillingDirect` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)

## Execution Traces (Server Actions)

### saveJournalEntry

```
- `saveJournalEntry` [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:8)
  - DB: `update` on `accounts_journal`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - revalidatePath: `/accounts/journal`, `/accounts/sales`
  - throws: `"Missing required journal fields."`; `"At least 2 rows are required for a journal entry."`; `"Account name is required on all rows."`; `"A row cannot contain both Debit and Credit."`; `"Either Debit or Credit must be entered on all rows."`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:5): `import { saveJournalEntry } from "@/app/(app)/_actions";`

### softDeleteJournalEntryGroup

```
- `softDeleteJournalEntryGroup` [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)
  - DB: `select` on `accounts_journal`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/accounts/journal`, `/accounts/sales`
  - throws: `"Missing journal number."`; `fetchErr.message`; `"Cannot delete auto-generated journal entries."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7): `import { softDeleteJournalEntryGroup } from "@/app/(app)/_actions";`

### saveAccountOpeningBalance

```
- `saveAccountOpeningBalance` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)
  - DB: `update` on `customers`
  - revalidatePath: `/reports/opening-balance`, `/reports/accounts`
  - throws: `"Account ID is required."`; `"Opening values cannot be negative."`; `error.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11): `import { saveAccountOpeningBalance } from "@/app/(app)/_actions";`

### saveClosingStock

```
- `saveClosingStock` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
  - DB: `select` on `settings`
  - DB: `update` on `settings`
  - DB: `insert` on `settings`
  - revalidatePath: `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`
  - throws: `error.message`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12): `import { saveClosingStock } from "@/app/(app)/_actions";`

### saveProfitLoss

```
- `saveProfitLoss` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
  - DB: `select` on `settings`
  - DB: `update` on `settings`
  - DB: `insert` on `settings`
  - revalidatePath: `/reports/profit-loss`, `/reports/balance-sheet`
  - throws: `error.message`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8): `import { saveProfitLoss } from "@/app/(app)/_actions";`

### clearSystemTransactions

```
- `clearSystemTransactions` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38)
  - DB: `update` on `fabric_rolls`
  - DB: `select` on `raw_materials`
  - DB: `update` on `raw_materials`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `customers`
  - revalidatePath: `/admin/raw-materials`, `/fabric/stock`, `/accounts/sales`, `/accounts/purchase`, `/accounts/consumption`, `/accounts/journal`, `/reports/stock`, `/reports/closing-stock`, `/reports/accounts`, `/dashboard`
  - throws: ``Failed to clear table ${table}: ${error.message}``; ``Failed to reset fabric rolls: ${rollResetErr.message}``; ``Failed to fetch raw materials: ${fetchRmErr.message}``; ``Failed to reset raw material stock for ${rm.id}: ${rmResetErr.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:9): `import { clearSystemTransactions } from "@/app/(app)/_actions";`

### softDeleteJournalEntry

```
- `softDeleteJournalEntry` [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105)
  - DB: `update` on `accounts_journal`
  - revalidatePath: `/accounts/journal`, `/accounts/sales`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

Not found in source code.

## Delete Operations In Module

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:39): `// SEC-04 / AZ-01 / ISS-004: This is a catastrophic mass-delete. Require admin-only.`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:45): `// 1. Delete transactions in order of dependency constraints`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:46): `const tablesToDelete = [`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:56): `for (const table of tablesToDelete) {`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:57): `const { error } = await (supabase.from(table) as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:79): `.is("deleted_at", null);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:100): `.is("deleted_at", null);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:109): `.is("deleted_at", null)`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:56): `// If editing (originalJournalNo exists), soft delete old rows first`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:58): `const { error: deleteError } = await (supabase`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:60): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id })`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:62): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:69): `.is("deleted_at", null);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105): `export async function softDeleteJournalEntry(formData: FormData) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:111): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id })`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121): `export async function softDeleteJournalEntryGroup(formData: FormData) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:147): `throw new Error("Cannot delete auto-generated journal entries.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:152): `.delete()`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7): `import { softDeleteJournalEntryGroup } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:53): `.is("deleted_at", null)`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:60): `.is("deleted_at", null)`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:82): `.is("deleted_at", null);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:233): `<form action={softDeleteJournalEntryGroup}>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:238): `confirmTitle="Delete journal entry?"`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:239): `confirmDescription={\`This will soft-delete the entire transaction (${entry.journal_no}) and all its lines.\`}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:241): `Delete`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:26): `.is("deleted_at", null)`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:32): `.is("deleted_at", null)`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:52): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:10): `import { DeleteProductPurchaseButton } from "./delete-button";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:41): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:47): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:63): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:68): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:74): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:80): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:86): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:95): `.is("deleted_at", null)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:240): `<DeleteProductPurchaseButton id={row.id} />`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:10): `import { DeletePurchaseButton } from "./delete-purchase-button";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:34): `.is("deleted_at", null)`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:41): `.is("deleted_at", null)`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:47): `.is("deleted_at", null)`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:160): `<DeletePurchaseButton purchaseId={purchase.id} />`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:37): `.is("deleted_at", null)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:44): `.is("deleted_at", null)`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:86): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:87): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:88): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:89): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, num_bags, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:90): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:91): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null)))`

## Update Operations In Module

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:23): `.update({`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:67): `.update({ status: "available", current_stage: "loom", updated_by: user.id } as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:88): `.update({ current_stock: rm.opening_stock, updated_by: user.id })`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:166): `.update({ value, updated_by: user.id } as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:210): `.update({ value, updated_by: user.id } as any)`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:60): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id })`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:74): `nameToIdMap.set(c.customer_name.toLowerCase().trim(), c.id);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:76): `nameToIdMap.set(c.alias.toLowerCase().trim(), c.id);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:111): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id })`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:147): `(dbFabricRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_number));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:148): `(dbLamRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:149): `(dbOffsetRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:150): `(dbFilmRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:151): `(dbMetallicRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:152): `(dbFinishBundles || []).forEach((r: any) => stockMap.set(r.id, r.bundle_id));`

