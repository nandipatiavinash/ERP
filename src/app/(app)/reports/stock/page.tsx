import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { StockReportClient } from "./StockReportClient";

type Params = { from?: string; to?: string };

export default async function StockReportPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("reports.view");
  const params = await searchParams;
  const from = params.from || todayInIndia();
  const to = params.to || todayInIndia();

  const supabase = await createClient();

  // Query raw materials
  const { data: rawMaterials } = await supabase
    .from("raw_materials")
    .select("id, material_name, unit, current_stock")
    .is("deleted_at", null)
    .order("material_name");

  // Query purchases since the from date
  const { data: purchases } = await supabase
    .from("raw_material_purchases")
    .select("raw_material_id, purchase_date, quantity")
    .gte("purchase_date", from)
    .is("deleted_at", null);

  // Query consumptions since the from date
  const { data: consumptions } = await (supabase
    .from("raw_material_consumptions") as any)
    .select("raw_material_id, consumption_date, quantity")
    .gte("consumption_date", from)
    .is("deleted_at", null);

  return (
    <StockReportClient
      from={from}
      to={to}
      rawMaterials={(rawMaterials ?? []) as any[]}
      purchases={(purchases ?? []) as any[]}
      consumptions={(consumptions ?? []) as any[]}
    />
  );
}
