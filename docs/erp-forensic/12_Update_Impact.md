# 12 Update Impact

## Update Server Actions — Full Traces

### checkInAttendance

```
- `checkInAttendance` [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:15)
  - DB: `select` on `attendance`
  - DB: `update` on `attendance`
  - DB: `insert` on `attendance`
  - revalidatePath: `/attendance`, `/dashboard`
  - throws: `"Unable to verify today's attendance."`; `"This employee is already checked in today."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `assertAttendanceAccess` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:131)
    - DB: `select` on `employees`
    - throws: `"Unable to verify employee attendance access."`; `"You can only manage your own attendance."`
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
```

- Fields/status throws: `"Unable to verify today's attendance."`; `"This employee is already checked in today."`; `error.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`; `"Unable to verify employee attendance access."`; `"You can only manage your own attendance."`

### checkOutAttendance

```
- `checkOutAttendance` [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:57)
  - DB: `select` on `attendance`
  - DB: `update` on `attendance`
  - revalidatePath: `/attendance`, `/dashboard`
  - throws: `readError.message`; `"Check in before checking out."`; `"This employee is already checked out today."`; `"Check out time must be after check in time."`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `assertAttendanceAccess` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:131)
    - DB: `select` on `employees`
    - throws: `"Unable to verify employee attendance access."`; `"You can only manage your own attendance."`
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
```

- Fields/status throws: `readError.message`; `"Check in before checking out."`; `"This employee is already checked out today."`; `"Check out time must be after check in time."`; `error.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`; `"Unable to verify employee attendance access."`; `"You can only manage your own attendance."`

### linkEmployeeUser

```
- `linkEmployeeUser` [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:87)
  - DB: `update` on `employees`
  - DB: `update` on `employees`
  - revalidatePath: `/users`, `/employees`, `/attendance`
  - throws: `"You need employee edit permission to link users to employees."`; `"Unable to update employee link."`; `"Unable to link employee to user."`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Fields/status throws: `"You need employee edit permission to link users to employee`; `"Unable to update employee link."`; `"Unable to link employee to user."`; `parsed.error.issues[0]?.message ?? "Invalid form data."`

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

- Fields/status throws: `error.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Invalid production parameters."`; `"Film type must be gloss or matt."`; `"Brand not found."`; `insertError.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Invalid parameters."`; `"Source film roll not found."`; `insertError.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Invalid parameters."`; `"Fabric type not found."`; ``Brand is required for lamination type ${lamType}.``; `insertError.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Invalid parameters."`; `"Offset brand not found."`; `"Source fabric type is required."`; `"Source fabric type not found."`; `insertError.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Invalid parameters."`; `"Fabric Type is required."`; `"Fabric type not found."`; `"Lamination Roll is required."`; `"Lamination roll not found."`; `"Offset Roll is required."`; `"Offset roll not found."`; `"Unsupported finishing type."`

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

- Fields/status throws: `"Missing required production entry fields."`; `error.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `error.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`

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

- Fields/status throws: `"Order ID and Bill Number are required."`; `"Bill Value must be a non-negative amount."`; `"Sales order not found."`; `"Order is not in draft billing state."`; `updateError.message`; `journalError.message`; `updateError.message`

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

- Fields/status throws: `orderFetchError?.message || "Order not found."`; `orderError.message`; `res.error.message`; `journalError.message`

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

- Fields/status throws: `"Department and Raw Material ID are required for raw materia`; `"Bill number, client customer, and sale type are required."`; `"Quantity and price must be greater than zero."`; `"Raw material not found."`; ``Cannot sell ${quantity}. Only ${currentStock} is available `; `"Customer not found."`; ``Failed to create journal entries: ${journalErr.message}``; ``Failed to save material sale: ${saleErr.message}``

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

- Fields/status throws: `"Order IDs and Bill Number are required."`; `"Bill Value must be a non-negative amount."`; `"Selected confirmed orders not found."`; `"All selected orders must belong to the same customer to be `; `updateError.message`; `journalError.message`; `updateError.message`

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

- Fields/status throws: `"Purchase date, client, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one raw material item must be added."`; `"Every purchase item must have a material, positive quantity`; `error.message`

### changeUserPassword

```
- `changeUserPassword` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:85)
  - DB: `update` on `users`
  - revalidatePath: `/admin/credentials`
  - throws: `"User ID and new password are required."`; `"Password must be at least 8 characters long."`; `"Failed to update password in Auth: " + authError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Fields/status throws: `"User ID and new password are required."`; `"Password must be at least 8 characters long."`; `"Failed to update password in Auth: " + authError.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

### saveRoleDetails

```
- `saveRoleDetails` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:139)
  - DB: `update` on `roles`
  - revalidatePath: `/roles`, `/admin/permissions`, `/admin/permissions/${roleId}`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Fields/status throws: `error.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`

### saveRolePermissions

```
- `saveRolePermissions` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:174)
  - DB: `delete` on `role_permissions`
  - DB: `insert` on `role_permissions`
  - revalidatePath: `/roles`, `/admin/permissions`, `/admin/permissions/${roleId}`
  - throws: `deleteError.message`; `insertError.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Fields/status throws: `deleteError.message`; `insertError.message`; `parsed.error.issues[0]?.message ?? "Invalid form data."`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `"Missing required consumption fields or invalid quantity."`; `"Quantity must be a multiple of 25."`; `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `"Roll ID is required."`; `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

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

- Fields/status throws: `error.message`

### saveRotoProduct

```
- `saveRotoProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:8)
  - DB: `access` on `products`
  - DB: `access` on `products`
  - DB: `update` on `roto_products`
  - DB: `insert` on `roto_products`
  - DB: `select` on `roto_product_colors`
  - DB: `delete` on `roto_product_colors`
  - DB: `access` on `products`
  - DB: `access` on `products`
  - DB: `upsert` on `roto_product_colors`
  - revalidatePath: `/admin/products`
  - throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Fields/status throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`; `error.message`; `"Color image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`

### saveOffsetProduct

```
- `saveOffsetProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:147)
  - DB: `access` on `products`
  - DB: `access` on `products`
  - DB: `update` on `offset_products`
  - DB: `insert` on `offset_products`
  - revalidatePath: `/admin/products`
  - throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Fields/status throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

### saveCatalogProduct

