"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { formatNumber } from "@/lib/utils";

type Roll = {
  id: string;
  roll_number: string;
  fabric_type_id: string;
  loom_id: string;
  weight: number;
  meters: number;
  production_date: string;
  status: string;
  fabric_types?: { fabric_name: string } | null;
  looms?: { loom_number: string } | null;
  loom_production_entries?: {
    gross_weight: number;
    core_weight: number;
    net_weight: number;
    net_meters: number;
    average_meter_weight: number;
  } | null;
};

type StockItem = {
  fabric_type_id: string;
  weight: number;
  meters: number;
  status: string;
  fabric_types: { fabric_name: string } | null;
};

export function FabricInventoryClient({
  rolls,
  stock,
}: {
  rolls: Roll[];
  stock: StockItem[];
}) {
  const [selectedFabricTypeId, setSelectedFabricTypeId] = useState<string | null>(null);

  // Compute stock summary rows alphabetically by fabric name.
  const stockRows = useMemo(() => {
    return Object.values(
      (stock ?? []).reduce<Record<string, any>>((acc, roll) => {
        const key = roll.fabric_type_id;
        acc[key] ??= {
          fabric_type_id: key,
          fabric_name: roll.fabric_types?.fabric_name ?? "Unknown",
          rolls: 0,
          weight: 0,
          meters: 0,
        };
        acc[key].rolls += 1;
        acc[key].weight += Number(roll.weight ?? 0);
        acc[key].meters += Number(roll.meters ?? 0);
        return acc;
      }, {})
    ).sort((a: any, b: any) => String(a.fabric_name).localeCompare(String(b.fabric_name)));
  }, [stock]);

  // Filter rolls by selection (instant client-side filter).
  const filteredRolls = useMemo(() => {
    if (!selectedFabricTypeId) return [];
    return rolls.filter((roll) => roll.fabric_type_id === selectedFabricTypeId);
  }, [rolls, selectedFabricTypeId]);

  return (
    <>
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {stockRows.map((row) => {
          const isActive = selectedFabricTypeId === row.fabric_type_id;
          return (
            <button
              key={row.fabric_type_id}
              onClick={() => setSelectedFabricTypeId(isActive ? null : row.fabric_type_id)}
              className="text-left w-full focus:outline-none"
            >
              <Card
                className={`transition-all duration-200 hover:bg-muted/40 cursor-pointer border-2 ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/20 shadow-md scale-[1.01]"
                    : "border-transparent"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-emerald-950">{row.fabric_name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 text-sm pt-0">
                  <div>
                    <div className="text-muted-foreground text-xs font-medium">Rolls</div>
                    <div className="font-bold text-base text-emerald-900">{row.rolls}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-medium">Weight</div>
                    <div className="font-bold text-base text-emerald-900">{formatNumber(row.weight, 2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-medium">Meters</div>
                    <div className="font-bold text-base text-emerald-900">{formatNumber(Math.floor(row.meters), 0)}</div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <Card className="transition-all duration-300">
        <CardHeader>
          <CardTitle>
            {selectedFabricTypeId
              ? `Rolls for ${stockRows.find((r) => r.fabric_type_id === selectedFabricTypeId)?.fabric_name ?? ""}`
              : "Rolls"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFabricTypeId ? (
            <EmptyState
              title="Select a fabric type"
              description="Click on a fabric type card above to view its rolls."
            />
          ) : filteredRolls.length === 0 ? (
            <EmptyState
              title="No records found"
              description="No rolls match this selected fabric type."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fabric type</TableHead>
                    <TableHead>S. No</TableHead>
                    <TableHead>Gross Weight</TableHead>
                    <TableHead>Core Weight</TableHead>
                    <TableHead>Net Weight</TableHead>
                    <TableHead>net Mtrs</TableHead>
                    <TableHead>Avg Mtr Weight</TableHead>
                    <TableHead>Loom</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRolls.map((roll) => {
                    const fabricName = roll.fabric_types?.fabric_name ?? "";
                    const serialNo = roll.roll_number.startsWith(fabricName + "-")
                      ? roll.roll_number.slice(fabricName.length + 1)
                      : roll.roll_number;
                    const lpe = roll.loom_production_entries;
                    return (
                      <TableRow key={roll.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{fabricName}</TableCell>
                        <TableCell className="font-semibold text-emerald-900">{serialNo}</TableCell>
                        <TableCell>{formatNumber(lpe?.gross_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.core_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(lpe?.net_weight, 2)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.net_meters ?? 0), 0)}</TableCell>
                        <TableCell>{formatNumber(Math.floor(lpe?.average_meter_weight ?? 0), 0)}</TableCell>
                        <TableCell>{roll.looms?.loom_number}</TableCell>
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
    </>
  );
}
