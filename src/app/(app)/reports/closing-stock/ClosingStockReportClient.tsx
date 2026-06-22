"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber, todayInIndia } from "@/lib/utils";

interface RawMaterial {
  id: string;
  material_name: string;
  unit: string;
  department: string | null;
  current_stock: string | number;
}

interface Purchase {
  raw_material_id: string;
  purchase_date: string;
  quantity: string | number;
  rate: string | number;
  total_amount: string | number;
}

interface Consumption {
  raw_material_id: string;
  consumption_date: string;
  quantity: string | number;
}

interface FabricType {
  id: string;
  fabric_name: string;
  selling_price: number;
}

interface FabricRoll {
  id: string;
  roll_number: string;
  fabric_type_id: string;
  weight: string | number;
  meters: string | number;
  production_date: string;
  status: string;
  current_stage: string;
}

interface SalesOrder {
  order_date: string;
  status: string;
  bill_number: string | null;
  sales_order_items: Array<{
    selected_roll_ids: string[] | null;
  }> | null;
}

interface MaterialSale {
  raw_material_id: string | null;
  sale_date: string;
  quantity: string | number;
  type: string; // 'raw_material' | 'waste'
}

interface ClosingStockReportClientProps {
  date: string;
  rawMaterials: RawMaterial[];
  purchases: Purchase[];
  consumptions: Consumption[];
  materialSales: MaterialSale[];
  fabricTypes: FabricType[];
  rolls: FabricRoll[];
  salesOrders: SalesOrder[];
}

const DEPT_ORDER = ["fabric", "roto-printing", "lamination", "offset-printing", "finishing", "general"];

function getDeptLabel(key: string | null | undefined): string {
  if (!key) return "General";
  const mapping: Record<string, string> = {
    fabric: "Fabric",
    loom: "Fabric",
    "roto-printing": "Roto Printing",
    roto_printing: "Roto Printing",
    lamination: "Lamination",
    "offset-printing": "Offset Printing",
    offset_printing: "Offset Printing",
    finishing: "Finishing",
    general: "General",
  };
  return mapping[key] ?? key;
}

function getStageDeptKey(stage: string): string {
  if (stage === "loom") return "fabric";
  if (stage === "roto_printing") return "roto-printing";
  if (stage === "offset_printing") return "offset-printing";
  return stage;
}

function getProdStageName(key: string): string {
  const mapping: Record<string, string> = {
    loom: "Fabric Stock (Rolls)",
    roto_printing: "Roto Printed Stock",
    lamination: "Laminated Stock",
    offset_printing: "Offset Printed Stock",
    finishing: "Finished Stock",
  };
  return mapping[key] ?? key;
}

