import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { ProductionForm } from "@/components/app/production-form";
import { StatusBadge } from "@/components/app/status-badge";
import { softDeleteProduction } from "@/app/(app)/_actions";
import { isAdmin, requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function ProductionPage() {
  const user = await requirePermission("production.view");
  const admin = isAdmin(user);
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [{ data: fabrics }, { data: looms }, { data: rows }, { data: meterRows }, { data: serialRows }] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),
    supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null).order("loom_number"),
    supabase
      .from("loom_production_entries")
      .select("*, fabric_types(fabric_name), looms(loom_number), fabric_rolls(roll_number, status)")
      .is("deleted_at", null)
      .eq("entry_date", today)
      .order("created_at", { ascending: false }),
    supabase
      .from("loom_production_entries")
      .select("loom_id, end_meters")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("loom_production_entries")
      .select("id, fabric_type_id")
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .limit(5000),
  ]);

  const productionRows = (rows ?? []) as any[];
  const meterHistory = (meterRows ?? []) as any[];
  const serialHistory = (serialRows ?? []) as any[];
  const displaySerialByEntry: Record<string, number> = {};
  const lastMeters: Record<string, number> = {};
  for (const row of meterHistory) {
    if (row.loom_id && lastMeters[row.loom_id] === undefined) lastMeters[row.loom_id] = Number(row.end_meters ?? 0);
  }
  for (const loom of (looms ?? []) as any[]) {
    if (lastMeters[loom.id] === undefined) lastMeters[loom.id] = 0;
  }
  const nextSerialByFabric = serialHistory.reduce<Record<string, number>>((serials, row) => {
    if (!row.fabric_type_id) return serials;
    const currentSerial = Math.min((serials[row.fabric_type_id] ?? 0) + 1, 999);
    serials[row.fabric_type_id] = currentSerial;
    if (row.id) displaySerialByEntry[row.id] = currentSerial;
    return serials;
  }, {});
  for (const fabric of (fabrics ?? []) as any[]) {
    nextSerialByFabric[fabric.id] = Math.min((nextSerialByFabric[fabric.id] ?? 0) + 1, 999);
  }

  return (
    <>
      <PageHeader title="Production Entry" description="Operators create entries; the database generates serials, calculations, and fabric rolls." />
      <Card className="mb-5">
        <CardHeader><CardTitle>New Production Entry</CardTitle></CardHeader>
        <CardContent>
          <ProductionForm
            fabrics={((fabrics ?? []) as any[]).map((fabric) => ({ id: fabric.id, label: fabric.fabric_name }))}
            looms={((looms ?? []) as any[]).map((loom) => ({ id: loom.id, label: loom.loom_number }))}
            lastMeters={lastMeters}
            nextSerialByFabric={nextSerialByFabric}
            isAdmin={admin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Today's Production Entries</CardTitle></CardHeader>
        <CardContent>
          {productionRows.length === 0 ? <EmptyState title="No entries today" description="New production entries will appear here immediately after saving." /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Gross Weight (kg)</TableHead>
                    <TableHead>Core Weight (kg)</TableHead>
                    <TableHead>Net Weight (kg)</TableHead>
                    <TableHead>Net Meters (m)</TableHead>
                    <TableHead>Average Weight (g/m)</TableHead>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead>Loom ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionRows.map((row, index) => (
                    <TableRow key={row.id} className={index === 0 ? "bg-emerald-50 font-semibold" : "bg-emerald-50/40"}>
                      <TableCell className="text-lg font-bold text-emerald-900">{displaySerialByEntry[row.id] ?? row.serial_number}</TableCell>
                      <TableCell>{formatNumber(row.gross_weight, 2)} kg</TableCell>
                      <TableCell>{formatNumber(row.core_weight, 2)} kg</TableCell>
                      <TableCell>{formatNumber(row.net_weight, 2)} kg</TableCell>
                      <TableCell>{formatNumber(row.net_meters, 2)} m</TableCell>
                      <TableCell>{formatNumber(row.average_meter_weight, 2)} g/m</TableCell>
                      <TableCell>{row.fabric_types?.fabric_name}</TableCell>
                      <TableCell>{row.looms?.loom_number}</TableCell>
                      <TableCell>{formatDate(row.entry_date)}</TableCell>
                      <TableCell>
                        <div>{row.fabric_rolls?.roll_number ?? "-"}</div>
                        {row.fabric_rolls?.status ? <StatusBadge value={row.fabric_rolls.status} /> : null}
                      </TableCell>
                      <TableCell className="min-w-96">
                        <details>
                          <summary className="cursor-pointer text-sm font-medium text-primary">Edit</summary>
                          <div className="mt-3">
                            <ProductionForm
                              row={{ ...row, display_serial: displaySerialByEntry[row.id] }}
                              fabrics={((fabrics ?? []) as any[]).map((fabric) => ({ id: fabric.id, label: fabric.fabric_name }))}
                              looms={((looms ?? []) as any[]).map((loom) => ({ id: loom.id, label: loom.loom_number }))}
                              lastMeters={lastMeters}
                              nextSerialByFabric={nextSerialByFabric}
                              isAdmin={admin}
                            />
                          </div>
                        </details>
                        <form action={softDeleteProduction} className="mt-3">
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmitButton variant="outline" size="sm" confirmTitle="Void production entry?" confirmDescription="This will mark the production entry inactive and update related views.">Void</ConfirmSubmitButton>
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
