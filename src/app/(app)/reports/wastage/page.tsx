import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth";
import { todayInIndia, fetchPagedData } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";
import { Info, BarChart2, AlertCircle } from "lucide-react";

type Params = { from?: string; to?: string };

function getFinishingProductHeight(dimensionsText: string | null | undefined): number {
  if (!dimensionsText) return 0;
  const cleaned = dimensionsText.replace(/\s+/g, "").toLowerCase();
  const match = cleaned.match(/(\d+)x(\d+)/) || cleaned.match(/(\d+)\*(\d+)/);
  if (match) return Number(match[2]);
  const singleMatch = cleaned.match(/(\d+)/);
  return singleMatch ? Number(singleMatch[1]) : 0;
}

export default async function WastageReportPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("reports.stock");
  const params = await searchParams;
  const from = params.from || todayInIndia();
  const to = params.to || todayInIndia();

  const supabase = await createClient();

  const [
    consumptionsRes,
    fabricRollsRes,
    rotoFilmRollsRes,
    rotoMetallicRollsRes,
    laminationRollsRes,
    offsetRollsRes,
    finishingBundlesRes,
    finishingProductsRes,
    rotoProductsRes,
    fabricTypesRes
  ] = await Promise.all([
    supabase
      .from("raw_material_consumptions")
      .select("quantity, consumption_date, department")
      .gte("consumption_date", from)
      .lte("consumption_date", to)
      .is("deleted_at", null),
    supabase
      .from("fabric_rolls")
      .select("weight, production_date, status, current_stage")
      .gte("production_date", from)
      .lte("production_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_film_rolls")
      .select("weight_kg, meters, entry_date, status, brand_id")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("roto_metallic_rolls")
      .select("weight_kg, meters, entry_date, status, source_film_roll_id")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("lamination_rolls")
      .select("weight_kg, meters, entry_date, status, fabric_roll_id, film_roll_id, fabric_rolls(weight, meters), roto_metallic_rolls(weight_kg, meters)")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("offset_rolls")
      .select("weight_kg, entry_date, status, source_fabric_roll_id, source_lam_roll_id, fabric_rolls(weight), lamination_rolls(weight_kg)")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("finishing_bundles")
      .select("weight_kg, num_bags, entry_date, status, source_lam_roll_id, source_offset_roll_id, product_id, lamination_rolls(weight_kg, meters), offset_rolls(weight_kg)")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null),
    supabase
      .from("finishing_products")
      .select("id, name, dimensions, roto_product_id"),
    supabase
      .from("roto_products")
      .select("id, brand"),
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
  ]);

  const consumptions = (consumptionsRes.data ?? []) as any[];
  const fabricRolls = (fabricRollsRes.data ?? []) as any[];
  const rotoFilmRolls = (rotoFilmRollsRes.data ?? []) as any[];
  const rotoMetallicRolls = (rotoMetallicRollsRes.data ?? []) as any[];
  const laminationRolls = (laminationRollsRes.data ?? []) as any[];
  const offsetRolls = (offsetRollsRes.data ?? []) as any[];
  const finishingBundles = (finishingBundlesRes.data ?? []) as any[];
  const finishingProducts = (finishingProductsRes.data ?? []) as any[];
  const rotoProducts = (rotoProductsRes.data ?? []) as any[];

  // 1. Department Raw Consumption Calculations
  const getConsumption = (dept: string) =>
    consumptions.filter(c => c.department === dept).reduce((sum, c) => sum + Number(c.quantity || 0), 0);

  const fabricConsumptionRaw = getConsumption("fabric");
  const rotoConsumptionRaw = getConsumption("roto-printing");
  const laminationConsumptionRaw = getConsumption("lamination");
  const offsetConsumptionRaw = getConsumption("offset-printing");
  const finishingConsumptionRaw = getConsumption("finishing");

  // 2. Production Weight Calculations
  const fabricProductionKg = fabricRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0);
  const rotoProductionKg =
    rotoFilmRolls.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0) +
    rotoMetallicRolls.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);
  
  const laminationProductionKg = laminationRolls.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);
  const offsetProductionKg = offsetRolls.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);
  const finishingProductionKg = finishingBundles.reduce((sum, r) => sum + Number(r.weight_kg || 0), 0);

  // 3. Consumed Input Weights for Lamination, Offset, Finishing
  const laminationConsumedFabricKg = laminationRolls.reduce((sum, r) => {
    return sum + Number((r.fabric_rolls as any)?.weight || 0);
  }, 0);
  const laminationConsumedFilmKg = laminationRolls.reduce((sum, r) => {
    return sum + Number((r.roto_metallic_rolls as any)?.weight_kg || 0);
  }, 0);
  
  const laminationTotalConsumptionKg = laminationConsumptionRaw + laminationConsumedFabricKg + laminationConsumedFilmKg;

  const offsetConsumedFabricKg = offsetRolls.reduce((sum, r) => {
    return sum + Number((r.fabric_rolls as any)?.weight || 0);
  }, 0);
  const offsetConsumedLamKg = offsetRolls.reduce((sum, r) => {
    return sum + Number((r.lamination_rolls as any)?.weight_kg || 0);
  }, 0);
  
  const offsetTotalConsumptionKg = offsetConsumptionRaw + offsetConsumedFabricKg + offsetConsumedLamKg;

  const finishingConsumedLamKg = finishingBundles.reduce((sum, r) => {
    return sum + Number((r.lamination_rolls as any)?.weight_kg || 0);
  }, 0);
  const finishingConsumedOffsetKg = finishingBundles.reduce((sum, r) => {
    return sum + Number((r.offset_rolls as any)?.weight_kg || 0);
  }, 0);
  
  const finishingTotalConsumptionKg = finishingConsumptionRaw + finishingConsumedLamKg + finishingConsumedOffsetKg;

  // 4. Meters calculations for Lamination
  const laminationFabricMetersConsumed = laminationRolls.reduce((sum, r) => {
    return sum + Number((r.fabric_rolls as any)?.meters || 0);
  }, 0);
  const laminationFabricMetersProduced = laminationRolls.reduce((sum, r) => {
    return sum + Number(r.meters || 0);
  }, 0);

  const laminationRotoMetersConsumed = laminationRolls.reduce((sum, r) => {
    return sum + Number((r.roto_metallic_rolls as any)?.meters || 0);
  }, 0);
  const laminationRotoMetersProduced = laminationRolls.reduce((sum, r) => {
    return sum + Number(r.meters || 0);
  }, 0);

  // 5. Meters calculations for Finishing
  const finishingLamMetersConsumed = finishingBundles.reduce((sum, r) => {
    return sum + Number((r.lamination_rolls as any)?.meters || 0);
  }, 0);
  const finishingProducedMeters = finishingBundles.reduce((sum, r) => {
    const prod = finishingProducts.find(p => p.id === r.product_id);
    const height = getFinishingProductHeight(prod?.dimensions);
    const calculatedMeters = height > 0 ? (Number(r.num_bags || 0) * height) / 1000 : 0;
    return sum + calculatedMeters;
  }, 0);

  // Department Summaries helper
  const depts = [
    {
      name: "Fabric",
      consumption: fabricConsumptionRaw,
      production: fabricProductionKg,
      unit: "kg",
    },
    {
      name: "Roto Printing",
      consumption: rotoConsumptionRaw,
      production: rotoProductionKg,
      unit: "kg",
    },
    {
      name: "Lamination",
      consumption: laminationTotalConsumptionKg,
      production: laminationProductionKg,
      unit: "kg",
      extra: [
        { label: "Raw Consumed", value: `${formatNumber(laminationConsumptionRaw, 1)} kg` },
        { label: "Fabric Consumed", value: `${formatNumber(laminationConsumedFabricKg, 1)} kg` },
        { label: "Film/Metallic Consumed", value: `${formatNumber(laminationConsumedFilmKg, 1)} kg` },
        { label: "Fabric Meters Consumed", value: `${formatNumber(laminationFabricMetersConsumed, 1)} m` },
        { label: "Fabric Meters Produced", value: `${formatNumber(laminationFabricMetersProduced, 1)} m` },
        { label: "Roto Meters Consumed", value: `${formatNumber(laminationRotoMetersConsumed, 1)} m` },
        { label: "Roto Meters Produced", value: `${formatNumber(laminationRotoMetersProduced, 1)} m` },
      ],
    },
    {
      name: "Offset Printing",
      consumption: offsetTotalConsumptionKg,
      production: offsetProductionKg,
      unit: "kg",
      extra: [
        { label: "Raw Consumed", value: `${formatNumber(offsetConsumptionRaw, 1)} kg` },
        { label: "Fabric Consumed", value: `${formatNumber(offsetConsumedFabricKg, 1)} kg` },
        { label: "Lamination Consumed", value: `${formatNumber(offsetConsumedLamKg, 1)} kg` },
      ],
    },
    {
      name: "Finishing",
      consumption: finishingTotalConsumptionKg,
      production: finishingProductionKg,
      unit: "kg",
      extra: [
        { label: "Raw Consumed", value: `${formatNumber(finishingConsumptionRaw, 1)} kg` },
        { label: "Lamination Consumed", value: `${formatNumber(finishingConsumedLamKg, 1)} kg` },
        { label: "Offset Consumed", value: `${formatNumber(finishingConsumedOffsetKg, 1)} kg` },
        { label: "Lamination Meters Consumed", value: `${formatNumber(finishingLamMetersConsumed, 1)} m` },
        { label: "Finishing Meters Produced", value: `${formatNumber(finishingProducedMeters, 1)} m` },
      ],
    },
  ];

  // Wastage Color Helper
  const getWastageBadgeClass = (pct: number) => {
    if (pct < 5) return "bg-emerald-100 text-emerald-800";
    if (pct < 10) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800 font-bold";
  };

  // 6. Roto Product ID Sub-report Mappings
  const subReportItems = rotoProducts.map((p) => {
    // Roto Printed Meters
    const printedMeters = rotoFilmRolls.filter(r => (r.brand_id || r.roto_product_id) === p.id).reduce((sum, r) => sum + Number(r.meters || 0), 0);

    // Lamination Meters (Look at lamination rolls linked to metallic rolls or fabric roll names matching roto_film_rolls)
    // For simplicity, find lamination rolls with matching brand roll_id substring
    const lamRollsMatched = laminationRolls.filter(r => (r as any).roll_id?.toUpperCase().includes(p.brand?.toUpperCase()));
    const laminatedMeters = lamRollsMatched.reduce((sum, r) => sum + Number(r.meters || 0), 0);

    // Finishing Produced Meters
    // Find finishing products matching this roto product
    const finishProdsMatching = finishingProducts.filter(fp => fp.roto_product_id === p.id);
    const finishMeters = finishingBundles.filter(b => finishProdsMatching.some(fp => fp.id === b.product_id)).reduce((sum, b) => {
      const prod = finishProdsMatching.find(fp => fp.id === b.product_id);
      const height = getFinishingProductHeight(prod?.dimensions);
      return sum + (height > 0 ? (Number(b.num_bags || 0) * height) / 1000 : 0);
    }, 0);

    return {
      productId: p.id,
      brandName: p.brand,
      printedMeters,
      laminatedMeters,
      finishMeters,
      rotoVsLamDiff: printedMeters - laminatedMeters,
      lamVsFinishDiff: laminatedMeters - finishMeters,
    };
  }).filter(item => item.printedMeters > 0 || item.laminatedMeters > 0 || item.finishMeters > 0);

  return (
    <>
      <PageHeader
        title="Wastage Analysis Report"
        description="Monitor multi-department production wastage in KGs and film running meters."
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-550" />
          <h2 className="text-sm font-bold text-slate-800">Select Date Range</h2>
        </div>
        <DateRangeFilter from={from} to={to} baseUrl="/reports/wastage" />
      </div>

      {/* Department wastage cards */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departmental Waste Summaries</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {depts.map((dept) => {
            const wasteVal = Math.max(0, dept.consumption - dept.production);
            const wastePct = dept.consumption > 0 ? (wasteVal / dept.consumption) * 100 : 0;
            return (
              <Card key={dept.name} className="border-slate-200 shadow-xs bg-white">
                <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between py-3.5">
                  <CardTitle className="text-sm font-bold text-slate-850">{dept.name}</CardTitle>
                  <Badge className={`px-2 py-0.5 text-[10px] font-black border-0 ${getWastageBadgeClass(wastePct)}`}>
                    {formatNumber(wastePct, 1)}% WASTE
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Consumption</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {formatNumber(dept.consumption, 1)} {dept.unit}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Production</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {formatNumber(dept.production, 1)} {dept.unit}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase text-red-500">Wastage</span>
                      <span className="font-mono font-bold text-red-650 text-sm">
                        {formatNumber(wasteVal, 1)} {dept.unit}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          wastePct < 5 ? "bg-emerald-500" : wastePct < 10 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, wastePct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Department specific sub metrics */}
                  {dept.extra && (
                    <div className="bg-slate-50 rounded-lg p-3 text-[11px] space-y-2 border">
                      <div className="font-bold text-slate-500 uppercase tracking-wide text-[9px]">Additional Department Metrics</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        {dept.extra.map((ex) => (
                          <div key={ex.label} className="flex justify-between border-b border-slate-200/50 pb-0.5 last:border-0">
                            <span className="text-slate-500">{ex.label}:</span>
                            <span className="font-mono font-bold">{ex.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Roto Product ID Sub-report */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Info className="h-5 w-5 text-slate-650" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Roto Brand Printing vs Lamination vs Finishing Meters</h3>
        </div>
        {subReportItems.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center text-slate-400 text-xs font-semibold">
            No printing activity found in the selected date range.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="font-bold text-slate-700">Brand Name</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Printed (m)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Laminated (m)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Lamination Diff (m)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Finished Bags (m)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right pr-4">Finishing Diff (m)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subReportItems.map((item) => (
                  <TableRow key={item.productId} className="hover:bg-slate-50/50 border-b last:border-0">
                    <TableCell className="font-bold text-slate-800 text-xs">{item.brandName}</TableCell>
                    <TableCell className="text-right font-mono font-medium text-xs">{formatNumber(item.printedMeters, 1)} m</TableCell>
                    <TableCell className="text-right font-mono font-medium text-xs">{formatNumber(item.laminatedMeters, 1)} m</TableCell>
                    <TableCell className={`text-right font-mono font-bold text-xs ${item.rotoVsLamDiff > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {formatNumber(item.rotoVsLamDiff, 1)} m
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-xs">{formatNumber(item.finishMeters, 1)} m</TableCell>
                    <TableCell className={`text-right font-mono font-bold text-xs pr-4 ${item.lamVsFinishDiff > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {formatNumber(item.lamVsFinishDiff, 1)} m
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
