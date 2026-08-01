# 13 Data Flow

## UI → Server Action → Database Chains

### saveMaster (from src/components/app/master-page.tsx)

- UI import: [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:16)

```
- `saveMaster` [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:14)
  - throws: `"Invalid module key."`; ``Failed to save ${moduleKey}: ${error.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `modulePermissionKey` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:121)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `validateMasterPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:148)
    - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
      - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
```

### deactivateMaster (from src/components/app/master-page.tsx)

- UI import: [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:19)

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

### checkInAttendance (from src/app/(app)/admin/attendance/page.tsx)

- UI import: [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:1)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:24)

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

### checkOutAttendance (from src/app/(app)/admin/attendance/page.tsx)

- UI import: [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:1)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:27)

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

### linkEmployeeUser (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:30)

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

### saveProduction (from src/components/app/production-form.tsx)

- UI import: [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:35)

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

### softDeleteProduction (from src/app/(app)/fabric/production/page.tsx)

- UI import: [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:38)

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

### saveRotoFilmProduction (from src/components/app/roto-film-production-form.tsx)

- UI import: [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:41)

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

### deleteRotoFilmProduction (from src/app/(app)/roto-printing/production/RotoProductionClient.tsx)

- UI import: [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:44)

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

### saveRotoMetallicProduction (from src/components/app/roto-metallic-production-form.tsx)

- UI import: [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:47)

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

### deleteRotoMetallicProduction (from src/app/(app)/roto-printing/production/RotoProductionClient.tsx)

- UI import: [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:50)

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

### saveLaminationProduction (from src/components/app/lamination-production-form.tsx)

- UI import: [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:53)

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

### deleteLaminationProduction (from src/app/(app)/lamination/production/page.tsx)

- UI import: [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:56)

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

### saveOffsetProduction (from src/components/app/offset-production-form.tsx)

- UI import: [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:59)

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

### deleteOffsetProduction (from src/app/(app)/offset-printing/production/page.tsx)

- UI import: [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:62)

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

### saveFinishingBundle (from src/components/app/finishing-production-form.tsx)

- UI import: [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:65)

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

### deleteFinishingBundle (from src/app/(app)/finishing/production/page.tsx)

- UI import: [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:68)

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

### saveStageProduction (from src/components/app/stage-production-form.tsx)

- UI import: [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:71)

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

### saveSale (from src/components/app/sales-form.tsx)

- UI import: [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:79)

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

### createSalesOrder (from src/components/app/delivery-entry-form.tsx)

- UI import: [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:82)

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

### deleteSalesOrderItem (from src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:85)

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

### confirmSalesDelivery (from src/components/app/roll-allocation-form.tsx)

- UI import: [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:88)

```
- `confirmSalesDelivery` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:183)
```

### deleteSalesOrderCompletely (from src/components/app/delete-order-button.tsx)

- UI import: [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:104)

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

### saveSalesConfirmationRates (from src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx)

- UI import: [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:107)

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

### saveMaterialSalesEntry (from src/app/(app)/accounts/material/MaterialSalesForm.tsx)

- UI import: [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:114)

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

### deleteMaterialSalesEntry (from src/app/(app)/accounts/material/MaterialSalesForm.tsx)

- UI import: [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:117)

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

### confirmMultipleSalesDeliveries (from src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:120)

```
- `confirmMultipleSalesDeliveries` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1148)
```

### saveSalesOrderBillingDirect (from scratch/SalesEntryClient_old.tsx)

- UI import: [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:128)

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

### saveSalesOrderBillingDirect (from src/app/(app)/accounts/sales/SalesEntryClient.tsx)

- UI import: [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:128)

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

### saveRawMaterialPurchase (from src/components/app/purchase-form.tsx)

- UI import: [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:133)

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

### deleteRawMaterialPurchase (from src/app/(app)/accounts/purchase/delete-purchase-button.tsx)

- UI import: [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:136)

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

### createErpUser (from src/components/app/user-form.tsx)

- UI import: [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:140)

```
- `createErpUser` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:14)
  - DB: `upsert` on `users`
  - revalidatePath: `/users`, `/admin/credentials`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

### changeUserPassword (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:143)

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

