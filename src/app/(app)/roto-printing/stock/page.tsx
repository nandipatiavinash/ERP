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
      .eq("status", "available")
      .is("deleted_at", null),
    supabase
      .from("roto_metallic_rolls")
      .select("*, roto_film_rolls(brand_id, roto_products(brand))")
      .eq("status", "available")
      .is("deleted_at", null),
  ]);

  if (filmError) throw new Error(filmError.message);
  if (metallicError) throw new Error(metallicError.message);

  // Group Film Rolls by brand
  const filmGroups = new Map<string, { brand_id: string; brand_name: string; rolls: number; weight: number; meters: number }>();
  for (const r of (filmRolls ?? []) as any[]) {
    const bId = r.brand_id || "unspecified";
    const bName = r.roto_products?.brand || "Unspecified Brand";
    if (!filmGroups.has(bId)) {
      filmGroups.set(bId, {
        brand_id: bId,
        brand_name: bName,
        rolls: 0,
        weight: 0,
        meters: 0
      });
    }
    const g = filmGroups.get(bId)!;
    g.rolls += 1;
    g.weight += Number(r.weight_kg || 0);
    g.meters += Number(r.meters || 0);
  }
  const filmStockRows = Array.from(filmGroups.values()).sort((a, b) => a.brand_name.localeCompare(b.brand_name));

  // Group Metallic Rolls by brand
  const metallicGroups = new Map<string, { brand_id: string; brand_name: string; rolls: number; weight: number; meters: number }>();
  for (const r of (metallicRolls ?? []) as any[]) {
    const bId = r.roto_film_rolls?.brand_id || "unspecified";
    const bName = r.roto_film_rolls?.roto_products?.brand || "Unspecified Brand";
    if (!metallicGroups.has(bId)) {
      metallicGroups.set(bId, {
        brand_id: bId,
        brand_name: bName,
        rolls: 0,
        weight: 0,
        meters: 0
      });
    }
    const g = metallicGroups.get(bId)!;
    g.rolls += 1;
    g.weight += Number(r.weight_kg || 0);
    g.meters += Number(r.meters || 0);
  }
  const metallicStockRows = Array.from(metallicGroups.values()).sort((a, b) => a.brand_name.localeCompare(b.brand_name));

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
        description="Film rolls and Metallic rolls grouped by Roto Brand, with roll-level drill-down."
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
                      <TableHead>Brand (Product)</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filmStockRows.map((row) => (
                      <TableRow key={row.brand_id}>
                        <TableCell className="font-semibold text-base">
                          <Link href={`/roto-printing/stock/${row.brand_id}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.brand_name}
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
                      <TableHead>Brand (Product)</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metallicStockRows.map((row) => (
                      <TableRow key={row.brand_id}>
                        <TableCell className="font-semibold text-base">
                          <Link href={`/roto-printing/stock/${row.brand_id}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.brand_name}
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
