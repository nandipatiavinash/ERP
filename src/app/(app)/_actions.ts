"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionPermissions, requirePermission } from "@/lib/auth";
import type { AppUser } from "@/lib/database.types";
import { modules } from "@/lib/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const numericFields = new Set([
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

function sanitizeText(value: FormDataEntryValue) {
  return String(value).trim().replace(/\s+/g, " ");
}

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function readPayload(formData: FormData, fieldNames: string[]) {
  const payload: Record<string, unknown> = {};
  for (const name of fieldNames) {
    const value = formData.get(name);
    if (value === null || value === "") continue;
    payload[name] = numericFields.has(name) ? Number(Number(value).toFixed(2)) : sanitizeText(value);
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
  full_name: z.string().trim().min(2, "Full name is required.").transform(val => val.toUpperCase()),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().trim().optional(),
  role_id: z.string().uuid("Select a valid role."),
  status: statusSchema,
});
const roleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required.").transform(val => val.toUpperCase()),
  description: z.string().trim().optional().transform(val => val ? val.toUpperCase() : val),
});
const employeeUserLinkSchema = z.object({
  user_id: z.string().uuid(),
  employee_id: z.string().uuid().optional(),
});

function modulePermissionKey(moduleKey: string) {
  return moduleKey.replaceAll("-", "_");
}

function assertValid<T>(schema: z.ZodType<T>, value: unknown) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data.");
  return parsed.data;
}

async function assertAttendanceAccess(supabase: Awaited<ReturnType<typeof createClient>>, user: AppUser, employeeId: string) {
  const permissions = await getSessionPermissions(user);
  if (permissions.includes("employees.view") || permissions.includes("users.view")) return;

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
  if (moduleKey === "fabric-types" && !id) {
    payload.width = 1;
    payload.gsm = 1;
    payload.selling_price = 0;
  }
  if (moduleKey === "raw-materials" && !payload.unit) {
    payload.unit = "-";
  }
  payload.updated_by = user.id;
  const table = config.table as any;

  let finalPayload = { ...payload };

  const buildQuery = (p: Record<string, unknown>) =>
    id
      ? (supabase.from(table) as any).update(p).eq("id", id)
      : (supabase.from(table) as any).insert({ ...p, created_by: user.id, updated_by: user.id });

  let { error } = await buildQuery(finalPayload) as any;

  // If description column doesn't exist yet in DB (migration pending), retry without it
  if (error && /could not find the 'description' column/i.test(error.message)) {
    const { description: _dropped, ...payloadWithoutDesc } = finalPayload;
    finalPayload = payloadWithoutDesc;
    const retry = await buildQuery(finalPayload) as any;
    error = retry.error;
  }

  if (error) {
    console.error('saveMaster error for module', moduleKey, ':', error);
    throw new Error(`Failed to save ${moduleKey}: ${error.message}`);
  }
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
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(config.path);
}

