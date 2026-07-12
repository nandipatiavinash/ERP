"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ClientOrderItemPayload = {
  category: "fabric" | "finishing";
  productId: string;
  quantity: number;
};

export async function createClientSalesOrder(items: ClientOrderItemPayload[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user details
  const { data: dbUser, error: dbUserErr } = await (supabase
    .from("users") as any)
    .select("customer_id")
    .eq("id", user.id)
    .single();

  if (dbUserErr || !dbUser || !dbUser.customer_id) {
    throw new Error("Your user account is not linked to any customer firm.");
  }

  if (items.length === 0) {
    throw new Error("No items in order.");
  }

  // Validate quantities
  for (const item of items) {
    if (item.quantity <= 0 || isNaN(item.quantity)) {
      throw new Error("Quantity must be greater than zero.");
    }
  }

  const orderDate = new Date().toISOString().split("T")[0];

  // 1. Generate Order Number using RPC
  let orderNumber = "";
  const { data: orderNumberData, error: orderNumberErr } = await (supabase as any).rpc("get_next_order_no", { p_order_date: orderDate });
  if (!orderNumberErr && orderNumberData) {
    orderNumber = String(orderNumberData);
  } else {
    orderNumber = `CL-${Date.now()}`;
  }

  // 2. Insert Sales Order Header
  const { data: orderHeader, error: headerError } = await (supabase
    .from("sales_orders") as any)
    .insert({
      customer_id: dbUser.customer_id,
      order_date: orderDate,
      order_number: orderNumber,
      status: "draft",
      created_by: user.id,
      updated_by: user.id
    })
    .select("id")
    .single();

  if (headerError) throw new Error(headerError.message);

  // 3. Insert Sales Order Items
  const itemsPayload = items.map((item) => ({
    sales_order_id: (orderHeader as any).id,
    department: item.category,
    product_id: item.productId,
    quantity: item.quantity,
    fabric_type_id: item.category === "fabric" ? item.productId : null,
  }));

  const { error: itemsError } = await (supabase
    .from("sales_order_items") as any)
    .insert(itemsPayload);

  if (itemsError) throw new Error(itemsError.message);

  revalidatePath("/client/dashboard");
  revalidatePath("/accounts/sales");
}
