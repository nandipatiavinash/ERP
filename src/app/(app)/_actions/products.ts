"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function saveRotoProduct(formData: FormData) {
  await requirePermission("roto_products.create");
  const id = String(formData.get("id") ?? "");
  const brand = String(formData.get("brand") ?? "").trim();
  const width = Number(formData.get("width") ?? 0);
  const height = Number(formData.get("height") ?? 0);
  const numCylinders = Number(formData.get("num_cylinders") ?? 0);
  const status = String(formData.get("status") ?? "active");
  const customerIdVal = String(formData.get("customer_id") ?? "").trim();
  const customer_id = (customerIdVal === "" || customerIdVal === "general") ? null : customerIdVal;
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  let imageUrl = String(formData.get("image_url") ?? "");

  // FU-01 / FU-02 / FU-04 / SEC-07 / SEC-08 / SEC-09: validate file uploads
  const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
  const ALLOWED_IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) throw new Error("Image file must be 5 MB or smaller.");
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
    const fileExt = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid image file extension.");
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
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
    customer_id,
  };

  let rotoProductId = id;

  if (id) {
    const { error } = await (supabase.from("roto_products") as any).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await (supabase.from("roto_products") as any).insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    rotoProductId = data.id;
  }

  const selectedColorIds = formData.getAll("color_ids").map(String);

  const { data: existingAssociations } = await supabase
    .from("roto_product_colors")
    .select("color_id, image_url")
    .eq("roto_product_id", rotoProductId);

  const existingMap = new Map((existingAssociations ?? []).map((item: any) => [item.color_id, item.image_url]));

  const colorsToDelete = Array.from(existingMap.keys()).filter((cid) => !selectedColorIds.includes(cid));
  if (colorsToDelete.length > 0) {
    await supabase
      .from("roto_product_colors")
      .delete()
      .eq("roto_product_id", rotoProductId)
      .in("color_id", colorsToDelete);
  }

  for (const colorId of selectedColorIds) {
    const colorFile = formData.get(`image_file_${colorId}`) as File | null;
    let colorImageUrl = String(formData.get(`existing_image_${colorId}`) ?? "");

    if (colorFile && colorFile.size > 0) {
      if (colorFile.size > MAX_FILE_SIZE) throw new Error("Color image file must be 5 MB or smaller.");
      if (!ALLOWED_IMAGE_TYPES.has(colorFile.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
      const fileExt = (colorFile.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid color image file extension.");
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `roto/${rotoProductId}/${colorId}/${fileName}`;

      await adminSupabase.storage.createBucket("products", { public: true }).catch(() => {});

      const { error: uploadError } = await adminSupabase.storage
        .from("products")
        .upload(filePath, colorFile, { cacheControl: "3600", upsert: true });

      if (uploadError) throw new Error(`Color image upload failed: ${uploadError.message}`);

      const { data } = adminSupabase.storage
        .from("products")
        .getPublicUrl(filePath);

      colorImageUrl = data.publicUrl;
    }

    const associationPayload = {
      roto_product_id: rotoProductId,
      color_id: colorId,
      image_url: colorImageUrl || null,
    };

    const { error: assocError } = await (supabase
      .from("roto_product_colors") as any)
      .upsert(associationPayload as any, { onConflict: "roto_product_id,color_id" });

    if (assocError) throw new Error(`Failed to save color association: ${assocError.message}`);
  }

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
  const customerIdVal = String(formData.get("customer_id") ?? "").trim();
  const customer_id = (customerIdVal === "" || customerIdVal === "general") ? null : customerIdVal;
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  let imageUrl = String(formData.get("image_url") ?? "");

  const ALLOWED_IMAGE_TYPES_OFF = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
  const ALLOWED_IMAGE_EXTS_OFF = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
  const MAX_FILE_SIZE_OFF = 5 * 1024 * 1024;

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE_OFF) throw new Error("Image file must be 5 MB or smaller.");
    if (!ALLOWED_IMAGE_TYPES_OFF.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
    const fileExt = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_IMAGE_EXTS_OFF.has(fileExt)) throw new Error("Invalid image file extension.");
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
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
    customer_id,
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

export async function saveCatalogProduct(formData: FormData) {
  try {
    await requirePermission("admin.products");
    const id = String(formData.get("id") ?? "");
    const category = String(formData.get("category") ?? "fabric"); // "fabric" or "finishing"
    const customerIdVal = String(formData.get("customer_id") ?? "").trim();
    const customer_id = (customerIdVal === "" || customerIdVal === "general") ? null : customerIdVal;
    const selling_price = Number(formData.get("selling_price") ?? 0);
    const file = formData.get("image_file") as File | null;

    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    let imageUrl = String(formData.get("image_url") ?? "");

    const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
    const ALLOWED_IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) throw new Error("Image file must be 5 MB or smaller.");
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
      const fileExt = (file.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_IMAGE_EXTS.has(fileExt)) throw new Error("Invalid image file extension.");
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

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

    if (category === "fabric") {
      const fabric_name = String(formData.get("fabric_name") ?? "").trim();
      const gsm = String(formData.get("gsm") ?? "").trim();
      const width = String(formData.get("width") ?? "").trim();
      
      const payload = {
        fabric_name,
        gsm,
        width,
        selling_price: String(selling_price),
        image_url: imageUrl || null,
        customer_id,
        status: "active",
      };

      if (id) {
        const { error } = await (supabase.from("fabric_types") as any).update(payload).eq("id", id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await (supabase.from("fabric_types") as any).insert(payload);
        if (error) throw new Error(error.message);
      }
    } else {
      const name = String(formData.get("name") ?? "").trim();
      const dimensions = String(formData.get("dimensions") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      
      const fabric_type_id = formData.get("fabric_type_id") ? String(formData.get("fabric_type_id")) : null;
      const roto_product_id = formData.get("roto_product_id") ? String(formData.get("roto_product_id")) : null;
      const offset_product_id = formData.get("offset_product_id") ? String(formData.get("offset_product_id")) : null;
      const film_type = formData.get("film_type") ? String(formData.get("film_type")) : null;
      const is_metallic = formData.get("is_metallic") === "true" || formData.get("is_metallic") === "1";
      const lamination_type = String(formData.get("lamination_type") ?? "PLAIN");
      const offset_type = String(formData.get("offset_type") ?? "none");

      const payload = {
        name,
        dimensions,
        description,
        selling_price: selling_price,
        image_url: imageUrl || null,
        customer_id,
        status: "active",
        fabric_type_id,
        roto_product_id,
        offset_product_id,
        film_type,
        is_metallic,
        lamination_type,
        offset_type,
      };

      if (id) {
        const { error } = await (supabase.from("finishing_products") as any).update(payload).eq("id", id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await (supabase.from("finishing_products") as any).insert(payload);
        if (error) throw new Error(error.message);
      }
    }

    revalidatePath("/admin/catalog");
    revalidatePath("/portal/catalog");
    return { success: true };
  } catch (error: any) {
    console.error("saveCatalogProduct error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteCatalogProduct(id: string, category: string) {
  await requirePermission("admin.products");
  const supabase = await createClient();

  const table = category === "fabric" ? "fabric_types" : "finishing_products";
  
  const { error } = await (supabase.from(table) as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/catalog");
  revalidatePath("/portal/catalog");
}
