# 05 Sales

## /sales/client-orders

File: [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:1)

### Permissions

- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:3): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:8): `await requirePermission("sales.order_confirmation"); // staff with order confirmation permission can review client orders`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:87): `{ href: "/sales/client-orders", label: "Client Portal Orders", roles: ["admin"], permission: "sales.order_confirmation" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:28): `.order("created_at", { ascending: false }) as any;`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:14): `.from("client_orders")`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:15): `.select(\``

### Calculations Displayed

Not found in source code.

### Bound Server Actions

- UI [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4) imports `approveClientOrder` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:257)
- UI [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4) imports `cancelClientOrder` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:261)
- UI [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4) imports `approveClientOrder` → [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:100)
- UI [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4) imports `cancelClientOrder` → [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:181)

## /sales/delivery-entry/:id

File: [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:1)

### Permissions

- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:4): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:14): `await requirePermission("sales.delivery_entry");`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:15): `const permissions = await getSessionPermissions();`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:242): `permissions={permissions}`

### UI / Tables / Filters / Dialogs / Loading

Not found in source code.

### Buttons And Event Handlers

- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:226): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Forms And Validation

- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:39): `if (orderResult.error) throw new Error(orderResult.error.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:27): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:28): `.select("*, customers(*), sales_order_items(*)")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:33): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:34): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:35): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:36): `supabase.from("finishing_products").select("id, name")`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:64): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:65): `supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:66): `supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:67): `supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:68): `supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:69): `supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:70): `selectedRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:71): `selectedRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:72): `selectedRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:73): `selectedRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:74): `selectedRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:75): `selectedRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] })`

### Calculations Displayed

- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:49): `// Fetch available stock for all departments in parallel`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:64): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:65): `supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:66): `supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:67): `supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:68): `supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:69): `supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:70): `selectedRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:71): `selectedRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:72): `selectedRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:73): `selectedRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:74): `selectedRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:75): `selectedRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] })`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:84): `weight: Number(r.weight || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:85): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:90): `loom_production_entries: r.loom_production_entries`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:108): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:109): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:129): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:130): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:162): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:163): `meters: Number(r.num_bags || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:182): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:183): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:200): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:201): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:226): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">`

### Bound Server Actions

Not found in source code.

## /sales/delivery-entry

File: [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:1)

### Permissions

- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:11): `await requirePermission("sales.delivery_entry");`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:12): `const permissions = await getSessionPermissions();`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:275): `permissions={permissions}`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:89): `{ href: "/sales/delivery-entry", label: "Delivery Entry", roles: ["admin"], permission: "sales.delivery_entry" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:7): `searchParams,`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:9): `searchParams: Promise<{ from?: string; to?: string; tab?: string }>;`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:14): `const params = await searchParams;`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:26): `.order("order_date", { ascending: true })`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:27): `.order("order_number", { ascending: true })`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:36): `.gte("order_date", from)`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:37): `.lte("order_date", to)`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:39): `.order("order_date", { ascending: false })`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:40): `.order("order_number", { ascending: true })`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:48): `if (draftRes.error) throw new Error(draftRes.error.message);`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:49): `if (confirmedRes.error) throw new Error(confirmedRes.error.message);`

### Inline Database Queries (page-level)

- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:22): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:23): `.select("*, customers(*), sales_order_items(*)")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:33): `.from("sales_orders")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:34): `.select("*, customers(*), sales_order_items(*)")`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:77): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:78): `supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:79): `supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:80): `supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:81): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:82): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:113): `uniqueRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:114): `uniqueRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:115): `uniqueRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:116): `uniqueRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:117): `uniqueRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:118): `uniqueRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:119): `supabase.from("fabric_types").select("id, fabric_name"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:120): `supabase.from("roto_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:121): `supabase.from("offset_products").select("id, brand, width, height"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:122): `supabase.from("lamination_products").select("id, name"),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:123): `supabase.from("finishing_products").select("id, name")`

### Calculations Displayed

- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:77): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:78): `supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:79): `supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:80): `supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:81): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:82): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:113): `uniqueRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:114): `uniqueRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:115): `uniqueRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:116): `uniqueRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:117): `uniqueRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:118): `uniqueRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:132): `weight: Number(r.weight || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:133): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:138): `loom_production_entries: r.loom_production_entries`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:154): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:155): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:173): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:174): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:204): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:205): `meters: Number(r.num_bags || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:222): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:223): `meters: Number(r.meters || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:238): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:239): `meters: Number(r.meters || 0),`

