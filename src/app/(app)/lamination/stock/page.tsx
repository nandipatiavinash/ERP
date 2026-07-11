import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function LaminationStockPage() {
  await requirePermission("lamination.stock");
  const supabase = await createClient();

  const { data: rolls, error } = await supabase
    .from("lamination_rolls")
    .select("*, fabric_types(fabric_name)")
    .eq("status", "available")
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  const groupsMap = new Map<string, { roll_id: string; fabric_type_id: string; fabric_name: string; rolls: number; weight: number; meters: number }>();
  for (const r of (rolls ?? []) as any[]) {
    const key = r.roll_id || "Unspecified";
    const fId = r.fabric_type_id || "unspecified";
    const fName = r.fabric_types?.fabric_name || "Unspecified Fabric";

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        roll_id: key,
        fabric_type_id: fId,
        fabric_name: fName,
        rolls: 0,
        weight: 0,
        meters: 0
      });
    }
    const g = groupsMap.get(key)!;
    g.rolls += 1;
    g.weight += Number(r.weight_kg || 0);
    g.meters += Number(r.meters || 0);
  }
  const stockRows = Array.from(groupsMap.values()).sort((a, b) => {
    return a.roll_id.localeCompare(b.roll_id);
  });

  const totalRolls = stockRows.reduce((sum, r) => sum + r.rolls, 0);
  const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);
  const totalMeters = stockRows.reduce((sum, r) => sum + r.meters, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Stock Inventory"
        description="Lamination stock grouped by brand and fabric type, with roll-level drill-down."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Lamination Stock Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No available laminated stock found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification</TableHead>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead className="text-right">Rolls Count</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                    <TableHead className="text-right">Total Meters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-base font-mono text-emerald-950">
                        <Link href={`/lamination/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.roll_id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-base font-medium">{row.fabric_name}</TableCell>
                      <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold" colSpan={2}>Total</TableCell>
                    <TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMeters), 0)}</TableCell>
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