```
- `saveCatalogProduct` [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:221)
  - DB: `access` on `products`
  - DB: `access` on `products`
  - DB: `update` on `fabric_types`
  - DB: `insert` on `fabric_types`
  - DB: `update` on `finishing_products`
  - DB: `insert` on `finishing_products`
  - revalidatePath: `/admin/catalog`, `/portal/catalog`
  - throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Fields/status throws: `"Image file must be 5 MB or smaller."`; `"Only JPEG, PNG, WebP, or GIF images are allowed."`; `"Invalid image file extension."`; ``Image upload failed: ${uploadError.message}``; `error.message`; `error.message`; `error.message`; `error.message`

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

- Fields/status throws: `"Missing required journal fields."`; `"At least 2 rows are required for a journal entry."`; `"Account name is required on all rows."`; `"A row cannot contain both Debit and Credit."`; `"Either Debit or Credit must be entered on all rows."`; `"Amount must be positive."`; `"Amount must be positive."`; `"Total Debit must be equal to Total Credit before submitting`

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

- Fields/status throws: `"Account ID is required."`; `"Opening values cannot be negative."`; `error.message`

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

- Fields/status throws: `error.message`; `error.message`

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

- Fields/status throws: `error.message`; `error.message`

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

- Fields/status throws: `"Unauthorized"`; `"Client order not found."`; `"Order is already processed."`; ``Failed to create ERP order: ${salesOrderErr.message}``; ``Failed to create ERP order items: ${itemsErr.message}``; ``Failed to update client order status: ${updateErr.message}``; `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUP`

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