### Bound Server Actions

- UI [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6) imports `deleteSalesOrderItem` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:85)
- UI [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6) imports `confirmMultipleSalesDeliveries` → [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:120)
- UI [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:18) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:3) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
- UI [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6) imports `deleteSalesOrderItem` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)
- UI [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6) imports `confirmMultipleSalesDeliveries` → [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1148)

## /sales/order-confirmation

File: [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:1)

### Permissions

- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:16): `await requirePermission("sales.order_confirmation");`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:17): `const permissions = await getSessionPermissions();`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:127): `{permissions.includes("reports.filter_by_date") && (`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:88): `{ href: "/sales/order-confirmation", label: "Order Confirmation", roles: ["admin"], permission: "sales.order_confirmation" },`

### UI / Tables / Filters / Dialogs / Loading

- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:8): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:12): `searchParams,`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:14): `searchParams: Promise<{ date?: string }>;`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:19): `const params = await searchParams;`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:31): `supabase.from("customers").select("id, customer_name, alias").eq("status", "active").eq("is_internal", "client a/c").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name, status").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:33): `supabase.from("roto_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:34): `supabase.from("offset_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:35): `supabase.from("lamination_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:36): `supabase.from("finishing_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:42): `.order("order_date", { ascending: true })`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:43): `.order("order_number", { ascending: true })`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:44): `.limit(100),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:89): `.filter((c) => isActualClient(c.customer_name))`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:92): `const fabricOptionsActive = ((fabrics ?? []) as any[]).filter(f => f.status === "active").map((f) => ({ id: f.id, label: f.fabric_name }));`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:95): `const rotoOptionsActive = ((roto ?? []) as any[]).filter(r => r.status === "active").map((r) => ({ id: r.id, label: r.brand }));`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:98): `const offsetOptionsActive = ((offset ?? []) as any[]).filter(o => o.status === "active").map((o) => ({ id: o.id, label: o.brand }));`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:100): `const laminationOptions = ((laminationProds ?? []) as any[]).filter(l => l.status === "active").map((l) => ({ id: l.id, label: l.name }));`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:101): `const finishingOptions = ((finishingProds ?? []) as any[]).filter(f => f.status === "active").map((f) => ({ id: f.id, label: f.name }));`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:127): `{permissions.includes("reports.filter_by_date") && (`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:128): `<DateFilter date={date} baseUrl="/sales/order-confirmation" />`

### Buttons And Event Handlers

Not found in source code.

### Forms And Validation

Not found in source code.

### Inline Database Queries (page-level)

- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:31): `supabase.from("customers").select("id, customer_name, alias").eq("status", "active").eq("is_internal", "client a/c").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name, status").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:33): `supabase.from("roto_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:34): `supabase.from("offset_products").select("id, brand, width, height, status").order("brand"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:35): `supabase.from("lamination_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:36): `supabase.from("finishing_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:38): `.from("sales_orders")`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:39): `.select("*, customers(customer_name, alias), sales_order_items(id, department, quantity, product_id, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`

### Calculations Displayed

- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:39): `.select("*, customers(customer_name, alias), sales_order_items(id, department, quantity, product_id, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:64): `"roundoff",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:65): `"round off",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:68): `"cgst",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:69): `"sgst",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:70): `"igst",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:71): `"gst",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:77): `"opening balance",`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:106): `<PageHeader title="Order Confirmation" description="Create multi-item orders across production departments." />`

### Bound Server Actions

- UI [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:7) imports `todayInIndia` → [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

## Execution Traces (Server Actions)

### saveSale

```
- `saveSale` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:15)
  - DB: `update` on `sales_orders`
  - DB: `insert` on `sales_orders`
  - revalidatePath: `/sales`, `/rolls`, `/dashboard`
  - throws: `error.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
```

#### Called From UI

- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:4): `import { saveSale } from "@/app/(app)/_actions";`

### createSalesOrder

```
- `createSalesOrder` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:38)
  - DB: `select` on `sales_orders`
  - DB: `insert` on `sales_orders`
  - DB: `insert` on `sales_order_items`
  - DB: `rpc` on `get_next_order_no`
  - revalidatePath: `/sales/order-confirmation`
  - throws: `headerError.message`; `"Invalid items payload format."`; `itemsError.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:6): `import { createSalesOrder } from "@/app/(app)/_actions";`

