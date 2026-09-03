"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OffsetProductionForm } from "@/components/app/offset-production-form";
import { PendingProductionQueue, type QueueItem } from "@/components/app/pending-production-queue";
import { deleteOffsetProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

interface OffsetProductionClientProps {
  fabricTypes: any[];
  laminationRolls: any[];
  offsetProducts: any[];
  offsetRows: any[];
  pendingOrders?: QueueItem[];
  permissions?: string[];
  userRole?: string;
}

export function OffsetProductionClient({
  fabricTypes,
  laminationRolls,
  offsetProducts,
  offsetRows,
  pendingOrders = [],
  permissions = [],
  userRole = "",
}: OffsetProductionClientProps) {
  const [prefill, setPrefill] = useState<{ offsetType: string; fabricTypeId: string; offsetProductId: string } | null>(null);

  const handleSelectOrder = (item: QueueItem) => {
    setPrefill({
      offsetType: item.offset_type || "",
      fabricTypeId: item.fabricTypeId || "",
      offsetProductId: item.offsetProductId || "",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Offset Production</CardTitle>
          </CardHeader>
          <CardContent>
            <OffsetProductionForm
              fabricTypes={fabricTypes}
              laminationRolls={laminationRolls}
              offsetProducts={offsetProducts}
              rows={offsetRows}
              prefillData={prefill}
              permissions={permissions}
              userRole={userRole}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Offset Production Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {offsetRows.length === 0 ? (
              <EmptyState title="No entries found" description="Offset rolls produced will appear here." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Offset Roll ID</TableHead>
                      <TableHead className="text-right">KGs</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offsetRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                        <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                        <TableCell className="text-center">
                          <form action={deleteOffsetProduction.bind(null, row.id)}>
                            <ConfirmSubmitButton
                              size="sm"
                              variant="destructive"
                              confirmTitle="Delete offset entry?"
                              confirmDescription="This will delete this offset roll and free up any downstream items."
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
