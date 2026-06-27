"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber, todayInIndia, formatDate } from "@/lib/utils";

interface RawMaterial {
  id: string;
  material_name: string;
  unit: string;
  current_stock: string | number;
  department: string | null;
}

interface Purchase {
  id?: string;
  raw_material_id: string;
  purchase_date: string;
  quantity: string | number;
  supplier_name?: string | null;
  bill_number?: string | null;
  rate?: string | number | null;
  total_amount?: string | number | null;
}

interface Consumption {
  raw_material_id: string;
  consumption_date: string;
  quantity: string | number;
}

interface Sale {
  raw_material_id: string;
  sale_date: string;
  quantity: string | number;
}

interface MaterialSale {
  id: string;
  type: string; // 'raw_material' | 'waste'
  department: string | null;
  raw_material_id: string | null;
  sale_date: string;
  quantity: string | number;
  bill_number: string | null;
  customers: { customer_name: string | null; alias: string | null } | null;
}

interface FabricType {
  id: string;
  fabric_name: string;
}

interface FabricRoll {
  id: string;
  roll_number: string;
  fabric_type_id: string;
  weight: string | number;
  production_date: string;
  status: string;
  current_stage: string;
}

interface SalesOrder {
  id: string;
  order_number?: string | null;
  order_date: string;
  status: string;
  bill_number: string | null;
  bill_value?: number | null;
  customer_id: string;
  customers: {
    customer_name: string | null;
    alias: string | null;
  } | null;
  sales_order_items: Array<{
    id: string;
    department: string;
    product_id: string;
    quantity: number | string;
    selected_roll_ids: string[] | null;
  }> | null;
}

interface RotoProduct {
  id: string;
  brand: string;
  width: number;
  height: number;
}

interface OffsetProduct {
  id: string;
  brand: string;
  width: number;
  height: number;
}

interface StockReportClientProps {
  from: string;
  to: string;
  rawMaterials: RawMaterial[];
  purchases: Purchase[];
  consumptions: Consumption[];
  sales: Sale[];
  fabricTypes: FabricType[];
  rolls: FabricRoll[];
  salesOrders: SalesOrder[];
  materialSales: MaterialSale[];
  rotoProducts?: RotoProduct[];
  offsetProducts?: OffsetProduct[];
}