export async function checkInAttendance(formData: FormData) {
  const user = await requirePermission("attendance.create");

  const payload = assertValid(attendanceSchema, readPayload(formData, ["employee_id"]));
  const supabase = await createClient();
  await assertAttendanceAccess(supabase, user, payload.employee_id);
  const now = new Date();
  const today = todayInIndia();

  const { data: existing, error: readError } = await (supabase.from("attendance") as any)
    .select("id, check_in_at")
    .eq("employee_id", payload.employee_id)
    .eq("attendance_date", today)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) throw new Error("Unable to verify today's attendance.");
  if (existing?.check_in_at) throw new Error("This employee is already checked in today.");

  const write = existing?.id
    ? (supabase.from("attendance") as any).update({
      check_in_at: now.toISOString(),
      check_out_at: null,
      check_out: null,
      status: "present",
      updated_by: user.id,
    }).eq("id", existing.id)
    : (supabase.from("attendance") as any).insert({
    employee_id: payload.employee_id,
    attendance_date: today,
    check_in_at: now.toISOString(),
    status: "present",
    created_by: user.id,
    updated_by: user.id,
  });

  const { error } = await write;
  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function checkOutAttendance(formData: FormData) {
  const user = await requirePermission("attendance.edit");

  const payload = assertValid(attendanceSchema, readPayload(formData, ["employee_id"]));
  const supabase = await createClient();
  await assertAttendanceAccess(supabase, user, payload.employee_id);
  const now = new Date();
  const today = todayInIndia();

  const { data: existing, error: readError } = await (supabase.from("attendance") as any)
    .select("id, check_in_at, check_out_at")
    .eq("employee_id", payload.employee_id)
    .eq("attendance_date", today)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) throw new Error(readError.message);
  if (!existing?.id) throw new Error("Check in before checking out.");
  if (existing.check_out_at) throw new Error("This employee is already checked out today.");
  if (!existing.check_in_at || now.getTime() <= new Date(existing.check_in_at).getTime()) throw new Error("Check out time must be after check in time.");

  const { error } = await (supabase.from("attendance") as any)
    .update({ check_out_at: now.toISOString(), updated_by: user.id })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function linkEmployeeUser(formData: FormData) {
  const user = await requirePermission("users.edit");
  const permissions = await getSessionPermissions(user);
  if (!permissions.includes("employees.edit")) throw new Error("You need employee edit permission to link users to employees.");

  const parsed = assertValid(employeeUserLinkSchema, {
    user_id: formData.get("user_id"),
    employee_id: formData.get("employee_id") || undefined,
  });

  const supabase = await createClient();
  const { error: clearError } = await (supabase.from("employees") as any)
    .update({ user_id: null, updated_by: user.id })
    .eq("user_id", parsed.user_id);
  if (clearError) throw new Error("Unable to update employee link.");

  if (parsed.employee_id) {
    const { error: linkError } = await (supabase.from("employees") as any)
      .update({ user_id: parsed.user_id, updated_by: user.id })
      .eq("id", parsed.employee_id);
    if (linkError) throw new Error("Unable to link employee to user.");
  }

  revalidatePath("/users");
  revalidatePath("/employees");
  revalidatePath("/attendance");
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
  revalidatePath("/fabric/production");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
  revalidatePath("/fabric/stock");
}