### deleteSalesOrderItem

```
- `deleteSalesOrderItem` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)
  - DB: `select` on `sales_order_items`
  - DB: `delete` on `sales_order_items`
  - DB: `select` on `sales_order_items`
  - DB: `delete` on `sales_orders`
  - revalidatePath: `/sales/delivery-entry`, `/rolls`, `/fabric/stock`, `/accounts/sales`
  - throws: `itemError?.message || "Item not found."`; `releaseError.message`; `deleteError.message`; `countError.message`; `deleteOrderError.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6): `import { confirmMultipleSalesDeliveries, deleteSalesOrderItem } from "@/app/(app)/_actions";`

### confirmSalesDelivery

```
- `confirmSalesDelivery` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:183)
```

#### Called From UI

- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:6): `import { confirmSalesDelivery } from "@/app/(app)/_actions";`

### prepareSalesOrderDraftBilling

```
- `prepareSalesOrderDraftBilling` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:425)
  - DB: `select` on `sales_order_items`
  - DB: `select` on `sales_order_items`
  - DB: `insert` on `sales_orders`
  - DB: `update` on `sales_order_items`
  - DB: `update` on `sales_orders`
  - revalidatePath: `/accounts/sales`
  - throws: `"At least one item must be selected."`; `"Selected sales order items not found."`; `"All selected items must belong to the same customer to be billed together."`; ``Failed to fetch items for order ${oId}``; ``Failed to split order: ${newOrderError?.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### finalizeSalesOrderBilling

```
- `finalizeSalesOrderBilling` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:554)
  - DB: `select` on `sales_orders`
  - DB: `update` on `sales_orders`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `update` on `sales_orders`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/accounts/sales`, `/accounts/journal`, `/sales/delivery-entry`, `/reports`, `/accounts/sales`, `/accounts/journal`, `/sales/delivery-entry`, `/reports`
  - throws: `"Order ID and Bill Number are required."`; `"Bill Value must be a non-negative amount."`; `"Sales order not found."`; `"Order is not in draft billing state."`; `updateError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

#### Called From UI

Not found in source code.

### discardSalesOrderDraftBilling

```
- `discardSalesOrderDraftBilling` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:675)
  - DB: `update` on `sales_orders`
  - revalidatePath: `/accounts/sales`
  - throws: `updateError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

Not found in source code.

### deleteSalesOrderCompletely

```
- `deleteSalesOrderCompletely` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694)
  - DB: `select` on `sales_orders`
  - DB: `update` on `fabric_rolls`
  - DB: `select` on `accounts_journal`
  - DB: `delete` on `accounts_journal`
  - DB: `delete` on `sales_order_items`
  - DB: `delete` on `sales_orders`
  - revalidatePath: `/sales/order-confirmation`, `/sales/delivery-entry`, `/accounts/sales`, `/accounts/journal`, `/rolls`, `/fabric/stock`
  - throws: `"Sales order not found or already deleted."`; `"Failed to reset roll statuses: " + rollUpdateErr.message`; `"Failed to delete related journal entries: " + journalDelErr.message`; `"Failed to delete sales order items: " + itemsDelErr.message`; `"Failed to delete sales order: " + orderDelErr.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:4): `import { deleteSalesOrderCompletely } from "@/app/(app)/_actions";`

### saveSalesConfirmationRates

```
- `saveSalesConfirmationRates` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)
  - DB: `select` on `sales_orders`
  - DB: `update` on `sales_orders`
  - DB: `update` on `sales_order_items`
  - DB: `select` on `fabric_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_rolls`
  - DB: `select` on `finishing_bundles`
  - DB: `select` on `roto_film_rolls`
  - DB: `select` on `roto_metallic_rolls`
  - DB: `delete` on `accounts_journal`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - revalidatePath: `/reports/sales-confirmation`, `/accounts/journal`, `/reports/accounts`
  - throws: `orderFetchError?.message || "Order not found."`; `orderError.message`; `res.error.message`; `journalError.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
