import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { OffsetPrintingStockClient } from "./OffsetPrintingStockClient";

type Params = { tab?: string };

export default async function OffsetPrintingStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("offset_printing.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  const rollsQuery = supabase
    .from("offset_rolls")
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
        title="Offset Printing Stock Inventory"
        description="Offset printing stock grouped by specification ID, with roll-level drill-down."
      />

      <OffsetPrintingStockClient
        rolls={(rolls ?? []) as any[]}
        tab={activeTab}
      />
    </div>
  );
}
