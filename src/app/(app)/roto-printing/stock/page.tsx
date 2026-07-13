import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function RotoPrintingStockPage() {
  await requirePermission("roto_printing.stock");
  const supabase = await createClient();

  const [
    { data: filmRolls, error: filmError },
    { data: metallicRolls, error: metallicError },
  ] = await Promise.all([
    supabase
      .from("roto_film_rolls")
      .select("*, roto_products(brand)")
      .is("deleted_at", null),
    supabase
      .from("roto_metallic_rolls")
      .select("*, roto_film_rolls(brand_id, roto_products(brand))")
      .is("deleted_at", null),
  ]);

  if (filmError) throw new Error(filmError.message);
  if (metallicError) throw new Error(metallicError.message);

  // Group Film Rolls by roll_id (printed specification)
  const filmGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();
  for (const r of (filmRolls ?? []) as any[]) {
    const rId = r.roll_id || "UNSPECIFIED";
    if (!filmGroups.has(rId)) {
      filmGroups.set(rId, {
        roll_id: rId,
        rolls: 0,
        weight: 0,
        meters: 0
      });
    }
    if (r.status === "available") {
      const g = filmGroups.get(rId)!;
      g.rolls += 1;
      g.weight += Number(r.weight_kg || 0);
      g.meters += Number(r.meters || 0);
    }
  }
  const filmStockRows = Array.from(filmGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));

  // Group Metallic Rolls by roll_id
  const metallicGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();
  for (const r of (metallicRolls ?? []) as any[]) {
    const rId = r.roll_id || "UNSPECIFIED";
    if (!metallicGroups.has(rId)) {
      metallicGroups.set(rId, {
        roll_id: rId,
        rolls: 0,
        weight: 0,
        meters: 0
      });
    }
    if (r.status === "available") {
      const g = metallicGroups.get(rId)!;
      g.rolls += 1;
      g.weight += Number(r.weight_kg || 0);
      g.meters += Number(r.meters || 0);
    }
  }
  const metallicStockRows = Array.from(metallicGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));

  const totalFilmRolls = filmStockRows.reduce((sum, r) => sum + r.rolls, 0);
  const totalFilmWeight = filmStockRows.reduce((sum, r) => sum + r.weight, 0);
  const totalFilmMeters = filmStockRows.reduce((sum, r) => sum + r.meters, 0);

  const totalMetallicRolls = metallicStockRows.reduce((sum, r) => sum + r.rolls, 0);
  const totalMetallicWeight = metallicStockRows.reduce((sum, r) => sum + r.weight, 0);
  const totalMetallicMeters = metallicStockRows.reduce((sum, r) => sum + r.meters, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roto Printing Stock Inventory"
        description="Film rolls and Metallic rolls grouped by Roto Specification ID, with roll-level drill-down."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Film Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Printed Film Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {filmStockRows.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No available printed film stock found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification ID</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filmStockRows.map((row) => (
                      <TableRow key={row.roll_id}>
                        <TableCell className="font-semibold text-base font-mono">
                          <Link href={`/roto-printing/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.roll_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold border-t-2">
                      <TableCell className="text-base font-bold">Total</TableCell>
                      <TableCell className="text-right text-base font-bold">{totalFilmRolls}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(totalFilmWeight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalFilmMeters), 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metallic Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Metallic Film Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {metallicStockRows.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No available metallic stock found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification ID</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metallicStockRows.map((row) => (
                      <TableRow key={row.roll_id}>
                        <TableCell className="font-semibold text-base font-mono">
                          <Link href={`/roto-printing/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.roll_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold border-t-2">
                      <TableCell className="text-base font-bold">Total</TableCell>
                      <TableCell className="text-right text-base font-bold">{totalMetallicRolls}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(totalMetallicWeight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMetallicMeters), 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
