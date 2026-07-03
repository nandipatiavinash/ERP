"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Percent, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import { saveSalesConfirmationRates } from "@/app/(app)/_actions";
import { DateRangeFilter } from "@/components/app/date-range-filter";

type OrderItem = {
  id: string;
  department: string;
  product_id: string;
  quantity: number;
  selected_roll_ids: string[];
  price?: number;
};

type SalesOrder = {
  id: string;
  order_number: string;
  order_date: string;
  customer_id: string;
  status: string;
  bill_number: string;
  bill_value: number;
  gst_rate?: number;
  customers?: {
    id: string;
    customer_name: string;
    alias?: string;
    phone?: string;
    address?: string;
  };
  sales_order_items?: OrderItem[];
};

interface SalesConfirmationReportClientProps {
  orders: SalesOrder[];
  pendingOrders: SalesOrder[];
  from: string;
  to: string;
  tab: string;
  fabrics: Array<{ id: string; fabric_name: string; selling_price: number }>;
  rotoProducts: Array<{ id: string; brand: string; width: number; height: number }>;
  offsetProducts: Array<{ id: string; brand: string; width: number; height: number }>;
  rolls: Array<{ id: string; weight: number }>;
  permissions?: string[];
}

export function SalesConfirmationReportClient({
  orders,
  pendingOrders,
  from,
  to,
  tab,
  fabrics,
  rotoProducts,
  offsetProducts,
  rolls,
  permissions = [],
}: SalesConfirmationReportClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const activeTab = tab === "completed" ? "completed" : "pending";

  // Collapsible states
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Inputs state
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [gstRates, setGstRates] = useState<Record<string, number>>({});

  // Edit states per order
  const [editingOrders, setEditingOrders] = useState<Record<string, boolean>>({});

  // Submission feedback state
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [successOrders, setSuccessOrders] = useState<Record<string, boolean>>({});
  const [errorText, setErrorText] = useState<Record<string, string | null>>({});

  // Helper to determine if an order has all rates/prices confirmed in database
  const isOrderRatesConfirmed = (order: SalesOrder) => {
    if (!order.sales_order_items || order.sales_order_items.length === 0) return false;
    return order.sales_order_items.every(
      (item: any) => item.price != null && Number(item.price) > 0
    );
  };

  const [clientSearch, setClientSearch] = useState("");

  const clientOptions = useMemo(() => {
    const clientsMap = new Map<string, { id: string; name: string; alias?: string }>();
    const allOrders = [...orders, ...pendingOrders];
    allOrders.forEach((o) => {
      if (o.customers) {
        clientsMap.set(o.customers.id, {
          id: o.customers.id,
          name: o.customers.customer_name,
          alias: o.customers.alias,
        });
      }
    });
    return Array.from(clientsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [orders, pendingOrders]);

  const displayedOrders = activeTab === "pending" ? pendingOrders : orders;

  const filteredDisplayedOrders = useMemo(() => {
    if (!clientSearch) return displayedOrders;
    return displayedOrders.filter((order) => {
      return order.customers?.id === clientSearch;
    });
  }, [displayedOrders, clientSearch]);

  // Group displayed orders by order number
  const groupedOrders = useMemo(() => {
    const groups: Record<string, any> = {};
    for (const order of filteredDisplayedOrders) {
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
  }, [filteredDisplayedOrders]);

  // Sort and filter orders
  const sortedOrders = useMemo(() => {
    const sorted = [...groupedOrders].sort((a, b) => {
      if (a.order_date !== b.order_date) {
        return activeTab === "completed"
          ? b.order_date.localeCompare(a.order_date)
          : a.order_date.localeCompare(b.order_date);
      }
      return (a.order_number || "").localeCompare(b.order_number || "");
    });

    return sorted.filter((group) => {
      const confirmed = isOrderRatesConfirmed(group);
      return activeTab === "completed" ? confirmed : !confirmed;
    });
  }, [groupedOrders, activeTab]);

  const completedGroupCount = useMemo(() => {
    const groups: Record<string, any> = {};
    for (const order of orders) {
      const orderNo = order.order_number;
      if (!orderNo) continue;
      if (!groups[orderNo]) {
        groups[orderNo] = {
          ...order,
          sales_order_items: [...(order.sales_order_items ?? [])],
        };
      } else {
        groups[orderNo].sales_order_items.push(...(order.sales_order_items ?? []));
      }
    }
    return Object.values(groups).filter(isOrderRatesConfirmed).length;
  }, [orders]);

  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    const initialGst: Record<string, number> = {};

    const allOrders = [...orders, ...pendingOrders];
    allOrders.forEach((order) => {
      initialGst[order.id] = Number(order.gst_rate ?? 18);
      order.sales_order_items?.forEach((item) => {
        if (item.price != null && Number(item.price) !== 0) {
          initialPrices[item.id] = Number(item.price);
        } else if (item.department === "fabric") {
          const fab = fabrics.find((f) => f.id === item.product_id);
          initialPrices[item.id] = Number(fab?.selling_price ?? 0);
        } else {
          initialPrices[item.id] = 0;
        }
      });
    });

    setPrices((prev) => ({ ...initialPrices, ...prev }));
    setGstRates((prev) => ({ ...initialGst, ...prev }));
  }, [orders, pendingOrders, fabrics]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getProductName = (dept: string, productId: string) => {
    if (dept === "fabric") {
      const f = fabrics.find((x) => x.id === productId);
      return f ? f.fabric_name : "Fabric Product";
    } else if (dept === "roto-printing") {
      const r = rotoProducts.find((x) => x.id === productId);
      return r ? `${r.brand} (${r.width}x${r.height} mm)` : "Roto Product";
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

  const getItemQuantity = (item: OrderItem) => {
    if (item.department === "fabric") {
      const selectedIds = item.selected_roll_ids || [];
      const itemRolls = rolls.filter((r) => selectedIds.includes(r.id));
      return itemRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0);
    }
    return Number(item.quantity || 0);
  };

  const getItemUnit = (item: OrderItem) => {
    if (item.department === "fabric") return "kg";
    if (item.department === "finishing") return "bags";
    return "pcs";
  };

  const handlePriceChange = (itemId: string, val: string) => {
    const price = Number(val);
    setPrices((prev) => ({ ...prev, [itemId]: isNaN(price) ? 0 : price }));
  };

  const handleGstChange = (orderId: string, val: string) => {
    const rate = Number(val);
    setGstRates((prev) => ({ ...prev, [orderId]: isNaN(rate) ? 0 : rate }));
  };

  const handleSaveOrderRates = async (orderId: string, orderItems: OrderItem[]) => {
    if (saving[orderId]) return;
    setSaving((prev) => ({ ...prev, [orderId]: true }));
    setErrorText((prev) => ({ ...prev, [orderId]: null }));
    setSuccessOrders((prev) => ({ ...prev, [orderId]: false }));

    try {
      const itemPrices: Record<string, number> = {};
      orderItems.forEach((item) => {
        itemPrices[item.id] = Number(prices[item.id] ?? 0);
      });
      const gstRate = Number(gstRates[orderId] ?? 18);

      await saveSalesConfirmationRates(orderId, itemPrices, gstRate);
      showSuccess("Submitted successfully!");

      // Clear price inputs for this order
      setPrices((prev) => {
        const next = { ...prev };
        orderItems.forEach((item) => {
          delete next[item.id];
        });
        return next;
      });
      setGstRates((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      
      // Lock rate inputs upon save
      setEditingOrders((prev) => ({ ...prev, [orderId]: false }));
      
      router.refresh();

      setSuccessOrders((prev) => ({ ...prev, [orderId]: true }));
      setTimeout(() => {
        setSuccessOrders((prev) => ({ ...prev, [orderId]: false }));
      }, 3000);
    } catch (err: any) {
      setErrorText((prev) => ({ ...prev, [orderId]: err.message || "Failed to save prices." }));
    } finally {
      setSaving((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}>
      {/* Premium Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex">
          <button
            onClick={() => {
              startTransition(() => {
                router.push(`/reports/sales-confirmation?tab=pending&from=${from}&to=${to}` as any);
              });
            }}
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
              activeTab === "pending"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Confirmation ({sortedOrders.length})
          </button>
          <button
            onClick={() => {
              startTransition(() => {
                router.push(`/reports/sales-confirmation?tab=completed&from=${from}&to=${to}` as any);
              });
            }}
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
              activeTab === "completed"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Completed Deliveries ({completedGroupCount})
          </button>
        </div>

        <div className="flex items-center gap-3 pb-1">
          <select
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="w-48 h-9 text-xs border border-slate-200 rounded-md bg-background px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Clients</option>
            {clientOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.alias ? `(${c.alias})` : ""}
              </option>
            ))}
          </select>
          {activeTab === "completed" && permissions?.includes("reports.filter_by_date") && (
            <DateRangeFilter from={from} to={to} baseUrl="/reports/sales-confirmation?tab=completed" />
          )}
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <EmptyState
          title={activeTab === "completed" ? "No billed sales on this date" : "No pending confirmations"}
          description={activeTab === "completed" ? "Billed sales orders from Sales Entry will appear here." : "All sales confirmations have rates fully defined."}
        />
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const isOrderExpanded = expandedOrders[order.id] ?? false;
            const gstPct = gstRates[order.id] ?? 18;
            const clientName = order.customers?.customer_name ?? "Unknown Customer";
            const clientAlias = order.customers?.alias;

            const itemsWithCalcs = order.sales_order_items?.map((item: any) => {
              const qty = Number(getItemQuantity(item));
              const price = Number(prices[item.id] ?? 0);
              const amount = qty * price;
              return {
                ...item,
                qty,
                price,
                amount,
                unit: getItemUnit(item),
                resolvedName: getProductName(item.department, item.product_id),
              };
            }) || [];

            const baseTotal = itemsWithCalcs.reduce((s: number, item: any) => s + item.amount, 0);
            const gstAmount = baseTotal * (gstPct / 100);
            const calculatedTotal = baseTotal + gstAmount;
            const billValue = Number(order.bill_value ?? 0);
            const balance = calculatedTotal - billValue;

            const isConfirmed = isOrderRatesConfirmed(order);
            const isEditing = editingOrders[order.id] ?? false;

            return (
              <div
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                {/* Card header / Collapsible trigger button */}
                <button
                  type="button"
                  className="w-full flex flex-col md:flex-row md:items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors gap-3"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isOrderExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-black text-lg text-slate-900 block truncate">
                          {clientName} {clientAlias ? `(${clientAlias})` : ""}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isConfirmed ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {isConfirmed ? "Rates Confirmed" : "Pending Rates"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold text-slate-700">Order #{order.order_number}</span>
                        <span>•</span>
                        <span>Date: {formatDate(order.order_date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-2 md:pt-0 text-left md:text-right text-xs shrink-0">
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Bill No</span>
                      <span className="font-bold text-slate-800 text-sm">{order.bill_number}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Bill Value</span>
                      <span className="font-bold text-slate-800 text-sm">₹{formatNumber(Math.floor(billValue), 0)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Balance</span>
                      <span
                        className={`font-black text-sm ${
                          balance > 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        ₹{formatNumber(Math.floor(balance), 0)}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded Card Content */}
                {isOrderExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/20 p-6 space-y-6">
                    {/* Items Table */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                            <TableHead>Department</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Qty / Weight</TableHead>
                            <TableHead className="w-36 text-right">Price (₹)</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itemsWithCalcs.map((item: any) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-b-0">
                              <TableCell className="text-xs capitalize font-medium text-slate-600">
                                {item.department}
                              </TableCell>
                              <TableCell className="text-xs font-bold text-emerald-950">
                                {item.resolvedName}
                              </TableCell>
                              <TableCell className="text-xs text-right font-medium">
                                {formatNumber(item.qty, 0)} <span className="text-[10px] text-muted-foreground font-normal">{item.unit}</span>
                              </TableCell>
                              <TableCell className="text-right">
                                {isConfirmed && !isEditing ? (
                                  <span className="font-bold text-xs pr-4 text-slate-800">
                                    ₹{formatNumber(item.price, 2)}
                                  </span>
                                ) : (
                                  <div className="relative flex items-center justify-end">
                                    <span className="absolute left-2.5 text-muted-foreground text-[10px]">₹</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={prices[item.id] === 0 ? "" : (prices[item.id] ?? "")}
                                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                      className="h-8 pl-5 pr-2 w-28 text-right text-xs border-slate-300 focus-visible:ring-emerald-500 font-semibold shadow-none"
                                    />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-right font-bold text-slate-900">
                                ₹{formatNumber(Math.floor(item.amount), 0)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Calculations Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-lg shadow-inner text-xs">
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">Base Amount</div>
                        <div className="font-bold text-sm mt-0.5">₹{formatNumber(Math.floor(baseTotal), 0)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">GST Amount</div>
                        <div className="font-bold text-sm mt-0.5">₹{formatNumber(Math.floor(gstAmount), 0)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">Calculated Total</div>
                        <div className="font-bold text-sm mt-0.5 text-emerald-700">₹{formatNumber(Math.floor(calculatedTotal), 0)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">Bill Value</div>
                        <div className="font-bold text-sm mt-0.5 text-slate-700">₹{formatNumber(Math.floor(billValue), 0)}</div>
                      </div>
                      <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">Outstanding Balance</div>
                        <div
                          className={`font-black text-base mt-0.5 ${
                            balance > 0 ? "text-rose-700" : "text-emerald-700"
                          }`}
                        >
                          ₹{formatNumber(Math.floor(balance), 0)}
                        </div>
                      </div>
                    </div>

                    {/* Submit and GST Input Control */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 w-28">
                          <Label htmlFor={`gst-${order.id}`} className="text-[10px] text-muted-foreground font-bold uppercase">
                            GST Rate (%)
                          </Label>
                          {isConfirmed && !isEditing ? (
                            <span className="font-bold text-xs text-slate-800 py-1.5 px-3 bg-slate-100 rounded border border-slate-200 block text-center w-full min-h-[32px] flex items-center justify-center">
                              {order.gst_rate ?? 18}%
                            </span>
                          ) : (
                            <div className="relative flex items-center">
                              <Percent className="absolute right-2.5 h-3 w-3 text-muted-foreground" />
                              <Input
                                id={`gst-${order.id}`}
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={gstRates[order.id] === 0 ? "" : (gstRates[order.id] ?? "")}
                                onChange={(e) => handleGstChange(order.id, e.target.value)}
                                className="h-8 pr-7 text-xs border-slate-300 focus-visible:ring-emerald-500 font-semibold shadow-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {errorText[order.id] && (
                          <p className="text-xs text-destructive max-w-xs">{errorText[order.id]}</p>
                        )}
                        {isConfirmed && !isEditing ? (
                          <Button
                            onClick={() => setEditingOrders((prev) => ({ ...prev, [order.id]: true }))}
                            size="sm"
                            className="rounded-full w-fit px-8 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs h-9 flex items-center gap-1.5 shadow-sm"
                          >
                            Edit Rates
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleSaveOrderRates(order.id, order.sales_order_items || [])}
                            disabled={saving[order.id]}
                            size="sm"
                            className="rounded-full w-fit px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 flex items-center gap-1.5 shadow-sm"
                          >
                            {saving[order.id] ? (
                              "Saving..."
                            ) : successOrders[order.id] ? (
                              <>
                                <Check className="h-3.5 w-3.5" /> Saved
                              </>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        )}
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
}