- Fields/status throws: `"Purchase date, supplier, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one purchase item must be added."`; `headerError?.message || "Failed to create product purchase r`; ``Fabric roll stock insert failed: ${stockErr.message}``; ``Roto film roll stock insert failed: ${stockErr.message}``; ``Roto dummy film roll stock insert failed: ${filmErr?.messag`; ``Roto metallic roll stock insert failed: ${stockErr.message}`

## Status Transition Evidence

- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:13): `* **\`users\`**: System user profiles linked to Supabase auth IDs. Stores \`id\`, \`email\`, \`full_name\`, \`role_id\`, and \`status\`.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:17): `* **\`looms\`**: Loom machinery details (\`loom_number\`, \`status\`, \`notes\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:18): `* **\`fabric_types\`**: Templates defining different fabric parameters (\`fabric_name\`, \`width\`, \`gsm\`, \`avg_weight_per_meter\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:19): `* **\`fabric_rolls\`**: Inventory tracking for individual fabric rolls (\`roll_number\`, \`fabric_type_id\`, \`weight\`, \`meters\`, \`status\` [available, allocated, dispatched], \`production_date\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:24): `* **\`attendance\`**: Daily clock-in/out logs (\`employee_id\`, \`attendance_date\`, \`check_in\`, \`check_out\`, \`check_in_at\`, \`check_out_at\`, \`working_hours\`, \`overtime_hours\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:28): `- Columns: \`id\`, \`customer_name\`, \`alias\`, \`gst_number\`, \`address\`, \`status\`, \`is_internal\` (\`client a/c\`, \`profit and loss a/c\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:29): `* **\`sales_orders\`**: Sales orders and confirmed deliveries (\`order_number\`, \`customer_id\`, \`order_date\`, \`status\` [pending, confirmed], \`bill_number\`, \`bill_value\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:31): `* **\`raw_materials\`**: Catalog of raw materials (\`material_name\`, \`unit\`, \`opening_stock\`, \`current_stock\`, \`critical_level\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:56): `## 3. Completed Performance & Schema Optimizations`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:76): `- \`idx_raw_materials_name\` / \`idx_employees_name\` (non-composite indexes to optimize name-based sorts when \`status\` is not filtered).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:77): `- \`idx_sales_orders_billing_status_date\` (Sales Entry page filter queries).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:85): `* **Data Safety:** An update query was executed during migration \`024\` to automatically map and backpopulate existing journal rows based on their text name strings matching active customer records.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:92): `3. **Soft Delete Checks:** When creating new indexes or queries, always filter out soft-deleted records using \`WHERE deleted_at IS NULL\` to ensure active database consistency.`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:27): `boolean is_active`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:35): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:40): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:49): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:57): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:76): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:84): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:92): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:116): `text status`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:128): `text status`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:12): `- Dynamic RBAC tables and attendance fields exist in migrations, but secure employee self attendance still needs an approved additive link from employees to ERP users.`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:16): `- Existing \`requireRole()\` remains only as legacy compatibility code; active routes use \`requirePermission()\`.`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:21): `- Authentication Failures: Supabase Auth is used and app profile/role status is checked after login. Password reset should constrain redirect origins.`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:33): `- Dashboard queries select limited columns and use date/status filters, but indexes should be added for high-frequency dashboard/report filters.`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:56): `measure("Fetch active customers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:70): `measure("Fetch active suppliers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:82): `measure("Fetch draft sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "draft").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:83): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").eq("order_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:89): `measure("Fetch fabric consumption entries", supabase.from("fabric_rolls").select("*, loom_production_entries(*)").eq("status", "consumed").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:101): `measure("Fetch available fabric rolls", supabase.from("fabric_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:107): `measure("Fetch lamination consumption (gte date)", supabase.from("lamination_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:119): `measure("Fetch available lamination rolls", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:125): `measure("Fetch offset consumption (gte date)", supabase.from("offset_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:137): `measure("Fetch available offset rolls", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:143): `measure("Fetch finishing consumption (gte date)", supabase.from("finishing_bundles").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:155): `measure("Fetch available finishing bundles", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:161): `measure("Fetch roto consumption (gte date)", supabase.from("roto_film_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:173): `measure("Fetch available roto rolls", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("status", "available").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:191): `measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").gte("order_date", "2026-07-01").lte("order_date", "2026-07-14").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:197): `measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:198): `measure("Fetch sales orders basic info", supabase.from("sales_orders").select("id, status, sales_order_items(id, department, selected_roll_ids)").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:264): `const statusIcon = r.success ? "✓" : "✗";`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:276): `console.log(\`   ${colorCode}${statusIcon} [${r.duration}ms]\x1b[0m - ${r.name} (${r.count} rows)\`);`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3841): `"node_modules/available-typed-arrays": {`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3843): `"resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:4705): `"available-typed-arrays": "^1.0.7",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:9562): `"available-typed-arrays": "^1.0.7",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:9924): `"available-typed-arrays": "^1.0.7",`
- [public/sw.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/sw.js:1): `(()=>{"use strict";let e,t,a,s,r,n={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"serwist",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},i=e=>[n.prefix,e,n.suffix].filter(e=>e&&e.length>0).join("-"),c={updateDetails:e=>{var t=t=>{let a=e[t];"string"==typeof a&&(n[t]=a)};for(let e of Object.keys(n))t(e)},getGoogleAnalyticsName:e=>e||i(n.googleAnalytics),getPrecacheName:e=>e||i(n.precache),getRuntimeName:e=>e||i(n.runtime)};var o=class extends Error{details;constructor(e,t){super(((e,...t)=>{let a=e;return t.length>0&&(a+=\` :: ${JSON.stringify(t)}\`),a})(e,t)),this.name=e,this.details=t}};function l(e){return new Promise(t=>setTimeout(t,e))}let h=new Set;function u(e,t){let a=new URL(e);for(let e of t)a.searchParams.delete(e);return a.href}async function d(e,t,a,s){let r=u(t.url,a);if(t.url===r)return e.match(t,s);let n={...s,ignoreSearch:!0};for(let i of(await e.keys(t,n)))if(r===u(i.url,a))return e.match(i,s)}var m=class{promise;resolve;reject;constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};let f=async()=>{for(let e of h)await e()},g="-precache-",w=async(e,t=g)=>{let a=(await self.caches.keys()).filter(a=>a.includes(t)&&a.includes(self.registration.scope)&&a!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a},p=(e,t)=>{let a=t();return e.waitUntil(a),a},y=(e,t)=>t.some(t=>e instanceof t),_=new WeakMap,x=new WeakMap,v=new WeakMap,b={get(e,t,a){if(e instanceof IDBTransaction){if("done"===t)return _.get(e);if("store"===t)return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return E(e[t])},set:(e,t,a)=>(e[t]=a,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function E(e){if(e instanceof IDBRequest){let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("success",r),e.removeEventListener("error",n)},r=()=>{t(E(e.result)),s()},n=()=>{a(e.error),s()};e.addEventListener("success",r),e.addEventListener("error",n)});return v.set(t,e),t}if(x.has(e))return x.get(e);let s=function(e){if("function"==typeof e)return(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(R(this),t),E(this.request)}:function(...t){return E(e.apply(R(this),t))};return(e instanceof IDBTransaction&&function(e){if(_.has(e))return;let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",n),e.removeEventListener("abort",n)},r=()=>{t(),s()},n=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",r),e.addEventListener("error",n),e.addEventListener("abort",n)});_.set(e,t)}(e),y(e,t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(e,b):e}(e);return s!==e&&(x.set(e,s),v.set(s,e)),s}let R=e=>v.get(e);function q(e,t,{blocked:a,upgrade:s,blocking:r,terminated:n}={}){let i=indexedDB.open(e,t),c=E(i);return s&&i.addEventListener("upgradeneeded",e=>{s(E(i.result),e.oldVersion,e.newVersion,E(i.transaction),e)}),a&&i.addEventListener("blocked",e=>a(e.oldVersion,e.newVersion,e)),c.then(e=>{n&&e.addEventListener("close",()=>n()),r&&e.addEventListener("versionchange",e=>r(e.oldVersion,e.newVersion,e))}).catch(()=>{}),c}let S=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],C=new Map;function N(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(C.get(t))return C.get(t);let a=t.replace(/FromIndex$/,""),s=t!==a,r=D.includes(a);if(!(a in(s?IDBIndex:IDBObjectStore).prototype)||!(r||S.includes(a)))return;let n=async function(e,...t){let n=this.transaction(e,r?"readwrite":"readonly"),i=n.store;return s&&(i=i.index(t.shift())),(await Promise.all([i[a](...t),r&&n.done]))[0]};return C.set(t,n),n}b=(e=>({...e,get:(t,a,s)=>N(t,a)||e.get(t,a,s),has:(t,a)=>!!N(t,a)||e.has(t,a)}))(b);let L=["continue","continuePrimaryKey","advance"],T={},A=new WeakMap,P=new WeakMap,k={get(e,t){if(!L.includes(t))return e[t];let a=T[t];return a||(a=T[t]=function(...e){A.set(this,P.get(this)[t](...e))}),a}};async function*I(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;let a=new Proxy(t,k);for(P.set(a,t),v.set(a,R(t));t;)yield a,t=await (A.get(a)||t.continue()),A.delete(a)}function U(e,t){return t===Symbol.asyncIterator&&y(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&y(e,[IDBIndex,IDBObjectStore])}b=(e=>({...e,get:(t,a,s)=>U(t,a)?I:e.get(t,a,s),has:(t,a)=>U(t,a)||e.has(t,a)}))(b);let F=async(t,a)=>{let s=null;if(t.url&&(s=new URL(t.url).origin),s!==self.location.origin)throw new o("cross-origin-copy-response",{origin:s});let r=t.clone(),n={headers:new Headers(r.headers),status:r.status,statusText:r.statusText},i=a?a(n):n,c=!function(){if(void 0===e){let t=new Response("");if("body"in t)try{new Response(t.body),e=!0}catch{e=!1}e=!1}return e}()?await r.blob():r.body;return new Response(c,i)},B="requests",K="queueName";var M=class{_db=null;async addEntry(e){let t=(await this.getDb()).transaction(B,"readwrite",{durability:"relaxed"});await t.store.add(e),await t.done}async getFirstEntryId(){return(await (await this.getDb()).transaction(B).store.openCursor())?.value.id}async getAllEntriesByQueueName(e){return await (await this.getDb()).getAllFromIndex(B,K,IDBKeyRange.only(e))||[]}async getEntryCountByQueueName(e){return(await this.getDb()).countFromIndex(B,K,IDBKeyRange.only(e))}async deleteEntry(e){await (await this.getDb()).delete(B,e)}async getFirstEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"next")}async getLastEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"prev")}async getEndEntryFromIndex(e,t){return(await (await this.getDb()).transaction(B).store.index(K).openCursor(e,t))?.value}async getDb(){return this._db||(this._db=await q("serwist-background-sync",3,{upgrade:this._upgradeDb})),this._db}_upgradeDb(e,t){t>0&&t<3&&e.objectStoreNames.contains(B)&&e.deleteObjectStore(B),e.createObjectStore(B,{autoIncrement:!0,keyPath:"id"}).createIndex(K,K,{unique:!1})}},O=class{_queueName;_queueDb;constructor(e){this._queueName=e,this._queueDb=new M}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async unshiftEntry(e){let t=await this._queueDb.getFirstEntryId();t?e.id=t-1:delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async popEntry(){return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName))}async shiftEntry(){return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName))}async getAll(){return await this._queueDb.getAllEntriesByQueueName(this._queueName)}async size(){return await this._queueDb.getEntryCountByQueueName(this._queueName)}async deleteEntry(e){await this._queueDb.deleteEntry(e)}async _removeEntry(e){return e&&await this.deleteEntry(e.id),e}};let W=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];var j=class e{_requestData;static async fromRequest(t){let a={url:t.url,headers:{}};for(let e of("GET"!==t.method&&(a.body=await t.clone().arrayBuffer()),t.headers.forEach((e,t)=>{a.headers[t]=e}),W))void 0!==t[e]&&(a[e]=t[e]);return new e(a)}constructor(e){"navigate"===e.mode&&(e.mode="same-origin"),this._requestData=e}toObject(){let e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new e(this.toObject())}};let H="serwist-background-sync",$=new Set,G=e=>{let t={request:new j(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};var Q=class{_name;_onSync;_maxRetentionTime;_queueStore;_forceSyncFallback;_syncInProgress=!1;_requestsAddedDuringSync=!1;constructor(e,{forceSyncFallback:t,onSync:a,maxRetentionTime:s}={}){if($.has(e))throw new o("duplicate-queue-name",{name:e});$.add(e),this._name=e,this._onSync=a||this.replayRequests,this._maxRetentionTime=s||10080,this._forceSyncFallback=!!t,this._queueStore=new O(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){let e=await this._queueStore.getAll(),t=Date.now(),a=[];for(let s of e){let e=60*this._maxRetentionTime*1e3;t-s.timestamp>e?await this._queueStore.deleteEntry(s.id):a.push(G(s))}return a}async size(){return await this._queueStore.size()}async _addRequest({request:e,metadata:t,timestamp:a=Date.now()},s){let r={requestData:(await j.fromRequest(e.clone())).toObject(),timestamp:a};switch(t&&(r.metadata=t),s){case"push":await this._queueStore.pushEntry(r);break;case"unshift":await this._queueStore.unshiftEntry(r)}this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){let t,a=Date.now();switch(e){case"pop":t=await this._queueStore.popEntry();break;case"shift":t=await this._queueStore.shiftEntry()}if(t){let s=60*this._maxRetentionTime*1e3;return a-t.timestamp>s?this._removeRequest(e):G(t)}}async replayRequests(){let e;for(;e=await this.shiftRequest();)try{await fetch(e.request.clone())}catch{throw await this.unshiftRequest(e),new o("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration&&!this._forceSyncFallback)try{await self.registration.sync.register(\`${H}:${this._name}\`)}catch(e){}}_addSyncListener(){"sync"in self.registration&&!this._forceSyncFallback?self.addEventListener("sync",e=>{if(e.tag===\`${H}:${this._name}\`){let t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(e){if(e instanceof Error)throw e}finally{this._requestsAddedDuringSync&&!(t&&!e.lastChance)&&await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}}):this._onSync({queue:this})}static get _queueNames(){return $}},V=class{_queue;constructor(e,t){this._queue=new Q(e,t)}async fetchDidFail({request:e}){await this._queue.pushRequest({request:e})}};let z={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};function J(e){return"string"==typeof e?new Request(e):e}var X=class{event;request;url;params;_cacheKeys={};_strategy;_handlerDeferred;_extendLifetimePromises;_plugins;_pluginStateMap;constructor(e,t){for(let a of(this.event=t.event,this.request=t.request,t.url&&(this.url=t.url,this.params=t.params),this._strategy=e,this._handlerDeferred=new m,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(a,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,a=J(e),s=await this.getPreloadResponse();if(s)return s;let r=this.hasCallback("fetchDidFail")?a.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:t})}catch(e){if(e instanceof Error)throw new o("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let n=a.clone();try{let e;for(let s of(e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await s({event:t,request:n,response:e});return e}catch(e){throw r&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:r.clone(),request:n.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),a=t.clone();return this.waitUntil(this.cachePut(e,a)),t}async cacheMatch(e){let t,a=J(e),{cacheName:s,matchOptions:r}=this._strategy,n=await this.getCacheKey(a,"read"),i={...r,cacheName:s};for(let e of(t=await caches.match(n,i),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:s,matchOptions:r,cachedResponse:t,request:n,event:this.event})||void 0;return t}async cachePut(e,t){let a=J(e);await l(0);let s=await this.getCacheKey(a,"write");if(!t)throw new o("cache-put-with-no-response",{url:new URL(String(s.url),location.href).href.replace(RegExp(\`^${location.origin}\`),"")});let r=await this._ensureResponseSafeToCache(t);if(!r)return!1;let{cacheName:n,matchOptions:i}=this._strategy,c=await self.caches.open(n),h=this.hasCallback("cacheDidUpdate"),u=h?await d(c,s.clone(),["__WB_REVISION__"],i):null;try{await c.put(s,h?r.clone():r)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await f(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:n,oldResponse:u,newResponse:r.clone(),request:s,event:this.event});return!0}async getCacheKey(e,t){let a=\`${e.url} | ${t}\`;if(!this._cacheKeys[a]){let s=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=J(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[a]=s}return this._cacheKeys[a]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let a of this.iterateCallbacks(e))await a(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let a=this._pluginStateMap.get(t),s=s=>{let r={...s,state:a};return t[e](r)};yield s}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async getPreloadResponse(){if(this.event instanceof FetchEvent&&"navigate"===this.event.request.mode&&"preloadResponse"in this.event)try{let e=await this.event.preloadResponse;if(e)return e}catch(e){return}}async _ensureResponseSafeToCache(e){let t=e,a=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,a=!0,!t)break;return!a&&t&&200!==t.status&&(t=void 0),t}},Y=class{cacheName;plugins;fetchOptions;matchOptions;constructor(e={}){this.cacheName=c.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,a="string"==typeof e.request?new Request(e.request):e.request,s=new X(this,e.url?{event:t,request:a,url:e.url,params:e.params}:{event:t,request:a}),r=this._getResponse(s,a,t);return[r,this._awaitComplete(r,s,a,t)]}async _getResponse(e,t,a){let s;await e.runCallbacks("handlerWillStart",{event:a,request:t});try{if(s=await this._handle(t,e),void 0===s||"error"===s.type)throw new o("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(let n of e.iterateCallbacks("handlerDidError"))if(void 0!==(s=await n({error:r,event:a,request:t})))break}if(!s)throw r}for(let r of e.iterateCallbacks("handlerWillRespond"))s=await r({event:a,request:t,response:s});return s}async _awaitComplete(e,t,a,s){let r,n;try{r=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:s,request:a,response:r}),await t.doneWaiting()}catch(e){e instanceof Error&&(n=e)}if(await t.runCallbacks("handlerDidComplete",{event:s,request:a,response:r,error:n}),t.destroy(),n)throw n}},Z=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s=[],r=[];if(this._networkTimeoutSeconds){let{id:n,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=n,r.push(i)}let n=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});r.push(n);let i=await t.waitUntil((async()=>await t.waitUntil(Promise.race(r))||await n)());if(!i)throw new o("no-response",{url:e.url});return i}_getTimeoutPromise({request:e,logs:t,handler:a}){let s;return{promise:new Promise(t=>{s=setTimeout(async()=>{t(await a.cacheMatch(e))},1e3*this._networkTimeoutSeconds)}),id:s}}async _getNetworkPromise({timeoutId:e,request:t,logs:a,handler:s}){let r,n;try{n=await s.fetchAndCachePut(t)}catch(e){e instanceof Error&&(r=e)}return e&&clearTimeout(e),(r||!n)&&(n=await s.cacheMatch(t)),n}},ee=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s;try{let a=[t.fetch(e)];if(this._networkTimeoutSeconds){let e=l(1e3*this._networkTimeoutSeconds);a.push(e)}if(!(s=await Promise.race(a)))throw Error(\`Timed out the network response after ${this._networkTimeoutSeconds} seconds.\`)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}};let et=e=>e&&"object"==typeof e?e:{handle:e};var ea=class{handler;match;method;catchHandler;constructor(e,t,a="GET"){this.handler=et(t),this.match=e,this.method=a}setCatchHandler(e){this.catchHandler=et(e)}},es=class e extends Y{_fallbackToNetwork;static defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e};static copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await F(e):e};constructor(t={}){t.cacheName=c.getPrecacheName(t.cacheName),super(t),this._fallbackToNetwork=!1!==t.fallbackToNetwork,this.plugins.push(e.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let a=await t.getPreloadResponse();if(a)return a;let s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let a,s=t.params||{};if(this._fallbackToNetwork){let r=s.integrity,n=e.integrity,i=!n||n===r;a=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?n||r:void 0})),r&&i&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,a.clone()))}else throw new o("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return a}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let a=await t.fetch(e);if(!await t.cachePut(e,a.clone()))throw new o("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let t=null,a=0;for(let[s,r]of this.plugins.entries())r!==e.copyRedirectedCacheableResponsesPlugin&&(r===e.defaultPrecacheCacheabilityPlugin&&(t=s),r.cacheWillUpdate&&a++);0===a?this.plugins.push(e.defaultPrecacheCacheabilityPlugin):a>1&&null!==t&&this.plugins.splice(t,1)}},er=class extends ea{_allowlist;_denylist;constructor(e,{allowlist:t=[/./],denylist:a=[]}={}){super(e=>this._match(e),e),this._allowlist=t,this._denylist=a}_match({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;let a=e.pathname+e.search;for(let e of this._denylist)if(e.test(a))return!1;return!!this._allowlist.some(e=>e.test(a))}};function*en(e,{directoryIndex:t="index.html",ignoreURLParametersMatching:a=[/^utm_/,/^fbclid$/],cleanURLs:s=!0,urlManipulation:r}={}){let n=new URL(e,location.href);n.hash="",yield n.href;let i=((e,t=[])=>{for(let a of[...e.searchParams.keys()])t.some(e=>e.test(a))&&e.searchParams.delete(a);return e})(n,a);if(yield i.href,t&&i.pathname.endsWith("/")){let e=new URL(i.href);e.pathname+=t,yield e.href}if(s){let e=new URL(i.href);e.pathname+=".html",yield e.href}if(r)for(let e of r({url:n}))yield e.href}var ei=class extends ea{constructor(e,t,a){super(({url:t})=>{let a=e.exec(t.href);if(a)return t.origin!==location.origin&&0!==a.index?void 0:a.slice(1)},t,a)}};let ec=e=>{if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:a}=e;if(!a)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}let s=new URL(a,location.href),r=new URL(a,location.href);return s.searchParams.set("__WB_REVISION__",t),{cacheKey:s.href,url:r.href}};var eo=class{updatedURLs=[];notUpdatedURLs=[];handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)};cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:a})=>{if("install"===e.type&&t?.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;a?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return a}};"undefined"!=typeof navigator&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent);let el="cache-entries",eh=e=>{let t=new URL(e,location.href);return t.hash="",t.href};var eu=class{_cacheName;_db=null;constructor(e){this._cacheName=e}_getId(e){return\`${this._cacheName}|${eh(e)}\`}_upgradeDb(e){let t=e.createObjectStore(el,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&function(e,{blocked:t}={}){let a=indexedDB.deleteDatabase(e);t&&a.addEventListener("blocked",e=>t(e.oldVersion,e)),E(a).then(()=>void 0)}(this._cacheName)}async setTimestamp(e,t){e=eh(e);let a={id:this._getId(e),cacheName:this._cacheName,url:e,timestamp:t},s=(await this.getDb()).transaction(el,"readwrite",{durability:"relaxed"});await s.store.put(a),await s.done}async getTimestamp(e){return(await (await this.getDb()).get(el,this._getId(e)))?.timestamp}async expireEntries(e,t){let a=await (await this.getDb()).transaction(el,"readwrite").store.index("timestamp").openCursor(null,"prev"),s=[],r=0;for(;a;){let n=a.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&r>=t?(a.delete(),s.push(n.url)):r++),a=await a.continue()}return s}async getDb(){return this._db||(this._db=await q("serwist-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}},ed=class{_isRunning=!1;_rerunRequested=!1;_maxEntries;_maxAgeSeconds;_matchOptions;_cacheName;_timestampModel;constructor(e,t={}){this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new eu(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;let e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),a=await self.caches.open(this._cacheName);for(let e of t)await a.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,this.expireEntries())}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(!this._maxAgeSeconds)return!1;let t=await this._timestampModel.getTimestamp(e),a=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<a}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}},em=class{_config;_cacheExpirations;constructor(e={}){var t;this._config=e,this._cacheExpirations=new Map,this._config.maxAgeFrom||(this._config.maxAgeFrom="last-fetched"),this._config.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),h.add(t))}_getCacheExpiration(e){if(e===c.getRuntimeName())throw new o("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new ed(e,this._config),this._cacheExpirations.set(e,t)),t}cachedResponseWillBeUsed({event:e,cacheName:t,request:a,cachedResponse:s}){if(!s)return null;let r=this._isResponseDateFresh(s),n=this._getCacheExpiration(t),i="last-used"===this._config.maxAgeFrom,c=(async()=>{i&&await n.updateTimestamp(a.url),await n.expireEntries()})();try{e.waitUntil(c)}catch{}return r?s:null}_isResponseDateFresh(e){if("last-used"===this._config.maxAgeFrom)return!0;let t=Date.now();if(!this._config.maxAgeSeconds)return!0;let a=this._getDateHeaderTimestamp(e);return null===a||a>=t-1e3*this._config.maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;let t=new Date(e.headers.get("date")).getTime();return Number.isNaN(t)?null:t}async cacheDidUpdate({cacheName:e,request:t}){let a=this._getCacheExpiration(e);await a.updateTimestamp(t.url),await a.expireEntries()}async deleteCacheAndMetadata(){for(let[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}};let ef=async(e,t)=>{try{if(206===t.status)return t;let a=e.headers.get("range");if(!a)throw new o("no-range-header");let s=(e=>{let t=e.trim().toLowerCase();if(!t.startsWith("bytes="))throw new o("unit-must-be-bytes",{normalizedRangeHeader:t});if(t.includes(","))throw new o("single-range-only",{normalizedRangeHeader:t});let a=/(\d*)-(\d*)/.exec(t);if(!a||!(a[1]||a[2]))throw new o("invalid-range-values",{normalizedRangeHeader:t});return{start:""===a[1]?void 0:Number(a[1]),end:""===a[2]?void 0:Number(a[2])}})(a),r=await t.blob(),n=((e,t,a)=>{let s,r,n=e.size;if(a&&a>n||t&&t<0)throw new o("range-not-satisfiable",{size:n,end:a,start:t});return void 0!==t&&void 0!==a?(s=t,r=a+1):void 0!==t&&void 0===a?(s=t,r=n):void 0!==a&&void 0===t&&(s=n-a,r=n),{start:s,end:r}})(r,s.start,s.end),i=r.slice(n.start,n.end),c=i.size,l=new Response(i,{status:206,statusText:"Partial Content",headers:t.headers});return l.headers.set("Content-Length",String(c)),l.headers.set("Content-Range",\`bytes ${n.start}-${n.end-1}/${r.size}\`),l}catch(e){return new Response("",{status:416,statusText:"Range Not Satisfiable"})}};var eg=class{cachedResponseWillBeUsed=async({request:e,cachedResponse:t})=>t&&e.headers.has("range")?await ef(e,t):t},ew=class extends Y{async _handle(e,t){let a,s=await t.cacheMatch(e);if(s);else try{s=await t.fetchAndCachePut(e)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}},ep=class extends Y{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z)}async _handle(e,t){let a,s=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(s);let r=await t.cacheMatch(e);if(r);else try{r=await s}catch(e){e instanceof Error&&(a=e)}if(!r)throw new o("no-response",{url:e.url,error:a});return r}};let ey={rscPrefetch:"pages-rsc-prefetch",rsc:"pages-rsc",html:"pages"},e_=[{matcher:/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,handler:new ew({cacheName:"google-fonts-webfonts",plugins:[new em({maxEntries:4,maxAgeSeconds:31536e3,maxAgeFrom:"last-used"})]})},{matcher:/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,handler:new ep({cacheName:"google-fonts-stylesheets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,handler:new ep({cacheName:"static-font-assets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,handler:new ep({cacheName:"static-image-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:2592e3,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/static.+\.js$/i,handler:new ew({cacheName:"next-static-js-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/image\?url=.+$/i,handler:new ep({cacheName:"next-image",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:mp3|wav|ogg)$/i,handler:new ew({cacheName:"static-audio-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:mp4|webm)$/i,handler:new ew({cacheName:"static-video-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:js)$/i,handler:new ep({cacheName:"static-js-assets",plugins:[new em({maxEntries:48,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:css|less)$/i,handler:new ep({cacheName:"static-style-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/data\/.+\/.+\.json$/i,handler:new Z({cacheName:"next-data",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:json|xml|csv)$/i,handler:new Z({cacheName:"static-data-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/api\/auth\/.*/,handler:new ee({networkTimeoutSeconds:10})},{matcher:({sameOrigin:e,url:{pathname:t}})=>e&&t.startsWith("/api/"),method:"GET",handler:new Z({cacheName:"apis",plugins:[new em({maxEntries:16,maxAgeSeconds:86400,maxAgeFrom:"last-used"})],networkTimeoutSeconds:10})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rscPrefetch,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rsc,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>e.headers.get("Content-Type")?.includes("text/html")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.html,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({url:{pathname:e},sameOrigin:t})=>t&&!e.startsWith("/api/"),handler:new Z({cacheName:"others",plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({sameOrigin:e})=>!e,handler:new Z({cacheName:"cross-origin",plugins:[new em({maxEntries:32,maxAgeSeconds:3600})],networkTimeoutSeconds:10})},{matcher:/.*/i,method:"GET",handler:new ee}],ex=async(e,t,a)=>{let s=t.map((e,t)=>({index:t,item:e})),r=async e=>{let t=[];for(;;){let r=s.pop();if(!r)return e(t);let n=await a(r.item);t.push({result:n,index:r.index})}},n=Array.from({length:e},()=>new Promise(r));return(await Promise.all(n)).flat().sort((e,t)=>e.index<t.index?-1:1).map(e=>e.result)};var ev=class{_precacheController;constructor({precacheController:e}){this._precacheController=e}cacheKeyWillBeUsed=async({request:e,params:t})=>{let a=t?.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return a?new Request(a,{headers:e.headers}):e}},eb=class{_installAndActiveListenersAdded;_concurrentPrecaching;_strategy;_urlsToCacheKeys=new Map;_urlsToCacheModes=new Map;_cacheKeysToIntegrities=new Map;constructor({cacheName:e,plugins:t=[],fallbackToNetwork:a=!0,concurrentPrecaching:s=1}={}){this._concurrentPrecaching=s,this._strategy=new es({cacheName:c.getPrecacheName(e),plugins:[...t,new ev({precacheController:this})],fallbackToNetwork:a}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let a of e){"string"==typeof a?t.push(a):a&&!a.integrity&&void 0===a.revision&&t.push(a.url);let{cacheKey:e,url:s}=ec(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(s)&&this._urlsToCacheKeys.get(s)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(s),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:s});this._cacheKeysToIntegrities.set(e,a.integrity)}this._urlsToCacheKeys.set(s,e),this._urlsToCacheModes.set(s,r),t.length>0&&console.warn(\`Serwist is precaching URLs without revision info: ${t.join(", ")}`
- [scratch/check_fabric_types.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_fabric_types.mjs:23): `.select("id, fabric_name, status");`
- [scratch/check_lam_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_lam_rolls.mjs:23): `.select("id, roll_id, lam_type, fabric_type_id, status")`
- [scratch/check_offset_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_offset_rolls.mjs:23): `.select("id, roll_id, offset_type, weight_kg, status")`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:17): `.select("order_number, status, sales_order_items(*)")`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:26): `console.log("Orders:", orders.map(o => ({ num: o.order_number, status: o.status, items: o.sales_order_items })));`
- [scratch/check-materials.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-materials.mjs:21): `.eq("status", "active")`
- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:29): `.select("id, email, full_name, role_id, status, roles(name)");`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:34): `console.log("Signed in successfully. Token active.");`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:36): `// Fetch pending orders`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:37): `console.log("Fetching pending orders as user...");`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:38): `const { data: pendingOrders, error: pendingError } = await supabaseClient`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:40): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:41): `.eq("status", "confirmed")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:46): `if (pendingError) {`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:47): `console.error("Pending orders error:", pendingError);`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:51): `console.log("Pending orders count:", pendingOrders?.length);`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:53): `const targetOrder = pendingOrders?.find(o => o.order_number === "DP-06-28-34");`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:58): `for (const order of pendingOrders || []) {`
- [scratch/check-rolls-status.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rolls-status.mjs:21): `.select("id, roll_number, status, deleted_at")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:8): `console.log("Fetching pending orders via anon key...");`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:9): `const { data: pendingOrders, error: pendingError } = await supabase`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:12): `.eq("status", "confirmed")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:17): `if (pendingError) {`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:18): `console.error("Pending error:", pendingError);`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:22): `console.log("Pending Orders count:", pendingOrders?.length);`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:23): `if (pendingOrders && pendingOrders.length > 0) {`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:24): `const targetOrder = pendingOrders.find(o => o.order_number === "DP-06-28-03");`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:28): `for (const order of pendingOrders) {`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:8): `console.log("Running pending orders query...");`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:12): `.eq("status", "confirmed")`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:11): `.select("id, order_number, status, selected_roll_ids, sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:35): `// 1. Reset fabric rolls status`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:36): `console.log("Resetting sold fabric rolls back to 'available'...");`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:39): `.update({ status: "available" })`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:40): `.eq("status", "sold");`
- [scratch/create-placeholders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-placeholders.mjs:21): `{ file: 'src/app/(app)/reports/sales-confirmation/page.tsx', title: 'Sales Confirmation Reports', desc: 'Sales order confirmation and status reporting.' },`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:26): `.eq("status", "active")`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:32): `console.log("📋 Available customers:");`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:87): `status: "active",`
- [scratch/diagnose-login-error.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/diagnose-login-error.mjs:58): `.select("id, status, deleted_at, roles(name, is_active, deleted_at)")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:28): `const activeId = "856750d9-eaf1-4469-a374-f1c683658e73";`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:34): `// 1. Rename the active roll's production entry serial number from "1" to "10"`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:36): `console.log('Renaming active roll (serial "1" -> "10") to avoid unique key conflicts...');`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:42): `console.log("✅ Active roll renamed successfully.");`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:44): `// 2. Update the fabric_type_id on all old production entries from oldId to activeId`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:46): `console.log(\`Migrating 9 production entries from old ID (${oldId}) to active ID (${activeId})...\`);`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:49): `.update({ fabric_type_id: activeId })`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:56): `const { data: activeRolls } = await supabase`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:58): `.select("roll_number, status, weight, meters")`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:59): `.eq("fabric_type_id", activeId)`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:68): `console.log(\`- Rolls count under active ID (${activeId}): ${activeRolls?.length ?? 0}\`);`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:70): `console.log(\`- Active rolls detail:\`, activeRolls?.sort((a,b) => Number(a.roll_number) - Number(b.roll_number)));`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:72): `console.log("\n🎉 Merge completed successfully with zero errors!");`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:43): `.select("id, roll_number, status")`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:51): `.select("id, order_number, status")`
- [scratch/inspect_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_db.js:60): `console.log("\nAvailable database paths (tables, views, RPCs):");`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:24): `.select("id, order_number, bill_number, bill_value, is_draft_billing, status, created_at")`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:31): `console.log(\`Order ID: ${o.id} | Order No: ${o.order_number} | Date: ${o.order_date} | Bill No: ${o.bill_number} | Bill Value: ${o.bill_value} | GST: ${o.gst_rate} | Status: ${o.status}\`);`
- [scratch/inspect_sv_polytech_rows.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sv_polytech_rows.mjs:24): `.select("id, customer_name, deleted_at, status")`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:28): `.select("id, order_number, order_date, status, bill_number, bill_value, is_draft_billing, deleted_at")`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:16): `// Use service role key if available to inspect auth.users`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:31): `.select('id, full_name, email, role_id, status');`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:38): `console.log(\`- ID: ${p.id} | Email: ${p.email} | Name: ${p.full_name} | RoleID: ${p.role_id} | Status: ${p.status}\`);`
- [scratch/list-users.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users.mjs:11): `.eq("status", "active")`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:20): `const { data: lam } = await supabase.from("lamination_rolls").select("id, roll_id, lam_type, fabric_type_id, status, fabric_types(fabric_name)").eq("status", "available");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:21): `console.log("--- Available Lamination Rolls ---");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:24): `const { data: film } = await supabase.from("roto_film_rolls").select("id, roll_id, s_no, status").eq("status", "available");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:25): `console.log("--- Available Roto Film Rolls ---");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:28): `const { data: metallic } = await supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, status").eq("status", "available");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:29): `console.log("--- Available Roto Metallic Rolls ---");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:32): `const { data: offset } = await supabase.from("offset_rolls").select("id, roll_id, offset_type, fabric_type_id, status").eq("status", "available");`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:33): `console.log("--- Available Offset Rolls ---");`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:63): `console.log(\`- Status: ${ft.status}\`);`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:66): `console.log(\`- Rolls:\`, ftRolls.map((r) => ({ id: r.id, roll_number: r.roll_number, status: r.status, weight: r.weight, meters: r.meters })));`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:44): `status: string;`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:58): `pendingOrders: SalesOrder[];`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:121): `export function SalesEntryClient({ pendingOrders, billedOrders, rolls, fabricTypes }: SalesEntryClientProps) {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:126): `const [isPending, startTransition] = useTransition();`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:140): `// Group pending orders by customer (firm)`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:141): `const pendingOrdersByCustomer = useMemo(() => {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:143): `for (const order of pendingOrders) {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:156): `}, [pendingOrders]);`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:251): `const pending = pendingOrders.find((o) => o.id === printOrderId);`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:252): `if (pending) return pending;`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:265): `}, [printOrderId, pendingOrders, billedOrders]);`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:279): `// If print view is active, show only that`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:324): `{/* Status messages */}`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:332): `{/* Section 1: Confirmed Deliveries Grouped by Customer */}`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:337): `Confirmed Deliveries Pending Billing`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:339): `{pendingOrders.length}`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:342): `<p className="text-sm text-muted-foreground mt-1">Enter invoice billing details directly for each confirmed dispatch.</p>`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:345): `{pendingOrdersByCustomer.length === 0 ? (`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:347): `title="No pending deliveries"`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:348): `description="Confirmed deliveries awaiting billing will appear here."`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:352): `{pendingOrdersByCustomer.map((customerGroup) => {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:404): `Confirmed`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:481): `disabled={isPending}`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:516): `description="Once you submit billing for pending deliveries, they will appear here."`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:43): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:52): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:61): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:70): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:79): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:88): `status: r.status,`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:95): `const activeRolls = rolls.filter((roll) => {`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:97): `// Assume not sold for test`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:98): `return roll.status === "available";`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:125): `activeRolls.forEach((roll) => {`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:28): `supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:29): `supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:30): `supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:31): `supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:32): `supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:33): `supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:43): `status: r.status,`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:52): `status: r.status,`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:61): `status: r.status,`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:70): `status: r.status,`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:79): `status: r.status,`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:88): `status: r.status,`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:60): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:76): `status: "present"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:89): `.update({ status: "half_day" })`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:117): `status: "active",`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:132): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:149): `status: "draft"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:217): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:293): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:308): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:416): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:440): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:467): `status: "active"`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:543): `status: "active"`
- [scratch/test-full-login-flow.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-full-login-flow.mjs:38): `.select("id, status, deleted_at, roles(name, is_active, deleted_at)")`
- [scratch/test-login-query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-login-query.mjs:25): `.select("id, status, deleted_at, role_id, roles(name, is_active, deleted_at)")`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:27): `status: "active"`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:47): `status: "active"`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:85): `status: "active",`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:366): `const statusRows = evidence(source, (t) => /(status|draft|confirmed|cancelled|available|reserved|sold|consumed|completed|pending|approved|inactive|active|voided|backorder|is_draft)/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:369): `const ruleRows = evidence(source, (t) => /throw new Error|\.refine\(|check\s*\(|\.min\(|\.max\(|\.positive\(|cannot|must be|required|if \(!|if \(error|status ===|status !==|unique|ON DELETE|CASCADE/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:601): `upd += \`- Fields/status throws: ${flat.throws.slice(0, 8).map((t) => \`\\`${t.slice(0, 60)}\\`\`).join("; ") || "none"}\n\n\`;`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:603): `upd += heading("Status Transition Evidence");`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:604): `upd += bullets(statusRows.slice(0, 300));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:647): `rules += heading("SQL Check Constraints And Status Enums");`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:648): `rules += codeBlock(tableBlocks.filter((b) => /check\s*\(|status text not null/i.test(b.text)));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:657): `{ name: "Sales Billing (Draft → Finalize)", start: "prepareSalesOrderDraftBilling", mod: "Sales" },`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:701): `hidden += "Side effects not obvious from UI labels: cache revalidation, journal creation, stock adjustments, roll status changes.\n\n";`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:192): `{ name: "status-transition", re: /(status|draft|confirmed|cancelled|available|reserved|sold|consumed|completed|pending|approved)/i },`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:231): `const statusRows = evidence.filter((e) => e.kind === "status-transition");`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:363): `crud += fencedEvidence(evidence.filter((e) => /if \(|switch|case |required|status|check\s*\(|unique|on conflict|throw new Error|return \{ error/i.test(e.text)));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:390): `impact += fencedEvidence(statusRows);`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:406): `funcApi += fencedEvidence(statusRows);`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:429): `fileDoc += \`Business logic / calculations / validations / conditions:\n\n${fencedEvidence(rows.filter((e) => ["calculation", "validation", "status-transition", "delete-logic"].includes(e.kind) || /if \(|switch|case |return \{ error|throw new Error/i.test(e.text)))}\`;`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:91): `itemRemainingActions?: Record<string, "backorder" | "close">`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:95): `export async function prepareSalesOrderDraftBilling(formData: FormData) {`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:96): `return sales.prepareSalesOrderDraftBilling(formData);`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:101): `export async function discardSalesOrderDraftBilling(orderId: string) {`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:102): `return sales.discardSalesOrderDraftBilling(orderId);`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:123): `itemRemainingActions: Record<string, "backorder" | "close">,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:64): `// 2. Reset fabric_rolls status to 'available'`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:67): `.update({ status: "available", current_stage: "loom", updated_by: user.id } as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:71): `console.error("Failed to reset fabric rolls status:", rollResetErr);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:97): `const { data: activeClients } = await (supabase.from("customers") as any)`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:102): `for (const client of activeClients ?? []) {`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:116): `status: "active",`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:39): `status: "present",`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:46): `status: "present",`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:59): `status: "pending",`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:115): `if (order.status !== "pending") throw new Error("Order is already processed.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:128): `// 3. Insert into sales_orders (ERP core table) as draft`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:135): `status: "draft",`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:168): `// 5. Update client_orders status to confirmed`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:171): `.update({ status: "confirmed" })`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:174): `if (updateErr) throw new Error(\`Failed to update client order status: ${updateErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:190): `.update({ status: "cancelled" })`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:57): `status: "draft",`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:59): `export const statusSchema = z.enum(["active", "inactive"]);`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:82): `status: z.enum(["draft", "confirmed", "cancelled"]),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:102): `status: statusSchema,`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:140): `.eq("status", "active")`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:152): `if (field.name === "status") {`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:153): `shape[field.name] = statusSchema;`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:52): `// If description column doesn't exist yet in DB (migration pending), retry without it`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:121): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:181): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:193): `// Insert dummy film roll consumed`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:205): `status: "consumed",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:228): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:305): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:319): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:366): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:380): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:433): `status: "available",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:448): `await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:450): `await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:452): `await (adminSupabase.from("offset_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:566): `// 2. Revert source rolls to 'available' & Delete created stock items in parallel`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:572): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:574): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:578): `promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:580): `promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:582): `promises.push((adminSupabase.from("offset_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:80): `.select("status")`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:85): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:86): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in downstream stages and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:178): `status: "available",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:194): `const { data: roll } = await (supabase.from("roto_film_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:196): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:197): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in metallic printing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:254): `status: "available",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:264): `.update({ status: "consumed", updated_by: user.id })`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:267): `console.error("Failed to mark source film roll as consumed:", consumeError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:280): `const { data: roll } = await (supabase.from("roto_metallic_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:282): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:283): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in lamination and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:410): `status: "available",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:421): `.update({ status: "consumed" })`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:435): `const { data: roll } = await (supabase.from("lamination_rolls") as any).select("status, film_roll_id").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:437): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:438): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in offset/finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:518): `status: "available",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:534): `const { data: roll } = await (supabase.from("offset_rolls") as any).select("status").eq("id", id).maybeSingle();`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:536): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:537): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:625): `status: "available",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:642): `.select("status, finish_type, source_lam_roll_id, source_fabric_roll_id, source_offset_roll_id")`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:647): `if ((bundle as any).status === "sold") throw new Error("This bundle has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:659): `.update({ status: "available" } as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:663): `.update({ status: "available", current_stage: "loom" } as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:667): `.update({ status: "available" } as any)`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:15): `const status = String(formData.get("status") ?? "active");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:59): `status,`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:141): `.update({ status: "inactive" })`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:153): `const status = String(formData.get("status") ?? "active");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:195): `status,`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:215): `.update({ status: "inactive" })`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:275): `status: "active",`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:305): `status: "active",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:142): `.update({ status: "consumed", current_stage: stage, updated_by: user.id } as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:171): `.update({ status: "available", current_stage: "loom", updated_by: user.id } as any)`

