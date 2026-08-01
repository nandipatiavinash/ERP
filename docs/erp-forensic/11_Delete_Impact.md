# 11 Delete Impact

## Delete Server Actions — Full Traces

### deactivateMaster

- Implementation: [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:68)

```
- `deactivateMaster` [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:68)
  - throws: `"Invalid module key."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `modulePermissionKey` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:121)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17): `import { saveMaster, deactivateMaster } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:68): filter column `id`

### softDeleteProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)

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

#### UI Entry Points

- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8): `import { softDeleteProduction } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73): filter column `production_entry_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73): filter column `id`

### deleteRotoFilmProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)

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

#### UI Entry Points

- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190): filter column `source_film_roll_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190): filter column `id`

### deleteRotoMetallicProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)

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

#### UI Entry Points

- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276): filter column `film_roll_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276): filter column `id`

### deleteLaminationProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)

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

#### UI Entry Points

- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8): `import { deleteLaminationProduction } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): filter column `source_lam_roll_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): filter column `source_lam_roll_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): filter column `id`

### deleteOffsetProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)

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

#### UI Entry Points

- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8): `import { deleteOffsetProduction } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530): filter column `source_offset_roll_id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530): filter column `id`

### deleteFinishingBundle

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)

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

#### UI Entry Points

- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8): `import { deleteFinishingBundle } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637): filter column `id`

### softDeleteStageProduction

- Implementation: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738)

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

#### UI Entry Points

Not found in source code.

#### Identifier Matching Evidence

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738): filter column `id`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738): filter column `id`

### deleteSalesOrderItem

- Implementation: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)

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

#### UI Entry Points

- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6): `import { confirmMultipleSalesDeliveries, deleteSalesOrderItem } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124): filter column `id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124): filter column `id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124): filter column `sales_order_id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124): filter column `id`

### deleteSalesOrderCompletely

- Implementation: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694)

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

#### UI Entry Points

- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:4): `import { deleteSalesOrderCompletely } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694): filter column `id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694): filter column `sales_order_id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694): filter column `id`

### deleteMaterialSalesEntry

- Implementation: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)

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

#### UI Entry Points

- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5): `import { saveMaterialSalesEntry, deleteMaterialSalesEntry } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089): filter column `id`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089): filter column `journal_no`

### deleteRawMaterialPurchase

- Implementation: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)

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

#### UI Entry Points

- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5): `import { deleteRawMaterialPurchase } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104): filter column `id`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104): filter column `id`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104): filter column `id`

### deleteErpUser

- Implementation: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66)

```
- `deleteErpUser` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66)
  - DB: `update` on `users`
  - revalidatePath: `/users`, `/admin/credentials`
  - throws: `"You cannot delete your own logged-in user profile."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4): `import { changeUserPassword, linkEmployeeUser, deleteErpUser } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66): filter column `id`

### deactivateRole

- Implementation: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:161)

```
- `deactivateRole` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:161)
  - DB: `delete` on `roles`
  - revalidatePath: `/roles`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4): `import { saveRoleDetails, saveRolePermissions, deactivateRole } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:161): filter column `id`

### softDeleteRawMaterialConsumption

- Implementation: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

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

#### UI Entry Points

- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79): filter column `id`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79): filter column `id`

### deactivateRotoProduct

- Implementation: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135)

```
- `deactivateRotoProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135)
  - DB: `update` on `roto_products`
  - revalidatePath: `/admin/products`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2): `import { saveRotoProduct, deactivateRotoProduct, saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6): `import { saveRotoProduct, deactivateRotoProduct } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135): filter column `id`

### deactivateOffsetProduct

- Implementation: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209)

```
- `deactivateOffsetProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209)
  - DB: `update` on `offset_products`
  - revalidatePath: `/admin/products`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6): `import { saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2): `import { saveRotoProduct, deactivateRotoProduct, saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209): filter column `id`

### deleteCatalogProduct

- Implementation: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333)

```
- `deleteCatalogProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333)
  - revalidatePath: `/admin/catalog`, `/portal/catalog`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

#### UI Entry Points

- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4): `import { saveCatalogProduct, deleteCatalogProduct } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333): filter column `id`

### softDeleteJournalEntryGroup

- Implementation: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)

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

#### UI Entry Points

- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7): `import { softDeleteJournalEntryGroup } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121): filter column `journal_no`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121): filter column `journal_no`

### clearSystemTransactions

- Implementation: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38)

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

#### UI Entry Points

- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:9): `import { clearSystemTransactions } from "@/app/(app)/_actions";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38): filter column `id`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38): filter column `is_internal`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38): filter column `customer_name`

### softDeleteJournalEntry

- Implementation: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105)

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

#### UI Entry Points

Not found in source code.

#### Identifier Matching Evidence

- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105): filter column `id`

### deleteProductPurchase

- Implementation: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)

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

#### UI Entry Points

- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5): `import { deleteProductPurchase } from "@/app/(app)/_actions/product-purchase";`

#### Identifier Matching Evidence

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `purchase_id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541): filter column `id`

## SQL ON DELETE / CASCADE / Soft Delete

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

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:545)-547: `audit_logs`

```sql
alter table public.audit_logs enable row level security;

create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1167)-1170: `attendance`

```sql
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;

-- Create unique indexes that only apply to active (non-deleted) records
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
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

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2234)-2235: `sales_order_items`

```sql
ALTER TABLE public.sales_order_items
  ADD CONSTRAINT sales_order_items_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2241)-2242: `stage_production_entries`

```sql
ALTER TABLE public.stage_production_entries
  ADD CONSTRAINT stage_production_entries_roll_id_fkey FOREIGN KEY (roll_id) REFERENCES public.fabric_rolls(id) ON DELETE CASCADE;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2248)-2249: `accounts_journal`

```sql
ALTER TABLE public.accounts_journal
  ADD CONSTRAINT accounts_journal_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.customers(id) ON DELETE CASCADE;
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

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2870)-2875: `roto_colors`

```sql
ALTER TABLE public.roto_colors
  ADD COLUMN created_by UUID REFERENCES public.users(id),
  ADD COLUMN updated_by UUID REFERENCES public.users(id),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN deleted_at TIMESTAMPTZ;
```

- [supabase/migrations/003_add_linked_customer_id.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/003_add_linked_customer_id.sql:2)-7: `customers`

```sql
ALTER TABLE public.customers ADD COLUMN linked_customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

/* Safely migrate any journal entries from suffix accounts to parent accounts
UPDATE public.accounts_journal
SET account_id = '6230c75e-3538-4585-81b0-6f2e4dc5a655', account_name = 'SREE NAGANATHA PLASTICS'
WHERE account_id = '27cbfc61-4a3f-4a3c-a59f-10329c6b1d3e';
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

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:522)-524: `audit_sales`

```sql
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();

create index idx_looms_active on public.looms (status) where deleted_at is null;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1001)-1003: `audit_role_permissions`

```sql
create trigger audit_role_permissions
after insert or delete on public.role_permissions
for each row execute function public.audit_role_permission_change();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2396)-2398: `material_sales_updates_stock`

```sql
CREATE TRIGGER material_sales_updates_stock
AFTER INSERT OR UPDATE OR DELETE ON public.material_sales
FOR EACH ROW EXECUTE FUNCTION public.apply_material_sales_stock();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2665)-2667: `metallic_roll_consumes_film`

