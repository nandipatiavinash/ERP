import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function FinishingStockPage() {
  await requirePermission("finishing.stock");
  const supabase = await createClient();

  const { data: bundles, error } = await supabase
    .from("finishing_bundles")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const stockRows = (bundles ?? []) as any[];

  // Summaries
  const totalBags = stockRows.reduce((sum, b) => sum + Number(b.num_bags), 0);
  const totalWeight = stockRows.reduce((sum, b) => sum + Number(b.weight_kg), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Stock"
        description="View available finished bundles in stock."
      />

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-baseline flex-wrap gap-2">
            <span>Available Finished Bundles ({stockRows.length})</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              Total Bags: {formatNumber(totalBags, 0)} · Total Weight: {formatNumber(totalWeight, 1)} kg
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <EmptyState title="No stock found" description="Finished bundles logged will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Bundle ID (Source)</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">No. of Bags</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                    <TableHead>Date Logged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{bundle.bundle_id}</TableCell>
                      <TableCell className="font-semibold text-xs">{bundle.finish_type}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(bundle.num_bags, 0)}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(bundle.weight_kg, 2)}</TableCell>
                      <TableCell>{formatDate(bundle.entry_date)}</TableCell>
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
