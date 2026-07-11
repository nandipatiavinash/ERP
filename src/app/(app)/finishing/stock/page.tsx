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

  const groupsMap = new Map<string, { fabric_type_id: string; fabric_name: string; bundles: number; bags: number; weight: number }>();
  for (const b of (bundles ?? []) as any[]) {
    const fId = b.fabric_type_id || "unspecified";
    const fName = b.fabric_types?.fabric_name || "Unspecified Fabric";
    if (!groupsMap.has(fId)) {
      groupsMap.set(fId, {
        fabric_type_id: fId,
        fabric_name: fName,
        bundles: 0,
        bags: 0,
        weight: 0
      });
    }
    const g = groupsMap.get(fId)!;
    g.bundles += 1;
    g.bags += Number(b.num_bags || 0);
    g.weight += Number(b.weight_kg || 0);
  }
  const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.fabric_name.localeCompare(b.fabric_name));

  const totalBundles = stockRows.reduce((sum, r) => sum + r.bundles, 0);
  const totalBags = stockRows.reduce((sum, r) => sum + r.bags, 0);
  const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finishing Stock Inventory"
        description="Finishing bundles stock grouped by fabric type, with bundle-level drill-down."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Stock Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No available finishing stock found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead className="text-right">Bundles Count</TableHead>
                    <TableHead className="text-right">Total Bags (pcs)</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row) => (
                    <TableRow key={row.fabric_type_id}>
                      <TableCell className="font-semibold text-base">
                        <Link href={`/finishing/stock/${row.fabric_type_id}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.fabric_name}
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
