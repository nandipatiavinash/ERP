"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, requireAnyPermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  assertValid,
  saleSchema,
  readPayload,
  todayInIndia,
  generateNextJournalNo,
  revalidateAllReports
} from "./helpers";

export async function saveSale(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const user = await requireAnyPermission(id ? ["sales.edit"] : ["sales.create", "sales.order_confirmation"]);
  const supabase = await createClient();
  const selectedRollIds = formData.getAll("selected_roll_ids").map(String);
  const payload = {
    ...assertValid(saleSchema, {
      ...readPayload(formData, ["customer_id", "fabric_type_id", "quantity_meters", "rate", "status"]),
      selected_roll_ids: selectedRollIds,
    }),
    updated_by: user.id,
  };

  const query = id
    ? (supabase.from("sales_orders") as any).update(payload as any).eq("id", id)
    : (supabase.from("sales_orders") as any).insert({ ...payload, created_by: user.id, updated_by: user.id } as any);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath("/rolls");
  revalidatePath("/dashboard");
}

export async function createSalesOrder(formData: FormData) {
  const user = await requireAnyPermission(["sales.create", "sales.order_confirmation"]);
  const customerId = String(formData.get("customer_id") ?? "");
  const rawDate = formData.get("order_date") ? String(formData.get("order_date")).trim() : "";
  const orderDate = rawDate || todayInIndia();

  const supabase = await createClient();

  let orderNumber = "";
  const { data: orderNumberData, error: orderNumberErr } = await (supabase as any).rpc("get_next_order_no", { p_order_date: orderDate });
  if (!orderNumberErr && orderNumberData) {
    orderNumber = String(orderNumberData);

  } else {
    // Fallback if RPC is not loaded yet in DB
    const dateParts = orderDate.split("-");
    const mmDd = `${dateParts[1]}-${dateParts[2]}`;
    const { data: existing } = await (supabase
      .from("sales_orders") as any)
      .select("order_number")
      .eq("order_date", orderDate)
      .is("deleted_at", null);
    
    let maxSeq = 0;
    for (const order of (existing || []) as any[]) {
      const num = order.order_number;
      if (num.startsWith(`${mmDd}-`)) {
        const parts = num.split("-");
        const seq = Number(parts[2]);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
    orderNumber = `${mmDd}-${String(maxSeq + 1).padStart(2, "0")}`;
  }


  const { data: orderHeader, error: headerError } = await (supabase
    .from("sales_orders") as any)
    .insert({
      customer_id: customerId,
      order_date: orderDate,
      order_number: orderNumber,
      status: "draft",
      created_by: user.id,
      updated_by: user.id
    })
    .select("id")
    .single();

  if (headerError) throw new Error(headerError.message);

  const itemsJson = String(formData.get("items_json") ?? "[]");
  let items: any[] = [];
  try {
    items = JSON.parse(itemsJson);
  } catch (e) {
    throw new Error("Invalid items payload format.");
  }

  const itemsPayload = items.map((item) => ({
    sales_order_id: (orderHeader as any).id,
    department: item.department,
    product_id: item.productId,
    quantity: Number(item.quantity),
    fabric_type_id: item.fabricTypeId || null,
    roto_product_id: item.rotoProductId || null,
    offset_product_id: item.offsetProductId || null,
    film_type: item.filmType || null,
    is_metallic: !!item.isMetallic,
    lamination_type: item.laminationType || null,
    offset_type: item.offsetType || null,
  }));

  if (itemsPayload.length > 0) {
    const { error: itemsError } = await (supabase
      .from("sales_order_items") as any)
      .insert(itemsPayload);
    
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/sales/order-confirmation");
}

export async function deleteSalesOrderItem(itemId: string) {
  const user = await requireAnyPermission(["sales.edit", "sales.order_confirmation"]);
  const supabase = await createClient();

  const { data: item, error: itemError } = await (supabase
    .from("sales_order_items") as any)
    .select("sales_order_id, selected_roll_ids, department, is_metallic")
    .eq("id", itemId)
    .maybeSingle();

  if (itemError || !item) {
    throw new Error(itemError?.message || "Item not found.");
  }

  const orderId = item.sales_order_id;

  const { data: order, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select("status")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Related sales order not found.");
  }

  if ((order as any).status === "confirmed") {
    throw new Error("Items from confirmed sales orders cannot be deleted. Confirmed orders can only be deleted using SQL by database administrators.");
  }

  const rollIds = (item.selected_roll_ids as string[]) || [];

  let tblName = "";
  if (item.department === "fabric") tblName = "fabric_rolls";
  else if (item.department === "lamination") tblName = "lamination_rolls";
  else if (item.department === "offset-printing") tblName = "offset_rolls";
  else if (item.department === "finishing") tblName = "finishing_bundles";
  else if (item.department === "roto-printing") tblName = item.is_metallic ? "roto_metallic_rolls" : "roto_film_rolls";

  if (rollIds.length > 0 && tblName) {
    const { error: releaseError } = await (supabase
      .from(tblName) as any)
      .update({ status: "available", updated_by: user.id } as any)
      .in("id", rollIds);
    if (releaseError) throw new Error(releaseError.message);
  }

  const { error: deleteError } = await (supabase
    .from("sales_order_items") as any)
    .delete()
    .eq("id", itemId);
  if (deleteError) throw new Error(deleteError.message);

  const { data: remainingItems, error: countError } = await (supabase
    .from("sales_order_items") as any)
    .select("id")
    .eq("sales_order_id", orderId);

  if (countError) throw new Error(countError.message);

  if (!remainingItems || remainingItems.length === 0) {
    const { error: deleteOrderError } = await (supabase
      .from("sales_orders") as any)
      .delete()
      .eq("id", orderId);
    if (deleteOrderError) throw new Error(deleteOrderError.message);
  }

  revalidatePath("/sales/delivery-entry");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
  revalidatePath("/accounts/sales");
}

export async function confirmSalesDelivery(
  orderId: string,
  itemRolls: Record<string, string[]>,
  itemRemainingActions: Record<string, "backorder" | "close"> = {}
) {
  const user = await requireAnyPermission(["sales.edit", "sales.delivery_entry"]);
  const supabase = await createClient();

  const { data: order, error: orderFetchError } = await (supabase
    .from("sales_orders") as any)
    .select("*, sales_order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderFetchError || !order) {
    throw new Error(orderFetchError?.message || "Order not found.");
  }

  const items = (order.sales_order_items || []) as any[];

  // Retrieve roll weights from their respective tables
  const rollsData: Record<string, number> = {};
  const rollsBagsData: Record<string, number> = {};
  for (const item of items) {
    const newRollIds = itemRolls[item.id] || [];
    if (newRollIds.length === 0) continue;

    if (item.department === "fabric") {
      const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve fabric roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight || 0);
    } else if (item.department === "lamination") {
      const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve lamination roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    } else if (item.department === "offset-printing") {
      const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve offset roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    } else if (item.department === "finishing") {
      const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve finishing bundle details: ${error.message}`);
      for (const r of data || []) {
        rollsData[r.id] = Number(r.weight_kg || 0);
        rollsBagsData[r.id] = Number(r.num_bags || 0);
      }
    } else if (item.department === "roto-printing") {
      const table = item.is_metallic ? "roto_metallic_rolls" : "roto_film_rolls";
      const { data, error } = await (supabase.from(table) as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve roto roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    }
  }

  const backorderItems: Array<{ 
    department: string; 
    product_id: string; 
    quantity: number;
    fabric_type_id?: string | null;
    roto_product_id?: string | null;
    offset_product_id?: string | null;
    film_type?: string | null;
    is_metallic?: boolean;
    lamination_type?: string | null;
    offset_type?: string | null;
  }> = [];
  const itemsToKeep: string[] = [];

  for (const item of items) {
    const newRollIds = itemRolls[item.id] || [];
    const oldRollIds = (item.selected_roll_ids as string[]) || [];
    const action = itemRemainingActions[item.id] || "close";

    let tblName = "";
    if (item.department === "fabric") tblName = "fabric_rolls";
    else if (item.department === "lamination") tblName = "lamination_rolls";
    else if (item.department === "offset-printing") tblName = "offset_rolls";
    else if (item.department === "finishing") tblName = "finishing_bundles";
    else if (item.department === "roto-printing") tblName = item.is_metallic ? "roto_metallic_rolls" : "roto_film_rolls";

    if (tblName) {
      const deliveredQty = item.department === "fabric"
        ? newRollIds.length
        : item.department === "finishing"
        ? newRollIds.reduce((sum, rid) => sum + (rollsBagsData[rid] || 0), 0)
        : newRollIds.reduce((sum, rid) => sum + (rollsData[rid] || 0), 0);

      if (deliveredQty < item.quantity) {
        if (action === "backorder") {
          const remainingQty = item.quantity - deliveredQty;
          if (deliveredQty > 0) {
            const { error: updateItemError } = await (supabase
              .from("sales_order_items") as any)
              .update({
                selected_roll_ids: newRollIds,
                quantity: deliveredQty,
              } as any)
              .eq("id", item.id);
            if (updateItemError) throw new Error(updateItemError.message);
            itemsToKeep.push(item.id);

            backorderItems.push({
              department: item.department,
              product_id: item.product_id,
              quantity: remainingQty,
              fabric_type_id: item.fabric_type_id,
              roto_product_id: item.roto_product_id,
              offset_product_id: item.offset_product_id,
              film_type: item.film_type,
              is_metallic: item.is_metallic,
              lamination_type: item.lamination_type,
              offset_type: item.offset_type,
            });
          } else {
            const { error: deleteItemError } = await (supabase
              .from("sales_order_items") as any)
              .delete()
              .eq("id", item.id);
            if (deleteItemError) throw new Error(deleteItemError.message);

            backorderItems.push({
              department: item.department,
              product_id: item.product_id,
              quantity: item.quantity,
              fabric_type_id: item.fabric_type_id,
              roto_product_id: item.roto_product_id,
              offset_product_id: item.offset_product_id,
              film_type: item.film_type,
              is_metallic: item.is_metallic,
              lamination_type: item.lamination_type,
              offset_type: item.offset_type,
            });
          }
        } else {
          if (deliveredQty > 0) {
            const { error: updateItemError } = await (supabase
              .from("sales_order_items") as any)
              .update({
                selected_roll_ids: newRollIds,
                quantity: deliveredQty,
              } as any)
              .eq("id", item.id);
            if (updateItemError) throw new Error(updateItemError.message);
            itemsToKeep.push(item.id);
          } else {
            const { error: deleteItemError } = await (supabase
              .from("sales_order_items") as any)
              .delete()
              .eq("id", item.id);
            if (deleteItemError) throw new Error(deleteItemError.message);
          }
        }
      } else {
        const { error: updateItemError } = await (supabase
          .from("sales_order_items") as any)
          .update({
            selected_roll_ids: newRollIds,
            quantity: deliveredQty,
          } as any)
          .eq("id", item.id);
        if (updateItemError) throw new Error(updateItemError.message);
        itemsToKeep.push(item.id);
      }

      const releasedRollIds = oldRollIds.filter((id) => !newRollIds.includes(id));
      if (releasedRollIds.length > 0) {
        const { error: releaseError } = await (supabase
          .from(tblName) as any)
          .update({ status: "available", updated_by: user.id } as any)
          .in("id", releasedRollIds);
        if (releaseError) throw new Error(releaseError.message);
      }

      if (newRollIds.length > 0) {
        const { error: allocateError } = await (supabase
          .from(tblName) as any)
          .update({ status: "sold", updated_by: user.id } as any)
          .in("id", newRollIds);
        if (allocateError) throw new Error(allocateError.message);
      }
    } else {
      itemsToKeep.push(item.id);
    }
  }

  if (backorderItems.length > 0) {
    let boOrderNumber = "";
    const { data: boNumData } = await (supabase as any).rpc("get_next_order_no", { p_order_date: order.order_date });
    if (boNumData) {
      boOrderNumber = String(boNumData);
    } else {
      const dateParts = String(order.order_date).split("-");
      const mmDd = dateParts.length >= 3 ? `${dateParts[1]}-${dateParts[2]}` : "01-01";
      boOrderNumber = `${mmDd}-${Math.floor(Math.random() * 90 + 10)}`;
    }

    const { data: newOrder, error: newOrderError } = await (supabase
      .from("sales_orders") as any)
      .insert({
        customer_id: order.customer_id,
        order_date: order.order_date,
        order_number: boOrderNumber,
        status: "draft",
        created_by: user.id,
        updated_by: user.id,
      } as any)
      .select("id")
      .single();

    if (newOrderError) throw new Error("Failed to create backorder sales order.");

    const backorderItemsPayload = backorderItems.map((bo) => ({
      sales_order_id: (newOrder as any).id,
      department: bo.department,
      product_id: bo.product_id,
      quantity: bo.quantity,
      selected_roll_ids: [],
      fabric_type_id: bo.fabric_type_id || null,
      roto_product_id: bo.roto_product_id || null,
      offset_product_id: bo.offset_product_id || null,
      film_type: bo.film_type || null,
      is_metallic: !!bo.is_metallic,
      lamination_type: bo.lamination_type || null,
      offset_type: bo.offset_type || null,
    }));

    const { error: boInsertError } = await (supabase
      .from("sales_order_items") as any)
      .insert(backorderItemsPayload);
    if (boInsertError) throw new Error("Failed to create backordered items.");
  }

  if (itemsToKeep.length > 0) {
    const { error: orderError } = await (supabase
      .from("sales_orders") as any)
      .update({ status: "confirmed", updated_by: user.id } as any)
      .eq("id", orderId);

    if (orderError) throw new Error(orderError.message);
  } else {
    const { error: deleteOrderError } = await (supabase
      .from("sales_orders") as any)
      .delete()
      .eq("id", orderId);
    if (deleteOrderError) throw new Error(deleteOrderError.message);
  }

  revalidatePath("/sales/delivery-entry");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
  revalidatePath("/accounts/sales");
}

export async function prepareSalesOrderDraftBilling(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const itemIdsStr = String(formData.get("item_ids") ?? "");

  const itemIds = itemIdsStr
    ? itemIdsStr.split(",").map(id => id.trim()).filter(Boolean)
    : [];

  if (itemIds.length === 0) {
    throw new Error("At least one item must be selected.");
  }

  const supabase = await createClient();

  const { data: selectedItems, error: itemsError } = await (supabase
    .from("sales_order_items") as any)
    .select(`
      id,
      sales_order_id,
      department,
      product_id,
      quantity,
      price,
      selected_roll_ids,
      sales_orders(
        id,
        order_number,
        order_date,
        customer_id,
        status,
        gst_rate,
        selected_roll_ids,
        customers(customer_name, alias)
      )
    `)
    .in("id", itemIds);

  if (itemsError || !selectedItems || selectedItems.length === 0) {
    throw new Error("Selected sales order items not found.");
  }

  const customerNames = Array.from(
    new Set(selectedItems.map((it: any) => it.sales_orders?.customers?.customer_name ?? "Unknown"))
  );
  if (customerNames.length > 1) {
    throw new Error("All selected items must belong to the same customer to be billed together.");
  }

  const selectedItemsByOrderId: Record<string, any[]> = {};
  for (const item of selectedItems) {
    const oId = item.sales_order_id;
    if (!selectedItemsByOrderId[oId]) {
      selectedItemsByOrderId[oId] = [];
    }
    selectedItemsByOrderId[oId].push(item);
  }

  const parentOrderIds = Object.keys(selectedItemsByOrderId);

  for (let idx = 0; idx < parentOrderIds.length; idx++) {
    const oId = parentOrderIds[idx];
    const selectedInThisOrder = selectedItemsByOrderId[oId];
    const parentOrder = selectedInThisOrder[0].sales_orders;

    const { data: allItems, error: allItemsError } = await (supabase
      .from("sales_order_items") as any)
      .select("id, department, product_id, quantity, price, selected_roll_ids")
      .eq("sales_order_id", oId);

    if (allItemsError || !allItems) {
      throw new Error(`Failed to fetch items for order ${oId}`);
    }

    const selectedIds = new Set(selectedInThisOrder.map((it: any) => it.id));
    const unselectedInThisOrder = allItems.filter((it: any) => !selectedIds.has(it.id));

    if (unselectedInThisOrder.length > 0) {
      const clonePayload = {
        // order_number intentionally omitted — DB trigger auto-generates a unique number
        order_date: parentOrder.order_date,
        customer_id: parentOrder.customer_id,
        status: "confirmed",
        bill_number: null,
        bill_value: null,
        gst_rate: parentOrder.gst_rate,
        selected_roll_ids: unselectedInThisOrder.reduce((acc: string[], it: any) => [...acc, ...(it.selected_roll_ids ?? [])], []),
        is_draft_billing: false,
        created_by: user.id,
        updated_by: user.id
      };

      const { data: newOrder, error: newOrderError } = await (supabase
        .from("sales_orders") as any)
        .insert(clonePayload)
        .select("id")
        .single();

      if (newOrderError || !newOrder) {
        throw new Error(`Failed to split order: ${newOrderError?.message}`);
      }

      for (const unselectedItem of unselectedInThisOrder) {
        const { error: moveError } = await (supabase
          .from("sales_order_items") as any)
          .update({ sales_order_id: newOrder.id })
          .eq("id", unselectedItem.id);
        if (moveError) {
          throw new Error(`Failed to move unselected items to cloned order: ${moveError.message}`);
        }
      }
    }

    const { error: updateError } = await (supabase
      .from("sales_orders") as any)
      .update({
        is_draft_billing: true,
        selected_roll_ids: selectedInThisOrder.reduce((acc: string[], it: any) => [...acc, ...(it.selected_roll_ids ?? [])], []),
        updated_by: user.id,
      } as any)
      .eq("id", oId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  revalidatePath("/accounts/sales");
}

export async function finalizeSalesOrderBilling(formData: FormData) {
  const user = await requirePermission("sales.edit");
  const orderId = String(formData.get("order_id") ?? "");
  const billNumber = String(formData.get("bill_number") ?? "").trim();
  const billValue = Number(formData.get("bill_value") ?? 0);

  if (!orderId || !billNumber) {
    throw new Error("Order ID and Bill Number are required.");
  }
  if (!Number.isFinite(billValue) || billValue < 0) {
    throw new Error("Bill Value must be a non-negative amount.");
  }

  const skipJournal = (billNumber === "0") || (billValue === 0);
  const supabase = await createClient();

  const { data: order, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select(`
      id,
      order_number,
      order_date,
      customer_id,
      status,
      gst_rate,
      is_draft_billing,
      customers(customer_name)
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Sales order not found.");
  }
  if (!order.is_draft_billing) {
    throw new Error("Order is not in draft billing state.");
  }

  const customerName = order.customers?.customer_name ?? "Unknown";
  const entryDate = order.order_date ?? todayInIndia();

  if (skipJournal) {
    const { error: updateError } = await (supabase
      .from("sales_orders") as any)
      .update({
        bill_number: billNumber,
        bill_value: billValue,
        is_draft_billing: false,
        updated_by: user.id,
      } as any)
      .eq("id", orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath("/accounts/sales");
    revalidatePath("/accounts/journal");
    revalidatePath("/sales/delivery-entry");
    revalidatePath("/reports");
    return;
  }

  const [customerAcResult, salesAcResult] = await Promise.all([
    supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),
    supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()
  ]);
  const customerAc = customerAcResult.data as any;
  const salesAc = salesAcResult.data as any;

  const journalNo = await generateNextJournalNo(supabase);
  const journalInserts = [
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: customerAc?.id ?? null,
      account_name: customerAc?.customer_name ?? customerName,
      entry_type: "debit",
      amount: billValue,
      description: `${billNumber} (SO:${orderId})`,
      created_by: user.id,
      updated_by: user.id,
    },
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: salesAc?.id ?? null,
      account_name: salesAc?.customer_name ?? "Sales A/c",
      entry_type: "credit",
      amount: billValue,
      description: `${billNumber} (${customerAc?.customer_name ?? customerName}) (SO:${orderId})`,
      created_by: user.id,
      updated_by: user.id,
    },
  ];

  const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
  if (journalError) throw new Error(journalError.message);

  const { error: updateError } = await (supabase
    .from("sales_orders") as any)
    .update({
      bill_number: billNumber,
      bill_value: billValue,
      is_draft_billing: false,
      updated_by: user.id,
    } as any)
    .eq("id", orderId);

  if (updateError) {
    // Rollback journal entry
    await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);
    throw new Error(updateError.message);
  }

  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/journal");
  revalidatePath("/sales/delivery-entry");
  revalidatePath("/reports");
}

