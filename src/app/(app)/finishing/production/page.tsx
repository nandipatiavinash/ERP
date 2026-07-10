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
    { data: activeLamRolls },
    { data: activeFabricRolls },
    { data: activeOffsetRolls },
    { data: activeFinishingProducts },
    { data: todayFinishingEntries },
  ] = await Promise.all([
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, fabric_types(fabric_name)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_number"),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, weight_kg")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("finishing_products")
      .select("id, name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("finishing_bundles")
      .select("*, finishing_products(name), fabric_rolls(roll_number), lamination_rolls(roll_id), offset_rolls(roll_id)")
      .is("deleted_at", null)
      .eq("entry_date", today)
      .order("created_at", { ascending: false }),
  ]);

  const laminationRolls = (activeLamRolls ?? []) as any[];
  const fabricRolls = (activeFabricRolls ?? []) as any[];
  const offsetRolls = (activeOffsetRolls ?? []) as any[];
  const finishingProducts = (activeFinishingProducts ?? []) as any[];
  const finishingRows = (todayFinishingEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Production"
        description="Log finishing bundles of bags from laminated rolls, fabric rolls, or offset printing rolls."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Submit Finishing Production</CardTitle>
        </CardHeader>
        <CardContent>
          <FinishingProductionForm
            laminationRolls={laminationRolls}
            fabricRolls={fabricRolls}
            offsetRolls={offsetRolls}
            finishingProducts={finishingProducts}
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
                    <TableHead>Product Specification</TableHead>
                    <TableHead className="text-right">No. of Bags</TableHead>
                    <TableHead className="text-right">KGs</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finishingRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{row.bundle_id}</TableCell>
                      <TableCell className="font-medium text-slate-700">{row.finishing_products?.name || "Unspecified Bag"}</TableCell>
                      <TableCell className="text-right font-mono">{row.num_bags}</TableCell>
                      <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                      <TableCell className="text-center">
                        <form action={deleteFinishingBundle.bind(null, row.id)}>
                          <ConfirmSubmitButton
                            size="sm"
                            variant="destructive"
                            confirmTitle="Delete finishing entry?"
                            confirmDescription="This will delete this bundle and restore the source roll back to available stock."
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

