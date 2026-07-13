"use client";

import { useState, useTransition, useMemo } from "react";
import { Printer, FileText, ChevronDown, ChevronRight, Receipt, Package } from "lucide-react";
import { saveSalesOrderBillingDirect } from "@/app/(app)/_actions";
import { showSuccess } from "@/lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";
import { SalesPrintView } from "@/components/app/sales-print-view";

type Roll = {
  id: string;
  roll_number: string;
  meters: number;
  weight: number;
  fabric_type_id: string;
  loom_production_entries?: {
    gross_weight: number;
    core_weight: number;
    net_weight: number;
    net_meters: number;
    average_meter_weight: number;
  } | null;
};

type OrderItem = {
  id: string;
  department: string;
  product_id: string;
  quantity: number;
  selected_roll_ids: string[];
};

type SalesOrder = {
  id: string;
  order_number: string;
  order_date: string;
  customer_id: string;
  status: string;
  bill_number?: string;
  bill_value?: number;
  customers?: {
    customer_name: string;
    alias?: string;
    phone?: string;
    address?: string;
    gst_number?: string;
  };
  sales_order_items?: OrderItem[];
};

interface SalesEntryClientProps {
  pendingOrders: SalesOrder[];
  billedOrders: SalesOrder[];
  rolls: Roll[];
  fabricTypes: { id: string; fabric_name: string }[];
}

function getProductName(productId: string, fabricTypes: { id: string; fabric_name: string }[]): string {
  const fabric = fabricTypes.find((f) => f.id === productId);
  return fabric?.fabric_name ?? productId;
}

function getRollDetails(rollId: string, rolls: Roll[]) {
  return rolls.find((r) => r.id === rollId);
}

type ProductGroup = {
  itemId: string;
  productId: string;
  productName: string;
  department: string;
  rolls: {
    roll_number: string;
    gross_weight: number;
    core_weight: number;
    net_weight: number;
    net_meters: number;
    average_meter_weight: number;
  }[];
  totalNetWeight: number;
  totalMeters: number;
};

function buildProductGroups(order: SalesOrder, rolls: Roll[], fabricTypes: { id: string; fabric_name: string }[]): ProductGroup[] {
  return (order.sales_order_items ?? []).map((item) => {
    const rollsData = (item.selected_roll_ids ?? []).map((rollId) => {
      const roll = getRollDetails(rollId, rolls);
      if (!roll) return null;
      const prod = roll.loom_production_entries;
      return {
        roll_number: roll.roll_number,
        gross_weight: prod?.gross_weight ?? roll.weight ?? 0,
        core_weight: prod?.core_weight ?? 0,
        net_weight: prod?.net_weight ?? (roll.weight ?? 0),
        net_meters: prod?.net_meters ?? (roll.meters ?? 0),
        average_meter_weight: prod?.average_meter_weight ?? 0,
      };
    }).filter(Boolean) as any[];

    const totalNetWeight = rollsData.reduce((s, r) => s + r.net_weight, 0);
    const totalMeters = rollsData.reduce((s, r) => s + r.net_meters, 0);

    return {
      itemId: item.id,
      productId: item.product_id,
      productName: getProductName(item.product_id, fabricTypes),
      department: item.department,
      rolls: rollsData,
      totalNetWeight,
      totalMeters,
    };
  });
}

