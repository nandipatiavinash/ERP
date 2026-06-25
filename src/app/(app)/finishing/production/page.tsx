import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FinishingProductionForm } from "@/components/app/finishing-production-form";
import { deleteFinishingBundle } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

export default async function FinishingProductionPage() {
  await requirePermission("finishing.production");
  const supabase = await createClient();

  const [
    { data: activeLamRolls },
    { data: activeFabricTypes },
    { data: rawNWMaterials },
    { data: todayFinishingEntries },
  ] = await Promise.all([
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("raw_materials")
      .select("id, material_name")
      .eq("department", "finishing")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("finishing_bundles")
      .select("*, lamination_rolls(roll_id), fabric_types(fabric_name), raw_materials(material_name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const laminationRolls = (activeLamRolls ?? []) as any[];
  const fabricTypes = (activeFabricTypes ?? []) as any[];
  const rawMaterials = (rawNWMaterials ?? []) as any[];
  const finishingRows = (todayFinishingEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Production"
        description="Log finishing bundles of bags from laminated rolls, plain fabric types, or NW raw materials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Submit Finishing Production</CardTitle>
            </CardHeader>
            <CardContent>
              <FinishingProductionForm
                laminationRolls={laminationRolls}
                fabricTypes={fabricTypes}
                rawMaterials={rawMaterials}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Finishing Production Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {finishingRows.length === 0 ? (
                <EmptyState title="No entries found" description="Finishing bundles logged will appear here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Bundle ID (Source)</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">No. of Bags</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finishingRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{formatDate(row.entry_date)}</TableCell>
                          <TableCell className="font-mono font-bold text-emerald-950">{row.bundle_id}</TableCell>
                          <TableCell className="font-semibold text-xs">{row.finish_type}</TableCell>
                          <TableCell className="text-right font-mono">{row.num_bags}</TableCell>
                          <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                          <TableCell className="text-center">
                            <form action={async (fd) => {
                              "use server";
                              await deleteFinishingBundle(row.id);
                            }}>
                              <ConfirmSubmitButton
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete finishing entry?"
                                confirmDescription="This will delete this bundle and restore any source lamination roll back to available stock."
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
