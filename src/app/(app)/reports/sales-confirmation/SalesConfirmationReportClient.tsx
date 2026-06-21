"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Percent, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatDate } from "@/lib/utils";
import { saveSalesConfirmationRates } from "@/app/(app)/_actions";

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
    customer_name: string;
    alias?: string;
    phone?: string;
    address?: string;
  };
  sales_order_items?: OrderItem[];
};

interface SalesConfirmationReportClientProps {
  orders: SalesOrder[];
  fabrics: Array<{ id: string; fabric_name: string; selling_price: number }>;
  rotoProducts: Array<{ id: string; brand: string; width: number; height: number }>;
  offsetProducts: Array<{ id: string; brand: string; width: number; height: number }>;
  rolls: Array<{ id: string; weight: number }>;
}

export function SalesConfirmationReportClient({
  orders,
  fabrics,
  rotoProducts,
  offsetProducts,
  rolls,
}: SalesConfirmationReportClientProps) {
  // Collapsible states
  const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Inputs state
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [gstRates, setGstRates] = useState<Record<string, number>>({});

  // Submission feedback state
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [successOrders, setSuccessOrders] = useState<Record<string, boolean>>({});
  const [errorText, setErrorText] = useState<Record<string, string | null>>({});

  // Group orders by client customer_name
  const ordersByClient = useMemo(() => {
    const groups: Record<string, SalesOrder[]> = {};
    orders.forEach((order) => {
      const clientName = order.customers?.customer_name ?? "Unknown Customer";
      if (!groups[clientName]) {
        groups[clientName] = [];
      }
      groups[clientName].push(order);
    });
    return groups;
  }, [orders]);

  // Initialize input rates/prices
  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    const initialGst: Record<string, number> = {};

    orders.forEach((order) => {
      initialGst[order.id] = Math.floor(order.gst_rate ?? 18);
      order.sales_order_items?.forEach((item) => {
        if (item.price != null && Number(item.price) !== 0) {
          initialPrices[item.id] = Math.floor(Number(item.price));
        } else if (item.department === "fabric") {
          const fab = fabrics.find((f) => f.id === item.product_id);
          initialPrices[item.id] = Math.floor(fab?.selling_price ?? 0);
        } else {
          initialPrices[item.id] = 0;
        }
      });
    });

    setPrices((prev) => ({ ...initialPrices, ...prev }));
    setGstRates((prev) => ({ ...initialGst, ...prev }));
  }, [orders, fabrics]);

  const toggleClient = (clientName: string) => {
    setExpandedClients((prev) => ({ ...prev, [clientName]: !prev[clientName] }));
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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
    const price = Math.floor(Number(val));
    setPrices((prev) => ({ ...prev, [itemId]: isNaN(price) ? 0 : price }));
  };

  const handleGstChange = (orderId: string, val: string) => {
    const rate = Math.floor(Number(val));
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
        itemPrices[item.id] = Math.floor(prices[item.id] ?? 0);
      });
      const gstRate = Math.floor(gstRates[orderId] ?? 18);

      await saveSalesConfirmationRates(orderId, itemPrices, gstRate);

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

  const clientList = Object.keys(ordersByClient).sort();

  return (
    <div className="space-y-4">
      {clientList.length === 0 ? (
        <EmptyState
          title="No billed sales on this date"
          description="Billed sales orders from Sales Entry will appear here."
        />
      ) : (
        <div className="space-y-4">
          {clientList.map((clientName) => {
            const clientOrders = ordersByClient[clientName] || [];
            const isClientExpanded = expandedClients[clientName] ?? false;

            return (
              <div
                key={clientName}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                {/* Client collapsible row */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleClient(clientName)}
                >
                  <div className="flex items-center gap-3">
                    {isClientExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <span className="font-black text-lg text-slate-900 text-left">
                      {clientName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                    {clientOrders.length} {clientOrders.length === 1 ? "Bill" : "Bills"}
                  </span>
                </button>

                {/* Expanded Client Content: Bills/Orders List */}
                {isClientExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/20 p-4 space-y-4">
                    {clientOrders.map((order) => {
                      const isOrderExpanded = expandedOrders[order.id] ?? false;
                      const gstPct = gstRates[order.id] ?? 18;

                      const itemsWithCalcs = order.sales_order_items?.map((item) => {
                        const qty = Math.floor(getItemQuantity(item));
                        const price = Math.floor(prices[item.id] ?? 0);
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

                      const baseTotal = itemsWithCalcs.reduce((s, item) => s + item.amount, 0);
                      const gstAmount = Math.floor(baseTotal * (gstPct / 100));
                      const calculatedTotal = baseTotal + gstAmount;
                      const billValue = Math.floor(order.bill_value ?? 0);
                      const balance = calculatedTotal - billValue;

                      return (
                        <div
                          key={order.id}
                          className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-inner"
                        >
                          {/* Order collapsible row */}
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors"
                            onClick={() => toggleOrder(order.id)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {isOrderExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                              )}
                              <div className="text-left min-w-0 text-xs">
                                <span className="font-black text-slate-700 block">
                                  Order #{order.order_number}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  Date: {formatDate(order.order_date)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-5 shrink-0 text-right text-xs">
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Bill No</span>
                                <span className="font-bold text-slate-800">{order.bill_number}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Bill Value</span>
                                <span className="font-bold text-slate-800">₹{formatNumber(billValue, 0)}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Balance</span>
                                <span
                                  className={`font-black ${
                                    balance > 0 ? "text-rose-600" : "text-emerald-600"
                                  }`}
                                >
                                  ₹{formatNumber(balance, 0)}
                                </span>
                              </div>
                            </div>
                          </button>

                          {/* Expanded Order Content: Items list & Inputs */}
                          {isOrderExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/30 p-4 space-y-4">
                              {/* Summary Banner (Light background style, no dark background, no monospaced font) */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg shadow-inner text-xs">
                                <div>
                                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Base Amount</div>
                                  <div className="font-bold mt-0.5">₹{formatNumber(baseTotal, 0)}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 text-[10px] uppercase font-semibold">GST Amount</div>
                                  <div className="font-bold mt-0.5">₹{formatNumber(gstAmount, 0)}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Calculated Total</div>
                                  <div className="font-bold mt-0.5 text-emerald-700">₹{formatNumber(calculatedTotal, 0)}</div>
                                </div>
                                <div>
                                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Bill Value</div>
                                  <div className="font-bold mt-0.5 text-slate-700">₹{formatNumber(billValue, 0)}</div>
                                </div>
                                <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-3">
                                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Outstanding Balance</div>
                                  <div
                                    className={`font-black text-sm mt-0.5 ${
                                      balance > 0 ? "text-rose-700" : "text-emerald-700"
                                    }`}
                                  >
                                    ₹{formatNumber(balance, 0)}
                                  </div>
                                </div>
                              </div>

                              {/* Items Table */}
                              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-100/60 text-[10px] font-bold uppercase text-slate-600">
                                      <TableHead>Department</TableHead>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-right">KGs / Bags</TableHead>
                                      <TableHead className="w-36 text-right">Price (₹)</TableHead>
                                      <TableHead className="text-right">Amount (₹)</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {itemsWithCalcs.map((item) => (
                                      <TableRow key={item.id} className="hover:bg-slate-50/50">
                                        <TableCell className="text-xs capitalize font-medium text-slate-600">
                                          {item.department}
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-emerald-950">
                                          {item.resolvedName}
                                        </TableCell>
                                        <TableCell className="text-xs text-right">
                                          {formatNumber(item.qty, 0)} <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="relative flex items-center justify-end">
                                            <span className="absolute left-2.5 text-muted-foreground text-[10px]">₹</span>
                                            <Input
                                              type="number"
                                              min="0"
                                              step="1"
                                              placeholder="0"
                                              value={prices[item.id] ?? ""}
                                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                              className="h-7 pl-5 pr-2 w-28 text-right text-xs border-slate-300 focus-visible:ring-emerald-500"
                                            />
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-right font-bold text-slate-900">
                                          ₹{formatNumber(item.amount, 0)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Save Actions and GST Percentage Control */}
                              <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col gap-1 w-28">
                                    <Label htmlFor={`gst-${order.id}`} className="text-[10px] text-muted-foreground font-semibold">
                                      GST Rate (%)
                                    </Label>
                                    <div className="relative flex items-center">
                                      <Percent className="absolute right-2.5 h-3 w-3 text-muted-foreground" />
                                      <Input
                                        id={`gst-${order.id}`}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={gstPct}
                                        onChange={(e) => handleGstChange(order.id, e.target.value)}
                                        className="h-7 pr-7 text-xs border-slate-300 focus-visible:ring-emerald-500"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {errorText[order.id] && (
                                    <p className="text-xs text-destructive max-w-xs">{errorText[order.id]}</p>
                                  )}
                                  <Button
                                    onClick={() => handleSaveOrderRates(order.id, order.sales_order_items || [])}
                                    disabled={saving[order.id]}
                                    size="sm"
                                    className="rounded-full w-fit px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 flex items-center gap-1.5"
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
    </div>
  );
}
