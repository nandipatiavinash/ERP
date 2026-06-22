"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  raw_material_id: string;
  sale_date: string;
  quantity: string | number;
  type: string;
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

  const autoWaste = useMemo(() => {
    return materialSales
      .filter((s) => s.type === "waste" && s.sale_date <= date)
      .reduce((sum, s) => sum + Number(s.quantity), 0);
  }, [materialSales, date]);

  const handleDateChange = (newDate: string) => {
    router.push(`/reports/closing-stock?date=${newDate}` as any);
  };

  // Helper to compute raw material stock at date D
  const getRmStockAtD = (materialId: string, currentStock: number) => {
    if (date >= today) return currentStock;

    // Filter purchases/consumptions/sales after selected date
    const purchasesAfter = purchases.filter(
      (p) => p.raw_material_id === materialId && p.purchase_date > date
    );
    const consumptionsAfter = consumptions.filter(
      (c) => c.raw_material_id === materialId && c.consumption_date > date
    );
    const salesAfter = materialSales.filter(
      (s) => s.raw_material_id === materialId && s.type === "raw_material" && s.sale_date > date
    );

    const sumPurchasesAfter = purchasesAfter.reduce((sum, p) => sum + Number(p.quantity), 0);
    const sumConsumptionsAfter = consumptionsAfter.reduce((sum, c) => sum + Number(c.quantity), 0);
    const sumSalesAfter = salesAfter.reduce((sum, s) => sum + Number(s.quantity), 0);

    return currentStock - sumPurchasesAfter + sumConsumptionsAfter + sumSalesAfter;
  };

  // Helper to get raw material price at date D (latest purchase rate on or before D)
  const getRmPriceAtD = (materialId: string) => {
    const matPurchases = purchases.filter(
      (p) => p.raw_material_id === materialId && p.purchase_date <= date
    );
    if (matPurchases.length === 0) return 0;
    const latest = matPurchases[matPurchases.length - 1];
    return Number(latest.rate ?? 0);
  };

  // Resolve roll sold dates from sales order items
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

  // Determine active product rolls on date D
  const activeRollsAtD = useMemo(() => {
    return rolls.filter((roll) => {
      if (roll.production_date > date) return false;
      const soldDate = rollIdToSoldDate[roll.id];
      if (roll.status === "available" || (soldDate && soldDate > date)) {
        return true;
      }
      return false;
    });
  }, [rolls, date, rollIdToSoldDate]);

  // Format Raw Material closing stocks
  const rmClosingData = useMemo(() => {
    return rawMaterials.map((mat) => {
      const stock = getRmStockAtD(mat.id, Number(mat.current_stock));
      const price = getRmPriceAtD(mat.id);
      const amount = stock * price;
      return {
        id: mat.id,
        name: mat.material_name,
        department: mat.department || "general",
        stock,
        price,
        amount,
      };
    });
  }, [rawMaterials, date, purchases, consumptions, materialSales]);

  // Format Products closing stocks grouped and summed by department (stage)
  const productClosingData = useMemo(() => {
    const stageWeights: Record<string, number> = {
      loom: 0,
      roto_printing: 0,
      lamination: 0,
      offset_printing: 0,
      finishing: 0,
    };

    activeRollsAtD.forEach((roll) => {
      const stage = roll.current_stage || "loom";
      const weight = Number(roll.weight || 0);
      if (stageWeights[stage] !== undefined) {
        stageWeights[stage] += weight;
      }
    });

    return stageWeights;
  }, [activeRollsAtD]);

  // Helper to resolve template selling price for the first roll in a stage
  const getStageDefaultPrice = (stage: string) => {
    const firstRoll = activeRollsAtD.find((r) => (r.current_stage || "loom") === stage);
    if (!firstRoll) return 0;
    const fab = fabricTypes.find((f) => f.id === firstRoll.fabric_type_id);
    return Number(fab?.selling_price || 0);
  };

  // WIP calculations using correct material balance equation
  const wipData = useMemo(() => {
    // Total raw material purchases up to date D
    const totalPurchasesQty = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((sum, p) => sum + Number(p.quantity), 0);

    const totalPurchasesAmount = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((sum, p) => sum + Number(p.total_amount), 0);

    // Total raw material stock balances at D
    const totalRmStock = rmClosingData.reduce((sum, mat) => sum + mat.stock, 0);

    // Total raw materials sold up to date D
    const totalMaterialSalesQty = materialSales
      .filter((s) => s.type === "raw_material" && s.sale_date <= date)
      .reduce((sum, s) => sum + Number(s.quantity), 0);

    // Total fabric rolls produced up to date D (conversion from raw material)
    const totalProductionWeight = rolls
      .filter((r) => r.production_date <= date)
      .reduce((sum, r) => sum + Number(r.weight || 0), 0);

    // WIP Stock Kgs = Purchases - (RM Stock + Waste + Total Production + Material Sales)
    const wipKgs = Math.max(0, totalPurchasesQty - (totalRmStock + autoWaste + totalProductionWeight + totalMaterialSalesQty));

    // WIP Price = Weighted average rate of purchases
    const wipPrice = totalPurchasesQty > 0 ? totalPurchasesAmount / totalPurchasesQty : 0;
    const wipAmount = wipKgs * wipPrice;

    return {
      stock: wipKgs,
      price: wipPrice,
      amount: wipAmount,
    };
  }, [purchases, rmClosingData, autoWaste, date, rolls, materialSales]);

  // Helper to map stage/department keys to readable names
  const getRmDeptName = (key: string | null | undefined) => {
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
  };

  const getProdStageName = (key: string) => {
    const mapping: Record<string, string> = {
      loom: "Fabric Stock",
      roto_printing: "Roto Printed Products",
      lamination: "Laminated Products",
      offset_printing: "Offset Printed Products",
      finishing: "Finished Products",
    };
    return mapping[key] ?? key;
  };

  const getStageDeptKey = (stage: string) => {
    if (stage === "loom") return "fabric";
    if (stage === "roto_printing") return "roto-printing";
    if (stage === "offset_printing") return "offset-printing";
    return stage;
  };

  // Group both Raw Materials and Products by Department for listing
  const consolidatedItems = useMemo(() => {
    const items: Array<{
      key: string;
      departmentKey: string;
      departmentLabel: string;
      name: string;
      stock: number;
      defaultPrice: number;
      isProduct: boolean;
    }> = [];

    // Add Raw Materials
    rmClosingData.forEach((mat) => {
      if (mat.stock > 0) {
        const deptKey = mat.department || "general";
        const deptLabel = getRmDeptName(deptKey);
        items.push({
          key: `rm-${mat.id}`,
          departmentKey: deptKey,
          departmentLabel: deptLabel,
          name: mat.name,
          stock: mat.stock,
          defaultPrice: mat.price,
          isProduct: false,
        });
      }
    });

    // Add Products grouped/summed by stage
    Object.entries(productClosingData).forEach(([stage, totalWeight]) => {
      if (totalWeight > 0) {
        const deptKey = getStageDeptKey(stage);
        const deptLabel = getRmDeptName(deptKey);
        const name = getProdStageName(stage);
        const defaultPrice = getStageDefaultPrice(stage);

        items.push({
          key: `prod-${stage}`,
          departmentKey: deptKey,
          departmentLabel: deptLabel,
          name: name,
          stock: totalWeight,
          defaultPrice: defaultPrice,
          isProduct: true,
        });
      }
    });

    // Sort by department priority
    const deptOrder = ["fabric", "roto-printing", "lamination", "offset-printing", "finishing", "general"];
    items.sort((a, b) => {
      const idxA = deptOrder.indexOf(a.departmentKey);
      const idxB = deptOrder.indexOf(b.departmentKey);
      if (idxA !== idxB) return idxA - idxB;
      if (a.isProduct !== b.isProduct) return a.isProduct ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    return items;
  }, [rmClosingData, productClosingData, fabricTypes, activeRollsAtD]);

  // Grand totals recalculations with live price inputs
  const totals = useMemo(() => {
    let baseTotal = 0;

    consolidatedItems.forEach((item) => {
      const priceKey = item.key;
      const currentPrice = customPrices[priceKey] !== undefined
        ? Number(customPrices[priceKey] || 0)
        : item.defaultPrice;
      baseTotal += item.stock * currentPrice;
    });

    const wipPrice = customPrices["wip"] !== undefined
      ? Number(customPrices["wip"] || 0)
      : wipData.price;
    const wipVal = wipData.stock * wipPrice;

    baseTotal += wipVal;

    const gstAmount = baseTotal * 0.18;
    const netTotal = baseTotal * 1.18;

    return {
      baseTotal,
      wipAmount: wipVal,
      gstAmount,
      netTotal,
    };
  }, [consolidatedItems, customPrices, wipData]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Closing Stock"
        description="Verify raw material inventory, finished products stages stock, work in progress (WIP), and tax-inclusive valuation."
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <Label htmlFor="date-select" className="font-semibold text-sm shrink-0 text-slate-700">
            Select Stock Date:
          </Label>
          <Input
            id="date-select"
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-44 h-9 text-sm border-slate-200 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="waste-select" className="font-semibold text-sm shrink-0 text-slate-700">
            Waste Quantity (Kgs):
          </Label>
          <Input
            id="waste-select"
            type="number"
            disabled
            value={autoWaste}
            className="w-32 h-9 text-sm border-slate-200 shadow-sm text-right bg-slate-100 font-mono font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200 px-5 py-4">
            <CardTitle className="text-slate-800 text-sm font-bold uppercase tracking-wider">
              Department Wise Closing Stock Table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50 border-b border-slate-200">
                  <TableHead className="font-bold text-slate-700 text-xs">Department</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">RM & Product</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-36">Stock (Kgs / Nos)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-32">Price (₹)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-36">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-sm font-semibold">
                      No stock items found for this date.
                    </TableCell>
                  </TableRow>
                ) : (
                  consolidatedItems.map((item) => {
                    const priceKey = item.key;
                    const defaultPrice = item.defaultPrice;
                    const currentPrice = customPrices[priceKey] !== undefined
                      ? Number(customPrices[priceKey] || 0)
                      : defaultPrice;
                    const amount = item.stock * currentPrice;

                    return (
                      <TableRow key={item.key} className="border-b border-slate-100 hover:bg-slate-50/30">
                        <TableCell className="py-2.5 text-xs text-slate-600 font-medium capitalize">
                          {item.departmentLabel}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs font-bold text-slate-800">
                          {item.name}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs text-slate-700 font-semibold font-mono">
                          {formatNumber(item.stock, 0)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs text-slate-700">
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            className="w-24 h-7 text-right text-xs py-0 px-1 border border-slate-200 focus:border-emerald-500 rounded bg-white shadow-none font-semibold ml-auto font-mono"
                            value={customPrices[priceKey] !== undefined ? customPrices[priceKey] : defaultPrice.toFixed(2)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomPrices((prev) => ({ ...prev, [priceKey]: val }));
                            }}
                          />
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs font-black text-slate-900 font-mono">
                          ₹{formatNumber(amount, 0)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {/* 3. WIP Row */}
                <TableRow className="bg-slate-200/30 border-b border-slate-200 hover:bg-slate-200/30">
                  <TableCell colSpan={5} className="py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Work In Progress
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-200 bg-amber-50/20 hover:bg-amber-50/20">
                  <TableCell className="py-3 text-xs text-slate-550 font-medium">
                    WIP
                  </TableCell>
                  <TableCell className="py-3 text-xs font-black text-amber-900">
                    WORK IN PROGRESS (Purchases - RM - Waste - Sales - Material Sales)
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs text-amber-955 font-bold font-mono">
                    {formatNumber(wipData.stock, 0)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs text-slate-700">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      className="w-24 h-7 text-right text-xs py-0 px-1 border border-slate-200 focus:border-amber-500 rounded bg-white shadow-none font-semibold ml-auto font-mono"
                      value={customPrices["wip"] !== undefined ? customPrices["wip"] : wipData.price.toFixed(2)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomPrices((prev) => ({ ...prev, wip: val }));
                      }}
                    />
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs font-black text-amber-955 font-mono">
                    ₹{formatNumber(totals.wipAmount, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Closing Valuation Card */}
        <Card className="border border-slate-200 shadow-sm overflow-hidden h-fit">
          <CardHeader className="bg-slate-800 text-white border-b border-slate-700 px-5 py-4">
            <CardTitle className="text-white text-sm font-bold uppercase tracking-wider">
              Closing Stock Valuation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 bg-slate-50/50 font-mono">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold uppercase font-sans">Base Stock Value</span>
              <span className="font-bold text-slate-800 text-sm">₹{formatNumber(totals.baseTotal, 0)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold uppercase font-sans">GST Component (18%)</span>
              <span className="font-bold text-slate-800 text-sm">₹{formatNumber(totals.gstAmount, 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-700 font-black uppercase text-sm font-sans">Grand Total (Incl. GST)</span>
              <span className="font-black text-emerald-700 text-lg">₹{formatNumber(totals.netTotal, 0)}</span>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 mt-4 text-[10px] text-emerald-800 leading-normal font-sans">
              <span className="font-bold block uppercase mb-1">Accounting Note:</span>
              Valuations are calculated using the latest historical purchase prices for raw materials, stage product sums, and WIP. Price values can be customized in the inputs above. Grand total is computed as (Base Total * 1.18).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
