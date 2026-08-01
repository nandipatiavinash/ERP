# 07 Production

## /fabric/consumption

File: [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:1)

### Permissions

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:9): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:18): `await requirePermission("fabric.consumption");`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:19): `const permissions = await getSessionPermissions();`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:52): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:38): `{ href: "/fabric/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "fabric.consumption" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:7): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:14): `searchParams,`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:16): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:21): `const params = await searchParams;`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:32): `.order("material_name"),`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:39): `.order("created_at", { ascending: false }),`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:52): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:54): `<DateFilter date={date} baseUrl="/fabric/consumption" />`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:82): `<Table>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:83): `<TableHeader>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:84): `<TableRow>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:85): `<TableHead>Date</TableHead>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:86): `<TableHead>Material</TableHead>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:87): `<TableHead className="text-right">Quantity</TableHead>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:88): `<TableHead>Remarks</TableHead>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:89): `{isToday && <TableHead>Actions</TableHead>}`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:92): `<TableBody>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:94): `<TableRow key={row.id}>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:95): `<TableCell>{formatDate(row.consumption_date)}</TableCell>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:96): `<TableCell>{row.raw_materials?.material_name ?? "-"}</TableCell>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:97): `<TableCell className="text-right">`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:100): `<TableCell>{row.remarks ?? "-"}</TableCell>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:102): `<TableCell>`

### Buttons And Event Handlers

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:103): `<form action={softDeleteRawMaterialConsumption}>`

### Forms And Validation

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:103): `<form action={softDeleteRawMaterialConsumption}>`

### Inline Database Queries (page-level)

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:27): `.from("raw_materials")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:28): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:34): `.from("raw_material_consumptions")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:35): `.select("*, raw_materials(material_name, unit)")`

### Calculations Displayed

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:1): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:13): `export default async function FabricConsumptionPage({`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:18): `await requirePermission("fabric.consumption");`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:25): `const [{ data: rawMaterials }, { data: consumptions }] = await Promise.all([`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:28): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:34): `.from("raw_material_consumptions")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:37): `.eq("consumption_date", date)`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:43): `const rows = (consumptions ?? []) as any[];`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:48): `title="Fabric Raw Material Consumption"`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:49): `description="Log and monitor the consumption of raw materials in the fabric production process."`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:54): `<DateFilter date={date} baseUrl="/fabric/consumption" />`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:61): `<CardTitle>Log Consumption</CardTitle>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:64): `<ConsumptionForm department="fabric" materials={materials} rows={rows} />`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:68): `<div className="mb-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm font-medium">`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:75): `<CardTitle>Consumptions for {formatDate(date)}</CardTitle>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:79): `<EmptyState title="No logs found" description="New consumption logs will show up here after being saved." />`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:87): `<TableHead className="text-right">Quantity</TableHead>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:95): `<TableCell>{formatDate(row.consumption_date)}</TableCell>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:98): `{formatNumber(row.quantity, 2)} {row.raw_materials?.unit ?? ""}`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:103): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:108): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:109): `confirmDescription="This will revert the stock update and remove the log entry."`

### Bound Server Actions

- UI [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)
- UI [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:11) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

## /fabric/production

File: [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:1)

### Permissions

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:9): `import { isAdmin, requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:14): `const user = await requirePermission("fabric.production");`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:15): `const permissions = await getSessionPermissions();`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:16): `const admin = isAdmin(user) || permissions.includes("admin.looms");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:37): `{ href: "/fabric/production", label: "Production", roles: ["admin", "operator"], permission: "fabric.production" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:26): `supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:27): `supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:33): `.order("created_at", { ascending: false }),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:38): `const productionRows = ((rows ?? []) as any[]).sort((a, b) => {`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:78): `<Table>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:79): `<TableHeader>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:80): `<TableRow>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:81): `<TableHead>Fabric type</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:82): `<TableHead>S. No</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:83): `<TableHead>Gross Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:84): `<TableHead>Core Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:85): `<TableHead>Net Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:86): `<TableHead>Net Mtrs</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:87): `<TableHead>Avg Mtr Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:88): `<TableHead>Actions</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:91): `<TableBody>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:93): `<TableRow key={row.id} className={index === 0 ? "bg-emerald-50 font-semibold" : "bg-emerald-50/40"}>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:94): `<TableCell>{row.fabric_types?.fabric_name}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:95): `<TableCell className="text-lg font-bold text-emerald-900">{row.serial_number}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:96): `<TableCell>{formatNumber(row.gross_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:97): `<TableCell>{formatNumber(row.core_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:98): `<TableCell>{formatNumber(row.net_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:99): `<TableCell>{formatNumber(Math.floor(row.net_meters), 0)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:100): `<TableCell>{row.average_meter_weight == null ? "-" : formatNumber(Math.floor(Number(row.average_meter_weight)), 0)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:101): `<TableCell className="min-w-[120px]">`

### Buttons And Event Handlers

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:103): `<form action={softDeleteProduction}>`

### Forms And Validation

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:103): `<form action={softDeleteProduction}>`

