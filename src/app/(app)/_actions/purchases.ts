"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, requireAnyPermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateNextJournalNo, todayInIndia } from "./helpers";

export async function saveRawMaterialPurchase(formData: FormData) {
  const user = await requireAnyPermission(["raw_materials.edit", "accounts.purchase"]);

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
      total_amount: totalBillValue,
      remarks: finalRemarks,
      created_by: user.id,
      updated_by: user.id,
    };
  });

  const { data: insertedRows, error } = await (supabase.from("raw_material_purchases") as any).insert(inserts).select("id");
  if (error) throw new Error(error.message);
  // Use first inserted row ID as the unique source tag for journal linkage
  const purchaseSourceId: string = insertedRows?.[0]?.id ?? "";

  // Auto-generate journal entries for purchase
  try {
    const [purchaseAcResult, supplierAcResult] = await Promise.all([
      supabase.from("customers").select("id, customer_name").ilike("customer_name", "Purchase A/c").is("deleted_at", null).maybeSingle(),
      supabase.from("customers").select("id, customer_name, linked_customer_id").ilike("customer_name", supplier_name).is("deleted_at", null).maybeSingle()
    ]);
    const purchaseAc = purchaseAcResult.data as any;
    let supplierAc = supplierAcResult.data as any;

    if (supplierAc && supplierAc.linked_customer_id) {
      const { data: parent } = await supabase
        .from("customers")
        .select("id, customer_name")
        .eq("id", supplierAc.linked_customer_id)
        .is("deleted_at", null)
        .maybeSingle();
      if (parent) {
        supplierAc = parent;
      }
    }

    const journalNo = await generateNextJournalNo(supabase);
    const journalInserts = [
      {
        journal_no: journalNo,
        entry_date: purchase_date,
        account_id: purchaseAc?.id ?? null,
        account_name: purchaseAc?.customer_name ?? "Purchase A/c",
        entry_type: "debit",
        amount: totalBillValue,
        description: `${bill_number} (${supplierAc?.customer_name ?? supplier_name}) (RM:${purchaseSourceId})`,
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
        description: `${bill_number} (RM:${purchaseSourceId})`,
        created_by: user.id,
        updated_by: user.id,
      },
    ];
    await (supabase.from("accounts_journal") as any).insert(journalInserts);
  } catch (_journalErr) {
    // Purchase saved successfully, journal auto-gen is best-effort
    console.error("Auto-journal for purchase failed:", _journalErr);
  }

  revalidatePath("/", "layout");
}

export async function deleteRawMaterialPurchase(purchaseId: string) {
  const user = await requirePermission("accounts.purchase");
  if (!purchaseId) throw new Error("Purchase ID is required.");

  const supabase = await createClient();

  // Fetch the purchase to get the details for journal cleanup
  const { data: purchase, error: fetchError } = await (supabase
    .from("raw_material_purchases") as any)
    .select("id, bill_number, supplier_name, purchase_date")
    .eq("id", purchaseId)
    .single();

  if (fetchError || !purchase) {
    throw new Error("Purchase entry not found.");
  }

  // Enforce today-only deletion limit for purchase entries
  if (purchase.purchase_date !== todayInIndia()) {
    throw new Error("Purchase entries can only be deleted on the same day they were purchased.");
  }

  // 1. Soft-delete first to trigger the plpgsql stock updates trigger (apply_raw_material_purchase)
  const { error: softDeleteError } = await (supabase
    .from("raw_material_purchases") as any)
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq("id", purchaseId);

  if (softDeleteError) throw new Error(softDeleteError.message);

  // 2. Hard-delete the purchase row
  const { error: deleteError } = await (supabase
    .from("raw_material_purchases") as any)
    .delete()
    .eq("id", purchaseId);

  if (deleteError) throw new Error(deleteError.message);

  // Delete auto-generated journal entries using the unique RM:UUID tag (safe, no bill-number collisions)
  const { data: journalRows } = await (supabase
    .from("accounts_journal") as any)
    .select("journal_no")
    .ilike("description", `%RM:${purchaseId}%`)
    .is("deleted_at", null);

  const journalNos = [...new Set((journalRows || []).map((r: any) => r.journal_no))];
  if (journalNos.length > 0) {
    await (supabase
      .from("accounts_journal") as any)
      .delete()
      .in("journal_no", journalNos);
  }

  revalidatePath("/", "layout");
}
