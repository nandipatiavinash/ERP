# 06 Inventory

## /admin/raw-materials

File: [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:1)

### Permissions

- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:10): `await requirePermission("admin.raw_materials");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:20): `{ href: "/admin/raw-materials", label: "Raw Material IDs", roles: ["admin"], permission: "admin.raw_materials" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:7): `type Params = { search?: string; sort?: string; direction?: "asc" | "desc" };`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:9): `export default async function RawMaterialsAdminPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:12): `const params = await searchParams;`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:18): `defaultSort: "material_name",`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:25): `sort={result.sort}`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

Not found in source code.

### Calculations Displayed

Not found in source code.

### Bound Server Actions

Not found in source code.

## /fabric/stock/:id

File: [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:14): `await requirePermission("fabric.stock");`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:29): `.order("id", { ascending: true })`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:30): `.limit(20000),`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:39): `const availableRolls = rolls.filter((r) => r.status === "available");`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:40): `const soldRolls = rolls.filter((r) => r.status === "sold");`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:41): `const consumedRolls = rolls.filter((r) => r.status === "consumed");`

### Buttons And Event Handlers

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:58): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:35): `throw new Error("Unable to load stock details right now.");`

### Inline Database Queries (page-level)

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:23): `supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:25): `.from("fabric_rolls")`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:26): `.select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:31): `(supabase as any).rpc("get_roll_allocations_for_fabric", { p_fabric_type_id: id }),`

### Calculations Displayed

- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:7): `import { StockRollsClient } from "./StockRollsClient";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:9): `export default async function FabricStockDetailPage({`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:14): `await requirePermission("fabric.stock");`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:26): `.select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:35): `throw new Error("Unable to load stock details right now.");`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:57): `<Link href={"/fabric/stock" as any} passHref>`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:58): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:59): `<ArrowLeft className="h-4 w-4" /> Back to Stock Inventory`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:69): `<StockRollsClient`

### Bound Server Actions

Not found in source code.

## /fabric/stock

File: [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:1)

### Permissions

- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:9): `await requirePermission("fabric.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:39): `{ href: "/fabric/stock", label: "Stock", roles: ["admin", "operator"], permission: "fabric.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:8): `export default async function FabricStockPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:10): `const params = await searchParams;`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:25): `supabase.from("fabric_types").select("id, fabric_name").order("fabric_name"),`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:16): `.from("fabric_rolls")`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:17): `.select("fabric_type_id, status, weight, meters")`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:25): `supabase.from("fabric_types").select("id, fabric_name").order("fabric_name"),`

### Calculations Displayed

- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:4): `import { FabricStockClient } from "./FabricStockClient";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:8): `export default async function FabricStockPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:9): `await requirePermission("fabric.stock");`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:17): `.select("fabric_type_id, status, weight, meters")`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:30): `const rolls = (rollsRes.data || []) as Array<{ fabric_type_id: string; status: string; weight: number; meters: number }>;`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:34): `<PageHeader title="Fabric Stock Inventory" description="Fabric stock grouped by type, with roll-level drill-down." />`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:35): `<FabricStockClient`

### Bound Server Actions

Not found in source code.

## /finishing/stock/:id

File: [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:14): `await requirePermission("finishing.stock");`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:29): `.order("s_no", { ascending: true }),`

### Buttons And Event Handlers

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:43): `throw new Error("Unable to load finishing stock details.");`

### Inline Database Queries (page-level)

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:25): `.from("finishing_bundles")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:26): `.select("*")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:32): `.select("order_date, selected_roll_ids, customers(customer_name)")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:37): `.select("selected_roll_ids, sales_orders(order_date, customers(customer_name))")`

### Calculations Displayed

- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:7): `import { StockFinishingBundlesClient } from "./StockFinishingBundlesClient";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:9): `export default async function FinishingStockDetailPage({`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:14): `await requirePermission("finishing.stock");`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:43): `throw new Error("Unable to load finishing stock details.");`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:71): `<Link href={"/finishing/stock" as any} passHref>`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:73): `<ArrowLeft className="h-4 w-4" /> Back to Stock Inventory`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:83): `<StockFinishingBundlesClient`

### Bound Server Actions

Not found in source code.

## /finishing/stock

File: [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:1)

### Permissions

- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:10): `await requirePermission("finishing.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:79): `{ href: "/finishing/stock", label: "Stock", roles: ["admin", "operator"], permission: "finishing.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:38): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.bundle_id.localeCompare(b.bundle_id));`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:60): `<Table>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:61): `<TableHeader>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:62): `<TableRow>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:63): `<TableHead>Specification ID</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:64): `<TableHead className="text-right">Bundles Count</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:65): `<TableHead className="text-right">Total Bags (pcs)</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:66): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:69): `<TableBody>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:71): `<TableRow key={idx}>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:72): `<TableCell className="font-semibold text-base font-mono">`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:77): `<TableCell className="text-right text-base font-medium">{row.bundles}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:78): `<TableCell className="text-right text-base font-medium">{formatNumber(row.bags, 0)}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:79): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:82): `<TableRow className="bg-muted/50 font-bold border-t-2">`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:83): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:84): `<TableCell className="text-right text-base font-bold">{totalBundles}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:85): `<TableCell className="text-right text-base font-bold">{formatNumber(totalBags, 0)}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:86): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:18): `if (error) throw new Error(error.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:14): `.from("finishing_bundles")`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:15): `.select("*, fabric_types(fabric_name)")`

### Calculations Displayed

- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:9): `export default async function FinishingStockPage() {`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:10): `await requirePermission("finishing.stock");`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:20): `const groupsMap = new Map<string, { bundle_id: string; bundles: number; bags: number; weight: number }>();`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:28): `weight: 0`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:35): `g.weight += Number(b.weight_kg || 0);`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:38): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.bundle_id.localeCompare(b.bundle_id));`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:40): `const totalBundles = stockRows.reduce((sum, r) => sum + r.bundles, 0);`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:41): `const totalBags = stockRows.reduce((sum, r) => sum + r.bags, 0);`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:42): `const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:47): `title="Finishing Stock Inventory"`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:48): `description="Finishing bundles stock grouped by specification ID, with bundle-level drill-down."`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:53): `<CardTitle>Available Finishing Stock Summary</CardTitle>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:56): `{stockRows.length === 0 ? (`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:57): `<div className="text-center py-6 text-muted-foreground">No available finishing stock found.</div>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:65): `<TableHead className="text-right">Total Bags (pcs)</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:66): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:70): `{stockRows.map((row, idx) => (`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:73): `<Link href={\`/finishing/stock/${encodeURIComponent(row.bundle_id)}\` as any} prefetch={false} className="text-primary hover:underline">`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:79): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:83): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:84): `<TableCell className="text-right text-base font-bold">{totalBundles}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:85): `<TableCell className="text-right text-base font-bold">{formatNumber(totalBags, 0)}</TableCell>`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:86): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`

### Bound Server Actions

Not found in source code.

## /lamination/stock/:id

File: [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:14): `await requirePermission("lamination.stock");`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:29): `.order("s_no", { ascending: true }),`

### Buttons And Event Handlers

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:43): `throw new Error("Unable to load lamination stock details.");`

### Inline Database Queries (page-level)

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:25): `.from("lamination_rolls")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:26): `.select("*")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:32): `.select("order_date, selected_roll_ids, customers(customer_name)")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:37): `.select("selected_roll_ids, sales_orders(order_date, customers(customer_name))")`

### Calculations Displayed

- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:7): `import { StockLaminationRollsClient } from "./StockLaminationRollsClient";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:9): `export default async function LaminationStockDetailPage({`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:14): `await requirePermission("lamination.stock");`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:43): `throw new Error("Unable to load lamination stock details.");`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:71): `<Link href={"/lamination/stock" as any} passHref>`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:73): `<ArrowLeft className="h-4 w-4" /> Back to Stock Inventory`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:83): `<StockLaminationRollsClient`

### Bound Server Actions

Not found in source code.

## /lamination/stock

File: [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:1)

### Permissions

- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:10): `await requirePermission("lamination.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:59): `{ href: "/lamination/stock", label: "Stock", roles: ["admin", "operator"], permission: "lamination.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:43): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => {`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:67): `<Table>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:68): `<TableHeader>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:69): `<TableRow>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:70): `<TableHead>Specification</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:71): `<TableHead>Fabric Type</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:72): `<TableHead className="text-right">Rolls Count</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:73): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:74): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:77): `<TableBody>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:79): `<TableRow key={idx}>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:80): `<TableCell className="font-semibold text-base font-mono text-emerald-950">`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:85): `<TableCell className="text-base font-medium">{row.fabric_name}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:86): `<TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:87): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:88): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:91): `<TableRow className="bg-muted/50 font-bold border-t-2">`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:92): `<TableCell className="text-base font-bold" colSpan={2}>Total</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:93): `<TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:94): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:95): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMeters), 0)}</TableCell>`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:18): `if (error) throw new Error(error.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:14): `.from("lamination_rolls")`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:15): `.select("*, fabric_types(fabric_name)")`

### Calculations Displayed

- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:9): `export default async function LaminationStockPage() {`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:10): `await requirePermission("lamination.stock");`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:20): `const groupsMap = new Map<string, { roll_id: string; fabric_type_id: string; fabric_name: string; rolls: number; weight: number; meters: number }>();`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:32): `weight: 0,`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:33): `meters: 0`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:39): `g.weight += Number(r.weight_kg || 0);`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:40): `g.meters += Number(r.meters || 0);`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:43): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => {`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:47): `const totalRolls = stockRows.reduce((sum, r) => sum + r.rolls, 0);`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:48): `const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:49): `const totalMeters = stockRows.reduce((sum, r) => sum + r.meters, 0);`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:54): `title="Lamination Stock Inventory"`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:55): `description="Lamination stock grouped by brand and fabric type, with roll-level drill-down."`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:60): `<CardTitle>Available Lamination Stock Summary</CardTitle>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:63): `{stockRows.length === 0 ? (`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:64): `<div className="text-center py-6 text-muted-foreground">No available laminated stock found.</div>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:73): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:74): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:78): `{stockRows.map((row, idx) => (`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:81): `<Link href={\`/lamination/stock/${encodeURIComponent(row.roll_id)}\` as any} prefetch={false} className="text-primary hover:underline">`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:87): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:88): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:92): `<TableCell className="text-base font-bold" colSpan={2}>Total</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:93): `<TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:94): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:95): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMeters), 0)}</TableCell>`

### Bound Server Actions

Not found in source code.

## /offset-printing/stock/:id

File: [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:14): `await requirePermission("offset_printing.stock");`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:29): `.order("s_no", { ascending: true }),`

### Buttons And Event Handlers

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:43): `throw new Error("Unable to load offset stock details.");`

### Inline Database Queries (page-level)

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:25): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:26): `.select("*")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:31): `.from("sales_orders")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:32): `.select("order_date, selected_roll_ids, customers(customer_name)")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:36): `.from("sales_order_items")`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:37): `.select("selected_roll_ids, sales_orders(order_date, customers(customer_name))")`

### Calculations Displayed

- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:7): `import { StockOffsetRollsClient } from "./StockOffsetRollsClient";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:9): `export default async function OffsetStockDetailPage({`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:14): `await requirePermission("offset_printing.stock");`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:43): `throw new Error("Unable to load offset stock details.");`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:71): `<Link href={"/offset-printing/stock" as any} passHref>`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:72): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:73): `<ArrowLeft className="h-4 w-4" /> Back to Stock Inventory`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:83): `<StockOffsetRollsClient`

### Bound Server Actions

Not found in source code.

## /offset-printing/stock

File: [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:1)

### Permissions

- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:10): `await requirePermission("offset_printing.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:69): `{ href: "/offset-printing/stock", label: "Stock", roles: ["admin", "operator"], permission: "offset_printing.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:36): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:57): `<Table>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:58): `<TableHeader>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:59): `<TableRow>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:60): `<TableHead>Specification ID</TableHead>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:61): `<TableHead className="text-right">Rolls Count</TableHead>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:62): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:65): `<TableBody>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:67): `<TableRow key={idx}>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:68): `<TableCell className="font-semibold text-base font-mono">`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:73): `<TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:74): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:77): `<TableRow className="bg-muted/50 font-bold border-t-2">`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:78): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:79): `<TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:80): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:18): `if (error) throw new Error(error.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:14): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:15): `.select("*, fabric_types(fabric_name)")`

### Calculations Displayed

- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:9): `export default async function OffsetPrintingStockPage() {`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:10): `await requirePermission("offset_printing.stock");`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:20): `const groupsMap = new Map<string, { roll_id: string; rolls: number; weight: number }>();`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:27): `weight: 0`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:33): `g.weight += Number(r.weight_kg || 0);`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:36): `const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:38): `const totalRolls = stockRows.reduce((sum, r) => sum + r.rolls, 0);`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:39): `const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:44): `title="Offset Printing Stock Inventory"`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:45): `description="Offset printing stock grouped by specification ID, with roll-level drill-down."`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:50): `<CardTitle>Available Offset Printing Stock Summary</CardTitle>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:53): `{stockRows.length === 0 ? (`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:54): `<div className="text-center py-6 text-muted-foreground">No available offset printing stock found.</div>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:62): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:66): `{stockRows.map((row, idx) => (`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:69): `<Link href={\`/offset-printing/stock/${encodeURIComponent(row.roll_id)}\` as any} prefetch={false} className="text-primary hover:underline">`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:74): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:78): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:79): `<TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:80): `<TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>`

### Bound Server Actions

Not found in source code.

## /roto-printing/stock/:id

File: [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:14): `await requirePermission("roto_printing.stock");`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:30): `.order("s_no", { ascending: true }),`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:36): `.order("s_no", { ascending: true }),`

### Buttons And Event Handlers

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:81): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:50): `throw new Error("Unable to load roto stock details.");`

### Inline Database Queries (page-level)

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:26): `.from("roto_film_rolls")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:27): `.select("*")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:32): `.from("roto_metallic_rolls")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:33): `.select("*")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:38): `.from("sales_orders")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:39): `.select("order_date, selected_roll_ids, customers(customer_name)")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:43): `.from("sales_order_items")`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:44): `.select("selected_roll_ids, sales_orders(order_date, customers(customer_name))")`

### Calculations Displayed

- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:7): `import { StockRotoRollsClient } from "./StockRotoRollsClient";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:9): `export default async function RotoStockDetailPage({`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:14): `await requirePermission("roto_printing.stock");`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:50): `throw new Error("Unable to load roto stock details.");`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:80): `<Link href={"/roto-printing/stock" as any} passHref>`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:81): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:82): `<ArrowLeft className="h-4 w-4" /> Back to Stock Inventory`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:88): `title={\`Roto Printed Stock — ${brandName}\`}`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:92): `<StockRotoRollsClient`

### Bound Server Actions

Not found in source code.

## /roto-printing/stock

File: [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:1)

### Permissions

- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:10): `await requirePermission("roto_printing.stock");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:49): `{ href: "/roto-printing/stock", label: "Stock", roles: ["admin", "operator"], permission: "roto_printing.stock" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:49): `const filmStockRows = Array.from(filmGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:70): `const metallicStockRows = Array.from(metallicGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:98): `<Table>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:99): `<TableHeader>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:100): `<TableRow>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:101): `<TableHead>Specification ID</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:102): `<TableHead className="text-right">Rolls Count</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:103): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:104): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:107): `<TableBody>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:109): `<TableRow key={row.roll_id}>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:110): `<TableCell className="font-semibold text-base font-mono">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:115): `<TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:116): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:117): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:120): `<TableRow className="bg-muted/50 font-bold border-t-2">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:121): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:122): `<TableCell className="text-right text-base font-bold">{totalFilmRolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:123): `<TableCell className="text-right text-base font-bold">{formatNumber(totalFilmWeight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:124): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalFilmMeters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:143): `<Table>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:144): `<TableHeader>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:145): `<TableRow>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:146): `<TableHead>Specification ID</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:147): `<TableHead className="text-right">Rolls Count</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:148): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:149): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:152): `<TableBody>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:154): `<TableRow key={row.roll_id}>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:155): `<TableCell className="font-semibold text-base font-mono">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:160): `<TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:161): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:162): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:165): `<TableRow className="bg-muted/50 font-bold border-t-2">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:166): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:167): `<TableCell className="text-right text-base font-bold">{totalMetallicRolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:168): `<TableCell className="text-right text-base font-bold">{formatNumber(totalMetallicWeight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:169): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMetallicMeters), 0)}</TableCell>`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:27): `if (filmError) throw new Error(filmError.message);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:28): `if (metallicError) throw new Error(metallicError.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:18): `.from("roto_film_rolls")`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:19): `.select("*, roto_products(brand)")`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:22): `.from("roto_metallic_rolls")`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:23): `.select("*, roto_film_rolls(brand_id, roto_products(brand))")`

### Calculations Displayed

- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:9): `export default async function RotoPrintingStockPage() {`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:10): `await requirePermission("roto_printing.stock");`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:31): `const filmGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:38): `weight: 0,`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:39): `meters: 0`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:45): `g.weight += Number(r.weight_kg || 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:46): `g.meters += Number(r.meters || 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:49): `const filmStockRows = Array.from(filmGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:52): `const metallicGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:59): `weight: 0,`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:60): `meters: 0`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:66): `g.weight += Number(r.weight_kg || 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:67): `g.meters += Number(r.meters || 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:70): `const metallicStockRows = Array.from(metallicGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:72): `const totalFilmRolls = filmStockRows.reduce((sum, r) => sum + r.rolls, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:73): `const totalFilmWeight = filmStockRows.reduce((sum, r) => sum + r.weight, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:74): `const totalFilmMeters = filmStockRows.reduce((sum, r) => sum + r.meters, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:76): `const totalMetallicRolls = metallicStockRows.reduce((sum, r) => sum + r.rolls, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:77): `const totalMetallicWeight = metallicStockRows.reduce((sum, r) => sum + r.weight, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:78): `const totalMetallicMeters = metallicStockRows.reduce((sum, r) => sum + r.meters, 0);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:83): `title="Roto Printing Stock Inventory"`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:91): `<CardTitle>Printed Film Stock Summary</CardTitle>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:94): `{filmStockRows.length === 0 ? (`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:95): `<div className="text-center py-6 text-muted-foreground">No available printed film stock found.</div>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:103): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:104): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:108): `{filmStockRows.map((row) => (`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:111): `<Link href={\`/roto-printing/stock/${encodeURIComponent(row.roll_id)}\` as any} prefetch={false} className="text-primary hover:underline">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:116): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:117): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:121): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:122): `<TableCell className="text-right text-base font-bold">{totalFilmRolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:123): `<TableCell className="text-right text-base font-bold">{formatNumber(totalFilmWeight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:124): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalFilmMeters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:136): `<CardTitle>Metallic Film Stock Summary</CardTitle>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:139): `{metallicStockRows.length === 0 ? (`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:140): `<div className="text-center py-6 text-muted-foreground">No available metallic stock found.</div>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:148): `<TableHead className="text-right">Total Weight</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:149): `<TableHead className="text-right">Total Meters</TableHead>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:153): `{metallicStockRows.map((row) => (`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:156): `<Link href={\`/roto-printing/stock/${encodeURIComponent(row.roll_id)}\` as any} prefetch={false} className="text-primary hover:underline">`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:161): `<TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:162): `<TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:166): `<TableCell className="text-base font-bold">Total</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:167): `<TableCell className="text-right text-base font-bold">{totalMetallicRolls}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:168): `<TableCell className="text-right text-base font-bold">{formatNumber(totalMetallicWeight, 2)}</TableCell>`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:169): `<TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMetallicMeters), 0)}</TableCell>`

### Bound Server Actions

Not found in source code.

## Execution Traces (Server Actions)

### saveRawMaterialPurchase

```
- `saveRawMaterialPurchase` [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:8)
  - DB: `insert` on `raw_material_purchases`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - revalidatePath: `/`
  - throws: `"Purchase date, client, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one raw material item must be added."`; `"Every purchase item must have a material, positive quantity, and positive rate.`; `error.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

#### Called From UI

- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:5): `import { saveRawMaterialPurchase } from "@/app/(app)/_actions";`

### deleteRawMaterialPurchase

```
- `deleteRawMaterialPurchase` [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)
  - DB: `select` on `raw_material_purchases`
  - DB: `update` on `raw_material_purchases`
  - DB: `delete` on `raw_material_purchases`
  - DB: `select` on `accounts_journal`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/`
  - throws: `"Purchase ID is required."`; `"Purchase entry not found."`; `"Purchase entries can only be deleted on the same day they were purchased."`; `softDeleteError.message`; `deleteError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
```

#### Called From UI

- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5): `import { deleteRawMaterialPurchase } from "@/app/(app)/_actions";`

### updateCriticalLevel