export async function discardSalesOrderDraftBilling(orderId: string) {
  const user = await requirePermission("sales.edit");
  const supabase = await createClient();

  const { error: updateError } = await (supabase
    .from("sales_orders") as any)
    .update({
      is_draft_billing: false,
      updated_by: user.id,
    } as any)
    .eq("id", orderId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/accounts/sales");
}

export async function deleteSalesOrderCompletely(orderId: string) {
  const user = await requirePermission("sales.edit");
  const supabase = await createClient();

  const { data: order, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select("id, status, order_number, order_date, bill_number, customers(customer_name), sales_order_items(id, selected_roll_ids)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Sales order not found or already deleted.");
  }

  const orderData = order as any;
  if (orderData.status === "confirmed") {
    throw new Error("Confirmed sales orders cannot be deleted. Confirmed orders can only be deleted using SQL by database administrators.");
  }
  const billNumber = orderData.bill_number;
  const orderDate = orderData.order_date;
  const customerName = orderData.customers?.customer_name ?? "";
  const items = orderData.sales_order_items || [];

  const rollIds: string[] = [];
  for (const item of items) {
    if (item.selected_roll_ids && Array.isArray(item.selected_roll_ids)) {
      rollIds.push(...item.selected_roll_ids);
    }
  }

  if (rollIds.length > 0) {
    const { error: rollUpdateErr } = await (supabase
      .from("fabric_rolls") as any)
      .update({ status: "available", updated_by: user.id })
      .in("id", rollIds);
    if (rollUpdateErr) {
      throw new Error("Failed to reset roll statuses: " + rollUpdateErr.message);
    }
  }

  const { data: journalRows } = await (supabase
    .from("accounts_journal") as any)
    .select("journal_no")
    .or(`description.ilike."%SO:${orderId}%",description.ilike."%${orderData.order_number}%"`)
    .is("deleted_at", null);

  const journalNos = [...new Set((journalRows || []).map((r: any) => r.journal_no))];
  if (journalNos.length > 0) {
    const { error: journalDelErr } = await (supabase
      .from("accounts_journal") as any)
      .delete()
      .in("journal_no", journalNos);
    if (journalDelErr) {
      throw new Error("Failed to delete related journal entries: " + journalDelErr.message);
    }
  }

  const { error: itemsDelErr } = await (supabase
    .from("sales_order_items") as any)
    .delete()
    .eq("sales_order_id", orderId);
  if (itemsDelErr) {
    throw new Error("Failed to delete sales order items: " + itemsDelErr.message);
  }

  const { error: orderDelErr } = await (supabase
    .from("sales_orders") as any)
    .delete()
    .eq("id", orderId);
  if (orderDelErr) {
    throw new Error("Failed to delete sales order: " + orderDelErr.message);
  }

  revalidatePath("/sales/order-confirmation");
  revalidatePath("/sales/delivery-entry");
  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/journal");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
  revalidateAllReports();
}

export async function saveSalesConfirmationRates(
  orderId: string,
  itemPrices: Record<string, number>,
  gstRate: number
) {
  const user = await requireAnyPermission(["sales.edit", "reports.sales_confirmation"]);
  const supabase = await createClient();

  const { data: order, error: orderFetchError } = await (supabase
    .from("sales_orders") as any)
    .select("*, customers(*), sales_order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderFetchError || !order) {
    throw new Error(orderFetchError?.message || "Order not found.");
  }

  const customerId = order.customer_id;
  const siblingOrders = [order];
  const siblingIds = siblingOrders.map(o => o.id);

  // Fetch rolls to calculate old base total and new base total
  const items = siblingOrders.flatMap(o => o.sales_order_items || []) as any[];
  const allRollIds: string[] = [];
  items.forEach((item: any) => {
    if (item.selected_roll_ids) {
      allRollIds.push(...item.selected_roll_ids);
    }
  });

  const rollsData: Record<string, number> = {};
  const finishingBagsData: Record<string, number> = {};

  if (allRollIds.length > 0) {
    const [
      fabricRes,
      lamRes,
      offsetRes,
      finishingRes,
      rotoFilmRes,
      rotoMetRes
    ] = await Promise.all([
      supabase.from("fabric_rolls").select("id, weight").in("id", allRollIds).is("deleted_at", null),
      supabase.from("lamination_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),
      supabase.from("offset_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),
      supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", allRollIds).is("deleted_at", null),
      supabase.from("roto_film_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),
      supabase.from("roto_metallic_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null)
    ]);

    (fabricRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight || 0); });
    (lamRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });
    (offsetRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });
    (finishingRes.data || []).forEach((r: any) => {
      rollsData[r.id] = Number(r.weight_kg || 0);
      finishingBagsData[r.id] = Number(r.num_bags || 0);
    });
    (rotoFilmRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });
    (rotoMetRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });
  }

  // Calculate Old Calculated Total (with old prices from DB before update)
  let oldBaseTotal = 0;
  for (const item of items) {
    let qty = 0;
    const selectedIds = item.selected_roll_ids || [];
    if (selectedIds.length > 0) {
      selectedIds.forEach((rid: string) => {
        if (item.department === "finishing") {
          qty += finishingBagsData[rid] || 0;
        } else {
          qty += rollsData[rid] || 0;
        }
      });
    } else {
      qty = Number(item.quantity || 0);
    }
    const price = Number(item.price ?? 0);
    oldBaseTotal += qty * price;
  }
  const oldCalculatedTotal = oldBaseTotal + (oldBaseTotal * order.gst_rate / 100);

  // Perform database price updates
  const { error: orderError } = await (supabase
    .from("sales_orders") as any)
    .update({ gst_rate: gstRate, updated_by: user.id } as any)
    .in("id", siblingIds);

  if (orderError) {
    throw new Error(orderError.message);
  }

  const itemUpdates = Object.entries(itemPrices).map(([itemId, price]) =>
    (supabase
      .from("sales_order_items") as any)
      .update({ price } as any)
      .eq("id", itemId)
  );

  const results = await Promise.all(itemUpdates);
  for (const res of results) {
    if (res.error) {
      throw new Error(res.error.message);
    }
  }

  // Calculate New Calculated Total
  let baseTotal = 0;
  for (const item of items) {
    let qty = 0;
    const selectedIds = item.selected_roll_ids || [];
    if (selectedIds.length > 0) {
      selectedIds.forEach((rid: string) => {
        if (item.department === "finishing") {
          qty += finishingBagsData[rid] || 0;
        } else {
          qty += rollsData[rid] || 0;
        }
      });
    } else {
      qty = Number(item.quantity || 0);
    }
    const price = Number(itemPrices[item.id] ?? item.price ?? 0);
    baseTotal += qty * price;
  }

  const calculatedTotal = baseTotal + (baseTotal * gstRate / 100);
  const combinedBillValue = siblingOrders.reduce((sum, o) => sum + Number(o.bill_value ?? 0), 0);
  const balance = calculatedTotal - combinedBillValue;

  // Clear existing balance adjustment entries for this dispatch
  await (supabase
    .from("accounts_journal") as any)
    .delete()
    .or(`description.eq."Balance adjustment for Dispatch ${order.order_number}",description.like."Balance adjustment for Dispatch ${order.order_number} (%)"`);

  const linkedCustomerId = order.customers?.linked_customer_id;

  if (linkedCustomerId) {
    // Difference clientDiff = calculatedTotal - oldCalculatedTotal
    const clientDiff = calculatedTotal - oldCalculatedTotal;

    if (Math.abs(clientDiff) > 100) {
      const { data: parentData } = await supabase
        .from("customers")
        .select("id, customer_name")
        .eq("id", linkedCustomerId)
        .is("deleted_at", null)
        .maybeSingle();
      const parent = parentData as any;

      if (parent) {
        const journalNo = await generateNextJournalNo(supabase);
        const journalInserts = [];
        const absDiff = Math.abs(clientDiff);

        if (clientDiff > 0) {
          // Debit Client (increase owes), Credit Parent (decrease adjustment)
          journalInserts.push({
            journal_no: journalNo,
            entry_date: order.order_date ?? todayInIndia(),
            account_id: customerId,
            account_name: order.customers?.customer_name ?? "Unknown",
            entry_type: "debit" as const,
            amount: absDiff,
            description: `Balance adjustment for Dispatch ${order.order_number}`,
            created_by: user.id,
            updated_by: user.id,
          });
          journalInserts.push({
            journal_no: journalNo,
            entry_date: order.order_date ?? todayInIndia(),
            account_id: parent.id,
            account_name: parent.customer_name,
            entry_type: "credit" as const,
            amount: absDiff,
            description: `Balance adjustment for Dispatch ${order.order_number} (${order.customers?.customer_name ?? "Unknown"})`,
            created_by: user.id,
            updated_by: user.id,
          });
        } else {
          // Debit Parent (increase adjustment), Credit Client (decrease owes)
          journalInserts.push({
            journal_no: journalNo,
            entry_date: order.order_date ?? todayInIndia(),
            account_id: parent.id,
            account_name: parent.customer_name,
            entry_type: "debit" as const,
            amount: absDiff,
            description: `Balance adjustment for Dispatch ${order.order_number} (${order.customers?.customer_name ?? "Unknown"})`,
            created_by: user.id,
            updated_by: user.id,
          });
          journalInserts.push({
            journal_no: journalNo,
            entry_date: order.order_date ?? todayInIndia(),
            account_id: customerId,
            account_name: order.customers?.customer_name ?? "Unknown",
            entry_type: "credit" as const,
            amount: absDiff,
            description: `Balance adjustment for Dispatch ${order.order_number}`,
            created_by: user.id,
            updated_by: user.id,
          });
        }

        const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
        if (journalError) throw new Error(journalError.message);
      }
    }
  } else {
    // If NO reference account, adjust between Client Account and Sales A/c
    if (Math.abs(balance) > 100) {
      const { data: salesAcData } = await (supabase
        .from("customers") as any)
        .select("id, customer_name")
        .ilike("customer_name", "Sales A/c")
        .is("deleted_at", null)
        .maybeSingle();
      const salesAc = salesAcData as any;

      const journalNo = await generateNextJournalNo(supabase);
      const journalInserts = [];
      const absBalance = Math.abs(balance);

      if (balance > 100) {
        journalInserts.push({
          journal_no: journalNo,
          entry_date: order.order_date ?? todayInIndia(),
          account_id: customerId,
          account_name: order.customers?.customer_name ?? "Unknown",
          entry_type: "debit" as const,
          amount: absBalance,
          description: `Balance adjustment for Dispatch ${order.order_number}`,
          created_by: user.id,
          updated_by: user.id,
        });
        journalInserts.push({
          journal_no: journalNo,
          entry_date: order.order_date ?? todayInIndia(),
          account_id: salesAc?.id ?? null,
          account_name: salesAc?.customer_name ?? "Sales A/c",
          entry_type: "credit" as const,
          amount: absBalance,
          description: `Balance adjustment for Dispatch ${order.order_number} (${order.customers?.customer_name ?? "Unknown"})`,
          created_by: user.id,
          updated_by: user.id,
        });
      } else {
        journalInserts.push({
          journal_no: journalNo,
          entry_date: order.order_date ?? todayInIndia(),
          account_id: salesAc?.id ?? null,
          account_name: salesAc?.customer_name ?? "Sales A/c",
          entry_type: "debit" as const,
          amount: absBalance,
          description: `Balance adjustment for Dispatch ${order.order_number} (${order.customers?.customer_name ?? "Unknown"})`,
          created_by: user.id,
          updated_by: user.id,
        });
        journalInserts.push({
          journal_no: journalNo,
          entry_date: order.order_date ?? todayInIndia(),
          account_id: customerId,
          account_name: order.customers?.customer_name ?? "Unknown",
          entry_type: "credit" as const,
          amount: absBalance,
          description: `Balance adjustment for Dispatch ${order.order_number}`,
          created_by: user.id,
          updated_by: user.id,
        });
      }

      const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
      if (journalError) throw new Error(journalError.message);
    }
  }

  revalidatePath("/reports/sales-confirmation");
  revalidatePath("/accounts/journal");
  revalidatePath("/reports/accounts");
}

