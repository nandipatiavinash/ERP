import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { DeliveryEntryWorkspace } from "./DeliveryEntryWorkspace";

export default async function DeliveryEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requirePermission("sales.delivery_entry");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;
  const from = params.from || todayInIndia();
  const to = params.to || todayInIndia();

  // 1. Fetch draft orders
  const { data: draftOrders, error: draftError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "draft")
    .is("deleted_at", null)
    .order("order_date", { ascending: true })
    .order("order_number", { ascending: true });

  if (draftError) throw new Error(draftError.message);

  // 2. Fetch confirmed orders for the selected date range
  const { data: confirmedOrders, error: confirmedError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "confirmed")
    .gte("order_date", from)
    .lte("order_date", to)
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
  const [
    availableFabrics,
    availableLamination,
    availableOffset,
    availableFinishing,
    availableRotoFilm,
    availableRotoMetallic,
    selectedFabrics,
    selectedLamination,
    selectedOffset,
    selectedFinishing,
    selectedRotoFilm,
    selectedRotoMetallic,
    fabrics,
    rotoProducts,
    offsetProducts,
    laminationProds,
    finishingProds
  ] = await Promise.all([
    supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),
    supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),
    supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),
    supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, quantity, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),
    supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),
    supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),
    uniqueRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    uniqueRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    uniqueRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    uniqueRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, weight_kg, quantity, status, fabric_type_id, product_id, finish_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    uniqueRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters, status, brand_id, film_type").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    uniqueRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", uniqueRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase.from("lamination_products").select("id, name"),
    supabase.from("finishing_products").select("id, name")
  ]);

  const mappedFabrics = [
    ...(availableFabrics.data ?? []),
    ...(selectedFabrics.data ?? [])
  ].map((r: any) => ({
    id: r.id,
    roll_number: r.roll_number,
    weight: Number(r.weight || 0),
    meters: Number(r.meters || 0),
    status: r.status,
    fabric_type_id: r.fabric_type_id,
    product_id: r.fabric_type_id,
    department: "fabric",
    loom_production_entries: r.loom_production_entries
  }));

  const mappedLamination = [
    ...(availableLamination.data ?? []),
    ...(selectedLamination.data ?? [])
  ].map((r: any) => {
    // Parse brand name from roll_id (which is before first '(')
    const match = r.roll_id.match(/^([^(]+)/);
    const parsedBrand = match ? match[1].trim() : "";
    const rotoProduct = ((rotoProducts.data as any) || []).find((p: any) => p.brand === parsedBrand);
    const rotoProductId = rotoProduct ? rotoProduct.id : (r.roto_metallic_rolls?.roto_film_rolls?.brand_id || null);

    return {
      id: r.id,
      roll_number: r.roll_id,
      weight: Number(r.weight_kg || 0),
      meters: Number(r.meters || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id,
      product_id: r.product_id,
      lam_type: r.lam_type,
      roto_product_id: rotoProductId,
      film_type: r.roto_metallic_rolls?.roto_film_rolls?.film_type || null,
      is_metallic: !!r.film_roll_id || ["BOX", "F_S", "H_S"].includes(r.lam_type),
      department: "lamination"
    };
  });

  const mappedOffset = [
    ...(availableOffset.data ?? []),
    ...(selectedOffset.data ?? [])
  ].map((r: any) => ({
    id: r.id,
    roll_number: r.roll_id,
    weight: Number(r.weight_kg || 0),
    meters: Number(r.meters || 0),
    status: r.status,
    fabric_type_id: r.fabric_type_id,
    product_id: r.brand_id,
    offset_type: r.offset_type,
    department: "offset-printing"
  }));

  const mappedFinishing = [
    ...(availableFinishing.data ?? []),
    ...(selectedFinishing.data ?? [])
  ].map((r: any) => {
    // Parse lamination or offset product brand from bundle_id
    let rotoProductId = null;
    let offsetProductId = null;
    
    const match = r.bundle_id.match(/^([^(]+)/);
    const parsedBrand = match ? match[1].trim() : "";
    
    if (r.finish_type === "LAMINATION") {
      const rotoProduct = ((rotoProducts.data as any) || []).find((p: any) => p.brand === parsedBrand);
      rotoProductId = rotoProduct ? rotoProduct.id : null;
    } else if (r.finish_type === "OFFSET") {
      const offsetProduct = ((offsetProducts.data as any) || []).find((p: any) => p.brand === parsedBrand);
      offsetProductId = offsetProduct ? offsetProduct.id : null;
    }

    return {
      id: r.id,
      roll_number: r.bundle_id,
      weight: Number(r.weight_kg || 0),
      meters: Number(r.quantity || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id,
      product_id: r.product_id,
      finish_type: r.finish_type,
      roto_product_id: rotoProductId,
      offset_product_id: offsetProductId,
      department: "finishing"
    };
  });

  const mappedRotoFilm = [
    ...(availableRotoFilm.data ?? []),
    ...(selectedRotoFilm.data ?? [])
  ].map((r: any) => ({
    id: r.id,
    roll_number: r.roll_id,
    weight: Number(r.weight_kg || 0),
    meters: Number(r.meters || 0),
    status: r.status,
    fabric_type_id: null,
    product_id: r.brand_id,
    film_type: r.film_type,
    is_metallic: false,
    department: "roto-printing"
  }));

  const mappedRotoMetallic = [
    ...(availableRotoMetallic.data ?? []),
    ...(selectedRotoMetallic.data ?? [])
  ].map((r: any) => ({
    id: r.id,
    roll_number: r.roll_id,
    weight: Number(r.weight_kg || 0),
    meters: Number(r.meters || 0),
    status: r.status,
    fabric_type_id: null,
    product_id: r.roto_film_rolls?.brand_id,
    film_type: r.roto_film_rolls?.film_type,
    is_metallic: true,
    department: "roto-printing"
  }));

  const rollsById = new Map<string, any>();
  for (const roll of [
    ...mappedFabrics,
    ...mappedLamination,
    ...mappedOffset,
    ...mappedFinishing,
    ...mappedRotoFilm,
    ...mappedRotoMetallic
  ]) {
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
        laminationProducts={(laminationProds.data ?? []) as any[]}
        finishingProducts={(finishingProds.data ?? []) as any[]}
        rolls={rolls}
        from={from}
        to={to}
        permissions={permissions}
      />
    </div>
  );
}
