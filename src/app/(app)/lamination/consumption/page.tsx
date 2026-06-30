import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { LaminationConsumptionClient } from "./LaminationConsumptionClient";

export default async function LaminationConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("lamination.consumption");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const isToday = date === todayInIndia();

  // Fetch all necessary data:
  // 1. Raw materials list + logs
  // 2. Available fabric rolls (stage=loom) + rolls consumed today
  // 3. Available metallic film rolls + rolls consumed today
  const [
    rawMaterialsRes,
    rawConsumptionsRes,
    availableFabricRes,
    consumedFabricRes,
    availableMetallicRes,
    consumedMetallicRes,
    availableFilmPlainRes,
    consumedFilmPlainRes
  ] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "lamination")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "lamination")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, fabric_type_id, fabric_types(id, fabric_name)")
      .eq("status", "available")
      .eq("current_stage", "loom")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, updated_at, fabric_type_id, fabric_types(id, fabric_name)")
      .eq("status", "consumed")
      .in("current_stage", ["lamination", "lamination_consumption"])
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
    supabase
      .from("roto_metallic_rolls")
      .select("id, roll_id, weight_kg, meters")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("roto_metallic_rolls")
      .select("id, roll_id, weight_kg, meters, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
    supabase
      .from("roto_film_rolls")
      .select("id, roll_id, weight_kg, meters")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("id", { ascending: true })
      .limit(10000),
    supabase
      .from("roto_film_rolls")
      .select("id, roll_id, weight_kg, meters, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(100),
  ]);

  const materials = ((rawMaterialsRes.data ?? []) as any[]).filter((m) => Number(m.current_stock ?? 0) > 0);
  const rawRows = (rawConsumptionsRes.data ?? []) as any[];
  const availableFabric = (availableFabricRes.data ?? []) as any[];
  const consumedFabric = (consumedFabricRes.data ?? []) as any[];

  const availableFilm = [
    ...((availableMetallicRes.data ?? []) as any[]).map(r => ({ ...r, type: "metallic" })),
    ...((availableFilmPlainRes.data ?? []) as any[]).map(r => ({ ...r, type: "film" })),
  ].sort((a, b) => a.roll_id.localeCompare(b.roll_id, undefined, { numeric: true, sensitivity: "base" }));

  const consumedFilm = [
    ...((consumedMetallicRes.data ?? []) as any[]).map(r => ({ ...r, type: "metallic" })),
    ...((consumedFilmPlainRes.data ?? []) as any[]).map(r => ({ ...r, type: "film" })),
  ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Consumption"
        description="Log and review consumed raw materials, fabric rolls, and printed film rolls in lamination."
      />

      <div className="flex justify-end">
        <DateFilter date={date} baseUrl="/lamination/consumption" />
      </div>

      <LaminationConsumptionClient
        date={date}
        isToday={isToday}
        materials={materials}
        rawRows={rawRows}
        availableFabric={availableFabric}
        consumedFabric={consumedFabric}
        availableFilm={availableFilm}
        consumedFilm={consumedFilm}
      />
    </div>
  );
}
