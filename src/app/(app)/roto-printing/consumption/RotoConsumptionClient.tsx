"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { ConsumptionForm } from "@/components/app/consumption-form";
import { formatDate, formatNumber } from "@/lib/utils";
import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";
import { Beaker } from "lucide-react";

interface RotoConsumptionClientProps {
  date: string;
  isToday: boolean;
  materials: any[];
  rows: any[];
}

export function RotoConsumptionClient({
  date,
  isToday,
  materials,
  rows,
}: RotoConsumptionClientProps) {
  const [activeTab, setActiveTab] = useState<string>("raw");

  const tabs = [
    { id: "raw", label: "Raw Materials", icon: Beaker },
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

      {activeTab === "raw" && (
        <div className="space-y-6">
          {isToday ? (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/20">
              <CardHeader>
                <CardTitle className="text-lg">Log Raw Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionForm department="roto-printing" materials={materials} />
              </CardContent>
            </Card>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm font-medium">
              Viewing historical records. Logging and deleting are only allowed on the current day.
            </div>
          )}

          <Card className="border border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Consumptions for {formatDate(date)}</CardTitle>
            </CardHeader>
            <CardContent>
              {rows.length === 0 ? (
                <EmptyState title="No logs found" description="New consumption logs will show up here after being saved." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Remarks</TableHead>
                        {isToday && <TableHead className="text-center">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row: any) => (
                        <TableRow key={row.id}>
                          <TableCell>{formatDate(row.consumption_date)}</TableCell>
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
                                  confirmDescription="This will revert the stock update and remove the log entry."
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
