"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
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

  const { error: insertError } = await (supabase
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
  const user = await requirePermission("roto_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("roto_film_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Film roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in metallic printing and cannot be deleted.");

  const { data: hasMetallic } = await (supabase.from("roto_metallic_rolls") as any).select("id").eq("source_film_roll_id", id).maybeSingle();
  if (hasMetallic) throw new Error("This roll is referenced by a metallic printed roll and cannot be deleted.");

  const { error } = await (supabase
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

  const { error: insertError } = await (supabase
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
  const user = await requirePermission("roto_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("roto_metallic_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Metallic roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in lamination and cannot be deleted.");

  const { data: hasLamination } = await (supabase.from("lamination_rolls") as any).select("id").eq("film_roll_id", id).maybeSingle();
  if (hasLamination) throw new Error("This roll is referenced by a laminated roll and cannot be deleted.");

  const { error } = await (supabase
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
  const filmRollId = formData.get("film_roll_id") ? String(formData.get("film_roll_id")) : null;
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

  let filmRollIdValue: string | null = null;
  if (["BOX", "F_S", "H_S"].includes(lamType)) {
    if (!filmRollId) {
      throw new Error(`Film roll is required for lamination type ${lamType}.`);
    }
    const { data: filmRoll, error: filmError } = await (supabase
      .from("roto_metallic_rolls") as any)
      .select("roll_id")
      .eq("id", filmRollId)
      .single();

    if (filmError || !filmRoll) {
      throw new Error("Metallic film roll not found.");
    }
    filmRollIdValue = filmRollId;
  }

  let brandName = "PLAIN";
  if (filmRollIdValue) {
    const { data: metallicInfo } = await (supabase
      .from("roto_metallic_rolls") as any)
      .select("roto_film_rolls(roto_products(brand))")
      .eq("id", filmRollIdValue)
      .single();
    brandName = (metallicInfo as any)?.roto_film_rolls?.roto_products?.brand || "PLAIN";
  } else if (lamType === "NW") {
    brandName = "NW";
  }

  const baseId = `${brandName.trim()}(${fabricTypeName.trim()})`;
  const { count } = await (supabase
    .from("lamination_rolls") as any)
    .select("id", { count: "exact", head: true })
    .like("roll_id", `${baseId}%`);

  const seq = (count ?? 0) + 1;
  const newRollId = `${baseId}(${seq})`;

  const { error: insertError } = await (supabase
    .from("lamination_rolls") as any)
    .insert({
      roll_id: newRollId,
      lam_type: lamType,
      fabric_type_id: fabricTypeId,
      film_roll_id: filmRollIdValue,
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
  const user = await requirePermission("lamination.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("lamination_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Lamination roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in offset/finishing and cannot be deleted.");

  const { data: hasOffset } = await (supabase.from("offset_rolls") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();
  if (hasOffset) throw new Error("This roll is referenced by an offset printed roll and cannot be deleted.");

  const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_lam_roll_id", id).maybeSingle();
  if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");

  const { error } = await (supabase
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
  if (offsetType === "FABRIC") {
    if (!fabricTypeId) throw new Error("Source fabric type is required.");
    const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();
    if (!ft) throw new Error("Source fabric type not found.");
    fabricTypeName = (ft as any).fabric_name;
  } else if (["NW_LAM", "PLAIN_LAM"].includes(offsetType)) {
    if (!sourceLamRollId) throw new Error("Source laminated roll is required.");
    const { data: lr } = await (supabase
      .from("lamination_rolls") as any)
      .select("fabric_type_id, fabric_types(fabric_name)")
      .eq("id", sourceLamRollId)
      .single();
    if (!lr) throw new Error("Source laminated roll not found.");
    fabricTypeName = (lr as any).fabric_types?.fabric_name ?? "";
  }

  const fabricNameVal = offsetType === "NW" ? "NW" : fabricTypeName;
  const baseId = `${brandName.trim()}(${fabricNameVal.trim()})`;
  const { count } = await (supabase
    .from("offset_rolls") as any)
    .select("id", { count: "exact", head: true })
    .like("roll_id", `${baseId}%`);

  const seq = (count ?? 0) + 1;
  const newRollId = `${baseId}(${seq})`;

  const { error: insertError } = await (supabase
    .from("offset_rolls") as any)
    .insert({
      roll_id: newRollId,
      offset_type: offsetType,
      brand_id: brandId,
      fabric_type_id: offsetType === "FABRIC" ? fabricTypeId : null,
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
  const user = await requirePermission("offset_printing.production");
  const supabase = await createClient();

  const { data: roll } = await (supabase.from("offset_rolls") as any).select("status").eq("id", id).maybeSingle();
  if (!roll) throw new Error("Offset roll not found.");
  if ((roll as any).status === "sold") throw new Error("This roll has been sold and cannot be deleted.");
  if ((roll as any).status === "consumed") throw new Error("This roll has been consumed in finishing and cannot be deleted.");

  const { data: hasFinishing } = await (supabase.from("finishing_bundles") as any).select("id").eq("source_offset_roll_id", id).maybeSingle();
  if (hasFinishing) throw new Error("This roll is referenced by a finishing bundle and cannot be deleted.");

  const { error } = await (supabase
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
  const sourceLamRollId = formData.get("source_lam_roll_id") ? String(formData.get("source_lam_roll_id")) : null;
  const fabricTypeId = formData.get("fabric_type_id") ? String(formData.get("fabric_type_id")) : null;
  const numBags = Number(formData.get("num_bags") ?? 0);
  const weightKg = Number(formData.get("weight_kg") ?? 0);
  const entryDate = String(formData.get("entry_date") ?? todayInIndia());

  if (!finishType || numBags <= 0 || weightKg <= 0) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();

  let brandName = "PLAIN";
  let fabricTypeName = "";

  if (finishType === "LAMINATED") {
    if (!sourceLamRollId) throw new Error("Source laminated roll is required.");
    const { data: lr } = await (supabase.from("lamination_rolls") as any).select("roll_id").eq("id", sourceLamRollId).single();
    if (!lr) throw new Error("Source laminated roll not found.");
    const match = (lr as any).roll_id.match(/^([^(]+)\(([^)]+)\)/);
    if (match) {
      brandName = match[1].trim();
      fabricTypeName = match[2];
    } else {
      brandName = (lr as any).roll_id;
      fabricTypeName = "LAMINATED";
    }
  } else if (finishType === "PLAIN") {
    if (!fabricTypeId) throw new Error("Source fabric type is required.");
    const { data: ft } = await (supabase.from("fabric_types") as any).select("fabric_name").eq("id", fabricTypeId).single();
    if (!ft) throw new Error("Source fabric type not found.");
    brandName = "PLAIN";
    fabricTypeName = (ft as any).fabric_name;
  } else if (finishType === "NW") {
    brandName = "NW";
    fabricTypeName = "NW";
  } else {
    throw new Error("Unsupported finishing type.");
  }

  const baseId = `${brandName.trim()}(${fabricTypeName.trim()})`;
  const { count } = await (supabase
    .from("finishing_bundles") as any)
    .select("id", { count: "exact", head: true })
    .like("bundle_id", `${baseId}%`);

  const seq = (count ?? 0) + 1;
  const newBundleId = `${baseId}(${seq})`;

  const { error: insertError } = await (supabase
    .from("finishing_bundles") as any)
    .insert({
      bundle_id: newBundleId,
      finish_type: finishType,
      source_lam_roll_id: finishType === "LAMINATED" ? sourceLamRollId : null,
      fabric_type_id: finishType === "PLAIN" ? fabricTypeId : null,
      source_nw_material_id: null,
      num_bags: numBags,
      weight_kg: weightKg,
      entry_date: entryDate,
      created_by: user.id,
      updated_by: user.id,
    } as any);

  if (insertError) throw new Error(insertError.message);

  revalidatePath("/finishing/production");
  revalidatePath("/finishing/stock");
}

export async function deleteFinishingBundle(id: string) {
  const user = await requirePermission("finishing.production");
  const supabase = await createClient();

  const { data: bundle } = await (supabase.from("finishing_bundles") as any).select("status").eq("id", id).maybeSingle();
  if (!bundle) throw new Error("Finishing bundle not found.");
  if ((bundle as any).status === "sold") throw new Error("This bundle has been sold and cannot be deleted.");

  const { error } = await (supabase
    .from("finishing_bundles") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

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
