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
}

export function LaminationProductionClient({
  fabricTypes,
  rotoProducts,
  laminationRows,
  pendingOrders = [],
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
                      <TableHead className="text-right">KGs</TableHead>
                      <TableHead className="text-right">Meters</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laminationRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                        <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                        <TableCell className="text-right font-mono">{row.meters}</TableCell>
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
                    ))}
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