export async function saveMaterialSalesEntry(formData: FormData) {
  const user = await requireAnyPermission(["sales.create", "accounts.material"]);

  const sale_date = String(formData.get("sale_date") ?? todayInIndia());
  const bill_number = String(formData.get("bill_number") ?? "").trim();
  const customer_id = String(formData.get("customer_id") ?? "");
  const type = String(formData.get("type") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const price = Number(formData.get("price") ?? 0);
  const inc_gst = formData.get("inc_gst") === "true";

  let department: string | null = null;
  let raw_material_id: string | null = null;

  if (type === "raw_material") {
    department = String(formData.get("department") ?? "");
    raw_material_id = String(formData.get("raw_material_id") ?? "");
    if (!department || !raw_material_id) {
      throw new Error("Department and Raw Material ID are required for raw material sales.");
    }
  }

  if (!bill_number || !customer_id || !type) {
    throw new Error("Bill number, client customer, and sale type are required.");
  }

  if (quantity <= 0 || price <= 0) {
    throw new Error("Quantity and price must be greater than zero.");
  }

  const baseAmount = quantity * price;
  const amount = inc_gst ? baseAmount : baseAmount * 1.18;

  const supabase = await createClient();

  if (type === "raw_material" && raw_material_id) {
    const { data: rmData, error: rmErr } = await (supabase
      .from("raw_materials") as any)
      .select("current_stock, material_name")
      .eq("id", raw_material_id)
      .single();
    if (rmErr || !rmData) {
      throw new Error("Raw material not found.");
    }
    const currentStock = Number(rmData.current_stock ?? 0);
    if (quantity > currentStock) {
      throw new Error(`Cannot sell ${quantity}. Only ${currentStock} is available in stock.`);
    }
  }

  const { data: customerResult, error: customerErr } = await (supabase
    .from("customers") as any)
    .select("id, customer_name")
    .eq("id", customer_id)
    .single();

  if (customerErr || !customerResult) {
    throw new Error("Customer not found.");
  }

  let customer = customerResult as any;
  let customerName = customer.customer_name;
  let customerAccountId = customer.id;

  const { data: salesAcResult, error: salesAcErr } = await (supabase
    .from("customers") as any)
    .select("id, customer_name")
    .ilike("customer_name", "sales a/c")
    .is("deleted_at", null)
    .maybeSingle();

  const salesAc = salesAcResult as any;
  const salesAcName = salesAc?.customer_name ?? "Sales A/c";

  const journalNo = await generateNextJournalNo(supabase);

  const journalInserts = [
    {
      journal_no: journalNo,
      entry_date: sale_date,
      account_id: customerAccountId,
      account_name: customerName,
      entry_type: "debit",
      amount: amount,
      description: `Bill ${bill_number} (${type === "raw_material" ? "Raw Material" : "Waste"})`,
      created_by: user.id,
      updated_by: user.id,
    },
    {
      journal_no: journalNo,
      entry_date: sale_date,
      account_id: salesAc?.id ?? null,
      account_name: salesAcName,
      entry_type: "credit",
      amount: amount,
      description: `Bill ${bill_number} (${customerName})`,
      created_by: user.id,
      updated_by: user.id,
    },
  ];

  const { error: journalErr } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
  if (journalErr) {
    throw new Error(`Failed to create journal entries: ${journalErr.message}`);
  }

  const { error: saleErr } = await (supabase.from("material_sales") as any).insert({
    sale_date,
    bill_number,
    customer_id,
    type,
    department: department || null,
    raw_material_id: raw_material_id || null,
    quantity,
    price,
    inc_gst,
    amount,
    journal_no: journalNo,
    created_by: user.id,
    updated_by: user.id,
  });

  if (saleErr) {
    await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);
    throw new Error(`Failed to save material sale: ${saleErr.message}`);
  }

  revalidatePath("/accounts/material");
  revalidatePath("/accounts/journal");
  revalidateAllReports();
}

