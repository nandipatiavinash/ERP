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
  let rollId = brandName.trim();
  if (alias) {
    rollId += `(${alias.trim()})`;
  }
  rollId += `(${filmTypeChar})`;
  if (colorName) {
    rollId += `(${colorName.trim()})`;
  }

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("roto_film_rolls") as any)
    .insert({
      roll_id: rollId,
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
    .select("roll_id")
    .eq("id", sourceFilmRollId)
    .single();

  if (filmError || !filmRoll) {
    throw new Error("Source film roll not found.");
  }

  const newRollId = `${(filmRoll as any).roll_id.trim()}(Mt)`;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("roto_metallic_rolls") as any)
    .insert({
      roll_id: newRollId,
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
  if (["BOX", "F_S", "H_S"].includes(lamType)) {
    if (!rotoProductId) {
      throw new Error(`Brand is required for lamination type ${lamType}.`);
    }
    const { data: rotoProduct, error: productError } = await (supabase
      .from("roto_products") as any)
      .select("brand")
      .eq("id", rotoProductId)
      .single();

    if (productError || !rotoProduct) {
      throw new Error("Roto product brand not found.");
    }
    brandName = (rotoProduct as any).brand;
  } else if (lamType === "NW") {
    brandName = "NW";
  }

  let suffix = "";
  if (lamType === "PLAIN") suffix = "p";
  else if (lamType === "NW") suffix = "nw";
  else if (lamType === "BOX") suffix = "b";
  else if (lamType === "F_S") suffix = "f";
  else if (lamType === "H_S") suffix = "h";

  const baseId = `${brandName.trim()}(${fabricTypeName.trim()})(${suffix})`;
  const { count } = await (supabase
    .from("lamination_rolls") as any)
    .select("id", { count: "exact", head: true })
    .like("roll_id", `${baseId}%`);

  const seq = (count ?? 0) + 1;
  const newRollId = `${baseId}(${seq})`;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("lamination_rolls") as any)
    .insert({
      roll_id: newRollId,
      product_id: null,
      lam_type: lamType,
      fabric_type_id: fabricTypeId,
      film_roll_id: null,
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

  const { data: roll } = await (supabase.from("lamination_rolls") as any).select("status").eq("id", id).maybeSingle();
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
  const baseId = `${brandName.trim()}(${fabricNameVal.trim()})`;
  const { count } = await (supabase
    .from("offset_rolls") as any)
    .select("id", { count: "exact", head: true })
    .like("roll_id", `${baseId}%`);

  const seq = (count ?? 0) + 1;
  const newRollId = `${baseId}(${seq})`;

  // Use admin client for write so custom roles are not blocked by RLS.
  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("offset_rolls") as any)
    .insert({
      roll_id: newRollId,
      offset_type: offsetType,
      brand_id: brandId,
      fabric_type_id: ["FABRIC", "NW_LAM", "PLAIN_LAM"].includes(offsetType) ? fabricTypeId : null,
      source_lam_roll_id: null,
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
  const fabricTypeId = String(formData.get("fabric_type_id") ?? "");
  const numBags = Number(formData.get("num_bags") ?? 0);
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!finishType || !fabricTypeId || numBags <= 0 || weightKg <= 0) {
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

  let parentId = "";

  if (finishType === "FABRIC") {
    parentId = `PLAIN(${fabricTypeName})`;
  } else if (finishType === "LAMINATION") {
    const laminationType = String(formData.get("lamination_type") ?? "");
    if (!laminationType) throw new Error("Lamination Type is required.");
    
    let brandName = "PLAIN";
    if (["BOX", "F_S", "H_S"].includes(laminationType)) {
      const rotoProductId = formData.get("roto_product_id") ? String(formData.get("roto_product_id")) : null;
      if (!rotoProductId) throw new Error("Brand is required.");
      const { data: rotoProduct } = await (supabase
        .from("roto_products") as any)
        .select("brand")
        .eq("id", rotoProductId)
        .single();
      brandName = rotoProduct ? (rotoProduct as any).brand : "PLAIN";
    } else if (laminationType === "NW") {
      brandName = "NW";
    }

    let suffix = "";
    if (laminationType === "PLAIN") suffix = "p";
    else if (laminationType === "NW") suffix = "nw";
    else if (laminationType === "BOX") suffix = "b";
    else if (laminationType === "F_S") suffix = "f";
    else if (laminationType === "H_S") suffix = "h";

    parentId = `${brandName}(${fabricTypeName})(${suffix})`;
  } else if (finishType === "OFFSET") {
    const offsetProductId = formData.get("offset_product_id") ? String(formData.get("offset_product_id")) : null;
    if (!offsetProductId) throw new Error("Offset Brand is required.");
    const { data: offsetProduct } = await (supabase
      .from("offset_products") as any)
      .select("brand")
      .eq("id", offsetProductId)
      .single();
    const brandName = offsetProduct ? (offsetProduct as any).brand : "Offset";
    parentId = `${brandName}(${fabricTypeName})`;
  } else {
    throw new Error("Unsupported finishing type.");
  }

  const { count } = await (supabase
    .from("finishing_bundles") as any)
    .select("id", { count: "exact", head: true })
    .like("bundle_id", `${parentId}(%)`);

  const seq = (count ?? 0) + 1;
  const newBundleId = `${parentId}(${seq})`;

  const adminSupabase = createAdminClient();
  const { error: insertError } = await (adminSupabase
    .from("finishing_bundles") as any)
    .insert({
      bundle_id: newBundleId,
      finish_type: finishType,
      product_id: null,
      source_lam_roll_id: null,
      source_fabric_roll_id: null,
      source_offset_roll_id: null,
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
  return { bundle_id: newBundleId };
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
