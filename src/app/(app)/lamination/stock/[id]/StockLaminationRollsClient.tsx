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
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("roll_id")}>
                      Roll ID {sortKey === "roll_id" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("s_no")}>
                      Roll No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("lam_type")}>
                      Lamination Type {sortKey === "lam_type" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                      Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("meters")}>
                      Meters {sortKey === "meters" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                      Date Laminated {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                      Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead>Allocation / Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRolls.map((roll) => {
                    const allocation = rollAllocationMap[roll.id];
                    return (
                      <TableRow key={roll.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                        <TableCell className="font-mono text-center font-semibold text-slate-700">
                          {(roll.roll_id.toUpperCase().startsWith("E-") || (roll.supplier_roll_id !== undefined && roll.supplier_roll_id !== null)) ? `E-${roll.s_no}` : roll.s_no}
                        </TableCell>
                        <TableCell className="font-semibold text-xs">{roll.lam_type}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(roll.entry_date)}</TableCell>
                        <TableCell>
                          <StatusBadge value={roll.status} />
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700">
                          {roll.status === "sold" && allocation && (
                            <span className="text-blue-600">
                              Sold to <strong className="font-bold">{allocation.clientName}</strong> on {formatDate(allocation.dispatchDate)}
                            </span>
                          )}
                          {roll.status === "consumed" && (
                            <span className="text-amber-600 font-semibold">Consumed in Production</span>
                          )}
                          {roll.status === "available" && (
                            <span className="text-emerald-600 font-semibold">In Stock</span>
                          )}
                          {roll.supplier_roll_id && (
                            <div className="text-[10px] text-slate-500 font-medium">Supplier ID: {roll.supplier_roll_id}</div>
                          )}
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
