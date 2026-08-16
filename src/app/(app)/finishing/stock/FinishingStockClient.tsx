"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Bundle {
  id: string;
  bundle_id: string;
  num_bags: number;
  weight_kg: number;
  status: string;
}

interface FinishingStockClientProps {
  bundles: Bundle[];
  tab: string;
}

export function FinishingStockClient({ bundles, tab }: FinishingStockClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"available" | "all">(
    tab === "all" ? "all" : "available"
  );

  useEffect(() => {
    setActiveTab(tab === "all" ? "all" : "available");
  }, [tab]);

  const stockRows = useMemo(() => {
    const groupsMap = new Map<string, { bundle_id: string; bundles: number; bags: number; weight: number }>();
    for (const b of bundles) {
      if (activeTab === "all" || b.status === "available") {
        const bId = b.bundle_id || "UNSPECIFIED";
        if (!groupsMap.has(bId)) {
          groupsMap.set(bId, {
            bundle_id: bId,
            bundles: 0,
            bags: 0,
            weight: 0
          });
        }
        const g = groupsMap.get(bId)!;
        g.bundles += 1;
        g.bags += Number(b.num_bags || 0);
        g.weight += Number(b.weight_kg || 0);
      }
    }
    return Array.from(groupsMap.values()).sort((a, b) => a.bundle_id.localeCompare(b.bundle_id));
  }, [bundles, activeTab]);

  const totalBundles = useMemo(() => stockRows.reduce((sum, r) => sum + r.bundles, 0), [stockRows]);
  const totalBags = useMemo(() => stockRows.reduce((sum, r) => sum + r.bags, 0), [stockRows]);
  const totalWeight = useMemo(() => stockRows.reduce((sum, r) => sum + r.weight, 0), [stockRows]);

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}>
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-5 no-print">
        <button
          onClick={() => {
            setActiveTab("available");
            startTransition(() => {
              router.push("/finishing/stock?tab=available" as any);
            });
          }}
          className={cn(
            "px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5",
            activeTab === "available"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          )}
        >
          Available Stock
          {isPending && activeTab === "available" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        </button>
        <button
          onClick={() => {
            setActiveTab("all");
            startTransition(() => {
              router.push("/finishing/stock?tab=all" as any);
            });
          }}
          className={cn(
            "px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5",
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          )}
        >
          All Stock (incl. Consumed/Sold)
          {isPending && activeTab === "all" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === "all" ? "All Registered Finishing Stock" : "Available Finishing Stock"} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No stock bundles found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification ID</TableHead>
                    <TableHead className="text-right">Bundles Count</TableHead>
                    <TableHead className="text-right">Total Bags (pcs)</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-base font-mono">
                        <Link href={`/finishing/stock/${encodeURIComponent(row.bundle_id)}`} prefetch={false} className="text-primary hover:underline">
                          {row.bundle_id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-base font-medium">{row.bundles}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.bags, 0)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold">Total</TableCell>
                    <TableCell className="text-right text-base font-bold">{totalBundles}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalBags, 0)}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