export async function deleteMaterialSalesEntry(formData: FormData) {
  const user = await requireAnyPermission(["sales.edit", "accounts.material"]);
  const id = String(formData.get("id") ?? "");
  const journalNo = String(formData.get("journal_no") ?? "");

  if (!id) throw new Error("Material sale ID is required.");

  const supabase = await createClient();

  const { error: saleErr } = await (supabase
    .from("material_sales") as any)
    .delete()
    .eq("id", id);

  if (saleErr) throw new Error(`Failed to delete material sale: ${saleErr.message}`);

  if (journalNo) {
    const { error: journalErr } = await (supabase
      .from("accounts_journal") as any)
      .delete()
      .eq("journal_no", journalNo);
    if (journalErr) {
      console.error(`Failed to delete journal entries for material sale: ${journalErr.message}`);
    }
  }

  revalidatePath("/accounts/material");
  revalidatePath("/accounts/journal");
  revalidateAllReports();
}

async function generateNextDispatchNumber(supabase: any, deliveryDate: string): Promise<string> {
  const { data: dispatchNoData, error: dispatchNoErr } = await (supabase as any).rpc("get_next_dispatch_no", { p_delivery_date: deliveryDate });
  if (!dispatchNoErr && dispatchNoData) {
    return String(dispatchNoData);
  }

  // Fallback
  const dateParts = deliveryDate.split("-");
  const mmDd = `${dateParts[1]}-${dateParts[2]}`;
  const { data: existing } = await supabase
    .from("sales_orders")
    .select("order_number")
    .like("order_number", `DP-${mmDd}-%`)
    .is("deleted_at", null);

  let maxSeq = 0;
  for (const order of (existing || []) as any[]) {
    const num = order.order_number;
    const parts = num.split("-");
    const seq = Number(parts[3]);
    if (!isNaN(seq) && seq > maxSeq) {
      maxSeq = seq;
    }
  }
  return `DP-${mmDd}-${String(maxSeq + 1).padStart(2, "0")}`;
}