export async function softDeleteProduction(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("loom_production_entries") as any)
    .delete()
    .eq("id", id);
  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[softDeleteProduction] failed", {
        id,
        userId: user.id,
        message: error.message,
      });
    }
    throw new Error(error.message);
  }
  revalidatePath("/fabric/production");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
  revalidatePath("/fabric/stock");
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

  const purchase_date = String(formData.get("purchase_date") ?? "");
  const supplier_name = String(formData.get("supplier_name") ?? "");
  const bill_number = String(formData.get("bill_number") ?? "");
  const remarks = String(formData.get("remarks") ?? "").trim();

  const raw_material_ids = formData.getAll("raw_material_id").map(String);
  const quantities = formData.getAll("quantity").map(Number);
  const rates = formData.getAll("rate").map(Number);
  const totalBillValue = Number(formData.get("total_bill_value") ?? 0);

  if (!purchase_date || !supplier_name || !bill_number) {
    throw new Error("Purchase date, client, and bill number are required.");
  }
  if (!Number.isFinite(totalBillValue) || totalBillValue <= 0) {
    throw new Error("Total bill value must be a positive amount.");
  }
  if (raw_material_ids.length === 0) {
    throw new Error("At least one raw material item must be added.");
  }
  if (raw_material_ids.some((id) => !id) || quantities.some((qty) => qty <= 0) || rates.some((rate) => rate <= 0)) {
    throw new Error("Every purchase item must have a material, positive quantity, and positive rate.");
  }

  const finalRemarks = `[TOTAL_BILL_VALUE:${totalBillValue.toFixed(2)}] ${remarks}`.trim();
  const supabase = await createClient();

  const inserts = raw_material_ids.map((id, index) => {
    const qty = quantities[index] ?? 0;
    const rt = rates[index] ?? 0;
    return {
      purchase_date,
      supplier_name: supplier_name || null,
      bill_number: bill_number || null,
      raw_material_id: id,
      quantity: qty,
      rate: rt,
      remarks: finalRemarks,
      created_by: user.id,
      updated_by: user.id,
    };
  });

  const { error } = await supabase.from("raw_material_purchases").insert(inserts as any);
  if (error) throw new Error(error.message);

  // Auto-generate journal entries for purchase
  try {
    const [purchaseAcResult, supplierAcResult] = await Promise.all([
      supabase.from("customers").select("id").eq("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),
      supabase.from("customers").select("id").eq("customer_name", supplier_name).is("deleted_at", null).maybeSingle()
    ]);
    const purchaseAc = purchaseAcResult.data as any;
    const supplierAc = supplierAcResult.data as any;

    const journalNo = await generateNextJournalNo(supabase);
    const journalInserts = [
      {
        journal_no: journalNo,
        entry_date: purchase_date,
        account_id: purchaseAc?.id ?? null,
        account_name: "Purchase A/c",
        entry_type: "debit",
        amount: totalBillValue,
        description: `${bill_number} (${supplier_name})`,
        created_by: user.id,
        updated_by: user.id,
      },
      {
        journal_no: journalNo,
        entry_date: purchase_date,
        account_id: supplierAc?.id ?? null,
        account_name: supplier_name,
        entry_type: "credit",
        amount: totalBillValue,
        description: bill_number,
        created_by: user.id,
        updated_by: user.id,
      },
    ];
    await (supabase.from("accounts_journal") as any).insert(journalInserts);
  } catch (_journalErr) {
    // Purchase saved successfully, journal auto-gen is best-effort
    console.error("Auto-journal for purchase failed:", _journalErr);
  }

  revalidatePath("/raw-materials");
  revalidatePath("/accounts/purchase");
  revalidatePath("/accounts/journal");
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

  if (authError) return { error: "Unable to create Supabase Auth user. Verify the email is not already registered." };
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
    return { error: "Unable to create ERP user profile." };
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
    .delete()
    .eq("id", roleId);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function saveRolePermissions(formData: FormData) {
  const user = await requirePermission("roles.edit");
  const roleId = String(formData.get("role_id") ?? "");
  const permissionIds = formData.getAll("permission_ids").map(String);
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const supabase = await createClient();
  const { error: deleteError } = await (supabase.from("role_permissions") as any).delete().eq("role_id", roleId);
  if (deleteError) throw new Error(deleteError.message);
  if (permissionIds.length > 0) {
    const rows = permissionIds.map((permissionId) => ({ role_id: roleId, permission_id: permissionId, created_by: user.id }));
    const { error: insertError } = await (supabase.from("role_permissions") as any).insert(rows as any);
    if (insertError) throw new Error(insertError.message);
  }
  revalidatePath("/roles");
  revalidatePath("/admin/permissions");
}

export async function updateCriticalLevel(formData: FormData) {
  const user = await requirePermission("raw_materials.edit");
  const materialId = String(formData.get("material_id") ?? "");
  const criticalLevel = Number(formData.get("critical_level") ?? 0);

  const supabase = await createClient();
  const { error } = await (supabase
    .from("raw_materials") as any)
    .update({ critical_level: criticalLevel, updated_by: user.id })
    .eq("id", materialId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/critical-levels");
  revalidatePath("/admin/raw-materials");
}

export async function saveRotoProduct(formData: FormData) {
  await requirePermission("roto_products.create");
  const id = String(formData.get("id") ?? "");
  const brand = String(formData.get("brand") ?? "").trim();
  const width = Number(formData.get("width") ?? 0);
  const height = Number(formData.get("height") ?? 0);
  const numCylinders = Number(formData.get("num_cylinders") ?? 0);
  const status = String(formData.get("status") ?? "active");
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  let imageUrl = String(formData.get("image_url") ?? "");

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `roto/${fileName}`;

    await adminSupabase.storage.createBucket("products", { public: true }).catch(() => {});

    const { error: uploadError } = await adminSupabase.storage
      .from("products")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

    const { data } = adminSupabase.storage
      .from("products")
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  const payload = {
    brand,
    width,
    height,
    num_cylinders: numCylinders,
    image_url: imageUrl || null,
    status,
  };

  const query = id 
    ? (supabase.from("roto_products") as any).update(payload).eq("id", id)
    : (supabase.from("roto_products") as any).insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}

export async function deactivateRotoProduct(formData: FormData) {
  await requirePermission("roto_products.delete");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("roto_products") as any)
    .update({ status: "inactive" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function saveOffsetProduct(formData: FormData) {
  await requirePermission("offset_products.create");
  const id = String(formData.get("id") ?? "");
  const brand = String(formData.get("brand") ?? "").trim();
  const width = Number(formData.get("width") ?? 0);
  const height = Number(formData.get("height") ?? 0);
  const status = String(formData.get("status") ?? "active");
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  let imageUrl = String(formData.get("image_url") ?? "");

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `offset/${fileName}`;

    await adminSupabase.storage.createBucket("products", { public: true }).catch(() => {});

    const { error: uploadError } = await adminSupabase.storage
      .from("products")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

    const { data } = adminSupabase.storage
      .from("products")
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  const payload = {
    brand,
    width,
    height,
    image_url: imageUrl || null,
    status,
  };

  const query = id 
    ? (supabase.from("offset_products") as any).update(payload).eq("id", id)
    : (supabase.from("offset_products") as any).insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}

export async function deactivateOffsetProduct(formData: FormData) {
  await requirePermission("offset_products.delete");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("offset_products") as any)
    .update({ status: "inactive" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function createSalesOrder(formData: FormData) {
  const user = await requirePermission("sales.create");
  const customerId = String(formData.get("customer_id") ?? "");
  const orderDate = String(formData.get("order_date") ?? "");

  const supabase = await createClient();

  const dateParts = orderDate.split("-");
  const mmDd = `${dateParts[1]}-${dateParts[2]}`;
  const { data: existing } = await (supabase
    .from("sales_orders") as any)
    .select("order_number")
    .eq("order_date", orderDate)
    .is("deleted_at", null);
  
  let maxSeq = 0;
  for (const order of (existing || []) as any[]) {
    const num = order.order_number;
    if (num.startsWith(`${mmDd}-`)) {
      const parts = num.split("-");
      const seq = Number(parts[2]);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }
  const orderNumber = `${mmDd}-${String(maxSeq + 1).padStart(2, "0")}`;

  const { data: orderHeader, error: headerError } = await (supabase
    .from("sales_orders") as any)
    .insert({
      customer_id: customerId,
      order_date: orderDate,
      order_number: orderNumber,
      status: "draft",
      created_by: user.id,
      updated_by: user.id
    })
    .select("id")
    .single();

  if (headerError) throw new Error(headerError.message);

  const departments = formData.getAll("department").map(String);
  const productIds = formData.getAll("product_id").map(String);
  const quantities = formData.getAll("quantity").map(Number);

  const itemsPayload = departments.map((dept, idx) => ({
    sales_order_id: (orderHeader as any).id,
    department: dept,
    product_id: productIds[idx],
    quantity: quantities[idx],
  }));

  if (itemsPayload.length > 0) {
    const { error: itemsError } = await (supabase
      .from("sales_order_items") as any)
      .insert(itemsPayload);
    
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/sales/delivery-entry");
}

export async function confirmSalesDelivery(orderId: string, itemRolls: Record<string, string[]>) {
  const user = await requirePermission("sales.edit");
  const supabase = await createClient();

  const { data: items, error: itemsError } = await (supabase
    .from("sales_order_items") as any)
    .select("id, selected_roll_ids")
    .eq("sales_order_id", orderId);

  if (itemsError) throw new Error(itemsError.message);

  for (const item of (items ?? []) as any[]) {
    const newRollIds = itemRolls[item.id] || [];
    const oldRollIds = (item.selected_roll_ids as string[]) || [];

    const { error: updateItemError } = await (supabase
      .from("sales_order_items") as any)
      .update({ selected_roll_ids: newRollIds } as any)
      .eq("id", item.id);

    if (updateItemError) throw new Error(updateItemError.message);

    const releasedRollIds = oldRollIds.filter((id) => !newRollIds.includes(id));
    if (releasedRollIds.length > 0) {
      const { error: releaseError } = await (supabase
        .from("fabric_rolls") as any)
        .update({ status: "available", updated_by: user.id } as any)
        .in("id", releasedRollIds);
      if (releaseError) throw new Error(releaseError.message);
    }

    if (newRollIds.length > 0) {
      const { error: allocateError } = await (supabase
        .from("fabric_rolls") as any)
        .update({ status: "sold", updated_by: user.id } as any)
        .in("id", newRollIds);
      if (allocateError) throw new Error(allocateError.message);
    }
  }

  const { error: orderError } = await (supabase
    .from("sales_orders") as any)
    .update({ status: "confirmed", updated_by: user.id } as any)
    .eq("id", orderId);

  if (orderError) throw new Error(orderError.message);

  revalidatePath("/sales/order-confirmation");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
}

export async function saveRawMaterialConsumption(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const rawMaterialId = String(formData.get("raw_material_id") ?? "");
  const department = String(formData.get("department") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const consumptionDate = String(formData.get("consumption_date") ?? "");
  const remarks = String(formData.get("remarks") ?? "");

  if (!rawMaterialId || !department || quantity <= 0 || !consumptionDate) {
    throw new Error("Missing required consumption fields or invalid quantity.");
  }

  const supabase = await createClient();
  const payload = {
    raw_material_id: rawMaterialId,
    department,
    quantity,
    consumption_date: consumptionDate,
    remarks: remarks || null,
    updated_by: user.id,
  };

  const query = id
    ? (supabase.from("raw_material_consumptions") as any).update(payload).eq("id", id)
    : (supabase.from("raw_material_consumptions") as any).insert({ ...payload, created_by: user.id });

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/fabric/consumption");
  revalidatePath("/roto-printing/consumption");
  revalidatePath("/lamination/consumption");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
  revalidatePath("/raw-materials");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function softDeleteRawMaterialConsumption(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("raw_material_consumptions") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/consumption");
  revalidatePath("/roto-printing/consumption");
  revalidatePath("/lamination/consumption");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
  revalidatePath("/raw-materials");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function saveStageProduction(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const rollId = String(formData.get("roll_id") ?? "");
  const stage = String(formData.get("stage") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  const entryDate = String(formData.get("entry_date") ?? "");
  const remarks = String(formData.get("remarks") ?? "");

  // Gather specific details depending on stage
  const details: Record<string, any> = {};
  if (stage === "roto_printing") {
    details.color_id = String(formData.get("color_id") ?? "");
    details.cylinders = Number(formData.get("cylinders") ?? 0);
  } else if (stage === "lamination") {
    details.adhesive = String(formData.get("adhesive") ?? "");
  } else if (stage === "finishing") {
    details.packaging = String(formData.get("packaging") ?? "");
  }

  if (!rollId || !stage || !entryDate) {
    throw new Error("Missing required production entry fields.");
  }

  const supabase = await createClient();
  const payload = {
    roll_id: rollId,
    stage,
    product_id: productId || null,
    details,
    entry_date: entryDate,
    remarks: remarks || null,
    updated_by: user.id,
  };

  const query = id
    ? (supabase.from("stage_production_entries") as any).update(payload).eq("id", id)
    : (supabase.from("stage_production_entries") as any).insert({ ...payload, created_by: user.id });

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/production");
  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/production");
  revalidatePath("/finishing/stock");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function softDeleteStageProduction(formData: FormData) {
  const user = await requirePermission("production.edit");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("stage_production_entries") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/production");
  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/production");
  revalidatePath("/finishing/stock");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function saveJournalEntry(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const journalNo = String(formData.get("journal_no") ?? "");
  const entryDate = String(formData.get("entry_date") ?? "");
  const rowsJson = String(formData.get("rows_json") ?? "");
  const originalJournalNo = String(formData.get("original_journal_no") ?? "");

  if (!journalNo || !entryDate || !rowsJson) {
    throw new Error("Missing required journal fields.");
  }

  type JournalFormRow = {
    account_name: string;
    description: string;
    debit: number;
    credit: number;
  };
  type JournalInsertRow = {
    journal_no: string;
    entry_date: string;
    account_name: string;
    entry_type: "debit" | "credit";
    amount: number;
    description: string;
    created_by: string;
    updated_by: string;
  };

  const rows = JSON.parse(rowsJson) as JournalFormRow[];

  if (rows.length < 2) {
    throw new Error("At least 2 rows are required for a journal entry.");
  }

  // Validate totals and rows
  let totalDebit = 0;
  let totalCredit = 0;
  for (const r of rows) {
    if (!r.account_name) throw new Error("Account name is required on all rows.");
    if (r.debit > 0 && r.credit > 0) throw new Error("A row cannot contain both Debit and Credit.");
    if (r.debit <= 0 && r.credit <= 0) throw new Error("Either Debit or Credit must be entered on all rows.");
    if (r.debit > 0) {
      if (r.debit <= 0) throw new Error("Amount must be positive.");
      totalDebit += r.debit;
    }
    if (r.credit > 0) {
      if (r.credit <= 0) throw new Error("Amount must be positive.");
      totalCredit += r.credit;
    }
  }

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error("Total Debit must be equal to Total Credit before submitting.");
  }

  const supabase = await createClient();

  // If editing (originalJournalNo exists), soft delete old rows first
  if (originalJournalNo) {
    const { error: deleteError } = await (supabase
      .from("accounts_journal") as any)
      .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
      .eq("journal_no", originalJournalNo);
    if (deleteError) throw new Error(deleteError.message);
  }

  // Resolve account_ids from names/aliases dynamically on the server
  const { data: matchedCustomersData } = await supabase
    .from("customers")
    .select("id, customer_name, alias")
    .is("deleted_at", null);

  const matchedCustomers = (matchedCustomersData ?? []) as any[];
  const nameToIdMap = new Map<string, string>();
  for (const c of matchedCustomers) {
    nameToIdMap.set(c.customer_name.toLowerCase().trim(), c.id);
    if (c.alias) {
      nameToIdMap.set(c.alias.toLowerCase().trim(), c.id);
    }
  }

  // Insert new rows
  const inserts = rows.map((r) => {
    const cleanName = r.account_name.toLowerCase().trim();
    const accountId = nameToIdMap.get(cleanName) || null;
    return {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: accountId,
      account_name: r.account_name,
      entry_type: r.debit > 0 ? "debit" : "credit",
      amount: r.debit > 0 ? r.debit : r.credit,
      description: r.description,
      created_by: user.id,
      updated_by: user.id,
    };
  });

  const { error: insertError } = await (supabase.from("accounts_journal") as any).insert(inserts);
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/accounts/journal");
  revalidatePath("/accounts/sales");
  revalidatePath("/reports");
}

export async function softDeleteJournalEntry(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("accounts_journal") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/accounts/journal");
  revalidatePath("/accounts/sales");
  revalidatePath("/reports");
}

export async function softDeleteJournalEntryGroup(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const journalNo = String(formData.get("journal_no") ?? "");
  if (!journalNo) throw new Error("Missing journal number.");
  const supabase = await createClient();
  const { error } = await (supabase
    .from("accounts_journal") as any)
    .delete()
    .eq("journal_no", journalNo);

  if (error) throw new Error(error.message);

  revalidatePath("/accounts/journal");
  revalidatePath("/accounts/sales");
  revalidatePath("/reports");
}

// --- Helper: generate next journal number ---
async function generateNextJournalNo(supabase: any): Promise<string> {
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

export async function saveSalesOrderBilling(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const orderId = String(formData.get("order_id") ?? "");
  const billNumber = String(formData.get("bill_number") ?? "").trim();
  const billValue = Number(formData.get("bill_value") ?? 0);

  if (!orderId || !billNumber) {
    throw new Error("Order ID and Bill Number are required.");
  }
  if (!Number.isFinite(billValue) || billValue <= 0) {
    throw new Error("Bill Value must be a positive amount.");
  }

  const supabase = await createClient();

  // Fetch the order with customer name
  const { data: order, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select("id, customer_id, order_date, customers(customer_name)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) throw new Error("Sales order not found.");

  const customerName = (order as any).customers?.customer_name ?? "Unknown";
  const entryDate = (order as any).order_date ?? todayInIndia();

  // Update sales order with billing info
  const { error: updateError } = await (supabase
    .from("sales_orders") as any)
    .update({
      bill_number: billNumber,
      bill_value: billValue,
      updated_by: user.id,
    } as any)
    .eq("id", orderId);

  if (updateError) throw new Error(updateError.message);

  const [customerAcResult, salesAcResult] = await Promise.all([
    supabase.from("customers").select("id").eq("customer_name", customerName).is("deleted_at", null).maybeSingle(),
    supabase.from("customers").select("id").eq("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()
  ]);
  const customerAc = customerAcResult.data as any;
  const salesAc = salesAcResult.data as any;

  const journalNo = await generateNextJournalNo(supabase);
  const journalInserts = [
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: customerAc?.id ?? null,
      account_name: customerName,
      entry_type: "debit",
      amount: billValue,
      description: billNumber,
      created_by: user.id,
      updated_by: user.id,
    },
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: salesAc?.id ?? null,
      account_name: "Sales A/c",
      entry_type: "credit",
      amount: billValue,
      description: `${billNumber} (${customerName})`,
      created_by: user.id,
      updated_by: user.id,
    },
  ];

  const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
  if (journalError) throw new Error(journalError.message);

  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/journal");
  revalidatePath("/sales/order-confirmation");
  revalidatePath("/reports");
}

export async function deleteSalesOrderCompletely(orderId: string) {
  const user = await requirePermission("sales.edit");
  const supabase = await createClient();

  const { data: order, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select("id, bill_number, sales_order_items(id, selected_roll_ids)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Sales order not found or already deleted.");
  }

  const orderData = order as any;
  const billNumber = orderData.bill_number;
  const items = orderData.sales_order_items || [];

  const rollIds: string[] = [];
  for (const item of items) {
    if (item.selected_roll_ids && Array.isArray(item.selected_roll_ids)) {
      rollIds.push(...item.selected_roll_ids);
    }
  }

  if (rollIds.length > 0) {
    const { error: rollUpdateErr } = await (supabase
      .from("fabric_rolls") as any)
      .update({ status: "available", updated_by: user.id })
      .in("id", rollIds);
    if (rollUpdateErr) {
      throw new Error("Failed to reset roll statuses: " + rollUpdateErr.message);
    }
  }

  if (billNumber) {
    const { data: journalRows } = await (supabase
      .from("accounts_journal") as any)
      .select("journal_no")
      .or(`description.eq."${billNumber}",description.like."${billNumber} (%)"`);
    
    const journalNos = (journalRows || []).map((r: any) => r.journal_no);
    if (journalNos.length > 0) {
      const { error: journalDelErr } = await (supabase
        .from("accounts_journal") as any)
        .delete()
        .in("journal_no", journalNos);
      if (journalDelErr) {
        throw new Error("Failed to delete related journal entries: " + journalDelErr.message);
      }
    }
  }

  const { error: itemsDelErr } = await (supabase
    .from("sales_order_items") as any)
    .delete()
    .eq("sales_order_id", orderId);
  if (itemsDelErr) {
    throw new Error("Failed to delete sales order items: " + itemsDelErr.message);
  }

  const { error: orderDelErr } = await (supabase
    .from("sales_orders") as any)
    .delete()
    .eq("id", orderId);
  if (orderDelErr) {
    throw new Error("Failed to delete sales order: " + orderDelErr.message);
  }

  revalidatePath("/sales/delivery-entry");
  revalidatePath("/sales/order-confirmation");
  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/journal");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
  revalidatePath("/reports");
}
