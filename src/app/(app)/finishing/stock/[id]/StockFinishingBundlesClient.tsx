"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/app/status-badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey = "bundle_id" | "s_no" | "finish_type" | "num_bags" | "weight_kg" | "entry_date" | "status";
type SortDir = "asc" | "desc";

interface FinishingBundle {
  id: string;
  bundle_id: string;
  s_no: number;
  finish_type: string;
  num_bags: number;
  weight_kg: number;
  entry_date: string;
  status: string;
  supplier_roll_id?: string | null;
}

interface AllocationInfo {
  dispatchDate: string;
  clientName: string;
}

interface StockFinishingBundlesClientProps {
  bundles: FinishingBundle[];
  bundleAllocationMap: Record<string, AllocationInfo>;
  fabricName: string;
}

export function StockFinishingBundlesClient({ bundles, bundleAllocationMap, fabricName }: StockFinishingBundlesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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

  const clientNames = useMemo(() => {
    const names = new Set<string>();
    Object.values(bundleAllocationMap).forEach((alloc) => {
      if (alloc.clientName && alloc.clientName !== "-") names.add(alloc.clientName);
    });
    return Array.from(names).sort();
  }, [bundleAllocationMap]);

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => {
      const matchesSearch = b.bundle_id.toLowerCase().includes(searchTerm.toLowerCase()) || String(b.s_no).includes(searchTerm);
      const alloc = bundleAllocationMap[b.id];
      const clientName = alloc?.clientName ?? "";
      const matchesClient = !selectedClient || clientName.toLowerCase() === selectedClient.toLowerCase();
      const matchesStatus = !statusFilter || b.status === statusFilter;
      return matchesSearch && matchesClient && matchesStatus;
    });
  }, [bundles, searchTerm, selectedClient, statusFilter, bundleAllocationMap]);

  const sortedBundles = useMemo(() => {
    return [...filteredBundles].sort((a, b) => {
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
  }, [filteredBundles, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Filter by Bundle ID or S.No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 text-xs font-semibold h-9 shadow-none border-slate-200"
          />

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All Clients</option>
            {clientNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All Statuses</option>
            <option value="available">Available Only</option>
            <option value="sold">Sold</option>
            <option value="consumed">Consumed</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
          Showing: {sortedBundles.length} of {bundles.length} bundles
        </span>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-4 bg-slate-50/30 border-b">
          <CardTitle className="text-sm font-semibold text-slate-800">Finished Bag Bundles Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedBundles.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No bundles found" description="No finished bundles match your criteria." />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("bundle_id")}>
                      Bundle ID {sortKey === "bundle_id" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-center" onClick={() => handleSort("s_no")}>
                      Bundle No / S.No {sortKey === "s_no" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("finish_type")}>
                      Finish Type {sortKey === "finish_type" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
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
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                      Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                    </TableHead>
                    <TableHead>Allocation / Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBundles.map((bundle) => {
                    const allocation = bundleAllocationMap?.[bundle.id];
                    return (
                      <TableRow key={bundle.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{bundle.bundle_id}</TableCell>
                        <TableCell className="font-mono text-center font-semibold text-slate-700">
                          {(bundle.bundle_id.toUpperCase().startsWith("E-") || (bundle.supplier_roll_id !== undefined && bundle.supplier_roll_id !== null)) ? `E-${bundle.s_no}` : bundle.s_no}
                        </TableCell>
                        <TableCell className="font-semibold text-xs">{bundle.finish_type?.replace(/_/g, "/")}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(bundle.num_bags, 0)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(bundle.weight_kg, 2)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(bundle.entry_date)}</TableCell>
                        <TableCell>
                          <StatusBadge value={bundle.status} />
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700">
                          {bundle.status === "sold" && allocation && (
                            <span className="text-blue-600">
                              Sold to <strong className="font-bold">{allocation.clientName}</strong> on {formatDate(allocation.dispatchDate)}
                            </span>
                          )}
                          {bundle.status === "consumed" && (
                            <span className="text-amber-600 font-semibold">Consumed in Production</span>
                          )}
                          {bundle.status === "available" && (
                            <span className="text-emerald-600 font-semibold">In Stock</span>
                          )}
                          {bundle.supplier_roll_id && (
                            <div className="text-[10px] text-slate-500 font-medium">Supplier ID: {bundle.supplier_roll_id}</div>
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