export async function confirmMultipleSalesDeliveries(
  selectedItemIds: string[],
  itemRolls: Record<string, string[]>,
  itemRemainingActions: Record<string, "backorder" | "close"> = {},
  deliveryDate?: string
) {
  const user = await requireAnyPermission(["sales.edit", "sales.delivery_entry"]);
  const supabase = await createClient();

  if (selectedItemIds.length === 0) {
    throw new Error("No items selected for delivery confirmation.");
  }

  const { data: selectedItems, error: itemsError } = await (supabase
    .from("sales_order_items") as any)
    .select(`
      id,
      sales_order_id,
      department,
      product_id,
      quantity,
      price,
      selected_roll_ids,
      fabric_type_id,
      roto_product_id,
      offset_product_id,
      film_type,
      is_metallic,
      lamination_type,
      offset_type,
      sales_orders(
        id,
        order_number,
        order_date,
        customer_id,
        status,
        gst_rate,
        selected_roll_ids
      )
    `)
    .in("id", selectedItemIds);

  if (itemsError || !selectedItems || selectedItems.length === 0) {
    throw new Error("Selected items not found.");
  }

  const customerIds = Array.from(new Set(selectedItems.map((it: any) => it.sales_orders?.customer_id)));
  if (customerIds.length > 1) {
    throw new Error("All selected items must belong to the same customer for delivery confirmation.");
  }
  const customerId = customerIds[0];
  const gstRate = selectedItems[0]?.sales_orders?.gst_rate ?? 18;

  const allNewRollIds = Object.values(itemRolls).flat();

  // Retrieve roll weights from their respective tables
  const rollsData: Record<string, number> = {};
  const rollsBagsData: Record<string, number> = {};
  for (const item of selectedItems) {
    const newRollIds = itemRolls[item.id] || [];
    if (newRollIds.length === 0) continue;

    if (item.department === "fabric") {
      const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve fabric roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight || 0);
    } else if (item.department === "lamination") {
      const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve lamination roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    } else if (item.department === "offset-printing") {
      const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve offset roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    } else if (item.department === "finishing") {
      const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve finishing bundle details: ${error.message}`);
      for (const r of data || []) {
        rollsData[r.id] = Number(r.weight_kg || 0);
        rollsBagsData[r.id] = Number(r.num_bags || 0);
      }
    } else if (item.department === "roto-printing") {
      const table = item.is_metallic ? "roto_metallic_rolls" : "roto_film_rolls";
      const { data, error } = await (supabase.from(table) as any).select("id, weight_kg").in("id", newRollIds);
      if (error) throw new Error(`Failed to retrieve roto roll details: ${error.message}`);
      for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);
    }
  }

  const itemsByOrderId: Record<string, any[]> = {};
  for (const item of selectedItems) {
    const oId = item.sales_order_id;
    if (!itemsByOrderId[oId]) {
      itemsByOrderId[oId] = [];
    }
    itemsByOrderId[oId].push(item);
  }
  const parentOrderIds = Object.keys(itemsByOrderId);

  const dateStr = deliveryDate || todayInIndia();
  const dispatchOrderNumber = await generateNextDispatchNumber(supabase, dateStr);

  const { data: newDispatchOrder, error: createDispatchError } = await (supabase
    .from("sales_orders") as any)
    .insert({
      customer_id: customerId,
      order_number: dispatchOrderNumber,
      order_date: dateStr,
      status: "confirmed",
      is_draft_billing: false,
      gst_rate: gstRate,
      selected_roll_ids: allNewRollIds,
      created_by: user.id,
      updated_by: user.id
    })
    .select("id")
    .single();

  if (createDispatchError || !newDispatchOrder) {
    throw new Error(`Failed to create dispatch order: ${createDispatchError?.message}`);
  }

  const newDispatchOrderId = newDispatchOrder.id;

  for (const item of selectedItems) {
    const newRollIds = itemRolls[item.id] || [];
    const oldRollIds = (item.selected_roll_ids as string[]) || [];
    const action = itemRemainingActions[item.id] || "close";

    let tblName = "";
    if (item.department === "fabric") tblName = "fabric_rolls";
    else if (item.department === "lamination") tblName = "lamination_rolls";
    else if (item.department === "offset-printing") tblName = "offset_rolls";
    else if (item.department === "finishing") tblName = "finishing_bundles";
    else if (item.department === "roto-printing") tblName = item.is_metallic ? "roto_metallic_rolls" : "roto_film_rolls";

    if (tblName) {
      const deliveredQty = item.department === "fabric"
        ? newRollIds.length
        : item.department === "finishing"
        ? newRollIds.reduce((sum, rid) => sum + (rollsBagsData[rid] || 0), 0)
        : newRollIds.reduce((sum, rid) => sum + (rollsData[rid] || 0), 0);

      if (deliveredQty < item.quantity) {
        if (action === "backorder") {
          const remainingQty = item.quantity - deliveredQty;
          if (deliveredQty > 0) {
            const { error: updateItemError } = await (supabase
              .from("sales_order_items") as any)
              .update({
                sales_order_id: newDispatchOrderId,
                selected_roll_ids: newRollIds,
                quantity: deliveredQty,
              } as any)
              .eq("id", item.id);
            if (updateItemError) throw new Error(updateItemError.message);

            const { error: boInsertError } = await (supabase
              .from("sales_order_items") as any)
              .insert({
                sales_order_id: item.sales_order_id,
                department: item.department,
                product_id: item.product_id,
                quantity: remainingQty,
                price: item.price,
                selected_roll_ids: [],
                fabric_type_id: item.fabric_type_id || null,
                roto_product_id: item.roto_product_id || null,
                offset_product_id: item.offset_product_id || null,
                film_type: item.film_type || null,
                is_metallic: !!item.is_metallic,
                lamination_type: item.lamination_type || null,
                offset_type: item.offset_type || null,
              });
            if (boInsertError) throw new Error("Failed to create backordered item.");
          } else {
            // 0 delivered, keep on parent draft
          }
        } else {
          if (deliveredQty > 0) {
            const { error: updateItemError } = await (supabase
              .from("sales_order_items") as any)
              .update({
                sales_order_id: newDispatchOrderId,
                selected_roll_ids: newRollIds,
                quantity: deliveredQty,
              } as any)
              .eq("id", item.id);
            if (updateItemError) throw new Error(updateItemError.message);
          } else {
            const { error: deleteItemError } = await (supabase
              .from("sales_order_items") as any)
              .delete()
              .eq("id", item.id);
            if (deleteItemError) throw new Error(deleteItemError.message);
          }
        }
      } else {
        const { error: updateItemError } = await (supabase
          .from("sales_order_items") as any)
          .update({
            sales_order_id: newDispatchOrderId,
            selected_roll_ids: newRollIds,
            quantity: deliveredQty,
          } as any)
          .eq("id", item.id);
        if (updateItemError) throw new Error(updateItemError.message);
      }

      const releasedRollIds = oldRollIds.filter((id) => !newRollIds.includes(id));
      if (releasedRollIds.length > 0) {
        const { error: releaseError } = await (supabase
          .from(tblName) as any)
          .update({ status: "available", updated_by: user.id } as any)
          .in("id", releasedRollIds);
        if (releaseError) throw new Error(releaseError.message);
      }

      if (newRollIds.length > 0) {
        const { error: allocateError } = await (supabase
          .from(tblName) as any)
          .update({ status: "sold", updated_by: user.id } as any)
          .in("id", newRollIds);
        if (allocateError) throw new Error(allocateError.message);
      }
    } else {
      const { error: updateItemError } = await (supabase
        .from("sales_order_items") as any)
        .update({
          sales_order_id: newDispatchOrderId,
        } as any)
        .eq("id", item.id);
      if (updateItemError) throw new Error(updateItemError.message);
    }
  }

  for (const oId of parentOrderIds) {
    const { data: remainingItems, error: countError } = await (supabase
      .from("sales_order_items") as any)
      .select("id")
      .eq("sales_order_id", oId);

    if (countError) throw new Error("Failed to count remaining items in draft order.");

    if (!remainingItems || remainingItems.length === 0) {
      const { error: deleteOrderError } = await (supabase
        .from("sales_orders") as any)
        .delete()
        .eq("id", oId);
      if (deleteOrderError) throw new Error(deleteOrderError.message);
    }
  }

  revalidatePath("/sales/delivery-entry");
  revalidatePath("/accounts/sales");
  revalidatePath("/rolls");
  revalidatePath("/fabric/stock");
}

export async function saveSalesOrderBillingDirect(formData: FormData) {
  const user = await requireAnyPermission(["sales.edit", "accounts.sales"]);
  const orderIdsStr = String(formData.get("order_ids") ?? "");
  const billNumber = String(formData.get("bill_number") ?? "").trim();
  const billValue = Number(formData.get("bill_value") ?? 0);
  const isJobwork = formData.get("is_jobwork") === "true";

  const orderIds = orderIdsStr
    ? orderIdsStr.split(",").map(id => id.trim()).filter(Boolean)
    : [];

  if (orderIds.length === 0 || !billNumber) {
    throw new Error("Order IDs and Bill Number are required.");
  }
  if (!Number.isFinite(billValue) || billValue < 0) {
    throw new Error("Bill Value must be a non-negative amount.");
  }

  const skipJournal = (billNumber === "0") || (billValue === 0);
  const supabase = await createClient();

  const { data: orders, error: ordersError } = await (supabase
    .from("sales_orders") as any)
    .select(`
      id,
      order_number,
      order_date,
      customer_id,
      status,
      gst_rate,
      total_amount,
      customers(customer_name, linked_customer_id)
    `)
    .in("id", orderIds);

  if (ordersError || !orders || orders.length === 0) {
    throw new Error("Selected confirmed orders not found.");
  }

  const customerNames = Array.from(new Set(orders.map((o: any) => o.customers?.customer_name)));
  if (customerNames.length > 1) {
    throw new Error("All selected orders must belong to the same customer to be billed together.");
  }

  const customerName = customerNames[0] as string;
  const entryDate = orders[0]?.order_date || todayInIndia();

  if (skipJournal) {
    for (let idx = 0; idx < orders.length; idx++) {
      const oId = orders[idx].id;
      const isFirstParent = (idx === 0);
      const { error: updateError } = await (supabase
        .from("sales_orders") as any)
        .update({
          bill_number: billNumber,
          bill_value: isFirstParent ? billValue : 0,
          updated_by: user.id,
          is_jobwork: isJobwork
        } as any)
        .eq("id", oId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    revalidatePath("/accounts/sales");
    revalidatePath("/accounts/journal");
    revalidatePath("/sales/delivery-entry");
    revalidateAllReports();
    return;
  }

  const [customerAcResult, salesAcResult] = await Promise.all([
    supabase.from("customers").select("id, customer_name").ilike("customer_name", customerName).is("deleted_at", null).maybeSingle(),
    supabase.from("customers").select("id, customer_name").ilike("customer_name", "Sales A/c").is("deleted_at", null).maybeSingle()
  ]);
  let customerAc = customerAcResult.data as any;
  const salesAc = salesAcResult.data as any;

  const journalNo = await generateNextJournalNo(supabase);
  const journalInserts = [
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: customerAc?.id ?? null,
      account_name: customerAc?.customer_name ?? customerName,
      entry_type: "debit" as const,
      amount: billValue,
      description: `Bill ${billNumber} for Dispatch ${orders[0].order_number}`,
      created_by: user.id,
      updated_by: user.id,
    },
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: salesAc?.id ?? null,
      account_name: salesAc?.customer_name ?? "Sales A/c",
      entry_type: "credit" as const,
      amount: billValue,
      description: `Bill ${billNumber} for Dispatch ${orders[0].order_number} (${customerAc?.customer_name ?? customerName})`,
      created_by: user.id,
      updated_by: user.id,
    },
  ];

  const { error: journalError } = await (supabase.from("accounts_journal") as any).insert(journalInserts);
  if (journalError) throw new Error(journalError.message);

  try {
    for (let idx = 0; idx < orders.length; idx++) {
      const oId = orders[idx].id;
      const isFirstParent = (idx === 0);
      const { error: updateError } = await (supabase
        .from("sales_orders") as any)
        .update({
          bill_number: billNumber,
          bill_value: isFirstParent ? billValue : 0,
          updated_by: user.id,
          is_jobwork: isJobwork
        } as any)
        .eq("id", oId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }
  } catch (err: any) {
    // Rollback journal entries
    await (supabase.from("accounts_journal") as any).delete().eq("journal_no", journalNo);
    throw err;
  }

  revalidatePath("/accounts/sales");
  revalidatePath("/accounts/journal");
  revalidatePath("/sales/delivery-entry");
  revalidateAllReports();
}

export async function updateSalesOrderItemJobwork(formData: FormData) {
  const user = await requirePermission("reports.stock");
  const itemId = String(formData.get("id") ?? "");
  const ppPercent = Number(formData.get("pp_percent") ?? 0);
  const fillerPercent = Number(formData.get("filler_percent") ?? 0);

  if (!itemId || isNaN(ppPercent) || isNaN(fillerPercent)) {
    throw new Error("Invalid parameters.");
  }

  const supabase = await createClient();
  const { error } = await (supabase
    .from("sales_order_items" as any) as any)
    .update({ pp_percent: ppPercent, filler_percent: fillerPercent })
    .eq("id", itemId);

  if (error) throw new Error(error.message);
  revalidateAllReports();
}
