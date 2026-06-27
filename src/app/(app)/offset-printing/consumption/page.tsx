import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { OffsetConsumptionClient } from "./OffsetConsumptionClient";

export default async function OffsetPrintingConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("offset_printing.consumption");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const isToday = date === todayInIndia();

  const [
    rawMaterialsRes,
    rawConsumptionsRes,
    availableFabricRes,
    consumedFabricRes,
    availableLamRes,
    consumedLamRes
  ] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "offset-printing")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "offset-printing")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters")
      .eq("status", "available")
      .eq("current_stage", "loom")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, updated_at")
      .eq("status", "consumed")
      .eq("current_stage", "offset_printing")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg, meters")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg, meters, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
  ]);

  const materials = (rawMaterialsRes.data ?? []) as any[];
  const rawRows = (rawConsumptionsRes.data ?? []) as any[];
  const availableFabric = (availableFabricRes.data ?? []) as any[];
  const consumedFabric = (consumedFabricRes.data ?? []) as any[];
  const availableLam = (availableLamRes.data ?? []) as any[];
  const consumedLam = (consumedLamRes.data ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Consumption"
        description="Log and review consumed raw materials, fabric rolls, and laminated rolls in Offset Printing."
      />

      <div className="flex justify-end">
        <DateFilter date={date} baseUrl="/offset-printing/consumption" />
      </div>

      <OffsetConsumptionClient
        date={date}
        isToday={isToday}
        materials={materials}
        rawRows={rawRows}
        availableFabric={availableFabric}
        consumedFabric={consumedFabric}
        availableLam={availableLam}
        consumedLam={consumedLam}
      />
    </div>
  );
}
