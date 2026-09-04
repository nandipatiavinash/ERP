"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { formatDate, formatNumber } from "@/lib/utils";

type SortKey =
  | "roll_number"
  | "net_weight"
  | "core_weight"
  | "gross_weight"
  | "net_meters"
  | "avg_meter_weight"
  | "loom_number"
  | "production_date"
  | "dispatch_date"
  | "client_name";

type SortDir = "asc" | "desc";

interface Roll {
  id: string;
  roll_number: string;
  production_date: string | null;
  status: string;
  weight?: number | null;
  meters?: number | null;
  gross_weight?: number | null;
  core_weight?: number | null;
  net_weight?: number | null;
  looms?: { loom_number: string | null } | null;
  loom_production_entries?: {
    gross_weight: number | null;
    core_weight: number | null;
    net_weight: number | null;
    net_meters: number | null;
    average_meter_weight: number | null;
  } | null;
}

interface AllocationInfo {
  dispatchDate: string;
  clientName: string;
}

interface StockRollsClientProps {
  availableRolls: Roll[];
  soldRolls: Roll[];
  consumedRolls: Roll[];
  rollAllocationMap: Record<string, AllocationInfo>;
  fabricName: string;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-slate-300" />;
  return sortDir === "asc"
    ? <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-primary" />
    : <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-primary" />;
}

function SortableHead({
  col,
  label,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  col: SortKey;
  label: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
  className?: string;
}) {
  return (
    <TableHead
      className={`cursor-pointer select-none whitespace-nowrap hover:bg-muted/40 transition-colors ${className ?? ""}`}
      onClick={() => onSort(col)}
    >
      {label}
      <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
    </TableHead>
  );
}

function useSort(initialKey: SortKey = "roll_number") {
  const [sortKey, setSortKey] = useState<SortKey>(initialKey);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (col: SortKey) => {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  };

  return { sortKey, sortDir, handleSort };
}

function sortRolls(rolls: Roll[], map: Record<string, AllocationInfo>, key: SortKey, dir: SortDir): Roll[] {
  return [...rolls].sort((a, b) => {
    const lpeA = a.loom_production_entries;
    const lpeB = b.loom_production_entries;
    const allocA = map[a.id];
    const allocB = map[b.id];

    let valA: string | number = 0;
    let valB: string | number = 0;

    switch (key) {
      case "roll_number":
        valA = a.roll_number ?? "";
        valB = b.roll_number ?? "";
        break;
      case "net_weight":
        valA = Number(lpeA?.net_weight ?? a.net_weight ?? a.weight ?? 0);
        valB = Number(lpeB?.net_weight ?? b.net_weight ?? b.weight ?? 0);
        break;
      case "core_weight":
        valA = Number(lpeA?.core_weight ?? a.core_weight ?? 0);
        valB = Number(lpeB?.core_weight ?? b.core_weight ?? 0);
        break;
      case "gross_weight":
        valA = Number(lpeA?.gross_weight ?? a.gross_weight ?? a.weight ?? 0);
        valB = Number(lpeB?.gross_weight ?? b.gross_weight ?? b.weight ?? 0);
        break;
      case "net_meters":
        valA = Number(lpeA?.net_meters ?? a.meters ?? 0);
        valB = Number(lpeB?.net_meters ?? b.meters ?? 0);
        break;
      case "avg_meter_weight":
        {
          const metersA = Number(lpeA?.net_meters ?? a.meters ?? 0);
          const weightA = Number(lpeA?.net_weight ?? a.weight ?? 0);
          valA = Number(lpeA?.average_meter_weight ?? (metersA > 0 ? (weightA / metersA) * 1000 : 0));
          const metersB = Number(lpeB?.net_meters ?? b.meters ?? 0);
          const weightB = Number(lpeB?.net_weight ?? b.weight ?? 0);
          valB = Number(lpeB?.average_meter_weight ?? (metersB > 0 ? (weightB / metersB) * 1000 : 0));
        }
        break;
      case "loom_number":
        valA = a.looms?.loom_number ?? (a.roll_number?.startsWith("E-") ? "PURCHASED" : "");
        valB = b.looms?.loom_number ?? (b.roll_number?.startsWith("E-") ? "PURCHASED" : "");
        break;
      case "production_date":
        valA = a.production_date ?? "";
        valB = b.production_date ?? "";
        break;
      case "dispatch_date":
        valA = allocA?.dispatchDate ?? "";
        valB = allocB?.dispatchDate ?? "";
        break;
      case "client_name":
        valA = allocA?.clientName ?? "";
        valB = allocB?.clientName ?? "";
        break;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      const cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
      return dir === "asc" ? cmp : -cmp;
    }
    const cmp = (valA as number) - (valB as number);
    return dir === "asc" ? cmp : -cmp;
  });
}

