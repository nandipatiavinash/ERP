"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { todayInIndia } from "./helpers";

export async function saveTapeLineEntry(formData: FormData) {
  const user = await requirePermission("fabric.daily_data");
  const tapeType = String(formData.get("tape_type") ?? "").trim();
  const loads = Number(formData.get("loads") ?? 0);
  const entryDate = todayInIndia();

  if (!tapeType || loads <= 0) {
    throw new Error("Invalid tape type or loads.");
  }

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("tape_line_entries" as any) as any)
    .insert({
      entry_date: entryDate,
      tape_type: tapeType,
      loads: loads,
      created_by: user.id
    });

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function deleteTapeLineEntry(formData: FormData) {
  await requirePermission("fabric.daily_data");
  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("ID is required.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("tape_line_entries" as any) as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function saveLoomShiftMeters(formData: FormData) {
  const user = await requirePermission("fabric.daily_data");
  const loomId = String(formData.get("loom_id") ?? "");
  
  const dayRaw = formData.get("day_shift_meters");
  const nightRaw = formData.get("night_shift_meters");

  const hasDay = dayRaw !== null && dayRaw !== "";
  const hasNight = nightRaw !== null && nightRaw !== "";

  const dayMeters = hasDay ? Number(dayRaw) : 0;
  const nightMeters = hasNight ? Number(nightRaw) : 0;
  const entryDate = todayInIndia();

  if (!loomId || (dayMeters < 0 || nightMeters < 0)) {
    throw new Error("Invalid parameters.");
  }

  const adminSupabase = createAdminClient();

  const { data: existing } = await (adminSupabase
    .from("loom_shift_meters" as any) as any)
    .select("id")
    .eq("entry_date", entryDate)
    .eq("loom_id", loomId)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    const updateData: any = {
      updated_by: user.id
    };
    if (hasDay) {
      updateData.day_shift_meters = dayMeters;
    }
    if (hasNight) {
      updateData.night_shift_meters = nightMeters;
    }

    const { error } = await (adminSupabase
      .from("loom_shift_meters" as any) as any)
      .update(updateData)
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await (adminSupabase
      .from("loom_shift_meters" as any) as any)
      .insert({
        entry_date: entryDate,
        loom_id: loomId,
        day_shift_meters: dayMeters,
        night_shift_meters: nightMeters,
        created_by: user.id
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function deleteLoomShiftMeters(formData: FormData) {
  await requirePermission("fabric.daily_data");
  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("ID is required.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("loom_shift_meters" as any) as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function saveElectricityUnits(formData: FormData) {
  const user = await requirePermission("fabric.daily_data");
  const units = Number(formData.get("units") ?? 0);
  const entryDate = todayInIndia();

  if (units < 0) {
    throw new Error("Invalid units value.");
  }

  const adminSupabase = createAdminClient();

  const { data: existing } = await (adminSupabase
    .from("electricity_units_entries" as any) as any)
    .select("id")
    .eq("entry_date", entryDate)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    const { error } = await (adminSupabase
      .from("electricity_units_entries" as any) as any)
      .update({
        units: units,
        updated_by: user.id
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await (adminSupabase
      .from("electricity_units_entries" as any) as any)
      .insert({
        entry_date: entryDate,
        units: units,
        created_by: user.id
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function deleteElectricityUnits(formData: FormData) {
  await requirePermission("fabric.daily_data");
  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("ID is required.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("electricity_units_entries" as any) as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function saveDailyWasteEntry(formData: FormData) {
  const user = await requirePermission("fabric.daily_data");
  const plantWaste = Number(formData.get("plant_waste") ?? 0);
  const bobonWaste = Number(formData.get("bobon_waste") ?? 0);
  const loomWaste = Number(formData.get("loom_waste") ?? 0);
  const pipeCuttingWaste = Number(formData.get("pipe_cutting_waste") ?? 0);
  const entryDate = todayInIndia();

  if (plantWaste < 0 || bobonWaste < 0 || loomWaste < 0 || pipeCuttingWaste < 0) {
    throw new Error("Waste values cannot be negative.");
  }

  const adminSupabase = createAdminClient();

  const { data: existing } = await (adminSupabase
    .from("daily_waste_entries" as any) as any)
    .select("id")
    .eq("entry_date", entryDate)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    const { error } = await (adminSupabase
      .from("daily_waste_entries" as any) as any)
      .update({
        plant_waste: plantWaste,
        bobon_waste: bobonWaste,
        loom_waste: loomWaste,
        pipe_cutting_waste: pipeCuttingWaste,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await (adminSupabase
      .from("daily_waste_entries" as any) as any)
      .insert({
        entry_date: entryDate,
        plant_waste: plantWaste,
        bobon_waste: bobonWaste,
        loom_waste: loomWaste,
        pipe_cutting_waste: pipeCuttingWaste,
        created_by: user.id
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

export async function deleteDailyWasteEntry(formData: FormData) {
  await requirePermission("fabric.daily_data");
  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("ID is required.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("daily_waste_entries" as any) as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/fabric/daily-data");
  revalidatePath("/dashboard");
}

