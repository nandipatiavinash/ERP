"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";
import {
  Factory,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Scale,
  ScrollText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
  ShoppingBag
} from "lucide-react";

interface AdminDashboardViewProps {
  from: string;
  to: string;
  departmentData: {
    fabric: { productionKg: number; productionMtr: number; consumptionKg: number };
    roto: { productionKg: number; productionMtr: number; consumptionKg: number };
    lamination: { productionKg: number; productionMtr: number; consumptionKg: number };
    offset: { productionKg: number; consumptionKg: number };
    finishing: { productionKg: number; productionBags: number; consumptionKg: number };
  };
  dailyEntries: Array<{
    date: string;
    tapeLoads: number;
    loomMetersDay: number;
    loomMetersNight: number;
    fabricProducedMtrs: number;
    electricityUnits: number;
    plantWaste: number;
    bobonWaste: number;
    loomWaste: number;
    pipeCuttingWaste: number;
  }>;
  receivables: Array<{ accountName: string; balance: number; maxDays: number }>;
  payables: Array<{ accountName: string; balance: number; maxDays: number }>;
  ordersSummary: {
    received: { kg: number; bags: number };
    delivered: { kg: number; bags: number };
    pending: { kg: number; bags: number };
  };
  brandWastage: Array<{
    brandName: string;
    printedMeters: number;
    laminatedMeters: number;
    finishMeters: number;
  }>;
}