```sql
CREATE TRIGGER metallic_roll_consumes_film
AFTER INSERT OR DELETE ON public.roto_metallic_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_roto_metallic_consumption();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2702)-2704: `lamination_roll_consumes_inputs`

```sql
CREATE TRIGGER lamination_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.lamination_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_lamination_consumption();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2737)-2739: `offset_roll_consumes_inputs`

```sql
CREATE TRIGGER offset_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.offset_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_offset_consumption();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2772)-2774: `finishing_bundle_consumes_inputs`

```sql
CREATE TRIGGER finishing_bundle_consumes_inputs
AFTER INSERT OR DELETE ON public.finishing_bundles
FOR EACH ROW EXECUTE FUNCTION public.apply_finishing_consumption();
```

## Admin

- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:28): `.is("deleted_at", null)`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:70): `.is("deleted_at", null)`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:71): `await requirePermission(\`${modulePermissionKey(moduleKey)}.delete\`);`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:79): `.delete()`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:83): `const colorsToDelete = Array.from(existingMap.keys()).filter((cid) => !selectedColorIds.includes(cid));`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:84): `if (colorsToDelete.length > 0) {`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:87): `.delete()`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:89): `.in("color_id", colorsToDelete);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:136): `await requirePermission("roto_products.delete");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:210): `await requirePermission("offset_products.delete");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333): `export async function deleteCatalogProduct(id: string, category: string) {`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:340): `.update({ deleted_at: new Date().toISOString() })`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:57): `await admin.auth.admin.deleteUser(authUserId);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66): `export async function deleteErpUser(userId: string) {`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:71): `throw new Error("You cannot delete your own logged-in user profile.");`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:76): `.update({ deleted_at: new Date().toISOString() } as any)`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:162): `await requirePermission("roles.delete");`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:168): `.delete()`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:180): `const { error: deleteError } = await (supabase.from("role_permissions") as any).delete().eq("role_id", roleId);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:181): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:104): `.is("deleted_at", null)`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:113): `.is("deleted_at", null)`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:126): `.is("deleted_at", null)`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:21): `.is("deleted_at", null)`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:26): `.is("deleted_at", null)`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:29): `.is("deleted_at", null)`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:19): `.is("deleted_at", null)`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:17): `supabase.from("users").select("*, roles(name)").is("deleted_at", null).order("full_name", { ascending: true }),`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:18): `supabase.from("roles").select("id, name").eq("is_active", true).is("deleted_at", null).order("name"),`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:19): `supabase.from("employees").select("id, user_id, employee_code, name").eq("status", "active").is("deleted_at", null).order("name"),`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:20): `supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null).order("customer_name"),`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:28): `.is("deleted_at", null)`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:30): `(supabase.from("roles") as any).select("*").eq("id", roleId).is("deleted_at", null).single(),`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:15): `supabase.from("roles").select("*").is("deleted_at", null).order("name"),`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:48): `.is("deleted_at", null)`

## Accounts

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

## Sales

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

## Inventory

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

## Production

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

## Reports

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

## Dashboard

Not found in source code.

## Portal

- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:33): `.is("deleted_at", null)`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:39): `.is("deleted_at", null)`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:51): `.is("deleted_at", null)`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:21): `.is("deleted_at", null)`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:29): `.is("deleted_at", null)`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:58): `.is("deleted_at", null)`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:65): `.is("deleted_at", null)`

## Core

- [android/build.gradle](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/build.gradle:27): `task clean(type: Delete) {`
- [android/build.gradle](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/build.gradle:28): `delete rootProject.buildDir`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:9): `The database runs on PostgreSQL (Supabase) under the \`public\` schema. Soft deletes are used across all tables via the \`deleted_at\` timestamp.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:92): `3. **Soft Delete Checks:** When creating new indexes or queries, always filter out soft-deleted records using \`WHERE deleted_at IS NULL\` to ensure active database consistency.`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:28): `timestamptz deleted_at`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:41): `timestamptz deleted_at`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:13): `- \`role_permissions\` changes are not fully audited because the existing generic audit trigger assumes a single \`id\` column and does not cover composite-key deletes.`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:55): `measure("Fetch journal entries (eq date)", supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:56): `measure("Fetch active customers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:62): `measure("Fetch materials", supabase.from("raw_materials").select("*").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:63): `measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:69): `measure("Fetch product purchases (gte date)", supabase.from("product_purchases").select("id, purchase_date, supplier_name, bill_number, total_amount, remarks, product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)").gte("purchase_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:70): `measure("Fetch active suppliers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:76): `measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:82): `measure("Fetch draft sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "draft").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:83): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").eq("order_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:89): `measure("Fetch fabric consumption entries", supabase.from("fabric_rolls").select("*, loom_production_entries(*)").eq("status", "consumed").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:95): `measure("Fetch loom production (eq date)", supabase.from("loom_production_entries").select("*, looms(*), fabric_types(*)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:101): `measure("Fetch available fabric rolls", supabase.from("fabric_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:107): `measure("Fetch lamination consumption (gte date)", supabase.from("lamination_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:113): `measure("Fetch lamination production (eq date)", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:119): `measure("Fetch available lamination rolls", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:125): `measure("Fetch offset consumption (gte date)", supabase.from("offset_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:131): `measure("Fetch offset production (eq date)", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:137): `measure("Fetch available offset rolls", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:143): `measure("Fetch finishing consumption (gte date)", supabase.from("finishing_bundles").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:149): `measure("Fetch finishing production (eq date)", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:155): `measure("Fetch available finishing bundles", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:161): `measure("Fetch roto consumption (gte date)", supabase.from("roto_film_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:167): `measure("Fetch roto production (eq date)", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:173): `measure("Fetch available roto rolls", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:179): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:185): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:191): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").gte("order_date", "2026-07-01").lte("order_date", "2026-07-14").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:197): `measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:198): `measure("Fetch sales orders basic info", supabase.from("sales_orders").select("id, status, sales_order_items(id, department, selected_roll_ids)").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:214): `measure("Fetch users", supabase.from("users").select("*, roles(name)").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:226): `measure("Fetch looms definitions", supabase.from("looms").select("*").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:232): `measure("Fetch roto colors definitions", supabase.from("roto_colors").select("*").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:238): `measure("Fetch customers list", supabase.from("customers").select("*").is("deleted_at", null).order("customer_name"))`
- [public/sw.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/sw.js:1): `(()=>{"use strict";let e,t,a,s,r,n={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"serwist",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},i=e=>[n.prefix,e,n.suffix].filter(e=>e&&e.length>0).join("-"),c={updateDetails:e=>{var t=t=>{let a=e[t];"string"==typeof a&&(n[t]=a)};for(let e of Object.keys(n))t(e)},getGoogleAnalyticsName:e=>e||i(n.googleAnalytics),getPrecacheName:e=>e||i(n.precache),getRuntimeName:e=>e||i(n.runtime)};var o=class extends Error{details;constructor(e,t){super(((e,...t)=>{let a=e;return t.length>0&&(a+=\` :: ${JSON.stringify(t)}\`),a})(e,t)),this.name=e,this.details=t}};function l(e){return new Promise(t=>setTimeout(t,e))}let h=new Set;function u(e,t){let a=new URL(e);for(let e of t)a.searchParams.delete(e);return a.href}async function d(e,t,a,s){let r=u(t.url,a);if(t.url===r)return e.match(t,s);let n={...s,ignoreSearch:!0};for(let i of(await e.keys(t,n)))if(r===u(i.url,a))return e.match(i,s)}var m=class{promise;resolve;reject;constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};let f=async()=>{for(let e of h)await e()},g="-precache-",w=async(e,t=g)=>{let a=(await self.caches.keys()).filter(a=>a.includes(t)&&a.includes(self.registration.scope)&&a!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a},p=(e,t)=>{let a=t();return e.waitUntil(a),a},y=(e,t)=>t.some(t=>e instanceof t),_=new WeakMap,x=new WeakMap,v=new WeakMap,b={get(e,t,a){if(e instanceof IDBTransaction){if("done"===t)return _.get(e);if("store"===t)return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return E(e[t])},set:(e,t,a)=>(e[t]=a,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function E(e){if(e instanceof IDBRequest){let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("success",r),e.removeEventListener("error",n)},r=()=>{t(E(e.result)),s()},n=()=>{a(e.error),s()};e.addEventListener("success",r),e.addEventListener("error",n)});return v.set(t,e),t}if(x.has(e))return x.get(e);let s=function(e){if("function"==typeof e)return(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(R(this),t),E(this.request)}:function(...t){return E(e.apply(R(this),t))};return(e instanceof IDBTransaction&&function(e){if(_.has(e))return;let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",n),e.removeEventListener("abort",n)},r=()=>{t(),s()},n=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",r),e.addEventListener("error",n),e.addEventListener("abort",n)});_.set(e,t)}(e),y(e,t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(e,b):e}(e);return s!==e&&(x.set(e,s),v.set(s,e)),s}let R=e=>v.get(e);function q(e,t,{blocked:a,upgrade:s,blocking:r,terminated:n}={}){let i=indexedDB.open(e,t),c=E(i);return s&&i.addEventListener("upgradeneeded",e=>{s(E(i.result),e.oldVersion,e.newVersion,E(i.transaction),e)}),a&&i.addEventListener("blocked",e=>a(e.oldVersion,e.newVersion,e)),c.then(e=>{n&&e.addEventListener("close",()=>n()),r&&e.addEventListener("versionchange",e=>r(e.oldVersion,e.newVersion,e))}).catch(()=>{}),c}let S=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],C=new Map;function N(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(C.get(t))return C.get(t);let a=t.replace(/FromIndex$/,""),s=t!==a,r=D.includes(a);if(!(a in(s?IDBIndex:IDBObjectStore).prototype)||!(r||S.includes(a)))return;let n=async function(e,...t){let n=this.transaction(e,r?"readwrite":"readonly"),i=n.store;return s&&(i=i.index(t.shift())),(await Promise.all([i[a](...t),r&&n.done]))[0]};return C.set(t,n),n}b=(e=>({...e,get:(t,a,s)=>N(t,a)||e.get(t,a,s),has:(t,a)=>!!N(t,a)||e.has(t,a)}))(b);let L=["continue","continuePrimaryKey","advance"],T={},A=new WeakMap,P=new WeakMap,k={get(e,t){if(!L.includes(t))return e[t];let a=T[t];return a||(a=T[t]=function(...e){A.set(this,P.get(this)[t](...e))}),a}};async function*I(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;let a=new Proxy(t,k);for(P.set(a,t),v.set(a,R(t));t;)yield a,t=await (A.get(a)||t.continue()),A.delete(a)}function U(e,t){return t===Symbol.asyncIterator&&y(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&y(e,[IDBIndex,IDBObjectStore])}b=(e=>({...e,get:(t,a,s)=>U(t,a)?I:e.get(t,a,s),has:(t,a)=>U(t,a)||e.has(t,a)}))(b);let F=async(t,a)=>{let s=null;if(t.url&&(s=new URL(t.url).origin),s!==self.location.origin)throw new o("cross-origin-copy-response",{origin:s});let r=t.clone(),n={headers:new Headers(r.headers),status:r.status,statusText:r.statusText},i=a?a(n):n,c=!function(){if(void 0===e){let t=new Response("");if("body"in t)try{new Response(t.body),e=!0}catch{e=!1}e=!1}return e}()?await r.blob():r.body;return new Response(c,i)},B="requests",K="queueName";var M=class{_db=null;async addEntry(e){let t=(await this.getDb()).transaction(B,"readwrite",{durability:"relaxed"});await t.store.add(e),await t.done}async getFirstEntryId(){return(await (await this.getDb()).transaction(B).store.openCursor())?.value.id}async getAllEntriesByQueueName(e){return await (await this.getDb()).getAllFromIndex(B,K,IDBKeyRange.only(e))||[]}async getEntryCountByQueueName(e){return(await this.getDb()).countFromIndex(B,K,IDBKeyRange.only(e))}async deleteEntry(e){await (await this.getDb()).delete(B,e)}async getFirstEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"next")}async getLastEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"prev")}async getEndEntryFromIndex(e,t){return(await (await this.getDb()).transaction(B).store.index(K).openCursor(e,t))?.value}async getDb(){return this._db||(this._db=await q("serwist-background-sync",3,{upgrade:this._upgradeDb})),this._db}_upgradeDb(e,t){t>0&&t<3&&e.objectStoreNames.contains(B)&&e.deleteObjectStore(B),e.createObjectStore(B,{autoIncrement:!0,keyPath:"id"}).createIndex(K,K,{unique:!1})}},O=class{_queueName;_queueDb;constructor(e){this._queueName=e,this._queueDb=new M}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async unshiftEntry(e){let t=await this._queueDb.getFirstEntryId();t?e.id=t-1:delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async popEntry(){return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName))}async shiftEntry(){return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName))}async getAll(){return await this._queueDb.getAllEntriesByQueueName(this._queueName)}async size(){return await this._queueDb.getEntryCountByQueueName(this._queueName)}async deleteEntry(e){await this._queueDb.deleteEntry(e)}async _removeEntry(e){return e&&await this.deleteEntry(e.id),e}};let W=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];var j=class e{_requestData;static async fromRequest(t){let a={url:t.url,headers:{}};for(let e of("GET"!==t.method&&(a.body=await t.clone().arrayBuffer()),t.headers.forEach((e,t)=>{a.headers[t]=e}),W))void 0!==t[e]&&(a[e]=t[e]);return new e(a)}constructor(e){"navigate"===e.mode&&(e.mode="same-origin"),this._requestData=e}toObject(){let e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new e(this.toObject())}};let H="serwist-background-sync",$=new Set,G=e=>{let t={request:new j(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};var Q=class{_name;_onSync;_maxRetentionTime;_queueStore;_forceSyncFallback;_syncInProgress=!1;_requestsAddedDuringSync=!1;constructor(e,{forceSyncFallback:t,onSync:a,maxRetentionTime:s}={}){if($.has(e))throw new o("duplicate-queue-name",{name:e});$.add(e),this._name=e,this._onSync=a||this.replayRequests,this._maxRetentionTime=s||10080,this._forceSyncFallback=!!t,this._queueStore=new O(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){let e=await this._queueStore.getAll(),t=Date.now(),a=[];for(let s of e){let e=60*this._maxRetentionTime*1e3;t-s.timestamp>e?await this._queueStore.deleteEntry(s.id):a.push(G(s))}return a}async size(){return await this._queueStore.size()}async _addRequest({request:e,metadata:t,timestamp:a=Date.now()},s){let r={requestData:(await j.fromRequest(e.clone())).toObject(),timestamp:a};switch(t&&(r.metadata=t),s){case"push":await this._queueStore.pushEntry(r);break;case"unshift":await this._queueStore.unshiftEntry(r)}this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){let t,a=Date.now();switch(e){case"pop":t=await this._queueStore.popEntry();break;case"shift":t=await this._queueStore.shiftEntry()}if(t){let s=60*this._maxRetentionTime*1e3;return a-t.timestamp>s?this._removeRequest(e):G(t)}}async replayRequests(){let e;for(;e=await this.shiftRequest();)try{await fetch(e.request.clone())}catch{throw await this.unshiftRequest(e),new o("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration&&!this._forceSyncFallback)try{await self.registration.sync.register(\`${H}:${this._name}\`)}catch(e){}}_addSyncListener(){"sync"in self.registration&&!this._forceSyncFallback?self.addEventListener("sync",e=>{if(e.tag===\`${H}:${this._name}\`){let t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(e){if(e instanceof Error)throw e}finally{this._requestsAddedDuringSync&&!(t&&!e.lastChance)&&await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}}):this._onSync({queue:this})}static get _queueNames(){return $}},V=class{_queue;constructor(e,t){this._queue=new Q(e,t)}async fetchDidFail({request:e}){await this._queue.pushRequest({request:e})}};let z={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};function J(e){return"string"==typeof e?new Request(e):e}var X=class{event;request;url;params;_cacheKeys={};_strategy;_handlerDeferred;_extendLifetimePromises;_plugins;_pluginStateMap;constructor(e,t){for(let a of(this.event=t.event,this.request=t.request,t.url&&(this.url=t.url,this.params=t.params),this._strategy=e,this._handlerDeferred=new m,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(a,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,a=J(e),s=await this.getPreloadResponse();if(s)return s;let r=this.hasCallback("fetchDidFail")?a.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:t})}catch(e){if(e instanceof Error)throw new o("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let n=a.clone();try{let e;for(let s of(e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await s({event:t,request:n,response:e});return e}catch(e){throw r&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:r.clone(),request:n.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),a=t.clone();return this.waitUntil(this.cachePut(e,a)),t}async cacheMatch(e){let t,a=J(e),{cacheName:s,matchOptions:r}=this._strategy,n=await this.getCacheKey(a,"read"),i={...r,cacheName:s};for(let e of(t=await caches.match(n,i),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:s,matchOptions:r,cachedResponse:t,request:n,event:this.event})||void 0;return t}async cachePut(e,t){let a=J(e);await l(0);let s=await this.getCacheKey(a,"write");if(!t)throw new o("cache-put-with-no-response",{url:new URL(String(s.url),location.href).href.replace(RegExp(\`^${location.origin}\`),"")});let r=await this._ensureResponseSafeToCache(t);if(!r)return!1;let{cacheName:n,matchOptions:i}=this._strategy,c=await self.caches.open(n),h=this.hasCallback("cacheDidUpdate"),u=h?await d(c,s.clone(),["__WB_REVISION__"],i):null;try{await c.put(s,h?r.clone():r)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await f(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:n,oldResponse:u,newResponse:r.clone(),request:s,event:this.event});return!0}async getCacheKey(e,t){let a=\`${e.url} | ${t}\`;if(!this._cacheKeys[a]){let s=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=J(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[a]=s}return this._cacheKeys[a]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let a of this.iterateCallbacks(e))await a(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let a=this._pluginStateMap.get(t),s=s=>{let r={...s,state:a};return t[e](r)};yield s}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async getPreloadResponse(){if(this.event instanceof FetchEvent&&"navigate"===this.event.request.mode&&"preloadResponse"in this.event)try{let e=await this.event.preloadResponse;if(e)return e}catch(e){return}}async _ensureResponseSafeToCache(e){let t=e,a=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,a=!0,!t)break;return!a&&t&&200!==t.status&&(t=void 0),t}},Y=class{cacheName;plugins;fetchOptions;matchOptions;constructor(e={}){this.cacheName=c.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,a="string"==typeof e.request?new Request(e.request):e.request,s=new X(this,e.url?{event:t,request:a,url:e.url,params:e.params}:{event:t,request:a}),r=this._getResponse(s,a,t);return[r,this._awaitComplete(r,s,a,t)]}async _getResponse(e,t,a){let s;await e.runCallbacks("handlerWillStart",{event:a,request:t});try{if(s=await this._handle(t,e),void 0===s||"error"===s.type)throw new o("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(let n of e.iterateCallbacks("handlerDidError"))if(void 0!==(s=await n({error:r,event:a,request:t})))break}if(!s)throw r}for(let r of e.iterateCallbacks("handlerWillRespond"))s=await r({event:a,request:t,response:s});return s}async _awaitComplete(e,t,a,s){let r,n;try{r=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:s,request:a,response:r}),await t.doneWaiting()}catch(e){e instanceof Error&&(n=e)}if(await t.runCallbacks("handlerDidComplete",{event:s,request:a,response:r,error:n}),t.destroy(),n)throw n}},Z=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s=[],r=[];if(this._networkTimeoutSeconds){let{id:n,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=n,r.push(i)}let n=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});r.push(n);let i=await t.waitUntil((async()=>await t.waitUntil(Promise.race(r))||await n)());if(!i)throw new o("no-response",{url:e.url});return i}_getTimeoutPromise({request:e,logs:t,handler:a}){let s;return{promise:new Promise(t=>{s=setTimeout(async()=>{t(await a.cacheMatch(e))},1e3*this._networkTimeoutSeconds)}),id:s}}async _getNetworkPromise({timeoutId:e,request:t,logs:a,handler:s}){let r,n;try{n=await s.fetchAndCachePut(t)}catch(e){e instanceof Error&&(r=e)}return e&&clearTimeout(e),(r||!n)&&(n=await s.cacheMatch(t)),n}},ee=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s;try{let a=[t.fetch(e)];if(this._networkTimeoutSeconds){let e=l(1e3*this._networkTimeoutSeconds);a.push(e)}if(!(s=await Promise.race(a)))throw Error(\`Timed out the network response after ${this._networkTimeoutSeconds} seconds.\`)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}};let et=e=>e&&"object"==typeof e?e:{handle:e};var ea=class{handler;match;method;catchHandler;constructor(e,t,a="GET"){this.handler=et(t),this.match=e,this.method=a}setCatchHandler(e){this.catchHandler=et(e)}},es=class e extends Y{_fallbackToNetwork;static defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e};static copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await F(e):e};constructor(t={}){t.cacheName=c.getPrecacheName(t.cacheName),super(t),this._fallbackToNetwork=!1!==t.fallbackToNetwork,this.plugins.push(e.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let a=await t.getPreloadResponse();if(a)return a;let s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let a,s=t.params||{};if(this._fallbackToNetwork){let r=s.integrity,n=e.integrity,i=!n||n===r;a=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?n||r:void 0})),r&&i&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,a.clone()))}else throw new o("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return a}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let a=await t.fetch(e);if(!await t.cachePut(e,a.clone()))throw new o("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let t=null,a=0;for(let[s,r]of this.plugins.entries())r!==e.copyRedirectedCacheableResponsesPlugin&&(r===e.defaultPrecacheCacheabilityPlugin&&(t=s),r.cacheWillUpdate&&a++);0===a?this.plugins.push(e.defaultPrecacheCacheabilityPlugin):a>1&&null!==t&&this.plugins.splice(t,1)}},er=class extends ea{_allowlist;_denylist;constructor(e,{allowlist:t=[/./],denylist:a=[]}={}){super(e=>this._match(e),e),this._allowlist=t,this._denylist=a}_match({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;let a=e.pathname+e.search;for(let e of this._denylist)if(e.test(a))return!1;return!!this._allowlist.some(e=>e.test(a))}};function*en(e,{directoryIndex:t="index.html",ignoreURLParametersMatching:a=[/^utm_/,/^fbclid$/],cleanURLs:s=!0,urlManipulation:r}={}){let n=new URL(e,location.href);n.hash="",yield n.href;let i=((e,t=[])=>{for(let a of[...e.searchParams.keys()])t.some(e=>e.test(a))&&e.searchParams.delete(a);return e})(n,a);if(yield i.href,t&&i.pathname.endsWith("/")){let e=new URL(i.href);e.pathname+=t,yield e.href}if(s){let e=new URL(i.href);e.pathname+=".html",yield e.href}if(r)for(let e of r({url:n}))yield e.href}var ei=class extends ea{constructor(e,t,a){super(({url:t})=>{let a=e.exec(t.href);if(a)return t.origin!==location.origin&&0!==a.index?void 0:a.slice(1)},t,a)}};let ec=e=>{if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:a}=e;if(!a)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}let s=new URL(a,location.href),r=new URL(a,location.href);return s.searchParams.set("__WB_REVISION__",t),{cacheKey:s.href,url:r.href}};var eo=class{updatedURLs=[];notUpdatedURLs=[];handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)};cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:a})=>{if("install"===e.type&&t?.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;a?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return a}};"undefined"!=typeof navigator&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent);let el="cache-entries",eh=e=>{let t=new URL(e,location.href);return t.hash="",t.href};var eu=class{_cacheName;_db=null;constructor(e){this._cacheName=e}_getId(e){return\`${this._cacheName}|${eh(e)}\`}_upgradeDb(e){let t=e.createObjectStore(el,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&function(e,{blocked:t}={}){let a=indexedDB.deleteDatabase(e);t&&a.addEventListener("blocked",e=>t(e.oldVersion,e)),E(a).then(()=>void 0)}(this._cacheName)}async setTimestamp(e,t){e=eh(e);let a={id:this._getId(e),cacheName:this._cacheName,url:e,timestamp:t},s=(await this.getDb()).transaction(el,"readwrite",{durability:"relaxed"});await s.store.put(a),await s.done}async getTimestamp(e){return(await (await this.getDb()).get(el,this._getId(e)))?.timestamp}async expireEntries(e,t){let a=await (await this.getDb()).transaction(el,"readwrite").store.index("timestamp").openCursor(null,"prev"),s=[],r=0;for(;a;){let n=a.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&r>=t?(a.delete(),s.push(n.url)):r++),a=await a.continue()}return s}async getDb(){return this._db||(this._db=await q("serwist-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}},ed=class{_isRunning=!1;_rerunRequested=!1;_maxEntries;_maxAgeSeconds;_matchOptions;_cacheName;_timestampModel;constructor(e,t={}){this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new eu(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;let e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),a=await self.caches.open(this._cacheName);for(let e of t)await a.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,this.expireEntries())}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(!this._maxAgeSeconds)return!1;let t=await this._timestampModel.getTimestamp(e),a=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<a}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}},em=class{_config;_cacheExpirations;constructor(e={}){var t;this._config=e,this._cacheExpirations=new Map,this._config.maxAgeFrom||(this._config.maxAgeFrom="last-fetched"),this._config.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),h.add(t))}_getCacheExpiration(e){if(e===c.getRuntimeName())throw new o("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new ed(e,this._config),this._cacheExpirations.set(e,t)),t}cachedResponseWillBeUsed({event:e,cacheName:t,request:a,cachedResponse:s}){if(!s)return null;let r=this._isResponseDateFresh(s),n=this._getCacheExpiration(t),i="last-used"===this._config.maxAgeFrom,c=(async()=>{i&&await n.updateTimestamp(a.url),await n.expireEntries()})();try{e.waitUntil(c)}catch{}return r?s:null}_isResponseDateFresh(e){if("last-used"===this._config.maxAgeFrom)return!0;let t=Date.now();if(!this._config.maxAgeSeconds)return!0;let a=this._getDateHeaderTimestamp(e);return null===a||a>=t-1e3*this._config.maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;let t=new Date(e.headers.get("date")).getTime();return Number.isNaN(t)?null:t}async cacheDidUpdate({cacheName:e,request:t}){let a=this._getCacheExpiration(e);await a.updateTimestamp(t.url),await a.expireEntries()}async deleteCacheAndMetadata(){for(let[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}};let ef=async(e,t)=>{try{if(206===t.status)return t;let a=e.headers.get("range");if(!a)throw new o("no-range-header");let s=(e=>{let t=e.trim().toLowerCase();if(!t.startsWith("bytes="))throw new o("unit-must-be-bytes",{normalizedRangeHeader:t});if(t.includes(","))throw new o("single-range-only",{normalizedRangeHeader:t});let a=/(\d*)-(\d*)/.exec(t);if(!a||!(a[1]||a[2]))throw new o("invalid-range-values",{normalizedRangeHeader:t});return{start:""===a[1]?void 0:Number(a[1]),end:""===a[2]?void 0:Number(a[2])}})(a),r=await t.blob(),n=((e,t,a)=>{let s,r,n=e.size;if(a&&a>n||t&&t<0)throw new o("range-not-satisfiable",{size:n,end:a,start:t});return void 0!==t&&void 0!==a?(s=t,r=a+1):void 0!==t&&void 0===a?(s=t,r=n):void 0!==a&&void 0===t&&(s=n-a,r=n),{start:s,end:r}})(r,s.start,s.end),i=r.slice(n.start,n.end),c=i.size,l=new Response(i,{status:206,statusText:"Partial Content",headers:t.headers});return l.headers.set("Content-Length",String(c)),l.headers.set("Content-Range",\`bytes ${n.start}-${n.end-1}/${r.size}\`),l}catch(e){return new Response("",{status:416,statusText:"Range Not Satisfiable"})}};var eg=class{cachedResponseWillBeUsed=async({request:e,cachedResponse:t})=>t&&e.headers.has("range")?await ef(e,t):t},ew=class extends Y{async _handle(e,t){let a,s=await t.cacheMatch(e);if(s);else try{s=await t.fetchAndCachePut(e)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}},ep=class extends Y{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z)}async _handle(e,t){let a,s=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(s);let r=await t.cacheMatch(e);if(r);else try{r=await s}catch(e){e instanceof Error&&(a=e)}if(!r)throw new o("no-response",{url:e.url,error:a});return r}};let ey={rscPrefetch:"pages-rsc-prefetch",rsc:"pages-rsc",html:"pages"},e_=[{matcher:/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,handler:new ew({cacheName:"google-fonts-webfonts",plugins:[new em({maxEntries:4,maxAgeSeconds:31536e3,maxAgeFrom:"last-used"})]})},{matcher:/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,handler:new ep({cacheName:"google-fonts-stylesheets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,handler:new ep({cacheName:"static-font-assets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,handler:new ep({cacheName:"static-image-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:2592e3,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/static.+\.js$/i,handler:new ew({cacheName:"next-static-js-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/image\?url=.+$/i,handler:new ep({cacheName:"next-image",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:mp3|wav|ogg)$/i,handler:new ew({cacheName:"static-audio-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:mp4|webm)$/i,handler:new ew({cacheName:"static-video-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:js)$/i,handler:new ep({cacheName:"static-js-assets",plugins:[new em({maxEntries:48,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:css|less)$/i,handler:new ep({cacheName:"static-style-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/data\/.+\/.+\.json$/i,handler:new Z({cacheName:"next-data",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:json|xml|csv)$/i,handler:new Z({cacheName:"static-data-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/api\/auth\/.*/,handler:new ee({networkTimeoutSeconds:10})},{matcher:({sameOrigin:e,url:{pathname:t}})=>e&&t.startsWith("/api/"),method:"GET",handler:new Z({cacheName:"apis",plugins:[new em({maxEntries:16,maxAgeSeconds:86400,maxAgeFrom:"last-used"})],networkTimeoutSeconds:10})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rscPrefetch,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rsc,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>e.headers.get("Content-Type")?.includes("text/html")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.html,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({url:{pathname:e},sameOrigin:t})=>t&&!e.startsWith("/api/"),handler:new Z({cacheName:"others",plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({sameOrigin:e})=>!e,handler:new Z({cacheName:"cross-origin",plugins:[new em({maxEntries:32,maxAgeSeconds:3600})],networkTimeoutSeconds:10})},{matcher:/.*/i,method:"GET",handler:new ee}],ex=async(e,t,a)=>{let s=t.map((e,t)=>({index:t,item:e})),r=async e=>{let t=[];for(;;){let r=s.pop();if(!r)return e(t);let n=await a(r.item);t.push({result:n,index:r.index})}},n=Array.from({length:e},()=>new Promise(r));return(await Promise.all(n)).flat().sort((e,t)=>e.index<t.index?-1:1).map(e=>e.result)};var ev=class{_precacheController;constructor({precacheController:e}){this._precacheController=e}cacheKeyWillBeUsed=async({request:e,params:t})=>{let a=t?.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return a?new Request(a,{headers:e.headers}):e}},eb=class{_installAndActiveListenersAdded;_concurrentPrecaching;_strategy;_urlsToCacheKeys=new Map;_urlsToCacheModes=new Map;_cacheKeysToIntegrities=new Map;constructor({cacheName:e,plugins:t=[],fallbackToNetwork:a=!0,concurrentPrecaching:s=1}={}){this._concurrentPrecaching=s,this._strategy=new es({cacheName:c.getPrecacheName(e),plugins:[...t,new ev({precacheController:this})],fallbackToNetwork:a}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let a of e){"string"==typeof a?t.push(a):a&&!a.integrity&&void 0===a.revision&&t.push(a.url);let{cacheKey:e,url:s}=ec(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(s)&&this._urlsToCacheKeys.get(s)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(s),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:s});this._cacheKeysToIntegrities.set(e,a.integrity)}this._urlsToCacheKeys.set(s,e),this._urlsToCacheModes.set(s,r),t.length>0&&console.warn(\`Serwist is precaching URLs without revision info: ${t.join(", ")}`
- [public/sw.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/sw.js:2): `This is generally NOT safe. Learn more at https://bit.ly/wb-precache\`)}}install(e){return p(e,async()=>{let t=new eo;this.strategy.plugins.push(t),await ex(this._concurrentPrecaching,Array.from(this._urlsToCacheKeys.entries()),async([t,a])=>{let s=this._cacheKeysToIntegrities.get(a),r=this._urlsToCacheModes.get(t),n=new Request(t,{integrity:s,cache:r,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({event:e,request:n,url:new URL(n.url),params:{cacheKey:a}}))});let{updatedURLs:a,notUpdatedURLs:s}=t;return{updatedURLs:a,notUpdatedURLs:s}})}activate(e){return p(e,async()=>{let e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),a=new Set(this._urlsToCacheKeys.values()),s=[];for(let r of t)a.has(r.url)||(await e.delete(r),s.push(r.url));return{deletedCacheRequests:s}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,a=this.getCacheKeyForURL(t);if(a)return(await self.caches.open(this.strategy.cacheName)).match(a)}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new o("non-precached-url",{url:e});return a=>(a.request=new Request(e),a.params={cacheKey:t,...a.params},this.strategy.handle(a))}};let eE=()=>(s||(s=new eb),s);var eR=class extends ea{constructor(e,t){super(({request:a})=>{let s=e.getURLsToCacheKeys();for(let r of en(a.url,t)){let t=s.get(r);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}},e.strategy)}},eq=class{_routes;_defaultHandlerMap;_fetchListenerHandler=null;_cacheListenerHandler=null;_catchHandler;constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){this._fetchListenerHandler||(this._fetchListenerHandler=e=>{let{request:t}=e,a=this.handleRequest({request:t,event:e});a&&e.respondWith(a)},self.addEventListener("fetch",this._fetchListenerHandler))}removeFetchListener(){this._fetchListenerHandler&&(self.removeEventListener("fetch",this._fetchListenerHandler),this._fetchListenerHandler=null)}addCacheListener(){this._cacheListenerHandler||(this._cacheListenerHandler=e=>{if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,a=Promise.all(t.urlsToCache.map(t=>{"string"==typeof t&&(t=[t]);let a=new Request(...t);return this.handleRequest({request:a,event:e})}));e.waitUntil(a),e.ports?.[0]&&a.then(()=>e.ports[0].postMessage(!0))}},self.addEventListener("message",this._cacheListenerHandler))}removeCacheListener(){this._cacheListenerHandler&&self.removeEventListener("message",this._cacheListenerHandler)}handleRequest({request:e,event:t}){let a,s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;let r=s.origin===location.origin,{params:n,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:r,url:s}),c=i?.handler,o=e.method;if(!c&&this._defaultHandlerMap.has(o)&&(c=this._defaultHandlerMap.get(o)),!c)return;try{a=c.handle({url:s,request:e,event:t,params:n})}catch(e){a=Promise.reject(e)}let l=i?.catchHandler;return a instanceof Promise&&(this._catchHandler||l)&&(a=a.catch(async a=>{if(l)try{return await l.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a})),a}findMatchingRoute({url:e,sameOrigin:t,request:a,event:s}){for(let r of this._routes.get(a.method)||[]){let n,i=r.match({url:e,sameOrigin:t,request:a,event:s});if(i)return Array.isArray(n=i)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length?n=void 0:"boolean"==typeof i&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,et(e))}setCatchHandler(e){this._catchHandler=et(e)}registerCapture(e,t,a){let s=((e,t,a)=>{if("string"==typeof e){let s=new URL(e,location.href);return new ea(({url:e})=>e.href===s.href,t,a)}if(e instanceof RegExp)return new ei(e,t,a);if("function"==typeof e)return new ea(e,t,a);if(e instanceof ea)return e;throw new o("unsupported-route-type",{moduleName:"serwist",funcName:"parseRoute",paramName:"capture"})})(e,t,a);return this.registerRoute(s),s}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new o("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new o("unregister-route-route-not-registered")}};let eS=()=>(r||((r=new eq).addFetchListener(),r.addCacheListener()),r),eD=(e,t,a)=>eS().registerCapture(e,t,a);var eC=class{_fallbackUrls;_precacheController;constructor({fallbackUrls:e,precacheController:t}){this._fallbackUrls=e,this._precacheController=t||eE()}async handlerDidError(e){for(let t of this._fallbackUrls)if("string"==typeof t){let e=await this._precacheController.matchPrecache(t);if(void 0!==e)return e}else if(t.matcher(e)){let e=await this._precacheController.matchPrecache(t.url);if(void 0!==e)return e}}};let eN=/^\/(\w+\/)?collect/,eL=({router:e=eS(),cacheName:t,...a}={})=>{let s=c.getGoogleAnalyticsName(t),r=new V("serwist-google-analytics",{maxRetentionTime:2880,onSync:(e=>async({queue:t})=>{let a;for(;a=await t.shiftRequest();){let{request:s,timestamp:r}=a,n=new URL(s.url);try{let t="POST"===s.method?new URLSearchParams(await s.clone().text()):n.searchParams,a=r-(Number(t.get("qt"))||0),i=Date.now()-a;if(t.set("qt",String(i)),e.parameterOverrides)for(let a of Object.keys(e.parameterOverrides)){let s=e.parameterOverrides[a];t.set(a,s)}"function"==typeof e.hitFilter&&e.hitFilter.call(null,t),await fetch(new Request(n.origin+n.pathname,{body:t.toString(),method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}}))}catch(e){throw await t.unshiftRequest(a),e}}})(a)});for(let t of[new ea(({url:e})=>"www.googletagmanager.com"===e.hostname&&"/gtm.js"===e.pathname,new Z({cacheName:s}),"GET"),new ea(({url:e})=>"www.google-analytics.com"===e.hostname&&"/analytics.js"===e.pathname,new Z({cacheName:s}),"GET"),new ea(({url:e})=>"www.googletagmanager.com"===e.hostname&&"/gtag/js"===e.pathname,new Z({cacheName:s}),"GET"),...(e=>{let t=({url:e})=>"www.google-analytics.com"===e.hostname&&eN.test(e.pathname),a=new ee({plugins:[e]});return[new ea(t,a,"GET"),new ea(t,a,"POST")]})(r)])e.registerRoute(t)};(({precacheController:e=eE(),router:t=eS(),precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o,skipWaiting:l,importScripts:h,navigationPreload:u=!1,cacheId:d,clientsClaim:m=!1,runtimeCaching:f,offlineAnalyticsConfig:g,disableDevLogs:p=!1,fallbacks:y})=>{h&&h.length>0&&self.importScripts(...h),u&&self.registration?.navigationPreload&&self.addEventListener("activate",e=>{e.waitUntil(self.registration.navigationPreload.enable().then(()=>{}))}),void 0!==d&&c.updateDetails({prefix:d}),l?self.skipWaiting():self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),m&&self.addEventListener("activate",()=>self.clients.claim()),(({precacheController:e=eE(),router:t=eS(),precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r=!1,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o})=>{a&&a.length>0&&(e.precache(a),t.registerRoute(new eR(e,s)),r&&self.addEventListener("activate",e=>{e.waitUntil(w(c.getPrecacheName(void 0)).then(e=>{}))}),n&&t.registerRoute(new er(eE().createHandlerBoundToURL(n),{allowlist:i,denylist:o})))})({precacheController:e,router:t,precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o}),void 0!==f&&(void 0!==y&&(f=(({precacheController:e=eE(),router:t=eS(),runtimeCaching:a,entries:s,precacheOptions:r})=>{e.precache(s),t.registerRoute(new eR(e,r));let n=new eC({fallbackUrls:s});return a.forEach(e=>{e.handler instanceof Y&&!e.handler.plugins.some(e=>"handlerDidError"in e)&&e.handler.plugins.push(n)}),a})({precacheController:e,router:t,runtimeCaching:f,entries:y.entries,precacheOptions:s})),((...e)=>{for(let t of e)eD(t.matcher,t.handler,t.method)})(...f)),void 0!==g&&("boolean"==typeof g?g&&eL({router:t}):eL({...g,router:t})),p&&(self.__WB_DISABLE_DEV_LOGS=!0)})({precacheEntries:[{'revision':'623b32321486592f52bda9e30ea5ebea','url':'/_next/static/9S9loD8x9ibLu6bI6ene3/_buildManifest.js'},{'revision':'b6652df95db52feb4daf4eca35380933','url':'/_next/static/9S9loD8x9ibLu6bI6ene3/_ssgManifest.js'},{'revision':null,'url':'/_next/static/chunks/1020-5ff7b4f777a9e136.js'},{'revision':null,'url':'/_next/static/chunks/1431.51ef738101c21ea0.js'},{'revision':null,'url':'/_next/static/chunks/1646.a93085a0445ba909.js'},{'revision':null,'url':'/_next/static/chunks/1697-06cd08d15b6a0995.js'},{'revision':null,'url':'/_next/static/chunks/2002-67e987608bfa78f1.js'},{'revision':null,'url':'/_next/static/chunks/2619-04bc32f026a0d946.js'},{'revision':null,'url':'/_next/static/chunks/2888-0d8a8c8d145e66b8.js'},{'revision':null,'url':'/_next/static/chunks/2968-acc89585f20bea2c.js'},{'revision':null,'url':'/_next/static/chunks/3589.59f27e8dc8750dca.js'},{'revision':null,'url':'/_next/static/chunks/3618-2e527ebb6089cf17.js'},{'revision':null,'url':'/_next/static/chunks/4909-1f5c586e3e84e0a5.js'},{'revision':null,'url':'/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js'},{'revision':null,'url':'/_next/static/chunks/5098-0bc6036abd41ee66.js'},{'revision':null,'url':'/_next/static/chunks/5139.e4ff9cc3669129ed.js'},{'revision':null,'url':'/_next/static/chunks/5420-f91358e5f7e6687d.js'},{'revision':null,'url':'/_next/static/chunks/7554-882dcbfa2164f7b0.js'},{'revision':null,'url':'/_next/static/chunks/8055-37171439b1d20baa.js'},{'revision':null,'url':'/_next/static/chunks/8242-28bfceca61fdd34b.js'},{'revision':null,'url':'/_next/static/chunks/8977-7f212576213da9be.js'},{'revision':null,'url':'/_next/static/chunks/9951-86ea5a104991b4be.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/403/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/journal/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/journal/page-0b22ef7535600d61.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/material/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/material/page-27eca84001b7da7f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/product-purchase/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/product-purchase/page-c7a5b26b6310608d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/purchase/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/purchase/page-d01f660b00180d86.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/sales/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/sales/page-848b23eb641e5c63.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/attendance/page-499fd85f00e01665.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/catalog/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/catalog/page-bebf67f45085b182.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/%5Bid%5D/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/colors/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/credentials/page-f8e0c7348d6a893d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/critical-levels/page-499fd85f00e01665.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/employees/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/looms/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/permissions/%5Bid%5D/page-1955ae436e707db9.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/permissions/page-e66530762ae7555d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/products/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/products/page-14f5644b6936bfef.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/raw-materials/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/reset/page-388ec9a2bcbf81fe.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/catalog/page-5a2201b9acc108dd.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/dashboard/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/layout-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/dashboard/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/dashboard/page-a4a2ad96f1f0380e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/consumption/page-e724f8603566f4c4.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/production/page-be7196f076a959df.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/%5Bid%5D/page-d1c834fbb1a740e3.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/page-249955207d1ff629.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/consumption/page-29f89e25be515d24.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/production/page-eb87c9223016ea4e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/%5Bid%5D/page-b79ec3651bea9c38.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/consumption/page-62fb92fbd78bd7b3.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/production/page-7f54be204e9be0bb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/%5Bid%5D/page-f2f50a59949e2625.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/layout-595b8b6927a2f5cb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/consumption/page-43526610c2a4795f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/production/page-4bfc56a2287e47bb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/%5Bid%5D/page-74a31ce7079a208d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/page-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/accounts/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/accounts/page-c8c9ff7581d40f07.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/balance-sheet/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/balance-sheet/page-b331f13d77c78931.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/closing-stock/page-5b80245e51a1e12f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/opening-balance/page-597dc253decc4e5c.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/page-79cb075f5843bc7f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/profit-loss/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/profit-loss/page-647edb19b8b7a692.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/sales-confirmation/page-5cfe217341b08972.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/stock/page-8f6bfb3917c7b86e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/%5Bid%5D/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/%5Bid%5D/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/consumption/page-5b0f2437a8a93e87.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/production/page-0cd903acfc57b772.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/%5Bid%5D/page-7414af66d6cf5519.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/client-orders/page-3a2922842a78a41c.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/delivery-entry/%5Bid%5D/page-74e4c1d8daecfe9f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/delivery-entry/page-6ae95ccd5f189d69.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/order-confirmation/page-8ed1de11d55a6cfc.js'},{'revision':null,'url':'/_next/static/chunks/app/(auth)/login/page-100d3f2f36e58914.js'},{'revision':null,'url':'/_next/static/chunks/app/(auth)/reset-password/page-fdfc9120438d5729.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/layout-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/portal/catalog/page-886735c531e3ac6a.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/portal/dashboard/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/_not-found/page-f1aac92804bc871d.js'},{'revision':null,'url':'/_next/static/chunks/app/layout-64f615344c22a375.js'},{'revision':null,'url':'/_next/static/chunks/app/manifest.webmanifest/route-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/framework-32492dd9c4fc5870.js'},{'revision':null,'url':'/_next/static/chunks/main-9a194f53e64bb328.js'},{'revision':null,'url':'/_next/static/chunks/main-app-47c905d08f0ff666.js'},{'revision':null,'url':'/_next/static/chunks/pages/_app-e8b861c87f6f033c.js'},{'revision':null,'url':'/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js'},{'revision':'846118c33b2c0e922d7b3a7676f81f6f','url':'/_next/static/chunks/polyfills-42372ed130431b0a.js'},{'revision':null,'url':'/_next/static/chunks/webpack-6c1142457ce95edb.js'},{'revision':null,'url':'/_next/static/css/ef3a256e6f42218f.css'},{'revision':'9dda5cfc9a46f256d0e131bb535e46f8','url':'/_next/static/media/19cfc7226ec3afaa-s.woff2'},{'revision':'4e2553027f1d60eff32898367dd4d541','url':'/_next/static/media/21350d82a1f187e9-s.woff2'},{'revision':'01ba6c2a184b8cba08b0d57167664d75','url':'/_next/static/media/8e9860b6e62d6359-s.woff2'},{'revision':'9e494903d6b0ffec1a1e14d34427d44d','url':'/_next/static/media/ba9851c3c22cd980-s.woff2'},{'revision':'027a89e9ab733a145db70f09b8a18b42','url':'/_next/static/media/c5fe6dc8356a8c31-s.woff2'},{'revision':'d54db44de5ccb18886ece2fda72bdfe0','url':'/_next/static/media/df0a9ae256c0569c-s.woff2'},{'revision':'65850a373e258f1c897a2b3d75eb74de','url':'/_next/static/media/e4af272ccee01ff0-s.p.woff2'},{'revision':'7ff707cde001ee7286b4224898f59dc9','url':'/rk-global-circular.png'},{'revision':'bf3457cbfe4c8ce1f9823f5abf08364c','url':'/rk-global-logo.svg'}],skipWaiting:!0,clientsClaim:!0,navigationPreload:!0,runtimeCaching:e_})})();`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:33): `.delete()`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:34): `.neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:37): `console.error("Failed to delete fabric rolls:", rollsError);`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:45): `.delete()`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:46): `.neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:49): `console.error("Failed to delete production entries:", prodError);`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:18): `.is("deleted_at", null)`
- [scratch/check-has-permission.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-has-permission.mjs:21): `// 1. 47a6974: feat: replace Delete with Deactivate in master-page actions, and add numbered pagination buttons at bottom`
- [scratch/check-materials.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-materials.mjs:22): `.is("deleted_at", null)`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:43): `.is("deleted_at", null)`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:74): `.is("deleted_at", null);`
- [scratch/check-rolls-status.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rolls-status.mjs:21): `.select("id, roll_number, status, deleted_at")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:14): `.is("deleted_at", null)`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:44): `.is("deleted_at", null);`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:14): `.is("deleted_at", null)`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:33): `.delete()`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:34): `.neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all rows`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:43): `// 2. Fetch journal entry numbers to delete`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:62): `.delete()`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:68): `// 3. Delete Sales Order Items (cascaded by DB but let's delete explicitly to be safe)`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:72): `.delete()`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:73): `.neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:76): `// 4. Delete Sales Orders`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:80): `.delete()`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:81): `.neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:84): `console.log("🎉 Successfully cleared all sales entries, reset roll allocations, and deleted matching double-entry bookkeeping lines!");`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:27): `.is("deleted_at", null)`
- [scratch/diagnose-login-error.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/diagnose-login-error.mjs:58): `.select("id, status, deleted_at, roles(name, is_active, deleted_at)")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:60): `.is("deleted_at", null);`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:66): `.is("deleted_at", null);`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:21): `console.log("Checking raw_material_purchases (including deleted) for bill_number = '73'...");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:33): `console.log("Checking raw_material_purchases (including deleted) for bill_number like '%73%'...");`
- [scratch/inspect_sv_polytech_rows.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sv_polytech_rows.mjs:24): `.select("id, customer_name, deleted_at, status")`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:31): `.is("deleted_at", null);`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:28): `.select("id, order_number, order_date, status, bill_number, bill_value, is_draft_billing, deleted_at")`
- [scratch/list_recent_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_recent_purchases.mjs:25): `.is("deleted_at", null)`
- [scratch/list-users.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users.mjs:12): `.is("deleted_at", null);`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:54): `.is("deleted_at", null);`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:64): `console.log(\`- Deleted At: ${ft.deleted_at}\`);`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:27): `.is("deleted_at", null);`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:64): `.is("deleted_at", null)`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:80): `.is("deleted_at", null)`
- [scratch/squash-migrations.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/squash-migrations.mjs:38): `// Delete the other migration files`
- [scratch/squash-migrations.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/squash-migrations.mjs:43): `console.log(\`Deleted legacy file: ${file}\`);`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:24): `.is("deleted_at", null);`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:82): `await supabase.from("employees").delete().eq("id", empId);`

