import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { DeliveryEntryWorkspace } from "./DeliveryEntryWorkspace";

export default async function DeliveryEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("sales.delivery_entry");
  const permissions = await getSessionPermissions();
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

  const [availableRollsDataResults, selectedRollsResults, fabrics, rotoProducts, offsetProducts] = await Promise.all([
    uniqueNeededFabricTypeIds.length > 0
      ? Promise.all(
          uniqueNeededFabricTypeIds.map((fabricTypeId) =>
            supabase
              .from("fabric_rolls")
              .select(rollSelect)
              .eq("fabric_type_id", fabricTypeId)
              .eq("status", "available")
              .is("deleted_at", null)
              .order("id", { ascending: true })
          )
        )
      : Promise.resolve([] as any[]),
    uniqueRollIds.length > 0
      ? Promise.all(
          Array.from({ length: Math.ceil(uniqueRollIds.length / 200) }, (_, i) =>
            supabase
              .from("fabric_rolls")
              .select(rollSelect)
              .in("id", uniqueRollIds.slice(i * 200, (i + 1) * 200))
              .is("deleted_at", null)
              .order("id", { ascending: true })
          )
        )
      : Promise.resolve([] as any[]),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height")
  ]);

  for (const res of availableRollsDataResults) {
    if (res.error) throw new Error(res.error.message);
  }
  for (const res of selectedRollsResults) {
    if (res.error) throw new Error(res.error.message);
  }

  const rollsById = new Map<string, any>();
  const flatAvailable = availableRollsDataResults.flatMap((res) => res.data ?? []);
  const flatSelected = selectedRollsResults.flatMap((res) => res.data ?? []);

  for (const roll of [...flatAvailable, ...flatSelected]) {
    rollsById.set(roll.id, roll);
  }
  const rolls = Array.from(rollsById.values());

  return (
    <div className="space-y-6">
      <DeliveryEntryWorkspace
        orders={draftOrders as any[]}
        confirmedOrders={confirmedOrders as any[]}
        fabrics={(fabrics.data ?? []) as any[]}
        rotoProducts={(rotoProducts.data ?? []) as any[]}
        offsetProducts={(offsetProducts.data ?? []) as any[]}
        rolls={rolls}
        date={date}
        permissions={permissions}
      />
    </div>
  );
}