export function ClosingStockReportClient({
  date,
  rawMaterials,
  purchases,
  consumptions,
  materialSales,
  fabricTypes,
  rolls,
  salesOrders,
}: ClosingStockReportClientProps) {
  const router = useRouter();
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const today = todayInIndia();

  const handleDateChange = (newDate: string) => {
    router.push(`/reports/closing-stock?date=${newDate}` as any);
  };

  const setPrice = (key: string, val: string) =>
    setCustomPrices((prev) => ({ ...prev, [key]: val }));

  const getPrice = (key: string, fallback: number): number =>
    customPrices[key] !== undefined ? Number(customPrices[key] || 0) : fallback;

  // ──────────────────────────────────────────────────────────────
  // Sold roll IDs → order date (for stock at date D calculation)
  // ──────────────────────────────────────────────────────────────
  const rollIdToSoldDate = useMemo(() => {
    const map: Record<string, string> = {};
    salesOrders.forEach((order) => {
      if (order.status === "confirmed" && order.bill_number) {
        order.sales_order_items?.forEach((item) => {
          if (item.selected_roll_ids) {
            item.selected_roll_ids.forEach((rollId) => {
              map[rollId] = order.order_date;
            });
          }
        });
      }
    });
    return map;
  }, [salesOrders]);

  // ──────────────────────────────────────────────────────────────
  // RAW MATERIAL STOCK at date D (backtrack from current_stock)
  // ──────────────────────────────────────────────────────────────
  const getRmStockAtD = (materialId: string, currentStock: number): number => {
    if (date >= today) return currentStock;
    const purchasesAfter = purchases
      .filter((p) => p.raw_material_id === materialId && p.purchase_date > date)
      .reduce((s, p) => s + Number(p.quantity), 0);
    const consumptionsAfter = consumptions
      .filter((c) => c.raw_material_id === materialId && c.consumption_date > date)
      .reduce((s, c) => s + Number(c.quantity), 0);
    const rmSalesAfter = materialSales
      .filter((s) => s.raw_material_id === materialId && s.type === "raw_material" && s.sale_date > date)
      .reduce((s, m) => s + Number(m.quantity), 0);
    // currentStock = stockAtD + purchasesAfter - consumptionsAfter - rmSalesAfter
    return currentStock - purchasesAfter + consumptionsAfter + rmSalesAfter;
  };

  const getRmDefaultPrice = (materialId: string): number => {
    const matPurchases = purchases
      .filter((p) => p.raw_material_id === materialId && p.purchase_date <= date)
      .sort((a, b) => a.purchase_date.localeCompare(b.purchase_date));
    if (matPurchases.length === 0) return 0;
    return Number(matPurchases[matPurchases.length - 1].rate ?? 0);
  };

  // ──────────────────────────────────────────────────────────────
  // RAW MATERIAL ROWS (department-wise, individual per material)
  // ──────────────────────────────────────────────────────────────
  const rmRows = useMemo(() => {
    return rawMaterials
      .map((mat) => {
        const stock = Math.max(0, Math.floor(getRmStockAtD(mat.id, Number(mat.current_stock))));
        const defaultPrice = getRmDefaultPrice(mat.id);
        return {
          key: `rm-${mat.id}`,
          departmentKey: mat.department || "general",
          departmentLabel: getDeptLabel(mat.department),
          name: mat.material_name,
          stock,
          defaultPrice,
          isProduct: false,
        };
      })
      .filter((r) => r.stock > 0)
      .sort((a, b) => {
        const ia = DEPT_ORDER.indexOf(a.departmentKey);
        const ib = DEPT_ORDER.indexOf(b.departmentKey);
        if (ia !== ib) return ia - ib;
        return a.name.localeCompare(b.name);
      });
  }, [rawMaterials, purchases, consumptions, materialSales, date, today]);

  // ──────────────────────────────────────────────────────────────
  // PRODUCT ROWS (one row per stage/department, summed in KGs)
  // ──────────────────────────────────────────────────────────────
  const productRows = useMemo(() => {
    // Active rolls at date D: produced on or before D, not yet sold (or sold after D)
    const activeRolls = rolls.filter((roll) => {
      if (roll.production_date > date) return false;
      const soldDate = rollIdToSoldDate[roll.id];
      return roll.status === "available" || (soldDate && soldDate > date);
    });

    const stageWeights: Record<string, number> = {};
    activeRolls.forEach((roll) => {
      const stage = roll.current_stage || "loom";
      stageWeights[stage] = (stageWeights[stage] ?? 0) + Number(roll.weight || 0);
    });

    const getStageDefaultPrice = (stage: string): number => {
      const firstRoll = activeRolls.find((r) => (r.current_stage || "loom") === stage);
      if (!firstRoll) return 0;
      const fab = fabricTypes.find((f) => f.id === firstRoll.fabric_type_id);
      return Number(fab?.selling_price || 0);
    };

    return Object.entries(stageWeights)
      .filter(([, weight]) => weight > 0)
      .map(([stage, weight]) => ({
        key: `prod-${stage}`,
        departmentKey: getStageDeptKey(stage),
        departmentLabel: getDeptLabel(getStageDeptKey(stage)),
        name: getProdStageName(stage),
        stock: Math.floor(weight),
        defaultPrice: getStageDefaultPrice(stage),
        isProduct: true,
      }))
      .sort((a, b) => {
        const ia = DEPT_ORDER.indexOf(a.departmentKey);
        const ib = DEPT_ORDER.indexOf(b.departmentKey);
        return ia - ib;
      });
  }, [rolls, date, rollIdToSoldDate, fabricTypes]);

  // ──────────────────────────────────────────────────────────────
  // WIP CALCULATION
  // Formula: Total Purchase − (Sales Entry + Stock + Waste Sale + RM Sale)
  //   Total Purchase  = all raw_material_purchases up to date D (qty)
  //   Sales Entry     = confirmed sales_orders roll weights sold up to date D
  //   Stock           = total raw material stock at date D (sum of rmRows)
  //   Waste Sale      = material_sales where type='waste' up to date D
  //   RM Sale         = material_sales where type='raw_material' up to date D
  // ──────────────────────────────────────────────────────────────
  const wipData = useMemo(() => {
    // 1. Total Purchase (KGs)
    const totalPurchaseQty = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((s, p) => s + Number(p.quantity), 0);

    const totalPurchaseAmt = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((s, p) => s + Number(p.total_amount), 0);

    // 2. Sales Entry KGs: confirmed sales orders, roll weights sold on or before date D
    const soldRollWeightsUpToD = rolls
      .filter((roll) => {
        const soldDate = rollIdToSoldDate[roll.id];
        return soldDate && soldDate <= date;
      })
      .reduce((s, r) => s + Number(r.weight || 0), 0);

    // 3. Stock at date D (sum of raw material stocks)
    const totalRmStock = rmRows.reduce((s, r) => s + r.stock, 0);

    // 4. Waste Sale KGs
    const wasteSaleQty = materialSales
      .filter((m) => m.type === "waste" && m.sale_date <= date)
      .reduce((s, m) => s + Number(m.quantity), 0);

    // 5. RM Sale KGs
    const rmSaleQty = materialSales
      .filter((m) => m.type === "raw_material" && m.sale_date <= date)
      .reduce((s, m) => s + Number(m.quantity), 0);

    const wipKgs = Math.max(
      0,
      totalPurchaseQty - (soldRollWeightsUpToD + totalRmStock + wasteSaleQty + rmSaleQty)
    );

    // WIP price = weighted avg purchase rate
    const wipDefaultPrice = totalPurchaseQty > 0 ? totalPurchaseAmt / totalPurchaseQty : 0;

    return {
      stock: Math.floor(wipKgs),
      defaultPrice: wipDefaultPrice,
      // Debug breakdown
      breakdown: {
        totalPurchaseQty: Math.floor(totalPurchaseQty),
        soldRollWeightsUpToD: Math.floor(soldRollWeightsUpToD),
        totalRmStock,
        wasteSaleQty: Math.floor(wasteSaleQty),
        rmSaleQty: Math.floor(rmSaleQty),
      },
    };
  }, [purchases, rolls, rmRows, materialSales, date, rollIdToSoldDate]);

  // ──────────────────────────────────────────────────────────────
  // GROUP ALL ROWS BY DEPARTMENT
  // ──────────────────────────────────────────────────────────────
  const allRows = useMemo(() => [...rmRows, ...productRows], [rmRows, productRows]);

  const groupedRows = useMemo(() => {
    const groups: Record<string, typeof allRows> = {};
    allRows.forEach((row) => {
      if (!groups[row.departmentKey]) groups[row.departmentKey] = [];
      groups[row.departmentKey].push(row);
    });
    return DEPT_ORDER
      .filter((k) => groups[k]?.length)
      .map((k) => ({ deptKey: k, deptLabel: getDeptLabel(k), rows: groups[k] }));
  }, [allRows]);

  // ──────────────────────────────────────────────────────────────
  // TOTALS (live, based on editable prices)
  // ──────────────────────────────────────────────────────────────
  const totals = useMemo(() => {
    let stockBase = 0;
    allRows.forEach((row) => {
      const price = getPrice(row.key, row.defaultPrice);
      stockBase += row.stock * price;
    });

    const wipPrice = getPrice("wip", wipData.defaultPrice);
    const wipAmount = wipData.stock * wipPrice;

    const baseTotal = stockBase + wipAmount;
    const gstAmount = baseTotal * 0.18;
    const grandTotal = baseTotal * 1.18;

    return { stockBase, wipAmount, baseTotal, gstAmount, grandTotal };
  }, [allRows, customPrices, wipData]);

  const displayDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Closing Stock"
        description="Department-wise stock valuation with Work In Progress (WIP) and GST-inclusive grand total."
      />

      {/* Date Selector */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm w-fit">
        <Label htmlFor="date-select" className="font-semibold text-sm text-slate-700 shrink-0">
          Select Stock Date:
        </Label>
        <Input
          id="date-select"
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-44 h-9 text-sm border-slate-200 shadow-none focus:border-primary"
        />
        <span className="text-sm font-bold text-slate-500 font-mono ml-1">{displayDate}</span>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Banner */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Closing Stock — Department Wise
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">As on {displayDate}</p>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {allRows.length} item{allRows.length !== 1 ? "s" : ""} · Enter price to compute amount
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100 border-b-2 border-slate-200">
              <TableHead className="font-bold text-slate-600 text-xs uppercase w-40">Department</TableHead>
              <TableHead className="font-bold text-slate-600 text-xs uppercase">RM &amp; Product</TableHead>
              <TableHead className="font-bold text-slate-600 text-xs uppercase text-right w-36">
                Stock (Kgs)
              </TableHead>
              <TableHead className="font-bold text-slate-600 text-xs uppercase text-right w-36">
                Price (₹/Kg)
              </TableHead>
              <TableHead className="font-bold text-slate-600 text-xs uppercase text-right w-40">
                Amount (₹)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-sm font-semibold">
                  No stock items found for this date.
                </TableCell>
              </TableRow>
            ) : (
              groupedRows.map(({ deptKey, deptLabel, rows }) => {
                const deptTotal = rows.reduce((s, r) => {
                  const price = getPrice(r.key, r.defaultPrice);
                  return s + r.stock * price;
                }, 0);

                return (
                  <>
                    {/* Department Header Row */}
                    <TableRow
                      key={`dept-${deptKey}`}
                      className="bg-slate-50/80 border-t border-slate-200 hover:bg-slate-50/80"
                    >
                      <TableCell
                        colSpan={5}
                        className="py-1.5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
                      >
                        ▸ {deptLabel}
                      </TableCell>
                    </TableRow>

                    {/* Individual Rows */}
                    {rows.map((row) => {
                      const price = getPrice(row.key, row.defaultPrice);
                      const amount = row.stock * price;
                      return (
                        <TableRow
                          key={row.key}
                          className={`border-b border-slate-100 hover:bg-blue-50/20 transition-colors ${
                            row.isProduct ? "bg-emerald-50/10" : ""
                          }`}
                        >
                          <TableCell className="py-2.5 pl-8 text-xs text-slate-400 font-medium">
                            {row.isProduct ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                Product
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                                Raw Material
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-2.5 text-sm font-semibold text-slate-800">
                            {row.name}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-sm font-bold text-slate-900 font-mono">
                            {formatNumber(row.stock, 0)}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <Input
                              type="number"
                              min="0"
                              step="any"
                              className="w-28 h-7 text-right text-xs py-0 px-2 border border-slate-200 focus:border-blue-400 rounded-md bg-white font-mono font-semibold ml-auto shadow-none"
                              value={
                                customPrices[row.key] !== undefined
                                  ? customPrices[row.key]
                                  : row.defaultPrice > 0
                                  ? row.defaultPrice.toFixed(2)
                                  : ""
                              }
                              placeholder="0.00"
                              onChange={(e) => setPrice(row.key, e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-sm font-black text-slate-900 font-mono">
                            {amount > 0 ? `₹${formatNumber(amount, 0)}` : <span className="text-slate-300">—</span>}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {/* Department Subtotal */}
                    <TableRow
                      key={`subtotal-${deptKey}`}
                      className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50"
                    >
                      <TableCell colSpan={4} className="py-1.5 pl-8 text-xs font-bold text-slate-500 text-right uppercase">
                        {deptLabel} Subtotal
                      </TableCell>
                      <TableCell className="py-1.5 text-right text-sm font-black text-slate-700 font-mono">
                        {deptTotal > 0 ? `₹${formatNumber(deptTotal, 0)}` : <span className="text-slate-300">—</span>}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            )}

            {/* ── WIP SECTION ── */}
            <TableRow className="border-t-2 border-amber-200 bg-amber-50/30 hover:bg-amber-50/30">
              <TableCell
                colSpan={5}
                className="py-2 px-4 text-[10px] font-black uppercase tracking-widest text-amber-700"
              >
                ▸ Work In Progress (WIP)
              </TableCell>
            </TableRow>

            {/* WIP formula explanation row */}
            <TableRow className="bg-amber-50/10 hover:bg-amber-50/10 border-b border-amber-100">
              <TableCell colSpan={5} className="py-1 px-8">
                <span className="text-[10px] text-amber-700 font-mono font-medium">
                  Formula: Total Purchase [{formatNumber(wipData.breakdown.totalPurchaseQty, 0)} Kgs] −
                  (Sales Entry [{formatNumber(wipData.breakdown.soldRollWeightsUpToD, 0)} Kgs] +
                  Stock [{formatNumber(wipData.breakdown.totalRmStock, 0)} Kgs] +
                  Waste [{formatNumber(wipData.breakdown.wasteSaleQty, 0)} Kgs] +
                  RM Sale [{formatNumber(wipData.breakdown.rmSaleQty, 0)} Kgs])
                </span>
              </TableCell>
            </TableRow>

            <TableRow className="bg-amber-50/20 hover:bg-amber-50/20 border-b border-amber-100">
              <TableCell className="py-3 pl-8 text-xs text-amber-700 font-bold">WIP</TableCell>
              <TableCell className="py-3 text-sm font-black text-amber-900">
                WORK IN PROGRESS
              </TableCell>
              <TableCell className="py-3 text-right text-sm font-bold text-amber-900 font-mono">
                {formatNumber(wipData.stock, 0)} Kgs
              </TableCell>
              <TableCell className="py-3 text-right">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  className="w-28 h-7 text-right text-xs py-0 px-2 border border-amber-200 focus:border-amber-500 rounded-md bg-white font-mono font-semibold ml-auto shadow-none"
                  value={
                    customPrices["wip"] !== undefined
                      ? customPrices["wip"]
                      : wipData.defaultPrice > 0
                      ? wipData.defaultPrice.toFixed(2)
                      : ""
                  }
                  placeholder="0.00"
                  onChange={(e) => setPrice("wip", e.target.value)}
                />
              </TableCell>
              <TableCell className="py-3 text-right text-sm font-black text-amber-900 font-mono">
                {totals.wipAmount > 0
                  ? `₹${formatNumber(totals.wipAmount, 0)}`
                  : <span className="text-slate-300">—</span>}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ── GRAND TOTAL SECTION ── */}
        <div className="border-t-2 border-slate-300 bg-slate-800 text-white">
          {/* Base Total */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-600">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Base Stock Value (Stock + WIP)
            </span>
            <span className="font-bold text-white text-sm font-mono">
              ₹{formatNumber(totals.baseTotal, 0)}
            </span>
          </div>
          {/* GST */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-600">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              GST Component (18%)
            </span>
            <span className="font-bold text-white text-sm font-mono">
              ₹{formatNumber(totals.gstAmount, 0)}
            </span>
          </div>
          {/* Grand Total */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <span className="text-base font-black text-white uppercase tracking-wider">
                Grand Total (Incl. GST)
              </span>
              <p className="text-xs text-slate-400 mt-0.5">All amounts × 1.18</p>
            </div>
            <span className="font-black text-emerald-400 text-2xl font-mono">
              ₹{formatNumber(totals.grandTotal, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Accounting Note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-xs text-blue-700 leading-relaxed">
        <span className="font-black uppercase block mb-1 text-blue-800">📋 Accounting Note</span>
        Stock prices are auto-filled from the latest purchase rate. You can override any price in the input fields above.
        WIP = Total Purchase − (Sales Entry + RM Stock + Waste Sale + RM Sale). Grand Total = Base Total × 1.18 (18% GST).
      </div>
    </div>
  );
}
