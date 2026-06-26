import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { OrderConfirmationWorkspace } from "./OrderConfirmationWorkspace";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("sales.delivery_entry");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();

  // 1. Fetch draft orders
  const { data: draftOrders, error: draftError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "draft")
    .is("deleted_at", null)
    .order("order_date", { ascending: true })
    .order("order_number", { ascending: true });

  if (draftError) throw new Error(draftError.message);

  // 2. Fetch confirmed orders for the selected date
  const { data: confirmedOrders, error: confirmedError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "confirmed")
    .eq("order_date", date)
    .is("deleted_at", null)
    .order("order_date", { ascending: false })
    .order("order_number", { ascending: true });

  if (confirmedError) throw new Error(confirmedError.message);

  // 3. Gather roll IDs and needed fabric type IDs
  const allOrders = [
    ...((draftOrders ?? []) as any[]),
    ...((confirmedOrders ?? []) as any[])
  ];
  const allRollIds: string[] = [];
  const neededFabricTypeIds: string[] = [];

  for (const order of allOrders) {
    for (const item of (order.sales_order_items ?? [])) {
      const ids = (item.selected_roll_ids ?? []) as string[];
      allRollIds.push(...ids);
      if (item.department === "fabric" && item.product_id) {
        neededFabricTypeIds.push(item.product_id);
      }
    }
  }
  const uniqueRollIds = Array.from(new Set(allRollIds));
  const uniqueNeededFabricTypeIds = Array.from(new Set(neededFabricTypeIds));

  // 4. Fetch available rolls and selected rolls in parallel
  const rollSelect = "id, roll_number, meters, weight, status, fabric_type_id, looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)";

  const [availableRollsResult, selectedRollsResult, fabrics, rotoProducts, offsetProducts] = await Promise.all([
    uniqueNeededFabricTypeIds.length > 0
      ? supabase.from("fabric_rolls").select(rollSelect).in("fabric_type_id", uniqueNeededFabricTypeIds).eq("status", "available").is("deleted_at", null).order("roll_number", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    uniqueRollIds.length > 0
      ? supabase.from("fabric_rolls").select(rollSelect).in("id", uniqueRollIds).is("deleted_at", null).order("roll_number", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height")
  ]);

  if (availableRollsResult.error) throw new Error(availableRollsResult.error.message);
  if (selectedRollsResult.error) throw new Error(selectedRollsResult.error.message);

  const rollsById = new Map<string, any>();
  for (const roll of [...((availableRollsResult.data ?? []) as any[]), ...((selectedRollsResult.data ?? []) as any[])]) {
    rollsById.set(roll.id, roll);
  }
  const rolls = Array.from(rollsById.values());

  return (
    <div className="space-y-6">
      <OrderConfirmationWorkspace
        orders={draftOrders as any[]}
        confirmedOrders={confirmedOrders as any[]}
        fabrics={(fabrics.data ?? []) as any[]}
        rotoProducts={(rotoProducts.data ?? []) as any[]}
        offsetProducts={(offsetProducts.data ?? []) as any[]}
        rolls={rolls}
        date={date}
      />
    </div>
  );
}
