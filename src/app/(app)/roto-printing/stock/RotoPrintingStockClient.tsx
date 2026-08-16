"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface FilmRoll {
  id: string;
  roll_id: string;
  weight_kg: number;
  meters: number;
  status: string;
}

interface MetallicRoll {
  id: string;
  roll_id: string;
  weight_kg: number;
  meters: number;
  status: string;
}

interface RotoPrintingStockClientProps {
  filmRolls: FilmRoll[];
  metallicRolls: MetallicRoll[];
  tab: string;
}

export function RotoPrintingStockClient({ filmRolls, metallicRolls, tab }: RotoPrintingStockClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"available" | "all">(
    tab === "all" ? "all" : "available"
  );

  useEffect(() => {
    setActiveTab(tab === "all" ? "all" : "available");
  }, [tab]);

  // Group Film Rolls by roll_id
  const filmStockRows = useMemo(() => {
    const filmGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();
    for (const r of filmRolls) {
      if (activeTab === "all" || r.status === "available") {
        const rId = r.roll_id || "UNSPECIFIED";
        if (!filmGroups.has(rId)) {
          filmGroups.set(rId, {
            roll_id: rId,
            rolls: 0,
            weight: 0,
            meters: 0
          });
        }
        const g = filmGroups.get(rId)!;
        g.rolls += 1;
        g.weight += Number(r.weight_kg || 0);
        g.meters += Number(r.meters || 0);
      }
    }
    return Array.from(filmGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));
  }, [filmRolls, activeTab]);

  // Group Metallic Rolls by roll_id
  const metallicStockRows = useMemo(() => {
    const metallicGroups = new Map<string, { roll_id: string; rolls: number; weight: number; meters: number }>();
    for (const r of metallicRolls) {
      if (activeTab === "all" || r.status === "available") {
        const rId = r.roll_id || "UNSPECIFIED";
        if (!metallicGroups.has(rId)) {
          metallicGroups.set(rId, {
            roll_id: rId,
            rolls: 0,
            weight: 0,
            meters: 0
          });
        }
        const g = metallicGroups.get(rId)!;
        g.rolls += 1;
        g.weight += Number(r.weight_kg || 0);
        g.meters += Number(r.meters || 0);
      }
    }
    return Array.from(metallicGroups.values()).sort((a, b) => a.roll_id.localeCompare(b.roll_id));
  }, [metallicRolls, activeTab]);

  const totalFilmRolls = useMemo(() => filmStockRows.reduce((sum, r) => sum + r.rolls, 0), [filmStockRows]);
  const totalFilmWeight = useMemo(() => filmStockRows.reduce((sum, r) => sum + r.weight, 0), [filmStockRows]);
  const totalFilmMeters = useMemo(() => filmStockRows.reduce((sum, r) => sum + r.meters, 0), [filmStockRows]);

  const totalMetallicRolls = useMemo(() => metallicStockRows.reduce((sum, r) => sum + r.rolls, 0), [metallicStockRows]);
  const totalMetallicWeight = useMemo(() => metallicStockRows.reduce((sum, r) => sum + r.weight, 0), [metallicStockRows]);
  const totalMetallicMeters = useMemo(() => metallicStockRows.reduce((sum, r) => sum + r.meters, 0), [metallicStockRows]);

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}>
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-5 no-print">
        <button
          onClick={() => {
            setActiveTab("available");
            startTransition(() => {
              router.push("/roto-printing/stock?tab=available" as any);
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
              router.push("/roto-printing/stock?tab=all" as any);
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Film Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === "all" ? "All Film Stock" : "Printed Film Stock"} Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {filmStockRows.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No film stock found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification ID</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filmStockRows.map((row) => (
                      <TableRow key={row.roll_id}>
                        <TableCell className="font-semibold text-base font-mono">
                          <Link href={`/roto-printing/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.roll_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold border-t-2">
                      <TableCell className="text-base font-bold">Total</TableCell>
                      <TableCell className="text-right text-base font-bold">{totalFilmRolls}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(totalFilmWeight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalFilmMeters), 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metallic Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === "all" ? "All Metallic Stock" : "Metallic Film Stock"} Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {metallicStockRows.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No metallic stock found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification ID</TableHead>
                      <TableHead className="text-right">Rolls Count</TableHead>
                      <TableHead className="text-right">Total Weight</TableHead>
                      <TableHead className="text-right">Total Meters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metallicStockRows.map((row) => (
                      <TableRow key={row.roll_id}>
                        <TableCell className="font-semibold text-base font-mono">
                          <Link href={`/roto-printing/stock/${encodeURIComponent(row.roll_id)}` as any} prefetch={false} className="text-primary hover:underline">
                            {row.roll_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-base font-medium">{row.rolls}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(row.weight, 2)}</TableCell>
                        <TableCell className="text-right text-base font-medium">{formatNumber(Math.floor(row.meters), 0)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold border-t-2">
                      <TableCell className="text-base font-bold">Total</TableCell>
                      <TableCell className="text-right text-base font-bold">{totalMetallicRolls}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(totalMetallicWeight, 2)}</TableCell>
                      <TableCell className="text-right text-base font-bold">{formatNumber(Math.floor(totalMetallicMeters), 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