```

#### Called From UI

- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13): `import { saveSalesConfirmationRates } from "@/app/(app)/_actions";`

### saveMaterialSalesEntry

```
- `saveMaterialSalesEntry` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:957)
  - DB: `select` on `raw_materials`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `insert` on `material_sales`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/accounts/material`, `/accounts/journal`
  - throws: `"Department and Raw Material ID are required for raw material sales."`; `"Bill number, client customer, and sale type are required."`; `"Quantity and price must be greater than zero."`; `"Raw material not found."`; ``Cannot sell ${quantity}. Only ${currentStock} is available in stock.``
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5): `import { saveMaterialSalesEntry, deleteMaterialSalesEntry } from "@/app/(app)/_actions";`

### deleteMaterialSalesEntry

```
- `deleteMaterialSalesEntry` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)
  - DB: `delete` on `material_sales`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/accounts/material`, `/accounts/journal`
  - throws: `"Material sale ID is required."`; ``Failed to delete material sale: ${saleErr.message}``
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

#### Called From UI

- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5): `import { saveMaterialSalesEntry, deleteMaterialSalesEntry } from "@/app/(app)/_actions";`

### confirmMultipleSalesDeliveries

```
- `confirmMultipleSalesDeliveries` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1148)
```

#### Called From UI

- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6): `import { confirmMultipleSalesDeliveries, deleteSalesOrderItem } from "@/app/(app)/_actions";`

### saveSalesOrderBillingDirect

```
- `saveSalesOrderBillingDirect` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)
  - DB: `select` on `sales_orders`
  - DB: `update` on `sales_orders`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `update` on `sales_orders`
  - DB: `delete` on `accounts_journal`
  - DB: `delete` on `accounts_journal`
  - revalidatePath: `/accounts/sales`, `/accounts/journal`, `/sales/delivery-entry`, `/accounts/sales`, `/accounts/journal`, `/sales/delivery-entry`
  - throws: `"Order IDs and Bill Number are required."`; `"Bill Value must be a non-negative amount."`; `"Selected confirmed orders not found."`; `"All selected orders must belong to the same customer to be billed together."`; `updateError.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

#### Called From UI

- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:5): `import { saveSalesOrderBillingDirect } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5): `import { saveSalesOrderBillingDirect } from "@/app/(app)/_actions";`

### approveClientOrder

```
- `approveClientOrder` [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:100)
  - DB: `select` on `client_orders`
  - DB: `insert` on `sales_orders`
  - DB: `insert` on `sales_order_items`
  - DB: `delete` on `sales_orders`
  - DB: `update` on `client_orders`
  - DB: `rpc` on `get_next_order_no`
  - revalidatePath: `/sales/client-orders`, `/sales/order-confirmation`, `/portal/dashboard`
  - throws: `"Unauthorized"`; `"Client order not found."`; `"Order is already processed."`; ``Failed to create ERP order: ${salesOrderErr.message}``; ``Failed to create ERP order items: ${itemsErr.message}``
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4): `import { approveClientOrder, cancelClientOrder } from "@/app/(app)/_actions";`

### cancelClientOrder

```
- `cancelClientOrder` [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:181)
  - DB: `update` on `client_orders`
  - revalidatePath: `/sales/client-orders`, `/portal/dashboard`
  - throws: `"Unauthorized"`; ``Failed to cancel client order: ${updateErr.message}``
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4): `import { approveClientOrder, cancelClientOrder } from "@/app/(app)/_actions";`

### createClientOrder

```
- `createClientOrder` [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:24)
  - DB: `select` on `users`
  - DB: `insert` on `client_orders`
  - DB: `insert` on `client_order_items`
  - DB: `rpc` on `next_client_order_no`
  - revalidatePath: `/portal/dashboard`
  - throws: `"Unauthorized"`; `"No items in order."`; `"Quantity must be greater than zero."`; `"Your account is not linked to a customer firm. Please contact your administrato`; ``Failed to create order: ${orderErr.message}``
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

#### Called From UI

- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:9): `import { createClientOrder } from "@/app/(app)/_actions/client-orders";`

### createClientSalesOrder

