import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

type Params = { tab?: string };

export default async function FabricStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("fabric.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  const [fabricTypesRes, rollsRes] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name").order("fabric_name"),
    supabase.from("fabric_rolls").select("fabric_type_id, status, weight, meters").is("deleted_at", null)
  ]);

  const fabricTypes = (fabricTypesRes.data || []) as Array<{ id: string; fabric_name: string }>;
  const rolls = (rollsRes.data || []) as Array<{ fabric_type_id: string; status: string; weight: number; meters: number }>;

  let stockRows = fabricTypes.map((ft) => {
    const matchedRolls = rolls.filter(r => r.fabric_type_id === ft.id && (activeTab === "all" || r.status === "available"));
    return {
      fabric_type_id: ft.id,
      fabric_name: ft.fabric_name,
      rolls: matchedRolls.length,
      weight: matchedRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0),
      meters: matchedRolls.reduce((sum, r) => sum + Number(r.meters || 0), 0),
    };
  });

  if (activeTab === "available") {
    stockRows = stockRows.filter(row => row.rolls > 0);
  }

  const totalRolls = stockRows.reduce((sum: number, r: any) => sum + r.rolls, 0);
  const totalWeight = stockRows.reduce((sum: number, r: any) => sum + r.weight, 0);
  const totalMeters = stockRows.reduce((sum: number, r: any) => sum + r.meters, 0);

  return (
    <>
      <PageHeader title="Fabric Stock Inventory" description="Fabric stock grouped by type, with roll-level drill-down." />
      
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5 no-print">
        <Link
          href={"/fabric/stock?tab=available" as any}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "available"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Available Stock
        </Link>
        <Link
          href={"/fabric/stock?tab=all" as any}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Stock (incl. Consumed/Sold)
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === "all" ? "All Registered Stock" : "Available Stock"} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No stock rolls found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead className="text-right">Rolls Count</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                    <TableHead className="text-right">Total Meters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row) => (
                    <TableRow key={row.fabric_type_id}>
                      <TableCell className="font-semibold text-base">
                        <Link href={`/fabric/stock/${row.fabric_type_id}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.fabric_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold">Total</TableCell>
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
    </>
  );
}
