"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const numericFields = new Set([
  "width",
  "gsm",
  "selling_price",
  "opening_stock",
  "current_stock",
  "salary",
  "gross_weight",
  "core_weight",
  "initial_meters",
  "end_meters",
  "quantity_meters",
  "rate",
]);

function readPayload(formData: FormData, fieldNames: string[]) {
  const payload: Record<string, unknown> = {};
  for (const name of fieldNames) {
    const value = formData.get(name);
    if (value === null || value === "") continue;
    payload[name] = numericFields.has(name) ? Number(value) : String(value);
  }
  return payload;
}

const statusSchema = z.enum(["active", "inactive"]);
const attendanceSchema = z.object({
  employee_id: z.string().uuid(),
});
const productionSchema = z.object({
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
const saleSchema = z.object({
  customer_id: z.string().uuid(),
  fabric_type_id: z.string().uuid(),
  quantity_meters: z.coerce.number().positive(),
  rate: z.coerce.number().min(0),
  status: z.enum(["draft", "confirmed", "cancelled"]),
  selected_roll_ids: z.array(z.string().uuid()),
});
const rawPurchaseSchema = z.object({
  raw_material_id: z.string().uuid(),
  purchase_date: z.string().min(1),
  supplier_name: z.string().optional(),
  bill_number: z.string().optional(),
  quantity: z.coerce.number().positive(),
  rate: z.coerce.number().min(0),
  remarks: z.string().optional(),
});
const createUserSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().trim().optional(),
  role_id: z.string().uuid("Select a valid role."),
  status: statusSchema,
});
const roleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required."),
  description: z.string().trim().optional(),
});

function modulePermissionKey(moduleKey: string) {
  return moduleKey.replaceAll("-", "_");
}

function assertValid<T>(schema: z.ZodType<T>, value: unknown) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data.");
  return parsed.data;
}

function validateMasterPayload(moduleKey: string, payload: Record<string, unknown>) {
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

export async function saveMaster(moduleKey: string, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const user = await requirePermission(`${modulePermissionKey(moduleKey)}.${id ? "edit" : "create"}`);

  const config = modules[moduleKey];
  const supabase = await createClient();
  const payload = validateMasterPayload(moduleKey, readPayload(formData, config.fields.map((field) => field.name))) as Record<string, unknown>;
  payload.updated_by = user.id;
  const table = config.table as any;

  const query = id
    ? (supabase.from(table) as any).update(payload).eq("id", id)
    : (supabase.from(table) as any).insert({ ...payload, created_by: user.id, updated_by: user.id });

  const { error } = await query as any;
  if (error) throw new Error(error.message);
  revalidatePath(config.path);
}

export async function deactivateMaster(moduleKey: string, formData: FormData) {
  const user = await requirePermission(`${modulePermissionKey(moduleKey)}.delete`);

  const config = modules[moduleKey];
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const table = config.table as any;
  const { error } = await (supabase
    .from(table) as any)
    .update({ status: "inactive", deleted_at: new Date().toISOString(), updated_by: user.id })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(config.path);
}

export async function saveAttendance(formData: FormData) {
  const user = await requirePermission("attendance.edit");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const payload = {
    ...assertValid(attendanceSchema, readPayload(formData, ["employee_id", "attendance_date", "check_in", "check_out", "status"])),
    updated_by: user.id,
  };
  const query = id
    ? (supabase.from("attendance") as any).update(payload as any).eq("id", id)
    : (supabase.from("attendance") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
}

export async function checkInAttendance(formData: FormData) {
  const user = await requirePermission("attendance.create");

  const payload = assertValid(attendanceSchema, readPayload(formData, ["employee_id"]));
  const supabase = await createClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const { error } = await (supabase.from("attendance") as any).upsert({
    employee_id: payload.employee_id,
    attendance_date: today,
    check_in_at: now.toISOString(),
    status: "present",
    created_by: user.id,
    updated_by: user.id,
  }, { onConflict: "employee_id,attendance_date" });

  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function checkOutAttendance(formData: FormData) {
  const user = await requirePermission("attendance.edit");

  const payload = assertValid(attendanceSchema, readPayload(formData, ["employee_id"]));
  const supabase = await createClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const { data: existing, error: readError } = await (supabase.from("attendance") as any)
    .select("id, check_in_at")
    .eq("employee_id", payload.employee_id)
    .eq("attendance_date", today)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) throw new Error(readError.message);
  if (!existing?.id) throw new Error("Check in before checking out.");

  const { error } = await (supabase.from("attendance") as any)
    .update({ check_out_at: now.toISOString(), updated_by: user.id })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function saveProduction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const user = await requirePermission(`production.${id ? "edit" : "create"}`);
  const supabase = await createClient();
  const fields = ["fabric_type_id", "loom_id", "gross_weight", "core_weight", "end_meters", "remarks"];
  if (user.roles?.name === "admin") fields.push("initial_meters");
  const payload = {
    ...assertValid(productionSchema, readPayload(formData, fields)),
    updated_by: user.id,
  };

  const query = id
    ? (supabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)
    : (supabase.from("loom_production_entries") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);

  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/production");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
}

export async function softDeleteProduction(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("loom_production_entries") as any)
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id } as any)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/production");
  revalidatePath("/rolls");
}

