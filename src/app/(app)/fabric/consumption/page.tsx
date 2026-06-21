import { ConsumptionForm } from "@/components/app/consumption-form";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";

export default async function FabricConsumptionPage() {
  await requirePermission("production.view");
  const supabase = await createClient();
  const date = todayInIndia();

  const [{ data: rawMaterials }, { data: consumptions }] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "fabric")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "fabric")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const materials = (rawMaterials ?? []) as any[];
  const rows = (consumptions ?? []) as any[];

  return (
    <>
      <PageHeader
        title="Fabric Raw Material Consumption"
        description="Log and monitor the consumption of raw materials in the fabric production process."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Log Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsumptionForm department="fabric" materials={materials} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Consumptions</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState title="No logs found" description="New consumption logs will show up here after being saved." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.consumption_date)}</TableCell>
                      <TableCell>{row.raw_materials?.material_name ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(row.quantity, 2)} {row.raw_materials?.unit ?? ""}
                      </TableCell>
                      <TableCell>{row.remarks ?? "-"}</TableCell>
                      <TableCell>
                        <form action={softDeleteRawMaterialConsumption}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmitButton
                            size="sm"
                            variant="outline"
                            confirmTitle="Delete consumption log?"
                            confirmDescription="This will revert the stock update and remove the log entry."
                          >
                            Delete
                          </ConfirmSubmitButton>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