### Inline Database Queries (page-level)

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:26): `supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:27): `supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:29): `.from("loom_production_entries")`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:30): `.select("*, fabric_types(fabric_name), looms(loom_number), fabric_rolls(roll_number, status)")`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:34): `(supabase as any).rpc("get_last_end_meters_by_loom"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:35): `(supabase as any).rpc("get_next_serial_numbers"),`

### Calculations Displayed

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:6): `import { ProductionForm } from "@/components/app/production-form";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8): `import { softDeleteProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:13): `export default async function FabricProductionPage() {`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:14): `const user = await requirePermission("fabric.production");`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:29): `.from("loom_production_entries")`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:34): `(supabase as any).rpc("get_last_end_meters_by_loom"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:38): `const productionRows = ((rows ?? []) as any[]).sort((a, b) => {`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:42): `const lastMeters: Record<string, number> = {};`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:44): `if (row.loom_id && lastMeters[row.loom_id] === undefined) lastMeters[row.loom_id] = Number(row.end_meters ?? 0);`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:47): `if (lastMeters[loom.id] === undefined) lastMeters[loom.id] = 0;`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:58): `<PageHeader title="Fabric Production Entry" description="Operators create entries; the database generates serials, calculations, and fabric rolls." />`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:60): `<CardHeader><CardTitle>New Production Entry</CardTitle></CardHeader>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:62): `<ProductionForm`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:65): `lastMeters={lastMeters}`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:68): `rows={productionRows}`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:74): `<CardHeader><CardTitle>Today's Production Entries</CardTitle></CardHeader>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:76): `{productionRows.length === 0 ? <EmptyState title="No entries today" description="New production entries will appear here immediately after saving." /> : (`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:83): `<TableHead>Gross Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:84): `<TableHead>Core Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:85): `<TableHead>Net Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:87): `<TableHead>Avg Mtr Weight</TableHead>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:92): `{productionRows.map((row, index) => (`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:96): `<TableCell>{formatNumber(row.gross_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:97): `<TableCell>{formatNumber(row.core_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:98): `<TableCell>{formatNumber(row.net_weight, 2)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:99): `<TableCell>{formatNumber(Math.floor(row.net_meters), 0)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:100): `<TableCell>{row.average_meter_weight == null ? "-" : formatNumber(Math.floor(Number(row.average_meter_weight)), 0)}</TableCell>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:103): `<form action={softDeleteProduction}>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:105): `<ConfirmSubmitButton variant="outline" size="sm" confirmTitle="Delete production entry?" confirmDescription="This will delete the production entry and update related views.">Delete</ConfirmSubmitButton>`

### Bound Server Actions

- UI [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8) imports `softDeleteProduction` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:38)
- UI [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8) imports `softDeleteProduction` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)

## /finishing/consumption

File: [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:1)

### Permissions

- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:13): `await requirePermission("finishing.consumption");`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:14): `const permissions = await getSessionPermissions();`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:119): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:78): `{ href: "/finishing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "finishing.consumption" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:9): `searchParams,`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:11): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:16): `const params = await searchParams;`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:36): `.order("material_name"),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:43): `.order("created_at", { ascending: false }),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:50): `.order("id", { ascending: true })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:51): `.limit(10000),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:58): `.order("id", { ascending: false })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:59): `.limit(100),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:65): `.order("id", { ascending: true })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:66): `.limit(10000),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:72): `.order("id", { ascending: false })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:73): `.limit(100),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:79): `.order("id", { ascending: true })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:80): `.limit(10000),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:86): `.order("id", { ascending: false })`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:87): `.limit(100),`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:90): `const filterByDate = (arr: any[], dateStr: string) => {`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:91): `return arr.filter((item) => {`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:103): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:106): `const consumedFabric = filterByDate((consumedFabricRes.data ?? []) as any[], date);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:108): `const consumedLam = filterByDate((consumedLamRes.data ?? []) as any[], date);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:110): `const consumedOffset = filterByDate((consumedOffsetRes.data ?? []) as any[], date);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:119): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:121): `<DateFilter date={date} baseUrl="/finishing/consumption" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:31): `.from("raw_materials")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:32): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:38): `.from("raw_material_consumptions")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:39): `.select("*, raw_materials(material_name, unit)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:45): `.from("fabric_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:46): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:54): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:61): `.from("lamination_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:62): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:68): `.from("lamination_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:69): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:75): `.from("offset_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:76): `.select("id, roll_id, weight_kg")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:82): `.from("offset_rolls")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:83): `.select("id, roll_id, weight_kg, updated_at")`

### Calculations Displayed

- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:6): `import { FinishingConsumptionClient } from "./FinishingConsumptionClient";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:8): `export default async function FinishingConsumptionPage({`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:13): `await requirePermission("finishing.consumption");`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:22): `rawConsumptionsRes,`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:32): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:38): `.from("raw_material_consumptions")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:41): `.eq("consumption_date", date)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:46): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:54): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:62): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:69): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:76): `.select("id, roll_id, weight_kg")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:83): `.select("id, roll_id, weight_kg, updated_at")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:103): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:104): `const rawRows = (rawConsumptionsRes.data ?? []) as any[];`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:115): `title="Finishing Consumption"`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:121): `<DateFilter date={date} baseUrl="/finishing/consumption" />`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:125): `<FinishingConsumptionClient`

### Bound Server Actions

- UI [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:5) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /finishing/production

File: [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:1)

### Permissions

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:12): `await requirePermission("finishing.production");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:77): `{ href: "/finishing/production", label: "Production", roles: ["admin", "operator"], permission: "finishing.production" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:33): `.order("fabric_name"),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:39): `.order("roll_id"),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:45): `.order("roll_id"),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:51): `.order("created_at", { ascending: false }),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:60): `const fabricTypes = ((activeFabricTypes ?? []) as any[]).filter((ft) => availableFabricTypeIds.has(ft.id));`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:95): `<Table>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:96): `<TableHeader>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:97): `<TableRow className="bg-slate-50/50">`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:98): `<TableHead>Bundle ID</TableHead>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:99): `<TableHead className="text-right">No. of Bags</TableHead>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:100): `<TableHead className="text-right">KGs</TableHead>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:101): `<TableHead className="text-center">Action</TableHead>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:104): `<TableBody>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:106): `<TableRow key={row.id}>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:107): `<TableCell className="font-mono font-bold text-emerald-950">{row.bundle_id}</TableCell>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:108): `<TableCell className="text-right font-mono">{row.num_bags}</TableCell>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:109): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:110): `<TableCell className="text-center">`

### Buttons And Event Handlers

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:111): `<form action={deleteFinishingBundle.bind(null, row.id)}>`

### Forms And Validation

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:111): `<form action={deleteFinishingBundle.bind(null, row.id)}>`

### Inline Database Queries (page-level)

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:29): `.from("fabric_types")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:30): `.select("id, fabric_name")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:35): `.from("lamination_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:36): `.select("id, roll_id, fabric_type_id")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:41): `.from("offset_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:42): `.select("id, roll_id, fabric_type_id")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:47): `.from("finishing_bundles")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:48): `.select("*, fabric_types(fabric_name)")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:54): `.select("fabric_type_id")`

### Calculations Displayed

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:7): `import { FinishingProductionForm } from "@/components/app/finishing-production-form";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:11): `export default async function FinishingProductionPage() {`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:12): `await requirePermission("finishing.production");`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:68): `title="Finishing Production"`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:74): `<CardTitle>Submit Finishing Production</CardTitle>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:77): `<FinishingProductionForm`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:88): `<CardTitle>Recent Finishing Production Entries</CardTitle>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:94): `<div className="overflow-x-auto rounded-lg border border-slate-100">`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:109): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:116): `confirmDescription="This will delete this bundle and update stock."`

### Bound Server Actions

- UI [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8) imports `deleteFinishingBundle` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:68)
- UI [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8) imports `deleteFinishingBundle` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)

## /lamination/consumption

File: [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:1)

### Permissions

- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:13): `await requirePermission("lamination.consumption");`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:14): `const permissions = await getSessionPermissions();`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:130): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:58): `{ href: "/lamination/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "lamination.consumption" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:9): `searchParams,`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:11): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:16): `const params = await searchParams;`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:40): `.order("material_name"),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:47): `.order("created_at", { ascending: false }),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:54): `.order("id", { ascending: true })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:55): `.limit(10000),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:62): `.order("id", { ascending: false })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:63): `.limit(100),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:69): `.order("id", { ascending: true })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:70): `.limit(10000),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:76): `.order("id", { ascending: false })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:77): `.limit(100),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:83): `.order("id", { ascending: true })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:84): `.limit(10000),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:90): `.order("id", { ascending: false })`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:91): `.limit(100),`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:94): `const filterByDate = (arr: any[], dateStr: string) => {`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:95): `return arr.filter((item) => {`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:107): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:110): `const consumedFabric = filterByDate((consumedFabricRes.data ?? []) as any[], date);`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:115): `].sort((a, b) => a.roll_id.localeCompare(b.roll_id, undefined, { numeric: true, sensitivity: "base" }));`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:121): `const consumedFilm = filterByDate(rawConsumedFilm, date).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:130): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:132): `<DateFilter date={date} baseUrl="/lamination/consumption" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:35): `.from("raw_materials")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:36): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:42): `.from("raw_material_consumptions")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:43): `.select("*, raw_materials(material_name, unit)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:49): `.from("fabric_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:50): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:57): `.from("fabric_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:58): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:65): `.from("roto_metallic_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:66): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:72): `.from("roto_metallic_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:73): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:79): `.from("roto_film_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:80): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:86): `.from("roto_film_rolls")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:87): `.select("id, roll_id, weight_kg, meters, updated_at")`

### Calculations Displayed

- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:6): `import { LaminationConsumptionClient } from "./LaminationConsumptionClient";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:8): `export default async function LaminationConsumptionPage({`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:13): `await requirePermission("lamination.consumption");`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:26): `rawConsumptionsRes,`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:36): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:42): `.from("raw_material_consumptions")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:45): `.eq("consumption_date", date)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:50): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:58): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:60): `.in("current_stage", ["lamination", "lamination_consumption"])`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:66): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:73): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:80): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:87): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:107): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:108): `const rawRows = (rawConsumptionsRes.data ?? []) as any[];`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:126): `title="Lamination Consumption"`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:132): `<DateFilter date={date} baseUrl="/lamination/consumption" />`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:136): `<LaminationConsumptionClient`

### Bound Server Actions

- UI [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:5) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /lamination/production

File: [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:1)

### Permissions

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:13): `await requirePermission("lamination.production");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:57): `{ href: "/lamination/production", label: "Production", roles: ["admin", "operator"], permission: "lamination.production" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:34): `.order("fabric_name"),`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:40): `.order("roll_id"),`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:46): `.order("roll_id"),`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:52): `.order("created_at", { ascending: false }),`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:61): `const fabricTypes = ((activeFabricTypes ?? []) as any[]).filter((ft) => availableFabricTypeIds.has(ft.id));`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:97): `<Table>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:98): `<TableHeader>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:99): `<TableRow className="bg-slate-50/50">`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:100): `<TableHead>Laminated Roll ID</TableHead>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:101): `<TableHead className="text-right">KGs</TableHead>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:102): `<TableHead className="text-right">Meters</TableHead>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:103): `<TableHead className="text-center">Action</TableHead>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:106): `<TableBody>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:108): `<TableRow key={row.id}>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:109): `<TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:110): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:111): `<TableCell className="text-right font-mono">{row.meters}</TableCell>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:112): `<TableCell className="text-center">`

### Buttons And Event Handlers

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:113): `<form action={deleteLaminationProduction.bind(null, row.id)}>`

### Forms And Validation

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:113): `<form action={deleteLaminationProduction.bind(null, row.id)}>`

### Inline Database Queries (page-level)

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:30): `.from("fabric_types")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:31): `.select("id, fabric_name")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:36): `.from("roto_film_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:37): `.select("id, roll_id, s_no")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:42): `.from("roto_metallic_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:43): `.select("id, roll_id, s_no")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:48): `.from("lamination_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:49): `.select("*, fabric_types(fabric_name)")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:54): `.from("fabric_rolls")`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:55): `.select("fabric_type_id")`

### Calculations Displayed

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:7): `import { LaminationProductionForm } from "@/components/app/lamination-production-form";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8): `import { deleteLaminationProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:12): `export default async function LaminationProductionPage() {`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:13): `await requirePermission("lamination.production");`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:71): `title="Lamination Production"`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:77): `<CardTitle>Submit Lamination Production</CardTitle>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:80): `<LaminationProductionForm`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:90): `<CardTitle>Recent Lamination Production Entries</CardTitle>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:96): `<div className="overflow-x-auto rounded-lg border border-slate-100">`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:102): `<TableHead className="text-right">Meters</TableHead>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:110): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:111): `<TableCell className="text-right font-mono">{row.meters}</TableCell>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:113): `<form action={deleteLaminationProduction.bind(null, row.id)}>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:118): `confirmDescription="This will delete this roll and revert any metallic roll back to available stock."`

### Bound Server Actions

- UI [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8) imports `deleteLaminationProduction` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:56)
- UI [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8) imports `deleteLaminationProduction` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)

## /offset-printing/consumption

File: [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:1)

### Permissions

- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:13): `await requirePermission("offset_printing.consumption");`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:14): `const permissions = await getSessionPermissions();`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:101): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:68): `{ href: "/offset-printing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "offset_printing.consumption" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:9): `searchParams,`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:11): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:16): `const params = await searchParams;`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:34): `.order("material_name"),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:41): `.order("created_at", { ascending: false }),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:48): `.order("id", { ascending: true })`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:49): `.limit(10000),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:56): `.order("id", { ascending: false })`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:57): `.limit(100),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:63): `.order("id", { ascending: true })`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:64): `.limit(10000),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:70): `.order("id", { ascending: false })`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:71): `.limit(100),`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:74): `const filterByDate = (arr: any[], dateStr: string) => {`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:75): `return arr.filter((item) => {`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:87): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:90): `const consumedFabric = filterByDate((consumedFabricRes.data ?? []) as any[], date);`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:92): `const consumedLam = filterByDate((consumedLamRes.data ?? []) as any[], date);`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:101): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:103): `<DateFilter date={date} baseUrl="/offset-printing/consumption" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:29): `.from("raw_materials")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:30): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:37): `.select("*, raw_materials(material_name, unit)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:43): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:44): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:51): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:52): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:59): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:60): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:66): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:67): `.select("id, roll_id, weight_kg, meters, updated_at")`

### Calculations Displayed

- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:6): `import { OffsetConsumptionClient } from "./OffsetConsumptionClient";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:8): `export default async function OffsetPrintingConsumptionPage({`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:13): `await requirePermission("offset_printing.consumption");`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:22): `rawConsumptionsRes,`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:30): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:39): `.eq("consumption_date", date)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:44): `.select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:52): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:60): `.select("id, roll_id, weight_kg, meters")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:67): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:87): `const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:88): `const rawRows = (rawConsumptionsRes.data ?? []) as any[];`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:97): `title="Offset Printing Consumption"`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:103): `<DateFilter date={date} baseUrl="/offset-printing/consumption" />`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:107): `<OffsetConsumptionClient`

### Bound Server Actions

- UI [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:5) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## /offset-printing/production

File: [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:1)

### Permissions

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:13): `await requirePermission("offset_printing.production");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:67): `{ href: "/offset-printing/production", label: "Production", roles: ["admin", "operator"], permission: "offset_printing.production" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:34): `.order("fabric_name"),`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:40): `.order("roll_id"),`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:45): `.order("brand"),`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:51): `.order("created_at", { ascending: false }),`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:60): `new Set((availableRolls ?? []).map((r: any) => r.fabric_type_id).filter(Boolean))`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:63): `const fabricTypes = ((activeFabricTypes ?? []) as any[]).filter((t) =>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:100): `<Table>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:101): `<TableHeader>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:102): `<TableRow className="bg-slate-50/50">`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:103): `<TableHead>Offset Roll ID</TableHead>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:104): `<TableHead className="text-right">KGs</TableHead>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:105): `<TableHead className="text-center">Action</TableHead>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:108): `<TableBody>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:110): `<TableRow key={row.id}>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:111): `<TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:112): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:113): `<TableCell className="text-center">`

### Buttons And Event Handlers

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:114): `<form action={deleteOffsetProduction.bind(null, row.id)}>`

### Forms And Validation

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:114): `<form action={deleteOffsetProduction.bind(null, row.id)}>`

### Inline Database Queries (page-level)

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:30): `.from("fabric_types")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:31): `.select("id, fabric_name")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:36): `.from("lamination_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:37): `.select("id, roll_id, lam_type, weight_kg, fabric_type_id, fabric_types(fabric_name)")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:42): `.from("offset_products")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:43): `.select("id, brand")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:47): `.from("offset_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:48): `.select("*, offset_products(brand), fabric_types(fabric_name), lamination_rolls(roll_id)")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:53): `.from("fabric_rolls")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:54): `.select("fabric_type_id")`

### Calculations Displayed

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:7): `import { OffsetProductionForm } from "@/components/app/offset-production-form";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8): `import { deleteOffsetProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:12): `export default async function OffsetPrintingProductionPage() {`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:13): `await requirePermission("offset_printing.production");`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:37): `.select("id, roll_id, lam_type, weight_kg, fabric_type_id, fabric_types(fabric_name)")`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:73): `title="Offset Printing Production"`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:79): `<CardTitle>Submit Offset Production</CardTitle>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:82): `<OffsetProductionForm`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:93): `<CardTitle>Recent Offset Production Entries</CardTitle>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:99): `<div className="overflow-x-auto rounded-lg border border-slate-100">`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:112): `<TableCell className="text-right font-mono">{row.weight_kg}</TableCell>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:114): `<form action={deleteOffsetProduction.bind(null, row.id)}>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:118): `confirmTitle="Delete offset production entry?"`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:119): `confirmDescription="This will delete this roll and revert any source laminated roll back to available stock."`

### Bound Server Actions

- UI [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8) imports `deleteOffsetProduction` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:62)
- UI [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8) imports `deleteOffsetProduction` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)

## /roto-printing/consumption

File: [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:1)

### Permissions

- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:9): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:20): `await requirePermission("roto_printing.consumption");`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:21): `const permissions = await getSessionPermissions();`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:54): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:48): `{ href: "/roto-printing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "roto_printing.consumption" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:7): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:16): `searchParams,`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:18): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:23): `const params = await searchParams;`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:34): `.order("material_name"),`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:41): `.order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:54): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:56): `<DateFilter date={date} baseUrl="/roto-printing/consumption" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:29): `.from("raw_materials")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:30): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:37): `.select("*, raw_materials(material_name, unit)")`

### Calculations Displayed

- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:1): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:13): `import { RotoConsumptionClient } from "./RotoConsumptionClient";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:15): `export default async function RotoPrintingConsumptionPage({`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:20): `await requirePermission("roto_printing.consumption");`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:27): `const [{ data: rawMaterials }, { data: consumptions }] = await Promise.all([`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:30): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:36): `.from("raw_material_consumptions")`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:39): `.eq("consumption_date", date)`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:45): `const rows = (consumptions ?? []) as any[];`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:50): `title="Roto Printing Raw Material Consumption"`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:51): `description="Log and monitor the consumption of raw materials (inks, chemicals, solvents) in the Roto Printing process."`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:56): `<DateFilter date={date} baseUrl="/roto-printing/consumption" />`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:60): `<RotoConsumptionClient`

### Bound Server Actions

- UI [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)
- UI [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)
- UI [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:11) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)
- UI [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10) imports `softDeleteRawMaterialConsumption` → [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

## /roto-printing/production

File: [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:1)

### Permissions

- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:7): `await requirePermission("roto_printing.production");`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:47): `{ href: "/roto-printing/production", label: "Production", roles: ["admin", "operator"], permission: "roto_printing.production" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:24): `supabase.from("roto_products").select("id, brand, customer_id").eq("status", "active").order("brand"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:25): `supabase.from("roto_colors").select("id, color_name").eq("status", "active").order("color_name"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:26): `supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:27): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:28): `supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:29): `supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:24): `supabase.from("roto_products").select("id, brand, customer_id").eq("status", "active").order("brand"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:25): `supabase.from("roto_colors").select("id, color_name").eq("status", "active").order("color_name"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:26): `supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:27): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:28): `supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:29): `supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`

### Calculations Displayed

- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:4): `import { RotoProductionClient } from "./RotoProductionClient";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:6): `export default async function RotoPrintingProductionPage() {`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:7): `await requirePermission("roto_printing.production");`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:27): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:42): `title="Roto Printing Production"`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:43): `description="Record Film Production and Metallic Production outputs."`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:46): `<RotoProductionClient`

