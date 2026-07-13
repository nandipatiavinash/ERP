"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateNextJournalNo } from "./helpers";

export async function saveProductPurchase(formData: FormData) {
  try {
    const user = await requirePermission("accounts.product_purchase");

  const purchase_date = String(formData.get("purchase_date") ?? "");
  const supplier_name = String(formData.get("supplier_name") ?? "");
  const bill_number = String(formData.get("bill_number") ?? "");
  const remarks = String(formData.get("remarks") ?? "").trim();
  const totalBillValue = Number(formData.get("total_bill_value") ?? 0);

  const departments = formData.getAll("department").map(String);
  const roto_product_ids = formData.getAll("roto_product_id").map(String);
  const offset_product_ids = formData.getAll("offset_product_id").map(String);
  const fabric_type_ids = formData.getAll("fabric_type_id").map(String);
  const lamination_types = formData.getAll("lamination_type").map(String);
  const offset_types = formData.getAll("offset_type").map(String);
  const quantities = formData.getAll("quantity").map(Number);
  const weights = formData.getAll("weight").map(Number);
  const rates = formData.getAll("rate").map(Number);

  // New spec inputs
  const supplier_roll_ids = formData.getAll("supplier_roll_id").map(String);
  const source_roll_ids = formData.getAll("source_roll_id").map(String);
  const film_types = formData.getAll("film_type").map(String);
  const is_metallics = formData.getAll("is_metallic").map((v) => v === "true");
  const color_ids = formData.getAll("color_id").map(String);

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

  // 2. Process and insert each item into history and stock registers
  const createdStockRecords: { table: string; id: string }[] = [];
  try {
    for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    const rotoProductId = roto_product_ids[i] || null;
    const offsetProductId = offset_product_ids[i] || null;
    const fabricTypeId = fabric_type_ids[i] || null;
    const lamType = lamination_types[i] || null;
    const offsetType = offset_types[i] || null;
    const qty = quantities[i] || 0;
    const weight = weights[i] || 0;
    const rate = rates[i] || 0;

    // Direct bill value rate (no qty/weight multiplication)
    const amount = rate;

    // New inputs
    const supplierRollId = supplier_roll_ids[i] !== undefined && supplier_roll_ids[i] !== null ? supplier_roll_ids[i] : null;
    const sourceRollId = source_roll_ids[i] || null;
    const filmType = film_types[i] || null;
    const isMetallic = is_metallics[i] || false;
    const colorId = color_ids[i] || null;

    let createdStockId: string | null = null;

    // Fetch fabric name for labelling
    let fabricName = "";
    if (fabricTypeId) {
      const { data: f } = await adminSupabase.from("fabric_types").select("fabric_name").eq("id", fabricTypeId).maybeSingle();
      if (f) fabricName = (f as any).fabric_name;
    }

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
          supplier_roll_id: supplierRollId,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Fabric roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;
      createdStockRecords.push({ table: "fabric_rolls", id: stockItem.id });

    } else if (dept === "roto-printing") {
      let brandName = "ROTO";
      if (rotoProductId) {
        const { data: p } = await adminSupabase
          .from("roto_products")
          .select("brand")
          .eq("id", rotoProductId)
          .maybeSingle();
        if (p) brandName = (p as any).brand;
      }

      let colorName = "";
      if (colorId) {
        const { data: c } = await adminSupabase.from("roto_colors").select("color_name").eq("id", colorId).maybeSingle();
        if (c) colorName = (c as any).color_name;
      }

      const filmTypeChar = filmType === "gloss" ? "G" : "M";
      const baseId = `${brandName.trim()}(${filmTypeChar})${colorName ? `(${colorName.trim()})` : ""}`.toUpperCase();

      let rollId = "";
      let seq = 1;

      if (supplierRollId) {
        rollId = supplierRollId.trim().toUpperCase();
      } else {
        const { count } = await adminSupabase
          .from("roto_film_rolls")
          .select("id", { count: "exact", head: true })
          .eq("roll_id", baseId)
          .is("deleted_at", null);
        seq = (count ?? 0) + 1;
        rollId = baseId;
      }

      if (!isMetallic) {
        const { data: stockItem, error: stockErr } = await (adminSupabase
          .from("roto_film_rolls") as any)
          .insert({
            roll_id: rollId,
            s_no: seq,
            brand_id: rotoProductId,
            film_type: filmType || "gloss",
            color_id: colorId,
            weight_kg: weight,
            meters: qty,
            entry_date: purchase_date,
            status: "available",
            supplier_roll_id: supplierRollId,
            created_by: user.id,
            updated_by: user.id,
          })
          .select("id")
          .single();

        if (stockErr) throw new Error(`Roto film roll stock insert failed: ${stockErr.message}`);
        createdStockId = stockItem.id;
        createdStockRecords.push({ table: "roto_film_rolls", id: stockItem.id });
      } else {
        // Insert dummy film roll consumed
        const { data: filmRoll, error: filmErr } = await (adminSupabase
          .from("roto_film_rolls") as any)
          .insert({
            roll_id: rollId,
            s_no: seq,
            brand_id: rotoProductId,
            film_type: filmType || "gloss",
            color_id: colorId,
            weight_kg: weight,
            meters: qty,
            entry_date: purchase_date,
            status: "consumed",
            supplier_roll_id: supplierRollId,
            created_by: user.id,
            updated_by: user.id,
          })
          .select("id")
          .single();

        if (filmErr || !filmRoll) throw new Error(`Roto dummy film roll stock insert failed: ${filmErr?.message}`);
        createdStockRecords.push({ table: "roto_film_rolls", id: filmRoll.id });

        // Insert roto metallic roll
        const metallicRollId = `${rollId}(MT)`.toUpperCase();
        const { data: stockItem, error: stockErr } = await (adminSupabase
          .from("roto_metallic_rolls") as any)
          .insert({
            roll_id: metallicRollId,
            s_no: seq,
            source_film_roll_id: filmRoll.id,
            is_split: false,
            weight_kg: weight,
            meters: qty,
            entry_date: purchase_date,
            status: "available",
            supplier_roll_id: supplierRollId,
            created_by: user.id,
            updated_by: user.id,
          })
          .select("id")
          .single();

        if (stockErr) throw new Error(`Roto metallic roll stock insert failed: ${stockErr.message}`);
        createdStockId = stockItem.id;
        createdStockRecords.push({ table: "roto_metallic_rolls", id: stockItem.id });
      }

    } else if (dept === "lamination") {
      let parentRollNo = "";
      if (sourceRollId) {
        const { data: fr } = await adminSupabase.from("fabric_rolls").select("roll_number").eq("id", sourceRollId).maybeSingle();
        if (fr) parentRollNo = (fr as any).roll_number;
      }

      let brandName = "PLAIN";
      if (["BOX", "F_S", "H_S"].includes(lamType || "")) {
        if (rotoProductId) {
          const { data: p } = await adminSupabase.from("roto_products").select("brand").eq("id", rotoProductId).maybeSingle();
          if (p) brandName = (p as any).brand;
        }
      } else if (lamType === "NW") {
        brandName = "NW";
      }

      let suffix = "";
      if (lamType === "BOX") suffix = "B";
      else if (lamType === "F_S") suffix = "F";
      else if (lamType === "H_S") suffix = "H";

      let baseId = "";
      if (lamType === "PLAIN" || lamType === "NW") {
        baseId = `${brandName.trim()}(${fabricName.trim()})`;
      } else {
        baseId = `${brandName.trim()}(${fabricName.trim()})(${suffix})`;
      }
      baseId = baseId.toUpperCase();

      let rollId = "";
      let seq = 1;

      if (supplierRollId) {
        rollId = supplierRollId.trim().toUpperCase();
      } else if (parentRollNo) {
        if (lamType === "PLAIN" || lamType === "NW") {
          rollId = `${parentRollNo.trim()}(${lamType})`;
        } else {
          rollId = `${parentRollNo.trim()}(${lamType})(${suffix})`;
        }
      } else {
        const { count } = await adminSupabase
          .from("lamination_rolls")
          .select("id", { count: "exact", head: true })
          .eq("roll_id", baseId)
          .is("deleted_at", null);
        seq = (count ?? 0) + 1;
        rollId = baseId;
      }

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("lamination_rolls") as any)
        .insert({
          roll_id: rollId,
          s_no: seq,
          product_id: null,
          lam_type: lamType || "PLAIN",
          fabric_type_id: fabricTypeId,
          film_roll_id: null,
          nw_material_id: null,
          weight_kg: weight,
          meters: qty,
          entry_date: purchase_date,
          status: "available",
          supplier_roll_id: supplierRollId,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Lamination roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;
      createdStockRecords.push({ table: "lamination_rolls", id: stockItem.id });

      // Consume source fabric roll
      if (sourceRollId) {
        await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);
      }

    } else if (dept === "offset-printing") {
      let parentRollNo = "";
      if (sourceRollId) {
        const { data: lr } = await adminSupabase.from("lamination_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();
        if (lr) parentRollNo = (lr as any).roll_id;
      }

      let brandName = "OFFSET";
      if (offsetProductId) {
        const { data: p } = await adminSupabase.from("offset_products").select("brand").eq("id", offsetProductId).maybeSingle();
        if (p) brandName = (p as any).brand;
      }

      const fabricNameVal = offsetType === "NW" ? "NW" : fabricName;
      const baseId = `${brandName.trim()}(${fabricNameVal.trim()})`.toUpperCase();

      let rollId = "";
      let seq = 1;

      if (supplierRollId) {
        rollId = supplierRollId.trim().toUpperCase();
      } else if (parentRollNo) {
        rollId = `${parentRollNo.trim()}(OFFSET)`;
      } else {
        const { count } = await adminSupabase
          .from("offset_rolls")
          .select("id", { count: "exact", head: true })
          .eq("roll_id", baseId)
          .is("deleted_at", null);
        seq = (count ?? 0) + 1;
        rollId = baseId;
      }

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("offset_rolls") as any)
        .insert({
          roll_id: rollId,
          s_no: seq,
          offset_type: offsetType || "FABRIC",
          brand_id: offsetProductId,
          fabric_type_id: fabricTypeId,
          source_lam_roll_id: sourceRollId || null,
          weight_kg: weight,
          entry_date: purchase_date,
          status: "available",
          supplier_roll_id: supplierRollId,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Offset roll stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;
      createdStockRecords.push({ table: "offset_rolls", id: stockItem.id });

      // Consume source lamination roll
      if (sourceRollId) {
        await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);
      }

    } else if (dept === "finishing") {
      let parentRollNo = "";
      const sourceType = lamination_types[i] || "fabric"; // Reuse unused lamination_type field as sourceType in finishing row

      if (sourceRollId) {
        if (sourceType === "fabric") {
          const { data: r } = await adminSupabase.from("fabric_rolls").select("roll_number").eq("id", sourceRollId).maybeSingle();
          if (r) parentRollNo = (r as any).roll_number;
        } else if (sourceType === "lamination") {
          const { data: r } = await adminSupabase.from("lamination_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();
          if (r) parentRollNo = (r as any).roll_id;
        } else if (sourceType === "offset") {
          const { data: r } = await adminSupabase.from("offset_rolls").select("roll_id").eq("id", sourceRollId).maybeSingle();
          if (r) parentRollNo = (r as any).roll_id;
        }
      }

      const baseId = `PLAIN(${fabricName.trim()})`.toUpperCase();

      let bundleId = "";
      let seq = 1;

      if (supplierRollId) {
        bundleId = supplierRollId.trim().toUpperCase();
      } else if (parentRollNo) {
        bundleId = parentRollNo;
      } else {
        const { count } = await adminSupabase
          .from("finishing_bundles")
          .select("id", { count: "exact", head: true })
          .eq("bundle_id", baseId)
          .is("deleted_at", null);
        seq = (count ?? 0) + 1;
        bundleId = baseId;
      }

      const { data: stockItem, error: stockErr } = await (adminSupabase
        .from("finishing_bundles") as any)
        .insert({
          bundle_id: bundleId,
          s_no: seq,
          finish_type: sourceType === "fabric" ? "FABRIC" : sourceType === "lamination" ? "LAMINATION" : "OFFSET",
          product_id: null,
          source_lam_roll_id: sourceType === "lamination" ? sourceRollId : null,
          source_fabric_roll_id: sourceType === "fabric" ? sourceRollId : null,
          source_offset_roll_id: sourceType === "offset" ? sourceRollId : null,
          fabric_type_id: fabricTypeId,
          num_bags: qty,
          weight_kg: weight,
          entry_date: purchase_date,
          status: "available",
          supplier_roll_id: supplierRollId,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (stockErr) throw new Error(`Finishing bundle stock insert failed: ${stockErr.message}`);
      createdStockId = stockItem.id;
      createdStockRecords.push({ table: "finishing_bundles", id: stockItem.id });

      // Consume source roll
      if (sourceRollId) {
        if (sourceType === "fabric") {
          await (adminSupabase.from("fabric_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);
        } else if (sourceType === "lamination") {
          await (adminSupabase.from("lamination_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);
        } else if (sourceType === "offset") {
          await (adminSupabase.from("offset_rolls") as any).update({ status: "consumed" }).eq("id", sourceRollId);
        }
      }
    }

    // Insert purchase item history matching database schema
    const { error: itemError } = await (adminSupabase
      .from("product_purchase_items") as any)
      .insert({
        purchase_id: purchaseId,
        department: dept,
        fabric_type_id: fabricTypeId,
        roto_product_id: rotoProductId,
        offset_product_id: offsetProductId,
        lamination_type: dept === "finishing" ? lamination_types[i] : lamType, // Store sourceType in lamination_type for finishing
        offset_type: offsetType,
        quantity: qty,
        weight: weight,
        rate: rate,
        amount: amount,
        created_stock_id: createdStockId,
        supplier_roll_id: supplierRollId,
        source_roll_id: sourceRollId,
        film_type: filmType,
        is_metallic: isMetallic,
        color_id: colorId,
      });

    if (itemError) {
      throw new Error(`Failed to save purchase item history: ${itemError.message}`);
    }
  }
  } catch (err: any) {
    // Self-healing rollback: Delete any stock records created in this failed purchase
    for (const rec of createdStockRecords) {
      await adminSupabase.from(rec.table).delete().eq("id", rec.id);
    }
    // Delete the header
    await adminSupabase.from("product_purchases").delete().eq("id", purchaseId);
    throw err;
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

    revalidatePath("/accounts/product-purchase");
    return { success: true };
  } catch (err: any) {
    console.error("Error in saveProductPurchase:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function deleteProductPurchase(formData: FormData) {
  try {
    const user = await requirePermission("accounts.product_purchase");
    const purchaseId = String(formData.get("id") ?? "");

    if (!purchaseId) throw new Error("Purchase ID is required.");

    const adminSupabase = createAdminClient();

    // 1. Fetch purchase details
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
      .select("department, created_stock_id, source_roll_id, lamination_type")
      .eq("purchase_id", purchaseId);

    // 2. Revert source rolls to 'available' & Delete created stock items in parallel
    if (items && items.length > 0) {
      const promises: Promise<any>[] = [];
      for (const item of items) {
        if (item.source_roll_id) {
          if (item.department === "lamination") {
            promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));
          } else if (item.department === "offset-printing") {
            promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));
          } else if (item.department === "finishing") {
            const sourceType = item.lamination_type || "fabric";
            if (sourceType === "fabric") {
              promises.push((adminSupabase.from("fabric_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));
            } else if (sourceType === "lamination") {
              promises.push((adminSupabase.from("lamination_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));
            } else if (sourceType === "offset") {
              promises.push((adminSupabase.from("offset_rolls") as any).update({ status: "available" }).eq("id", item.source_roll_id));
            }
          }
        }

        if (!item.created_stock_id) continue;

        if (item.department === "fabric") {
          promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));
        } else if (item.department === "lamination") {
          promises.push((adminSupabase.from("lamination_rolls") as any).delete().eq("id", item.created_stock_id));
        } else if (item.department === "offset-printing") {
          promises.push((adminSupabase.from("offset_rolls") as any).delete().eq("id", item.created_stock_id));
        } else if (item.department === "finishing") {
          promises.push((adminSupabase.from("finishing_bundles") as any).delete().eq("id", item.created_stock_id));
        } else if (item.department === "roto-printing") {
          // Handle deletion for film and metallic rolls
          promises.push((async () => {
            const { data: metallic } = await adminSupabase
              .from("roto_metallic_rolls")
              .select("source_film_roll_id")
              .eq("id", item.created_stock_id)
              .maybeSingle();

            if (metallic) {
              await adminSupabase.from("roto_metallic_rolls").delete().eq("id", item.created_stock_id);
              if ((metallic as any).source_film_roll_id) {
                await adminSupabase.from("roto_film_rolls").delete().eq("id", (metallic as any).source_film_roll_id);
              }
            } else {
              await adminSupabase.from("roto_film_rolls").delete().eq("id", item.created_stock_id);
            }
          })());
        }
      }
      await Promise.all(promises);
    }

    // 3. Delete matching auto-generated journal entries
    try {
      const descExact = `Product Purchase: ${purchase.bill_number}`;
      const descPrefix = `Product Purchase: ${purchase.bill_number} (%`;
      await (adminSupabase
        .from("accounts_journal") as any)
        .delete()
        .or(`description.eq."${descExact}",description.like."${descPrefix}"`);
    } catch (journalErr) {
      console.error("Failed to delete associated journal entries:", journalErr);
    }

    // 4. Delete the purchase header and cascade delete purchase items
    const { error: deleteErr } = await (adminSupabase
      .from("product_purchases") as any)
      .delete()
      .eq("id", purchaseId);

    if (deleteErr) throw new Error(deleteErr.message);

    revalidatePath("/accounts/product-purchase");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteProductPurchase:", err);
    return { success: false, error: err.message || "Failed to delete product purchase." };
  }
}
