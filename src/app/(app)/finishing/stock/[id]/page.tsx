import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockFinishingBundlesClient } from "./StockFinishingBundlesClient";

export default async function FinishingStockDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ brand?: string }>;
}) {
  await requirePermission("finishing.stock");
  const { id } = await params;
  const { brand } = await searchParams;
  const supabase = await createClient();

  const brandFilter = brand || "Fabric";

  let fabricName = "Unspecified Fabric";
  let bundlesQuery: any;

  if (id === "unspecified") {
    bundlesQuery = supabase
      .from("finishing_bundles")
      .select("*")
      .is("fabric_type_id", null)
      .eq("status", "available")
      .is("deleted_at", null);
  } else {
    const { data: fabricData } = await supabase
      .from("fabric_types")
      .select("fabric_name")
      .eq("id", id)
      .single();
    fabricName = (fabricData as any)?.fabric_name ?? "Fabric";

    bundlesQuery = supabase
      .from("finishing_bundles")
      .select("*")
      .eq("fabric_type_id", id)
      .eq("status", "available")
      .is("deleted_at", null);
  }

  const { data: bundlesData, error: bundlesError } = await bundlesQuery.order("created_at", { ascending: false });

  if (bundlesError) {
    throw new Error("Unable to load finishing stock details.");
  }

  // Filter bundles by brand name matching brandFilter
  const filteredBundles = (bundlesData ?? []).filter((b: any) => {
    const match = b.bundle_id.match(/^([^(]+)/);
    let brandName = match ? match[1].trim() : "";
    if (!brandName) brandName = "Fabric";
    return brandName.toLowerCase() === brandFilter.toLowerCase();
  });

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
        title={`Finished Bundles — ${brandFilter} (${fabricName})`}
        description={`Detailed view of finished bag bundles produced for brand ${brandFilter} using ${fabricName}.`}
      />

      <StockFinishingBundlesClient
        bundles={filteredBundles as any[]}
        fabricName={fabricName}
      />
    </div>
  );
}
