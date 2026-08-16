"use client";

import { useState, useMemo, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { closeOperatorOrderItem } from "@/app/(app)/_actions";
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
  ShoppingBag,
  Zap,
  Trash2,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2
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
  totalSalesKgs: number;
  totalPurchasesKgs: number;
  wasteSoldKgs: number;
  rawMaterialSoldKgs: number;
  receivablesTotal: number;
  payablesTotal: number;
  bagsSoldBreakdown: {
    metallic: number;
    box: number;
    fs: number;
    hs: number;
    nw: number;
    offset: number;
    plain: number;
    other: number;
  };
  loomRunningFabrics: Array<{
    loomId: string;
    loomNumber: string;
    fabricName: string;
    entryDate: string | null;
  }>;
  fabricDashboardData: {
    tapeEntries: any[];
    electricityUnits: number;
    loomShiftMeters: any[];
    dailyWaste: any[];
  };
  activeOrders: any[];
  closedItemIds: Set<string>;
  stockCheck: {
    hasFabricStock: (fabricTypeId: string) => boolean;
    hasRotoStock: (rotoProdId: string) => boolean;
    hasLaminationStock: (productId: string) => boolean;
  };
  rotoProducts: any[];
  finishingProducts: any[];
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
  totalSalesKgs,
  totalPurchasesKgs,
  wasteSoldKgs,
  rawMaterialSoldKgs,
  receivablesTotal,
  payablesTotal,
  bagsSoldBreakdown,
  loomRunningFabrics,
  fabricDashboardData,
  activeOrders,
  closedItemIds,
  stockCheck,
  rotoProducts,
  finishingProducts,
}: AdminDashboardViewProps) {
  const [expandFabricDaily, setExpandFabricDaily] = useState(false);
  const [expandBagsBreakdown, setExpandBagsBreakdown] = useState(false);
  const [expandLoomRunning, setExpandLoomRunning] = useState(false);

  // Expanded operators state
  const [activeDeptTab, setActiveDeptTab] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  // Combined waste total
  const combinedWasteTotal = totals.plantWaste + totals.bobonWaste + totals.loomWaste + totals.pipeCuttingWaste;

  const handleCloseItem = (itemId: string, department: string) => {
    startTransition(async () => {
      try {
        await closeOperatorOrderItem(itemId, department);
      } catch (err) {
        alert("Failed to close item: " + (err as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm no-print">
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
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.fabric.consumptionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1 font-semibold">
                  <span className="text-slate-500">Diff (C - P):</span>
                  <span className={`font-mono ${departmentData.fabric.consumptionKg - departmentData.fabric.productionKg >= 0 ? 'text-rose-650' : 'text-emerald-700'}`}>
                    {formatNumber(departmentData.fabric.consumptionKg - departmentData.fabric.productionKg, 1)}
                  </span>
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
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.roto.consumptionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1 font-semibold">
                  <span className="text-slate-500">Diff (C - P):</span>
                  <span className={`font-mono ${departmentData.roto.consumptionKg - departmentData.roto.productionKg >= 0 ? 'text-rose-650' : 'text-emerald-700'}`}>
                    {formatNumber(departmentData.roto.consumptionKg - departmentData.roto.productionKg, 1)}
                  </span>
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
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.lamination.consumptionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1 font-semibold">
                  <span className="text-slate-500">Diff (C - P):</span>
                  <span className={`font-mono ${departmentData.lamination.consumptionKg - departmentData.lamination.productionKg >= 0 ? 'text-rose-650' : 'text-emerald-700'}`}>
                    {formatNumber(departmentData.lamination.consumptionKg - departmentData.lamination.productionKg, 1)}
                  </span>
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
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.offset.consumptionKg, 1)}</span>
                </div>
                <div className="h-4" /> {/* Spacer */}
                <div className="flex justify-between text-xs border-t pt-1 font-semibold">
                  <span className="text-slate-500">Diff (C - P):</span>
                  <span className={`font-mono ${departmentData.offset.consumptionKg - departmentData.offset.productionKg >= 0 ? 'text-rose-650' : 'text-emerald-700'}`}>
                    {formatNumber(departmentData.offset.consumptionKg - departmentData.offset.productionKg, 1)}
                  </span>
                </div>
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
                  <span className="text-slate-500">Bundles:</span>
                  <span className="font-mono font-bold text-slate-900">{formatNumber(departmentData.finishing.productionBags, 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Cons (kg):</span>
                  <span className="font-mono font-bold text-slate-700">{formatNumber(departmentData.finishing.consumptionKg, 1)}</span>
                </div>
                <div className="flex justify-between text-xs border-t pt-1 font-semibold">
                  <span className="text-slate-500">Diff (C - P):</span>
                  <span className={`font-mono ${departmentData.finishing.consumptionKg - departmentData.finishing.productionKg >= 0 ? 'text-rose-650' : 'text-emerald-700'}`}>
                    {formatNumber(departmentData.finishing.consumptionKg - departmentData.finishing.productionKg, 1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Cards & Expandables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Electrical Units (Total) */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Electrical Units</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="text-2xl font-bold font-mono">{formatNumber(totals.electricityUnits, 1)} units</span>
          </CardContent>
        </Card>

        {/* Total Waste (Combined) */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Waste (All 4 Combined)</CardTitle>
            <Trash2 className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="text-2xl font-bold font-mono">{formatNumber(combinedWasteTotal, 1)} kg</span>
          </CardContent>
        </Card>

        {/* Total Sales & Purchases */}
        <Card className="bg-white border-slate-200 shadow-xs md:col-span-2">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sales & Purchases (Combined KGs)</CardTitle>
            <Scale className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Sales</p>
              <p className="text-lg font-bold font-mono text-blue-600">{formatNumber(totalSalesKgs, 1)} kg</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Purchases</p>
              <p className="text-lg font-bold font-mono text-emerald-600">{formatNumber(totalPurchasesKgs, 1)} kg</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row of Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Waste Sold & Raw Material Sold */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Material Sold Summary</CardTitle>
            <ShoppingBag className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Waste Sold:</span>
              <span className="font-mono font-bold text-rose-650">{formatNumber(wasteSoldKgs, 1)} kg</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Raw Material Sold:</span>
              <span className="font-mono font-bold text-slate-900">{formatNumber(rawMaterialSoldKgs, 1)} kg</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Receivables & Payables */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ledger Net Balances</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Receivables (Dr):</span>
              <span className="font-mono font-bold text-blue-600">₹{formatNumber(receivablesTotal, 2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Payables (Cr):</span>
              <span className="font-mono font-bold text-rose-650">₹{formatNumber(payablesTotal, 2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Volume Summary */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-400 font-bold uppercase tracking-wider">Orders Status Summary</CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1 text-xs">
            <div className="flex justify-between font-semibold border-b pb-1">
              <span>Status</span>
              <span>KGs / Bags</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Received:</span>
              <span className="font-mono font-bold">{formatNumber(ordersSummary.received.kg, 0)} kg / {formatNumber(ordersSummary.received.bags, 0)} bags</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivered:</span>
              <span className="font-mono font-bold text-emerald-700">{formatNumber(ordersSummary.delivered.kg, 0)} kg / {formatNumber(ordersSummary.delivered.bags, 0)} bags</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pending:</span>
              <span className="font-mono font-bold text-amber-700">{formatNumber(ordersSummary.pending.kg, 0)} kg / {formatNumber(ordersSummary.pending.bags, 0)} bags</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loom running fabric tracker list (Single Day) */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <button
          onClick={() => setExpandLoomRunning(!expandLoomRunning)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Loom Running Fabric Tracker (Latest Production Entry)</span>
          </div>
          {expandLoomRunning ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {expandLoomRunning && (
          <div className="border-t border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="font-bold text-slate-700">Loom Number</TableHead>
                  <TableHead className="font-bold text-slate-700">Running Fabric Specification</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right pr-4">Latest Production Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loomRunningFabrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-400 text-xs">
                      No loom records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  loomRunningFabrics.map((item) => (
                    <TableRow key={item.loomId} className="hover:bg-slate-50/30">
                      <TableCell className="font-bold text-slate-800 text-xs">Loom {item.loomNumber}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">{item.fabricName}</TableCell>
                      <TableCell className="text-right font-mono text-xs pr-4 text-slate-500">
                        {item.entryDate ? formatDate(item.entryDate) : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Expandable Bags Sold Breakdown */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <button
          onClick={() => setExpandBagsBreakdown(!expandBagsBreakdown)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Bags Sold Breakdown by Type (Total Numbers)</span>
          </div>
          {expandBagsBreakdown ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {expandBagsBreakdown && (
          <div className="border-t border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="font-bold text-slate-700">Bag Type</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right pr-4">Bags Count (pcs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Metallic Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.metallic, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Box Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.box, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">F/S (Flap & Side) Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.fs, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">H/S (Heat Sealed) Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.hs, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">NW (Non Woven) Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.nw, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Offset Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.offset, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Plain Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.plain, 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Other Bags</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold pr-4">{formatNumber(bagsSoldBreakdown.other, 0)}</TableCell>
                </TableRow>
                <TableRow className="bg-slate-50 font-bold border-t-2">
                  <TableCell className="text-xs">Total Bags Sold</TableCell>
                  <TableCell className="text-right font-mono text-xs pr-4">
                    {formatNumber(
                      bagsSoldBreakdown.metallic +
                      bagsSoldBreakdown.box +
                      bagsSoldBreakdown.fs +
                      bagsSoldBreakdown.hs +
                      bagsSoldBreakdown.nw +
                      bagsSoldBreakdown.offset +
                      bagsSoldBreakdown.plain +
                      bagsSoldBreakdown.other,
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* 2. Expandable Daily Fabric Data Breakdown */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <button
          onClick={() => setExpandFabricDaily(!expandFabricDaily)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Loom Production & Shift Meters Breakdown</span>
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

      {/* Payables Credit Balance aging */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-55 py-3.5 flex flex-row items-center justify-between">
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

      {/* Brand Wastage Summary Block */}
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

      {/* DEPARTMENT DASHBOARDS SECTION AT THE BOTTOM */}
      <div className="space-y-4 pt-6 border-t border-slate-200 no-print">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Layers className="h-5 w-5 text-slate-500" />
          Department Sub-Dashboards (Active Panel for Date: {formatDate(to)})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setActiveDeptTab(activeDeptTab === "fabric" ? null : "fabric")}
            className={`h-24 flex flex-col gap-2 rounded-xl border text-sm font-bold ${
              activeDeptTab === "fabric"
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-900 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Factory className="h-6 w-6" />
            Fabric Daily Snapshot
          </Button>

          <Button
            onClick={() => setActiveDeptTab(activeDeptTab === "roto" ? null : "roto")}
            className={`h-24 flex flex-col gap-2 rounded-xl border text-sm font-bold ${
              activeDeptTab === "roto"
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-900 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Layers className="h-6 w-6" />
            Roto Printing Orders
          </Button>

          <Button
            onClick={() => setActiveDeptTab(activeDeptTab === "lamination" ? null : "lamination")}
            className={`h-24 flex flex-col gap-2 rounded-xl border text-sm font-bold ${
              activeDeptTab === "lamination"
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-900 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Scale className="h-6 w-6" />
            Lamination Orders
          </Button>

          <Button
            onClick={() => setActiveDeptTab(activeDeptTab === "offset" ? null : "offset")}
            className={`h-24 flex flex-col gap-2 rounded-xl border text-sm font-bold ${
              activeDeptTab === "offset"
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-900 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ScrollText className="h-6 w-6" />
            Offset Orders
          </Button>
        </div>

        {/* Dynamic Expanded View of Department Sub-Dashboard */}
        {activeDeptTab && (
          <Card className="border border-slate-300 bg-white/70 backdrop-blur-xs shadow-md p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="text-base font-bold text-slate-900 uppercase">
                {activeDeptTab} Operator View Snapshot ({formatDate(to)})
              </h4>
              {isPending && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
            </div>

            {/* TAB CONTENT: FABRIC */}
            {activeDeptTab === "fabric" && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Tape Line & Electricity */}
                <div className="space-y-4">
                  <div className="border rounded-xl p-4 bg-slate-50">
                    <h5 className="text-xs font-black uppercase text-slate-500 mb-2">Tape Line Entries</h5>
                    {fabricDashboardData.tapeEntries.length === 0 ? (
                      <p className="text-slate-400 text-xs">No tape entries logged on this date.</p>
                    ) : (
                      <ul className="text-xs space-y-1.5 font-mono">
                        {fabricDashboardData.tapeEntries.map((e, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{e.tape_type}:</span>
                            <span className="font-bold text-slate-900">{e.loads} loads</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="border rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-black uppercase text-slate-500">Electricity Consumed</h5>
                      <p className="text-xs text-slate-400">Total units logged for date</p>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-800 bg-white px-3 py-1.5 rounded-lg border">
                      {fabricDashboardData.electricityUnits} units
                    </span>
                  </div>
                </div>

                {/* Daily Waste */}
                <div className="border rounded-xl p-4 bg-slate-50">
                  <h5 className="text-xs font-black uppercase text-slate-500 mb-3">Waste Entries</h5>
                  {fabricDashboardData.dailyWaste.length === 0 ? (
                    <p className="text-slate-400 text-xs">No waste entries logged on this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2 rounded border">
                        <span className="text-slate-400 block text-[9px] uppercase">Plant Waste</span>
                        <span className="font-bold font-mono text-sm text-slate-800">{fabricDashboardData.dailyWaste[0].plant_waste} kg</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-slate-400 block text-[9px] uppercase">Bobbin Waste</span>
                        <span className="font-bold font-mono text-sm text-slate-800">{fabricDashboardData.dailyWaste[0].bobon_waste} kg</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-slate-400 block text-[9px] uppercase">Loom Waste</span>
                        <span className="font-bold font-mono text-sm text-slate-800">{fabricDashboardData.dailyWaste[0].loom_waste} kg</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-slate-400 block text-[9px] uppercase">Pipe Waste</span>
                        <span className="font-bold font-mono text-sm text-slate-800">{fabricDashboardData.dailyWaste[0].pipe_cutting_waste} kg</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ROTO PRINTING */}
            {activeDeptTab === "roto" && (() => {
              const filmOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "roto-printing" && !closedItemIds.has(item.id))
                  .map((item: any) => ({ ...item, orderDate: order.order_date, customer: order.customers }));
              });

              // Bag orders in finishing requiring roto film (meaning there is roto_product_id)
              const bagOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "finishing" && item.product_id && !closedItemIds.has(item.id))
                  .map((item: any) => {
                    const prod = finishingProducts.find((p: any) => p.id === item.product_id);
                    if (prod && prod.roto_product_id) {
                      return { ...item, orderDate: order.order_date, customer: order.customers, rotoProductId: prod.roto_product_id };
                    }
                    return null;
                  }).filter(Boolean);
              });

              return (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Film Orders Box */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Film Production Orders</span>
                      <Badge className="bg-blue-150 text-blue-800 hover:bg-blue-100 border-0">{filmOrders.length} active</Badge>
                    </h5>
                    {filmOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Film Orders outstanding.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {filmOrders.map((item: any) => (
                          <Card key={item.id} className="p-3 bg-slate-50 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                              </div>
                              <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 font-mono text-[9px] uppercase">Roto Film</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                              <div>
                                <span className="text-slate-400 text-[9px] uppercase block">Need Qty:</span>
                                <span className="font-bold text-slate-900">{formatNumber(item.quantity, 1)} kg</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleCloseItem(item.id, "roto")}
                              disabled={isPending}
                              size="sm"
                              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                            >
                              Close Order
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bag Orders requiring Roto printed film */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Bag Orders (Req. Printed Film)</span>
                      <Badge className="bg-indigo-150 text-indigo-800 hover:bg-indigo-100 border-0">{bagOrders.length} active</Badge>
                    </h5>
                    {bagOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Bag Orders requiring roto film.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {bagOrders.map((item: any) => {
                          const matchingRoto = rotoProducts.find((p: any) => p.id === item.rotoProductId);
                          return (
                            <Card key={item.id} className="p-3 bg-slate-50 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                  <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                                </div>
                                <Badge className="bg-amber-50 border-amber-200 text-amber-700 font-mono text-[9px] uppercase">Finishing</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Required Film:</span>
                                  <span className="font-bold text-slate-900 font-mono">{matchingRoto?.brand || "Roto Print"}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Need Bags:</span>
                                  <span className="font-bold text-slate-900">{formatNumber(item.quantity, 0)} bags</span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCloseItem(item.id, "roto")}
                                disabled={isPending}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                              >
                                Close Order
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: LAMINATION */}
            {activeDeptTab === "lamination" && (() => {
              const lamOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "lamination" && !closedItemIds.has(item.id))
                  .map((item: any) => ({ ...item, orderDate: order.order_date, customer: order.customers }));
              });

              const bagOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "finishing" && item.product_id && !closedItemIds.has(item.id))
                  .map((item: any) => {
                    const prod = finishingProducts.find((p: any) => p.id === item.product_id);
                    if (prod && (prod.lamination_type && prod.lamination_type !== "PLAIN" && prod.lamination_type !== "none")) {
                      return { ...item, orderDate: order.order_date, customer: order.customers, laminationType: prod.lamination_type, fabricTypeId: prod.fabric_type_id, rotoProductId: prod.roto_product_id };
                    }
                    return null;
                  }).filter(Boolean);
              });

              return (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Lamination Roll Orders */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Lamination Roll Orders</span>
                      <Badge className="bg-blue-150 text-blue-800 hover:bg-blue-100 border-0">{lamOrders.length} active</Badge>
                    </h5>
                    {lamOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Lamination Roll Orders outstanding.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {lamOrders.map((item: any) => {
                          const fabInStock = item.fabric_type_id ? stockCheck.hasFabricStock(item.fabric_type_id) : true;
                          const rotoInStock = item.product_id ? stockCheck.hasRotoStock(item.product_id) : true;
                          const canProcess = fabInStock && rotoInStock;

                          return (
                            <Card key={item.id} className="p-3 bg-slate-55 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                  <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                                </div>
                                <Badge className={canProcess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                                  {canProcess ? "Ready" : "In Process"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Fabric Stock:</span>
                                  <span className={fabInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {fabInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Roto Stock:</span>
                                  <span className={rotoInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {rotoInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCloseItem(item.id, "lamination")}
                                disabled={isPending || !canProcess}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs disabled:opacity-40"
                              >
                                {!canProcess ? "In Process (Waiting for Stock)" : "Close Order"}
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Lamination Bag Orders */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Bag Orders (Req. Lamination)</span>
                      <Badge className="bg-indigo-150 text-indigo-800 hover:bg-indigo-100 border-0">{bagOrders.length} active</Badge>
                    </h5>
                    {bagOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Bag Orders requiring lamination.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {bagOrders.map((item: any) => {
                          const fabInStock = item.fabricTypeId ? stockCheck.hasFabricStock(item.fabricTypeId) : true;
                          const rotoInStock = item.rotoProductId ? stockCheck.hasRotoStock(item.rotoProductId) : true;
                          const canProcess = fabInStock && rotoInStock;

                          return (
                            <Card key={item.id} className="p-3 bg-slate-50 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                  <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                                </div>
                                <Badge className={canProcess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                                  {canProcess ? "Ready" : "In Process"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Fabric Stock:</span>
                                  <span className={fabInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {fabInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Roto Stock:</span>
                                  <span className={rotoInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {rotoInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCloseItem(item.id, "lamination")}
                                disabled={isPending || !canProcess}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs disabled:opacity-40"
                              >
                                {!canProcess ? "In Process (Waiting for Stock)" : "Close Order"}
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: OFFSET PRINTING */}
            {activeDeptTab === "offset" && (() => {
              const offsetOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "offset-printing" && !closedItemIds.has(item.id))
                  .map((item: any) => ({ ...item, orderDate: order.order_date, customer: order.customers }));
              });

              const bagOrders = activeOrders.flatMap((order) => {
                return (order.sales_order_items ?? [])
                  .filter((item: any) => item.department === "finishing" && item.product_id && !closedItemIds.has(item.id))
                  .map((item: any) => {
                    const prod = finishingProducts.find((p: any) => p.id === item.product_id);
                    if (prod && prod.offset_type && prod.offset_type !== "none") {
                      return { ...item, orderDate: order.order_date, customer: order.customers, fabricTypeId: prod.fabric_type_id, offsetProductId: prod.offset_product_id };
                    }
                    return null;
                  }).filter(Boolean);
              });

              return (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Offset Roll Orders */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Offset Roll Orders</span>
                      <Badge className="bg-blue-150 text-blue-800 hover:bg-blue-100 border-0">{offsetOrders.length} active</Badge>
                    </h5>
                    {offsetOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Offset Roll Orders outstanding.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {offsetOrders.map((item: any) => {
                          const fabInStock = item.fabric_type_id ? stockCheck.hasFabricStock(item.fabric_type_id) : true;
                          const lamInStock = item.product_id ? stockCheck.hasLaminationStock(item.product_id) : true;
                          const canProcess = fabInStock && lamInStock;

                          return (
                            <Card key={item.id} className="p-3 bg-slate-50 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                  <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                                </div>
                                <Badge className={canProcess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                                  {canProcess ? "Ready" : "In Process"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Fabric Stock:</span>
                                  <span className={fabInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {fabInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Lamination Stock:</span>
                                  <span className={lamInStock ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {lamInStock ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCloseItem(item.id, "offset")}
                                disabled={isPending || !canProcess}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs disabled:opacity-40"
                              >
                                {!canProcess ? "In Process (Waiting for Stock)" : "Close Order"}
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Offset Bag Orders */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-slate-500 border-b pb-1.5 flex justify-between">
                      <span>Bag Orders (Req. Offset Printing)</span>
                      <Badge className="bg-indigo-150 text-indigo-800 hover:bg-indigo-100 border-0">{bagOrders.length} active</Badge>
                    </h5>
                    {bagOrders.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">No active Bag Orders requiring offset printing.</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {bagOrders.map((item: any) => {
                          const fabInStock = item.fabricTypeId ? stockCheck.hasFabricStock(item.fabricTypeId) : true;
                          const lamInStock = item.product_id ? stockCheck.hasLaminationStock(item.product_id) : true;
                          const canProcess = fabInStock && lamInStock;

                          return (
                            <Card key={item.id} className="p-3 bg-slate-50 border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block">Date: {formatDate(item.orderDate)}</span>
                                  <span className="text-xs font-black text-slate-800">{item.customer?.customer_name}</span>
                                </div>
                                <Badge className={canProcess ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                                  {canProcess ? "Ready" : "In Process"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase block">Fabric/Lamination:</span>
                                  <span className={canProcess ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                    {canProcess ? "Available" : "NO STOCK"}
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCloseItem(item.id, "offset")}
                                disabled={isPending || !canProcess}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs disabled:opacity-40"
                              >
                                {!canProcess ? "In Process (Waiting for Stock)" : "Close Order"}
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </Card>
        )}
      </div>
    </div>
  );
}
