"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LaminationStockClientProps {
  rolls: Array<{
    id: string;
    roll_id: string;
    fabric_type_id: string;
    fabric_types?: { fabric_name: string } | null;
    status: string;
    weight_kg: number;
    meters: number;
  }>;
  tab: string;
}

export function LaminationStockClient({ rolls, tab }: LaminationStockClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"available" | "all">(
    tab === "all" ? "all" : "available"
  );

  useEffect(() => {
    setActiveTab(tab === "all" ? "all" : "available");
  }, [tab]);

  const stockRows = useMemo(() => {
    const groupsMap = new Map<string, { roll_id: string; fabric_type_id: string; fabric_name: string; rolls: number; weight: number; meters: number }>();
    
    for (const r of rolls) {
      const key = r.roll_id || "Unspecified";
      const fId = r.fabric_type_id || "unspecified";
      const fName = r.fabric_types?.fabric_name || "Unspecified Fabric";

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          roll_id: key,
          fabric_type_id: fId,
          fabric_name: fName,
          rolls: 0,
          weight: 0,
          meters: 0
        });
      }
      
      const g = groupsMap.get(key)!;
      g.rolls += 1;
      g.weight += Number(r.weight_kg || 0);
      g.meters += Number(r.meters || 0);
    }
    
    return Array.from(groupsMap.values())
      .sort((a, b) => a.roll_id.localeCompare(b.roll_id));
  }, [rolls]);

  const totalRolls = useMemo(() => stockRows.reduce((sum, r) => sum + r.rolls, 0), [stockRows]);
  const totalWeight = useMemo(() => stockRows.reduce((sum, r) => sum + r.weight, 0), [stockRows]);
  const totalMeters = useMemo(() => stockRows.reduce((sum, r) => sum + r.meters, 0), [stockRows]);

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}>
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-5 no-print">
        <button
          onClick={() => {
            setActiveTab("available");
            startTransition(() => {
              router.push("/lamination/stock?tab=available" as any);
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
              router.push("/lamination/stock?tab=all" as any);
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
          <CardTitle>{activeTab === "all" ? "All Registered Stock" : "Available Lamination Stock"} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No stock rolls found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification</TableHead>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead className="text-right">Rolls Count</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                    <TableHead className="text-right">Total Meters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-base font-mono text-emerald-950">
                        <Link href={`/lamination/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.roll_id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-base font-medium">{row.fabric_name}</TableCell>
                      <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold" colSpan={2}>Total</TableCell>
                    <TableCell className="text-right text-base font-bold">{totalRolls}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(totalWeight, 2)}</TableCell>
                    <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMeters), 0)}</TableCell>
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
