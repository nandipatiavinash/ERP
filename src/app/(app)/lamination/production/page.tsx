import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LaminationProductionForm } from "@/components/app/lamination-production-form";
import { deleteLaminationProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

export default async function LaminationProductionPage() {
  await requirePermission("lamination.production");
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [
    { data: activeFabricTypes },
    { data: activeRotoProducts },
    { data: todayLaminationEntries },
    { data: availableRolls },
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("roto_products")
      .select("id, brand")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("brand"),
    supabase
      .from("lamination_rolls")
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

  const availableFabricTypeIds = Array.from(
    new Set((availableRolls ?? []).map((r: any) => r.fabric_type_id).filter(Boolean))
  );

  const fabricTypes = ((activeFabricTypes ?? []) as any[]).filter((t) =>
    availableFabricTypeIds.includes(t.id)
  );
  const rotoProducts = (activeRotoProducts ?? []) as any[];
  const laminationRows = (todayLaminationEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Production"
        description="Log lamination output using a fabric type or raw NW material."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Submit Lamination Production</CardTitle>
        </CardHeader>
        <CardContent>
          <LaminationProductionForm
            fabricTypes={fabricTypes}
            rotoProducts={rotoProducts}
            rows={laminationRows}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Lamination Production Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {laminationRows.length === 0 ? (
            <EmptyState title="No entries found" description="Laminated rolls produced will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Laminated Roll ID</TableHead>
                    <TableHead className="text-right">KGs</TableHead>
                    <TableHead className="text-right">Meters</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laminationRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                      <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                      <TableCell className="text-right font-mono">{row.meters}</TableCell>
                      <TableCell className="text-center">
                        <form action={deleteLaminationProduction.bind(null, row.id)}>
                          <ConfirmSubmitButton
                             size="sm"
                             variant="destructive"
                             confirmTitle="Delete lamination entry?"
                             confirmDescription="This will delete this roll and revert any metallic roll back to available stock."
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