```
- `updateCriticalLevel` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:11)
  - DB: `update` on `raw_materials`
  - revalidatePath: `/admin/critical-levels`, `/admin/raw-materials`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:1): `import { updateCriticalLevel } from "@/app/(app)/_actions";`

### saveRawMaterialConsumption

```
- `saveRawMaterialConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:27)
  - DB: `update` on `raw_material_consumptions`
  - DB: `insert` on `raw_material_consumptions`
  - revalidatePath: `/fabric/consumption`, `/roto-printing/consumption`, `/lamination/consumption`, `/offset-printing/consumption`, `/finishing/consumption`, `/raw-materials`, `/dashboard`, `/reports`
  - throws: `"Missing required consumption fields or invalid quantity."`; `"Quantity must be a multiple of 25."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:5): `import { saveRawMaterialConsumption } from "@/app/(app)/_actions";`

### softDeleteRawMaterialConsumption

```
- `softDeleteRawMaterialConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)
  - DB: `select` on `raw_material_consumptions`
  - DB: `update` on `raw_material_consumptions`
  - revalidatePath: `/fabric/consumption`, `/roto-printing/consumption`, `/lamination/consumption`, `/offset-printing/consumption`, `/finishing/consumption`, `/raw-materials`, `/dashboard`, `/reports`
  - throws: `"Consumption ID is required."`; `"Consumption log not found."`; `"You can only delete consumption logs on the day they are created."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
```

#### Called From UI

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`

### consumeFabricRoll

```
- `consumeFabricRoll` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:130)
  - DB: `update` on `fabric_rolls`
  - revalidatePath: `/fabric/stock`, `/lamination/consumption`, `/offset-printing/consumption`, `/finishing/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### revertFabricRollConsumption

```
- `revertFabricRollConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:153)
  - DB: `select` on `fabric_rolls`
  - DB: `update` on `fabric_rolls`
  - revalidatePath: `/fabric/stock`, `/lamination/consumption`, `/offset-printing/consumption`, `/finishing/consumption`
  - throws: `"Roll ID is required."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### consumeMetallicRoll

```
- `consumeMetallicRoll` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:182)
  - DB: `update` on `roto_metallic_rolls`
  - revalidatePath: `/roto-printing/stock`, `/lamination/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### revertMetallicRollConsumption

```
- `revertMetallicRollConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:197)
  - DB: `update` on `roto_metallic_rolls`
  - revalidatePath: `/roto-printing/stock`, `/lamination/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### consumeRotoFilmRoll

```
- `consumeRotoFilmRoll` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:212)
  - DB: `update` on `roto_film_rolls`
  - revalidatePath: `/roto-printing/stock`, `/lamination/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### revertRotoFilmRollConsumption

```
- `revertRotoFilmRollConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:227)
  - DB: `update` on `roto_film_rolls`
  - revalidatePath: `/roto-printing/stock`, `/lamination/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### consumeLaminationRoll

```
- `consumeLaminationRoll` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:242)
  - DB: `update` on `lamination_rolls`
  - revalidatePath: `/lamination/stock`, `/offset-printing/consumption`, `/finishing/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### revertLaminationRollConsumption

```
- `revertLaminationRollConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:259)
  - DB: `update` on `lamination_rolls`
  - revalidatePath: `/lamination/stock`, `/offset-printing/consumption`, `/finishing/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### consumeOffsetRoll

```
- `consumeOffsetRoll` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:276)
  - DB: `update` on `offset_rolls`
  - revalidatePath: `/offset-printing/stock`, `/finishing/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### revertOffsetRollConsumption

```
- `revertOffsetRollConsumption` [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:291)
  - DB: `update` on `offset_rolls`
  - revalidatePath: `/offset-printing/stock`, `/finishing/consumption`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### saveProductPurchase

