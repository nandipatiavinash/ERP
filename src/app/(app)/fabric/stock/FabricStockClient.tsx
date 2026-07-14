"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface FabricStockClientProps {
  fabricTypes: Array<{ id: string; fabric_name: string }>;
  rolls: Array<{ fabric_type_id: string; status: string; weight: number; meters: number }>;
  tab: string;
}

export function FabricStockClient({ fabricTypes, rolls, tab }: FabricStockClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"available" | "all">(
    tab === "all" ? "all" : "available"
  );

  useEffect(() => {
    setActiveTab(tab === "all" ? "all" : "available");
  }, [tab]);

  const stockRows = useMemo(() => {
    return fabricTypes.map((ft) => {
      const matchedRolls = rolls.filter(
        (r) => r.fabric_type_id === ft.id && (activeTab === "all" || r.status === "available")
      );
      return {
        fabric_type_id: ft.id,
        fabric_name: ft.fabric_name,
        rolls: matchedRolls.length,
        weight: matchedRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0),
        meters: matchedRolls.reduce((sum, r) => sum + Number(r.meters || 0), 0),
      };
    }).filter(row => activeTab === "all" || row.rolls > 0);
  }, [fabricTypes, rolls, activeTab]);

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
              router.push("/fabric/stock?tab=available" as any);
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
              router.push("/fabric/stock?tab=all" as any);
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
          <CardTitle>{activeTab === "all" ? "All Registered Stock" : "Available Stock"} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {stockRows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No stock rolls found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fabric Type</TableHead>
                    <TableHead className="text-right">Rolls Count</TableHead>
                    <TableHead className="text-right">Total Weight</TableHead>
                    <TableHead className="text-right">Total Meters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockRows.map((row) => (
                    <TableRow key={row.fabric_type_id}>
                      <TableCell className="font-semibold text-base">
                        <Link href={`/fabric/stock/${row.fabric_type_id}` as any} prefetch={false} className="text-primary hover:underline">
                          {row.fabric_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell className="text-base font-bold">Total</TableCell>
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
