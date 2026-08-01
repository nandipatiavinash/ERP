import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DeliveryEntryWorkspace } from "../DeliveryEntryWorkspace";
import { Button } from "@/components/ui/button";

function parseLaminationRollId(rollId: string, fabricTypes: any[], rotoProducts: any[]) {
  const upper = (rollId || "").toUpperCase();
  
  let lamType = "PLAIN";
  if (upper.endsWith("(B)")) lamType = "BOX";
  else if (upper.endsWith("(F)")) lamType = "F_S";
  else if (upper.endsWith("(H)")) lamType = "H_S";
  else if (upper.startsWith("NW(")) lamType = "NW";

  const isMetallic = upper.includes("(MT)");

  let filmType = null;
  if (upper.includes("(G)")) filmType = "gloss";
  else if (upper.includes("(M)")) filmType = "matt";

  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let rotoProductId = null;
  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    if (brandName !== "PLAIN" && brandName !== "NW") {
      const rotoProduct = rotoProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (rotoProduct) {
        rotoProductId = rotoProduct.id;
      }
    }
  }

  return { lamType, isMetallic, filmType, fabricTypeId, rotoProductId };
}

function parseOffsetRollId(rollId: string, fabricTypes: any[], offsetProducts: any[]) {
  const upper = (rollId || "").toUpperCase();

  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let offsetProductId = null;
  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    if (brandName !== "NW") {
      const offsetProduct = offsetProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (offsetProduct) {
        offsetProductId = offsetProduct.id;
      }
    }
  }

  return { fabricTypeId, offsetProductId };
}

function parseFinishingBundleId(bundleId: string, fabricTypes: any[], rotoProducts: any[], offsetProducts: any[]) {
  const upper = (bundleId || "").toUpperCase();
  
  let lamType = "PLAIN";
  if (upper.endsWith("(B)")) lamType = "BOX";
  else if (upper.endsWith("(F)")) lamType = "F_S";
  else if (upper.endsWith("(H)")) lamType = "H_S";
  else if (upper.startsWith("NW(")) lamType = "NW";

  const isMetallic = upper.includes("(MT)");

  let filmType = null;
  if (upper.includes("(G)")) filmType = "gloss";
  else if (upper.includes("(M)")) filmType = "matt";
  
  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let rotoProductId = null;
  let offsetProductId = null;

  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    if (brandName !== "PLAIN" && brandName !== "NW") {
      const rotoProduct = rotoProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (rotoProduct) {
        rotoProductId = rotoProduct.id;
      }
      const offsetProduct = offsetProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (offsetProduct) {
        offsetProductId = offsetProduct.id;
      }
    }
  }

  return { lamType, isMetallic, filmType, fabricTypeId, rotoProductId, offsetProductId };
}

