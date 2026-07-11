import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockFinishingBundlesClient } from "./StockFinishingBundlesClient";

export default async function FinishingStockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("finishing.stock");
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: fabricData, error: fabricError },
    { data: bundles, error: bundlesError },
  ] = await Promise.all([
    supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),
    supabase
      .from("finishing_bundles")
      .select("*")
      .eq("fabric_type_id", id)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  if (fabricError || bundlesError) {
    throw new Error("Unable to load finishing stock details.");
  }

  const fabricName = (fabricData as any)?.fabric_name ?? "Fabric";

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href={"/finishing/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Finished Bundles — ${fabricName}`}
        description={`Detailed view of finished bag bundles produced using ${fabricName}.`}
      />

      <StockFinishingBundlesClient
        bundles={(bundles ?? []) as any[]}
        fabricName={fabricName}
      />
    </div>
  );
}