export function StockReportClient({
  from,
  to,
  rawMaterials,
  purchases,
  consumptions,
  sales,
  fabricTypes,
  rolls,
  salesOrders,
  materialSales,
  rotoProducts = [],
  offsetProducts = [],
}: StockReportClientProps) {
  const [activeSection, setActiveSection] = useState<"raw_material" | "stock" | "sale" | "clients">("raw_material");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedBills, setExpandedBills] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandBill = (billId: string) => {
    setExpandedBills((prev) => ({ ...prev, [billId]: !prev[billId] }));
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

  const getStageDeptKey = (stage: string) => {
    if (stage === "loom") return "fabric";
    if (stage === "roto_printing") return "roto-printing";
    if (stage === "offset_printing") return "offset-printing";
    return stage;
  };

  // -------------------------------------------------------------
  // Data Processors
  // -------------------------------------------------------------

  const getProductName = (dept: string, productId: string) => {
    if (dept === "fabric") {
      const f = fabricTypes.find((x) => x.id === productId);
      return f ? f.fabric_name : "Fabric Product";
    } else if (dept === "roto-printing") {
      const r = rotoProducts?.find((x) => x.id === productId);
      return r ? `${r.brand} (${r.width}x${r.height} mm)` : "Roto Product";
    } else if (dept === "offset-printing") {
      const o = offsetProducts?.find((x) => x.id === productId);
      return o ? `${o.brand} (${o.width}x${o.height} in)` : "Offset Product";
    } else if (dept === "lamination") {
      return productId === "lam-film-25" ? "Laminated Film 2.5 mil" : "Laminated Film 3.0 mil";
    } else if (dept === "finishing") {
      return productId === "finished-bags-28" ? "Finished Bags W-28" : "Finished Bags W-32";
    }
    return "Unknown Product";
  };

  const clientsData = useMemo(() => {
    const relevantOrders = salesOrders.filter((order) => {
      if (order.status === "draft") return false;
      return order.order_date >= from && order.order_date <= to;
    });

    const relevantPurchases = purchases.filter((p) => {
      return p.purchase_date >= from && p.purchase_date <= to;
    });

    const firmGroupMap: Record<string, {
      customerId: string;
      customerName: string;
      totalKg: number;
      totalRolls: number;
      totalPurchasedKg: number;
      orders: Array<{
        id: string;
        orderNumber: string;
        billNumber: string;
        orderDate: string;
        items: Array<{
          id: string;
          department: string;
          productName: string;
          quantity: number;
          weightKg: number;
          rollsCount: number;
          isFabric: boolean;
        }>;
      }>;
      incomingPurchases: Array<{
        id: string;
        billNumber: string;
        date: string;
        materialName: string;
        quantity: number;
        rate: number;
        totalAmount: number;
      }>;
    }> = {};

    const getOrCreateFirmGroup = (name: string, custId?: string) => {
      const key = name.trim().toLowerCase();
      if (!firmGroupMap[key]) {
        firmGroupMap[key] = {
          customerId: custId || name,
          customerName: name.trim(),
          totalKg: 0,
          totalRolls: 0,
          totalPurchasedKg: 0,
          orders: [],
          incomingPurchases: [],
        };
      } else if (custId && firmGroupMap[key].customerId === name) {
        firmGroupMap[key].customerId = custId;
      }
      return firmGroupMap[key];
    };

    relevantOrders.forEach((order) => {
      const custName = order.customers?.customer_name ?? "Unknown Customer";
      const firm = getOrCreateFirmGroup(custName, order.customer_id);

      const orderItems = (order.sales_order_items ?? []).map((item) => {
        const isFabric = item.department === "fabric";
        let weightKg = 0;
        let rollsCount = 0;

        if (isFabric) {
          const rollIds = item.selected_roll_ids ?? [];
          rollsCount = rollIds.length;
          rollIds.forEach((rid) => {
            const r = rolls.find((roll) => roll.id === rid);
            if (r) {
              weightKg += Number(r.weight ?? 0);
            }
          });
        } else {
          weightKg = Number(item.quantity ?? 0);
        }

        const productName = getProductName(item.department, item.product_id);

        return {
          id: item.id,
          department: item.department,
          productName,
          quantity: Number(item.quantity ?? 0),
          weightKg,
          rollsCount,
          isFabric,
        };
      });

      const orderTotalKg = orderItems.reduce((sum, item) => sum + item.weightKg, 0);
      const orderTotalRolls = orderItems.reduce((sum, item) => sum + item.rollsCount, 0);

      firm.totalKg += orderTotalKg;
      firm.totalRolls += orderTotalRolls;

      firm.orders.push({
        id: order.id,
        orderNumber: order.order_number || "-",
        billNumber: order.bill_number || order.order_number || "No Bill",
        orderDate: order.order_date,
        items: orderItems,
      });
    });

    relevantPurchases.forEach((p) => {
      const supplierName = p.supplier_name ?? "Unknown Supplier";
      const firm = getOrCreateFirmGroup(supplierName);

      const mat = rawMaterials.find((r) => r.id === p.raw_material_id);
      const materialName = mat ? `${mat.material_name} (${mat.unit})` : "Raw Material";

      const qty = Number(p.quantity ?? 0);
      firm.totalPurchasedKg += qty;

      firm.incomingPurchases.push({
        id: p.id || Math.random().toString(),
        billNumber: p.bill_number || "No Bill",
        date: p.purchase_date,
        materialName,
        quantity: qty,
        rate: Number(p.rate ?? 0),
        totalAmount: Number(p.total_amount ?? 0),
      });
    });

    materialSales.forEach((sale) => {
      if (sale.sale_date >= from && sale.sale_date <= to) {
        const custName = sale.customers?.customer_name ?? "Unknown Customer";
        const firm = getOrCreateFirmGroup(custName);

        const qty = Number(sale.quantity ?? 0);
        firm.totalKg += qty;

        const isWaste = sale.type === "waste";
        let productName = "Waste Material";
        if (sale.type === "raw_material" && sale.raw_material_id) {
          const mat = rawMaterials.find((r) => r.id === sale.raw_material_id);
          productName = mat ? `${mat.material_name} (${mat.unit})` : "Raw Material";
        }

        firm.orders.push({
          id: sale.id,
          orderNumber: sale.bill_number || "-",
          billNumber: sale.bill_number || "No Bill",
          orderDate: sale.sale_date,
          items: [{
            id: sale.id,
            department: isWaste ? "waste" : (sale.department || "general"),
            productName: productName,
            quantity: qty,
            weightKg: qty,
            rollsCount: 0,
            isFabric: false,
          }]
        });
      }
    });

    return Object.values(firmGroupMap).sort((a, b) => a.customerName.localeCompare(b.customerName));
  }, [salesOrders, rolls, purchases, rawMaterials, from, to, rotoProducts, offsetProducts, fabricTypes, materialSales]);

  // Section 1: Raw Materials
  const rawMaterialData = useMemo(() => {
    return rawMaterials.map((material) => {
      const matId = material.id;
      const currentStock = Number(material.current_stock ?? 0);

      const matPurchases = purchases.filter((p) => p.raw_material_id === matId);
      const matConsumptions = consumptions.filter((c) => c.raw_material_id === matId);
      const matSales = sales.filter((s) => s.raw_material_id === matId);

      let totalPurchaseInRange = 0;
      let totalConsumptionInRange = 0;

      const purchasesByDate: Record<string, number> = {};
      const consumptionsByDate: Record<string, number> = {};
      const salesByDate: Record<string, number> = {};

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

      matSales.forEach((s) => {
        const qty = Number(s.quantity);
        const date = s.sale_date;
        salesByDate[date] = (salesByDate[date] ?? 0) + qty;
      });

      // Backtrack available stock calculations
      const backtrackStart = from > today ? today : from;
      const datesToBacktrack = getDatesInRange(backtrackStart, today);

      const availableByDate: Record<string, number> = {};
      let runningStock = currentStock;

      for (let i = datesToBacktrack.length - 1; i >= 0; i--) {
        const d = datesToBacktrack[i];
        availableByDate[d] = runningStock;
        const p = purchasesByDate[d] ?? 0;
        const c = consumptionsByDate[d] ?? 0;
        const s = salesByDate[d] ?? 0;
        runningStock = runningStock - p + c + s;
      }

      let availableAtTo = currentStock;
      if (to < today) {
        availableAtTo = availableByDate[to] !== undefined ? availableByDate[to] : runningStock;
      }

      const dailyRecords = selectedDates.map((date) => {
        const p = purchasesByDate[date] ?? 0;
        const c = consumptionsByDate[date] ?? 0;
        const s = salesByDate[date] ?? 0;
        const a = availableByDate[date] !== undefined ? availableByDate[date] : (date > today ? currentStock : runningStock);

        return {
          date,
          purchase: Math.floor(p),
          consumption: Math.floor(c),
          sale: Math.floor(s),
          available: Math.floor(a),
        };
      }).filter(r => r.purchase > 0 || r.consumption > 0 || r.sale > 0);

      return {
        id: material.id,
        name: material.material_name,
        department: material.department || "general",
        departmentLabel: getRmDeptName(material.department),
        totalPurchase: Math.floor(totalPurchaseInRange),
        totalConsumption: Math.floor(totalConsumptionInRange),
        available: Math.max(0, Math.floor(availableAtTo)),
        dailyRecords,
      };
    });
  }, [rawMaterials, purchases, consumptions, sales, from, to, selectedDates, today]);

  // Map Sales Order items for quick lookup (Sold roll details)
  const rollDetailsMap = useMemo(() => {
    const soldDateMap: Record<string, string> = {};
    const customerMap: Record<string, string> = {};
    const billMap: Record<string, string> = {};
    const orderIdMap: Record<string, string> = {};

    salesOrders.forEach((order) => {
      if (order.status === "confirmed" && order.bill_number) {
        const clientName = order.customers?.customer_name ?? "Unknown";
        const alias = order.customers?.alias;
        const displayName = alias ? `${clientName} (${alias})` : clientName;

        order.sales_order_items?.forEach((item) => {
          if (item.selected_roll_ids) {
            item.selected_roll_ids.forEach((rollId) => {
              soldDateMap[rollId] = order.order_date;
              customerMap[rollId] = displayName;
              billMap[rollId] = order.bill_number || "-";
              orderIdMap[rollId] = order.id;
            });
          }
        });
      }
    });

    return { soldDateMap, customerMap, billMap, orderIdMap };
  }, [salesOrders]);

  // Section 2: Stock (Available fabric rolls, grouped by department/stage)
  const stockProductData = useMemo(() => {
    const activeRolls = rolls.filter((roll) => {
      if (roll.production_date > to) return false;
      const soldDate = rollDetailsMap.soldDateMap[roll.id];
      return roll.status === "available" || (soldDate && soldDate > to);
    });

    // Group by stage/department
    const deptGroups: Record<string, { departmentKey: string; departmentLabel: string; totalStock: number }> = {};
    activeRolls.forEach((roll) => {
      const stage = roll.current_stage || "loom";
      const deptKey = getStageDeptKey(stage);
      if (!deptGroups[deptKey]) {
        deptGroups[deptKey] = {
          departmentKey: deptKey,
          departmentLabel: getRmDeptName(deptKey),
          totalStock: 0,
        };
      }
      deptGroups[deptKey].totalStock += Number(roll.weight || 0);
    });

    const deptOrder = ["fabric", "roto-printing", "lamination", "offset-printing", "finishing"];
    return Object.values(deptGroups)
      .filter((d) => d.totalStock > 0)
      .map((d) => ({ ...d, totalStock: Math.floor(d.totalStock) }))
      .sort((a, b) => deptOrder.indexOf(a.departmentKey) - deptOrder.indexOf(b.departmentKey));
  }, [rolls, to, rollDetailsMap]);

  // Section 3: Sale (Sales of products in range)
  const saleProductData = useMemo(() => {
    const soldRolls = rolls.filter((roll) => {
      const soldDate = rollDetailsMap.soldDateMap[roll.id];
      return soldDate && soldDate >= from && soldDate <= to;
    });

    const deptGroups: Record<string, {
      departmentKey: string;
      departmentLabel: string;
      totalSales: number;
      rolls: FabricRoll[];
    }> = {};

    soldRolls.forEach((roll) => {
      const stage = roll.current_stage || "loom";
      const deptKey = getStageDeptKey(stage);

      if (!deptGroups[deptKey]) {
        deptGroups[deptKey] = {
          departmentKey: deptKey,
          departmentLabel: getRmDeptName(deptKey),
          totalSales: 0,
          rolls: [],
        };
      }
      deptGroups[deptKey].totalSales += Number(roll.weight || 0);
      deptGroups[deptKey].rolls.push(roll);
    });

    return Object.values(deptGroups).map((dept) => {
      const orderRollsMap: Record<string, FabricRoll[]> = {};
      dept.rolls.forEach((roll) => {
        const orderId = rollDetailsMap.orderIdMap[roll.id];
        if (orderId) {
          if (!orderRollsMap[orderId]) {
            orderRollsMap[orderId] = [];
          }
          orderRollsMap[orderId].push(roll);
        }
      });

      const bills = Object.entries(orderRollsMap).map(([orderId, rollsInOrder]) => {
        const order = salesOrders.find((o) => o.id === orderId);
        const billNumber = order?.bill_number || "Draft/None";
        const clientName = order ? (order.customers?.customer_name ?? "Unknown") : "Unknown";
        const alias = order?.customers?.alias;
        const clientDisplay = alias ? `${clientName} (${alias})` : clientName;
        const billValue = Number(order?.bill_value ?? 0);

        const productMap: Record<string, {
          fabricTypeId: string;
          productName: string;
          totalKGs: number;
          rolls: Array<{ rollNumber: string; weight: number }>;
        }> = {};

        rollsInOrder.forEach((roll) => {
          const fabId = roll.fabric_type_id;
          if (!productMap[fabId]) {
            const fab = fabricTypes.find((f) => f.id === fabId);
            productMap[fabId] = {
              fabricTypeId: fabId,
              productName: fab?.fabric_name || "Unknown Product",
              totalKGs: 0,
              rolls: [],
            };
          }
          productMap[fabId].totalKGs += Number(roll.weight || 0);
          productMap[fabId].rolls.push({
            rollNumber: roll.roll_number,
            weight: Number(roll.weight || 0),
          });
        });

        const totalDeptKGsInBill = rollsInOrder.reduce((sum, r) => sum + Number(r.weight || 0), 0);

        return {
          orderId,
          billNumber,
          clientName: clientDisplay,
          billValue,
          totalDeptKGsInBill: Math.floor(totalDeptKGsInBill),
          products: Object.values(productMap).map((p) => ({
            ...p,
            totalKGs: Math.floor(p.totalKGs),
          })),
        };
      }).sort((a, b) => a.billNumber.localeCompare(b.billNumber));

      return {
        id: dept.departmentKey,
        departmentLabel: dept.departmentLabel,
        totalSales: Math.floor(dept.totalSales),
        bills,
      };
    }).filter(d => d.totalSales > 0);
  }, [rolls, fabricTypes, from, to, rollDetailsMap, salesOrders]);

  // Material Sales grouped: RM sales by dept + Waste as own dept
  const materialSaleData = useMemo(() => {
    const DEPT_ORDER_MAT = ["fabric", "roto-printing", "lamination", "offset-printing", "finishing", "general", "__waste__"];

    const groups: Record<string, {
      id: string;
      departmentLabel: string;
      isWaste: boolean;
      totalQty: number;
      entries: Array<{ id: string; bill_number: string | null; clientName: string; qty: number; date: string }>;
    }> = {};

    materialSales.forEach((ms) => {
      const qty = Number(ms.quantity || 0);
      const clientName = ms.customers
        ? (ms.customers.alias
          ? `${ms.customers.customer_name} (${ms.customers.alias})`
          : ms.customers.customer_name ?? "Unknown")
        : "Unknown";

      if (ms.type === "waste") {
        if (!groups["__waste__"]) {
          groups["__waste__"] = { id: "__waste__", departmentLabel: "Waste", isWaste: true, totalQty: 0, entries: [] };
        }
        groups["__waste__"].totalQty += qty;
        groups["__waste__"].entries.push({ id: ms.id, bill_number: ms.bill_number, clientName, qty: Math.floor(qty), date: ms.sale_date });
      } else if (ms.type === "raw_material") {
        const deptKey = ms.department ? getRmDeptName(ms.department) : "General";
        const groupKey = `rm-dept-${deptKey}`;
        if (!groups[groupKey]) {
          groups[groupKey] = { id: groupKey, departmentLabel: `${deptKey} (RM Sale)`, isWaste: false, totalQty: 0, entries: [] };
        }
        groups[groupKey].totalQty += qty;
        groups[groupKey].entries.push({ id: ms.id, bill_number: ms.bill_number, clientName, qty: Math.floor(qty), date: ms.sale_date });
      }
    });

    return Object.values(groups)
      .filter((g) => g.totalQty > 0)
      .map((g) => ({ ...g, totalQty: Math.floor(g.totalQty) }))
      .sort((a, b) => {
        const ka = a.isWaste ? "__waste__" : a.id;
        const kb = b.isWaste ? "__waste__" : b.id;
        return DEPT_ORDER_MAT.indexOf(ka) - DEPT_ORDER_MAT.indexOf(kb);
      });
  }, [materialSales]);

  // -------------------------------------------------------------
  // Totals calculations
  // -------------------------------------------------------------

  const rawMaterialsTotals = useMemo(() => {
    return {
      purchases: rawMaterialData.reduce((sum, r) => sum + r.totalPurchase, 0),
      consumptions: rawMaterialData.reduce((sum, r) => sum + r.totalConsumption, 0),
      available: rawMaterialData.reduce((sum, r) => sum + r.available, 0),
    };
  }, [rawMaterialData]);

  const stockTotals = useMemo(() => {
    return stockProductData.reduce((sum, r) => sum + r.totalStock, 0);
  }, [stockProductData]);

  const saleTotals = useMemo(() => {
    const productTotal = saleProductData.reduce((sum, r) => sum + r.totalSales, 0);
    const materialTotal = materialSaleData.reduce((sum, r) => sum + r.totalQty, 0);
    return productTotal + materialTotal;
  }, [saleProductData, materialSaleData]);

  return (
    <div className="space-y-6 large-erp-page">
      <PageHeader
        title="Stock Report"
        description="Verify raw material ledger transactions, check product available stocks, and review sales logs."
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
        {/* Tab Selection */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white p-1">
          <button
            onClick={() => {
              setActiveSection("raw_material");
              setExpanded({});
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
              activeSection === "raw_material"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Raw Material
          </button>
          <button
            onClick={() => {
              setActiveSection("stock");
              setExpanded({});
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
              activeSection === "stock"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Stock
          </button>
          <button
            onClick={() => {
              setActiveSection("sale");
              setExpanded({});
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
              activeSection === "sale"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Sale
          </button>
          <button
            onClick={() => {
              setActiveSection("clients");
              setExpanded({});
              setExpandedBills({});
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
              activeSection === "clients"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Clients
          </button>
        </div>

        <DateRangeFilter from={from} to={to} baseUrl="/reports/stock" />
      </div>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* SECTION 1: Raw Materials */}
          {activeSection === "raw_material" && (
            <>
              {rawMaterialData.length === 0 ? (
                <EmptyState title="No Raw Materials Found" description="Select a date range with transaction activity." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="font-semibold text-slate-700">Department</TableHead>
                      <TableHead className="font-semibold text-slate-700">Raw Material</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-44">Total Purchase (KGs)</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-44">Total Consumption (KGs)</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-44">Available (KGs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawMaterialData.map((material) => {
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
                            <TableCell className="text-slate-600 font-medium py-3 capitalize">{material.departmentLabel}</TableCell>
                            <TableCell className="font-bold text-slate-900 py-3">{material.name}</TableCell>
                            <TableCell className="text-right text-slate-950 font-medium py-3">
                              {formatNumber(material.totalPurchase, 0)}
                            </TableCell>
                            <TableCell className="text-right text-slate-950 font-medium py-3">
                              {formatNumber(material.totalConsumption, 0)}
                            </TableCell>
                            <TableCell className="text-right text-slate-950 font-bold py-3">
                              {formatNumber(material.available, 0)}
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                              <TableCell colSpan={6} className="p-4">
                                <div className="rounded-lg border border-slate-200 bg-white shadow-inner overflow-hidden max-w-3xl mx-auto my-2">
                                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                      Ledger: Purchases, Consumptions & Sales for {material.name}
                                    </span>
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-50 border-b border-slate-200">
                                        <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Purchase (KGs)</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Consumption (KGs)</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Sale (KGs)</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Available (KGs)</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {material.dailyRecords.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={5} className="text-center py-4 text-slate-400 text-xs font-semibold">
                                            No daily transaction history in selected range.
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        material.dailyRecords.map((record) => (
                                          <TableRow key={record.date} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                            <TableCell className="py-2 text-slate-700 font-medium text-xs">
                                              {record.date}
                                            </TableCell>
                                            <TableCell className="py-2 text-right text-slate-900 text-xs">
                                              {record.purchase > 0 ? formatNumber(record.purchase, 0) : "-"}
                                            </TableCell>
                                            <TableCell className="py-2 text-right text-slate-900 text-xs">
                                              {record.consumption > 0 ? formatNumber(record.consumption, 0) : "-"}
                                            </TableCell>
                                            <TableCell className="py-2 text-right text-rose-600 font-semibold text-xs">
                                              {record.sale > 0 ? formatNumber(record.sale, 0) : "-"}
                                            </TableCell>
                                            <TableCell className="py-2 text-right text-slate-900 font-bold text-xs">
                                              {formatNumber(record.available, 0)}
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

                    {/* Totals Row */}
                    <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300 hover:bg-slate-100">
                      <TableCell></TableCell>
                      <TableCell colSpan={2} className="py-3 text-slate-900 font-bold text-right uppercase">Total Raw Materials</TableCell>
                      <TableCell className="text-right text-slate-950 py-3">{formatNumber(rawMaterialsTotals.purchases, 0)}</TableCell>
                      <TableCell className="text-right text-slate-950 py-3">{formatNumber(rawMaterialsTotals.consumptions, 0)}</TableCell>
                      <TableCell className="text-right text-slate-950 py-3">{formatNumber(rawMaterialsTotals.available, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </>
          )}

          {/* SECTION 2: Stock (department-wise available rolls in KGs) */}
          {activeSection === "stock" && (
            <>
              {stockProductData.length === 0 ? (
                <EmptyState title="No Available Stocks" description="No products are registered as available for this date." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Department</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-64">Available Stock (KGs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockProductData.map((item) => (
                      <TableRow
                        key={item.departmentKey}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-semibold text-slate-800 py-3.5 capitalize">{item.departmentLabel}</TableCell>
                        <TableCell className="text-right text-slate-950 font-bold py-3.5 font-mono text-sm">
                          {formatNumber(item.totalStock, 0)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Total Row */}
                    <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300 hover:bg-slate-100">
                      <TableCell className="py-3 text-slate-900 font-bold text-right uppercase">Total Available Stock</TableCell>
                      <TableCell className="text-right text-slate-950 py-3 font-black font-mono text-sm">{formatNumber(stockTotals, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </>
          )}

          {/* SECTION 3: Sale (Product sales + Material sales) */}
          {activeSection === "sale" && (
            <>
              {saleProductData.length === 0 && materialSaleData.length === 0 ? (
                <EmptyState title="No Sales Recorded" description="No sales invoices were submitted in this date range." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="font-semibold text-slate-700">Department / Type</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-64">Total Sales (KGs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {/* ── Product Sales (Fabric Rolls) ── */}
                    {saleProductData.length > 0 && (
                      <TableRow className="bg-slate-100/60 hover:bg-slate-100/60 border-b border-slate-200">
                        <TableCell colSpan={3} className="py-1.5 px-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Product Sales (Rolls)
                        </TableCell>
                      </TableRow>
                    )}
                    {saleProductData.map((item) => {
                      const isExpanded = expanded[item.id];
                      return (
                        <>
                          <TableRow
                            key={item.id}
                            onClick={() => toggleExpand(item.id)}
                            className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200"
                          >
                            <TableCell className="py-3 px-4">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </TableCell>
                            <TableCell className="font-bold text-slate-900 py-3 capitalize pl-8">{item.departmentLabel}</TableCell>
                            <TableCell className="text-right text-slate-950 font-bold py-3">
                              {formatNumber(item.totalSales, 0)}
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                              <TableCell colSpan={3} className="p-4">
                                <div className="rounded-lg border border-slate-200 bg-white shadow-inner overflow-hidden max-w-4xl mx-auto my-2">
                                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                      Sales Bills for {item.departmentLabel}
                                    </span>
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-50 border-b border-slate-200">
                                        <TableHead className="w-10"></TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600">Bill Number</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600">Client</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Dept Weight (KGs)</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Bill Value</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {item.bills.map((bill) => {
                                        const isBillExpanded = expandedBills[bill.orderId];
                                        return (
                                          <>
                                            <TableRow
                                              key={bill.orderId}
                                              onClick={() => toggleExpandBill(bill.orderId)}
                                              className="cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-0"
                                            >
                                              <TableCell className="py-2 px-3">
                                                {isBillExpanded ? (
                                                  <ChevronDown className="h-3.5 w-3.5 text-slate-550" />
                                                ) : (
                                                  <ChevronRight className="h-3.5 w-3.5 text-slate-550" />
                                                )}
                                              </TableCell>
                                              <TableCell className="py-2 text-slate-800 font-bold text-xs">{bill.billNumber}</TableCell>
                                              <TableCell className="py-2 text-slate-700 font-semibold text-xs">{bill.clientName}</TableCell>
                                              <TableCell className="py-2 text-right text-slate-600 text-xs font-medium">{formatNumber(bill.totalDeptKGsInBill, 0)} KGs</TableCell>
                                              <TableCell className="py-2 text-right text-slate-900 font-black text-xs">₹{formatNumber(bill.billValue, 2)}</TableCell>
                                            </TableRow>
                                            {isBillExpanded && (
                                              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                                <TableCell colSpan={5} className="p-3">
                                                  <div className="rounded border border-slate-200 bg-white overflow-hidden max-w-2xl mx-auto my-1">
                                                    <div className="bg-slate-100/70 px-3 py-1.5 border-b border-slate-200">
                                                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                        Bill Roll Details ({item.departmentLabel})
                                                      </span>
                                                    </div>
                                                    <Table>
                                                      <TableHeader>
                                                        <TableRow className="bg-white border-b border-slate-150">
                                                          <TableHead className="text-[10px] py-1.5 font-semibold text-slate-500">Product</TableHead>
                                                          <TableHead className="text-[10px] py-1.5 font-semibold text-slate-500">Rolls</TableHead>
                                                          <TableHead className="text-[10px] py-1.5 font-semibold text-slate-500 text-right">Weight (KGs)</TableHead>
                                                        </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                        {bill.products.map((p) => (
                                                          <TableRow key={p.fabricTypeId} className="border-b border-slate-100 last:border-0 hover:bg-white/40">
                                                            <TableCell className="py-1 text-[11px] font-bold text-slate-800">{p.productName}</TableCell>
                                                            <TableCell className="py-1 text-[10px] text-slate-600 break-all max-w-xs">
                                                              {p.rolls.map((r) => `${r.rollNumber} (${r.weight} kg)`).join(", ")}
                                                            </TableCell>
                                                            <TableCell className="py-1 text-right text-[11px] font-bold text-slate-900">{formatNumber(p.totalKGs, 0)} KGs</TableCell>
                                                          </TableRow>
                                                        ))}
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
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}

                    {/* ── Material Sales (RM by dept + Waste) ── */}
                    {materialSaleData.length > 0 && (
                      <TableRow className="bg-slate-100/60 hover:bg-slate-100/60 border-b border-slate-200">
                        <TableCell colSpan={3} className="py-1.5 px-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Material Sales (Raw Material &amp; Waste)
                        </TableCell>
                      </TableRow>
                    )}
                    {materialSaleData.map((group) => {
                      const isExpanded = expanded[group.id];
                      const rowBg = group.isWaste ? "bg-rose-50/30" : "";
                      return (
                        <>
                          <TableRow
                            key={group.id}
                            onClick={() => toggleExpand(group.id)}
                            className={`cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200 ${rowBg}`}
                          >
                            <TableCell className="py-3 px-4">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </TableCell>
                            <TableCell className={`font-bold py-3 pl-8 ${
                              group.isWaste ? "text-rose-700" : "text-slate-900"
                            }`}>
                              {group.departmentLabel}
                            </TableCell>
                            <TableCell className={`text-right font-bold py-3 ${
                              group.isWaste ? "text-rose-700" : "text-slate-950"
                            }`}>
                              {formatNumber(group.totalQty, 0)}
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                              <TableCell colSpan={3} className="p-4">
                                <div className="rounded-lg border border-slate-200 bg-white shadow-inner overflow-hidden max-w-3xl mx-auto my-2">
                                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                      {group.departmentLabel} — Entries
                                    </span>
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-50 border-b border-slate-200">
                                        <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600">Bill No.</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600">Client</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-600 text-right">Qty (KGs)</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {group.entries.map((entry) => (
                                        <TableRow key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                          <TableCell className="py-2 text-xs text-slate-600">{entry.date}</TableCell>
                                          <TableCell className="py-2 text-xs font-bold text-slate-800">{entry.bill_number ?? "—"}</TableCell>
                                          <TableCell className="py-2 text-xs text-slate-700">{entry.clientName}</TableCell>
                                          <TableCell className="py-2 text-right text-xs font-bold text-slate-900">{formatNumber(entry.qty, 0)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}

                    {/* Grand Total */}
                    <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300 hover:bg-slate-100">
                      <TableCell></TableCell>
                      <TableCell className="py-3 text-slate-900 font-bold text-right uppercase">Total Sales</TableCell>
                    <TableCell className="text-right text-slate-950 py-3">{formatNumber(saleTotals, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </>
          )}
          {/* SECTION 4: Clients */}
          {activeSection === "clients" && (
            <>
              {clientsData.length === 0 ? (
                <EmptyState title="No Client Data Found" description="No client sales or purchases are recorded in this date range." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="font-semibold text-slate-700">Firm Name</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-40">Total Purchased (KGs)</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-40">Total Dispatched (KGs)</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-40">Total Fabric Rolls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData.map((client) => {
                      const isClientExpanded = expanded[client.customerId];
                      return (
                        <>
                          <TableRow
                            key={client.customerId}
                            onClick={() => toggleExpand(client.customerId)}
                            className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200"
                          >
                            <TableCell className="py-3 px-4">
                              {isClientExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </TableCell>
                            <TableCell className="font-bold text-slate-900 py-3">{client.customerName}</TableCell>
                            <TableCell className="text-right text-slate-950 font-bold py-3">
                              {client.totalPurchasedKg > 0 ? `${formatNumber(client.totalPurchasedKg, 2)} kg` : "—"}
                            </TableCell>
                            <TableCell className="text-right text-slate-950 font-bold py-3">
                              {client.totalKg > 0 ? `${formatNumber(client.totalKg, 2)} kg` : "—"}
                            </TableCell>
                            <TableCell className="text-right text-slate-950 font-bold py-3">
                              {client.totalRolls > 0 ? client.totalRolls : "—"}
                            </TableCell>
                          </TableRow>

                          {isClientExpanded && (
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                              <TableCell colSpan={5} className="p-4">
                                <div className="rounded-lg border border-slate-200 bg-white shadow-inner overflow-hidden max-w-5xl mx-auto my-2 p-4 space-y-5">
                                  
                                  {/* --- Purchases Section --- */}
                                  {client.incomingPurchases.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                                        Raw Material Purchases (Incoming)
                                      </div>
                                      <div className="overflow-x-auto border rounded-lg bg-white">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-slate-50 border-b border-slate-200">
                                              <TableHead className="text-xs font-semibold text-slate-600 pl-4">Bill Number</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600">Raw Material</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600 text-right">Quantity</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600 text-right">Rate</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600 text-right pr-4">Total Amount</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {client.incomingPurchases.map((purchase) => (
                                              <TableRow key={purchase.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-xs">
                                                <TableCell className="font-semibold text-slate-800 pl-4">{purchase.billNumber}</TableCell>
                                                <TableCell className="text-slate-600">{formatDate(purchase.date)}</TableCell>
                                                <TableCell className="font-semibold text-slate-700">{purchase.materialName}</TableCell>
                                                <TableCell className="text-right font-mono font-semibold">{formatNumber(purchase.quantity, 2)}</TableCell>
                                                <TableCell className="text-right font-mono">₹{formatNumber(purchase.rate, 2)}</TableCell>
                                                <TableCell className="text-right font-mono font-semibold pr-4">₹{formatNumber(purchase.totalAmount, 2)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  )}

                                  {/* --- Sales Section --- */}
                                  {client.orders.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                        Sales / Product Dispatches
                                      </div>
                                      <div className="overflow-x-auto border rounded-lg bg-white">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-slate-50 border-b border-slate-200">
                                              <TableHead className="w-10"></TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600">Bill / Dispatch No</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600 text-right">Total Weight (KGs)</TableHead>
                                              <TableHead className="text-xs font-semibold text-slate-600 text-right pr-4">Total Fabric Rolls</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {client.orders.map((order) => {
                                              const isBillExpanded = expandedBills[order.id];
                                              const orderTotalKg = order.items.reduce((sum, it) => sum + it.weightKg, 0);
                                              const orderTotalRolls = order.items.reduce((sum, it) => sum + it.rollsCount, 0);
                                              
                                              return (
                                                <>
                                                  <TableRow
                                                    key={order.id}
                                                    onClick={() => toggleExpandBill(order.id)}
                                                    className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200"
                                                  >
                                                    <TableCell className="py-2.5 px-4">
                                                      {isBillExpanded ? (
                                                        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                                                      ) : (
                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                                                      )}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-slate-800">{order.billNumber}</TableCell>
                                                    <TableCell className="text-slate-600">{formatDate(order.orderDate)}</TableCell>
                                                    <TableCell className="text-right font-semibold text-slate-800">{formatNumber(orderTotalKg, 2)} kg</TableCell>
                                                    <TableCell className="text-right font-semibold text-slate-800 pr-4">{orderTotalRolls || "—"}</TableCell>
                                                  </TableRow>

                                                  {isBillExpanded && (
                                                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                                      <TableCell colSpan={5} className="p-3">
                                                        <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden max-w-4xl mx-auto my-1">
                                                          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex justify-between">
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                              Bill Details: {order.billNumber}
                                                            </span>
                                                          </div>
                                                          <table className="w-full border-collapse text-left text-xs">
                                                            <thead>
                                                              <tr className="bg-slate-100/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b">
                                                                <th className="p-2 pl-4">Department</th>
                                                                <th className="p-2">Product Name</th>
                                                                <th className="p-2 text-right">Dispatched Qty</th>
                                                                <th className="p-2 text-right">Calculated Kg</th>
                                                                <th className="p-2 text-right pr-4">Rolls Count</th>
                                                              </tr>
                                                            </thead>
                                                            <tbody className="divide-y text-xs text-slate-700">
                                                              {order.items.map((item) => (
                                                                <tr key={item.id} className="hover:bg-slate-50/50">
                                                                  <td className="p-2 pl-4 capitalize font-medium text-slate-600">{item.department.replace("-", " ")}</td>
                                                                  <td className="p-2 font-semibold text-slate-800">{item.productName}</td>
                                                                  <td className="p-2 text-right font-mono">{formatNumber(item.quantity, 1)}</td>
                                                                  <td className="p-2 text-right font-mono font-semibold">{formatNumber(item.weightKg, 2)} kg</td>
                                                                  <td className="p-2 text-right font-mono pr-4">{item.isFabric ? item.rollsCount : "—"}</td>
                                                                </tr>
                                                              ))}
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                </>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  )}

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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
