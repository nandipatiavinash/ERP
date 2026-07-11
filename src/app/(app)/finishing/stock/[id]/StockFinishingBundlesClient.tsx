"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "bundle_id" | "s_no" | "finish_type" | "num_bags" | "weight_kg" | "entry_date";
type SortDir = "asc" | "desc";

interface FinishingBundle {
  id: string;
  bundle_id: string;
  s_no: number;
  finish_type: string;
  num_bags: number;
  weight_kg: number;
  entry_date: string;
}

interface StockFinishingBundlesClientProps {
  bundles: FinishingBundle[];
  fabricName: string;
}

export function StockFinishingBundlesClient({ bundles, fabricName }: StockFinishingBundlesClientProps) {
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

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) =>
      b.bundle_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bundles, searchTerm]);

  const sortedBundles = useMemo(() => {
    return [...filteredBundles].sort((a, b) => {
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
  }, [filteredBundles, sortKey, sortDir]);

  const totalBags = useMemo(() => bundles.reduce((sum, b) => sum + Number(b.num_bags), 0), [bundles]);
  const totalWeight = useMemo(() => bundles.reduce((sum, b) => sum + Number(b.weight_kg), 0), [bundles]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by Bundle ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs h-9 text-xs"
        />
        <div className="text-xs font-semibold text-slate-500 font-mono">
          Total Bags: {formatNumber(totalBags, 0)} pcs · Total Weight: {formatNumber(totalWeight, 1)} kg
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Finished Bundles ({filteredBundles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedBundles.length === 0 ? (
            <EmptyState title="No bundles found" description="No finishing bundles matching your criteria." />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("bundle_id")}>
                      Bundle ID (Source) {sortKey === "bundle_id" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("s_no")}>
                      Bundle No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("finish_type")}>
                      Type {sortKey === "finish_type" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("num_bags")}>
                      No. of Bags {sortKey === "num_bags" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("weight_kg")}>
                      Weight (kg) {sortKey === "weight_kg" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("entry_date")}>
                      Date Logged {sortKey === "entry_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell className="font-mono font-bold text-emerald-950">{bundle.bundle_id}</TableCell>
                      <TableCell className="font-mono text-center font-semibold text-slate-700">{bundle.s_no}</TableCell>
                      <TableCell className="font-semibold text-xs">{bundle.finish_type?.replace(/_/g, "/")}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(bundle.num_bags, 0)}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(bundle.weight_kg, 2)}</TableCell>
                      <TableCell>{formatDate(bundle.entry_date)}</TableCell>
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
