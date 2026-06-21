"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Percent, Printer, Scale, DollarSign, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatDate } from "@/lib/utils";

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
  bill_number: string;
  bill_value: number;
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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [gstRates, setGstRates] = useState<Record<string, number>>({});
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);

  // Initialize prices and GST
  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    const initialGst: Record<string, number> = {};

    orders.forEach((order) => {
      initialGst[order.id] = 18;
      order.sales_order_items?.forEach((item) => {
        if (item.department === "fabric") {
          const fab = fabrics.find((f) => f.id === item.product_id);
          initialPrices[item.id] = fab?.selling_price ?? 0;
        } else {
          initialPrices[item.id] = 0;
        }
      });
    });

    setPrices((prev) => ({ ...initialPrices, ...prev }));
    setGstRates((prev) => ({ ...initialGst, ...prev }));
  }, [orders, fabrics]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
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
    const price = Number(val);
    setPrices((prev) => ({ ...prev, [itemId]: isNaN(price) ? 0 : price }));
  };

  const handleGstChange = (orderId: string, val: string) => {
    const rate = Number(val);
    setGstRates((prev) => ({ ...prev, [orderId]: isNaN(rate) ? 0 : rate }));
  };

  // Printable invoice calculations
  const printOrderData = useMemo(() => {
    if (!printOrderId) return null;
    const order = orders.find((o) => o.id === printOrderId);
    if (!order) return null;

    const items = order.sales_order_items?.map((item) => {
      const qty = getItemQuantity(item);
      const price = prices[item.id] ?? 0;
      const amount = qty * price;
      return {
        ...item,
        resolvedName: getProductName(item.department, item.product_id),
        qty,
        price,
        amount,
        unit: getItemUnit(item),
      };
    }) || [];

    const baseTotal = items.reduce((s, item) => s + item.amount, 0);
    const gstPct = gstRates[order.id] ?? 18;
    const gstAmount = baseTotal * (gstPct / 100);
    const calculatedTotal = baseTotal + gstAmount;
    const balance = calculatedTotal - (order.bill_value ?? 0);

    return {
      order,
      items,
      baseTotal,
      gstPct,
      gstAmount,
      calculatedTotal,
      balance,
    };
  }, [printOrderId, orders, prices, gstRates, rolls]);

  // Handle printing
  useEffect(() => {
    if (printOrderData) {
      const timer = setTimeout(() => {
        window.print();
        setPrintOrderId(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [printOrderData]);

  if (printOrderData) {
    return (
      <div className="fixed inset-0 z-50 bg-white p-8 text-black text-xs font-mono">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-invoice-area, .print-invoice-area * {
              visibility: visible;
            }
            .print-invoice-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white;
            }
          }
        `}</style>
        <div className="print-invoice-area max-w-4xl mx-auto space-y-6">
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">Sales Confirmation Report</h1>
            <p className="text-sm mt-1">RK Global Fabric ERP</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold">Customer Details:</p>
              <p className="text-base font-black mt-1">{printOrderData.order.customers?.customer_name}</p>
              {printOrderData.order.customers?.address && <p className="text-xs text-slate-600 mt-1">{printOrderData.order.customers.address}</p>}
              {printOrderData.order.customers?.phone && <p className="text-xs text-slate-600">Phone: {printOrderData.order.customers.phone}</p>}
            </div>
            <div className="text-right">
              <p><span className="font-bold">Order Number:</span> #{printOrderData.order.order_number}</p>
              <p><span className="font-bold">Order Date:</span> {formatDate(printOrderData.order.order_date)}</p>
              <p><span className="font-bold">Bill Number:</span> {printOrderData.order.bill_number}</p>
              <p><span className="font-bold">Report Date:</span> {formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          <table className="w-full border-collapse border-2 border-slate-900">
            <thead>
              <tr className="bg-slate-100 uppercase text-left border-b-2 border-slate-900">
                <th className="border border-slate-900 p-2">Department</th>
                <th className="border border-slate-900 p-2">Product Description</th>
                <th className="border border-slate-900 p-2 text-right">Qty (KGs / Bags)</th>
                <th className="border border-slate-900 p-2 text-right">Price</th>
                <th className="border border-slate-900 p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {printOrderData.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-400">
                  <td className="border border-slate-900 p-2 capitalize">{item.department}</td>
                  <td className="border border-slate-900 p-2 font-bold">{item.resolvedName}</td>
                  <td className="border border-slate-900 p-2 text-right font-mono">
                    {formatNumber(item.qty, 2)} {item.unit}
                  </td>
                  <td className="border border-slate-900 p-2 text-right font-mono">
                    ₹{formatNumber(item.price, 2)}
                  </td>
                  <td className="border border-slate-900 p-2 text-right font-mono font-bold">
                    ₹{formatNumber(item.amount, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2 border-slate-900 bg-slate-50">
                <td colSpan={4} className="border border-slate-900 p-2 text-right uppercase">Base Amount:</td>
                <td className="border border-slate-900 p-2 text-right font-mono">₹{formatNumber(printOrderData.baseTotal, 2)}</td>
              </tr>
              <tr className="font-bold bg-slate-50">
                <td colSpan={4} className="border border-slate-900 p-2 text-right uppercase">GST ({printOrderData.gstPct}%):</td>
                <td className="border border-slate-900 p-2 text-right font-mono">₹{formatNumber(printOrderData.gstAmount, 2)}</td>
              </tr>
              <tr className="font-bold bg-slate-100 text-base border-t-2 border-slate-900">
                <td colSpan={4} className="border border-slate-900 p-2 text-right uppercase">Calculated Total:</td>
                <td className="border border-slate-900 p-2 text-right font-mono">₹{formatNumber(printOrderData.calculatedTotal, 2)}</td>
              </tr>
              <tr className="font-semibold text-slate-700 bg-slate-50">
                <td colSpan={4} className="border border-slate-900 p-2 text-right uppercase">Bill Value (Entered):</td>
                <td className="border border-slate-900 p-2 text-right font-mono">₹{formatNumber(printOrderData.order.bill_value ?? 0, 2)}</td>
              </tr>
              <tr className="font-bold text-lg border-t-2 border-slate-950 bg-slate-200">
                <td colSpan={4} className="border border-slate-900 p-2 text-right uppercase">Outstanding Balance:</td>
                <td className="border border-slate-900 p-2 text-right font-mono text-emerald-900">₹{formatNumber(printOrderData.balance, 2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-12 text-center text-slate-500 text-[10px]">
            RK Global ERP Sales Report • Generated dynamically on {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <EmptyState
          title="No billed sales on this date"
          description="Billed sales orders from Sales Entry will appear here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const gstPct = gstRates[order.id] ?? 18;

            const itemsWithCalcs = order.sales_order_items?.map((item) => {
              const qty = getItemQuantity(item);
              const price = prices[item.id] ?? 0;
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
            const gstAmount = baseTotal * (gstPct / 100);
            const calculatedTotal = baseTotal + gstAmount;
            const balance = calculatedTotal - (order.bill_value ?? 0);

            return (
              <div
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                {/* Header toggler */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <div className="text-left min-w-0">
                      <span className="font-black text-base text-slate-900 block">
                        {order.customers?.customer_name ?? "—"}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground mt-0.5 inline-block">
                        Order #{order.order_number} · Date: {formatDate(order.order_date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-mono text-right">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Bill No</span>
                      <span className="text-sm font-bold text-slate-800">{order.bill_number}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Bill Value</span>
                      <span className="text-sm font-bold text-slate-800">₹{formatNumber(order.bill_value ?? 0, 2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Balance</span>
                      <span
                        className={`text-sm font-black ${
                          balance > 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        ₹{formatNumber(balance, 2)}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/30 p-5 space-y-6">
                    {/* Calculator banner */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gradient-to-br from-emerald-950 to-slate-900 text-emerald-50 p-4 rounded-xl shadow-inner text-sm font-mono">
                      <div>
                        <div className="text-slate-400 text-xs uppercase font-sans">Base Amount</div>
                        <div className="font-bold text-lg mt-0.5">₹{formatNumber(baseTotal, 2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs uppercase font-sans flex items-center gap-1">
                          <Percent className="h-3 w-3" /> GST Amount
                        </div>
                        <div className="font-bold text-lg mt-0.5">₹{formatNumber(gstAmount, 2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs uppercase font-sans">Calculated Total</div>
                        <div className="font-bold text-lg mt-0.5 text-emerald-400">₹{formatNumber(calculatedTotal, 2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs uppercase font-sans">Bill Value</div>
                        <div className="font-bold text-lg mt-0.5 text-slate-300">₹{formatNumber(order.bill_value ?? 0, 2)}</div>
                      </div>
                      <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-emerald-800/40 pt-3 md:pt-0 md:pl-4">
                        <div className="text-slate-400 text-xs uppercase font-sans">Outstanding Balance</div>
                        <div
                          className={`font-black text-xl mt-0.5 ${
                            balance > 0 ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          ₹{formatNumber(balance, 2)}
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-100/60 text-xs font-bold uppercase text-slate-600">
                            <TableHead>Department</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">KGs / Bags</TableHead>
                            <TableHead className="w-44 text-right">Price (₹)</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itemsWithCalcs.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/50">
                              <TableCell className="text-sm capitalize font-medium text-slate-600">
                                {item.department}
                              </TableCell>
                              <TableCell className="text-sm font-bold text-emerald-950">
                                {item.resolvedName}
                              </TableCell>
                              <TableCell className="text-sm text-right font-mono">
                                {formatNumber(item.qty, 2)} <span className="text-xs text-muted-foreground">{item.unit}</span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="relative flex items-center justify-end">
                                  <span className="absolute left-3 text-muted-foreground text-xs">₹</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={prices[item.id] ?? ""}
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    className="h-8 pl-6 pr-3 w-32 text-right text-sm font-mono border-slate-300 focus-visible:ring-emerald-500"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-right font-mono font-bold text-slate-900">
                                ₹{formatNumber(item.amount, 2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* GST Control, read-only stats and Print Button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 w-32">
                          <Label htmlFor={`gst-${order.id}`} className="text-xs text-muted-foreground font-semibold">
                            GST Percentage (%)
                          </Label>
                          <div className="relative flex items-center">
                            <Percent className="absolute right-3 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                              id={`gst-${order.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={gstPct}
                              onChange={(e) => handleGstChange(order.id, e.target.value)}
                              className="h-8 pr-8 text-sm font-mono border-slate-300 focus-visible:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5"
                          onClick={() => setPrintOrderId(order.id)}
                        >
                          <Printer className="h-4 w-4" />
                          Print Confirmation Report
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
}
