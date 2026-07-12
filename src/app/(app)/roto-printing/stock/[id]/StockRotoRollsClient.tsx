"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "roll_id" | "s_no" | "weight_kg" | "meters" | "entry_date" | "film_type" | "source_roll";
type SortDir = "asc" | "desc";

interface FilmRoll {
  id: string;
  roll_id: string;
  s_no: number;
  weight_kg: number;
  meters: number;
  entry_date: string;
  film_type?: string;
}

interface MetallicRoll {
  id: string;
  roll_id: string;
  s_no: number;
  weight_kg: number;
  meters: number;
  entry_date: string;
  roto_film_rolls?: {
    roll_id: string;
  } | null;
}

interface StockRotoRollsClientProps {
  filmRolls: FilmRoll[];
  metallicRolls: MetallicRoll[];
  brandName: string;
}

export function StockRotoRollsClient({ filmRolls, metallicRolls, brandName }: StockRotoRollsClientProps) {
  const [activeTab, setActiveTab] = useState<"film" | "metallic">("film");
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
      let valA = a[sortKey as keyof FilmRoll] ?? "";
      let valB = b[sortKey as keyof FilmRoll] ?? "";

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
  }, [filteredFilms, sortKey, sortDir]);

  const sortedMetallics = useMemo(() => {
    return [...filteredMetallics].sort((a, b) => {
      let valA: any = a[sortKey as keyof MetallicRoll] ?? "";
      let valB: any = b[sortKey as keyof MetallicRoll] ?? "";
      
      if (sortKey === "source_roll") {
        valA = a.roto_film_rolls?.roll_id ?? "";
        valB = b.roto_film_rolls?.roll_id ?? "";
      }

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
  }, [filteredMetallics, sortKey, sortDir]);

  const currentCount = activeTab === "film" ? filteredFilms.length : filteredMetallics.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-md text-xs">
          <button
            onClick={() => { setActiveTab("film"); setSortKey("s_no"); setSortDir("asc"); }}
            className={`px-3 py-1.5 rounded-sm font-medium transition-all ${activeTab === "film" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Printed Film ({filmRolls.length})
          </button>
          <button
            onClick={() => { setActiveTab("metallic"); setSortKey("s_no"); setSortDir("asc"); }}
            className={`px-3 py-1.5 rounded-sm font-medium transition-all ${activeTab === "metallic" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Metallic Film ({metallicRolls.length})
          </button>
        </div>

        <Input
          placeholder={`Search by Roll ID...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs h-9 text-xs"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "film" ? "Available Printed Film Rolls" : "Available Metallic Film Rolls"} ({currentCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "film" ? (
            sortedFilms.length === 0 ? (
              <EmptyState title="No rolls found" description="No printed film rolls matching your criteria." />
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
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                        Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("meters")}>
                        Meters {sortKey === "meters" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                        Date Logged {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFilms.map((roll) => (
                      <TableRow key={roll.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                        <TableCell className="font-mono text-center font-semibold text-slate-700">
                          {roll.roll_id.toUpperCase().startsWith("E-") ? `E-${roll.s_no}` : roll.s_no}
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                        <TableCell>{formatDate(roll.entry_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            sortedMetallics.length === 0 ? (
              <EmptyState title="No rolls found" description="No metallic rolls matching your criteria." />
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMetallics.map((roll) => (
                      <TableRow key={roll.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                        <TableCell className="font-mono text-center font-semibold text-slate-700">
                          {roll.roll_id.toUpperCase().startsWith("E-") ? `E-${roll.s_no}` : roll.s_no}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-500">{roll.roto_film_rolls?.roll_id ?? "-"}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                        <TableCell>{formatDate(roll.entry_date)}</TableCell>
                      </TableRow>
                    ))}
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
