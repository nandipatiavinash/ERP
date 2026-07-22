"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, ShieldAlert, Sparkles, Layers } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export type QueueItem = {
  id: string; // sales_order_item_id
  sales_order_id: string;
  order_number: string;
  order_date: string;
  priority: number;
  customerName: string;
  department: string;
  quantity: number;
  
  // Specs
  fabricTypeId?: string | null;
  fabricName?: string;
  fabricWidth?: number;
  fabricGsm?: number;

  rotoProductId?: string | null;
  rotoBrand?: string;
  rotoWidth?: number;
  rotoHeight?: number;

  offsetProductId?: string | null;
  offsetBrand?: string;
  offsetWidth?: number;
  offsetHeight?: number;

  film_type?: string | null;
  is_metallic?: boolean;
  lamination_type?: string | null;
  offset_type?: string | null;
  raw_item?: any;
};

interface PendingProductionQueueProps {
  items: QueueItem[];
  onSelect: (item: QueueItem) => void;
}

export function PendingProductionQueue({ items, onSelect }: PendingProductionQueueProps) {
  const [sortBy, setSortBy] = useState<"order" | "priority" | "variety">("order");
  const [search, setSearch] = useState("");

  const sortedAndFilteredItems = useMemo(() => {
    // 1. Filter
    let result = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.order_number.toLowerCase().includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          (item.rotoBrand && item.rotoBrand.toLowerCase().includes(q)) ||
          (item.offsetBrand && item.offsetBrand.toLowerCase().includes(q)) ||
          (item.fabricName && item.fabricName.toLowerCase().includes(q))
      );
    }

    // 2. Sort
    if (sortBy === "order") {
      // FCFS: order_date ASC, order_number ASC
      result.sort((a, b) => {
        const dateCompare = a.order_date.localeCompare(b.order_date);
        if (dateCompare !== 0) return dateCompare;
        return a.order_number.localeCompare(b.order_number);
      });
    } else if (sortBy === "priority") {
      // Priority DESC (highest first), then order_date ASC
      result.sort((a, b) => {
        const priorityCompare = b.priority - a.priority;
        if (priorityCompare !== 0) return priorityCompare;
        return a.order_date.localeCompare(b.order_date);
      });
    } else if (sortBy === "variety") {
      // Group by Size & Type
      result.sort((a, b) => {
        // Size comparison
        const aWidth = a.rotoWidth || a.offsetWidth || a.fabricWidth || 0;
        const bWidth = b.rotoWidth || b.offsetWidth || b.fabricWidth || 0;
        if (aWidth !== bWidth) return aWidth - bWidth;

        const aHeight = a.rotoHeight || a.offsetHeight || a.fabricGsm || 0;
        const bHeight = b.rotoHeight || b.offsetHeight || b.fabricGsm || 0;
        if (aHeight !== bHeight) return aHeight - bHeight;

        // Type comparison
        const aType = a.film_type || a.lamination_type || a.offset_type || "";
        const bType = b.film_type || b.lamination_type || b.offset_type || "";
        return aType.localeCompare(bType);
      });
    }

    return result;
  }, [items, sortBy, search]);

  const getItemLabel = (item: QueueItem) => {
    if (item.department === "roto-printing") {
      const film = item.film_type === "gloss" ? "Gloss" : item.film_type === "matt" ? "Matt" : "Plain";
      const met = item.is_metallic ? "Metallic" : "Std";
      const dim = item.rotoWidth && item.rotoHeight ? ` · ${item.rotoWidth}x${item.rotoHeight}mm` : "";
      return `${item.rotoBrand} (${film} · ${met}${dim})`;
    }
    if (item.department === "lamination") {
      const lType = item.lamination_type || "PLAIN";
      const dim = item.fabricWidth ? ` · ${item.fabricWidth}″` : "";
      const film = item.is_metallic ? "Film(MT)" : "Film";
      return `${lType} Lamination (${item.fabricName || "Fabric"}${dim} · ${film})`;
    }
    if (item.department === "offset-printing") {
      const dim = item.offsetWidth && item.offsetHeight ? ` · ${item.offsetWidth}x${item.offsetHeight}mm` : "";
      return `${item.offsetBrand} (${item.offset_type || "Std"}${dim})`;
    }
    return "Product ID: " + (item.rotoBrand || item.offsetBrand || item.fabricName || "General");
  };

  return (
    <div className="space-y-4 flex flex-col h-full min-h-[300px]">
      <div className="flex flex-col gap-2 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Orders Queue</h3>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brand, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-lg"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white p-0.5 mt-1 shrink-0">
          <button
            type="button"
            onClick={() => setSortBy("order")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-bold transition-all rounded-md ${
              sortBy === "order" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowUpDown className="h-3 w-3" /> FCFS Order
          </button>
          <button
            type="button"
            onClick={() => setSortBy("priority")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-bold transition-all rounded-md ${
              sortBy === "priority" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ShieldAlert className="h-3 w-3" /> Priority
          </button>
          <button
            type="button"
            onClick={() => setSortBy("variety")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-bold transition-all rounded-md ${
              sortBy === "variety" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Layers className="h-3 w-3" /> Variety (Size)
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-[480px] space-y-2.5 pr-1">
        {sortedAndFilteredItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl p-4 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">No pending orders in queue.</p>
          </div>
        ) : (
          sortedAndFilteredItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => onSelect(item)}
              className="border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all duration-200 cursor-pointer bg-white"
            >
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 font-sans tracking-wide uppercase">
                      Order: {item.order_number} · {item.order_date}
                    </p>
                    <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">
                      {getItemLabel(item)}
                    </h4>
                  </div>
                  {item.priority > 0 && (
                    <Badge className="text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 shrink-0 bg-red-50 text-red-700 border-red-200">
                      P{item.priority}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="truncate max-w-[150px] font-medium">{item.customerName}</span>
                  <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                    {formatNumber(item.quantity, 0)} KGs
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