### Bound Server Actions

- UI [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9) imports `deleteRotoFilmProduction` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:44)
- UI [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9) imports `deleteRotoMetallicProduction` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:50)
- UI [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9) imports `deleteRotoFilmProduction` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)
- UI [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9) imports `deleteRotoMetallicProduction` → [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)

## Execution Traces (Server Actions)

### saveProduction

```
- `saveProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14)
  - DB: `select` on `loom_production_entries`
  - DB: `update` on `loom_production_entries`
  - DB: `insert` on `loom_production_entries`
  - revalidatePath: `/fabric/production`, `/rolls`, `/dashboard`, `/fabric/stock`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:5): `import { saveProduction } from "@/app/(app)/_actions";`

### softDeleteProduction

```
- `softDeleteProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)
  - DB: `select` on `fabric_rolls`
  - DB: `delete` on `loom_production_entries`
  - revalidatePath: `/fabric/production`, `/rolls`, `/dashboard`, `/fabric/stock`
  - throws: `"This roll has been sold and cannot be deleted."`; `"This roll has been consumed in downstream stages and cannot be deleted."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8): `import { softDeleteProduction } from "@/app/(app)/_actions";`

### saveRotoFilmProduction

```
- `saveRotoFilmProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:110)
  - DB: `select` on `roto_products`
  - DB: `select` on `roto_colors`
  - DB: `select` on `roto_film_rolls`
  - DB: `insert` on `roto_film_rolls`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`
  - throws: `"Invalid production parameters."`; `"Film type must be gloss or matt."`; `"Brand not found."`; `insertError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:5): `import { saveRotoFilmProduction } from "@/app/(app)/_actions";`

### deleteRotoFilmProduction

```
- `deleteRotoFilmProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)
  - DB: `select` on `roto_film_rolls`
  - DB: `select` on `roto_metallic_rolls`
  - DB: `delete` on `roto_film_rolls`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`
  - throws: `"Film roll not found."`; `"This roll has been sold and cannot be deleted."`; `"This roll has been consumed in metallic printing and cannot be deleted."`; `"This roll is referenced by a metallic printed roll and cannot be deleted."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`

### saveRotoMetallicProduction

```
- `saveRotoMetallicProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:215)
  - DB: `select` on `roto_film_rolls`
  - DB: `insert` on `roto_metallic_rolls`
  - DB: `update` on `roto_film_rolls`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`
  - throws: `"Invalid parameters."`; `"Source film roll not found."`; `insertError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:5): `import { saveRotoMetallicProduction } from "@/app/(app)/_actions";`

### deleteRotoMetallicProduction

```
- `deleteRotoMetallicProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)
  - DB: `select` on `roto_metallic_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `delete` on `roto_metallic_rolls`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`
  - throws: `"Metallic roll not found."`; `"This roll has been sold and cannot be deleted."`; `"This roll has been consumed in lamination and cannot be deleted."`; `"This roll is referenced by a laminated roll and cannot be deleted."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`

### saveLaminationProduction

```
- `saveLaminationProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:301)
  - DB: `select` on `fabric_types`
  - DB: `select` on `roto_film_rolls`
  - DB: `select` on `roto_metallic_rolls`
  - DB: `select` on `roto_products`
  - DB: `select` on `lamination_rolls`
  - DB: `insert` on `lamination_rolls`
  - DB: `update` on `roto_metallic_rolls`
  - revalidatePath: `/lamination/production`, `/lamination/stock`, `/offset-printing/production`, `/finishing/production`
  - throws: `"Invalid parameters."`; `"Fabric type not found."`; ``Brand is required for lamination type ${lamType}.``; `insertError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:5): `import { saveLaminationProduction } from "@/app/(app)/_actions";`

### deleteLaminationProduction

```
- `deleteLaminationProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_rolls`
  - DB: `select` on `finishing_bundles`
  - DB: `delete` on `lamination_rolls`
  - revalidatePath: `/lamination/production`, `/lamination/stock`, `/offset-printing/production`, `/finishing/production`
  - throws: `"Lamination roll not found."`; `"This roll has been sold and cannot be deleted."`; `"This roll has been consumed in offset/finishing and cannot be deleted."`; `"This roll is referenced by an offset printed roll and cannot be deleted."`; `"This roll is referenced by a finishing bundle and cannot be deleted."`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8): `import { deleteLaminationProduction } from "@/app/(app)/_actions";`