export function SalesEntryClient({ pendingOrders, billedOrders, rolls, fabricTypes }: SalesEntryClientProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderBillNumbers, setOrderBillNumbers] = useState<Record<string, string>>({});
  const [orderBillValues, setOrderBillValues] = useState<Record<string, string>>({});
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<Record<string, boolean>>({});

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    orderIds: string[]; 
    billNumber: string; 
    billValue: string; 
  } | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Group pending orders by customer (firm)
  const pendingOrdersByCustomer = useMemo(() => {
    const groups: Record<string, { customerName: string; alias?: string; orders: SalesOrder[] }> = {};
    for (const order of pendingOrders) {
      const custId = order.customer_id;
      const custName = order.customers?.customer_name ?? "Unknown Customer";
      const alias = order.customers?.alias;
      if (!groups[custId]) {
        groups[custId] = { customerName: custName, alias, orders: [] };
      }
      groups[custId].orders.push(order);
    }
    return Object.entries(groups).map(([id, data]) => ({
      customerId: id,
      ...data
    }));
  }, [pendingOrders]);

  const handleSubmitOrderBilling = (orderId: string) => {
    const billNo = (orderBillNumbers[orderId] ?? "").trim();
    const billVal = (orderBillValues[orderId] ?? "").trim();

    if (!billNo) {
      setErrorMsg("Bill Number is required.");
      return;
    }
    const val = parseFloat(billVal);
    if (!Number.isFinite(val) || val < 0) {
      setErrorMsg("Bill Value must be a non-negative number.");
      return;
    }

    // If bill number is "0", ask for confirmation before proceeding
    if (billNo === "0") {
      setConfirmDialog({ 
        orderIds: [orderId], 
        billNumber: billNo, 
        billValue: billVal 
      });
      return;
    }

    doSubmitBilling([orderId], false, billNo, billVal);
  };

  const doSubmitBilling = (orderIds: string[], skipJournal: boolean, specificBillNumber?: string, specificBillValue?: string) => {
    const finalBillNumber = specificBillNumber ?? "";
    const finalBillValue = specificBillValue ?? "0";
    const val = parseFloat(finalBillValue);

    setErrorMsg(null);
    setSuccessMsg(null);
    setConfirmDialog(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("order_ids", orderIds.join(","));
        fd.append("bill_number", finalBillNumber.trim());
        fd.append("bill_value", String(val));
        if (skipJournal) fd.append("skip_journal", "1");
        await saveSalesOrderBillingDirect(fd);
        showSuccess("Submitted successfully!");
        setSuccessMsg(
          skipJournal
            ? "Sales billing saved (bill number 0 or value 0 — no journal entry recorded)."
            : "Sales billing saved and journal entries generated!"
        );
        
        // Clear inputs for this order
        const targetId = orderIds[0];
        if (targetId) {
          setOrderBillNumbers((prev) => ({ ...prev, [targetId]: "" }));
          setOrderBillValues((prev) => ({ ...prev, [targetId]: "" }));
        }
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to save billing.");
      }
    });
  };

  // Group billed orders by order number
  const groupedBilledOrders = useMemo(() => {
    const groups: Record<string, any> = {};
    for (const order of billedOrders) {
      const orderNo = order.order_number;
      if (!orderNo) continue;
      if (!groups[orderNo]) {
        groups[orderNo] = {
          ...order,
          bill_value: order.bill_value ?? 0,
          order_ids: [order.id],
          order_number: order.order_number,
          order_numbers: [order.order_number],
          sales_order_items: [...(order.sales_order_items ?? [])],
        };
      } else {
        groups[orderNo].order_ids.push(order.id);
        groups[orderNo].order_numbers.push(order.order_number);
        groups[orderNo].sales_order_items.push(...(order.sales_order_items ?? []));
        groups[orderNo].bill_value += (order.bill_value ?? 0);
      }
    }
    return Object.values(groups);
  }, [billedOrders]);

  // Build product groups for print view
  const printOrder = useMemo(() => {
    if (!printOrderId) return null;
    const pending = pendingOrders.find((o) => o.id === printOrderId);
    if (pending) return pending;

    const billed = billedOrders.find((o) => o.id === printOrderId);
    if (billed && billed.order_number) {
      const siblings = billedOrders.filter((o) => o.order_number === billed.order_number);
      return {
        ...billed,
        order_number: Array.from(new Set(siblings.map((o) => o.order_number))).join(", "),
        bill_value: siblings.reduce((sum, o) => sum + (o.bill_value ?? 0), 0),
        sales_order_items: siblings.flatMap((o) => o.sales_order_items ?? []),
      };
    }
    return billed;
  }, [printOrderId, pendingOrders, billedOrders]);

  const printGroups = useMemo(() => {
    return printOrder ? buildProductGroups(printOrder, rolls, fabricTypes) : [];
  }, [printOrder, rolls, fabricTypes]);

  const printRollsByProduct = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const g of printGroups) {
      map[g.productName] = g.rolls;
    }
    return map;
  }, [printGroups]);

  // If print view is active, show only that
  if (printOrderId && printOrder) {
    return (
      <div>
        <Button variant="outline" className="mb-4 no-print" onClick={() => setPrintOrderId(null)}>
          ← Back to Sales Entry
        </Button>
        <SalesPrintView order={printOrder as any} rollsByProduct={printRollsByProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-6 large-erp-page">
      {/* Confirmation Dialog for Bill Number 0 */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 max-w-sm w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xl font-bold shrink-0">!</span>
              <h2 className="text-base font-semibold text-slate-800">Bill Number is Zero</h2>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              You entered <span className="font-mono font-bold text-amber-700">0</span> as the bill number.
              This entry will be <strong>saved</strong> but <strong>no journal entry</strong> will be recorded.
              Are you sure you want to continue?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => setConfirmDialog(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                onClick={() => doSubmitBilling(confirmDialog.orderIds, true, confirmDialog.billNumber, confirmDialog.billValue)}
              >
                Yes, Save Without Journal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm no-print">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm no-print">{successMsg}</div>
      )}

      {/* Section 1: Confirmed Deliveries Grouped by Customer */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30 no-print">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-amber-600" />
            Confirmed Deliveries Pending Billing
            <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
              {pendingOrders.length}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Enter invoice billing details directly for each confirmed dispatch.</p>
        </CardHeader>
        <CardContent>
          {pendingOrdersByCustomer.length === 0 ? (
            <EmptyState
              title="No pending deliveries"
              description="Confirmed deliveries awaiting billing will appear here."
            />
          ) : (
            <div className="space-y-6">
              {pendingOrdersByCustomer.map((customerGroup) => {
                const isCustomerExpanded = expandedCustomerIds[customerGroup.customerId] ?? false;

                return (
                  <div key={customerGroup.customerId} className="space-y-2 border-l-2 border-slate-200 pl-4 py-1">
                    <button
                      type="button"
                      onClick={() => setExpandedCustomerIds(prev => ({ ...prev, [customerGroup.customerId]: !prev[customerGroup.customerId] }))}
                      className="w-full flex items-center justify-between text-left hover:bg-slate-50 p-1.5 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isCustomerExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800 text-sm">
                          {customerGroup.customerName}
                        </span>

                      </div>
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-normal">
                        {customerGroup.orders.length} order{customerGroup.orders.length !== 1 ? 's' : ''}
                      </Badge>
                    </button>

                    {isCustomerExpanded && (
                      <div className="space-y-3 mt-2 pl-2">
                        {customerGroup.orders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          const groups = buildProductGroups(order, rolls, fabricTypes);
                          const grandTotalKg = groups.reduce((s, g) => s + g.totalNetWeight, 0);

                          return (
                            <div
                              key={order.id}
                              className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                            >
                              {/* Order header row */}
                              <div className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <button
                                  type="button"
                                  className="flex-1 flex items-center justify-between text-left"
                                  onClick={() => toggleExpand(order.id)}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                      <span className="font-semibold text-sm text-slate-900">
                                        Order #{order.order_number}
                                      </span>
                                      <span className="ml-3 text-xs text-muted-foreground font-mono">
                                        {formatDate(order.order_date)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-xs font-bold text-slate-800 font-mono">
                                      {groups.length} item{groups.length !== 1 ? "s" : ""} · {formatNumber(grandTotalKg, 1)} kg
                                    </span>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-normal">
                                      Confirmed
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs gap-1 no-print border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                      onClick={() => setPrintOrderId(order.id)}
                                    >
                                      <Printer className="h-3 w-3" />
                                      Print Dispatch Note
                                    </Button>
                                  </div>
                                </button>
                              </div>

                              {/* Expanded content */}
                              {isExpanded && (
                                <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/30 space-y-4">
                                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-slate-100/60">
                                          <TableHead className="text-xs font-semibold">Department</TableHead>
                                          <TableHead className="text-xs font-semibold">Product</TableHead>
                                          <TableHead className="text-xs font-semibold text-right">Rolls</TableHead>
                                          <TableHead className="text-xs font-semibold text-right">Net W8 (kg)</TableHead>
                                          <TableHead className="text-xs font-semibold text-right">Meters</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {groups.map((g) => (
                                          <TableRow key={g.itemId} className="hover:bg-slate-50/20">
                                            <TableCell className="text-sm capitalize">{g.department}</TableCell>
                                            <TableCell className="text-sm font-mono font-medium">{g.productName}</TableCell>
                                            <TableCell className="text-sm text-right">{g.rolls.length}</TableCell>
                                            <TableCell className="text-sm text-right font-mono">{formatNumber(g.totalNetWeight, 1)}</TableCell>
                                            <TableCell className="text-sm text-right font-mono">{formatNumber(Math.floor(g.totalMeters), 0)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>

                                  {/* Billing entry form for this specific order */}
                                  <div className="bg-slate-50 border-t border-slate-100 px-4 py-3.5 flex flex-wrap items-center justify-between gap-4 text-sm">
                                    <div className="flex-1 min-w-[160px] flex items-center gap-2">
                                      <Label htmlFor={`bill-no-${order.id}`} className="text-slate-500 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                                        Bill No:
                                      </Label>
                                      <Input
                                        id={`bill-no-${order.id}`}
                                        placeholder="e.g. INV-001"
                                        value={orderBillNumbers[order.id] ?? ""}
                                        onChange={(e) => setOrderBillNumbers(prev => ({ ...prev, [order.id]: e.target.value }))}
                                        className="h-8 text-xs border-slate-300 bg-white"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-[140px] flex items-center gap-2">
                                      <Label htmlFor={`bill-val-${order.id}`} className="text-slate-500 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                                        Bill Value (₹):
                                      </Label>
                                      <Input
                                        id={`bill-val-${order.id}`}
                                        type="number"
                                        placeholder="0.00"
                                        value={orderBillValues[order.id] ?? ""}
                                        onChange={(e) => setOrderBillValues(prev => ({ ...prev, [order.id]: e.target.value }))}
                                        className="h-8 text-xs font-mono border-slate-300 bg-white"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <Button
                                        size="sm"
                                        className="h-8 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold gap-1 text-xs"
                                        onClick={() => handleSubmitOrderBilling(order.id)}
                                        disabled={isPending}
                                      >
                                        <Receipt className="h-3.5 w-3.5" />
                                        Submit
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Billed Sales */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-emerald-600" />
            Billed Sales
            <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
              {groupedBilledOrders.length}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Finalized invoices with bill numbers, details, and print options.</p>
        </CardHeader>
        <CardContent>
          {groupedBilledOrders.length === 0 ? (
            <EmptyState
              title="No billed sales yet"
              description="Once you submit billing for pending deliveries, they will appear here."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-50/40">
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Customer</TableHead>
                    <TableHead className="text-xs font-semibold">Bill Number</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Bill Value (₹)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Products</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedBilledOrders.map((order) => {
                    const groups = buildProductGroups(order, rolls, fabricTypes);
                    return (
                      <TableRow key={order.id} className="hover:bg-white/60">
                        <TableCell className="text-sm">{formatDate(order.order_date)}</TableCell>
                        <TableCell className="text-sm font-medium">{order.customers?.customer_name ?? "—"}</TableCell>
                        <TableCell className="text-sm font-mono">{order.bill_number}</TableCell>
                        <TableCell className="text-sm text-right font-mono font-medium">
                          ₹{formatNumber(order.bill_value ?? 0, 2)}
                        </TableCell>
                        <TableCell className="text-sm text-right">
                          {groups.length} item{groups.length !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => setPrintOrderId(order.id)}
                          >
                            <Printer className="h-3 w-3" />
                            Print Invoice Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
