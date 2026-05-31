import { Boxes, CalendarCheck, Factory, Package, Scale, ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/app/dashboard-chart";
import { PageHeader } from "@/components/app/page-header";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Factory }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  await requireUser();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: production }, { data: rolls }, { data: materials }, { data: attendance }] = await Promise.all([
    supabase.from("loom_production_entries").select("net_weight, net_meters, fabric_types(fabric_name)").eq("entry_date", today).is("deleted_at", null),
    supabase.from("fabric_rolls").select("id, weight, meters, status").is("deleted_at", null),
    supabase.from("raw_materials").select("current_stock").is("deleted_at", null),
    supabase.from("attendance").select("id").eq("attendance_date", today).eq("status", "present").is("deleted_at", null),
  ]);

  const todayRows = (production ?? []) as any[];
  const todayWeight = todayRows.reduce((sum, row) => sum + Number(row.net_weight ?? 0), 0);
  const todayMeters = todayRows.reduce((sum, row) => sum + Number(row.net_meters ?? 0), 0);
  const availableRolls = ((rolls ?? []) as any[]).filter((roll) => roll.status === "available");
  const materialStock = ((materials ?? []) as any[]).reduce((sum, row) => sum + Number(row.current_stock ?? 0), 0);
  const chartData = todayRows.reduce<Record<string, { name: string; meters: number; weight: number }>>((acc, row) => {
    const name = row.fabric_types?.fabric_name ?? "Fabric";
    acc[name] ??= { name, meters: 0, weight: 0 };
    acc[name].meters += Number(row.net_meters ?? 0);
    acc[name].weight += Number(row.net_weight ?? 0);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Dashboard" description="Daily production, inventory, HR, and sales snapshot." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Production" value={`${todayRows.length} entries`} icon={Factory} />
        <StatCard title="Total Rolls Today" value={String(todayRows.length)} icon={Package} />
        <StatCard title="Weight Today" value={`${formatNumber(todayWeight, 3)} kg`} icon={Scale} />
        <StatCard title="Meters Today" value={`${formatNumber(todayMeters, 2)} m`} icon={ScrollText} />
        <StatCard title="Available Fabric Stock" value={`${availableRolls.length} rolls`} icon={Package} />
        <StatCard title="Raw Material Stock" value={formatNumber(materialStock, 3)} icon={Boxes} />
        <StatCard title="Employees Present" value={String((attendance ?? []).length)} icon={CalendarCheck} />
      </div>
      <Card className="mt-5">
        <CardHeader><CardTitle>Today's Fabric Output</CardTitle></CardHeader>
        <CardContent><DashboardChart data={Object.values(chartData)} /></CardContent>
      </Card>
    </>
  );
}
