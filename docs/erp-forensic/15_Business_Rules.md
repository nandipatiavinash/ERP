# 15 Business Rules

Rules extracted from `throw new Error`, Zod `.refine`, SQL `check` constraints, and conditional guards.

## Validation Schemas (helpers.ts)

- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:59): `export const statusSchema = z.enum(["active", "inactive"]);`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:61): `export const attendanceSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:65): `export const productionSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:68): `gross_weight: z.coerce.number().positive(),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:69): `core_weight: z.coerce.number().min(0),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:70): `initial_meters: z.coerce.number().min(0).optional(),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:71): `end_meters: z.coerce.number().min(0),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:73): `}).refine((value) => value.gross_weight >= value.core_weight, {`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:77): `export const saleSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:80): `quantity_meters: z.coerce.number().positive(),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:81): `rate: z.coerce.number().min(0),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:82): `status: z.enum(["draft", "confirmed", "cancelled"]),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:86): `export const rawPurchaseSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:88): `purchase_date: z.string().min(1),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:91): `quantity: z.coerce.number().positive(),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:92): `rate: z.coerce.number().min(0),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:96): `export const createUserSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:97): `full_name: z.string().trim().min(2, "Full name is required.").transform(val => val.toUpperCase()),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:99): `password: z.string().min(8, "Password must be at least 8 characters."),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:102): `status: statusSchema,`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:105): `export const roleSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:106): `name: z.string().trim().min(2, "Role name is required.").transform(val => val.toUpperCase()),`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:110): `export const employeeUserLinkSchema = z.object({`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125): `export function assertValid<T>(schema: z.ZodType<T>, value: unknown) {`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:126): `const parsed = schema.safeParse(value);`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:149): `const numericPositive = new Set(["width", "gsm"]);`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:153): `shape[field.name] = statusSchema;`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:155): `const numeric = numericPositive.has(field.name) ? z.number().positive() : z.number().min(0);`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:158): `const text = field.required ? z.string().trim().min(1) : z.string().trim().optional();`

## Runtime Guard Throws By Module

### Admin

- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:31): `if (readError) throw new Error("Unable to verify today's attendance.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:32): `if (existing?.check_in_at) throw new Error("This employee is already checked in today.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:52): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:73): `if (readError) throw new Error(readError.message);`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:74): `if (!existing?.id) throw new Error("Check in before checking out.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:75): `if (existing.check_out_at) throw new Error("This employee is already checked out today.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:76): `if (!existing.check_in_at || now.getTime() <= new Date(existing.check_in_at).getTime()) throw new Error("Check out time must be after check in time.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:82): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:90): `if (!permissions.includes("employees.edit")) throw new Error("You need employee edit permission to link users to employees.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:101): `if (clearError) throw new Error("Unable to update employee link.");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:107): `if (linkError) throw new Error("Unable to link employee to user.");`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:16): `if (!ALLOWED_MODULE_KEYS.has(moduleKey)) throw new Error("Invalid module key.");`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:62): `throw new Error(\`Failed to save ${moduleKey}: ${error.message}\`);`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:70): `if (!ALLOWED_MODULE_KEYS.has(moduleKey)) throw new Error("Invalid module key.");`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:81): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:31): `if (file.size > MAX_FILE_SIZE) throw new Error("Image file must be 5 MB or smaller.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:32): `if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:34): `if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid image file extension.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:44): `if (uploadError) throw new Error(\`Image upload failed: ${uploadError.message}\`);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:67): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:70): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:97): `if (colorFile.size > MAX_FILE_SIZE) throw new Error("Color image file must be 5 MB or smaller.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:98): `if (!ALLOWED_IMAGE_TYPES.has(colorFile.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:100): `if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid color image file extension.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:110): `if (uploadError) throw new Error(\`Color image upload failed: ${uploadError.message}\`);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:129): `if (assocError) throw new Error(\`Failed to save color association: ${assocError.message}\`);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:143): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:168): `if (file.size > MAX_FILE_SIZE_OFF) throw new Error("Image file must be 5 MB or smaller.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:169): `if (!ALLOWED_IMAGE_TYPES_OFF.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:171): `if (!ALLOWED_IMAGE_EXTS_OFF.has(fileExt)) throw new Error("Invalid image file extension.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:181): `if (uploadError) throw new Error(\`Image upload failed: ${uploadError.message}\`);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:204): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:217): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:241): `if (file.size > MAX_FILE_SIZE) throw new Error("Image file must be 5 MB or smaller.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:242): `if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:244): `if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid image file extension.");`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:254): `if (uploadError) throw new Error(\`Image upload failed: ${uploadError.message}\`);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:280): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:283): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:317): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:320): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:343): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:71): `throw new Error("You cannot delete your own logged-in user profile.");`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:79): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:91): `throw new Error("User ID and new password are required.");`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:94): `throw new Error("Password must be at least 8 characters long.");`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:105): `throw new Error("Failed to update password in Auth: " + authError.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:135): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:155): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:170): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:181): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:185): `if (insertError) throw new Error(insertError.message);`

### Accounts

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:14): `throw new Error("Account ID is required.");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:17): `throw new Error("Opening values cannot be negative.");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:31): `throw new Error(error.message);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:60): `throw new Error(\`Failed to clear table ${table}: ${error.message}\`);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:72): `throw new Error(\`Failed to reset fabric rolls: ${rollResetErr.message}\`);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:82): `throw new Error(\`Failed to fetch raw materials: ${fetchRmErr.message}\`);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:92): `throw new Error(\`Failed to reset raw material stock for ${rm.id}: ${rmResetErr.message}\`);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:168): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:177): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:212): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:221): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:17): `throw new Error("Missing required journal fields.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:30): `throw new Error("At least 2 rows are required for a journal entry.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:37): `if (!r.account_name) throw new Error("Account name is required on all rows.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:38): `if (r.debit > 0 && r.credit > 0) throw new Error("A row cannot contain both Debit and Credit.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:39): `if (r.debit <= 0 && r.credit <= 0) throw new Error("Either Debit or Credit must be entered on all rows.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:41): `if (r.debit <= 0) throw new Error("Amount must be positive.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:45): `if (r.credit <= 0) throw new Error("Amount must be positive.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:51): `throw new Error("Total Debit must be equal to Total Credit before submitting.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:62): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:98): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:114): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:124): `if (!journalNo) throw new Error("Missing journal number.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:133): `if (fetchErr) throw new Error(fetchErr.message);`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:147): `throw new Error("Cannot delete auto-generated journal entries.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:155): `if (error) throw new Error(error.message);`

### Sales

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:28): `if (!user) throw new Error("Unauthorized");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:30): `if (items.length === 0) throw new Error("No items in order.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:32): `if (item.quantity <= 0 || isNaN(item.quantity)) throw new Error("Quantity must be greater than zero.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:43): `throw new Error("Your account is not linked to a customer firm. Please contact your administrator.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:65): `if (orderErr) throw new Error(\`Failed to create order: ${orderErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:90): `if (itemsErr) throw new Error(\`Failed to save order items: ${itemsErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:103): `if (!user) throw new Error("Unauthorized");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:114): `if (orderErr || !order) throw new Error("Client order not found.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:115): `if (order.status !== "pending") throw new Error("Order is already processed.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:142): `if (salesOrderErr) throw new Error(\`Failed to create ERP order: ${salesOrderErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:165): `throw new Error(\`Failed to create ERP order items: ${itemsErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:174): `if (updateErr) throw new Error(\`Failed to update client order status: ${updateErr.message}\`);`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:184): `if (!user) throw new Error("Unauthorized");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:193): `if (updateErr) throw new Error(\`Failed to cancel client order: ${updateErr.message}\`);`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:15): `if (!user) throw new Error("Unauthorized");`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:25): `throw new Error("Your user account is not linked to any customer firm.");`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:29): `throw new Error("No items in order.");`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:35): `throw new Error("Quantity must be greater than zero.");`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:64): `if (headerError) throw new Error(headerError.message);`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:79): `if (itemsError) throw new Error(itemsError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:32): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:89): `if (headerError) throw new Error(headerError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:96): `throw new Error("Invalid items payload format.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:118): `if (itemsError) throw new Error(itemsError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:135): `throw new Error(itemError?.message || "Item not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:153): `if (releaseError) throw new Error(releaseError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:160): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:167): `if (countError) throw new Error(countError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:174): `if (deleteOrderError) throw new Error(deleteOrderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:198): `throw new Error(orderFetchError?.message || "Order not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:212): `if (error) throw new Error(\`Failed to retrieve fabric roll details: ${error.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:216): `if (error) throw new Error(\`Failed to retrieve lamination roll details: ${error.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:220): `if (error) throw new Error(\`Failed to retrieve offset roll details: ${error.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:224): `if (error) throw new Error(\`Failed to retrieve finishing bundle details: ${error.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:232): `if (error) throw new Error(\`Failed to retrieve roto roll details: ${error.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:281): `if (updateItemError) throw new Error(updateItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:301): `if (deleteItemError) throw new Error(deleteItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:325): `if (updateItemError) throw new Error(updateItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:332): `if (deleteItemError) throw new Error(deleteItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:343): `if (updateItemError) throw new Error(updateItemError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:353): `if (releaseError) throw new Error(releaseError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:361): `if (allocateError) throw new Error(allocateError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:381): `if (newOrderError) throw new Error("Failed to create backorder sales order.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:401): `if (boInsertError) throw new Error("Failed to create backordered items.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:410): `if (orderError) throw new Error(orderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:416): `if (deleteOrderError) throw new Error(deleteOrderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:434): `throw new Error("At least one item must be selected.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:463): `throw new Error("Selected sales order items not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:470): `throw new Error("All selected items must belong to the same customer to be billed together.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:495): `throw new Error(\`Failed to fetch items for order ${oId}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:523): `throw new Error(\`Failed to split order: ${newOrderError?.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:532): `throw new Error(\`Failed to move unselected items to cloned order: ${moveError.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:547): `throw new Error(updateError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:561): `throw new Error("Order ID and Bill Number are required.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:564): `throw new Error("Bill Value must be a non-negative amount.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:586): `throw new Error("Sales order not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:589): `throw new Error("Order is not in draft billing state.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:607): `throw new Error(updateError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:651): `if (journalError) throw new Error(journalError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:666): `throw new Error(updateError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:688): `throw new Error(updateError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:705): `throw new Error("Sales order not found or already deleted.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:727): `throw new Error("Failed to reset roll statuses: " + rollUpdateErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:744): `throw new Error("Failed to delete related journal entries: " + journalDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:753): `throw new Error("Failed to delete sales order items: " + itemsDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:761): `throw new Error("Failed to delete sales order: " + orderDelErr.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:788): `throw new Error(orderFetchError?.message || "Order not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:801): `throw new Error(orderError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:814): `throw new Error(res.error.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:949): `if (journalError) throw new Error(journalError.message);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:975): `throw new Error("Department and Raw Material ID are required for raw material sales.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:980): `throw new Error("Bill number, client customer, and sale type are required.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:984): `throw new Error("Quantity and price must be greater than zero.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:999): `throw new Error("Raw material not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1003): `throw new Error(\`Cannot sell ${quantity}. Only ${currentStock} is available in stock.\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1014): `throw new Error("Customer not found.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1060): `throw new Error(\`Failed to create journal entries: ${journalErr.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1081): `throw new Error(\`Failed to save material sale: ${saleErr.message}\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1094): `if (!id) throw new Error("Material sale ID is required.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1103): `if (saleErr) throw new Error(\`Failed to delete material sale: ${saleErr.message}\`);`

### Inventory

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:36): `throw new Error("Purchase date, supplier, and bill number are required.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:39): `throw new Error("Total bill value must be a positive amount.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:42): `throw new Error("At least one purchase item must be added.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:63): `throw new Error(headerError?.message || "Failed to create product purchase record.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:130): `if (stockErr) throw new Error(\`Fabric roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:189): `if (stockErr) throw new Error(\`Roto film roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:213): `if (filmErr || !filmRoll) throw new Error(\`Roto dummy film roll stock insert failed: ${filmErr?.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:236): `if (stockErr) throw new Error(\`Roto metallic roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:313): `if (stockErr) throw new Error(\`Lamination roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:374): `if (stockErr) throw new Error(\`Offset roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:441): `if (stockErr) throw new Error(\`Finishing bundle stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:481): `throw new Error(\`Failed to save purchase item history: ${itemError.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:546): `if (!purchaseId) throw new Error("Purchase ID is required.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:558): `throw new Error("Product purchase not found.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:658): `if (deleteErr) throw new Error(deleteErr.message);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:23): `throw new Error("Purchase date, client, and bill number are required.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:26): `throw new Error("Total bill value must be a positive amount.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:29): `throw new Error("At least one raw material item must be added.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:32): `throw new Error("Every purchase item must have a material, positive quantity, and positive rate.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:57): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:106): `if (!purchaseId) throw new Error("Purchase ID is required.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:118): `throw new Error("Purchase entry not found.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:123): `throw new Error("Purchase entries can only be deleted on the same day they were purchased.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:132): `if (softDeleteError) throw new Error(softDeleteError.message);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:140): `if (deleteError) throw new Error(deleteError.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:22): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:46): `throw new Error("Missing required consumption fields or invalid quantity.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:49): `throw new Error("Quantity must be a multiple of 25.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:67): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:81): `if (!id) throw new Error("Consumption ID is required.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:94): `throw new Error("Consumption log not found.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:109): `throw new Error("You can only delete consumption logs on the day they are created.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:117): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:145): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:154): `if (!rollId) throw new Error("Roll ID is required.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:174): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:191): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:206): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:221): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:236): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:252): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:269): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:285): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:300): `if (error) throw new Error(error.message);`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:35): `throw new Error("Unable to load stock details right now.");`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:43): `throw new Error("Unable to load finishing stock details.");`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:18): `if (error) throw new Error(error.message);`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:43): `throw new Error("Unable to load lamination stock details.");`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:18): `if (error) throw new Error(error.message);`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:43): `throw new Error("Unable to load offset stock details.");`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:18): `if (error) throw new Error(error.message);`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:50): `throw new Error("Unable to load roto stock details.");`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:27): `if (filmError) throw new Error(filmError.message);`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:28): `if (metallicError) throw new Error(metallicError.message);`

### Production

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:66): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:85): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:86): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in downstream stages and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:102): `throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:120): `throw new Error("Invalid production parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:123): `throw new Error("Film type must be gloss or matt.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:135): `throw new Error("Brand not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:183): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:195): `if (!roll) throw new Error("Film roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:196): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:197): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in metallic printing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:200): `if (hasMetallic) throw new Error("This roll is referenced by a metallic printed roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:208): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:224): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:236): `throw new Error("Source film roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:259): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:281): `if (!roll) throw new Error("Metallic roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:282): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:283): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in lamination and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:286): `if (hasLamination) throw new Error("This roll is referenced by a laminated roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:294): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:311): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:323): `throw new Error("Fabric type not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:332): `throw new Error(\`Brand is required for lamination type ${lamType}.\`);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:415): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:436): `if (!roll) throw new Error("Lamination roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:437): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:438): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in offset/finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:441): `if (hasOffset) throw new Error("This roll is referenced by an offset printed roll and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:444): `if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:452): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:470): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:482): `throw new Error("Offset brand not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:488): `if (!fabricTypeId) throw new Error("Source fabric type is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:490): `if (!ft) throw new Error("Source fabric type not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:523): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:535): `if (!roll) throw new Error("Offset roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:536): `if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:537): `if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in finishing and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:540): `if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:548): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:563): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:574): `if (!fabricTypeId) throw new Error("Fabric Type is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:576): `if (!ft) throw new Error("Fabric type not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:581): `if (!lamRollId) throw new Error("Lamination Roll is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:586): `if (!lamRoll) throw new Error("Lamination roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:593): `if (!offsetRollId) throw new Error("Offset Roll is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:598): `if (!offsetRoll) throw new Error("Offset roll not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:604): `throw new Error("Unsupported finishing type.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:630): `if (insertError) throw new Error(insertError.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:646): `if (!bundle) throw new Error("Finishing bundle not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:647): `if ((bundle as any).status === "sold") throw new Error("This bundle has been sold and cannot be deleted.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:655): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:703): `throw new Error("Missing required production entry fields.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:723): `if (error) throw new Error(error.message);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:740): `if (!id) throw new Error("Production entry ID is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:750): `throw new Error("Production entry not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:762): `throw new Error("Invalid production stage.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:773): `if (error) throw new Error(error.message);`

### Reports

Not found in source code.

### Dashboard

Not found in source code.

### Portal

Not found in source code.

### Core

- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:23): `throw new Error("Missing Supabase configuration in .env.local");`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:64): `if (empErr) throw new Error("Failed to create Employee: " + empErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:83): `throw new Error("Failed to create Attendance: " + attErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:96): `throw new Error("Failed to update Attendance: " + uAttErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:103): `if (dAttErr) throw new Error("Failed to delete Attendance: " + dAttErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:104): `if (dEmpErr) throw new Error("Failed to delete Employee: " + dEmpErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:122): `if (custErr) throw new Error("Failed to create Customer: " + custErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:138): `throw new Error("Failed to create product for Sales Order: " + prodErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:156): `throw new Error("Failed to create Sales Order: " + orderErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:175): `throw new Error("Failed to create Sales Order Item: " + itemErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:190): `throw new Error("Failed to update Sales Order Item: " + uItemErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:199): `if (dItemErr) throw new Error("Failed to delete Sales Order Item: " + dItemErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:200): `if (dOrderErr) throw new Error("Failed to delete Sales Order: " + dOrderErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:201): `if (dProdErr) throw new Error("Failed to delete product: " + dProdErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:202): `if (dCustErr) throw new Error("Failed to delete Customer: " + dCustErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:221): `if (matErr) throw new Error("Failed to create Raw Material: " + matErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:239): `throw new Error("Failed to create Raw Material Purchase: " + purErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:257): `throw new Error("Failed to create Raw Material Consumption: " + consErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:271): `throw new Error("Failed to update Consumption: " + uConsErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:279): `if (dConsErr) throw new Error("Failed to delete Consumption: " + dConsErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:280): `if (dPurErr) throw new Error("Failed to delete Purchase: " + dPurErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:281): `if (dMatErr) throw new Error("Failed to delete Raw Material: " + dMatErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:297): `if (loomErr) throw new Error("Failed to create Loom: " + loomErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:314): `throw new Error("Failed to create Fabric Type: " + ftErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:336): `throw new Error("Failed to create Loom Production Entry: " + lpeErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:350): `throw new Error("Failed to find auto-created Fabric Roll: " + rErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:371): `throw new Error("Failed to create Stage Production Entry: " + stageErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:387): `throw new Error("Failed to update Stage Production Entry: " + uStageErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:397): `if (dStageErr) throw new Error("Failed to delete Stage Production Entry: " + dStageErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:398): `if (dRollErr) throw new Error("Failed to delete Fabric Roll: " + dRollErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:399): `if (dLpeErr) throw new Error("Failed to delete Loom Production Entry: " + dLpeErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:400): `if (dFtErr) throw new Error("Failed to delete Fabric Type: " + dFtErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:401): `if (dLoomErr) throw new Error("Failed to delete Loom: " + dLoomErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:420): `if (rErr) throw new Error("Failed to create Roto Product: " + rErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:430): `throw new Error("Failed to update Roto Product: " + urErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:446): `throw new Error("Failed to create Offset Product: " + oErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:458): `throw new Error("Failed to update Offset Product: " + uoErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:474): `throw new Error("Failed to create Roto Color: " + cErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:487): `throw new Error("Failed to update Roto Color: " + ucErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:495): `if (drErr) throw new Error("Failed to delete Roto Product: " + drErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:496): `if (doErr) throw new Error("Failed to delete Offset Product: " + doErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:497): `if (dcErr) throw new Error("Failed to delete Roto Color: " + dcErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:513): `if (sErr) throw new Error("Failed to create Setting: " + sErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:523): `throw new Error("Failed to update Setting: " + usErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:530): `if (dSetting) throw new Error("Failed to delete Setting: " + dSetting.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:547): `if (custErr) throw new Error("Failed to create Customer: " + custErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:567): `throw new Error("Failed to create Journal Entry: " + jErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:573): `throw new Error("Journal account_id linking mismatch!");`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:586): `throw new Error("Failed to update Journal Entry: " + juErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:591): `throw new Error("Journal amount update failed!");`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:598): `if (jdErr) throw new Error("Failed to delete Journal Entry: " + jdErr.message);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:599): `if (cdErr) throw new Error("Failed to delete Customer: " + cdErr.message);`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:40): `throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.");`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:44): `throw new Error("Usage: npm run create-user -- --email user@example.com --password StrongPass123 --name \"Full Name\" --role admin");`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:62): `throw new Error(\`Role "${roleName}" was not found. Run the database migration first.\`);`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:75): `if (authError) throw new Error(authError.message);`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:77): `if (!userId) throw new Error("Supabase did not return a user id.");`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:90): `throw new Error(profileError.message);`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:256): `const throws = [...body.matchAll(/throw new Error\(([^)]+)\)/g)].map((m) => m[1].trim());`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:362): `const formRows = evidence(source, (t) => /<form|FormData|onSubmit|handleSubmit|z\.|required|throw new Error|return \{ error/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:369): `const ruleRows = evidence(source, (t) => /throw new Error|\.refine\(|check\s*\(|\.min\(|\.max\(|\.positive\(|cannot|must be|required|if \(!|if \(error|status ===|status !==|unique|ON DELETE|CASCADE/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:639): `rules += "Rules extracted from \`throw new Error\`, Zod \`.refine\`, SQL \`check\` constraints, and conditional guards.\n\n";`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:645): `rules += bullets(ruleRows.filter((r) => moduleFor(r.file) === mod && /throw new Error/.test(r.text)).slice(0, 80));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:189): `{ name: "validation", re: /z\.|FormData|required|check\s*\(|\.min\(|\.max\(|throw new Error|return \{ error/ },`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:363): `crud += fencedEvidence(evidence.filter((e) => /if \(|switch|case |required|status|check\s*\(|unique|on conflict|throw new Error|return \{ error/i.test(e.text)));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:411): `funcApi += fencedEvidence(evidence.filter((e) => /delete\(|deleted_at|unique|next_year_number|max\(|limit\(500|Promise\.all|transaction|rollback|orphan|TODO|FIXME|any\)|as any|console\.error|throw new Error/i.test(e.text)));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:429): `fileDoc += \`Business logic / calculations / validations / conditions:\n\n${fencedEvidence(rows.filter((e) => ["calculation", "validation", "status-transition", "delete-logic"].includes(e.kind) || /if \(|switch|case |return \{ error|throw new Error/i.test(e.text)))}\`;`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:127): `if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data.");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:144): `if (error) throw new Error("Unable to verify employee attendance access.");`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:145): `if (!data || data.user_id !== user.id) throw new Error("You can only manage your own attendance.");`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:35): `throw new Error("Unable to load roll details right now.");`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:61): `if (!user) throw new Error("Unauthorized.");`
- [src/lib/master-query.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/master-query.ts:57): `if (error) throw new Error(error.message);`
- [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:10): `throw new Error("Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");`

## SQL Check Constraints And Status Enums

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

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1359)-1364: `roto_colors`

```sql
CREATE TABLE IF NOT EXISTS public.roto_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    color_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active'
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

