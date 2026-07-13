import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function OffsetPrintingStockPage() {
  await requirePermission("offset_printing.stock");
  const supabase = await createClient();

  const { data: rolls, error } = await supabase
    .from("offset_rolls")
    .select("*, fabric_types(fabric_name)")
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  const groupsMap = new Map<string, { roll_id: string; rolls: number; weight: number }>();
  for (const r of (rolls ?? []) as any[]) {
    const rId = r.roll_id || "UNSPECIFIED";
    if (!groupsMap.has(rId)) {
      groupsMap.set(rId, {
        roll_id: rId,
        rolls: 0,
        weight: 0
      });
    }
    if (r.status === "available") {
      const g = groupsMap.get(rId)!;
      g.rolls += 1;
      g.weight += Number(r.weight_kg || 0);
    }
  }
  const stockRows = Array.from(groupsMap.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));

  const totalRolls = stockRows.reduce((sum, r) => sum + r.rolls, 0);
  const totalWeight = stockRows.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Stock Inventory"
        description="Offset printing stock grouped by specification ID, with roll-level drill-down."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Offset Printing Stock Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No available offset printing stock found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification ID</TableHead>
                    <TableHead className="text-right">Rolls Count</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-base font-mono">
                        <Link href={`/offset-printing/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.roll_id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold">Total</TableCell>
                    <TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>
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
