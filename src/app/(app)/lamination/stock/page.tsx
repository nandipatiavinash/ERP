import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function LaminationStockPage() {
  await requirePermission("lamination.stock");
  const supabase = await createClient();

  const { data: rolls, error } = await supabase
    .from("lamination_rolls")
    .select("*, fabric_types(fabric_name), roto_metallic_rolls(roll_id), raw_materials(material_name)")
    .eq("status", "available")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const stockRows = (rolls ?? []) as any[];

  // Summaries
  const totalWeight = stockRows.reduce((sum, r) => sum + Number(r.weight_kg), 0);
  const totalMeters = stockRows.reduce((sum, r) => sum + Number(r.meters), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Stock"
        description="View available laminated rolls in stock."
      />

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-baseline flex-wrap gap-2">
            <span>Available Laminated Rolls ({stockRows.length})</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              Total: {formatNumber(totalWeight, 1)} kg · {formatNumber(totalMeters, 0)} m
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <EmptyState title="No stock found" description="Laminated rolls produced and not yet consumed will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Roll ID</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                    <TableHead className="text-right">Meters</TableHead>
                    <TableHead>Date Laminated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                      <TableCell>{formatDate(roll.entry_date)}</TableCell>
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
