"use client";

import { useState, useTransition, useMemo } from "react";
import { Check, Printer, X, ChevronRight, ChevronDown, Search } from "lucide-react";
import { confirmSalesDelivery } from "@/app/(app)/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/app/status-badge";
import { Label } from "@/components/ui/label";
import { formatNumber, formatDate } from "@/lib/utils";

type Roll = {
  id: string;
  roll_number: string;
  meters: number;
  weight: number;
  status: string;
  fabric_type_id: string;
};

type OrderItem = {
  id: string;
  sales_order_id: string;
  department: string;
  product_id: string;
  quantity: number;
  selected_roll_ids: string[];
};

type Customer = {
  id: string;
  customer_name: string;
  alias?: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  is_internal: boolean;
  status: string;
};

type SalesOrder = {
  id: string;
  order_number: string;
  order_date: string;
  customer_id: string;
  status: string;
  created_at: string;
  customers?: Customer;
  sales_order_items?: OrderItem[];
};

interface OrderConfirmationWorkspaceProps {
  orders: SalesOrder[];
  fabrics: { id: string; fabric_name: string }[];
  rotoProducts: { id: string; brand: string; width: number; height: number }[];
  offsetProducts: { id: string; brand: string; width: number; height: number }[];
  rolls: Roll[];
}

