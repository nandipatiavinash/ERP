"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/app/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "roll_id" | "s_no" | "weight_kg" | "meters" | "entry_date" | "film_type" | "source_roll" | "status";
type SortDir = "asc" | "desc";

interface FilmRoll {
  id: string;
  roll_id: string;
  s_no: number;
  weight_kg: number;
  meters: number;
  entry_date: string;
  film_type?: string;
  status: string;
  supplier_roll_id?: string | null;
}

interface MetallicRoll {
  id: string;
  roll_id: string;
  s_no: number;
  weight_kg: number;
  meters: number;
  entry_date: string;
  status: string;
  supplier_roll_id?: string | null;
  roto_film_rolls?: {
    roll_id: string;
  } | null;
}

interface AllocationInfo {
  dispatchDate: string;
  clientName: string;
}

interface StockRotoRollsClientProps {
  filmRolls: FilmRoll[];
  metallicRolls: MetallicRoll[];
  rollAllocationMap: Record<string, AllocationInfo>;
  brandName: string;
}

export function StockRotoRollsClient({ filmRolls, metallicRolls, rollAllocationMap, brandName }: StockRotoRollsClientProps) {
  const initialTab = filmRolls.length > 0 ? "film" : "metallic";
  const [activeTab, setActiveTab] = useState<"film" | "metallic">(initialTab);
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

  const filteredFilms = useMemo(() => {
    return filmRolls.filter((r) =>
      r.roll_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filmRolls, searchTerm]);

  const filteredMetallics = useMemo(() => {
    return metallicRolls.filter((r) =>
      r.roll_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [metallicRolls, searchTerm]);

  const sortedFilms = useMemo(() => {
    return [...filteredFilms].sort((a, b) => {
      let valA = (a as any)[sortKey];
      let valB = (b as any)[sortKey];

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
  }, [filteredFilms, sortKey, sortDir]);

  const sortedMetallics = useMemo(() => {
    return [...filteredMetallics].sort((a, b) => {
      let valA = (a as any)[sortKey];
      let valB = (b as any)[sortKey];

      if (sortKey === "s_no") {
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === "asc" ? numA - numB : numB - numA;
        }
      }

      if (sortKey === "source_roll") {
        valA = a.roto_film_rolls?.roll_id || "";
        valB = b.roto_film_rolls?.roll_id || "";
      }

      if (valA === undefined || valA === null) return sortDir === "asc" ? 1 : -1;
      if (valB === undefined || valB === null) return sortDir === "asc" ? -1 : 1;

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMetallics, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      {/* Search bar and count */}
      <div className="flex justify-end items-center gap-3 w-full">
        <Input
          placeholder="Filter rolls by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs text-xs font-semibold h-9 shadow-none border-slate-200"
        />
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded whitespace-nowrap">
          Count: {activeTab === "film" ? filmRolls.length : metallicRolls.length}
        </span>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-4 bg-slate-50/30 border-b">
          <CardTitle className="text-sm font-semibold text-slate-800">
            {activeTab === "film" ? "Printed Film Rolls Stock" : "Metallic Film Rolls Stock"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === "film" ? (
            sortedFilms.length === 0 ? (
              <div className="py-12">
                <EmptyState title="No rolls found" description="No printed film rolls matching your criteria." />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("s_no")}>
                        Roll No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                        Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("meters")}>
                        Meters {sortKey === "meters" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                        Date Logged {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                        Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead>Allocation / Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFilms.map((roll) => {
                      const allocation = rollAllocationMap[roll.id];
                      return (
                        <TableRow key={roll.id}>
                          <TableCell className="font-mono text-center font-semibold text-slate-700">
                            {(roll.roll_id.toUpperCase().startsWith("E-") || (roll.supplier_roll_id !== undefined && roll.supplier_roll_id !== null)) ? `E-${roll.s_no}` : roll.s_no}
                          </TableCell>
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
            )
          ) : (
            sortedMetallics.length === 0 ? (
              <div className="py-12">
                <EmptyState title="No rolls found" description="No metallic rolls matching your criteria." />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("s_no")}>
                        Roll No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("source_roll")}>
                        Source Film Roll {sortKey === "source_roll" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                        Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("meters")}>
                        Meters {sortKey === "meters" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                        Date Logged {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                        Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead>Allocation / Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMetallics.map((roll) => {
                      const allocation = rollAllocationMap[roll.id];
                      return (
                        <TableRow key={roll.id}>
                          <TableCell className="font-mono text-center font-semibold text-slate-700">
                            {(roll.roll_id.toUpperCase().startsWith("E-") || (roll.supplier_roll_id !== undefined && roll.supplier_roll_id !== null)) ? `E-${roll.s_no}` : roll.s_no}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">{roll.roto_film_rolls?.roll_id ?? "-"}</TableCell>
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
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
