import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSessionPermissions, requirePermission } from "@/lib/auth";
import type { AppUser } from "@/lib/database.types";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

export const numericFields = new Set([
  "width",
  "gsm",
  "selling_price",
  "opening_stock",
  "current_stock",
  "critical_level",
  "salary",
  "gross_weight",
  "core_weight",
  "initial_meters",
  "end_meters",
  "quantity",
  "quantity_meters",
  "rate",
]);

export function sanitizeText(value: FormDataEntryValue) {
  return String(value).trim().replace(/\s+/g, " ");
}

export function revalidateAllReports() {
  revalidatePath("/reports");
  revalidatePath("/reports/accounts");
  revalidatePath("/reports/opening-balance");
  revalidatePath("/reports/closing-stock");
  revalidatePath("/reports/profit-loss");
  revalidatePath("/reports/balance-sheet");
  revalidatePath("/reports/sales-confirmation");
  revalidatePath("/reports/stock");
}

export function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function readPayload(formData: FormData, fieldNames: string[]) {
  const payload: Record<string, unknown> = {};
  for (const name of fieldNames) {
    const value = formData.get(name);
    if (value === null || value === "") continue;
    payload[name] = numericFields.has(name) ? Number(Number(value).toFixed(2)) : sanitizeText(value);
  }
  return payload;
}

export const statusSchema = z.enum(["active", "inactive"]);

export const attendanceSchema = z.object({
  employee_id: z.string().uuid(),
});

export const productionSchema = z.object({
  fabric_type_id: z.string().uuid(),
  loom_id: z.string().uuid(),
  gross_weight: z.coerce.number().positive(),
  core_weight: z.coerce.number().min(0),
  initial_meters: z.coerce.number().min(0).optional(),
  end_meters: z.coerce.number().min(0),
  remarks: z.string().optional(),
}).refine((value) => value.gross_weight >= value.core_weight, {
  message: "Gross weight must be greater than or equal to core weight.",
});

export const saleSchema = z.object({
  customer_id: z.string().uuid(),
  fabric_type_id: z.string().uuid(),
  quantity_meters: z.coerce.number().positive(),
  rate: z.coerce.number().min(0),
  status: z.enum(["draft", "confirmed", "cancelled"]),
  selected_roll_ids: z.array(z.string().uuid()),
});

export const rawPurchaseSchema = z.object({
  raw_material_id: z.string().uuid(),
  purchase_date: z.string().min(1),
  supplier_name: z.string().optional(),
  bill_number: z.string().optional(),
  quantity: z.coerce.number().positive(),
  rate: z.coerce.number().min(0),
  remarks: z.string().optional(),
});

export const createUserSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required.").transform(val => val.toUpperCase()),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().trim().optional(),
  role_id: z.string().uuid("Select a valid role."),
  status: statusSchema,
});

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required.").transform(val => val.toUpperCase()),
  description: z.string().trim().optional().transform(val => val ? val.toUpperCase() : val),
});

export const employeeUserLinkSchema = z.object({
  user_id: z.string().uuid(),
  employee_id: z.string().uuid().optional(),
});

// SEC-15 / ISS-020: Explicit allowlist of valid module keys
export const ALLOWED_MODULE_KEYS = new Set([
  "looms", "fabric-types", "raw-materials", "employees", "customers", "roto-colors",
]);

export function modulePermissionKey(moduleKey: string) {
  return moduleKey.replaceAll("-", "_");
}

export function assertValid<T>(schema: z.ZodType<T>, value: unknown) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data.");
  return parsed.data;
}

export async function assertAttendanceAccess(supabase: any, user: AppUser, employeeId: string) {
  const permissions = await getSessionPermissions(user);
  if (user.roles?.name === "admin" || permissions.includes("employees.edit")) return;


  const { data, error } = await (supabase
    .from("employees")
    .select("id, user_id")
    .eq("id", employeeId)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle() as any);

  if (error) throw new Error("Unable to verify employee attendance access.");
  if (!data || data.user_id !== user.id) throw new Error("You can only manage your own attendance.");
}

export function validateMasterPayload(moduleKey: string, payload: Record<string, unknown>) {
  const numericPositive = new Set(["width", "gsm"]);
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of modules[moduleKey].fields) {
    if (field.name === "status") {
      shape[field.name] = statusSchema;
    } else if (numericFields.has(field.name)) {
      const numeric = numericPositive.has(field.name) ? z.number().positive() : z.number().min(0);
      shape[field.name] = field.required ? numeric : numeric.optional();
    } else {
      const text = field.required ? z.string().trim().min(1) : z.string().trim().optional();
      shape[field.name] = text;
    }
  }
  return assertValid(z.object(shape), payload);
}

// DB-02 / DB-03 / PERF-01: Use the DB RPC get_next_journal_no()
export async function generateNextJournalNo(supabase: any): Promise<string> {
  const { data, error } = await supabase.rpc("get_next_journal_no");
  if (!error && data) {
    return String(data);
  }
  const { data: dbJournals } = await supabase
    .from("accounts_journal")
    .select("journal_no")
    .is("deleted_at", null);
  const journalNos = ((dbJournals ?? []) as Array<{ journal_no: string | null }>)
    .map((j) => j.journal_no)
    .filter((no): no is string => Boolean(no));
  let nextInt = 1;
  for (const no of journalNos) {
    const match = no.match(/JE-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val >= nextInt) nextInt = val + 1;
    }
  }
  return `JE-${String(nextInt).padStart(6, "0")}`;
}
