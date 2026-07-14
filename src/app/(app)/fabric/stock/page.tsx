import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { FabricStockClient } from "./FabricStockClient";

type Params = { tab?: string };

export default async function FabricStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("fabric.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  // 1. Optimize queries: if activeTab is "available", only load available rolls (bypassing historical data)
  const rollsQuery = supabase
    .from("fabric_rolls")
    .select("fabric_type_id, status, weight, meters")
    .is("deleted_at", null);

  if (activeTab === "available") {
    rollsQuery.eq("status", "available");
  }

  const [fabricTypesRes, rollsRes] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name").order("fabric_name"),
    rollsQuery
  ]);

  const fabricTypes = (fabricTypesRes.data || []) as Array<{ id: string; fabric_name: string }>;
  const rolls = (rollsRes.data || []) as Array<{ fabric_type_id: string; status: string; weight: number; meters: number }>;

  return (
    <>
      <PageHeader title="Fabric Stock Inventory" description="Fabric stock grouped by type, with roll-level drill-down." />
      <FabricStockClient
        fabricTypes={fabricTypes}
        rolls={rolls}
        tab={activeTab}
      />
    </>
  );
}
