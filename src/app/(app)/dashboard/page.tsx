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
    consumedFabricLamination,
    consumedMetallicLamination,
    consumedFilmPlainLamination,
    dailyWaste,
    rawPurchases,
    customersList,
    materialSalesList,
    loomsList,
    operatorStatusList,
    availFabricRolls,
    availRotoFilmRolls,
    availLaminationRolls,
    fabricTypesRes,
    loomRunningRes
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
      .select("weight_kg, meters, entry_date, brand_id")
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
      .select("id, tape_type, loads, entry_date")
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
      .select("account_id, account_name, entry_type, amount, entry_date")
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("sales_orders")
      .select(`
        id,
        order_date,
        status,
        bill_number,
        sales_order_items(id, department, quantity, selected_roll_ids, product_id)
      `)
      .gte("order_date", from)
      .lte("order_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_products")
      .select("id, brand"),
    supabase
      .from("finishing_products")
      .select("id, name, dimensions, roto_product_id, lamination_type, offset_type, is_metallic"),
    supabase
      .from("fabric_rolls")
      .select("weight, updated_at")
      .eq("status", "consumed")
      .in("current_stage", ["lamination", "lamination_consumption"])
      .gte("updated_at", `${from}T00:00:00+05:30`)
      .lte("updated_at", `${to}T23:59:59.999+05:30`)
      .is("deleted_at", null),
    supabase
      .from("roto_metallic_rolls")
      .select("weight_kg, updated_at")
      .eq("status", "consumed")
      .gte("updated_at", `${from}T00:00:00+05:30`)
      .lte("updated_at", `${to}T23:59:59.999+05:30`)
      .is("deleted_at", null),
    supabase
      .from("roto_film_rolls")
      .select("weight_kg, updated_at")
      .eq("status", "consumed")
      .gte("updated_at", `${from}T00:00:00+05:30`)
      .lte("updated_at", `${to}T23:59:59.999+05:30`)
      .is("deleted_at", null),
    supabase
      .from("daily_waste_entries")
      .select("plant_waste, bobon_waste, loom_waste, pipe_cutting_waste, entry_date")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("raw_material_purchases")
      .select("quantity, total_amount, purchase_date")
      .gte("purchase_date", from)
      .lte("purchase_date", to)
      .is("deleted_at", null),
    supabase
      .from("customers")
      .select("id, customer_name, is_internal, opening_debit, opening_credit")
      .eq("status", "active")
      .is("deleted_at", null),
    supabase
      .from("material_sales")
      .select("quantity, type, sale_date")
      .gte("sale_date", from)
      .lte("sale_date", to)
      .is("deleted_at", null),
    supabase
      .from("looms")
      .select("id, loom_number")
      .eq("status", "active")
      .is("deleted_at", null),
    supabase
      .from("operator_dashboard_status")
      .select("sales_order_item_id, department, is_closed")
      .eq("is_closed", true),
    supabase
      .from("fabric_rolls")
      .select("fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null),
    supabase
      .from("roto_film_rolls")
      .select("brand_id")
      .eq("status", "available")
      .is("deleted_at", null),
    supabase
      .from("lamination_rolls")
      .select("product_id")
      .eq("status", "available")
      .is("deleted_at", null),
    supabase
      .from("fabric_types")
      .select("id, fabric_name"),
    supabase
      .from("loom_production_entries")
      .select("loom_id, fabric_type_id, entry_date, created_at")
      .lte("entry_date", to)
      .is("deleted_at", null)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false })
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
  
  const lamConsKgs =
    getRawDeptCons("lamination") +
    ((consumedFabricLamination.data ?? []) as any[]).reduce((sum, r) => sum + Number(r.weight || 0), 0) +
    ((consumedMetallicLamination.data ?? []) as any[]).reduce((sum, r) => sum + Number(r.weight_kg || 0), 0) +
    ((consumedFilmPlainLamination.data ?? []) as any[]).reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);

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
      ...((dailyWaste.data ?? []) as any[]).map((e) => e.entry_date),
    ])
  ).filter(Boolean).sort((a, b) => (b || "").localeCompare(a || ""));

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

    const plantWaste = ((dailyWaste.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.plant_waste || 0), 0);

    const bobonWaste = ((dailyWaste.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.bobon_waste || 0), 0);

    const loomWaste = ((dailyWaste.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.loom_waste || 0), 0);

    const pipeCuttingWaste = ((dailyWaste.data ?? []) as any[])
      .filter((e) => e.entry_date === date)
      .reduce((sum, e) => sum + Number(e.pipe_cutting_waste || 0), 0);

    return {
      date,
      tapeLoads,
      loomMetersDay,
      loomMetersNight,
      fabricProducedMtrs,
      electricityUnits,
      plantWaste,
      bobonWaste,
      loomWaste,
      pipeCuttingWaste,
    };
  });

  // 3. Receivables & Payables FIFO aging
  const journalRows = (journalEntries.data ?? []) as any[];
  const receivables = computeFifoAging(journalRows, "receivable", to);
  const payables = computeFifoAging(journalRows, "payable", to);

  // 4. Client/Reference Account Filtered Receivables & Payables
  const customers = (customersList.data ?? []) as any[];
  const allowedCustomers = customers.filter(
    (c) => !c.is_internal || c.is_internal === "client a/c" || c.is_internal === "reference a/c"
  );
  const allowedCustomerIds = new Set(allowedCustomers.map((c) => c.id));
  const allowedCustomerNames = new Set(allowedCustomers.map((c) => (c.customer_name || "").toLowerCase().trim()));

  const clientBalances: Record<string, number> = {};
  allowedCustomers.forEach((c) => {
    clientBalances[c.id] = Number(c.opening_debit ?? 0) - Number(c.opening_credit ?? 0);
  });

  (journalEntries.data ?? []).forEach((entry: any) => {
    if (entry.entry_date <= to) {
      let matchedCustId = entry.account_id;
      if (!matchedCustId && entry.account_name) {
        const match = allowedCustomers.find(
          (c) => (c.customer_name || "").toLowerCase().trim() === (entry.account_name || "").toLowerCase().trim()
        );
        if (match) matchedCustId = match.id;
      }
      if (matchedCustId && clientBalances[matchedCustId] !== undefined) {
        const amt = Number(entry.amount || 0);
        if (entry.entry_type === "debit") {
          clientBalances[matchedCustId] += amt;
        } else {
          clientBalances[matchedCustId] -= amt;
        }
      }
    }
  });

  let totalReceivables = 0;
  let totalPayables = 0;
  Object.values(clientBalances).forEach((bal) => {
    if (bal > 0.01) {
      totalReceivables += bal;
    } else if (bal < -0.01) {
      totalPayables += Math.abs(bal);
    }
  });

  const filteredReceivables = receivables.filter((r) =>
    allowedCustomerNames.has((r.accountName || "").toLowerCase().trim())
  );
  const filteredPayables = payables.filter((p) =>
    allowedCustomerNames.has((p.accountName || "").toLowerCase().trim())
  );

  // 5. Orders Volume Summary
  let receivedKg = 0;
  let receivedBags = 0;
  let deliveredKg = 0;
  let deliveredBags = 0;
  let pendingKg = 0;
  let pendingBags = 0;

  const deliveredOrders = ((salesOrders.data ?? []) as any[]).filter(
    (o) => o.status === "delivered" || !!o.bill_number
  );
  const fabricRollIds: string[] = [];
  const rotoFilmIds: string[] = [];
  const rotoMetallicIds: string[] = [];
  const lamRollIds: string[] = [];
  const offsetRollIds: string[] = [];
  const finishingBundleIds: string[] = [];

  ((salesOrders.data ?? []) as any[]).forEach((order) => {
    const isDelivered = order.status === "delivered" || !!order.bill_number;
    const isPending = !isDelivered;

    (order.sales_order_items ?? []).forEach((item: any) => {
      const qty = Number(item.quantity || 0);
      const isFinishing = item.department === "finishing";
      const ids = item.selected_roll_ids || [];
      
      // Received
      if (isFinishing) receivedBags += qty;
      else receivedKg += qty;

      // Split delivered vs pending
      if (isDelivered) {
        if (isFinishing) {
          deliveredBags += qty;
          finishingBundleIds.push(...ids);
        } else {
          deliveredKg += qty;
          if (item.department === "fabric") fabricRollIds.push(...ids);
          else if (item.department === "roto-printing") rotoFilmIds.push(...ids);
          else if (item.department === "lamination") lamRollIds.push(...ids);
          else if (item.department === "offset-printing") offsetRollIds.push(...ids);
        }
      } else {
        if (isFinishing) pendingBags += qty;
        else pendingKg += qty;
      }
    });
  });

  // Calculate actual delivered weights of all departments
  const [
    deliveredFabWeightRes,
    deliveredRotoFilmWeightRes,
    deliveredRotoMetallicWeightRes,
    deliveredLamWeightRes,
    deliveredOffsetWeightRes,
    deliveredFinishingWeightRes
  ] = await Promise.all([
    fabricRollIds.length > 0 ? supabase.from("fabric_rolls").select("id, weight").in("id", fabricRollIds) : Promise.resolve({ data: [] }),
    rotoFilmIds.length > 0 ? supabase.from("roto_film_rolls").select("id, weight_kg").in("id", rotoFilmIds) : Promise.resolve({ data: [] }),
    rotoFilmIds.length > 0 ? supabase.from("roto_metallic_rolls").select("id, weight_kg").in("id", rotoFilmIds) : Promise.resolve({ data: [] }),
    lamRollIds.length > 0 ? supabase.from("lamination_rolls").select("id, weight_kg").in("id", lamRollIds) : Promise.resolve({ data: [] }),
    offsetRollIds.length > 0 ? supabase.from("offset_rolls").select("id, weight_kg").in("id", offsetRollIds) : Promise.resolve({ data: [] }),
    finishingBundleIds.length > 0 ? supabase.from("finishing_bundles").select("id, weight_kg").in("id", finishingBundleIds) : Promise.resolve({ data: [] }),
  ]);

  const totalSalesKgs =
    ((deliveredFabWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight || 0), 0) +
    ((deliveredRotoFilmWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight_kg || 0), 0) +
    ((deliveredRotoMetallicWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight_kg || 0), 0) +
    ((deliveredLamWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight_kg || 0), 0) +
    ((deliveredOffsetWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight_kg || 0), 0) +
    ((deliveredFinishingWeightRes.data ?? []) as any[]).reduce((sum: number, r: any) => sum + Number(r.weight_kg || 0), 0);

  const finalSalesKgs = totalSalesKgs > 0 ? totalSalesKgs : deliveredKg;
  const totalPurchasesKgs = ((rawPurchases.data ?? []) as any[]).reduce((sum: number, p: any) => sum + Number(p.quantity || 0), 0);

  // 6. Bags Sold Breakdown
  let metallicBags = 0;
  let boxBags = 0;
  let fsBags = 0;
  let hsBags = 0;
  let nwBags = 0;
  let offsetBags = 0;
  let plainBags = 0;
  let otherBags = 0;

  const fProds = (finishingProducts.data ?? []) as any[];

  deliveredOrders.forEach((order) => {
    (order.sales_order_items ?? []).forEach((item: any) => {
      if (item.department === "finishing") {
        const qty = Number(item.quantity || 0);
        const prod = fProds.find((p) => p.id === item.product_id);
        if (prod) {
          if (prod.is_metallic) {
            metallicBags += qty;
          } else if (prod.lamination_type === "BOX") {
            boxBags += qty;
          } else if (prod.lamination_type === "F_S") {
            fsBags += qty;
          } else if (prod.lamination_type === "H_S") {
            hsBags += qty;
          } else if (prod.lamination_type === "NW") {
            nwBags += qty;
          } else if (prod.offset_type && prod.offset_type !== "none") {
            offsetBags += qty;
          } else if (prod.lamination_type === "PLAIN") {
            plainBags += qty;
          } else {
            plainBags += qty;
          }
        } else {
          otherBags += qty;
        }
      }
    });
  });

  // 7. Waste & Raw Material Sold
  let totalWasteSoldKgs = 0;
  let totalRawMaterialSoldKgs = 0;

  (materialSalesList.data ?? []).forEach((sale: any) => {
    if (sale.type === "waste") {
      totalWasteSoldKgs += Number(sale.quantity || 0);
    } else if (sale.type === "raw_material") {
      totalRawMaterialSoldKgs += Number(sale.quantity || 0);
    }
  });

  // 8. Loom Running Fabric Tracker
  const looms = (loomsList.data ?? []) as any[];
  const fabrics = (fabricTypesRes.data ?? []) as any[];
  const runningProds = (loomRunningRes.data ?? []) as any[];

  const latestLoomProdMap: Record<string, any> = {};
  runningProds.forEach((entry: any) => {
    if (!latestLoomProdMap[entry.loom_id]) {
      latestLoomProdMap[entry.loom_id] = entry;
    }
  });

  const loomRunningFabrics = looms.map((l) => {
    const latest = latestLoomProdMap[l.id];
    const fabricName = fabrics.find((f) => f.id === latest?.fabric_type_id)?.fabric_name || "NOT RUNNING / NONE";
    return {
      loomId: l.id,
      loomNumber: l.loom_number,
      fabricName: fabricName,
      entryDate: latest?.entry_date || null
    };
  }).sort((a, b) => (a.loomNumber || "").localeCompare(b.loomNumber || ""));

  // 9. Department Sub-Dashboards (Single Day: 'to' date)
  const singleDayTapeEntries = (tapeEntries.data ?? []).filter((e: any) => e.entry_date === to);
  const singleDayElectricity = (elecEntries.data ?? []).filter((e: any) => e.entry_date === to).reduce((sum: number, e: any) => sum + Number(e.units || 0), 0);
  const singleDayLoomMeters = (loomShifts.data ?? []).filter((e: any) => e.entry_date === to);
  const singleDayWaste = (dailyWaste.data ?? []).filter((e: any) => e.entry_date === to);

  // Active (not closed) order items for roto, lamination, offset
  const closedItemIds = new Set<string>((operatorStatusList.data ?? []).map((s: any) => s.sales_order_item_id as string));

  // We query all confirmed orders (not only range limited, to capture outstanding orders)
  const { data: allActiveConfirmedOrders } = await supabase
    .from("sales_orders")
    .select(`
      id,
      order_number,
      order_date,
      status,
      customers(customer_name, alias),
      sales_order_items(
        id,
        department,
        quantity,
        product_id,
        fabric_type_id,
        selected_roll_ids
      )
    `)
    .eq("status", "confirmed")
    .is("deleted_at", null);

  const activeOrders = (allActiveConfirmedOrders ?? []) as any[];

  // Stock availability maps
  const hasFabricStockArr = Array.from(new Set((availFabricRolls.data ?? []).map((r: any) => r.fabric_type_id).filter(Boolean)));
  const hasRotoStockArr = Array.from(new Set((availRotoFilmRolls.data ?? []).map((r: any) => r.brand_id || r.roto_product_id).filter(Boolean)));
  const hasLaminationStockArr = Array.from(new Set((availLaminationRolls.data ?? []).map((r: any) => r.product_id).filter(Boolean)));

  // 10. Brand Wastage Summary
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
    const printedMeters = rFilm.filter((rf) => (rf.brand_id || rf.roto_product_id) === p.id).reduce((sum: number, rf: any) => sum + Number(rf.meters || 0), 0);
    const lamRollsMatched = p.brand ? lRolls.filter((lr) => (lr.roll_id || "").toUpperCase().includes((p.brand || "").toUpperCase())) : [];
    const laminatedMeters = lamRollsMatched.reduce((sum: number, lr: any) => sum + Number(lr.meters || 0), 0);

    const finishProdsMatching = fProducts.filter((fp) => fp.roto_product_id === p.id);
    const finishMeters = fBundles.filter((b) => finishProdsMatching.some((fp) => fp.id === b.product_id)).reduce((sum: number, b: any) => {
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
        receivables={filteredReceivables}
        payables={filteredPayables}
        ordersSummary={{
          received: { kg: receivedKg, bags: receivedBags },
          delivered: { kg: deliveredKg, bags: deliveredBags },
          pending: { kg: pendingKg, bags: pendingBags },
        }}
        brandWastage={brandWastage}
        totalSalesKgs={finalSalesKgs}
        totalPurchasesKgs={totalPurchasesKgs}
        wasteSoldKgs={totalWasteSoldKgs}
        rawMaterialSoldKgs={totalRawMaterialSoldKgs}
        receivablesTotal={totalReceivables}
        payablesTotal={totalPayables}
        bagsSoldBreakdown={{
          metallic: metallicBags,
          box: boxBags,
          fs: fsBags,
          hs: hsBags,
          nw: nwBags,
          offset: offsetBags,
          plain: plainBags,
          other: otherBags
        }}
        loomRunningFabrics={loomRunningFabrics}
        fabricDashboardData={{
          tapeEntries: singleDayTapeEntries,
          electricityUnits: singleDayElectricity,
          loomShiftMeters: singleDayLoomMeters,
          dailyWaste: singleDayWaste
        }}
        activeOrders={activeOrders}
        closedItemIds={closedItemIds}
        stockCheck={{
          fabricStockIds: hasFabricStockArr as string[],
          rotoStockIds: hasRotoStockArr as string[],
          laminationStockIds: hasLaminationStockArr as string[]
        }}
        rotoProducts={rProducts}
        finishingProducts={fProds}
      />
    </>
  );
}
