import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockRollsClient } from "./StockRollsClient";

export default async function FabricStockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("fabric.stock");
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: fabricData, error: fabricError },
    { data: allRolls, error: rollsError },
    { data: allocations, error: allocationsError },
  ] = await Promise.all([
    supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),
    supabase
      .from("fabric_rolls")
      .select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
      .eq("fabric_type_id", id)
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(20000),
    (supabase as any).rpc("get_roll_allocations_for_fabric", { p_fabric_type_id: id }),
  ]);

  if (fabricError || rollsError || allocationsError) {
    throw new Error("Unable to load stock details right now.");
  }

  const rolls = (allRolls ?? []) as any[];
  const availableRolls = rolls.filter((r) => r.status === "available");
  const soldRolls = rolls.filter((r) => r.status === "sold");
  const consumedRolls = rolls.filter((r) => r.status === "consumed");

  const rollAllocationMap: Record<string, { dispatchDate: string; clientName: string }> = {};
  for (const allocation of (allocations ?? []) as any[]) {
    rollAllocationMap[allocation.roll_id] = {
      dispatchDate: allocation.dispatch_date,
      clientName: allocation.client_name ?? "Unknown",
    };
  }

  const fabric = fabricData as { fabric_name: string } | null;
  const fabricName = fabric?.fabric_name ?? "Fabric";

  return (
    <>
      <div className="mb-4">
        <Link href={"/fabric/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Rolls — ${fabricName}`}
        description={`Detailed view of fabric rolls registered under type ${fabricName}.`}
      />

      <StockRollsClient
        availableRolls={availableRolls}
        soldRolls={soldRolls}
        consumedRolls={consumedRolls}
        rollAllocationMap={rollAllocationMap}
        fabricName={fabricName}
      />
    </>
  );
}
