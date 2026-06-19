import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function FabricStockDetailPage({
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
        <Link href={"/fabric/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Rolls - ${fabricName}`}
        description={`Detailed view of fabric rolls registered under type ${fabricName}.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Fabric Rolls ({sortedRolls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRolls.length === 0 ? (
            <EmptyState
              title="No records found"
              description={`There are currently no active rolls for ${fabricName}.`}
            />
          ) : (
            <div className="space-y-3">
              {sortedRolls.map((roll) => {
                const serialNo = roll.roll_number.startsWith(fabricName + "-")
                  ? roll.roll_number.slice(fabricName.length + 1)
                  : roll.roll_number;
                const lpe = roll.loom_production_entries;
                return (
                  <details
                    key={roll.id}
                    className="group border rounded-lg bg-background p-4 [&_summary::-webkit-details-marker]:hidden transition-all duration-200 hover:border-emerald-600/40"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base">
                        <span className="font-bold text-emerald-950">Roll #{serialNo}</span>
                        <span className="text-muted-foreground hidden md:inline">|</span>
                        <span>
                          Net Weight: <strong className="text-emerald-900">{formatNumber(lpe?.net_weight, 2)} kg</strong>
                        </span>
                        <span className="text-muted-foreground hidden md:inline">|</span>
                        <span>
                          Meters: <strong className="text-emerald-900">{formatNumber(Math.floor(lpe?.net_meters ?? 0), 0)} m</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge value={roll.status} />
                        <span className="shrink-0 rounded-full bg-muted p-1.5 text-muted-foreground group-open:-rotate-180 transition-transform duration-200">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                    </summary>
                    <div className="mt-4 border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross Weight</div>
                        <div className="mt-1 text-base font-semibold text-foreground">{formatNumber(lpe?.gross_weight, 2)} kg</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Core Weight</div>
                        <div className="mt-1 text-base font-semibold text-foreground">{formatNumber(lpe?.core_weight, 2)} kg</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Meter Weight</div>
                        <div className="mt-1 text-base font-semibold text-foreground">{formatNumber(lpe?.average_meter_weight, 2)} g/m</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loom Number</div>
                        <div className="mt-1 text-base font-semibold text-foreground">{roll.looms?.loom_number ?? "N/A"}</div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