### deleteErpUser (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:146)

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

### createRole (from src/components/app/create-role-form.tsx)

- UI import: [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:149)

```
- `createRole` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:123)
  - DB: `insert` on `roles`
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

### saveRoleDetails (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:152)

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

### saveRolePermissions (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:155)

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

### deactivateRole (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:158)

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

### updateCriticalLevel (from src/app/(app)/admin/critical-levels/page.tsx)

- UI import: [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:1)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:163)

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

### saveRawMaterialConsumption (from src/components/app/consumption-form.tsx)

- UI import: [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:166)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/fabric/consumption/page.tsx)

- UI import: [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/roto-printing/consumption/page.tsx)

- UI import: [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx)

- UI import: [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:169)

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

### saveRotoProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:204)

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

### saveRotoProduct (from src/app/(app)/admin/products/RotoProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:204)

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

### deactivateRotoProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:207)

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

### deactivateRotoProduct (from src/app/(app)/admin/products/RotoProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:207)

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

### saveOffsetProduct (from src/app/(app)/admin/products/OffsetProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:210)

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

### saveOffsetProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:210)

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

### deactivateOffsetProduct (from src/app/(app)/admin/products/OffsetProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:213)

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

### deactivateOffsetProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:213)

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

### saveCatalogProduct (from src/app/(app)/admin/catalog/CatalogClient.tsx)

- UI import: [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:216)

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

### deleteCatalogProduct (from src/app/(app)/admin/catalog/CatalogClient.tsx)

- UI import: [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:219)

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

### saveJournalEntry (from src/components/app/journal-entry-form.tsx)

- UI import: [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:5)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:224)

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

### softDeleteJournalEntryGroup (from src/app/(app)/accounts/journal/page.tsx)

- UI import: [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:227)

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

### saveAccountOpeningBalance (from src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx)

- UI import: [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:232)

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

### saveClosingStock (from src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx)

- UI import: [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:235)

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

### saveProfitLoss (from src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx)

- UI import: [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:245)

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

### clearSystemTransactions (from src/app/(app)/admin/reset/ResetClient.tsx)

- UI import: [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:9)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:253)

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

### approveClientOrder (from src/app/(app)/sales/client-orders/ClientOrdersList.tsx)

- UI import: [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:257)

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

### cancelClientOrder (from src/app/(app)/sales/client-orders/ClientOrdersList.tsx)

- UI import: [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4)
- Action: [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:261)

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

### saveAccountOpeningBalance (from src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx)

- UI import: [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11)
- Action: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)

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

### clearSystemTransactions (from src/app/(app)/admin/reset/ResetClient.tsx)

- UI import: [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:9)
- Action: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38)

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

### saveClosingStock (from src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx)

- UI import: [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12)
- Action: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)

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

### saveProfitLoss (from src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx)

- UI import: [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8)
- Action: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)

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

### checkInAttendance (from src/app/(app)/admin/attendance/page.tsx)

- UI import: [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:1)
- Action: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:15)

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

### checkOutAttendance (from src/app/(app)/admin/attendance/page.tsx)

- UI import: [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:1)
- Action: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:57)

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

### linkEmployeeUser (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:87)

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

### createClientOrder (from src/app/(portal)/portal/catalog/PortalCatalogView.tsx)

- UI import: [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:9)
- Action: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:24)

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

### approveClientOrder (from src/app/(app)/sales/client-orders/ClientOrdersList.tsx)

- UI import: [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4)
- Action: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:100)

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

### cancelClientOrder (from src/app/(app)/sales/client-orders/ClientOrdersList.tsx)

- UI import: [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4)
- Action: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:181)

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

### createClientSalesOrder (from src/app/(app)/client/catalog/ClientCatalogView.tsx)

- UI import: [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:11)
- Action: [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:12)

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

### revalidateAllReports (from src/app/(app)/_actions/journal.ts)

- UI import: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:6)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)

```
- `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
  - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

### todayInIndia (from scratch/SalesEntryClient_old.tsx)

- UI import: [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:13)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/_actions/purchases.ts)

- UI import: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:6)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/journal/page.tsx)

- UI import: [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:10)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/material/page.tsx)

- UI import: [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/product-purchase/page.tsx)

- UI import: [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:7)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/purchase/page.tsx)

- UI import: [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:8)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/sales/page.tsx)

- UI import: [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:7)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/accounts/sales/SalesEntryClient.tsx)

- UI import: [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:14)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/fabric/consumption/page.tsx)

- UI import: [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:11)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/finishing/consumption/page.tsx)

- UI import: [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:5)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/lamination/consumption/page.tsx)

- UI import: [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:5)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/offset-printing/consumption/page.tsx)

- UI import: [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:5)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/accounts/page.tsx)

- UI import: [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/balance-sheet/page.tsx)

- UI import: [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:4)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx)

- UI import: [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:10)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/closing-stock/page.tsx)

- UI import: [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/profit-loss/page.tsx)

- UI import: [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:4)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/sales-confirmation/page.tsx)

- UI import: [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/stock/page.tsx)

- UI import: [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/reports/stock/StockReportClient.tsx)

- UI import: [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:10)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/roto-printing/consumption/page.tsx)

- UI import: [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:11)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:18)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/sales/delivery-entry/page.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:3)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/app/(app)/sales/order-confirmation/page.tsx)

- UI import: [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:7)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/components/app/consumption-form.tsx)

- UI import: [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:10)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### todayInIndia (from src/components/app/journal-entry-form.tsx)

- UI import: [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:11)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)

```
- `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
```

