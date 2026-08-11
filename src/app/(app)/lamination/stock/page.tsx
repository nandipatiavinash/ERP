import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LaminationStockClient } from "./LaminationStockClient";

type Params = { tab?: string };

export default async function LaminationStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("lamination.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  const rollsQuery = supabase
    .from("lamination_rolls")
    .select("*, fabric_types(fabric_name)")
    .is("deleted_at", null);

  if (activeTab === "available") {
    rollsQuery.eq("status", "available");
  }

  const { data: rolls, error } = await rollsQuery;

  if (error) throw new Error(error.message);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Stock Inventory"
        description="Lamination stock grouped by brand and fabric type, with roll-level drill-down."
      />

      <LaminationStockClient
        rolls={(rolls ?? []) as any[]}
        tab={activeTab}
      />
    </div>
  );
}