```
- `createClientSalesOrder` [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:12)
  - DB: `select` on `users`
  - DB: `insert` on `sales_orders`
  - DB: `insert` on `sales_order_items`
  - DB: `rpc` on `get_next_order_no`
  - revalidatePath: `/client/dashboard`, `/accounts/sales`
  - throws: `"Unauthorized"`; `"Your user account is not linked to any customer firm."`; `"No items in order."`; `"Quantity must be greater than zero."`; `headerError.message`
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### Called From UI

- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:11): `import { createClientSalesOrder, ClientOrderItemPayload } from "@/app/(app)/_actions/client-sales";`

## Delete Operations In Module

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:164): `await (admin.from("sales_orders") as any).delete().eq("id", salesOrder.id);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:59): `.is("deleted_at", null);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124): `export async function deleteSalesOrderItem(itemId: string) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:156): `const { error: deleteError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:158): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:160): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:170): `const { error: deleteOrderError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:172): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:174): `if (deleteOrderError) throw new Error(deleteOrderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:297): `const { error: deleteItemError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:299): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:301): `if (deleteItemError) throw new Error(deleteItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:328): `const { error: deleteItemError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:330): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:332): `if (deleteItemError) throw new Error(deleteItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:412): `const { error: deleteOrderError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:414): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:416): `if (deleteOrderError) throw new Error(deleteOrderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:618): `supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:619): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:665): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694): `export async function deleteSalesOrderCompletely(orderId: string) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:705): `throw new Error("Sales order not found or already deleted.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:735): `.is("deleted_at", null);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:741): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:744): `throw new Error("Failed to delete related journal entries: " + journalDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:750): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:753): `throw new Error("Failed to delete sales order items: " + itemsDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:758): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:761): `throw new Error("Failed to delete sales order: " + orderDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:838): `supabase.from("fabric_rolls").select("id, weight").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:839): `supabase.from("lamination_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:840): `supabase.from("offset_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:841): `supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:842): `supabase.from("roto_film_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:843): `supabase.from("roto_metallic_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:882): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:892): `.is("deleted_at", null)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1025): `.is("deleted_at", null)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1080): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089): `export async function deleteMaterialSalesEntry(formData: FormData) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1100): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1103): `if (saleErr) throw new Error(\`Failed to delete material sale: ${saleErr.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1108): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1111): `console.error(\`Failed to delete journal entries for material sale: ${journalErr.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1133): `.is("deleted_at", null);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1338): `const { error: deleteItemError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1340): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1342): `if (deleteItemError) throw new Error(deleteItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1393): `const { error: deleteOrderError } = await (supabase`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1395): `.delete()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1397): `if (deleteOrderError) throw new Error(deleteOrderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1481): `supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1482): `supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1528): `.is("deleted_at", null)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1590): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1592): `await (supabase.from("accounts_journal") as any).delete().eq("journal_no", adjJournalNo);`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:27): `.is("deleted_at", null)`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:30): `.is("deleted_at", null)`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:64): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:65): `supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:66): `supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:67): `supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:68): `supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:69): `supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:70): `selectedRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:71): `selectedRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:72): `selectedRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:73): `selectedRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:74): `selectedRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:75): `selectedRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] })`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:25): `.is("deleted_at", null)`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:38): `.is("deleted_at", null)`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:77): `supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:78): `supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:79): `supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:80): `supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:81): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:82): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:113): `uniqueRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:114): `uniqueRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:115): `uniqueRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:116): `uniqueRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:117): `uniqueRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:118): `uniqueRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:31): `supabase.from("customers").select("id, customer_name, alias").eq("status", "active").eq("is_internal", "client a/c").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:32): `supabase.from("fabric_types").select("id, fabric_name, status").is("deleted_at", null).order("fabric_name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:35): `supabase.from("lamination_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:36): `supabase.from("finishing_products").select("id, name, status").is("deleted_at", null).order("name"),`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:41): `.is("deleted_at", null)`

## Update Operations In Module

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:171): `.update({ status: "confirmed" })`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:190): `.update({ status: "cancelled" })`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:29): `? (supabase.from("sales_orders") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:151): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:276): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:320): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:338): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:351): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:359): `.update({ status: "sold", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:407): `.update({ status: "confirmed", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:529): `.update({ sales_order_id: newOrder.id })`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:539): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:598): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:655): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:681): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:724): `.update({ status: "available", updated_by: user.id })`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:797): `.update({ gst_rate: gstRate, updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:807): `.update({ price } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1297): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1330): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1348): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1361): `.update({ status: "available", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1369): `.update({ status: "sold", updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1376): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1460): `.update({`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1576): `.update({`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:219): `rollsById.set(roll.id, roll);`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:257): `rollsById.set(roll.id, roll);`

