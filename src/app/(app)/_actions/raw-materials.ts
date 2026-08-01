"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  todayInIndia,
  assertValid
} from "./helpers";

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

export async function saveRawMaterialConsumption(formData: FormData) {
  const department = String(formData.get("department") ?? "");
  const permissionMap: Record<string, string> = {
    fabric: "fabric.consumption",
    roto_printing: "roto_printing.consumption",
    lamination: "lamination.consumption",
    offset_printing: "offset_printing.consumption",
    finishing: "finishing.consumption",
  };
  const permission = permissionMap[department] || "fabric.consumption";
  const user = await requirePermission(permission);

  const id = String(formData.get("id") ?? "");
  const rawMaterialId = String(formData.get("raw_material_id") ?? "");
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
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Consumption ID is required.");

  await requirePermission("fabric.consumption");

  const supabase = await createClient();

  const { data: entry, error: fetchError } = await (supabase
    .from("raw_material_consumptions") as any)
    .select("department, consumption_date")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !entry) {
    throw new Error("Consumption log not found.");
  }

  const department = entry.department ?? "";
  const permissionMap: Record<string, string> = {
    fabric: "fabric.consumption",
    roto_printing: "roto_printing.consumption",
    lamination: "lamination.consumption",
    offset_printing: "offset_printing.consumption",
    finishing: "finishing.consumption",
  };
  const permission = permissionMap[department] || "fabric.consumption";
  const user = await requirePermission(permission);

  if (entry.consumption_date !== todayInIndia()) {
    throw new Error("You can only delete consumption logs on the day they are created.");
  }

  const { error } = await (supabase
    .from("raw_material_consumptions") as any)
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id } as any)
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

export async function consumeFabricRoll(rollId: string, stage: string) {
  const permissionMap: Record<string, string> = {
    lamination: "lamination.consumption",
    offset: "offset_printing.consumption",
    finishing: "finishing.consumption",
  };
  const permission = permissionMap[stage] || "fabric.consumption";
  const user = await requirePermission(permission);
  const supabase = await createClient();

  const { error } = await (supabase
    .from("fabric_rolls") as any)
    .update({ status: "consumed", current_stage: stage, updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/stock");
  revalidatePath("/lamination/consumption");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
}

export async function revertFabricRollConsumption(rollId: string) {
  if (!rollId) throw new Error("Roll ID is required.");

  await requirePermission("fabric.consumption");

  const supabase = await createClient();
  const { data: roll } = await (supabase.from("fabric_rolls") as any).select("current_stage").eq("id", rollId).maybeSingle();
  const stage = (roll as any)?.current_stage ?? "loom";
  const permissionMap: Record<string, string> = {
    lamination: "lamination.consumption",
    offset: "offset_printing.consumption",
    finishing: "finishing.consumption",
  };
  const permission = permissionMap[stage] || "fabric.consumption";
  const user = await requirePermission(permission);

  const { error } = await (supabase
    .from("fabric_rolls") as any)
    .update({ status: "available", current_stage: "loom", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/stock");
  revalidatePath("/lamination/consumption");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
}

export async function consumeMetallicRoll(rollId: string) {
  const user = await requirePermission("lamination.consumption");
  const supabase = await createClient();

  const { error } = await (supabase
    .from("roto_metallic_rolls") as any)
    .update({ status: "consumed", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/consumption");
}

export async function revertMetallicRollConsumption(rollId: string) {
  const user = await requirePermission("lamination.consumption");
  const supabase = await createClient();

  const { error } = await (supabase
    .from("roto_metallic_rolls") as any)
    .update({ status: "available", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/consumption");
}

export async function consumeRotoFilmRoll(rollId: string) {
  const user = await requirePermission("lamination.consumption");
  const supabase = await createClient();

  const { error } = await (supabase
    .from("roto_film_rolls") as any)
    .update({ status: "consumed", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/consumption");
}

export async function revertRotoFilmRollConsumption(rollId: string) {
  const user = await requirePermission("lamination.consumption");
  const supabase = await createClient();

  const { error } = await (supabase
    .from("roto_film_rolls") as any)
    .update({ status: "available", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/consumption");
}

export async function consumeLaminationRoll(rollId: string, stage: string = "offset") {
  const permission = stage === "finishing" ? "finishing.consumption" : "offset_printing.consumption";
  const user = await requirePermission(permission);
  const supabase = await createClient();

  const { error } = await (supabase
    .from("lamination_rolls") as any)
    .update({ status: "consumed", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
}

export async function revertLaminationRollConsumption(rollId: string, stage: string = "offset") {
  const permission = stage === "finishing" ? "finishing.consumption" : "offset_printing.consumption";
  const user = await requirePermission(permission);
  const supabase = await createClient();

  const { error } = await (supabase
    .from("lamination_rolls") as any)
    .update({ status: "available", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/consumption");
  revalidatePath("/finishing/consumption");
}

export async function consumeOffsetRoll(rollId: string) {
  const user = await requirePermission("finishing.consumption");
  const supabase = await createClient();

  const { error } = await (supabase
    .from("offset_rolls") as any)
    .update({ status: "consumed", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/consumption");
}

export async function revertOffsetRollConsumption(rollId: string) {
  const user = await requirePermission("finishing.consumption");
  const supabase = await createClient();

  const { error = null } = await (supabase
    .from("offset_rolls") as any)
    .update({ status: "available", updated_by: user.id } as any)
    .eq("id", rollId);

  if (error) throw new Error(error.message);

  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/consumption");
}
