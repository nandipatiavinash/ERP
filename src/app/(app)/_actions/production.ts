"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  assertValid,
  productionSchema,
  readPayload,
  todayInIndia
} from "./helpers";

export async function saveProduction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const user = await requirePermission("fabric.production");
  const permissions = await getSessionPermissions(user);
  const isAdmin = user.roles?.name === "admin" || permissions.includes("admin.looms");
  
  // Always include initial_meters in the parsed fields so we can handle it on the server
  const fields = ["fabric_type_id", "loom_id", "gross_weight", "core_weight", "end_meters", "remarks", "initial_meters"];
  const parsed = assertValid(productionSchema, readPayload(formData, fields));
  
  const adminSupabase = createAdminClient();

  // Fetch the last end_meters for this loom to compute/validate initial_meters
  const { data: lastEntry } = await (adminSupabase
    .from("loom_production_entries") as any)
    .select("end_meters")
    .eq("loom_id", parsed.loom_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastEnd = Number((lastEntry as any)?.end_meters ?? 0);

  const payload: Record<string, any> = {
    fabric_type_id: parsed.fabric_type_id,
    loom_id: parsed.loom_id,
    gross_weight: parsed.gross_weight,
    core_weight: parsed.core_weight,
    end_meters: parsed.end_meters,
    remarks: parsed.remarks,
    updated_by: user.id,
  };

  if (!id) {
    // INSERT Path
    const initialMtrs = parsed.initial_meters ?? lastEnd;
    payload.initial_meters = initialMtrs;
    payload.initial_meter_overridden = initialMtrs !== lastEnd;
  } else {
    // UPDATE Path
    if (parsed.initial_meters !== undefined) {
      payload.initial_meters = parsed.initial_meters;
      payload.initial_meter_overridden = parsed.initial_meters !== lastEnd;
    }
  }

  const query = id
    ? (adminSupabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)
    : (adminSupabase.from("loom_production_entries") as any).insert({ ...payload, created_by: user.id } as any);

  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/fabric/production");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
  revalidatePath("/fabric/stock");
}

export async function softDeleteProduction(formData: FormData) {
  const user = await requirePermission("fabric.production");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: roll } = await (supabase
    .from("fabric_rolls") as any)
    .select("status")
    .eq("production_entry_id", id)
    .maybeSingle();

  if (roll) {
    if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
    if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in downstream stages and cannot be deleted.");
  }

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