export function AdminDashboardView({
  from,
  to,
  departmentData,
  dailyEntries,
  receivables,
  payables,
  ordersSummary,
  brandWastage,
}: AdminDashboardViewProps) {
  const [expandFabricDaily, setExpandFabricDaily] = useState(false);

  const totals = useMemo(() => {
    return dailyEntries.reduce(
      (acc, curr) => {
        acc.tapeLoads += Number(curr.tapeLoads || 0);
        acc.loomMetersDay += Number(curr.loomMetersDay || 0);
        acc.loomMetersNight += Number(curr.loomMetersNight || 0);
        acc.fabricProducedMtrs += Number(curr.fabricProducedMtrs || 0);
        acc.electricityUnits += Number(curr.electricityUnits || 0);
        acc.plantWaste += Number(curr.plantWaste || 0);
        acc.bobonWaste += Number(curr.bobonWaste || 0);
        acc.loomWaste += Number(curr.loomWaste || 0);
        acc.pipeCuttingWaste += Number(curr.pipeCuttingWaste || 0);
        return acc;
      },
      {
        tapeLoads: 0,
        loomMetersDay: 0,
        loomMetersNight: 0,
        fabricProducedMtrs: 0,
        electricityUnits: 0,
        plantWaste: 0,
        bobonWaste: 0,
        loomWaste: 0,
        pipeCuttingWaste: 0,
      }
    );
  }, [dailyEntries]);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-800">Admin KPI Filters</h2>
        </div>
        <DateRangeFilter from={from} to={to} baseUrl="/dashboard" />
      </div>

      {/* 1. Department Summaries Card Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department Production & Consumption</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Fabric Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2">
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">1. Fabric</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (kg):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.fabric.productionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (mtr):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.fabric.productionMtr, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.fabric.consumptionKg, 1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roto Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2">
              <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest">2. Roto Printing</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (kg):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.roto.productionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (mtr):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.roto.productionMtr, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.roto.consumptionKg, 1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lamination Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2">
              <span className="text-[9px] font-black text-violet-650 uppercase tracking-widest">3. Lamination</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (kg):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.lamination.productionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (mtr):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.lamination.productionMtr, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.lamination.consumptionKg, 1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offset Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2">
              <span className="text-[9px] font-black text-emerald-650 uppercase tracking-widest">4. Off-Set</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (kg):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.offset.productionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.offset.consumptionKg, 1)}</span>
                </div>
                <div className="h-4" /> {/* Spacer to align card heights */}
              </div>
            </CardContent>
          </Card>

          {/* Finishing Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2">
              <span className="text-[9px] font-black text-rose-650 uppercase tracking-widest">5. Finishing</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Prod (kg):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.finishing.productionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bundles (bags):</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.finishing.productionBags, 0)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.finishing.consumptionKg, 1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Expandable Daily Fabric Data Breakdown */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <button
          onClick={() => setExpandFabricDaily(!expandFabricDaily)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Expandable Daily Fabric & Resources Breakdown</span>
          </div>
          {expandFabricDaily ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {expandFabricDaily && (
          <div className="border-t border-slate-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-slate-700">Date</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Tape loads (No.)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Loom Day (m)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Loom Night (m)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Fabric Produced (m)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Electricity Units</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Plant Waste (kg)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Bobon Waste (kg)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Loom Waste (kg)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right pr-4">Pipe Cutting (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-slate-400 text-xs">
                        No daily records found in selected range.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dailyEntries.map((row) => (
                      <TableRow key={row.date} className="hover:bg-slate-50/30">
                        <TableCell className="font-semibold text-slate-650 text-xs">{formatDate(row.date)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.tapeLoads, 1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.loomMetersDay, 1)} m</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.loomMetersNight, 1)} m</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.fabricProducedMtrs, 1)} m</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.electricityUnits, 1)} units</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.plantWaste, 1)} kg</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.bobonWaste, 1)} kg</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatNumber(row.loomWaste, 1)} kg</TableCell>
                        <TableCell className="text-right font-mono text-xs pr-4">{formatNumber(row.pipeCuttingWaste, 1)} kg</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {dailyEntries.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-650">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Total Sums:</span>
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Tape Loads:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.tapeLoads, 1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Loom Day:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.loomMetersDay, 1)} m</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Loom Night:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.loomMetersNight, 1)} m</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Fabric Produced:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.fabricProducedMtrs, 1)} m</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Electricity:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.electricityUnits, 1)} units</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Plant Waste:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.plantWaste, 1)} kg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Bobon Waste:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.bobonWaste, 1)} kg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Loom Waste:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.loomWaste, 1)} kg</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-slate-400">Pipe Cutting:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatNumber(totals.pipeCuttingWaste, 1)} kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Payables Credit Balance aging */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-50 py-3.5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Payables aging (Cr. Balance - Highest First)
          </CardTitle>
          <Badge className="bg-emerald-50 text-emerald-700 border-0 hover:bg-emerald-50 text-[10px] font-bold">CREDIT BALANCES</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {payables.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No supplier credit balances outstanding.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="font-bold text-slate-700 text-xs">Supplier / Account</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right text-xs">Balance (₹)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right text-xs pr-4">Days Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payables.map((p, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/30">
                    <TableCell className="font-bold text-slate-800 text-xs">{p.accountName}</TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold">₹{formatNumber(p.balance, 2)}</TableCell>
                    <TableCell className="text-right font-mono text-xs pr-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${p.maxDays > 30 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"}`}>
                        {p.maxDays} Days
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 4. Orders Summary Block */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sales Orders Volume Snapshot</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Received Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="py-3 bg-slate-50/50 flex flex-row items-center justify-between border-b">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Orders Received</span>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0 font-bold text-[9px]">INCOMING</Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total KGs:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.received.kg, 1)} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Bags:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.received.bags, 0)} Bags</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivered Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="py-3 bg-slate-50/50 flex flex-row items-center justify-between border-b">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Orders Delivered</span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 font-bold text-[9px]">COMPLETED</Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total KGs:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.delivered.kg, 1)} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Bags:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.delivered.bags, 0)} Bags</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Card */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="py-3 bg-slate-50/50 flex flex-row items-center justify-between border-b">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Orders Pending</span>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 font-bold text-[9px]">QUEUE</Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total KGs:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.pending.kg, 1)} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Bags:</span>
                <span className="font-mono font-bold text-slate-900">{formatNumber(ordersSummary.pending.bags, 0)} Bags</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Brand Wastage Summary Block */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Running Meters Wastage Analysis</h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70">
                <TableHead className="font-bold text-slate-700">Brand Name</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Roto Printed (m)</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Laminated (m)</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Finishing Output (m)</TableHead>
                <TableHead className="font-bold text-slate-700 text-right pr-4">Total Run Loss (m)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandWastage.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-450 text-xs">
                    No brand running meters logged in range.
                  </TableCell>
                </TableRow>
              ) : (
                brandWastage.map((item) => {
                  const runLoss = Math.max(0, item.printedMeters - item.finishMeters);
                  return (
                    <TableRow key={item.brandName} className="hover:bg-slate-50/30">
                      <TableCell className="font-bold text-slate-800 text-xs">{item.brandName}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatNumber(item.printedMeters, 1)} m</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatNumber(item.laminatedMeters, 1)} m</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatNumber(item.finishMeters, 1)} m</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-red-650 pr-4">
                        {formatNumber(runLoss, 1)} m
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