```
- `saveProductPurchase` [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)
  - DB: `insert` on `product_purchases`
  - DB: `select` on `fabric_types`
  - DB: `insert` on `fabric_rolls`
  - DB: `select` on `roto_products`
  - DB: `select` on `roto_colors`
  - DB: `select` on `roto_film_rolls`
  - DB: `insert` on `roto_film_rolls`
  - DB: `insert` on `roto_film_rolls`
  - DB: `insert` on `roto_metallic_rolls`
  - DB: `select` on `fabric_rolls`
  - DB: `select` on `roto_products`
  - DB: `select` on `lamination_rolls`
  - DB: `insert` on `lamination_rolls`
  - DB: `update` on `fabric_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_products`
  - DB: `select` on `offset_rolls`
  - DB: `insert` on `offset_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `select` on `fabric_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_rolls`
  - DB: `select` on `finishing_bundles`
  - DB: `insert` on `finishing_bundles`
  - DB: `update` on `fabric_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `update` on `offset_rolls`
  - DB: `insert` on `product_purchase_items`
  - DB: `delete` on `product_purchases`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `rpc` on `next_year_number`
  - revalidatePath: `/accounts/product-purchase`
  - throws: `"Purchase date, supplier, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one purchase item must be added."`; `headerError?.message || "Failed to create product purchase record."`; ``Fabric roll stock insert failed: ${stockErr.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

#### Called From UI

- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:5): `import { saveProductPurchase } from "@/app/(app)/_actions/product-purchase";`

### deleteProductPurchase

```
- `deleteProductPurchase` [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)
  - DB: `select` on `product_purchases`
  - DB: `select` on `product_purchase_items`
  - DB: `update` on `fabric_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `update` on `fabric_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `update` on `offset_rolls`
  - DB: `delete` on `fabric_rolls`
  - DB: `delete` on `lamination_rolls`
  - DB: `delete` on `offset_rolls`
  - DB: `delete` on `finishing_bundles`
  - DB: `select` on `roto_metallic_rolls`
  - DB: `delete` on `roto_metallic_rolls`
  - DB: `delete` on `roto_film_rolls`
  - DB: `delete` on `roto_film_rolls`
  - DB: `select` on `accounts_journal`
  - DB: `select` on `accounts_journal`
  - DB: `delete` on `accounts_journal`
  - DB: `delete` on `product_purchases`
  - revalidatePath: `/accounts/product-purchase`
  - throws: `"Purchase ID is required."`; `"Product purchase not found."`; `deleteErr.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5): `import { deleteProductPurchase } from "@/app/(app)/_actions/product-purchase";`

## Delete Operations In Module

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:164): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:287): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:350): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:414): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:485): `// Self-healing rollback: Delete any stock records created in this failed purchase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:487): `await adminSupabase.from(rec.table).delete().eq("id", rec.id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:489): `// Delete the header`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:490): `await adminSupabase.from("product_purchases").delete().eq("id", purchaseId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:497): `adminSupabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:498): `adminSupabase.from("customers").select("id, customer_name").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): `export async function deleteProductPurchase(formData: FormData) {`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:566): `// 2. Revert source rolls to 'available' & Delete created stock items in parallel`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:590): `promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:592): `promises.push((adminSupabase.from("lamination_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:594): `promises.push((adminSupabase.from("offset_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:596): `promises.push((adminSupabase.from("finishing_bundles") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:607): `await adminSupabase.from("roto_metallic_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:609): `await adminSupabase.from("roto_film_rolls").delete().eq("id", (metallic as any).source_film_roll_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:612): `await adminSupabase.from("roto_film_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:620): `// 3. Delete matching journal entries (try UUID tag first, fallback to bill number matching)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:626): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:638): `.is("deleted_at", null);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:645): `.delete()`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:649): `console.error("Failed to delete associated journal entries:", journalErr);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:652): `// 4. Delete the purchase header and cascade delete purchase items`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:653): `const { error: deleteErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:655): `.delete()`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:658): `if (deleteErr) throw new Error(deleteErr.message);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:663): `console.error("Error in deleteProductPurchase:", err);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:664): `return { success: false, error: err.message || "Failed to delete product purchase." };`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:64): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:65): `supabase.from("customers").select("id, customer_name").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104): `export async function deleteRawMaterialPurchase(purchaseId: string) {`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:123): `throw new Error("Purchase entries can only be deleted on the same day they were purchased.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:126): `// 1. Soft-delete first to trigger the plpgsql stock updates trigger (apply_raw_material_purchase)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:127): `const { error: softDeleteError } = await (supabase`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:129): `.update({ deleted_at: new Date().toISOString() } as any)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:132): `if (softDeleteError) throw new Error(softDeleteError.message);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:134): `// 2. Hard-delete the purchase row`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:135): `const { error: deleteError } = await (supabase`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:137): `.delete()`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:140): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:142): `// Delete auto-generated journal entries using the unique RM:UUID tag (safe, no bill-number collisions)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:147): `.is("deleted_at", null);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:153): `.delete()`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79): `export async function softDeleteRawMaterialConsumption(formData: FormData) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:109): `throw new Error("You can only delete consumption logs on the day they are created.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:114): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id } as any)`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5): `import { saveMaterialSalesEntry, deleteMaterialSalesEntry } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:96): `async function handleDelete(id: string, journalNo: string | null) {`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:97): `if (!confirm("Are you sure you want to delete this sale? This will also remove the corresponding journal entries and adjust raw material stock.")) {`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:106): `await deleteMaterialSalesEntry(formData);`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:107): `setSuccessText("Sale entry deleted successfully.");`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:109): `setErrorText(err.message || "Failed to delete sale.");`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:384): `onClick={() => handleDelete(sale.id, sale.journal_no)}`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:386): `title="Delete entry"`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5): `import { deleteProductPurchase } from "@/app/(app)/_actions/product-purchase";`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:7): `export function DeleteProductPurchaseButton({ id }: { id: string }) {`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:10): `const handleDelete = async () => {`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:12): `"Are you sure you want to delete this product purchase? This will also remove the corresponding rolls/bundles from stock registers and delete its journal entries."`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:20): `const result = await deleteProductPurchase(formData);`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:22): `alert(result.error || "Failed to delete product purchase.");`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:26): `alert(err?.message || "Failed to delete product purchase.");`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:34): `onClick={handleDelete}`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:36): `aria-label="Delete product purchase"`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5): `import { deleteRawMaterialPurchase } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:7): `export function DeletePurchaseButton({ purchaseId }: { purchaseId: string }) {`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:10): `const handleDelete = async () => {`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:12): `"Are you sure you want to delete this purchase entry? This action cannot be undone."`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:18): `await deleteRawMaterialPurchase(purchaseId);`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:20): `alert(err?.message || "Failed to delete purchase entry.");`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:28): `onClick={handleDelete}`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:30): `aria-label="Delete purchase"`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:28): `.is("deleted_at", null)`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:18): `.is("deleted_at", null);`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:28): `.is("deleted_at", null)`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:34): `.is("deleted_at", null),`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:39): `.is("sales_orders.deleted_at", null)`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:16): `.is("deleted_at", null);`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:28): `.is("deleted_at", null)`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:34): `.is("deleted_at", null),`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:39): `.is("sales_orders.deleted_at", null)`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:16): `.is("deleted_at", null);`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:28): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:34): `.is("deleted_at", null),`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:39): `.is("sales_orders.deleted_at", null)`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:16): `.is("deleted_at", null);`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:29): `.is("deleted_at", null)`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:35): `.is("deleted_at", null)`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:41): `.is("deleted_at", null),`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:46): `.is("sales_orders.deleted_at", null)`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:20): `.is("deleted_at", null),`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:24): `.is("deleted_at", null),`

## Update Operations In Module

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:319): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:380): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:448): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:450): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:452): `await (adminSupabase.from("offset_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:572): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:574): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:578): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:580): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:582): `promises.push((adminSupabase.from("offset_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:129): `.update({ deleted_at: new Date().toISOString() } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:19): `.update({ critical_level: criticalLevel, updated_by: user.id })`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:63): `? (supabase.from("raw_material_consumptions") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:114): `.update({ deleted_at: new Date().toISOString(), updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:142): `.update({ status: "consumed", current_stage: stage, updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:171): `.update({ status: "available", current_stage: "loom", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:188): `.update({ status: "consumed", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:203): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:218): `.update({ status: "consumed", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:233): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:249): `.update({ status: "consumed", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:266): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:282): `.update({ status: "consumed", updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:297): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:76): `formData.set("inc_gst", String(incGst));`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:77): `formData.set("sale_date", selectedDate);`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:277): `formData.set("total_bill_value", String(parsedBillVal));`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:24): `groupsMap.set(bId, {`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:27): `groupsMap.set(key, {`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:24): `groupsMap.set(rId, {`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:35): `filmGroups.set(rId, {`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:56): `metallicGroups.set(rId, {`

