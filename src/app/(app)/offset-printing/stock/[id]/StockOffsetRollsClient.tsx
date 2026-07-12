"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "roll_id" | "s_no" | "offset_type" | "weight_kg" | "entry_date";
type SortDir = "asc" | "desc";

interface OffsetRoll {
  id: string;
  roll_id: string;
  s_no: number;
  offset_type: string;
  weight_kg: number;
  entry_date: string;
}

interface StockOffsetRollsClientProps {
  rolls: OffsetRoll[];
  fabricName: string;
}

export function StockOffsetRollsClient({ rolls, fabricName }: StockOffsetRollsClientProps) {
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

      if (typeof valA === "string") {
        return sortDir === "asc"
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      } else {
        return sortDir === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
  }, [filteredRolls, sortKey, sortDir]);

  const totalWeight = useMemo(() => rolls.reduce((sum, r) => sum + Number(r.weight_kg), 0), [rolls]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by Roll ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs h-9 text-xs"
        />
        <div className="text-xs font-semibold text-slate-500 font-mono">
          Total Weight: {formatNumber(totalWeight, 1)} kg
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Offset Printed Rolls ({filteredRolls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRolls.length === 0 ? (
            <EmptyState title="No rolls found" description="No offset printed rolls matching your criteria." />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("roll_id")}>
                      Roll ID {sortKey === "roll_id" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("s_no")}>
                      Roll No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("offset_type")}>
                      Offset Type {sortKey === "offset_type" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                      Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                      Date Printed {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRolls.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                      <TableCell className="font-mono text-center font-semibold text-slate-700">
                        {roll.roll_id.toUpperCase().startsWith("E-") ? `E-${roll.s_no}` : roll.s_no}
                      </TableCell>
                      <TableCell className="font-semibold text-xs">{roll.offset_type}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                      <TableCell>{formatDate(roll.entry_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
