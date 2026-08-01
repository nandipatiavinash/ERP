import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FinishingProductionForm } from "@/components/app/finishing-production-form";
import { deleteFinishingBundle } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";

export default async function FinishingProductionPage() {
  await requirePermission("finishing.production");
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [
    { data: activeFabricTypes },
    { data: availableLaminationRolls },
    { data: availableOffsetRolls },
    { data: todayFinishingEntries },
    activeFabricRolls,
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("finishing_bundles")
      .select("*, fabric_types(fabric_name)")
      .is("deleted_at", null)
      .eq("entry_date", today)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null),
  ]);

  const availableFabricTypeIds = new Set((activeFabricRolls?.data || []).map((fr: any) => fr.fabric_type_id));
  const fabricTypes = ((activeFabricTypes ?? []) as any[]).filter((ft) => availableFabricTypeIds.has(ft.id));
  const laminationRolls = (availableLaminationRolls ?? []) as any[];
  const offsetRolls = (availableOffsetRolls ?? []) as any[];
  const finishingRows = (todayFinishingEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Production"
        description="Log finishing bundles of bags produced from Fabric, Lamination, or Offset Printing."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Submit Finishing Production</CardTitle>
        </CardHeader>
        <CardContent>
          <FinishingProductionForm
            fabricTypes={fabricTypes}
            laminationRolls={laminationRolls}
            offsetRolls={offsetRolls}
            rows={finishingRows}
          />
        </CardContent>
      </Card>

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
                    <TableHead>Bundle ID</TableHead>
                    <TableHead>Bundle No</TableHead>
                    <TableHead className="text-right">No. of Bags</TableHead>
                    <TableHead className="text-right">KGs</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finishingRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{row.bundle_id}</TableCell>
                      <TableCell className="text-sm font-bold text-emerald-900">{row.s_no ?? "-"}</TableCell>
                      <TableCell className="text-right font-mono">{row.num_bags}</TableCell>
                      <TableCell className="text-right font-mono">{row.weight_kg != null ? row.weight_kg.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</TableCell>
                      <TableCell className="text-center">
                        <form action={deleteFinishingBundle.bind(null, row.id)}>
                          <ConfirmSubmitButton
                            size="sm"
                            variant="destructive"
                            confirmTitle="Delete finishing entry?"
                            confirmDescription="This will delete this bundle and update stock."
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
  );
}

