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

  const [
    { data: activeFabricRolls },
    { data: activeMetallicRolls },
    { data: rawNWMaterials },
    { data: todayLaminationEntries },
  ] = await Promise.all([
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters")
      .eq("status", "available")
      .eq("current_stage", "loom")
      .is("deleted_at", null)
      .order("roll_number"),
    supabase
      .from("roto_metallic_rolls")
      .select("id, roll_id, weight_kg, meters")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("raw_materials")
      .select("id, material_name")
      .eq("department", "lamination")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("lamination_rolls")
      .select("*, fabric_rolls(roll_number), roto_metallic_rolls(roll_id), raw_materials(material_name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const fabricRolls = (activeFabricRolls ?? []) as any[];
  const metallicRolls = (activeMetallicRolls ?? []) as any[];
  const rawMaterials = (rawNWMaterials ?? []) as any[];
  const laminationRows = (todayLaminationEntries ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Production"
        description="Log lamination output using a fabric roll, metallic film roll, or raw NW material."
      />

      <Card>
        <CardHeader>
          <CardTitle>Log Lamination Run</CardTitle>
        </CardHeader>
        <CardContent>
          <LaminationProductionForm
            fabricRolls={fabricRolls}
            filmRolls={metallicRolls}
            rawMaterials={rawMaterials}
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
                    <TableHead>Date</TableHead>
                    <TableHead>Laminated Roll ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source Fabric</TableHead>
                    <TableHead>Source Film (Metallic)</TableHead>
                    <TableHead>NW Material</TableHead>
                    <TableHead className="text-right">KGs</TableHead>
                    <TableHead className="text-right">Meters</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laminationRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.entry_date)}</TableCell>
                      <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                      <TableCell className="font-semibold text-xs">{row.lam_type}</TableCell>
                      <TableCell className="font-mono text-xs">{row.fabric_rolls?.roll_number ?? "-"}</TableCell>
                      <TableCell className="font-mono text-xs">{row.roto_metallic_rolls?.roll_id ?? "-"}</TableCell>
                      <TableCell className="text-xs">{row.raw_materials?.material_name ?? "-"}</TableCell>
                      <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                      <TableCell className="text-right font-mono">{row.meters}</TableCell>
                      <TableCell className="text-center">
                        <form action={async (fd) => {
                          "use server";
                          await deleteLaminationProduction(row.id);
                        }}>
                          <ConfirmSubmitButton
                            size="sm"
                            variant="destructive"
                            confirmTitle="Delete lamination entry?"
                            confirmDescription="This will delete this roll and revert the source fabric and metallic rolls back to available stock."
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