export function OrderConfirmationWorkspace({
  orders,
  fabrics,
  rotoProducts,
  offsetProducts,
  rolls,
}: OrderConfirmationWorkspaceProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Roll allocation state: Record<itemId, rollId[]>
  const [allocation, setAllocation] = useState<Record<string, string[]>>({});
  // Expanded items state: Record<itemId, boolean>
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Resolve product name helper
  const getProductName = (dept: string, productId: string) => {
    if (dept === "fabric") {
      const f = fabrics.find((x) => x.id === productId);
      return f ? f.fabric_name : "Fabric Product";
    } else if (dept === "roto-printing") {
      const r = rotoProducts.find((x) => x.id === productId);
      return r ? `${r.brand} (${r.width}x${r.height} in)` : "Roto Product";
    } else if (dept === "offset-printing") {
      const o = offsetProducts.find((x) => x.id === productId);
      return o ? `${o.brand} (${o.width}x${o.height} in)` : "Offset Product";
    } else if (dept === "lamination") {
      return productId === "lam-film-25" ? "Laminated Film 2.5 mil" : "Laminated Film 3.0 mil";
    } else if (dept === "finishing") {
      return productId === "finished-bags-28" ? "Finished Bags W-28" : "Finished Bags W-32";
    }
    return "Unknown Product";
  };

  // Find active order details
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [selectedOrderId, orders]);

  // Set initial allocation & expansion when an order is selected
  const handleSelectOrder = (order: SalesOrder) => {
    setSelectedOrderId(order.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    const initialAlloc: Record<string, string[]> = {};
    const initialExpand: Record<string, boolean> = {};

    order.sales_order_items?.forEach((item) => {
      initialAlloc[item.id] = item.selected_roll_ids || [];
      // Expand fabric item roll list by default if there are rolls allocated, or if it's fabric
      initialExpand[item.id] = item.department === "fabric";
    });

    setAllocation(initialAlloc);
    setExpandedItems(initialExpand);
  };

  // Toggle roll selection
  const toggleRoll = (itemId: string, rollId: string) => {
    setAllocation((prev) => {
      const current = prev[itemId] || [];
      const updated = current.includes(rollId)
        ? current.filter((id) => id !== rollId)
        : [...current, rollId];
      return { ...prev, [itemId]: updated };
    });
  };

  // Toggle expansion for an item card
  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const query = searchTerm.toLowerCase();
      const numMatch = o.order_number.toLowerCase().includes(query);
      const custMatch = o.customers?.customer_name.toLowerCase().includes(query) || false;
      const aliasMatch = o.customers?.alias?.toLowerCase().includes(query) || false;
      return numMatch || custMatch || aliasMatch;
    });
  }, [orders, searchTerm]);

  // Save current allocations
  const handleSave = () => {
    if (!selectedOrder) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await confirmSalesDelivery(selectedOrder.id, allocation);
        setSuccessMsg("Order allocations saved and delivery status confirmed successfully!");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save order confirmation.");
      }
    });
  };

  // Resolve available and currently allocated rolls for an item
  const getItemRolls = (item: OrderItem) => {
    if (item.department !== "fabric") return [];
    return rolls.filter(
      (r) =>
        r.fabric_type_id === item.product_id &&
        (r.status === "available" || item.selected_roll_ids?.includes(r.id))
    );
  };

  // Print invoice helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full items-stretch">
      {/* Printable CSS overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-content, #printable-invoice-content * {
            visibility: visible;
          }
          #printable-invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Left panel: Orders list */}
      <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4 no-print">
        <Card className="h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-base font-bold">Select Sales Order</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 w-full rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No orders found</div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                return (
                  <button
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`w-full text-left p-4 transition-colors hover:bg-muted/50 flex flex-col gap-1.5 ${
                      isSelected ? "bg-muted border-l-4 border-l-primary pl-3" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-emerald-950">
                        Order #{order.order_number}
                      </span>
                      <StatusBadge value={order.status} />
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {order.customers?.customer_name}
                      {order.customers?.alias ? ` (${order.customers.alias})` : ""}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>{formatDate(order.order_date)}</span>
                      <span>{order.sales_order_items?.length ?? 0} items</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Right panel: Active workspace */}
      <div className="flex-1 min-w-0 no-print">
        {!selectedOrder ? (
          <Card className="h-full flex items-center justify-center p-8 text-center border-dashed">
            <div className="max-w-md space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Printer className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">No Order Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select an order from the list on the left to allocate rolls, view dynamic quantity tallies, and generate proforma invoices.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-semibold">
                {successMsg}
              </div>
            )}

            {/* Selected Order Overview Card */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="p-5 border-b flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Order Workspace
                  </div>
                  <CardTitle className="text-xl font-black mt-1 text-emerald-950">
                    Order #{selectedOrder.order_number}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Date: {formatDate(selectedOrder.order_date)} | Client:{" "}
                    <span className="font-semibold text-foreground">
                      {selectedOrder.customers?.customer_name}
                    </span>
                    {selectedOrder.customers?.alias && ` (${selectedOrder.customers.alias})`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-semibold shadow-sm hover:bg-muted transition-colors gap-2 text-foreground"
                  >
                    <Printer className="h-4 w-4" />
                    Proforma Invoice
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Confirming..." : "Confirm & Save"}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-6">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Order Items & Stock Allocation
                </div>

                {selectedOrder.sales_order_items?.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    This order has no registered items.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedOrder.sales_order_items?.map((item) => {
                      const itemRolls = getItemRolls(item);
                      const selectedIds = allocation[item.id] || [];
                      const selectedRolls = itemRolls.filter((r) => selectedIds.includes(r.id));

                      const totalMeters = selectedRolls.reduce(
                        (sum, r) => sum + Number(r.meters || 0),
                        0
                      );
                      const totalWeight = selectedRolls.reduce(
                        (sum, r) => sum + Number(r.weight || 0),
                        0
                      );

                      const isExpanded = !!expandedItems[item.id];
                      const prodName = getProductName(item.department, item.product_id);

                      return (
                        <div
                          key={item.id}
                          className="border rounded-lg overflow-hidden bg-card shadow-sm"
                        >
                          {/* Card Header (Product Clickable Toggle) */}
                          <div
                            onClick={() => toggleExpand(item.id)}
                            className="p-4 bg-muted/20 border-b flex items-center justify-between cursor-pointer select-none hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                              )}
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                  {item.department}
                                </span>
                                <span className="font-bold text-base text-emerald-950">
                                  {prodName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <span className="text-xs text-muted-foreground block">Needed</span>
                                <span className="font-bold text-sm">{formatNumber(item.quantity)} m</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-muted-foreground block">Selected</span>
                                <span
                                  className={`font-bold text-sm ${
                                    totalMeters >= item.quantity
                                      ? "text-emerald-700"
                                      : "text-amber-700"
                                  }`}
                                >
                                  {formatNumber(totalMeters)} m
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Content */}
                          {isExpanded && (
                            <div className="p-4 space-y-4">
                              {/* Tally Metrics Block */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-3 rounded-lg text-sm">
                                <div>
                                  <div className="text-muted-foreground text-xs">Target Qty</div>
                                  <div className="font-bold text-sm text-emerald-950">
                                    {formatNumber(item.quantity)} m
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-xs">Selected Qty</div>
                                  <div className="font-bold text-sm text-emerald-950">
                                    {formatNumber(totalMeters)} m
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-xs">Selected Weight</div>
                                  <div className="font-bold text-sm text-emerald-950">
                                    {formatNumber(totalWeight, 2)} kg
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-xs">Selected Rolls</div>
                                  <div className="font-bold text-sm text-emerald-950">
                                    {selectedIds.length} rolls
                                  </div>
                                </div>
                              </div>

                              {/* Rolls Selection Grid */}
                              {item.department !== "fabric" ? (
                                <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                                  Dynamic roll tracking is only available for Fabric department. Delivery confirmation will mark this item ready.
                                </div>
                              ) : itemRolls.length === 0 ? (
                                <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                                  No available rolls found in stock for this fabric type.
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Select Fabric Rolls
                                  </Label>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {itemRolls.map((roll) => {
                                      const isSelected = selectedIds.includes(roll.id);
                                      return (
                                        <button
                                          key={roll.id}
                                          type="button"
                                          onClick={() => toggleRoll(item.id, roll.id)}
                                          className={`flex items-center justify-between p-3 border rounded-lg text-left text-sm transition-all duration-150 ${
                                            isSelected
                                              ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                                              : "border-muted hover:border-muted-foreground/30 bg-background"
                                          }`}
                                        >
                                          <div>
                                            <div className="font-bold text-emerald-950">
                                              {roll.roll_number}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                              {formatNumber(roll.meters, 0)} m |{" "}
                                              {formatNumber(roll.weight, 2)} kg
                                            </div>
                                          </div>
                                          {isSelected ? (
                                            <span className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                                              <Check className="h-3.5 w-3.5" />
                                            </span>
                                          ) : (
                                            <span className="h-5 w-5 rounded-full border border-muted shrink-0" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Invoice Modal Overlay */}
      {isInvoiceModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <Card className="bg-background max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Actions Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <span className="font-bold text-sm text-foreground">Proforma Invoice Preview</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-600/90 transition-colors gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Proforma Invoice Container */}
            <div className="flex-1 overflow-y-auto p-8" id="printable-invoice-content">
              {/* RK Global Header */}
              <div className="flex items-start justify-between border-b pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/rk-global-logo.svg"
                    alt="RK Global Logo"
                    className="h-16 w-16 object-contain rounded-full border"
                  />
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-emerald-950">
                      RK Global
                    </h1>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                      Manufacturers of Premium PP Woven Fabrics & Bags
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground text-sm">RK Global Textiles Ltd.</p>
                  <p>Plot No. 45-C, Industrial Estate, Sector-1</p>
                  <p>Phone: +91 98450 12345 | email: billing@rkglobal.com</p>
                  <p className="font-semibold text-foreground">GSTIN: 37AAAAA1111A1Z1</p>
                </div>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold tracking-wider uppercase border-y py-1.5 bg-muted/10">
                  Proforma Invoice
                </h2>
              </div>

              {/* Metadata Details Split */}
              <div className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                  <h3 className="font-bold text-muted-foreground uppercase border-b pb-1 mb-2 text-[10px]">
                    Customer Details (Bill To)
                  </h3>
                  <div className="space-y-1 text-foreground">
                    <p className="font-bold text-sm">{selectedOrder.customers?.customer_name}</p>
                    {selectedOrder.customers?.alias && (
                      <p className="text-muted-foreground font-medium">
                        Alias: {selectedOrder.customers.alias}
                      </p>
                    )}
                    {selectedOrder.customers?.address && (
                      <p className="whitespace-pre-wrap">{selectedOrder.customers.address}</p>
                    )}
                    {selectedOrder.customers?.phone && (
                      <p>Phone: {selectedOrder.customers.phone}</p>
                    )}
                    {selectedOrder.customers?.gst_number && (
                      <p className="font-bold">GSTIN: {selectedOrder.customers.gst_number}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-muted-foreground uppercase border-b pb-1 text-[10px]">
                    Invoice Info
                  </h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    <span className="text-muted-foreground">Invoice No:</span>
                    <span className="font-bold text-emerald-950">{selectedOrder.order_number}</span>

                    <span className="text-muted-foreground">Invoice Date:</span>
                    <span className="font-semibold">{formatDate(selectedOrder.order_date)}</span>

                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      <span className="capitalize font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                        {selectedOrder.status}
                      </span>
                    </span>

                    <span className="text-muted-foreground">Payment Terms:</span>
                    <span className="text-muted-foreground">Due on Receipt</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse text-xs mb-8">
                <thead>
                  <tr className="border-b bg-muted/40 font-semibold text-muted-foreground">
                    <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                    <th className="py-2.5 px-3">Description of Goods</th>
                    <th className="py-2.5 px-3 w-28">Department</th>
                    <th className="py-2.5 px-3 w-28 text-right">Qty Requested</th>
                    <th className="py-2.5 px-3 w-28 text-right">Qty Delivered</th>
                    <th className="py-2.5 px-3 w-20 text-center">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedOrder.sales_order_items?.map((item, index) => {
                    const itemRolls = getItemRolls(item);
                    const selectedIds = allocation[item.id] || [];
                    const selectedRolls = itemRolls.filter((r) => selectedIds.includes(r.id));
                    const totalMeters = selectedRolls.reduce((sum, r) => sum + Number(r.meters || 0), 0);

                    const prodName = getProductName(item.department, item.product_id);
                    const unit = item.department === "fabric" ? "mtr" : "pcs";

                    return (
                      <tr key={item.id} className="align-top">
                        <td className="py-3 px-3 text-center font-medium">{index + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{prodName}</div>
                          {selectedRolls.length > 0 && (
                            <div className="text-[10px] text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                              Allocated Rolls: {selectedRolls.map((r) => `${r.roll_number} (${formatNumber(r.meters, 0)}m)`).join(", ")}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 capitalize font-medium">{item.department}</td>
                        <td className="py-3 px-3 text-right font-medium">{formatNumber(item.quantity, 2)}</td>
                        <td className="py-3 px-3 text-right font-bold">{formatNumber(totalMeters > 0 ? totalMeters : item.quantity, 2)}</td>
                        <td className="py-3 px-3 text-center uppercase text-muted-foreground">{unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Summary / Totals */}
                <tfoot>
                  <tr className="border-t-2 border-emerald-950 font-bold bg-muted/20">
                    <td colSpan={3} className="py-3 px-3 text-right uppercase">
                      Total
                    </td>
                    <td className="py-3 px-3 text-right">
                      {formatNumber(
                        selectedOrder.sales_order_items?.reduce(
                          (sum, item) => sum + Number(item.quantity),
                          0
                        ) || 0,
                        2
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {formatNumber(
                        selectedOrder.sales_order_items?.reduce((sum, item) => {
                          const itemRolls = getItemRolls(item);
                          const selectedIds = allocation[item.id] || [];
                          const selectedRolls = itemRolls.filter((r) => selectedIds.includes(r.id));
                          const totalMeters = selectedRolls.reduce((s, r) => s + Number(r.meters || 0), 0);
                          return sum + (totalMeters > 0 ? totalMeters : Number(item.quantity));
                        }, 0) || 0,
                        2
                      )}
                    </td>
                    <td className="py-3 px-3 text-center uppercase text-muted-foreground">
                      -
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Stamp and Authorized Signatory */}
              <div className="mt-12 flex justify-between items-end text-xs">
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-bold text-foreground">Terms & Conditions:</p>
                  <p>1. Goods once sold will not be taken back.</p>
                  <p>2. Subject to local jurisdiction checks.</p>
                </div>
                <div className="text-center w-60 border-t pt-4 border-dashed border-muted-foreground/50">
                  <p className="font-bold text-emerald-950 mb-8">For RK Global</p>
                  <p className="font-semibold text-muted-foreground">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
