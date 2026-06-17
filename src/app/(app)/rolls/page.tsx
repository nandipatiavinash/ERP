import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function RollsPage() {
  await requirePermission("rolls.view");
  const supabase = await createClient();

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
      <div className="grid gap-4 md:grid-cols-3">
        {stockRows.map((row) => (
          <Link key={row.fabric_type_id} href={`/rolls/${row.fabric_type_id}` as any}>
            <Card className="transition-all duration-200 hover:bg-muted/40 hover:border-emerald-600 cursor-pointer hover:shadow-md hover:scale-[1.01]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-emerald-950">{row.fabric_name}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-sm pt-0">
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Rolls</div>
                  <div className="font-bold text-base text-emerald-900">{row.rolls}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Weight</div>
                  <div className="font-bold text-base text-emerald-900">{formatNumber(row.weight, 2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Meters</div>
                  <div className="font-bold text-base text-emerald-900">{formatNumber(Math.floor(row.meters), 0)}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
