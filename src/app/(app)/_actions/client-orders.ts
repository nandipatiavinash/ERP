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

  // Custom production fields
  fabricTypeId?: string | null;
  rotoProductId?: string | null;
  offsetProductId?: string | null;
  filmType?: string | null;
  isMetallic?: boolean;
  laminationType?: string | null;
  offsetType?: string | null;
};

export async function createClientOrder(items: ClientOrderItemPayload[]) {
  try {
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
      fabric_type_id: item.itemType === "fabric" ? item.productId : item.fabricTypeId,
      finishing_product_id: item.itemType === "finishing" ? item.productId : null,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unitPrice,

      // Production fields
      roto_product_id: item.rotoProductId || null,
      offset_product_id: item.offsetProductId || null,
      film_type: item.filmType || null,
      is_metallic: !!item.isMetallic,
      lamination_type: item.laminationType || null,
      offset_type: item.offsetType || null,
    }));

    const { error: itemsErr } = await (admin
      .from("client_order_items") as any)
      .insert(itemsPayload);

    if (itemsErr) throw new Error(`Failed to save order items: ${itemsErr.message}`);

    revalidatePath("/portal/dashboard");
    return { success: true, orderNumber };
  } catch (error: any) {
    console.error("createClientOrder error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function approveClientOrder(clientOrderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();

  // 1. Fetch client order header & items
  const { data: order, error: orderErr } = await admin
    .from("client_orders")
    .select("*, client_order_items(*)")
    .eq("id", clientOrderId)
    .single() as any;

  if (orderErr || !order) throw new Error("Client order not found.");
  if (order.status !== "pending") throw new Error("Order is already processed.");

  const orderDate = new Date().toISOString().split("T")[0];

  // 2. Generate ERP Order Number
  let orderNumber = "";
  const { data: orderNumberData, error: orderNumberErr } = await (admin as any).rpc("get_next_order_no", { p_order_date: orderDate });
  if (!orderNumberErr && orderNumberData) {
    orderNumber = String(orderNumberData);
  } else {
    orderNumber = `CL-${Date.now()}`;
  }

  // 3. Insert into sales_orders (ERP core table) as draft
  const { data: salesOrder, error: salesOrderErr } = await (admin
    .from("sales_orders") as any)
    .insert({
      customer_id: order.customer_id,
      order_date: orderDate,
      order_number: orderNumber,
      status: "draft",
      created_by: user.id,
      updated_by: user.id
    })
    .select("id")
    .single() as any;

  if (salesOrderErr) throw new Error(`Failed to create ERP order: ${salesOrderErr.message}`);

  // 4. Insert items into sales_order_items
  const itemsPayload = order.client_order_items.map((item: any) => ({
    sales_order_id: salesOrder.id,
    department: item.item_type === "fabric" ? "fabric" : "finishing",
    product_id: item.item_type === "fabric" ? item.fabric_type_id : item.finishing_product_id,
    quantity: Number(item.quantity),
    fabric_type_id: item.fabric_type_id || null,
    roto_product_id: item.roto_product_id || null,
    offset_product_id: item.offset_product_id || null,
    film_type: item.film_type || null,
    is_metallic: !!item.is_metallic,
    lamination_type: item.lamination_type || null,
    offset_type: item.offset_type || null,
  }));

  const { error: itemsErr } = await (admin
    .from("sales_order_items") as any)
    .insert(itemsPayload);

  if (itemsErr) {
    await (admin.from("sales_orders") as any).delete().eq("id", salesOrder.id);
    throw new Error(`Failed to create ERP order items: ${itemsErr.message}`);
  }

  // 5. Update client_orders status to confirmed
  const { error: updateErr } = await (admin
    .from("client_orders") as any)
    .update({ status: "confirmed" })
    .eq("id", clientOrderId);

  if (updateErr) throw new Error(`Failed to update client order status: ${updateErr.message}`);

  revalidatePath("/sales/client-orders");
  revalidatePath("/sales/order-confirmation");
  revalidatePath("/portal/dashboard");
}

export async function cancelClientOrder(clientOrderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();

  const { error: updateErr } = await (admin
    .from("client_orders") as any)
    .update({ status: "cancelled" })
    .eq("id", clientOrderId);

  if (updateErr) throw new Error(`Failed to cancel client order: ${updateErr.message}`);

  revalidatePath("/sales/client-orders");
  revalidatePath("/portal/dashboard");
}
