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
  const [wasteInput, setWasteInput] = useState<string>("0");
  const today = todayInIndia();

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
      (s) => s.raw_material_id === materialId && s.sale_date > date
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
    // ordered ascending in server component, so the last is the latest
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
      // Either still available today or was sold in the future relative to D
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
        department: mat.department || "General",
        stock,
        price,
        amount,
      };
    });
  }, [rawMaterials, date, purchases, consumptions]);

  // Format Products closing stocks grouped by department (stage)
  const productClosingData = useMemo(() => {
    const groups: Record<string, Array<{ name: string; stock: number; price: number; amount: number }>> = {
      loom: [],
      roto_printing: [],
      lamination: [],
      offset_printing: [],
      finishing: [],
    };

    // Group active rolls by stage and fabric type
    const rollWeights: Record<string, Record<string, number>> = {
      loom: {},
      roto_printing: {},
      lamination: {},
      offset_printing: {},
      finishing: {},
    };

    activeRollsAtD.forEach((roll) => {
      const stage = roll.current_stage || "loom";
      const fabId = roll.fabric_type_id;
      const weight = Number(roll.weight || 0);

      if (!rollWeights[stage]) rollWeights[stage] = {};
      rollWeights[stage][fabId] = (rollWeights[stage][fabId] ?? 0) + weight;
    });

    // Populate the product arrays
    Object.keys(rollWeights).forEach((stage) => {
      Object.keys(rollWeights[stage]).forEach((fabId) => {
        const fab = fabricTypes.find((f) => f.id === fabId);
        const name = fab?.fabric_name || "Unknown Product";
        const price = Number(fab?.selling_price || 0);
        const stock = rollWeights[stage][fabId];
        const amount = stock * price;

        groups[stage].push({ name, stock, price, amount });
      });
    });

    return groups;
  }, [activeRollsAtD, fabricTypes]);

  // WIP calculations
  const wipData = useMemo(() => {
    const waste = Number(wasteInput) || 0;

    // Total raw material purchases up to date D
    const totalPurchasesQty = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((sum, p) => sum + Number(p.quantity), 0);

    const totalPurchasesAmount = purchases
      .filter((p) => p.purchase_date <= date)
      .reduce((sum, p) => sum + Number(p.total_amount), 0);

    // Total raw material stock balances at D
    const totalRmStock = rmClosingData.reduce((sum, mat) => sum + mat.stock, 0);

    // WIP Stock Kgs = Purchases - (RM Stock + Waste)
    const wipKgs = Math.max(0, totalPurchasesQty - (totalRmStock + waste));

    // WIP Price = Weighted average rate of purchases
    const wipPrice = totalPurchasesQty > 0 ? totalPurchasesAmount / totalPurchasesQty : 0;
    const wipAmount = wipKgs * wipPrice;

    return {
      stock: wipKgs,
      price: wipPrice,
      amount: wipAmount,
    };
  }, [purchases, rmClosingData, wasteInput, date]);

  // Grand totals
  const totals = useMemo(() => {
    let baseTotal = 0;

    // Sum Raw Materials
    rmClosingData.forEach((mat) => {
      baseTotal += mat.amount;
    });

    // Sum Products
    Object.values(productClosingData).forEach((list) => {
      list.forEach((prod) => {
        baseTotal += prod.amount;
      });
    });

    // Sum WIP
    baseTotal += wipData.amount;

    const gstAmount = baseTotal * 0.18;
    const netTotal = baseTotal * 1.18;

    return {
      baseTotal: Math.floor(baseTotal),
      gstAmount: Math.floor(gstAmount),
      netTotal: Math.floor(netTotal),
    };
  }, [rmClosingData, productClosingData, wipData]);

  // Helper to map department keys to human-readable names
  const getRmDeptName = (key: string) => {
    const mapping: Record<string, string> = {
      fabric: "Fabric RM",
      "roto-printing": "Roto Printing RM",
      lamination: "Lamination RM",
      "offset-printing": "Offset Printing RM",
      finishing: "Finishing RM",
    };
    return mapping[key] ?? key;
  };

  const getProdStageName = (key: string) => {
    const mapping: Record<string, string> = {
      loom: "Loom Products",
      roto_printing: "Roto Printed Products",
      lamination: "Laminated Products",
      offset_printing: "Offset Printed Products",
      finishing: "Finished Products",
    };
    return mapping[key] ?? key;
  };

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
            min="0"
            placeholder="0"
            value={wasteInput}
            onChange={(e) => setWasteInput(e.target.value)}
            className="w-32 h-9 text-sm border-slate-200 shadow-sm text-right"
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
                  <TableHead className="font-bold text-slate-700 text-xs">RM & Product ID</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-36">Stock (Kgs / Nos)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-32">Price (₹)</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs text-right w-36">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 1. Raw Materials Rows */}
                <TableRow className="bg-slate-200/30 border-b border-slate-200 hover:bg-slate-200/30">
                  <TableCell colSpan={5} className="py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Raw Materials
                  </TableCell>
                </TableRow>
                {rmClosingData.filter(m => m.stock > 0).map((mat) => (
                  <TableRow key={`rm-${mat.id}`} className="border-b border-slate-100 hover:bg-slate-50/30">
                    <TableCell className="py-2.5 text-xs text-slate-500 font-medium capitalize">
                      {getRmDeptName(mat.department)}
                    </TableCell>
                    <TableCell className="py-2.5 text-xs font-bold text-slate-800">
                      {mat.name}
                    </TableCell>
                    <TableCell className="py-2.5 text-right text-xs text-slate-700 font-semibold">
                      {formatNumber(Math.floor(mat.stock), 0)}
                    </TableCell>
                    <TableCell className="py-2.5 text-right text-xs text-slate-700">
                      {formatNumber(mat.price, 2)}
                    </TableCell>
                    <TableCell className="py-2.5 text-right text-xs font-bold text-slate-900">
                      {formatNumber(Math.floor(mat.amount), 0)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* 2. Finished/Stage Products Rows */}
                <TableRow className="bg-slate-200/30 border-b border-slate-200 hover:bg-slate-200/30">
                  <TableCell colSpan={5} className="py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Finished & Stage Products
                  </TableCell>
                </TableRow>
                {Object.keys(productClosingData).map((stage) => {
                  const stageList = productClosingData[stage];
                  return stageList.map((prod, idx) => (
                    <TableRow key={`prod-${stage}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/30">
                      <TableCell className="py-2.5 text-xs text-slate-500 font-medium">
                        {getProdStageName(stage)}
                      </TableCell>
                      <TableCell className="py-2.5 text-xs font-bold text-slate-800">
                        {prod.name}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-xs text-slate-700 font-semibold">
                        {formatNumber(Math.floor(prod.stock), 0)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-xs text-slate-700">
                        {formatNumber(prod.price, 2)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-xs font-bold text-slate-900">
                        {formatNumber(Math.floor(prod.amount), 0)}
                      </TableCell>
                    </TableRow>
                  ));
                })}

                {/* 3. WIP Row */}
                <TableRow className="bg-slate-200/30 border-b border-slate-200 hover:bg-slate-200/30">
                  <TableCell colSpan={5} className="py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Work In Progress
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-200 bg-amber-50/20 hover:bg-amber-50/20">
                  <TableCell className="py-3 text-xs text-slate-500 font-medium">
                    WIP
                  </TableCell>
                  <TableCell className="py-3 text-xs font-black text-amber-900">
                    WORK IN PROGRESS
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs text-amber-950 font-bold">
                    {formatNumber(Math.floor(wipData.stock), 0)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs text-slate-700">
                    {formatNumber(wipData.price, 2)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs font-black text-amber-955">
                    {formatNumber(Math.floor(wipData.amount), 0)}
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
          <CardContent className="p-5 space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold uppercase">Base Stock Value</span>
              <span className="font-bold text-slate-800 text-sm">₹{formatNumber(totals.baseTotal, 0)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold uppercase">GST Component (18%)</span>
              <span className="font-bold text-slate-800 text-sm">₹{formatNumber(totals.gstAmount, 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-700 font-black uppercase text-sm">Grand Total (Incl. GST)</span>
              <span className="font-black text-emerald-700 text-lg">₹{formatNumber(totals.netTotal, 0)}</span>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 mt-4 text-[10px] text-emerald-800 leading-normal">
              <span className="font-bold block uppercase mb-1">Accounting Note:</span>
              Valuations are calculated using the latest historical purchase prices for raw materials, template selling prices for products, and weighted average cost for WIP. Grand total is computed as (Base Total * 1.18).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