export default async function OrderWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("sales.delivery_entry");
  const permissions = await getSessionPermissions();
  const { id } = await params;
  const supabase = await createClient();
  const [
    orderResult,
    { data: fabrics },
    { data: rotoProducts },
    { data: offsetProducts },
    { data: laminationProds },
    { data: finishingProds }
  ] = await Promise.all([
    supabase
      .from("sales_orders")
      .select("*, customers(*), sales_order_items(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase.from("lamination_products").select("id, name"),
    supabase.from("finishing_products").select("id, name")
  ]);

  if (orderResult.error) throw new Error(orderResult.error.message);
  const order = orderResult.data;
  if (!order) notFound();

  const orderItems = ((order as any).sales_order_items ?? []) as any[];
  const selectedRollIds = Array.from(new Set([
    ...(((order as any).selected_roll_ids ?? []) as string[]),
    ...orderItems.flatMap((item) => ((item.selected_roll_ids ?? []) as string[])),
  ]));

  // Fetch available stock for all departments in parallel
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
    selectedRotoMetallic
  ] = await Promise.all([
    supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").eq("status", "available").is("deleted_at", null),
    supabase.from("lamination_rolls").select("id, roll_id, s_no, gross_weight, core_weight, net_weight, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").eq("status", "available").is("deleted_at", null),
    supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").eq("status", "available").is("deleted_at", null),
    supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").eq("status", "available").is("deleted_at", null),
    supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").eq("status", "available").is("deleted_at", null),
    supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").eq("status", "available").is("deleted_at", null),
    selectedRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, roll_number, weight, meters, status, fabric_type_id, supplier_roll_id, loom_production_entries(gross_weight, core_weight, average_meter_weight)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    selectedRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, roll_id, s_no, gross_weight, core_weight, net_weight, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, lam_type, film_roll_id, roto_metallic_rolls(source_film_roll_id, roto_film_rolls(brand_id, film_type))").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    selectedRollIds.length > 0 ? supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, fabric_type_id, product_id, offset_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    selectedRollIds.length > 0 ? supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags, status, fabric_type_id, product_id, finish_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    selectedRollIds.length > 0 ? supabase.from("roto_film_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, brand_id, film_type").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] }),
    selectedRollIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, meters, status, source_film_roll_id, roto_film_rolls(brand_id, film_type)").in("id", selectedRollIds).is("deleted_at", null) : Promise.resolve({ data: [] })
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
    const parsed = parseLaminationRollId(r.roll_id, fabrics || [], rotoProducts || []);
    return {
      id: r.id,
      roll_number: r.roll_id,
      s_no: r.s_no,
      gross_weight: r.gross_weight,
      core_weight: r.core_weight,
      net_weight: r.net_weight ?? r.weight_kg,
      supplier_roll_id: r.supplier_roll_id,
      weight: Number((r.net_weight ?? r.weight_kg) || 0),
      meters: Number(r.meters || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id || parsed.fabricTypeId,
      product_id: r.product_id,
      lam_type: r.lam_type || parsed.lamType,
      roto_product_id: parsed.rotoProductId,
      film_type: parsed.filmType,
      is_metallic: parsed.isMetallic,
      department: "lamination"
    };
  });

  const mappedOffset = [
    ...(availableOffset.data ?? []),
    ...(selectedOffset.data ?? [])
  ].map((r: any) => {
    const parsed = parseOffsetRollId(r.roll_id, fabrics || [], offsetProducts || []);
    return {
      id: r.id,
      roll_number: r.roll_id,
      s_no: r.s_no,
      supplier_roll_id: r.supplier_roll_id,
      weight: Number(r.weight_kg || 0),
      meters: Number(r.meters || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id || parsed.fabricTypeId,
      product_id: r.product_id,
      offset_type: r.offset_type,
      offset_product_id: parsed.offsetProductId,
      department: "offset-printing"
    };
  });

  const mappedFinishing = [
    ...(availableFinishing.data ?? []),
    ...(selectedFinishing.data ?? [])
  ].map((r: any) => {
    const parsed = parseFinishingBundleId(r.bundle_id, fabrics || [], rotoProducts || [], offsetProducts || []);
    return {
      id: r.id,
      roll_number: r.bundle_id,
      s_no: r.s_no,
      supplier_roll_id: r.supplier_roll_id,
      weight: Number(r.weight_kg || 0),
      meters: Number(r.num_bags || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id || parsed.fabricTypeId,
      product_id: r.product_id,
      finish_type: r.finish_type,
      lam_type: parsed.lamType,
      film_type: parsed.filmType,
      is_metallic: parsed.isMetallic,
      roto_product_id: parsed.rotoProductId,
      offset_product_id: parsed.offsetProductId,
      department: "finishing"
    };
  });

  const mappedRotoFilm = [
    ...(availableRotoFilm.data ?? []),
    ...(selectedRotoFilm.data ?? [])
  ].map((r: any) => ({
    id: r.id,
    roll_number: r.roll_id,
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id,
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
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id,
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

  return (
    <div className="space-y-6">
      <div className="no-print mb-4">
        <Link href={"/sales/delivery-entry" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Delivery Entry List
          </Button>
        </Link>
      </div>

      <DeliveryEntryWorkspace
        orders={[order] as any[]}
        fabrics={(fabrics ?? []) as any[]}
        rotoProducts={(rotoProducts ?? []) as any[]}
        offsetProducts={(offsetProducts ?? []) as any[]}
        laminationProducts={(laminationProds ?? []) as any[]}
        finishingProducts={(finishingProds ?? []) as any[]}
        rolls={Array.from(rollsById.values())}
        initialOrderId={id}
        singleViewMode={true}
        permissions={permissions}
      />
    </div>
  );
}
