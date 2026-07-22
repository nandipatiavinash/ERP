import { Boxes, CalendarCheck, Factory, Package, Scale, ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/app/dashboard-chart";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, todayInIndia } from "@/lib/utils";
import { AdminDashboardView } from "./AdminDashboardView";
import { computeFifoAging } from "./helpers"; // We will create this helpers file!

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof Factory;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
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

type Params = { from?: string; to?: string };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requirePermission("dashboard.view");
  const supabase = await createClient();
  
  const resolvedParams = await searchParams;
  const from = resolvedParams.from || todayInIndia();
  const to = resolvedParams.to || todayInIndia();

  const isAdmin = user.roles?.name === "admin";

  if (!isAdmin) {
    // -------------------------------------------------------------
    // Operator/Default Daily Snapshot (original dashboard logic)
    // -------------------------------------------------------------
    const today = todayInIndia();
    const [{ data: summaryData }, { data: chartRows }] = await Promise.all([
      (supabase as any).rpc("get_dashboard_summary", { p_entry_date: today }),
      (supabase as any).rpc("get_daily_fabric_output", { p_entry_date: today }),
    ]);

    const summary = ((summaryData ?? []) as any[])[0] ?? {};
    const productionEntries = Number(summary.production_entries ?? 0);
    const todayWeight = Number(summary.total_weight ?? 0);
    const todayMeters = Number(summary.total_meters ?? 0);
    const availableRolls = Number(summary.available_rolls ?? 0);
    const materialStock = Number(summary.material_stock ?? 0);
    const presentEmployees = Number(summary.present_employees ?? 0);
    const chartData = ((chartRows ?? []) as any[]).map((row) => ({
      name: row.name,
      meters: Number(row.meters ?? 0),
      weight: Number(row.weight ?? 0)
    }));

    return (
      <>
        <PageHeader title="Dashboard" description="Daily production, inventory, HR, and sales snapshot." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Today's Production" value={`${productionEntries} entries`} icon={Factory} />
          <StatCard title="Total Rolls Today" value={String(productionEntries)} icon={Package} />
          <StatCard title="Weight Today" value={`${formatNumber(todayWeight, 2)} kg`} icon={Scale} />
          <StatCard title="Meters Today" value={`${formatNumber(todayMeters, 2)} m`} icon={ScrollText} />
          <StatCard title="Available Fabric Stock" value={`${availableRolls} rolls`} icon={Package} />
          <StatCard title="Raw Material Stock" value={formatNumber(materialStock, 2)} icon={Boxes} />
          <StatCard title="Employees Present" value={String(presentEmployees)} icon={CalendarCheck} />
        </div>
        <Card className="mt-5">
          <CardHeader><CardTitle>Today's Fabric Output</CardTitle></CardHeader>
          <CardContent><DashboardChart data={chartData} /></CardContent>
        </Card>
      </>
    );
  }

  // -------------------------------------------------------------
  // Admin Dashboard (with Date Filters, Summaries, Aging, Wastage)
  // -------------------------------------------------------------
  const [
    rawConsumptions,
    loomEntries,
    rotoFilm,
    rotoMetallic,
    lamRolls,
    offsetRolls,
    finBundles,
    tapeEntries,
    loomShifts,
    elecEntries,
    journalEntries,
    salesOrders,
    rotoProducts,
    finishingProducts,
  ] = await Promise.all([
    supabase
      .from("raw_material_consumptions")
      .select("quantity, consumption_date, department")
      .gte("consumption_date", from)
      .lte("consumption_date", to)
      .is("deleted_at", null),
    supabase
      .from("loom_production_entries")
      .select("net_weight, net_meters, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_film_rolls")
      .select("weight_kg, meters, entry_date, roto_product_id")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_metallic_rolls")
      .select("weight_kg, meters, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("lamination_rolls")
      .select("weight_kg, meters, entry_date, roll_id")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("offset_rolls")
      .select("weight_kg, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("finishing_bundles")
      .select("weight_kg, num_bags, entry_date, product_id")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("tape_line_entries")
      .select("loads, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("loom_shift_meters")
      .select("day_shift_meters, night_shift_meters, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("electricity_units_entries")
      .select("units, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("accounts_journal")
      .select("account_name, entry_type, amount, entry_date")
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("sales_orders")
      .select(`
        id,
        order_date,
        status,
        bill_number,
        sales_order_items(id, department, quantity, selected_roll_ids)
      `)
      .gte("order_date", from)
      .lte("order_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_products")
      .select("id, brand"),
    supabase
      .from("finishing_products")
      .select("id, name, dimensions, roto_product_id"),
  ] as any[]);

  // 1. Department summaries calculations
  const rawConsMap = (rawConsumptions.data ?? []) as any[];
  const getRawDeptCons = (dept: string) =>
    rawConsMap.filter((c) => c.department === dept).reduce((sum, c) => sum + Number(c.quantity || 0), 0);

  const fabricProdKgs = ((loomEntries.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.net_weight || 0), 0);
  const fabricProdMtrs = ((loomEntries.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.net_meters || 0), 0);
  const fabricConsKgs = getRawDeptCons("fabric");

  const rotoProdKgs =
    ((rotoFilm.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.weight_kg || 0), 0) +
    ((rotoMetallic.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.weight_kg || 0), 0);
  const rotoProdMtrs = ((rotoFilm.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.meters || 0), 0);
  const rotoConsKgs = getRawDeptCons("roto-printing");

  const lamProdKgs = ((lamRolls.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.weight_kg || 0), 0);
  const lamProdMtrs = ((lamRolls.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.meters || 0), 0);
  const lamConsKgs = getRawDeptCons("lamination");

  const offsetProdKgs = ((offsetRolls.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.weight_kg || 0), 0);
  const offsetConsKgs = getRawDeptCons("offset-printing");

  const finishingProdKgs = ((finBundles.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.weight_kg || 0), 0);
  const finishingProdBags = ((finBundles.data ?? []) as any[]).reduce((sum, e) => sum + Number(e.num_bags || 0), 0);
  const finishingConsKgs = getRawDeptCons("finishing");

  // 2. Expandable Daily breakdown mappings
  const dailyDates = Array.from(
    new Set([
      ...((tapeEntries.data ?? []) as any[]).map((e) => e.entry_date),
      ...((loomShifts.data ?? []) as any[]).map((e) => e.entry_date),
      ...((loomEntries.data ?? []) as any[]).map((e) => e.entry_date),
      ...((elecEntries.data ?? []) as any[]).map((e) => e.entry_date),
    ])
  ).sort((a, b) => b.localeCompare(a)); // Descending chronological

  const dailyEntries = dailyDates.map((date) => {
    const tapeLoads = ((tapeEntries.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.loads || 0), 0);

    const loomMetersDay = ((loomShifts.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.day_shift_meters || 0), 0);

    const loomMetersNight = ((loomShifts.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.night_shift_meters || 0), 0);

    const fabricProducedMtrs = ((loomEntries.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.net_meters || 0), 0);

    const electricityUnits = ((elecEntries.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.units || 0), 0);

    return {
      date,
      tapeLoads,
      loomMetersDay,
      loomMetersNight,
      fabricProducedMtrs,
      electricityUnits,
    };
  });

  // 3. Receivables & Payables FIFO aging
  const journalRows = (journalEntries.data ?? []) as any[];
  const receivables = computeFifoAging(journalRows, "receivable", to);
  const payables = computeFifoAging(journalRows, "payable", to);

  // 4. Orders Volume Summary
  let receivedKg = 0;
  let receivedBags = 0;
  let deliveredKg = 0;
  let deliveredBags = 0;
  let pendingKg = 0;
  let pendingBags = 0;

  ((salesOrders.data ?? []) as any[]).forEach((order) => {
    const isDelivered = order.status === "delivered" || !!order.bill_number;
    const isPending = !isDelivered;

    (order.sales_order_items ?? []).forEach((item: any) => {
      const qty = Number(item.quantity || 0);
      const isFinishing = item.department === "finishing";
      
      // Received
      if (isFinishing) receivedBags += qty;
      else receivedKg += qty;

      // Split delivered vs pending
      if (isDelivered) {
        if (isFinishing) deliveredBags += qty;
        else deliveredKg += qty;
      } else {
        if (isFinishing) pendingBags += qty;
        else pendingKg += qty;
      }
    });
  });

  // 5. Brand Wastage Summary
  const rProducts = (rotoProducts.data ?? []) as any[];
  const fProducts = (finishingProducts.data ?? []) as any[];
  const rFilm = (rotoFilm.data ?? []) as any[];
  const lRolls = (lamRolls.data ?? []) as any[];
  const fBundles = (finBundles.data ?? []) as any[];

  const getFinishingProductHeight = (dimensionsText: string | null | undefined): number => {
    if (!dimensionsText) return 0;
    const cleaned = dimensionsText.replace(/\s+/g, "").toLowerCase();
    const match = cleaned.match(/(\d+)x(\d+)/) || cleaned.match(/(\d+)\*(\d+)/);
    if (match) return Number(match[2]);
    const singleMatch = cleaned.match(/(\d+)/);
    return singleMatch ? Number(singleMatch[1]) : 0;
  };

  const brandWastage = rProducts.map((p) => {
    const printedMeters = rFilm.filter((rf) => rf.roto_product_id === p.id).reduce((sum, rf) => sum + Number(rf.meters || 0), 0);
    
    // Lamination rolls brand matches brand name substring
    const lamRollsMatched = lRolls.filter((lr) => lr.roll_id?.toUpperCase().includes(p.brand?.toUpperCase()));
    const laminatedMeters = lamRollsMatched.reduce((sum, lr) => sum + Number(lr.meters || 0), 0);

    // Finishing bundles brand matches roto product
    const finishProdsMatching = fProducts.filter((fp) => fp.roto_product_id === p.id);
    const finishMeters = fBundles.filter((b) => finishProdsMatching.some((fp) => fp.id === b.product_id)).reduce((sum, b) => {
      const prod = finishProdsMatching.find((fp) => fp.id === b.product_id);
      const height = getFinishingProductHeight(prod?.dimensions);
      return sum + (height > 0 ? (Number(b.num_bags || 0) * height) / 1000 : 0);
    }, 0);

    return {
      brandName: p.brand,
      printedMeters,
      laminatedMeters,
      finishMeters,
    };
  }).filter((item) => item.printedMeters > 0 || item.laminatedMeters > 0 || item.finishMeters > 0);

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Date range analysis of departmental KPIs, daily resource details, FIFO aging, and order summaries." />
      <AdminDashboardView
        from={from}
        to={to}
        departmentData={{
          fabric: { productionKg: fabricProdKgs, productionMtr: fabricProdMtrs, consumptionKg: fabricConsKgs },
          roto: { productionKg: rotoProdKgs, productionMtr: rotoProdMtrs, consumptionKg: rotoConsKgs },
          lamination: { productionKg: lamProdKgs, productionMtr: lamProdMtrs, consumptionKg: lamConsKgs },
          offset: { productionKg: offsetProdKgs, consumptionKg: offsetConsKgs },
          finishing: { productionKg: finishingProdKgs, productionBags: finishingProdBags, consumptionKg: finishingConsKgs },
        }}
        dailyEntries={dailyEntries}
        receivables={receivables}
        payables={payables}
        ordersSummary={{
          received: { kg: receivedKg, bags: receivedBags },
          delivered: { kg: deliveredKg, bags: deliveredBags },
          pending: { kg: pendingKg, bags: pendingBags },
        }}
        brandWastage={brandWastage}
      />
    </>
  );
}
