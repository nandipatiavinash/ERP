import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { ProductionForm } from "@/components/app/production-form";
import { StatusBadge } from "@/components/app/status-badge";
import { softDeleteProduction } from "@/app/(app)/_actions";
import { isAdmin, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function ProductionPage() {
  const user = await requireUser();
  const admin = isAdmin(user);
  const supabase = await createClient();
  const [{ data: fabrics }, { data: looms }, { data: rows }] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),
    supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),
    supabase
      .from("loom_production_entries")
      .select("*, fabric_types(fabric_name), looms(loom_number), fabric_rolls(roll_number, status)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const productionRows = (rows ?? []) as any[];
  const lastMeters = Object.fromEntries(
    ((looms ?? []) as any[]).map((loom) => {
      const last = productionRows.find((row) => row.loom_id === loom.id);
      return [loom.id, Number(last?.end_meters ?? 0)];
    }),
  );

  return (
    <>
      <PageHeader title="Loom Production" description="Operators create entries; the database generates serials, calculations, and fabric rolls." />
      <Card className="mb-5">
        <CardHeader><CardTitle>New Production Entry</CardTitle></CardHeader>
        <CardContent>
          <ProductionForm
            fabrics={((fabrics ?? []) as any[]).map((fabric) => ({ id: fabric.id, label: fabric.fabric_name }))}
            looms={((looms ?? []) as any[]).map((loom) => ({ id: loom.id, label: loom.loom_number }))}
            lastMeters={lastMeters}
            isAdmin={admin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Entries</CardTitle></CardHeader>
        <CardContent>
          {productionRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fabric</TableHead>
                    <TableHead>Loom</TableHead>
                    <TableHead>Net Wt</TableHead>
                    <TableHead>Net Mtrs</TableHead>
                    <TableHead>Avg</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.serial_number}</TableCell>
                      <TableCell>{formatDate(row.entry_date)}</TableCell>
                      <TableCell>{row.fabric_types?.fabric_name}</TableCell>
                      <TableCell>{row.looms?.loom_number}</TableCell>
                      <TableCell>{formatNumber(row.net_weight, 3)}</TableCell>
                      <TableCell>{formatNumber(row.net_meters)}</TableCell>
                      <TableCell>{formatNumber(row.average_meter_weight, 3)}</TableCell>
                      <TableCell>
                        <div>{row.fabric_rolls?.roll_number ?? "-"}</div>
                        {row.fabric_rolls?.status ? <StatusBadge value={row.fabric_rolls.status} /> : null}
                      </TableCell>
                      <TableCell className="min-w-96">
                        <details>
                          <summary className="cursor-pointer text-sm font-medium text-primary">Edit</summary>
                          <div className="mt-3">
                            <ProductionForm
                              row={row}
                              fabrics={((fabrics ?? []) as any[]).map((fabric) => ({ id: fabric.id, label: fabric.fabric_name }))}
                              looms={((looms ?? []) as any[]).map((loom) => ({ id: loom.id, label: loom.loom_number }))}
                              lastMeters={lastMeters}
                              isAdmin={admin}
                            />
                          </div>
                        </details>
                        <form action={softDeleteProduction} className="mt-3">
                          <input type="hidden" name="id" value={row.id} />
                          <Button type="submit" variant="outline" size="sm">Void</Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
