"use client";

import { useState, useTransition, useMemo } from "react";
import { Printer, FileText, ChevronDown, ChevronRight, Receipt, Package } from "lucide-react";
import { saveSalesOrderBilling } from "@/app/(app)/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, formatNumber } from "@/lib/utils";
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

// Returns each order item individually (does not club same fabric types)
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
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [billNumber, setBillNumber] = useState("");
  const [billValue, setBillValue] = useState("");

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ itemIds: string[] } | null>(null);

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

  // Determine active customer ID from currently selected items
  const activeCustomerId = useMemo(() => {
    if (selectedItemIds.length === 0) return null;
    for (const order of pendingOrders) {
      for (const item of (order.sales_order_items ?? [])) {
        if (selectedItemIds.includes(item.id)) {
          return order.customer_id;
        }
      }
    }
    return null;
  }, [selectedItemIds, pendingOrders]);

  const toggleSelectCustomerAll = (customerId: string, customerOrders: SalesOrder[]) => {
    const customerItemIds = customerOrders.flatMap((o) => (o.sales_order_items ?? []).map((i) => i.id));
    const allSelected = customerItemIds.length > 0 && customerItemIds.every((id) => selectedItemIds.includes(id));

    if (allSelected) {
      // Deselect all for this customer
      setSelectedItemIds((prev) => prev.filter((id) => !customerItemIds.includes(id)));
    } else {
      // Select all for this customer, overriding any other selection
      setSelectedItemIds(customerItemIds);
    }
  };

  const toggleSelectOrder = (order: SalesOrder) => {
    const ids = (order.sales_order_items ?? []).map((i) => i.id);
    const allSel = ids.every((id) => selectedItemIds.includes(id));
    if (allSel) {
      setSelectedItemIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedItemIds((prev) => {
        const filtered = prev.filter(id => {
          const itemOrder = pendingOrders.find(o => (o.sales_order_items ?? []).some(i => i.id === id));
          return itemOrder?.customer_id === order.customer_id;
        });
        return [...new Set([...filtered, ...ids])];
      });
    }
  };

  const handleSubmitBilling = () => {
    if (selectedItemIds.length === 0) {
      setErrorMsg("Please select at least one item to bill.");
      return;
    }
    if (!billNumber.trim()) {
      setErrorMsg("Bill Number is required.");
      return;
    }
    const val = parseFloat(billValue);
    if (!Number.isFinite(val) || val < 0) {
      setErrorMsg("Bill Value must be a non-negative number.");
      return;
    }

    // Verify all selected items belong to the same customer
    const selectedOrders = pendingOrders.filter((o) =>
      (o.sales_order_items ?? []).some((i) => selectedItemIds.includes(i.id))
    );
    const customerNames = Array.from(new Set(selectedOrders.map((o) => o.customers?.customer_name)));
    if (customerNames.length > 1) {
      setErrorMsg("All selected items must belong to the same customer to be billed together.");
      return;
    }

    // If bill number is "0", ask for confirmation before proceeding
    if (billNumber.trim() === "0") {
      setConfirmDialog({ itemIds: selectedItemIds });
      return;
    }

    doSubmitBilling(selectedItemIds, false);
  };

  const doSubmitBilling = (itemIds: string[], skipJournal: boolean) => {
    const val = parseFloat(billValue);

    setErrorMsg(null);
    setSuccessMsg(null);
    setConfirmDialog(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("item_ids", itemIds.join(","));
        fd.append("bill_number", billNumber.trim());
        fd.append("bill_value", String(val));
        if (skipJournal) fd.append("skip_journal", "1");
        await saveSalesOrderBilling(fd);
        setSuccessMsg(
          skipJournal
            ? "Sales billing saved (bill number 0 or value 0 — no journal entry recorded)."
            : "Sales billing saved and journal entries generated!"
        );
        setBillNumber("");
        setBillValue("");
        setSelectedItemIds([]);
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to save billing.");
      }
    });
  };

  // Build product groups for print view
  const printOrder = printOrderId
    ? [...pendingOrders, ...billedOrders].find((o) => o.id === printOrderId)
    : null;
  const printGroups = printOrder ? buildProductGroups(printOrder, rolls, fabricTypes) : [];
  const printRollsByProduct: Record<string, any[]> = {};
  for (const g of printGroups) {
    printRollsByProduct[g.productName] = g.rolls;
  }

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
    <div className="space-y-6">
      {/* Confirmation Dialog for Bill Number 0 */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
                onClick={() => doSubmitBilling(confirmDialog.itemIds, true)}
              >
                Yes, Save Without Journal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{successMsg}</div>
      )}

      {/* Multi-Select Billing Form */}
      {selectedItemIds.length > 0 && (
        <Card className="border border-emerald-200 bg-emerald-50/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-950">
              Billing Information for {selectedItemIds.length} Selected Item(s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <Label className="text-xs text-muted-foreground mb-1">Bill Number</Label>
                <Input
                  placeholder="e.g. INV-001"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                  className="h-9 text-sm border-slate-300"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs text-muted-foreground mb-1">Bill Value (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={billValue}
                  onChange={(e) => setBillValue(e.target.value)}
                  className="h-9 text-sm font-mono border-slate-300"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={handleSubmitBilling}
                  disabled={isPending}
                >
                  <Receipt className="h-3.5 w-3.5" />
                  {isPending ? "Saving..." : "Submit Billing"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedItemIds([])}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 1: Pending Sales Grouped by Customer */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-amber-600" />
            Pending Billing by Customer (Firm)
            <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
              {pendingOrders.length}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Select items from a customer to bill them together. Unselected items will remain as a separate pending order.</p>
        </CardHeader>
        <CardContent>
          {pendingOrdersByCustomer.length === 0 ? (
            <EmptyState
              title="No pending deliveries"
              description="Confirmed deliveries that haven't been billed yet will appear here."
            />
          ) : (
            <div className="space-y-6">
              {pendingOrdersByCustomer.map((customerGroup) => {
                // Determine if this customer's group checkboxes are disabled (since another customer has selected items)
                const isGroupDisabled = activeCustomerId !== null && activeCustomerId !== customerGroup.customerId;
                const customerItemIds = customerGroup.orders.flatMap((o) => (o.sales_order_items ?? []).map((i) => i.id));
                const allSelected = customerItemIds.length > 0 && customerItemIds.every((id) => selectedItemIds.includes(id));

                return (
                  <div key={customerGroup.customerId} className="space-y-2 border-l-2 border-slate-200 pl-4 py-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {customerGroup.customerName}
                        </h3>
                        {customerGroup.alias && (
                          <span className="text-xs text-muted-foreground">({customerGroup.alias})</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isGroupDisabled}
                        onClick={() => toggleSelectCustomerAll(customerGroup.customerId, customerGroup.orders)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 h-8 px-2"
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {customerGroup.orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        const groups = buildProductGroups(order, rolls, fabricTypes);
                        const grandTotalKg = groups.reduce((s, g) => s + g.totalNetWeight, 0);

                        const orderItemIds = (order.sales_order_items ?? []).map((i) => i.id);
                        const orderAllSelected = orderItemIds.every((id) => selectedItemIds.includes(id));

                        return (
                          <div
                            key={order.id}
                            className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                          >
                            {/* Order header row */}
                            <div className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <input
                                type="checkbox"
                                checked={orderAllSelected}
                                onChange={() => toggleSelectOrder(order)}
                                disabled={isGroupDisabled}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                              />
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
                                    <span className="ml-3 text-xs text-muted-foreground">
                                      {formatDate(order.order_date)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {groups.length} item{groups.length !== 1 ? "s" : ""} · {formatNumber(grandTotalKg, 1)} kg
                                  </span>
                                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal">
                                    Pending
                                  </Badge>
                                </div>
                              </button>
                            </div>

                            {/* Expanded content */}
                            {isExpanded && (
                              <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/30 space-y-4">
                                {/* Summary table grouped by department/product */}
                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-100/60">
                                        <TableHead className="w-10"></TableHead>
                                        <TableHead className="text-xs font-semibold">Department</TableHead>
                                        <TableHead className="text-xs font-semibold">Product</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Rolls</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Net W8 (kg)</TableHead>
                                        <TableHead className="text-xs font-semibold text-right">Meters</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {groups.map((g) => {
                                        const isItemChecked = selectedItemIds.includes(g.itemId);
                                        return (
                                          <TableRow key={g.itemId} className="hover:bg-white/60">
                                            <TableCell className="w-10">
                                              <input
                                                type="checkbox"
                                                checked={isItemChecked}
                                                onChange={() => {
                                                  setSelectedItemIds((prev) => {
                                                    if (prev.includes(g.itemId)) {
                                                      return prev.filter((id) => id !== g.itemId);
                                                    } else {
                                                      const filtered = prev.filter((id) => {
                                                        const itemOrder = pendingOrders.find((o) => (o.sales_order_items ?? []).some((i) => i.id === id));
                                                        return itemOrder?.customer_id === order.customer_id;
                                                      });
                                                      return [...filtered, g.itemId];
                                                    }
                                                  });
                                                }}
                                                disabled={isGroupDisabled}
                                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                                              />
                                            </TableCell>
                                            <TableCell className="text-sm capitalize">{g.department}</TableCell>
                                            <TableCell className="text-sm font-mono font-medium">{g.productName}</TableCell>
                                            <TableCell className="text-sm text-right">{g.rolls.length}</TableCell>
                                            <TableCell className="text-sm text-right font-mono">{formatNumber(g.totalNetWeight, 1)}</TableCell>
                                            <TableCell className="text-sm text-right font-mono">{formatNumber(Math.floor(g.totalMeters), 0)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Actions row */}
                                <div className="flex justify-end pt-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 gap-1.5"
                                    onClick={() => setPrintOrderId(order.id)}
                                  >
                                    <Printer className="h-3.5 w-3.5" />
                                    Print Invoice Details
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
              {billedOrders.length}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Sales with bill number and value, with journal entries auto-generated.</p>
        </CardHeader>
        <CardContent>
          {billedOrders.length === 0 ? (
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
                  {billedOrders.map((order) => {
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
                            Print
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