### generateNextJournalNo (from src/app/(app)/_actions/product-purchase.ts)

- UI import: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:6)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)

```
- `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
  - DB: `select` on `accounts_journal`
  - DB: `rpc` on `get_next_journal_no`
```

### generateNextJournalNo (from src/app/(app)/_actions/purchases.ts)

- UI import: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:6)
- Action: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)

```
- `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
  - DB: `select` on `accounts_journal`
  - DB: `rpc` on `get_next_journal_no`
```

### saveJournalEntry (from src/components/app/journal-entry-form.tsx)

- UI import: [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:5)
- Action: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:8)

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

### softDeleteJournalEntryGroup (from src/app/(app)/accounts/journal/page.tsx)

- UI import: [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7)
- Action: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)

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

### saveMaster (from src/components/app/master-page.tsx)

- UI import: [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17)
- Action: [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:14)

```
- `saveMaster` [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:14)
  - throws: `"Invalid module key."`; ``Failed to save ${moduleKey}: ${error.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `modulePermissionKey` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:121)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `validateMasterPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:148)
    - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
      - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
```

### deactivateMaster (from src/components/app/master-page.tsx)

- UI import: [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17)
- Action: [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:68)

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

### saveProductPurchase (from src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx)

- UI import: [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:5)
- Action: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)

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

### deleteProductPurchase (from src/app/(app)/accounts/product-purchase/delete-button.tsx)

- UI import: [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5)
- Action: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)

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

### saveProduction (from src/components/app/production-form.tsx)

- UI import: [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14)

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

### softDeleteProduction (from src/app/(app)/fabric/production/page.tsx)

- UI import: [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)

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

### saveRotoFilmProduction (from src/components/app/roto-film-production-form.tsx)

- UI import: [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:110)

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

### deleteRotoFilmProduction (from src/app/(app)/roto-printing/production/RotoProductionClient.tsx)

- UI import: [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)

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

### saveRotoMetallicProduction (from src/components/app/roto-metallic-production-form.tsx)

- UI import: [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:215)

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

### deleteRotoMetallicProduction (from src/app/(app)/roto-printing/production/RotoProductionClient.tsx)

- UI import: [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)

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

### saveLaminationProduction (from src/components/app/lamination-production-form.tsx)

- UI import: [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:301)

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

### deleteLaminationProduction (from src/app/(app)/lamination/production/page.tsx)

- UI import: [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)

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

### saveOffsetProduction (from src/components/app/offset-production-form.tsx)

- UI import: [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:460)

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

### deleteOffsetProduction (from src/app/(app)/offset-printing/production/page.tsx)

- UI import: [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)

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

### saveFinishingBundle (from src/components/app/finishing-production-form.tsx)

- UI import: [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:5)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:555)

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

### deleteFinishingBundle (from src/app/(app)/finishing/production/page.tsx)

- UI import: [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)

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

### saveStageProduction (from src/components/app/stage-production-form.tsx)

- UI import: [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:4)
- Action: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:675)

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

### saveRotoProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:8)

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

### saveRotoProduct (from src/app/(app)/admin/products/RotoProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:8)

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

### deactivateRotoProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135)

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

### deactivateRotoProduct (from src/app/(app)/admin/products/RotoProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135)

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

### saveOffsetProduct (from src/app/(app)/admin/products/OffsetProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:147)

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

### saveOffsetProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:147)

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

### deactivateOffsetProduct (from src/app/(app)/admin/products/OffsetProductsClient.tsx)

- UI import: [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209)

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

### deactivateOffsetProduct (from src/app/(app)/admin/products/page.tsx)

- UI import: [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209)

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

### saveCatalogProduct (from src/app/(app)/admin/catalog/CatalogClient.tsx)

- UI import: [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:221)

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

### deleteCatalogProduct (from src/app/(app)/admin/catalog/CatalogClient.tsx)

- UI import: [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4)
- Action: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333)

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

### saveRawMaterialPurchase (from src/components/app/purchase-form.tsx)

- UI import: [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:5)
- Action: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:8)

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

### deleteRawMaterialPurchase (from src/app/(app)/accounts/purchase/delete-purchase-button.tsx)

- UI import: [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5)
- Action: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)

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

### updateCriticalLevel (from src/app/(app)/admin/critical-levels/page.tsx)

- UI import: [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:1)
- Action: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:11)

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

### saveRawMaterialConsumption (from src/components/app/consumption-form.tsx)

- UI import: [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:5)
- Action: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:27)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/fabric/consumption/page.tsx)

- UI import: [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8)
- Action: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/roto-printing/consumption/page.tsx)

- UI import: [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8)
- Action: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

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

### softDeleteRawMaterialConsumption (from src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx)

- UI import: [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10)
- Action: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)

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

### saveSale (from src/components/app/sales-form.tsx)

- UI import: [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:4)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:15)

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

### createSalesOrder (from src/components/app/delivery-entry-form.tsx)

- UI import: [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:6)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:38)

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

### deleteSalesOrderItem (from src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)

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

### confirmSalesDelivery (from src/components/app/roll-allocation-form.tsx)

- UI import: [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:6)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:183)

```
- `confirmSalesDelivery` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:183)
```

### deleteSalesOrderCompletely (from src/components/app/delete-order-button.tsx)

- UI import: [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:4)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694)

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

### saveSalesConfirmationRates (from src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx)

- UI import: [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)

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

### saveMaterialSalesEntry (from src/app/(app)/accounts/material/MaterialSalesForm.tsx)

- UI import: [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:957)

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

### deleteMaterialSalesEntry (from src/app/(app)/accounts/material/MaterialSalesForm.tsx)

- UI import: [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)

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

### confirmMultipleSalesDeliveries (from src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx)

- UI import: [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1148)

```
- `confirmMultipleSalesDeliveries` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1148)
```

### saveSalesOrderBillingDirect (from scratch/SalesEntryClient_old.tsx)

- UI import: [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:5)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)

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

### saveSalesOrderBillingDirect (from src/app/(app)/accounts/sales/SalesEntryClient.tsx)

- UI import: [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5)
- Action: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)

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

### createErpUser (from src/components/app/user-form.tsx)

- UI import: [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:14)

```
- `createErpUser` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:14)
  - DB: `upsert` on `users`
  - revalidatePath: `/users`, `/admin/credentials`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

### deleteErpUser (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66)

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

### changeUserPassword (from src/components/app/user-row-actions.tsx)

- UI import: [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:85)

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

### createRole (from src/components/app/create-role-form.tsx)

- UI import: [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:123)

```
- `createRole` [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:123)
  - DB: `insert` on `roles`
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

### saveRoleDetails (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:139)

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

### deactivateRole (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:161)

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

### saveRolePermissions (from src/components/app/role-permissions-editor.tsx)

- UI import: [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4)
- Action: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:174)

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

