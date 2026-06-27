"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { ConsumptionForm } from "@/components/app/consumption-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  softDeleteRawMaterialConsumption,
  consumeFabricRoll,
  revertFabricRollConsumption,
  consumeLaminationRoll,
  revertLaminationRollConsumption,
  consumeOffsetRoll,
  revertOffsetRollConsumption
} from "@/app/(app)/_actions";
import { Beaker, Layers, Film, Package } from "lucide-react";

interface FinishingConsumptionClientProps {
  date: string;
  isToday: boolean;
  materials: any[];
  rawRows: any[];
  availableFabric: any[];
  consumedFabric: any[];
  availableLam: any[];
  consumedLam: any[];
  availableOffset: any[];
  consumedOffset: any[];
}

export function FinishingConsumptionClient({
  date,
  isToday,
  materials,
  rawRows,
  availableFabric,
  consumedFabric,
  availableLam,
  consumedLam,
  availableOffset,
  consumedOffset,
}: FinishingConsumptionClientProps) {
  const [activeTab, setActiveTab] = useState<string>("raw");

  const sortedFabric = [...availableFabric].sort((a, b) => (a.roll_number ?? "").localeCompare(b.roll_number ?? "", undefined, { numeric: true, sensitivity: "base" }));
  const sortedLam = [...availableLam].sort((a, b) => (a.roll_id ?? "").localeCompare(b.roll_id ?? "", undefined, { numeric: true, sensitivity: "base" }));
  const sortedOffset = [...availableOffset].sort((a, b) => (a.roll_id ?? "").localeCompare(b.roll_id ?? "", undefined, { numeric: true, sensitivity: "base" }));

  const tabs = [
    { id: "raw", label: "Raw Materials", icon: Beaker },
    { id: "fabric", label: "Fabric Rolls", icon: Layers },
    { id: "lamination", label: "Lamination Rolls", icon: Film },
    { id: "offset", label: "Offset Rolls", icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {!isToday && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm font-medium">
          Viewing historical records. Logging and deleting are only allowed on the current day.
        </div>
      )}

      {/* SECTION A: Raw Materials */}
      {activeTab === "raw" && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/20">
          <CardHeader>
            <CardTitle className="text-lg">Raw Materials Consumption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isToday && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Log Raw Materials</h4>
                <ConsumptionForm department="finishing" materials={materials} />
              </div>
            )}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Raw Materials Consumed on {formatDate(date)}</h4>
              {rawRows.length === 0 ? (
                <EmptyState title="No logs found" description="Consumed finishing raw materials will show here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Remarks</TableHead>
                        {isToday && <TableHead className="text-center">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rawRows.map((row: any) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.raw_materials?.material_name ?? "-"}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatNumber(row.quantity, 2)} {row.raw_materials?.unit ?? ""}
                          </TableCell>
                          <TableCell>{row.remarks ?? "-"}</TableCell>
                          {isToday && (
                            <TableCell className="text-center">
                              <form action={softDeleteRawMaterialConsumption}>
                                <input type="hidden" name="id" value={row.id} />
                                <ConfirmSubmitButton
                                  size="sm"
                                  variant="destructive"
                                  confirmTitle="Delete consumption log?"
                                  confirmDescription="This will restore the material stock."
                                >
                                  Delete
                                </ConfirmSubmitButton>
                              </form>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION B: Fabric Rolls */}
      {activeTab === "fabric" && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/20">
          <CardHeader>
            <CardTitle className="text-lg">Fabric Rolls Consumption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isToday && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Consume Fabric Roll</h4>
                <form
                  action={async (fd) => {
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeFabricRoll(rollId, "finishing");
                    }
                  }}
                  className="flex flex-wrap items-end gap-4"
                >
                  <div className="flex-1 min-w-[280px] space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Fabric Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono bg-white"
                      required
                    >
                      <option value="">Select available roll</option>
                      {sortedFabric.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_number} ({r.weight}kg · {r.meters}m)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                    Mark Fabric Roll Consumed
                  </Button>
                </form>
              </div>
            )}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Fabric Rolls Consumed in Finishing</h4>
              {consumedFabric.length === 0 ? (
                <EmptyState title="No consumed rolls" description="Fabric rolls marked as consumed in finishing will show here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Roll Number</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        <TableHead className="text-right">Meters</TableHead>
                        {isToday && <TableHead className="text-center">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumedFabric.map((roll) => (
                        <TableRow key={roll.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_number}</TableCell>
                          <TableCell className="text-right font-mono">{formatNumber(roll.weight, 2)}</TableCell>
                          <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                          {isToday && (
                            <TableCell className="text-center">
                              <form action={async () => {
                                await revertFabricRollConsumption(roll.id);
                              }}>
                                <ConfirmSubmitButton
                                  size="sm"
                                  variant="destructive"
                                  confirmTitle="Revert fabric roll consumption?"
                                  confirmDescription="This will restore the roll back to available loom stock."
                                >
                                  Revert
                                </ConfirmSubmitButton>
                              </form>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION C: Lamination Rolls */}
      {activeTab === "lamination" && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/20">
          <CardHeader>
            <CardTitle className="text-lg">Lamination Rolls Consumption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isToday && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Consume Laminated Roll</h4>
                <form
                  action={async (fd) => {
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeLaminationRoll(rollId);
                    }
                  }}
                  className="flex flex-wrap items-end gap-4"
                >
                  <div className="flex-1 min-w-[280px] space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Laminated Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono bg-white"
                      required
                    >
                      <option value="">Select available laminated roll</option>
                      {sortedLam.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_id} ({r.weight_kg}kg · {r.meters}m)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                    Mark Lamination Roll Consumed
                  </Button>
                </form>
              </div>
            )}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Lamination Rolls Consumed in Finishing</h4>
              {consumedLam.length === 0 ? (
                <EmptyState title="No consumed rolls" description="Lamination rolls marked as consumed in finishing will show here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Roll ID</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        <TableHead className="text-right">Meters</TableHead>
                        {isToday && <TableHead className="text-center">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumedLam.map((roll) => (
                        <TableRow key={roll.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                          <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                          <TableCell className="text-right font-mono">{formatNumber(roll.meters, 0)}</TableCell>
                          {isToday && (
                            <TableCell className="text-center">
                              <form action={async () => {
                                await revertLaminationRollConsumption(roll.id);
                              }}>
                                <ConfirmSubmitButton
                                  size="sm"
                                  variant="destructive"
                                  confirmTitle="Revert laminated roll consumption?"
                                  confirmDescription="This will restore the roll back to available stock."
                                >
                                  Revert
                                </ConfirmSubmitButton>
                              </form>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION D: Offset Rolls */}
      {activeTab === "offset" && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/20">
          <CardHeader>
            <CardTitle className="text-lg">Offset Rolls Consumption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isToday && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Consume Offset Roll</h4>
                <form
                  action={async (fd) => {
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeOffsetRoll(rollId);
                    }
                  }}
                  className="flex flex-wrap items-end gap-4"
                >
                  <div className="flex-1 min-w-[280px] space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Offset Printed Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono bg-white"
                      required
                    >
                      <option value="">Select available offset roll</option>
                      {sortedOffset.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_id} ({r.weight_kg}kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                    Mark Offset Roll Consumed
                  </Button>
                </form>
              </div>
            )}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Offset Printed Rolls Consumed in Finishing</h4>
              {consumedOffset.length === 0 ? (
                <EmptyState title="No consumed rolls" description="Offset rolls marked as consumed in finishing will show here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Roll ID</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        {isToday && <TableHead className="text-center">Action</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumedOffset.map((roll) => (
                        <TableRow key={roll.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{roll.roll_id}</TableCell>
                          <TableCell className="text-right font-mono">{formatNumber(roll.weight_kg, 2)}</TableCell>
                          {isToday && (
                            <TableCell className="text-center">
                              <form action={async () => {
                                await revertOffsetRollConsumption(roll.id);
                              }}>
                                <ConfirmSubmitButton
                                  size="sm"
                                  variant="destructive"
                                  confirmTitle="Revert offset roll consumption?"
                                  confirmDescription="This will restore the roll back to available stock."
                                >
                                  Revert
                                </ConfirmSubmitButton>
                              </form>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
