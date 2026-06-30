import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { FinishingConsumptionClient } from "./FinishingConsumptionClient";

export default async function FinishingConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("finishing.consumption");
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
    consumedLamRes,
    availableOffsetRes,
    consumedOffsetRes
  ] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "finishing")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "finishing")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name), loom_production_entries(gross_weight, core_weight)")
      .eq("status", "available")
      .eq("current_stage", "loom")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")
      .eq("status", "consumed")
      .eq("current_stage", "finishing")
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
    supabase
      .from("offset_rolls")
      .select("id, roll_id, weight_kg")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, weight_kg, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
  ]);

  const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);
  const rawRows = (rawConsumptionsRes.data ?? []) as any[];
  const availableFabric = (availableFabricRes.data ?? []) as any[];
  const consumedFabric = (consumedFabricRes.data ?? []) as any[];
  const availableLam = (availableLamRes.data ?? []) as any[];
  const consumedLam = (consumedLamRes.data ?? []) as any[];
  const availableOffset = (availableOffsetRes.data ?? []) as any[];
  const consumedOffset = (consumedOffsetRes.data ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Consumption"
        description="Log and review consumed raw materials, fabric rolls, laminated rolls, and offset rolls in finishing."
      />

      <div className="flex justify-end">
        <DateFilter date={date} baseUrl="/finishing/consumption" />
      </div>

      <FinishingConsumptionClient
        date={date}
        isToday={isToday}
        materials={materials}
        rawRows={rawRows}
        availableFabric={availableFabric}
        consumedFabric={consumedFabric}
        availableLam={availableLam}
        consumedLam={consumedLam}
        availableOffset={availableOffset}
        consumedOffset={consumedOffset}
      />
    </div>
  );
}
