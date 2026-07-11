import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function FinishingStockPage() {
  await requirePermission("finishing.stock");
  const supabase = await createClient();

  const { data: bundles, error } = await supabase
    .from("finishing_bundles")
    .select("*, fabric_types(fabric_name)")
    .eq("status", "available")
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  const groupsMap = new Map<string, { bundle_id: string; bundles: number; bags: number; weight: number }>();
  for (const b of (bundles ?? []) as any[]) {
    const bId = b.bundle_id || "UNSPECIFIED";
    if (!groupsMap.has(bId)) {
      groupsMap.set(bId, {
        bundle_id: bId,
        bundles: 0,
        bags: 0,
        weight: 0
      });
    }
    const g = groupsMap.get(bId)!;
    g.bundles += 1;
    g.bags += Number(b.num_bags || 0);
    g.weight += Number(b.weight_kg || 0);
  }
  const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.bundle_id.localeCompare(b.bundle_id));

  const totalBundles = stockRows.reduce((sum, r) => sum + r.bundles, 0);
  const totalBags = stockRows.reduce((sum, r) => sum + r.bags, 0);
  const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Stock Inventory"
        description="Finishing bundles stock grouped by specification ID, with bundle-level drill-down."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Finishing Stock Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No available finishing stock found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification ID</TableHead>
                    <TableHead className="text-right">Bundles Count</TableHead>
                    <TableHead className="text-right">Total Bags (pcs)</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-base font-mono">
                        <Link href={`/finishing/stock/${encodeURIComponent(row.bundle_id)}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.bundle_id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-base font-medium">{row.bundles}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.bags, 0)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold">Total</TableCell>
                    <TableCell className="text-right text-base font-bold">{totalBundles}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalBags, 0)}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
