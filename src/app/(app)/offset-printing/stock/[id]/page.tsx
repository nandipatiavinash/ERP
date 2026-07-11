import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockOffsetRollsClient } from "./StockOffsetRollsClient";

export default async function OffsetStockDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ brand?: string }>;
}) {
  await requirePermission("offset_printing.stock");
  const { id } = await params;
  const { brand } = await searchParams;
  const supabase = await createClient();

  const brandFilter = brand || "Fabric";

  let fabricName = "Unspecified Fabric";
  let rollsQuery: any;

  if (id === "unspecified") {
    rollsQuery = supabase
      .from("offset_rolls")
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

    rollsQuery = supabase
      .from("offset_rolls")
      .select("*")
      .eq("fabric_type_id", id)
      .eq("status", "available")
      .is("deleted_at", null);
  }

  const { data: rollsData, error: rollsError } = await rollsQuery.order("created_at", { ascending: false });

  if (rollsError) {
    throw new Error("Unable to load offset stock details.");
  }

  // Filter rolls by brand name matching brandFilter
  const filteredRolls = (rollsData ?? []).filter((r: any) => {
    const match = r.roll_id.match(/^([^(]+)/);
    let b = match ? match[1].trim() : "";
    if (!b) b = "Fabric";
    return b.toLowerCase() === brandFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href={"/offset-printing/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Offset Printed Rolls — ${brandFilter} (${fabricName})`}
        description={`Detailed view of offset printed rolls produced for brand ${brandFilter} using ${fabricName}.`}
      />

      <StockOffsetRollsClient
        rolls={filteredRolls as any[]}
        fabricName={fabricName}
      />
    </div>
  );
}
