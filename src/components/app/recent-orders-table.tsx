"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { DeleteOrderButton } from "@/components/app/delete-order-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecentOrdersTableProps = {
  orders: any[];
  fabrics: any[];
  rotoProducts: any[];
  offsetProducts: any[];
};

export function RecentOrdersTable({
  orders,
  fabrics,
  rotoProducts,
  offsetProducts,
}: RecentOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getCleanBrand = (brandName: string | undefined) => {
    if (!brandName) return "";
    return brandName.split(" (")[0].trim();
  };

  const getItemLabel = (item: any) => {
    const fab = fabrics.find((x) => x.id === item.fabric_type_id)?.label || "FABRIC-TYPE";

    if (item.department === "fabric") {
      const f = fabrics.find((x) => x.id === item.product_id);
      return f ? f.label : "Fabric Product";
    }

    if (item.department === "roto-printing") {
      const r = rotoProducts.find((x) => x.id === item.roto_product_id || x.id === item.product_id);
      const brand = getCleanBrand(r?.label);
      const filmChar = item.film_type === "gloss" ? "G" : item.film_type === "matt" ? "M" : "?";
      const met = item.is_metallic ? "(Mt)" : "";
      return `${brand}(${filmChar})${met}`;
    }

    if (item.department === "lamination") {
      const brand = ["BOX", "F_S", "H_S"].includes(item.lamination_type || "")
        ? getCleanBrand(rotoProducts.find((x) => x.id === item.roto_product_id)?.label)
        : item.lamination_type === "NW"
        ? "NW"
        : "PLAIN";
      const suffix =
        item.lamination_type === "PLAIN" ? "p" : item.lamination_type === "NW" ? "nw" : item.lamination_type === "BOX" ? "b" : item.lamination_type === "F_S" ? "f" : item.lamination_type === "H_S" ? "h" : "";
      return `${brand}(${fab})(${suffix})`;
    }

    if (item.department === "offset-printing") {
      const o = offsetProducts.find((x) => x.id === item.offset_product_id || x.id === item.product_id);
      const brand = getCleanBrand(o?.label);
      const subFabName = item.offset_type === "NW" ? "NW" : fab;
      return `${brand}(${subFabName})`;
    }

    if (item.department === "finishing") {
      const finishType = item.lamination_type ? "LAMINATION" : (item.offset_type !== "none" && item.offset_type ? "OFFSET" : "FABRIC");
      
      if (finishType === "FABRIC") {
        return `PLAIN(${fab})`;
      } else if (finishType === "LAMINATION") {
        const brand = ["BOX", "F_S", "H_S"].includes(item.lamination_type || "")
          ? getCleanBrand(rotoProducts.find((x) => x.id === item.roto_product_id)?.label)
          : item.lamination_type === "NW"
          ? "NW"
          : "PLAIN";
        const suffix =
          item.lamination_type === "PLAIN" ? "p" : item.lamination_type === "NW" ? "nw" : item.lamination_type === "BOX" ? "b" : item.lamination_type === "F_S" ? "f" : item.lamination_type === "H_S" ? "h" : "";
        return `${brand}(${fab})(${suffix})`;
      } else {
        // OFFSET
        const brand = getCleanBrand(offsetProducts.find((x) => x.id === item.offset_product_id)?.label);
        return `${brand}(${fab})`;
      }
    }

    return "Unknown Item";
  };

  const getRmDeptLabel = (dept: string) => {
    const mapping: Record<string, string> = {
      fabric: "Fabric",
      "roto-printing": "Roto Printing",
      lamination: "Lamination",
      "offset-printing": "Offset Printing",
      finishing: "Finishing / Bags",
    };
    return mapping[dept] ?? dept;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Firm Name</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell className="font-bold text-emerald-950">{order.order_number}</TableCell>
                <TableCell>
                  {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers?.alias})` : ""}
                </TableCell>
                <TableCell className="font-semibold text-slate-700">{order.sales_order_items?.length ?? 0} items</TableCell>
                <TableCell>
                  <StatusBadge value={order.status} />
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </Button>
                  <DeleteOrderButton orderId={order.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Order {selectedOrder?.order_number} Details
            </DialogTitle>
            <DialogDescription>
              Staged items for customer <strong>{selectedOrder?.customers?.customer_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {selectedOrder?.sales_order_items && selectedOrder.sales_order_items.length > 0 ? (
              <div className="space-y-3">
                {selectedOrder.sales_order_items.map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm text-sm flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100">
                          {getRmDeptLabel(item.department)}
                        </Badge>
                        <span className="font-bold text-slate-800">{getItemLabel(item)}</span>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 bg-white border border-slate-200 py-1 px-3 rounded-lg shadow-sm">
                      {item.quantity} {item.department === "finishing" ? "pcs" : "kg"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No items found for this order.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
