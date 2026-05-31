"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { modules } from "@/lib/modules";
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
  attendance_date: z.string().min(1),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  status: z.enum(["present", "absent", "half_day", "leave"]),
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
  const user = await requireUser();
  if (user.roles?.name !== "admin") throw new Error("Only admins can manage master data.");

  const config = modules[moduleKey];
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
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
  const user = await requireUser();
  if (user.roles?.name !== "admin") throw new Error("Only admins can deactivate records.");

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
  const user = await requireUser();
  if (user.roles?.name !== "admin") throw new Error("Only admins can manage attendance.");
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

export async function saveProduction(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();
  const fields = ["fabric_type_id", "loom_id", "gross_weight", "core_weight", "end_meters", "remarks"];
  if (user.roles?.name === "admin") fields.push("initial_meters");
  const payload = {
    ...assertValid(productionSchema, readPayload(formData, fields)),
    updated_by: user.id,
  };

  const id = String(formData.get("id") ?? "");
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
  const user = await requireUser();
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
  const user = await requireUser();
  if (user.roles?.name !== "admin") throw new Error("Only admins can manage sales.");
  const supabase = await createClient();
  const selectedRollIds = formData.getAll("selected_roll_ids").map(String);
  const payload = {
    ...assertValid(saleSchema, {
      ...readPayload(formData, ["customer_id", "fabric_type_id", "quantity_meters", "rate", "status"]),
      selected_roll_ids: selectedRollIds,
    }),
    updated_by: user.id,
  };

  const id = String(formData.get("id") ?? "");
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
  const user = await requireUser();
  if (user.roles?.name !== "admin") throw new Error("Only admins can record raw material purchases.");
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
