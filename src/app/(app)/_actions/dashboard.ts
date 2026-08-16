"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function closeOperatorOrderItem(itemId: string, department: string) {
  await requirePermission("dashboard.view");

  if (!itemId || !department) {
    throw new Error("Item ID and Department are required.");
  }

  const supabase = (await createClient()) as any;
  const { error } = await supabase
    .from("operator_dashboard_status")
    .upsert({
      sales_order_item_id: itemId,
      department,
      is_closed: true
    }, {
      onConflict: "sales_order_item_id,department"
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
