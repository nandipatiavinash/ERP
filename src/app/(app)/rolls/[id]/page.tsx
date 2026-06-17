import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function FabricTypeRollsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("rolls.view");
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: fabricData }, { data: rolls }] = await Promise.all([
    supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),
    supabase
      .from("fabric_rolls")
      .select("*, fabric_types(fabric_name), looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
      .eq("fabric_type_id", id)
      .is("deleted_at", null)
      .order("roll_number", { ascending: true }),
  ]);

  const fabric = fabricData as { fabric_name: string } | null;
  const fabricName = fabric?.fabric_name ?? "Fabric";

  // Sort rolls numerically by S. No suffix.
  // Standard text sorting would list "W-12-3-10" before "W-12-3-2".
  // This extracts and parses the numeric suffix to sort W-12-3-1, W-12-3-2 ... W-12-3-10 correctly.
  const sortedRolls = ((rolls ?? []) as any[]).sort((a, b) => {
    const aSerial = a.roll_number.startsWith(fabricName + "-")
      ? Number(a.roll_number.slice(fabricName.length + 1))
      : Number(a.roll_number);
    const bSerial = b.roll_number.startsWith(fabricName + "-")
      ? Number(b.roll_number.slice(fabricName.length + 1))
      : Number(b.roll_number);
    const aNum = Number.isNaN(aSerial) ? 0 : aSerial;
    const bNum = Number.isNaN(bSerial) ? 0 : bSerial;
    return aNum - bNum;
  });

  return (
    <>
      <div className="mb-4">
        <Link href="/rolls" passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Rolls - ${fabricName}`}
        description={`Detailed view of fabric rolls registered under type ${fabricName}.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Fabric Rolls</CardTitle>
        </CardHeader>
        <CardContent>
          {(rolls ?? []).length === 0 ? (
            <EmptyState
              title="No records found"
              description={`There are currently no active rolls for ${fabricName}.`}
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
                  {sortedRolls.map((roll) => {
                    const serialNo = roll.roll_number.startsWith(fabricName + "-")
                      ? roll.roll_number.slice(fabricName.length + 1)
                      : roll.roll_number;
                    const lpe = roll.loom_production_entries;
                    return (
                      <TableRow key={roll.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{fabricName}</TableCell>
                        <TableCell className="font-semibold text-emerald-900">{serialNo}</TableCell>
                        <TableCell>{formatNumber(lpe?.gross_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.core_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.net_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.net_meters ?? 0), 0)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.average_meter_weight ?? 0), 0)}</TableCell>
                        <TableCell>{roll.looms?.loom_number}</TableCell>
                        <TableCell>
                          <StatusBadge value={roll.status} />
                        </TableCell>
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
