"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { generateNextJournalNo, todayInIndia } from "./helpers";

export async function saveProductPurchase(formData: FormData) {
  const user = await requirePermission("accounts.product_purchase");

  const purchase_date = String(formData.get("purchase_date") ?? "");
  const supplier_name = String(formData.get("supplier_name") ?? "");
  const bill_number = String(formData.get("bill_number") ?? "");
  const remarks = String(formData.get("remarks") ?? "").trim();
  const totalBillValue = Number(formData.get("total_bill_value") ?? 0);

  const departments = formData.getAll("department").map(String);
  const product_ids = formData.getAll("product_id").map(String);
  const fabric_type_ids = formData.getAll("fabric_type_id").map(String);
  const lamination_types = formData.getAll("lamination_type").map(String);
  const offset_types = formData.getAll("offset_type").map(String);
  const quantities = formData.getAll("quantity").map(Number);
  const weights = formData.getAll("weight").map(Number);
  const rates = formData.getAll("rate").map(Number);

  if (!purchase_date || !supplier_name || !bill_number) {
    throw new Error("Purchase date, supplier, and bill number are required.");
  }
  if (!Number.isFinite(totalBillValue) || totalBillValue <= 0) {
    throw new Error("Total bill value must be a positive amount.");
  }
  if (departments.length === 0) {
    throw new Error("At least one purchase item must be added.");
  }

  const adminSupabase = createAdminClient();

  // 1. Insert header record
  const { data: purchaseData, error: headerError } = await (adminSupabase
    .from("product_purchases") as any)
    .insert({
      purchase_date,
      supplier_name,
      bill_number,
      total_amount: totalBillValue,
      remarks,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (headerError || !purchaseData) {
    throw new Error(headerError?.message || "Failed to create product purchase record.");
  }

  const purchaseId = purchaseData.id;

  // 2. Process and insert each item into history and stock
  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    const productId = product_ids[i] || null;
    const fabricTypeId = fabric_type_ids[i] || null;
    const lamType = lamination_types[i] || null;
    const offsetType = offset_types[i] || null;
    const qty = quantities[i] || 0;
    const weight = weights[i] || 0;
    const rate = rates[i] || 0;
    const amount = qty * rate;

    let createdStockId: string | null = null;

    // --- Insert into appropriate Stock Registers ---
    if (dept === "fabric") {
      const nextNoRes = await (adminSupabase.rpc("next_year_number", {
        prefix: "ROLL",
        table_name: "fabric_rolls",
        column_name: "roll_number"
      } as any) as any);
      const nextNo = nextNoRes.data || "1";
      const rollNumber = `E-${nextNo}`;

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("fabric_rolls") as any)
        .insert({
          roll_number: rollNumber,
          production_entry_id: null,
          fabric_type_id: fabricTypeId,
          loom_id: null,
          weight: weight,
          meters: qty,
          production_date: purchase_date,
          status: "available",
          current_stage: "loom",
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Fabric roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;

    } else if (dept === "lamination") {
      let prodName = "LAM";
      if (productId) {
        const { data: p } = await adminSupabase.from("lamination_products").select("name").eq("id", productId).maybeSingle();
        if (p) prodName = (p as any).name;
      }
      const rollId = `E-${prodName}`;

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("lamination_rolls") as any)
        .insert({
          roll_id: rollId,
          s_no: 1,
          product_id: productId,
          lam_type: lamType || "PLAIN",
          fabric_type_id: fabricTypeId,
          film_roll_id: null,
          nw_material_id: null,
          weight_kg: weight,
          meters: qty,
          entry_date: purchase_date,
          status: "available",
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Lamination roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;

    } else if (dept === "offset-printing") {
      let brand = "OFFSET";
      if (productId) {
        const { data: p } = await adminSupabase.from("offset_products").select("brand").eq("id", productId).maybeSingle();
        if (p) brand = (p as any).brand;
      }
      const rollId = `E-${brand}`;

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("offset_rolls") as any)
        .insert({
          roll_id: rollId,
          s_no: 1,
          offset_type: offsetType || "PLAIN",
          brand_id: productId,
          fabric_type_id: fabricTypeId,
          source_lam_roll_id: null,
          weight_kg: weight,
          entry_date: purchase_date,
          status: "available",
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Offset roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;

    } else if (dept === "finishing") {
      let prodName = "BAG";
      if (productId) {
        const { data: p } = await adminSupabase.from("finishing_products").select("name").eq("id", productId).maybeSingle();
        if (p) prodName = (p as any).name;
      }
      let fabricName = "FAB";
      if (fabricTypeId) {
        const { data: f } = await adminSupabase.from("fabric_types").select("fabric_name").eq("id", fabricTypeId).maybeSingle();
        if (f) fabricName = (f as any).fabric_name;
      }
      const bundleId = `E-${prodName}(${fabricName})`;

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("finishing_bundles") as any)
        .insert({
          bundle_id: bundleId,
          s_no: 1,
          finish_type: "FABRIC",
          product_id: productId,
          source_lam_roll_id: null,
          source_fabric_roll_id: null,
          source_offset_roll_id: null,
          fabric_type_id: fabricTypeId,
          num_bags: qty,
          weight_kg: weight,
          entry_date: purchase_date,
          status: "available",
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Finishing bundle stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;

    } else if (dept === "roto-printing") {
      let brand = "ROTO";
      if (productId) {
        const { data: p } = await adminSupabase.from("roto_products").select("brand").eq("id", productId).maybeSingle();
        if (p) brand = (p as any).brand;
      }
      const rollId = `E-${brand}`;

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("roto_film_rolls") as any)
        .insert({
          roll_id: rollId,
          s_no: 1,
          brand_id: productId,
          film_type: "PLAIN",
          color_id: null,
          weight_kg: weight,
          meters: qty,
          entry_date: purchase_date,
          status: "available",
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Roto roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;
    }

    // Insert purchase item history
    const { error: itemError } = await (adminSupabase
      .from("product_purchase_items") as any)
      .insert({
        purchase_id: purchaseId,
        department: dept,
        product_id: productId,
        fabric_type_id: fabricTypeId,
        lamination_type: lamType,
        offset_type: offsetType,
        quantity: qty,
        weight: weight,
        rate: rate,
        amount: amount,
        created_stock_id: createdStockId
      });

    if (itemError) {
      throw new Error(`Failed to save purchase item history: ${itemError.message}`);
    }
  }

  // 3. Auto-generate accounting journal entries
  try {
    const [purchaseAcResult, supplierAcResult] = await Promise.all([
      adminSupabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),
      adminSupabase.from("customers").select("id, customer_name, linked_customer_id").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()
    ]);
    const purchaseAc = purchaseAcResult.data as any;
    let supplierAc = supplierAcResult.data as any;

    if (supplierAc && supplierAc.linked_customer_id) {
      const { data: parent } = await adminSupabase
        .from("customers")
        .select("id, customer_name")
        .eq("id", supplierAc.linked_customer_id)
        .is("deleted_at", null)
        .maybeSingle();
      if (parent) {
        supplierAc = parent;
      }
    }

    const journalNo = await generateNextJournalNo(adminSupabase);
    const journalInserts = [
      {
        journal_no: journalNo,
        entry_date: purchase_date,
        account_id: purchaseAc?.id ?? null,
        account_name: purchaseAc?.customer_name ?? "Purchase A/c",
        entry_type: "debit",
        amount: totalBillValue,
        description: `Product Purchase: ${bill_number} (${supplierAc?.customer_name ?? supplier_name})`,
        created_by: user.id,
        updated_by: user.id,
      },
      {
        journal_no: journalNo,
        entry_date: purchase_date,
        account_id: supplierAc?.id ?? null,
        account_name: supplierAc?.customer_name ?? supplier_name,
        entry_type: "credit",
        amount: totalBillValue,
        description: `Product Purchase: ${bill_number}`,
        created_by: user.id,
        updated_by: user.id,
      },
    ];
    await (adminSupabase.from("accounts_journal") as any).insert(journalInserts);
  } catch (journalErr) {
    console.error("Auto-journal for product purchase failed:", journalErr);
  }

  revalidatePath("/", "layout");
}

export async function deleteProductPurchase(formData: FormData) {
  const user = await requirePermission("accounts.product_purchase");
  const purchaseId = String(formData.get("id") ?? "");

  if (!purchaseId) throw new Error("Purchase ID is required.");

  const adminSupabase = createAdminClient();

  // 1. Fetch purchase details (including supplier and bill number to find journal entries)
  const { data: purchase, error: fetchErr } = await (adminSupabase
    .from("product_purchases") as any)
    .select("bill_number, supplier_name")
    .eq("id", purchaseId)
    .maybeSingle();

  if (fetchErr || !purchase) {
    throw new Error("Product purchase not found.");
  }

  const { data: items } = await (adminSupabase
    .from("product_purchase_items") as any)
    .select("department, created_stock_id")
    .eq("purchase_id", purchaseId);

  // 2. Delete created stock items from their respective tables
  if (items && items.length > 0) {
    for (const item of items) {
      if (!item.created_stock_id) continue;

      if (item.department === "fabric") {
        await (adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id);
      } else if (item.department === "lamination") {
        await (adminSupabase.from("lamination_rolls") as any).delete().eq("id", item.created_stock_id);
      } else if (item.department === "offset-printing") {
        await (adminSupabase.from("offset_rolls") as any).delete().eq("id", item.created_stock_id);
      } else if (item.department === "finishing") {
        await (adminSupabase.from("finishing_bundles") as any).delete().eq("id", item.created_stock_id);
      } else if (item.department === "roto-printing") {
        await (adminSupabase.from("roto_film_rolls") as any).delete().eq("id", item.created_stock_id);
      }
    }
  }

  // 3. Delete matching auto-generated journal entries
  try {
    const queryDesc = `Product Purchase: ${purchase.bill_number}`;
    await (adminSupabase
      .from("accounts_journal") as any)
      .delete()
      .or(`description.eq."${queryDesc}",description.like."%${purchase.bill_number}%"`);
  } catch (journalErr) {
    console.error("Failed to delete associated journal entries:", journalErr);
  }

  // 4. Delete the purchase header and cascade delete purchase items
  const { error: deleteErr } = await (adminSupabase
    .from("product_purchases") as any)
    .delete()
    .eq("id", purchaseId);

  if (deleteErr) throw new Error(deleteErr.message);

  revalidatePath("/", "layout");
}
