"use client";

import { useState, useTransition, useMemo } from "react";
import { Printer, FileText, ChevronDown, ChevronRight, Receipt, Package, RotateCcw } from "lucide-react";
import {
  prepareSalesOrderDraftBilling,
  finalizeSalesOrderBilling,
  discardSalesOrderDraftBilling
} from "@/app/(app)/_actions";
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
  is_draft_billing?: boolean;
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
  draftOrders: SalesOrder[];
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

export function SalesEntryClient({
  pendingOrders,
  draftOrders,
  billedOrders,
  rolls,
  fabricTypes
}: SalesEntryClientProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "draft" | "billed">("pending");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Staged draft invoice finalization modal state
  const [finalizingOrder, setFinalizingOrder] = useState<SalesOrder | null>(null);
  const [modalBillNumber, setModalBillNumber] = useState("");
  const [modalBillValue, setModalBillValue] = useState("");
  const [modalConfirmDialog, setModalConfirmDialog] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);

  // Details of currently selected items to list in the billing card (for Tab 1)
  const selectedItemsDetails = useMemo(() => {
    const list: {
      itemId: string;
      productName: string;
      department: string;
      rollCount: number;
      weight: number;
      meters: number;
      orderNumber: string;
    }[] = [];
    for (const order of pendingOrders) {
      for (const item of (order.sales_order_items ?? [])) {
        if (selectedItemIds.includes(item.id)) {
          const rollsData = (item.selected_roll_ids ?? []).map((rollId) => {
            const roll = rolls.find((r) => r.id === rollId);
            if (!roll) return null;
            const prod = roll.loom_production_entries;
            return {
              net_weight: prod?.net_weight ?? (roll.weight ?? 0),
              net_meters: prod?.net_meters ?? (roll.meters ?? 0),
            };
          }).filter(Boolean);

          const totalWeight = rollsData.reduce((s, r) => s + r!.net_weight, 0);
          const totalMeters = rollsData.reduce((s, r) => s + r!.net_meters, 0);

          list.push({
            itemId: item.id,
            productName: getProductName(item.product_id, fabricTypes),
            department: item.department,
            rollCount: item.selected_roll_ids?.length ?? 0,
            weight: totalWeight,
            meters: totalMeters,
            orderNumber: order.order_number,
          });
        }
      }
    }
    return list;
  }, [selectedItemIds, pendingOrders, rolls, fabricTypes]);

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
      setSelectedItemIds((prev) => prev.filter((id) => !customerItemIds.includes(id)));
    } else {
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

  // 1. Action: Prepare Draft Billing
  const handlePrepareDraft = () => {
    if (selectedItemIds.length === 0) {
      setErrorMsg("Please select at least one item to prepare a draft invoice.");
      return;
    }

    // Verify all selected items belong to the same customer
    const selectedOrders = pendingOrders.filter((o) =>
      (o.sales_order_items ?? []).some((i) => selectedItemIds.includes(i.id))
    );
    const customerNames = Array.from(new Set(selectedOrders.map((o) => o.customers?.customer_name)));
    if (customerNames.length > 1) {
      setErrorMsg("All selected items must belong to the same customer to be draft billed together.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("item_ids", selectedItemIds.join(","));
        await prepareSalesOrderDraftBilling(fd);
        setSuccessMsg("Draft invoice prepared successfully! Verify details in the Draft Invoices tab.");
        setSelectedItemIds([]);
        setActiveTab("draft");
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to prepare draft invoice.");
      }
    });
  };

  // 2. Action: Finalize Billing Form Submission
  const handleFinalizeSubmit = () => {
    if (!finalizingOrder) return;
    if (!modalBillNumber.trim()) {
      setErrorMsg("Bill Number is required.");
      return;
    }
    const val = parseFloat(modalBillValue);
    if (!Number.isFinite(val) || val < 0) {
      setErrorMsg("Bill Value must be a non-negative number.");
      return;
    }

    // If bill number is "0", ask for confirmation
    if (modalBillNumber.trim() === "0") {
      setModalConfirmDialog(true);
      return;
    }

    doFinalizeBilling(false);
  };

  const doFinalizeBilling = (skipJournal: boolean) => {
    if (!finalizingOrder) return;
    const val = parseFloat(modalBillValue);

    setErrorMsg(null);
    setSuccessMsg(null);
    setModalConfirmDialog(false);
    const targetOrderId = finalizingOrder.id;
    setFinalizingOrder(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("order_id", targetOrderId);
        fd.append("bill_number", modalBillNumber.trim());
        fd.append("bill_value", String(val));
        if (skipJournal) fd.append("skip_journal", "1");
        await finalizeSalesOrderBilling(fd);
        setSuccessMsg(
          skipJournal
            ? "Sales billing finalized (bill number 0 or value 0 — no journal entry recorded)."
            : "Sales billing finalized and journal entries generated!"
        );
        setModalBillNumber("");
        setModalBillValue("");
        setActiveTab("billed");
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to finalize billing.");
      }
    });
  };

  // 3. Action: Discard Draft
  const handleDiscardDraft = (orderId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await discardSalesOrderDraftBilling(orderId);
        setSuccessMsg("Draft invoice discarded. Items returned to pending list.");
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to discard draft invoice.");
      }
    });
  };

  // Group billed orders by bill number
  const groupedBilledOrders = useMemo(() => {
    const groups: Record<string, any> = {};
    for (const order of billedOrders) {
      const billNo = order.bill_number;
      if (!billNo) continue;
      if (!groups[billNo]) {
        groups[billNo] = {
          ...order,
          bill_value: order.bill_value ?? 0,
          order_ids: [order.id],
          order_number: order.order_number,
          order_numbers: [order.order_number],
          sales_order_items: [...(order.sales_order_items ?? [])],
        };
      } else {
        groups[billNo].order_ids.push(order.id);
        groups[billNo].order_numbers.push(order.order_number);
        groups[billNo].sales_order_items.push(...(order.sales_order_items ?? []));
        groups[billNo].bill_value += (order.bill_value ?? 0);
        if (!groups[billNo].order_numbers.includes(order.order_number)) {
          groups[billNo].order_number = groups[billNo].order_numbers.join(", ");
        }
      }
    }
    return Object.values(groups);
  }, [billedOrders]);

  // Build product groups for print view
  const printOrder = useMemo(() => {
    if (!printOrderId) return null;
    const pending = pendingOrders.find((o) => o.id === printOrderId);
    if (pending) return pending;

    const draft = draftOrders.find((o) => o.id === printOrderId);
    if (draft) return draft;

    const billed = billedOrders.find((o) => o.id === printOrderId);
    if (billed && billed.bill_number) {
      const siblings = billedOrders.filter((o) => o.bill_number === billed.bill_number);
      return {
        ...billed,
        order_number: Array.from(new Set(siblings.map((o) => o.order_number))).join(", "),
        bill_value: siblings.reduce((sum, o) => sum + (o.bill_value ?? 0), 0),
        sales_order_items: siblings.flatMap((o) => o.sales_order_items ?? []),
      };
    }
    return billed;
  }, [printOrderId, pendingOrders, draftOrders, billedOrders]);

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
      {/* Dialog for Finalizing Billing */}
      {finalizingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-bold text-slate-800">Finalize Billing</h2>
              <button onClick={() => setFinalizingOrder(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Customer</span>
              <p className="text-sm font-semibold text-slate-800">{finalizingOrder.customers?.customer_name}</p>
              <p className="text-xs text-slate-500">Order #{finalizingOrder.order_number} · {formatDate(finalizingOrder.order_date)}</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="modal_bill_number" className="text-xs font-semibold text-slate-700">Bill Number</Label>
                <Input
                  id="modal_bill_number"
                  placeholder="e.g. INV-001"
                  value={modalBillNumber}
                  onChange={(e) => setModalBillNumber(e.target.value)}
                  className="h-10 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="modal_bill_value" className="text-xs font-semibold text-slate-700">Bill Value (₹)</Label>
                <Input
                  id="modal_bill_value"
                  type="number"
                  placeholder="0.00"
                  value={modalBillValue}
                  onChange={(e) => setModalBillValue(e.target.value)}
                  className="h-10 text-sm font-mono mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                className="h-10 px-4 text-sm"
                onClick={() => setFinalizingOrder(null)}
              >
                Cancel
              </Button>
              <Button
                className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
                onClick={handleFinalizeSubmit}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Confirm & Finalize"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Bill Number 0 */}
      {modalConfirmDialog && (
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
                onClick={() => setModalConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                onClick={() => doFinalizeBilling(true)}
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

      {/* Workspace Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 no-print">
        <button
          onClick={() => { setActiveTab("pending"); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "pending"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Package className="h-4 w-4" />
          Pending Items ({pendingOrders.reduce((acc, o) => acc + (o.sales_order_items?.length ?? 0), 0)})
        </button>
        <button
          onClick={() => { setActiveTab("draft"); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "draft"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          Draft Invoices ({draftOrders.length})
        </button>
        <button
          onClick={() => { setActiveTab("billed"); setErrorMsg(null); setSuccessMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "billed"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileText className="h-4 w-4" />
          Billed Orders ({groupedBilledOrders.length})
        </button>
      </div>

      {/* TAB 1: Pending Items */}
      {activeTab === "pending" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-amber-600" />
                Pending Billing by Customer (Firm)
                <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  {pendingOrders.length}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Select fabric items to group them and prepare a draft invoice for verification.</p>
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

          {/* Staging selected items form */}
          {selectedItemIds.length > 0 && (
            <Card className="border border-emerald-200 bg-emerald-50/20 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-950">
                  Staging Selected Items for Draft Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Selected Items:</div>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                    {selectedItemsDetails.map((item) => (
                      <div key={item.itemId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 text-xs bg-white/80 border border-emerald-100 p-2.5 rounded-lg">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 block sm:inline">{item.productName}</span>
                          <span className="text-slate-500 ml-1 capitalize">({item.department})</span>
                          <span className="text-muted-foreground ml-0 sm:ml-2 block sm:inline">Order #{item.orderNumber}</span>
                        </div>
                        <div className="font-mono text-slate-700 sm:text-right shrink-0">
                          {item.rollCount} Roll{item.rollCount !== 1 ? 's' : ''} · {formatNumber(item.weight, 1)} kg
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedItemIds([])}
                    className="h-10 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 px-5 font-semibold"
                    onClick={handlePrepareDraft}
                    disabled={isPending}
                  >
                    <Receipt className="h-4 w-4" />
                    {isPending ? "Processing..." : "Prepare Draft Invoice"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: Draft Invoices */}
      {activeTab === "draft" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                Draft Invoices & Verification
                <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  {draftOrders.length}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Print and verify dispatch weights, then enter invoice details to finalize billing.</p>
            </CardHeader>
            <CardContent>
              {draftOrders.length === 0 ? (
                <EmptyState
                  title="No draft invoices"
                  description="Staged fabric selections pending verification will appear here."
                />
              ) : (
                <div className="space-y-6">
                  {draftOrders.map((order) => {
                    const groups = buildProductGroups(order, rolls, fabricTypes);
                    return (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                      >
                        {/* Order header row */}
                        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 gap-2 border-b border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="font-semibold text-sm text-slate-900 block sm:inline">
                              {order.customers?.customer_name}
                            </span>
                            {order.customers?.alias && (
                              <span className="text-xs text-muted-foreground ml-1">({order.customers.alias})</span>
                            )}
                            <span className="ml-0 sm:ml-3 text-xs text-muted-foreground font-mono block sm:inline">
                              Order #{order.order_number} · {formatDate(order.order_date)}
                            </span>
                          </div>
                          <div>
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal">
                              Pending Verification
                            </Badge>
                          </div>
                        </div>

                        {/* Items summary */}
                        <div className="p-4 space-y-4">
                          <div className="overflow-x-auto rounded-lg border border-slate-200">
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

                          {/* Actions row */}
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-medium"
                              onClick={() => handleDiscardDraft(order.id)}
                              disabled={isPending}
                            >
                              Discard Draft
                            </Button>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 gap-1.5 font-medium"
                                onClick={() => setPrintOrderId(order.id)}
                              >
                                <Printer className="h-3.5 w-3.5" />
                                Print Draft Invoice
                              </Button>
                              <Button
                                size="sm"
                                className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                onClick={() => {
                                  setFinalizingOrder(order);
                                  setModalBillNumber("");
                                  setModalBillValue("");
                                  setModalConfirmDialog(false);
                                }}
                              >
                                <Receipt className="h-3.5 w-3.5" />
                                Finalize Billing
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Billed Orders */}
      {activeTab === "billed" && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-emerald-600" />
                Billed Sales
                <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                  {groupedBilledOrders.length}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Sales with bill number and value, with journal entries auto-generated.</p>
            </CardHeader>
            <CardContent>
              {groupedBilledOrders.length === 0 ? (
                <EmptyState
                  title="No billed sales yet"
                  description="Once you finalize billing for draft invoices, they will appear here."
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
      )}
    </div>
  );
}
