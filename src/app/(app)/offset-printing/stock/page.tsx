import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function OffsetPrintingStockPage() {
  await requirePermission("offset_printing.stock");
  const supabase = await createClient();

  const { data: rolls, error } = await supabase
    .from("offset_rolls")
    .select("*, offset_products(brand)")
    .eq("status", "available")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const stockRows = (rolls ?? []) as any[];

  // Summaries
  const totalWeight = stockRows.reduce((sum, r) => sum + Number(r.weight_kg), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Stock"
        description="View available offset printed rolls in stock."
      />

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-baseline flex-wrap gap-2">
            <span>Available Offset Printed Rolls ({stockRows.length})</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              Total Weight: {formatNumber(totalWeight, 1)} kg
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <EmptyState title="No stock found" description="Offset rolls produced and not yet processed into finishing bundles will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Roll ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                    <TableHead>Date Printed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                      <TableCell className="font-semibold text-xs">{roll.offset_type?.replace(/_/g, "/")}</TableCell>
                      <TableCell>{roll.offset_products?.brand ?? "-"}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
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
