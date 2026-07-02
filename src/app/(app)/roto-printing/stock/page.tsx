import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function RotoPrintingStockPage() {
  await requirePermission("roto_printing.stock");
  const supabase = await createClient();

  const [
    { data: filmRolls },
    { data: metallicRolls },
  ] = await Promise.all([
    supabase
      .from("roto_film_rolls")
      .select("*, roto_products(brand), roto_colors(color_name)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("roto_metallic_rolls")
      .select("*, roto_film_rolls(roll_id)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const films = (filmRolls ?? []) as any[];
  const metallics = (metallicRolls ?? []) as any[];

  // Film rolls summaries
  const totalFilmKg = films.reduce((sum, r) => sum + Number(r.weight_kg), 0);
  const totalFilmMeters = films.reduce((sum, r) => sum + Number(r.meters), 0);

  // Metallic summaries
  const totalMetallicKg = metallics.reduce((sum, r) => sum + Number(r.weight_kg), 0);
  const totalMetallicMeters = metallics.reduce((sum, r) => sum + Number(r.meters), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roto Printing Stock"
        description="View available Film rolls and Metallic rolls in stock."
      />

      {/* Film Stock Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-baseline flex-wrap gap-2">
            <span>Available Printed Film Rolls ({films.length})</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              Total: {formatNumber(totalFilmKg, 1)} kg · {formatNumber(totalFilmMeters, 0)} m
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {films.length === 0 ? (
            <EmptyState title="No Film rolls in stock" description="Films produced and not yet processed into metallic rolls or lamination will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Roll ID</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                    <TableHead className="text-right">Meters</TableHead>
                    <TableHead>Date Logged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {films.map((roll) => (
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

      {/* Metallic Stock Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/20">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-baseline flex-wrap gap-2">
            <span>Available Metallic Rolls ({metallics.length})</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              Total: {formatNumber(totalMetallicKg, 1)} kg · {formatNumber(totalMetallicMeters, 0)} m
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metallics.length === 0 ? (
            <EmptyState title="No Metallic rolls in stock" description="Metallic rolls produced and not yet laminated will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Roll ID</TableHead>
                    <TableHead>Source Film Roll</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                    <TableHead className="text-right">Meters</TableHead>
                    <TableHead>Date Logged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metallics.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{roll.roto_film_rolls?.roll_id ?? "-"}</TableCell>
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