function RollsTable({
  rolls,
  allocationMap,
  sortKey,
  sortDir,
  onSort,
}: {
  rolls: Roll[];
  allocationMap: Record<string, AllocationInfo>;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
}) {
  const sorted = useMemo(() => sortRolls(rolls, allocationMap, sortKey, sortDir), [rolls, allocationMap, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead col="roll_number" label="S.No" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead col="gross_weight" label="Gross W8" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="text-right" />
            <SortableHead col="core_weight" label="Core W8" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="text-right" />
            <SortableHead col="net_weight" label="Net W8" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="text-right" />
            <SortableHead col="net_meters" label="Mtrs" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="text-right" />
            <SortableHead col="avg_meter_weight" label="Avg Mtrs" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="text-right" />
            <SortableHead col="loom_number" label="Loom" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead col="production_date" label="Prod Date" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead col="dispatch_date" label="Dispatch Date" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead col="client_name" label="Client Name" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((roll) => {
            const lpe = roll.loom_production_entries;
            const netWeight = lpe?.net_weight ?? roll.net_weight ?? roll.weight ?? 0;
            const netMeters = lpe?.net_meters ?? roll.meters ?? 0;
            const avgMeterWt = lpe?.average_meter_weight ?? (netMeters > 0 ? (netWeight / netMeters) * 1000 : 0);
            const loomNo = roll.looms?.loom_number ?? (roll.roll_number?.startsWith("E-") ? "PURCHASED" : "N/A");
            const allocation = allocationMap[roll.id];

            return (
              <TableRow key={roll.id} className="hover:bg-muted/30">
                <TableCell className="font-bold text-emerald-950">{roll.roll_number}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(lpe?.gross_weight ?? roll.gross_weight ?? roll.weight, 2)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(lpe?.core_weight ?? roll.core_weight ?? 0, 2)}</TableCell>
                <TableCell className="text-right font-medium text-emerald-900">{formatNumber(netWeight, 2)}</TableCell>
                <TableCell className="text-right font-medium text-emerald-900">{formatNumber(Math.floor(netMeters), 0)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatNumber(Math.floor(avgMeterWt), 0)}</TableCell>
                <TableCell className="font-medium text-xs text-slate-600">{loomNo}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(roll.production_date)}</TableCell>
                <TableCell className="whitespace-nowrap">{allocation ? formatDate(allocation.dispatchDate) : "—"}</TableCell>
                <TableCell className="font-medium">{allocation ? allocation.clientName : "—"}</TableCell>
                <TableCell>
                  <StatusBadge value={roll.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function CollapsibleRollSection({
  title,
  count,
  rolls,
  allocationMap,
  fabricName,
  defaultOpen = false,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  count: number;
  rolls: Roll[];
  allocationMap: Record<string, AllocationInfo>;
  fabricName: string;
  defaultOpen?: boolean;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { sortKey, sortDir, handleSort } = useSort("roll_number");

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 group"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-bold transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span className="font-semibold text-slate-700">
          {title} ({count})
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {open ? "Click to collapse" : "Click to expand"}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {/* Expandable Content */}
      {open && (
        <div className="border-t border-slate-100">
          <div className="p-4">
            {rolls.length === 0 ? (
              <EmptyState title={emptyTitle} description={emptyDescription} />
            ) : (
              <RollsTable
                rolls={rolls}
                allocationMap={allocationMap}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function StockRollsClient({
  availableRolls,
  soldRolls,
  consumedRolls,
  rollAllocationMap,
  fabricName,
}: StockRollsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const clientNames = useMemo(() => {
    const names = new Set<string>();
    Object.values(rollAllocationMap).forEach((alloc) => {
      if (alloc.clientName && alloc.clientName !== "—") names.add(alloc.clientName);
    });
    return Array.from(names).sort();
  }, [rollAllocationMap]);

  const filterRolls = (list: Roll[]) => {
    return list.filter((r) => {
      const matchesSearch = !searchTerm || (r.roll_number && r.roll_number.toLowerCase().includes(searchTerm.toLowerCase()));
      const alloc = rollAllocationMap[r.id];
      const clientName = alloc?.clientName ?? "";
      const matchesClient = !selectedClient || clientName.toLowerCase() === selectedClient.toLowerCase();
      return matchesSearch && matchesClient;
    });
  };

  const filteredAvailable = useMemo(() => filterRolls(availableRolls), [availableRolls, searchTerm, selectedClient, rollAllocationMap]);
  const filteredConsumed = useMemo(() => filterRolls(consumedRolls), [consumedRolls, searchTerm, selectedClient, rollAllocationMap]);
  const filteredSold = useMemo(() => filterRolls(soldRolls), [soldRolls, searchTerm, selectedClient, rollAllocationMap]);

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search roll S.No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-48 px-3 text-xs font-semibold rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
          Available: {filteredAvailable.length} | Consumed: {filteredConsumed.length} | Sold: {filteredSold.length}
        </span>
      </div>

      {/* Available Rolls – Collapsible */}
      <CollapsibleRollSection
        title="Available Rolls"
        count={filteredAvailable.length}
        rolls={filteredAvailable}
        allocationMap={rollAllocationMap}
        fabricName={fabricName}
        defaultOpen={true}
        emptyTitle="No available rolls"
        emptyDescription={`All rolls for ${fabricName} have been sold, consumed, or none match the filter.`}
      />

      {/* Consumed Rolls – Collapsible */}
      <CollapsibleRollSection
        title="Consumed Rolls"
        count={filteredConsumed.length}
        rolls={filteredConsumed}
        allocationMap={rollAllocationMap}
        fabricName={fabricName}
        defaultOpen={false}
        emptyTitle="No consumed rolls"
        emptyDescription={`No rolls for ${fabricName} match the consumed criteria.`}
      />

      {/* Sold Rolls – Collapsible */}
      <CollapsibleRollSection
        title="Sold Rolls"
        count={filteredSold.length}
        rolls={filteredSold}
        allocationMap={rollAllocationMap}
        fabricName={fabricName}
        defaultOpen={false}
        emptyTitle="No sold rolls"
        emptyDescription={`No rolls for ${fabricName} match the sold criteria.`}
      />
    </div>
  );
}
