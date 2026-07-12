"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type ClientOrderItemPayload = {
  itemType: "fabric" | "finishing";
  productId: string; // fabric_type_id or finishing_product_id
  quantity: number;
  unitPrice: number;
  unit: string;
};

export async function createClientOrder(items: ClientOrderItemPayload[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (items.length === 0) throw new Error("No items in order.");
  for (const item of items) {
    if (item.quantity <= 0 || isNaN(item.quantity)) throw new Error("Quantity must be greater than zero.");
  }

  // Get user's customer_id from their profile
  const { data: dbUser, error: dbUserErr } = await (supabase
    .from("users") as any)
    .select("customer_id")
    .eq("id", user.id)
    .single();

  if (dbUserErr || !dbUser?.customer_id) {
    throw new Error("Your account is not linked to a customer firm. Please contact your administrator.");
  }

  const admin = createAdminClient();

  // Generate order number
  const { data: orderNo } = await (admin as any).rpc("next_client_order_no");
  const orderNumber = orderNo || `CO-${Date.now()}`;

  // Insert order header
  const { data: order, error: orderErr } = await (admin
    .from("client_orders") as any)
    .insert({
      order_number: orderNumber,
      customer_id: dbUser.customer_id,
      order_date: new Date().toISOString().split("T")[0],
      status: "pending",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (orderErr) throw new Error(`Failed to create order: ${orderErr.message}`);

  // Insert order items
  const itemsPayload = items.map((item) => ({
    order_id: order.id,
    item_type: item.itemType,
    fabric_type_id: item.itemType === "fabric" ? item.productId : null,
    finishing_product_id: item.itemType === "finishing" ? item.productId : null,
    quantity: item.quantity,
    unit: item.unit,
    unit_price: item.unitPrice,
  }));

  const { error: itemsErr } = await (admin
    .from("client_order_items") as any)
    .insert(itemsPayload);

  if (itemsErr) throw new Error(`Failed to save order items: ${itemsErr.message}`);

  revalidatePath("/portal/dashboard");
  return { orderNumber };
}