### saveOffsetProduction

```
- `saveOffsetProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:460)
  - DB: `select` on `offset_products`
  - DB: `select` on `fabric_types`
  - DB: `select` on `offset_rolls`
  - DB: `insert` on `offset_rolls`
  - revalidatePath: `/offset-printing/production`, `/offset-printing/stock`, `/finishing/production`
  - throws: `"Invalid parameters."`; `"Offset brand not found."`; `"Source fabric type is required."`; `"Source fabric type not found."`; `insertError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:5): `import { saveOffsetProduction } from "@/app/(app)/_actions";`

### deleteOffsetProduction

```
- `deleteOffsetProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)
  - DB: `select` on `offset_rolls`
  - DB: `select` on `finishing_bundles`
  - DB: `delete` on `offset_rolls`
  - revalidatePath: `/offset-printing/production`, `/offset-printing/stock`, `/finishing/production`
  - throws: `"Offset roll not found."`; `"This roll has been sold and cannot be deleted."`; `"This roll has been consumed in finishing and cannot be deleted."`; `"This roll is referenced by a finishing bundle and cannot be deleted."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8): `import { deleteOffsetProduction } from "@/app/(app)/_actions";`

### saveFinishingBundle

```
- `saveFinishingBundle` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:555)
  - DB: `select` on `fabric_types`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_rolls`
  - DB: `insert` on `finishing_bundles`
  - revalidatePath: `/finishing/production`, `/finishing/stock`
  - throws: `"Invalid parameters."`; `"Fabric Type is required."`; `"Fabric type not found."`; `"Lamination Roll is required."`; `"Lamination roll not found."`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:5): `import { saveFinishingBundle } from "@/app/(app)/_actions";`

### deleteFinishingBundle

```
- `deleteFinishingBundle` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)
  - DB: `select` on `finishing_bundles`
  - DB: `delete` on `finishing_bundles`
  - DB: `update` on `lamination_rolls`
  - DB: `update` on `fabric_rolls`
  - DB: `update` on `offset_rolls`
  - revalidatePath: `/finishing/production`, `/finishing/stock`
  - throws: `"Finishing bundle not found."`; `"This bundle has been sold and cannot be deleted."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8): `import { deleteFinishingBundle } from "@/app/(app)/_actions";`

### saveStageProduction

```
- `saveStageProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:675)
  - DB: `update` on `stage_production_entries`
  - DB: `insert` on `stage_production_entries`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`, `/lamination/stock`, `/offset-printing/production`, `/offset-printing/stock`, `/finishing/production`, `/finishing/stock`, `/rolls`, `/dashboard`, `/reports`
  - throws: `"Missing required production entry fields."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:4): `import { saveStageProduction } from "@/app/(app)/_actions";`

### softDeleteStageProduction

