"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { todayInIndia } from "@/lib/utils";

interface RawMaterial {
  id: string;
  material_name: string;
  unit: string;
  current_stock: string | number;
}

interface Purchase {
  raw_material_id: string;
  purchase_date: string;
  quantity: string | number;
}

interface Consumption {
  raw_material_id: string;
  consumption_date: string;
  quantity: string | number;
}

interface StockReportClientProps {
  from: string;
  to: string;
  rawMaterials: RawMaterial[];
  purchases: Purchase[];
  consumptions: Consumption[];
}

export function StockReportClient({
  from,
  to,
  rawMaterials,
  purchases,
  consumptions,
}: StockReportClientProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const today = todayInIndia();

  // Helper to generate date range list
  const getDatesInRange = (startDate: string, endDate: string) => {
    const dates: string[] = [];
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const curr = new Date(start);
    let safetyCounter = 0;
    while (curr <= end && safetyCounter < 1000) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, "0");
      const d = String(curr.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${d}`);
      curr.setDate(curr.getDate() + 1);
      safetyCounter++;
    }
    return dates;
  };

  const selectedDates = useMemo(() => getDatesInRange(from, to), [from, to]);

  // Compute stats for each raw material
  const materialData = useMemo(() => {
    return rawMaterials.map((material) => {
      const matId = material.id;
      const currentStock = Number(material.current_stock ?? 0);

      // Filter purchases & consumptions for this material
      const matPurchases = purchases.filter((p) => p.raw_material_id === matId);
      const matConsumptions = consumptions.filter((c) => c.raw_material_id === matId);

      // Total in the selected [from, to] range
      let totalPurchaseInRange = 0;
      let totalConsumptionInRange = 0;

      // Group purchases/consumptions by date for daily details
      const purchasesByDate: Record<string, number> = {};
      const consumptionsByDate: Record<string, number> = {};

      matPurchases.forEach((p) => {
        const qty = Number(p.quantity);
        const date = p.purchase_date;
        if (date >= from && date <= to) {
          totalPurchaseInRange += qty;
        }
        purchasesByDate[date] = (purchasesByDate[date] ?? 0) + qty;
      });

      matConsumptions.forEach((c) => {
        const qty = Number(c.quantity);
        const date = c.consumption_date;
        if (date >= from && date <= to) {
          totalConsumptionInRange += qty;
        }
        consumptionsByDate[date] = (consumptionsByDate[date] ?? 0) + qty;
      });

      // Backtrack to compute daily running available balance
      // We need to backtrack from today down to 'from'
      const backtrackStart = from > today ? today : from;
      const datesToBacktrack = getDatesInRange(backtrackStart, today);

      const availableByDate: Record<string, number> = {};
      let runningStock = currentStock;

      // Go backwards in time
      for (let i = datesToBacktrack.length - 1; i >= 0; i--) {
        const d = datesToBacktrack[i];
        availableByDate[d] = runningStock;
        const p = purchasesByDate[d] ?? 0;
        const c = consumptionsByDate[d] ?? 0;
        runningStock = runningStock - p + c;
      }

      // Available stock at the end of the 'to' date
      let availableAtTo = currentStock;
      if (to < today) {
        availableAtTo = availableByDate[to] !== undefined ? availableByDate[to] : runningStock;
      }

      // Daily records for selection
      const dailyRecords = selectedDates.map((date) => {
        const p = purchasesByDate[date] ?? 0;
        const c = consumptionsByDate[date] ?? 0;
        const a = availableByDate[date] !== undefined ? availableByDate[date] : (date > today ? currentStock : runningStock);

        return {
          date,
          purchase: Math.floor(p),
          consumption: Math.floor(c),
          available: Math.floor(a),
        };
      });

      return {
        ...material,
        totalPurchase: Math.floor(totalPurchaseInRange),
        totalConsumption: Math.floor(totalConsumptionInRange),
        available: Math.floor(availableAtTo),
        dailyRecords,
      };
    });
  }, [rawMaterials, purchases, consumptions, from, to, selectedDates, today]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Report"
        description="Track raw material inventory flows including purchases, consumptions, and available stock levels."
      />

      <div className="flex justify-end">
        <DateRangeFilter from={from} to={to} baseUrl="/reports/stock" />
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {materialData.length === 0 ? (
            <EmptyState title="No Raw Materials Found" description="Register raw materials in Admin to view stock logs." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="font-semibold text-slate-700">Raw Material ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Unit</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Total Purchase</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Total Consumption</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialData.map((material) => {
                  const isExpanded = expanded[material.id];
                  return (
                    <>
                      <TableRow
                        key={material.id}
                        onClick={() => toggleExpand(material.id)}
                        className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200"
                      >
                        <TableCell className="py-3 px-4">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 py-3">{material.material_name}</TableCell>
                        <TableCell className="text-slate-600 py-3">{material.unit}</TableCell>
                        <TableCell className="text-right text-slate-950 font-medium py-3">
                          {material.totalPurchase}
                        </TableCell>
                        <TableCell className="text-right text-slate-950 font-medium py-3">
                          {material.totalConsumption}
                        </TableCell>
                        <TableCell className="text-right text-slate-950 font-bold py-3">
                          {material.available}
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                          <TableCell colSpan={6} className="p-4">
                            <div className="rounded-lg border border-slate-200 bg-white shadow-inner overflow-hidden max-w-4xl mx-auto my-2">
                              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                  Daily Ledger (P - C - A) for {material.material_name}
                                </span>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-slate-50 border-b border-slate-200">
                                    <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 text-right">Purchase (P)</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 text-right">Consumption (C)</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 text-right">Available (A)</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {material.dailyRecords.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-center py-4 text-slate-400 text-sm">
                                        No records in selected date range.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    material.dailyRecords.map((record) => (
                                      <TableRow key={record.date} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                        <TableCell className="py-2 text-slate-700 font-medium text-xs">
                                          {record.date}
                                        </TableCell>
                                        <TableCell className="py-2 text-right text-slate-900 text-xs">
                                          {record.purchase > 0 ? record.purchase : "-"}
                                        </TableCell>
                                        <TableCell className="py-2 text-right text-slate-900 text-xs">
                                          {record.consumption > 0 ? record.consumption : "-"}
                                        </TableCell>
                                        <TableCell className="py-2 text-right text-slate-900 font-bold text-xs">
                                          {record.available}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
