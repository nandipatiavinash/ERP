import { PageHeader } from "@/components/app/page-header";
import { FabricInventoryClient } from "@/components/app/fabric-inventory-client";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function RollsPage() {
  await requirePermission("rolls.view");
  const supabase = await createClient();

  const [{ data: rolls }, { data: stock }] = await Promise.all([
    supabase
      .from("fabric_rolls")
      .select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
      .is("deleted_at", null)
      .order("roll_number", { ascending: true }),
    supabase
      .from("fabric_rolls")
      .select("fabric_type_id, weight, meters, status, fabric_types(fabric_name)")
      .eq("status", "available")
      .is("deleted_at", null),
  ]);

  return (
    <>
      <PageHeader title="Fabric Inventory" description="Fabric stock grouped by type, with roll-level drill-down." />
      <FabricInventoryClient rolls={(rolls ?? []) as any} stock={(stock ?? []) as any} />
    </>
  );
}
