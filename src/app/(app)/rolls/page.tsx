import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function RollsPage({ searchParams }: { searchParams: Promise<{ fabric_type?: string }> }) {
  await requirePermission("rolls.view");
  const params = await searchParams;
  const supabase = await createClient();
  let rolls: any[] = [];
  if (params.fabric_type) {
    const { data } = await supabase
      .from("fabric_rolls")
      .select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
      .is("deleted_at", null)
      .eq("fabric_type_id", params.fabric_type)
      .order("roll_number", { ascending: true });
    rolls = data ?? [];
  }
  const { data: stock } = await supabase
    .from("fabric_rolls")
    .select("fabric_type_id, weight, meters, status, fabric_types(fabric_name)")
    .eq("status", "available")
    .is("deleted_at", null);

  const stockRows = Object.values(((stock ?? []) as any[]).reduce<Record<string, any>>((acc, roll) => {
    const key = roll.fabric_type_id;
    acc[key] ??= { fabric_type_id: key, fabric_name: roll.fabric_types?.fabric_name, rolls: 0, weight: 0, meters: 0 };
    acc[key].rolls += 1;
    acc[key].weight += Number(roll.weight ?? 0);
    acc[key].meters += Number(roll.meters ?? 0);
    return acc;
  }, {})).sort((a: any, b: any) => String(a.fabric_name).localeCompare(String(b.fabric_name)));

  return (
    <>
      <PageHeader title="Fabric Inventory" description="Fabric stock grouped by type, with roll-level drill-down." />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {stockRows.map((row) => (
          <Link key={row.fabric_type_id} href={`/rolls?fabric_type=${row.fabric_type_id}`}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader><CardTitle>{row.fabric_name}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-sm">
                <div><div className="text-muted-foreground">Rolls</div><div className="font-semibold">{row.rolls}</div></div>
                <div><div className="text-muted-foreground">Weight</div><div className="font-semibold">{formatNumber(row.weight, 2)}</div></div>
                <div><div className="text-muted-foreground">Meters</div><div className="font-semibold">{formatNumber(Math.floor(row.meters), 0)}</div></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Rolls</CardTitle></CardHeader>
        <CardContent>
          {(rolls ?? []).length === 0 ? (
            <EmptyState
              title={params.fabric_type ? "No records found" : "Select a fabric type"}
              description={params.fabric_type ? "Create a record to get started." : "Click on a fabric type card above to view its rolls."}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fabric type</TableHead>
                    <TableHead>S. No</TableHead>
                    <TableHead>Gross Weight</TableHead>
                    <TableHead>Core Weight</TableHead>
                    <TableHead>Net Weight</TableHead>
                    <TableHead>net Mtrs</TableHead>
                    <TableHead>Avg Mtr Weight</TableHead>
                    <TableHead>Loom</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {((rolls ?? []) as any[]).map((roll) => {
                    const fabricName = roll.fabric_types?.fabric_name ?? "";
                    const serialNo = roll.roll_number.startsWith(fabricName + "-")
                      ? roll.roll_number.slice(fabricName.length + 1)
                      : roll.roll_number;
                    const lpe = roll.loom_production_entries;
                    return (
                      <TableRow key={roll.id}>
                        <TableCell>{fabricName}</TableCell>
                        <TableCell>{serialNo}</TableCell>
                        <TableCell>{formatNumber(lpe?.gross_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.core_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.net_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.net_meters ?? 0), 0)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.average_meter_weight ?? 0), 0)}</TableCell>
                        <TableCell>{roll.looms?.loom_number}</TableCell>
                        <TableCell><StatusBadge value={roll.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
