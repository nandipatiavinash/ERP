import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OffsetProductionForm } from "@/components/app/offset-production-form";
import { deleteOffsetProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

export default async function OffsetPrintingProductionPage() {
  await requirePermission("offset_printing.production");
  const supabase = await createClient();

  const [
    { data: activeFabricTypes },
    { data: activeLamRolls },
    { data: activeOffsetProducts },
    { data: todayOffsetEntries },
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, lam_type, weight_kg, fabric_types(fabric_name)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("offset_products")
      .select("id, brand")
      .eq("status", "active")
      .order("brand"),
    supabase
      .from("offset_rolls")
      .select("*, offset_products(brand), fabric_types(fabric_name), lamination_rolls(roll_id)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const fabricTypes = (activeFabricTypes ?? []) as any[];
  const laminationRolls = (activeLamRolls ?? []) as any[];
  const offsetProducts = (activeOffsetProducts ?? []) as any[];
  const offsetRows = (todayOffsetEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Production"
        description="Log offset printing output using a fabric type, laminated NW/Plain roll, or raw NW material."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Submit Offset Production</CardTitle>
            </CardHeader>
            <CardContent>
              <OffsetProductionForm
                fabricTypes={fabricTypes}
                laminationRolls={laminationRolls}
                offsetProducts={offsetProducts}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Offset Production Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {offsetRows.length === 0 ? (
                <EmptyState title="No entries found" description="Offset rolls produced will appear here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Offset Roll ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Fabric Type</TableHead>
                        <TableHead>Source Laminated</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offsetRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{formatDate(row.entry_date)}</TableCell>
                          <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                          <TableCell className="font-semibold text-xs">{row.offset_type}</TableCell>
                          <TableCell>{row.offset_products?.brand ?? "-"}</TableCell>
                          <TableCell className="text-xs">{row.fabric_types?.fabric_name ?? "-"}</TableCell>
                          <TableCell className="font-mono text-xs">{row.lamination_rolls?.roll_id ?? "-"}</TableCell>
                          <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                          <TableCell className="text-center">
                            <form action={async (fd) => {
                              "use server";
                              await deleteOffsetProduction(row.id);
                            }}>
                              <ConfirmSubmitButton
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete offset production entry?"
                                confirmDescription="This will delete this roll and revert any source laminated roll back to available stock."
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
        </div>
      </div>
    </div>
  );
}
