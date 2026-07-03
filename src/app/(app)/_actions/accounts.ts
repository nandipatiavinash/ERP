"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveAccountOpeningBalance(formData: FormData) {
  const user = await requirePermission("customers.edit");
  const id = String(formData.get("id") ?? "");
  const openingDebit = Number(formData.get("opening_debit") ?? 0);
  const openingCredit = Number(formData.get("opening_credit") ?? 0);

  if (!id) {
    throw new Error("Account ID is required.");
  }
  if (openingDebit < 0 || openingCredit < 0) {
    throw new Error("Opening values cannot be negative.");
  }

  const supabase = await createClient();
  const { error } = await (supabase
    .from("customers") as any)
    .update({
      opening_debit: openingDebit,
      opening_credit: openingCredit,
      updated_by: user.id,
    } as any)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/reports/opening-balance");
  revalidatePath("/reports/accounts");
}

export async function clearSystemTransactions() {
  // SEC-04 / AZ-01 / ISS-004: This is a catastrophic mass-delete. Require admin-only.
  // Changed from "users.view" (any operator) to "admin.credentials" (admin only).
  const user = await requirePermission("admin.credentials");

  const supabase = await createClient();

  // 1. Delete transactions in order of dependency constraints
  const tablesToDelete = [
    "material_sales",
    "raw_material_purchases",
    "raw_material_consumptions",
    "accounts_journal",
    "sales_order_items",
    "sales_orders",
    "stage_production_entries",
  ];

  for (const table of tablesToDelete) {
    const { error } = await (supabase.from(table) as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error(`Failed to clear table ${table}:`, error);
      throw new Error(`Failed to clear table ${table}: ${error.message}`);
    }
  }

  // 2. Reset fabric_rolls status to 'available'
  const { error: rollResetErr } = await (supabase
    .from("fabric_rolls") as any)
    .update({ status: "available", current_stage: "loom", updated_by: user.id } as any)
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (rollResetErr) {
    console.error("Failed to reset fabric rolls status:", rollResetErr);
    throw new Error(`Failed to reset fabric rolls: ${rollResetErr.message}`);
  }

  // 3. Reset raw materials stock level back to opening_stock
  const { data: rawMaterials, error: fetchRmErr } = await (supabase
    .from("raw_materials") as any)
    .select("id, opening_stock")
    .is("deleted_at", null);

  if (fetchRmErr) {
    throw new Error(`Failed to fetch raw materials: ${fetchRmErr.message}`);
  }

  for (const rm of (rawMaterials ?? [])) {
    const { error: rmResetErr } = await (supabase
      .from("raw_materials") as any)
      .update({ current_stock: rm.opening_stock, updated_by: user.id })
      .eq("id", rm.id);

    if (rmResetErr) {
      throw new Error(`Failed to reset raw material stock for ${rm.id}: ${rmResetErr.message}`);
    }
  }

  // 4. Create alias accounts for existing clients who have aliases but no "[Alias] A/c" yet
  const { data: activeClients } = await (supabase.from("customers") as any)
    .select("id, customer_name, alias")
    .eq("is_internal", "client a/c")
    .is("deleted_at", null);

  for (const client of activeClients ?? []) {
    const alias = String(client.alias ?? "").trim();
    if (alias && !client.customer_name.endsWith(" A/c")) {
      const aliasName = `${alias} A/c`;
      const { data: existing } = await (supabase.from("customers") as any)
        .select("id")
        .eq("customer_name", aliasName)
        .is("deleted_at", null)
        .maybeSingle();

      if (!existing) {
        await (supabase.from("customers") as any).insert({
          customer_name: aliasName,
          is_internal: "client a/c",
          status: "active",
          created_by: user.id,
          updated_by: user.id,
        });
      }
    }
  }

  // Revalidate paths to clear caches
  revalidatePath("/admin/raw-materials");
  revalidatePath("/fabric/stock");
  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/purchase");
  revalidatePath("/accounts/consumption");
  revalidatePath("/accounts/journal");
  revalidatePath("/reports/stock");
  revalidatePath("/reports/closing-stock");
  revalidatePath("/reports/accounts");
  revalidatePath("/dashboard");
}

export async function saveClosingStock(
  date: string,
  customPrices: Record<string, number>,
  baseTotal: number,
  wipAmount: number,
  gstAmount: number,
  grandTotal: number
) {
  const user = await requirePermission("reports.view");
  const supabase = await createClient();

  const key = `closing_stock_${date}`;
  const value = {
    customPrices,
    baseTotal,
    wipAmount,
    gstAmount,
    grandTotal,
    submittedAt: new Date().toISOString(),
    submittedBy: user.id
  };

  const { data: existing } = await (supabase.from("settings") as any)
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase.from("settings") as any)
      .update({ value, updated_by: user.id } as any)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await (supabase.from("settings") as any)
      .insert({
        key,
        value,
        created_by: user.id,
        updated_by: user.id
      } as any);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/reports/closing-stock");
  revalidatePath("/reports/profit-loss");
  revalidatePath("/reports/balance-sheet");
}

export async function saveProfitLoss(
  date: string,
  manualExpenses: number,
  netProfit: number,
  netLoss: number
) {
  const user = await requirePermission("reports.view");
  const supabase = await createClient();

  const key = `profit_loss_${date}`;
  const value = {
    manualExpenses,
    netProfit,
    netLoss,
    submittedAt: new Date().toISOString(),
    submittedBy: user.id
  };

  const { data: existing } = await (supabase.from("settings") as any)
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase.from("settings") as any)
      .update({ value, updated_by: user.id } as any)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await (supabase.from("settings") as any)
      .insert({
        key,
        value,
        created_by: user.id,
        updated_by: user.id
      } as any);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/reports/profit-loss");
  revalidatePath("/reports/balance-sheet");
}
