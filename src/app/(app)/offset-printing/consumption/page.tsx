import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { OffsetConsumptionClient } from "./OffsetConsumptionClient";

export default async function OffsetPrintingConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("offset_printing.consumption");
  const permissions = await getSessionPermissions();
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

  const filterByDate = (arr: any[], dateStr: string) => {
    return arr.filter((item) => {
      if (!item.updated_at) return false;
      const localDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(item.updated_at));
      return localDate === dateStr;
    });
  };

  const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);
  const rawRows = (rawConsumptionsRes.data ?? []) as any[];
  const availableFabric = (availableFabricRes.data ?? []) as any[];
  const consumedFabric = filterByDate((consumedFabricRes.data ?? []) as any[], date);
  const availableLam = (availableLamRes.data ?? []) as any[];
  const consumedLam = filterByDate((consumedLamRes.data ?? []) as any[], date);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Consumption"
        description="Log and review consumed raw materials, fabric rolls, and laminated rolls in Offset Printing."
      />

      {permissions.includes("reports.filter_by_date") && (
        <div className="flex justify-end">
          <DateFilter date={date} baseUrl="/offset-printing/consumption" />
        </div>
      )}

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