export async function saveRotoFilmProduction(formData: FormData) {
  const user = await requirePermission("roto_printing.production");
  const brandId = String(formData.get("brand_id") ?? "");
  const filmType = String(formData.get("film_type") ?? "").toLowerCase();
  const colorId = formData.get("color_id") ? String(formData.get("color_id")) : null;
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const meters = Number(formData.get("meters") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!brandId || !filmType || weightKg <= 0 || meters <= 0) {
    throw new Error("Invalid production parameters.");
  }
  if (filmType !== "gloss" && filmType !== "matt") {
    throw new Error("Film type must be gloss or matt.");
  }

  const supabase = await createClient();

  const { data: brandData, error: brandError } = await (supabase
    .from("roto_products") as any)
    .select("brand, customer_id, customers(customer_name, alias)")
    .eq("id", brandId)
    .single();

  if (brandError || !brandData) {
    throw new Error("Brand not found.");
  }

  const brandName = (brandData as any).brand;
  const customer = (brandData as any).customers;
  const alias = customer ? (customer.alias || customer.customer_name) : "";

  let colorName = "";
  if (colorId) {
    const { data: colorData } = await (supabase
      .from("roto_colors") as any)
      .select("color_name")
      .eq("id", colorId)
      .single();
    if (colorData) {
      colorName = (colorData as any).color_name;
    }
  }

  const filmTypeChar = filmType === "gloss" ? "G" : "M";
  const rollId = `${brandName.trim()}(${filmTypeChar})${colorName ? `(${colorName.trim()})` : ""}`.toUpperCase();

  // Compute sequential serial number for this specific specification
  const { count } = await (supabase
    .from("roto_film_rolls") as any)
    .select("id", { count: "exact", head: true })
    .eq("roll_id", rollId)
    .is("deleted_at", null);
  const seq = (count ?? 0) + 1;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("roto_film_rolls") as any)
    .insert({
      roll_id: rollId,
      s_no: seq,
      brand_id: brandId,
      film_type: filmType,
      color_id: colorId || null,
      weight_kg: weightKg,
      meters: meters,
      entry_date: entryDate,
      status: "available",
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
}

export async function deleteRotoFilmProduction(id: string) {
  await requirePermission("roto_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("roto_film_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Film roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in metallic printing and cannot be deleted.");

  const { data: hasMetallic } = await (supabase.from("roto_metallic_rolls") as any).select("id").eq("source_film_roll_id", id).maybeSingle();
  if (hasMetallic) throw new Error("This roll is referenced by a metallic printed roll and cannot be deleted.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("roto_film_rolls") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
}

export async function saveRotoMetallicProduction(formData: FormData) {
  const user = await requirePermission("roto_printing.production");
  const sourceFilmRollId = String(formData.get("source_film_roll_id") ?? "");
  const isSplit = formData.get("is_split") === "1" || formData.get("is_split") === "true";
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const meters = Number(formData.get("meters") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!sourceFilmRollId || weightKg <= 0 || meters <= 0) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();

  const { data: filmRoll, error: filmError } = await (supabase
    .from("roto_film_rolls") as any)
    .select("roll_id, s_no")
    .eq("id", sourceFilmRollId)
    .single();

  if (filmError || !filmRoll) {
    throw new Error("Source film roll not found.");
  }

  const newRollId = `${(filmRoll as any).roll_id.trim()}(MT)`.toUpperCase();
  const seq = (filmRoll as any).s_no || 1;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("roto_metallic_rolls") as any)
    .insert({
      roll_id: newRollId,
      s_no: seq,
      source_film_roll_id: sourceFilmRollId,
      is_split: isSplit,
      weight_kg: weightKg,
      meters: meters,
      entry_date: entryDate,
      status: "available",
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  if (!isSplit) {
    const { error: consumeError } = await (adminSupabase
      .from("roto_film_rolls") as any)
      .update({ status: "consumed", updated_by: user.id })
      .eq("id", sourceFilmRollId);
    if (consumeError) {
      console.error("Failed to mark source film roll as consumed:", consumeError.message);
    }
  }

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
}

export async function deleteRotoMetallicProduction(id: string) {
  await requirePermission("roto_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("roto_metallic_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Metallic roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in lamination and cannot be deleted.");

  const { data: hasLamination } = await (supabase.from("lamination_rolls") as any).select("id").eq("film_roll_id", id).maybeSingle();
  if (hasLamination) throw new Error("This roll is referenced by a laminated roll and cannot be deleted.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("roto_metallic_rolls") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/roto-printing/production");
  revalidatePath("/roto-printing/stock");
  revalidatePath("/lamination/production");
}

export async function saveLaminationProduction(formData: FormData) {
  const user = await requirePermission("lamination.production");
  const lamType = String(formData.get("lam_type") ?? "");
  const fabricTypeId = String(formData.get("fabric_type_id") ?? "");
  const rotoProductId = formData.get("roto_product_id") ? String(formData.get("roto_product_id")) : null;
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const meters = Number(formData.get("meters") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!lamType || !fabricTypeId || weightKg <= 0 || meters <= 0) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();

  const { data: fabricType, error: fabricError } = await (supabase
    .from("fabric_types") as any)
    .select("fabric_name")
    .eq("id", fabricTypeId)
    .single();

  if (fabricError || !fabricType) {
    throw new Error("Fabric type not found.");
  }
  const fabricTypeName = (fabricType as any).fabric_name;

  let brandName = "PLAIN";
  let matchedMetallicRollId: string | null = null;

  if (["BOX", "F_S", "H_S"].includes(lamType)) {
    if (!rotoProductId) {
      throw new Error(`Brand is required for lamination type ${lamType}.`);
    }
    
    // Resolve brand name from either roto_film_rolls (printed spec), roto_metallic_rolls, or fallback to roto_products
    const { data: filmRoll } = await (supabase
      .from("roto_film_rolls") as any)
      .select("roll_id")
      .eq("id", rotoProductId)
      .maybeSingle();

    if (filmRoll) {
      brandName = (filmRoll as any).roll_id;
    } else {
      const { data: metallicRoll } = await (supabase
        .from("roto_metallic_rolls") as any)
        .select("roll_id")
        .eq("id", rotoProductId)
        .maybeSingle();

      if (metallicRoll) {
        brandName = (metallicRoll as any).roll_id;
        matchedMetallicRollId = rotoProductId;
      } else {
        const { data: rotoProduct } = await (supabase
          .from("roto_products") as any)
          .select("brand")
          .eq("id", rotoProductId)
          .maybeSingle();
        if (rotoProduct) {
          brandName = (rotoProduct as any).brand;
        } else {
          brandName = rotoProductId;
        }
      }
    }
  } else if (lamType === "NW") {
    brandName = "NW";
  }

  let suffix = "";
  if (lamType === "PLAIN") suffix = "";
  else if (lamType === "NW") suffix = "";
  else if (lamType === "BOX") suffix = "B";
  else if (lamType === "F_S") suffix = "F";
  else if (lamType === "H_S") suffix = "H";

  let baseId = "";
  if (lamType === "PLAIN" || lamType === "NW") {
    baseId = `${brandName.trim()}(${fabricTypeName.trim()})`;
  } else {
    baseId = `${brandName.trim()}(${fabricTypeName.trim()})(${suffix})`;
  }
  baseId = baseId.toUpperCase();

  const { count } = await (supabase
    .from("lamination_rolls") as any)
    .select("id", { count: "exact", head: true })
    .eq("roll_id", baseId)
    .is("deleted_at", null);

  const seq = (count ?? 0) + 1;
  const newRollId = baseId;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("lamination_rolls") as any)
    .insert({
      roll_id: newRollId,
      s_no: seq,
      product_id: null,
      lam_type: lamType,
      fabric_type_id: fabricTypeId,
      film_roll_id: matchedMetallicRollId,
      nw_material_id: null,
      weight_kg: weightKg,
      meters: meters,
      entry_date: entryDate,
      status: "available",
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/lamination/production");
  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/production");
  revalidatePath("/finishing/production");
}

export async function deleteLaminationProduction(id: string) {
  await requirePermission("lamination.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("lamination_rolls") as any).select("status, film_roll_id").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Lamination roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in offset/finishing and cannot be deleted.");

  const { data: hasOffset } = await (supabase.from("offset_rolls") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();
  if (hasOffset) throw new Error("This roll is referenced by an offset printed roll and cannot be deleted.");

  const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();
  if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("lamination_rolls") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/lamination/production");
  revalidatePath("/lamination/stock");
  revalidatePath("/offset-printing/production");
  revalidatePath("/finishing/production");
}

export async function saveOffsetProduction(formData: FormData) {
  const user = await requirePermission("offset_printing.production");
  const offsetType = String(formData.get("offset_type") ?? "");
  const brandId = String(formData.get("brand_id") ?? "");
  const fabricTypeId = formData.get("fabric_type_id") ? String(formData.get("fabric_type_id")) : null;
  const sourceLamRollId = formData.get("source_lam_roll_id") ? String(formData.get("source_lam_roll_id")) : null;
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!offsetType || !brandId || weightKg <= 0) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();

  const { data: brandData, error: brandError } = await (supabase
    .from("offset_products") as any)
    .select("brand")
    .eq("id", brandId)
    .single();

  if (brandError || !brandData) {
    throw new Error("Offset brand not found.");
  }
  const brandName = (brandData as any).brand;

  let fabricTypeName = "";
  if (["FABRIC", "NW_LAM", "PLAIN_LAM"].includes(offsetType)) {
    if (!fabricTypeId) throw new Error("Source fabric type is required.");
    const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();
    if (!ft) throw new Error("Source fabric type not found.");
    fabricTypeName = (ft as any).fabric_name;
  }

  const fabricNameVal = offsetType === "NW" ? "NW" : fabricTypeName;
  const baseId = `${brandName.trim()}(${fabricNameVal.trim()})`.toUpperCase();
  const { count } = await (supabase
    .from("offset_rolls") as any)
    .select("id", { count: "exact", head: true })
    .eq("roll_id", baseId)
    .is("deleted_at", null);

  const seq = (count ?? 0) + 1;
  const newRollId = baseId;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("offset_rolls") as any)
    .insert({
      roll_id: newRollId,
      s_no: seq,
      offset_type: offsetType,
      brand_id: brandId,
      fabric_type_id: ["FABRIC", "NW_LAM", "PLAIN_LAM"].includes(offsetType) ? fabricTypeId : null,
      source_lam_roll_id: ["NW_LAM", "PLAIN_LAM"].includes(offsetType) ? sourceLamRollId : null,
      weight_kg: weightKg,
      entry_date: entryDate,
      status: "available",
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/offset-printing/production");
  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/production");
}

export async function deleteOffsetProduction(id: string) {
  await requirePermission("offset_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("offset_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Offset roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in finishing and cannot be deleted.");

  const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_offset_roll_id", id).maybeSingle();
  if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("offset_rolls") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/offset-printing/production");
  revalidatePath("/offset-printing/stock");
  revalidatePath("/finishing/production");
}

export async function saveFinishingBundle(formData: FormData) {
  const user = await requirePermission("finishing.production");
  const finishType = String(formData.get("finish_type") ?? "");
  const numBags = Number(formData.get("num_bags") ?? 0);
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!finishType || numBags <= 0 || weightKg <= 0) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();

  let specId = "";
  let fabricTypeId: string | null = formData.get("fabric_type_id") ? String(formData.get("fabric_type_id")) : null;
  let sourceLamRollId: string | null = null;
  let sourceOffsetRollId: string | null = null;

  if (finishType === "FABRIC") {
    if (!fabricTypeId) throw new Error("Fabric Type is required.");
    const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();
    if (!ft) throw new Error("Fabric type not found.");
    specId = `PLAIN(${(ft as any).fabric_name})`.toUpperCase();

  } else if (finishType === "LAMINATION") {
    const lamRollId = formData.get("lam_roll_id") ? String(formData.get("lam_roll_id")) : null;
    if (!lamRollId) throw new Error("Lamination Roll is required.");
    const { data: lamRoll } = await (supabase.from("lamination_rolls") as any)
      .select("roll_id, fabric_type_id")
      .eq("id", lamRollId)
      .single();
    if (!lamRoll) throw new Error("Lamination roll not found.");
    specId = String((lamRoll as any).roll_id).toUpperCase();
    fabricTypeId = (lamRoll as any).fabric_type_id || fabricTypeId;
    sourceLamRollId = lamRollId;

  } else if (finishType === "OFFSET") {
    const offsetRollId = formData.get("offset_roll_id") ? String(formData.get("offset_roll_id")) : null;
    if (!offsetRollId) throw new Error("Offset Roll is required.");
    const { data: offsetRoll } = await (supabase.from("offset_rolls") as any)
      .select("roll_id, fabric_type_id")
      .eq("id", offsetRollId)
      .single();
    if (!offsetRoll) throw new Error("Offset roll not found.");
    specId = String((offsetRoll as any).roll_id).toUpperCase();
    fabricTypeId = (offsetRoll as any).fabric_type_id || fabricTypeId;
    sourceOffsetRollId = offsetRollId;

  } else {
    throw new Error("Unsupported finishing type.");
  }

  // bundle_id is the spec ID directly e.g. PLAIN(N-19-3.5)
  const bundleId = specId;
  const productId = formData.get("product_id") ? String(formData.get("product_id")) : null;

  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("finishing_bundles") as any)
    .insert({
      bundle_id: bundleId,
      s_no: 1,
      finish_type: finishType,
      product_id: productId,
      source_lam_roll_id: sourceLamRollId,
      source_fabric_roll_id: null,
      source_offset_roll_id: sourceOffsetRollId,
      fabric_type_id: fabricTypeId,
      num_bags: numBags,
      weight_kg: weightKg,
      entry_date: entryDate,
      status: "available",
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/finishing/production");
  revalidatePath("/finishing/stock");
  return { bundle_id: bundleId };
}

export async function deleteFinishingBundle(id: string) {
  await requirePermission("finishing.production");
  const supabase = await createClient();

  const { data: bundle } = await (supabase.from("finishing_bundles") as any)
    .select("status, finish_type, source_lam_roll_id, source_fabric_roll_id, source_offset_roll_id")
    .eq("id", id)
    .maybeSingle();

  if (!bundle) throw new Error("Finishing bundle not found.");
  if ((bundle as any).status === "sold") throw new Error("This bundle has been sold and cannot be deleted.");

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase
    .from("finishing_bundles") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  if ((bundle as any).finish_type === "LAMINATION" && (bundle as any).source_lam_roll_id) {
    await (adminSupabase.from("lamination_rolls") as any)
      .update({ status: "available" } as any)
      .eq("id", (bundle as any).source_lam_roll_id);
  } else if ((bundle as any).finish_type === "FABRIC" && (bundle as any).source_fabric_roll_id) {
    await (adminSupabase.from("fabric_rolls") as any)
      .update({ status: "available", current_stage: "loom" } as any)
      .eq("id", (bundle as any).source_fabric_roll_id);
  } else if ((bundle as any).finish_type === "OFFSET" && (bundle as any).source_offset_roll_id) {
    await (adminSupabase.from("offset_rolls") as any)
      .update({ status: "available" } as any)
      .eq("id", (bundle as any).source_offset_roll_id);
  }

  revalidatePath("/finishing/production");
  revalidatePath("/finishing/stock");
}

export async function saveStageProduction(formData: FormData) {
  const stage = String(formData.get("stage") ?? "");
  const permissionMap: Record<string, string> = {
    roto_printing: "roto_printing.production",
    lamination: "lamination.production",
    offset_printing: "offset_printing.production",
    finishing: "finishing.production",
  };
  const permission = permissionMap[stage] || "fabric.production";
  const user = await requirePermission(permission);

  const id = String(formData.get("id") ?? "");
  const rollId = String(formData.get("roll_id") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  const entryDate = String(formData.get("entry_date") ?? "");
  const remarks = String(formData.get("remarks") ?? "");

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

  const payload = {
    roll_id: rollId,
    stage,
    product_id: productId || null,
    details,
    entry_date: entryDate,
    remarks: remarks || null,
    updated_by: user.id,
  };

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const query = id
    ? (adminSupabase.from("stage_production_entries") as any).update(payload).eq("id", id)
    : (adminSupabase.from("stage_production_entries") as any).insert({ ...payload, created_by: user.id });

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
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Production entry ID is required.");

  const adminSupabase = createAdminClient();
  const { data: entry, error: fetchError } = await (adminSupabase
    .from("stage_production_entries") as any)
    .select("stage")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !entry) {
    throw new Error("Production entry not found.");
  }

  const stage = entry.stage ?? "";
  const permissionMap: Record<string, string> = {
    roto_printing: "roto_printing.production",
    lamination: "lamination.production",
    offset_printing: "offset_printing.production",
    finishing: "finishing.production",
  };
  const permission = permissionMap[stage];
  if (!permission) {
    throw new Error("Invalid production stage.");
  }

  await requirePermission(permission);

  const deleteSupabase = createAdminClient();
  const { error } = await (deleteSupabase
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