```
- `softDeleteStageProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738)
  - DB: `select` on `stage_production_entries`
  - DB: `delete` on `stage_production_entries`
  - revalidatePath: `/roto-printing/production`, `/roto-printing/stock`, `/lamination/production`, `/lamination/stock`, `/offset-printing/production`, `/offset-printing/stock`, `/finishing/production`, `/finishing/stock`, `/rolls`, `/dashboard`, `/reports`
  - throws: `"Production entry ID is required."`; `"Production entry not found."`; `"Invalid production stage."`; `error.message`
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
```

#### Called From UI

Not found in source code.

## Delete Operations In Module

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:31): `.is("deleted_at", null)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73): `export async function softDeleteProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:85): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:86): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in downstream stages and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:92): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:96): `console.error("[softDeleteProduction] failed", {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:162): `.is("deleted_at", null);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190): `export async function deleteRotoFilmProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:196): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:197): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in metallic printing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:200): `if (hasMetallic) throw new Error("This roll is referenced by a metallic printed roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:205): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276): `export async function deleteRotoMetallicProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:282): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:283): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in lamination and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:286): `if (hasLamination) throw new Error("This roll is referenced by a laminated roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:291): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:390): `.is("deleted_at", null);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): `export async function deleteLaminationProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:437): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:438): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in offset/finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:441): `if (hasOffset) throw new Error("This roll is referenced by an offset printed roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:444): `if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:449): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:500): `.is("deleted_at", null);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530): `export async function deleteOffsetProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:536): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:537): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:540): `if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:545): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): `export async function deleteFinishingBundle(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:647): `if ((bundle as any).status === "sold") throw new Error("This bundle has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:652): `.delete()`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738): `export async function softDeleteStageProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:767): `const deleteSupabase = createAdminClient();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:768): `const { error } = await (deleteSupabase`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:770): `.delete()`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:31): `.is("deleted_at", null)`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:38): `.is("deleted_at", null)`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:103): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:108): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:111): `Delete`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8): `import { softDeleteProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:26): `supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:27): `supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:31): `.is("deleted_at", null)`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:103): `<form action={softDeleteProduction}>`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:105): `<ConfirmSubmitButton variant="outline" size="sm" confirmTitle="Delete production entry?" confirmDescription="This will delete the production entry and update related views.">Delete</ConfirmSubmitButton>`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:14): `softDeleteRawMaterialConsumption,`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:154): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:159): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:162): `Delete`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:35): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:42): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:49): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:57): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:64): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:71): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:78): `.is("deleted_at", null)`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:85): `.is("deleted_at", null)`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8): `import { deleteFinishingBundle } from "@/app/(app)/_actions";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:32): `.is("deleted_at", null)`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:38): `.is("deleted_at", null)`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:44): `.is("deleted_at", null)`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:49): `.is("deleted_at", null)`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:56): `.is("deleted_at", null),`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:111): `<form action={deleteFinishingBundle.bind(null, row.id)}>`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:115): `confirmTitle="Delete finishing entry?"`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:116): `confirmDescription="This will delete this bundle and update stock."`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:118): `Delete`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:14): `softDeleteRawMaterialConsumption,`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:142): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:147): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:150): `Delete`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:39): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:46): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:53): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:61): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:68): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:75): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:82): `.is("deleted_at", null)`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:89): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8): `import { deleteLaminationProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:39): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:45): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:50): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:57): `.is("deleted_at", null)`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:113): `<form action={deleteLaminationProduction.bind(null, row.id)}>`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:117): `confirmTitle="Delete lamination entry?"`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:118): `confirmDescription="This will delete this roll and revert any metallic roll back to available stock."`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:120): `Delete`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:14): `softDeleteRawMaterialConsumption,`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:145): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:150): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:153): `Delete`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:40): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:47): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:55): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:62): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:69): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8): `import { deleteOffsetProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:39): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:49): `.is("deleted_at", null)`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:56): `.is("deleted_at", null),`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:114): `<form action={deleteOffsetProduction.bind(null, row.id)}>`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:118): `confirmTitle="Delete offset production entry?"`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:119): `confirmDescription="This will delete this roll and revert any source laminated roll back to available stock."`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:121): `Delete`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:40): `.is("deleted_at", null)`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:103): `<form action={softDeleteRawMaterialConsumption}>`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:108): `confirmTitle="Delete consumption log?"`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:111): `Delete`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:26): `supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:27): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:28): `supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:29): `supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:99): `<form action={deleteRotoFilmProduction.bind(null, row.id)}>`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:103): `confirmTitle="Delete film production entry?"`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:104): `confirmDescription="This will delete the roll and free up any downstream items."`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:106): `Delete`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:158): `<form action={deleteRotoMetallicProduction.bind(null, row.id)}>`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:162): `confirmTitle="Delete metallic production entry?"`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:163): `confirmDescription="This will delete the roll and restore the source film roll if it was fully consumed."`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:165): `Delete`

## Update Operations In Module

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:62): `? (adminSupabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:264): `.update({ status: "consumed", updated_by: user.id })`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:421): `.update({ status: "consumed" })`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:659): `.update({ status: "available" } as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:663): `.update({ status: "available", current_stage: "loom" } as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:667): `.update({ status: "available" } as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:719): `? (adminSupabase.from("stage_production_entries") as any).update(payload).eq("id", id)`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:57): `typesMap.set(roll.fabric_type_id, roll.fabric_types.fabric_name);`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:54): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:69): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:83): `.select("id, roll_id, weight_kg, updated_at")`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:92): `if (!item.updated_at) return false;`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:98): `}).format(new Date(item.updated_at));`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:52): `typesMap.set(roll.fabric_type_id, roll.fabric_types.fabric_name);`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:58): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:73): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:87): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:96): `if (!item.updated_at) return false;`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:102): `}).format(new Date(item.updated_at));`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:121): `const consumedFilm = filterByDate(rawConsumedFilm, date).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:51): `typesMap.set(roll.fabric_type_id, roll.fabric_types.fabric_name);`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:52): `.select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:67): `.select("id, roll_id, weight_kg, meters, updated_at")`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:76): `if (!item.updated_at) return false;`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:82): `}).format(new Date(item.updated_at));`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:50): `formData.set("id", row.id);`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:52): `formData.set("department", department);`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:66): `laminationRolls.forEach((r) => { if (!map.has(r.roll_id)) map.set(r.roll_id, r); });`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:73): `offsetRolls.forEach((r) => { if (!map.has(r.roll_id)) map.set(r.roll_id, r); });`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:66): `map.set(p.roll_id, p);`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:109): `formData.set("id", row.id);`