export async function saveSale(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const user = await requirePermission(`sales.${id ? "edit" : "create"}`);
  const supabase = await createClient();
  const selectedRollIds = formData.getAll("selected_roll_ids").map(String);
  const payload = {
    ...assertValid(saleSchema, {
      ...readPayload(formData, ["customer_id", "fabric_type_id", "quantity_meters", "rate", "status"]),
      selected_roll_ids: selectedRollIds,
    }),
    updated_by: user.id,
  };

  const query = id
    ? (supabase.from("sales_orders") as any).update(payload as any).eq("id", id)
    : (supabase.from("sales_orders") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
}

export async function saveRawMaterialPurchase(formData: FormData) {
  const user = await requirePermission("raw_materials.edit");
  const payload = assertValid(rawPurchaseSchema, readPayload(formData, [
    "raw_material_id",
    "purchase_date",
    "supplier_name",
    "bill_number",
    "quantity",
    "rate",
    "remarks",
  ]));
  const supabase = await createClient();
  const { error } = await supabase.from("raw_material_purchases").insert({
    ...payload,
    created_by: user.id,
    updated_by: user.id,
  } as any);
  if (error) throw new Error(error.message);
  revalidatePath("/raw-materials");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function createErpUser(_: unknown, formData: FormData) {
  await requirePermission("users.create");

  const parsed = createUserSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    role_id: formData.get("role_id"),
    status: formData.get("status") || "active",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid user details." };

  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
    },
  });

  if (authError) return { error: authError.message };
  const authUserId = authData.user?.id;
  if (!authUserId) return { error: "Supabase did not return a user id." };

  const { error: profileError } = await admin.from("users").upsert({
    id: authUserId,
    role_id: parsed.data.role_id,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    status: parsed.data.status,
  } as any);

  if (profileError) {
    await admin.auth.admin.deleteUser(authUserId);
    return { error: profileError.message };
  }

  revalidatePath("/users");
  return { success: "Supabase Auth user created. Share the password securely with the user." };
}

export async function createRole(formData: FormData) {
  await requirePermission("roles.create");
  const payload = assertValid(roleSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createClient();
  const { error } = await (supabase.from("roles") as any).insert({
    name: payload.name,
    description: payload.description ?? null,
    is_active: true,
  } as any);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function saveRoleDetails(formData: FormData) {
  await requirePermission("roles.edit");
  const roleId = String(formData.get("role_id") ?? "");
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const payload = assertValid(roleSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createClient();
  const { error } = await (supabase
    .from("roles") as any)
    .update({
      name: payload.name,
      description: payload.description ?? null,
    } as any)
    .eq("id", roleId);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function deactivateRole(formData: FormData) {
  await requirePermission("roles.delete");
  const roleId = String(formData.get("role_id") ?? "");
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const supabase = await createClient();
  const { error } = await (supabase
    .from("roles") as any)
    .update({ is_active: false, deleted_at: new Date().toISOString() } as any)
    .eq("id", roleId);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function saveRolePermissions(formData: FormData) {
  await requirePermission("roles.edit");
  const roleId = String(formData.get("role_id") ?? "");
  const permissionIds = formData.getAll("permission_ids").map(String);
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const supabase = await createClient();
  const { error: deleteError } = await (supabase.from("role_permissions") as any).delete().eq("role_id", roleId);
  if (deleteError) throw new Error(deleteError.message);
  if (permissionIds.length > 0) {
    const rows = permissionIds.map((permissionId) => ({ role_id: roleId, permission_id: permissionId }));
    const { error: insertError } = await (supabase.from("role_permissions") as any).insert(rows as any);
    if (insertError) throw new Error(insertError.message);
  }
  revalidatePath("/roles");
}
