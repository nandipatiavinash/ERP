import { ConsumptionForm } from "@/components/app/consumption-form";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";

import { RotoConsumptionClient } from "./RotoConsumptionClient";

export default async function RotoPrintingConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("roto_printing.consumption");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const isToday = date === todayInIndia();

  const [{ data: rawMaterials }, { data: consumptions }] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "roto-printing")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "roto-printing")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const materials = (rawMaterials ?? []) as any[];
  const rows = (consumptions ?? []) as any[];

  return (
    <>
      <PageHeader
        title="Roto Printing Raw Material Consumption"
        description="Log and monitor the consumption of raw materials (inks, chemicals, solvents) in the Roto Printing process."
      />

      {permissions.includes("reports.filter_by_date") && (
        <div className="flex justify-end mb-6">
          <DateFilter date={date} baseUrl="/roto-printing/consumption" />
        </div>
      )}

      <RotoConsumptionClient
        date={date}
        isToday={isToday}
        materials={materials}
        rows={rows}
      />
    </>
  );
}
