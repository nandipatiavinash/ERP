"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LaminationProductionForm } from "@/components/app/lamination-production-form";
import { PendingProductionQueue, type QueueItem } from "@/components/app/pending-production-queue";
import { deleteLaminationProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

interface LaminationProductionClientProps {
  fabricTypes: any[];
  rotoProducts: any[];
  laminationRows: any[];
  pendingOrders?: QueueItem[];
  permissions?: string[];
  userRole?: string;
}

export function LaminationProductionClient({
  fabricTypes,
  rotoProducts,
  laminationRows,
  pendingOrders = [],
  permissions = [],
  userRole = "",
}: LaminationProductionClientProps) {
  const [prefill, setPrefill] = useState<{ lamType: string; fabricTypeId: string; rotoProductId: string } | null>(null);

  const handleSelectOrder = (item: QueueItem) => {
    setPrefill({
      lamType: item.lamination_type || "",
      fabricTypeId: item.fabricTypeId || "",
      rotoProductId: item.rotoProductId || "",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Lamination Production</CardTitle>
          </CardHeader>
          <CardContent>
            <LaminationProductionForm
              fabricTypes={fabricTypes}
              rotoProducts={rotoProducts}
              rows={laminationRows}
              prefillData={prefill}
              permissions={permissions}
              userRole={userRole}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Lamination Production Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {laminationRows.length === 0 ? (
              <EmptyState title="No entries found" description="Laminated rolls produced will appear here." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Laminated Roll ID</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead className="text-right">Gross Weight</TableHead>
                      <TableHead className="text-right">Core Weight</TableHead>
                      <TableHead className="text-right">Net Weight</TableHead>
                      <TableHead className="text-right">Net Mtrs</TableHead>
                      <TableHead className="text-right">Avg Mtr Weight</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laminationRows.map((row) => {
                      const avgMeterWeight = row.meters > 0 ? Math.floor((row.weight_kg / row.meters) * 1000) : 0;
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                          <TableCell className="text-sm font-bold text-emerald-900">{row.s_no ?? "-"}</TableCell>
                          <TableCell className="text-right">{row.gross_weight != null ? row.gross_weight.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</TableCell>
                          <TableCell className="text-right">{row.core_weight != null ? row.core_weight.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</TableCell>
                          <TableCell className="text-right font-semibold">{row.weight_kg != null ? row.weight_kg.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</TableCell>
                          <TableCell className="text-right">{row.meters != null ? row.meters.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "-"}</TableCell>
                          <TableCell className="text-right">{avgMeterWeight > 0 ? avgMeterWeight.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "-"}</TableCell>
                          <TableCell className="text-center">
                            <form action={deleteLaminationProduction.bind(null, row.id)}>
                              <ConfirmSubmitButton
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete lamination entry?"
                                confirmDescription="This will delete this laminated roll and free up any downstream items."
                              >
                                Delete
                              </ConfirmSubmitButton>
                            </form>
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

      <div>
        <Card className="h-full border border-slate-200">
          <CardContent className="p-4">
            <PendingProductionQueue
              items={pendingOrders}
              onSelect={handleSelectOrder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
