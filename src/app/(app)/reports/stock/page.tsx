import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia, fetchPagedData } from "@/lib/utils";
import { StockReportClient } from "./StockReportClient";

type Params = { from?: string; to?: string };

export default async function StockReportPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("reports.stock");
  const params = await searchParams;
  const from = params.from || todayInIndia();
  const to = params.to || todayInIndia();

  const supabase = await createClient();

  const [
    { data: rawMaterials },
    purchases,
    { data: consumptions },
    { data: sales },
    { data: fabricTypes },
    salesOrders,
    { data: materialSales },
    { data: rotoProducts },
    { data: offsetProducts },
    laminationProds,
    finishingProds,
    // Fetch all rolls from 5 departments
    fabricRolls,
    lamRolls,
    offsetRolls,
    finishingBundles,
    rotoFilmRolls,
    rotoMetallicRolls,
  ] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, current_stock, department")
      .is("deleted_at", null)
      .order("material_name"),
    fetchPagedData(
      supabase
        .from("raw_material_purchases")
        .select("id, raw_material_id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount, is_jobwork")
        .gte("purchase_date", from)
        .is("deleted_at", null)
    ),
    (supabase.from("raw_material_consumptions") as any)
      .select("raw_material_id, consumption_date, quantity")
      .gte("consumption_date", from)
      .is("deleted_at", null),
    (supabase.from("material_sales") as any)
      .select("raw_material_id, sale_date, quantity")
      .eq("type", "raw_material")
      .gte("sale_date", from)
      .is("deleted_at", null),
    supabase
      .from("fabric_types")
      .select("id, fabric_name"),
    fetchPagedData(
      supabase
        .from("sales_orders")
        .select(`
          id,
          order_number,
          order_date,
          status,
          bill_number,
          bill_value,
          customer_id,
          is_jobwork,
          customers(customer_name, alias),
          sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, roto_product_id, offset_product_id, pp_percent, filler_percent)
        `)
        .is("deleted_at", null)
    ),
    // All material sales (raw_material + waste) for the Sale section
    (supabase.from("material_sales") as any)
      .select("id, type, department, raw_material_id, sale_date, quantity, bill_number, customers(customer_name, alias)")
      .gte("sale_date", from)
      .lte("sale_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_products")
      .select("id, brand, width, height"),
    supabase
      .from("offset_products")
      .select("id, brand, width, height"),
    supabase
      .from("lamination_products")
      .select("id, name"),
    supabase
      .from("finishing_products")
      .select("id, name"),
    fetchPagedData(
      supabase
        .from("fabric_rolls")
        .select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage")
        .is("deleted_at", null)
    ),
    fetchPagedData(
      supabase
        .from("lamination_rolls")
        .select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")
        .is("deleted_at", null)
    ),
    fetchPagedData(
      supabase
        .from("offset_rolls")
        .select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")
        .is("deleted_at", null)
    ),
    fetchPagedData(
      supabase
        .from("finishing_bundles")
        .select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status")
        .is("deleted_at", null)
    ),
    fetchPagedData(
      supabase
        .from("roto_film_rolls")
        .select("id, roll_id, weight_kg, entry_date, status")
        .is("deleted_at", null)
    ),
    fetchPagedData(
      supabase
        .from("roto_metallic_rolls")
        .select("id, roll_id, weight_kg, entry_date, status")
        .is("deleted_at", null)
    ),
  ]);

  const rolls = [
    ...((fabricRolls ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.roll_number,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight || 0),
      production_date: r.production_date,
      status: r.status,
      current_stage: r.current_stage || "loom",
    })),
    ...((lamRolls ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "lamination",
    })),
    ...((offsetRolls ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "offset_printing",
    })),
    ...((finishingBundles ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.bundle_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "finishing",
    })),
    ...((rotoFilmRolls ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: null,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "roto_printing",
    })),
    ...((rotoMetallicRolls ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: null,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "roto_printing",
    })),
  ];

  return (
    <StockReportClient
      from={from}
      to={to}
      rawMaterials={(rawMaterials ?? []) as any[]}
      purchases={(purchases ?? []) as any[]}
      consumptions={(consumptions ?? []) as any[]}
      sales={(sales ?? []) as any[]}
      fabricTypes={(fabricTypes ?? []) as any[]}
      rolls={(rolls ?? []) as any[]}
      salesOrders={(salesOrders ?? []) as any[]}
      materialSales={(materialSales ?? []) as any[]}
      rotoProducts={(rotoProducts ?? []) as any[]}
      offsetProducts={(offsetProducts ?? []) as any[]}
      laminationProducts={(laminationProds.data ?? []) as any[]}
      finishingProducts={(finishingProds.data ?? []) as any[]}
    />
  );
}


