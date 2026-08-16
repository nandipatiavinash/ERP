import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { FinishingStockClient } from "./FinishingStockClient";

type Params = { tab?: string };

export default async function FinishingStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("finishing.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  const bundlesQuery = supabase
    .from("finishing_bundles")
    .select("*, fabric_types(fabric_name)")
    .is("deleted_at", null);

  if (activeTab === "available") {
    bundlesQuery.eq("status", "available");
  }

  const { data: bundles, error } = await bundlesQuery;

  if (error) throw new Error(error.message);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Stock Inventory"
        description="Finishing bundles stock grouped by specification ID, with bundle-level drill-down."
      />

      <FinishingStockClient
        bundles={(bundles ?? []) as any[]}
        tab={activeTab}
      />
    </div>
  );
}
