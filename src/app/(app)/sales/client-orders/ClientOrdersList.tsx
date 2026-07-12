"use client";

import { useTransition } from "react";
import { approveClientOrder, cancelClientOrder } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Check, X, Clock, FileText, ShoppingBag, Layers } from "lucide-react";
import { showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type ClientOrdersListProps = {
  orders: any[];
};

export function ClientOrdersList({ orders }: ClientOrdersListProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (orderId: string) => {
    if (!confirm("Approve this order and copy it to Order Confirmation draft?")) return;
    startTransition(async () => {
      try {
        await approveClientOrder(orderId);
        showSuccess("Order approved! It is now loaded as a draft in Order Confirmation.");
      } catch (err: any) {
        window.alert(err.message || "Failed to approve order.");
      }
    });
  };

  const handleCancel = (orderId: string) => {
    if (!confirm("Are you sure you want to reject/cancel this client order?")) return;
    startTransition(async () => {
      try {
        await cancelClientOrder(orderId);
        showSuccess("Order cancelled.");
      } catch (err: any) {
        window.alert(err.message || "Failed to cancel order.");
      }
    });
  };

  if (orders.length === 0) {
    return <EmptyState title="No pending orders" description="No pending orders from client portals at this moment." />;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="border-slate-200 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b flex-wrap gap-4 bg-slate-50/50 rounded-t-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800 text-sm">{order.order_number}</span>
                <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> PENDING REVIEW
                </Badge>
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers.alias})` : ""}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold">SUBMITTED ON</p>
              <p className="text-xs font-bold text-slate-700">{formatDate(order.order_date)}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items & Specifications</h4>
              
              <div className="space-y-3">
                {order.client_order_items?.map((item: any, idx: number) => {
                  const isFin = item.item_type === "finishing";
                  const label = isFin ? item.finishing?.name : item.fabric?.fabric_name;

                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.item_type === "fabric" ? "bg-blue-500/10 text-blue-800" : "bg-violet-500/10 text-violet-800"
                          }`}>
                            {item.item_type}
                          </span>
                          <span className="font-bold text-slate-800">{idx + 1}. {label}</span>
                        </div>

                        {/* Specs display (Lamination type, film type, printing brand, etc.) */}
                        {isFin && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {item.fabric?.fabric_name && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Fabric: {item.fabric.fabric_name}
                              </Badge>
                            )}
                            {item.lamination_type && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Lamination: {item.lamination_type}
                              </Badge>
                            )}
                            {item.film_type && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Film: {item.film_type}
                              </Badge>
                            )}
                            {item.roto?.brand && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Roto Brand: {item.roto.brand} {item.is_metallic ? "(MT)" : ""}
                              </Badge>
                            )}
                            {item.offset_type && item.offset_type !== "none" && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Offset: {item.offset_type}
                              </Badge>
                            )}
                            {item.offset?.brand && (
                              <Badge className="text-slate-500 border-slate-200 bg-white">
                                Offset Brand: {item.offset.brand}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 justify-between md:justify-end">
                        {item.unit_price > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">EST. PRICE</p>
                            <p className="text-xs font-bold text-slate-700">₹{Number(item.unit_price).toLocaleString("en-IN")}</p>
                          </div>
                        )}
                        <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-xs">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                <strong className="font-semibold block mb-0.5 text-slate-700">Client Note:</strong>
                {order.notes}
              </div>
            )}

            <div className="border-t pt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(order.id)}
                disabled={isPending}
                className="gap-1 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" /> Reject Order
              </Button>
              <Button
                size="sm"
                onClick={() => handleApprove(order.id)}
                disabled={isPending}
                className="gap-1 shadow-sm"
              >
                <Check className="h-4 w-4" /> Approve & Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
