"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/app/status-badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "roll_id" | "s_no" | "lam_type" | "weight_kg" | "meters" | "entry_date" | "status";
type SortDir = "asc" | "desc";

interface LaminationRoll {
  id: string;
  roll_id: string;
  s_no: number;
  lam_type: string;
  weight_kg: number;
  meters: number;
  entry_date: string;
  status: string;
  supplier_roll_id?: string | null;
  gross_weight?: number | null;
  core_weight?: number | null;
  net_weight?: number | null;
}

interface AllocationInfo {
  dispatchDate: string;
  clientName: string;
}

interface StockLaminationRollsClientProps {
  rolls: LaminationRoll[];
  rollAllocationMap: Record<string, AllocationInfo>;
  fabricName: string;
}

export function StockLaminationRollsClient({ rolls, rollAllocationMap, fabricName }: StockLaminationRollsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("s_no");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredRolls = useMemo(() => {
    return rolls.filter((r) =>
      r.roll_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rolls, searchTerm]);

  const sortedRolls = useMemo(() => {
    return [...filteredRolls].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === "s_no") {
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === "asc" ? numA - numB : numB - numA;
        }
      }

      if (valA === undefined || valA === null) return sortDir === "asc" ? 1 : -1;
      if (valB === undefined || valB === null) return sortDir === "asc" ? -1 : 1;

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRolls, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder="Filter rolls by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs text-xs font-semibold h-9 shadow-none border-slate-200"
        />
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
          Total: {rolls.length} rolls
        </span>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-4 bg-slate-50/30 border-b">
          <CardTitle className="text-sm font-semibold text-slate-800">Laminated Rolls Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedRolls.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No rolls found" description="No laminated rolls match your criteria." />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("s_no")}>
                      S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap font-bold">Gross W8</TableHead>
                    <TableHead className="text-right whitespace-nowrap font-bold">Core W8</TableHead>
                    <TableHead className="text-right whitespace-nowrap font-bold" onClick={() => handleSort("weight_kg")}>
                      Net W8 {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap font-bold" onClick={() => handleSort("meters")}>
                      Mtrs {sortKey === "meters" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right whitespace-nowrap font-bold">Avg Mtrs</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("lam_type")}>
                      Lam Type {sortKey === "lam_type" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                      Prod Date {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Dispatch Date</TableHead>
                    <TableHead className="whitespace-nowrap">Client Name</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                      Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRolls.map((roll) => {
                    const allocation = rollAllocationMap[roll.id];
                    const grossWt = roll.gross_weight ?? roll.weight_kg;
                    const coreWt = roll.core_weight ?? 0;
                    const netWt = roll.net_weight ?? roll.weight_kg;
                    const avgMtrWt = roll.meters > 0 ? (netWt * 1000) / roll.meters : 0;

                    return (
                      <TableRow key={roll.id}>
                        <TableCell className="font-mono font-bold text-slate-800">
                          {roll.roll_id || roll.s_no}
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(grossWt, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(coreWt, 2)}</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-950">{formatNumber(netWt, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(Math.floor(avgMtrWt), 0)}</TableCell>
                        <TableCell className="font-semibold text-xs">{roll.lam_type}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(roll.entry_date)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs font-medium text-slate-600">
                          {allocation?.dispatchDate ? formatDate(allocation.dispatchDate) : "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs font-semibold text-slate-800">
                          {allocation?.clientName ?? "-"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={roll.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
