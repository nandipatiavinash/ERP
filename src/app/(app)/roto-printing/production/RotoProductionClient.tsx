"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotoFilmProductionForm } from "@/components/app/roto-film-production-form";
import { RotoMetallicProductionForm } from "@/components/app/roto-metallic-production-form";
import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { formatDate } from "@/lib/utils";

interface RotoProductionClientProps {
  rotoProducts: any[];
  rotoColors: any[];
  customers: any[];
  filmRolls: any[];
  filmRows: any[];
  metallicRows: any[];
}

export function RotoProductionClient({
  rotoProducts,
  rotoColors,
  customers,
  filmRolls,
  filmRows,
  metallicRows,
}: RotoProductionClientProps) {
  const [activeTab, setActiveTab] = useState<"film" | "metallic">("film");

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("film")}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "film"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          1. Film Production (GLOSS / MATT)
        </button>
        <button
          onClick={() => setActiveTab("metallic")}
          className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "metallic"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          2. Metallic Production (Mt)
        </button>
      </div>

      {activeTab === "film" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Submit Film Production</CardTitle>
            </CardHeader>
            <CardContent>
              <RotoFilmProductionForm
                rotoProducts={rotoProducts}
                customers={customers}
                rotoColors={rotoColors}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Film Production Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {filmRows.length === 0 ? (
                <EmptyState title="No entries found" description="Film rolls logged will appear here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Roll ID</TableHead>
                        <TableHead className="text-right">KGs</TableHead>
                        <TableHead className="text-right">Meters</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filmRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                          <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                          <TableCell className="text-right font-mono">{row.meters}</TableCell>
                          <TableCell className="text-center">
                            <form action={async () => {
                              await deleteRotoFilmProduction(row.id);
                            }}>
                              <ConfirmSubmitButton
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete film production entry?"
                                confirmDescription="This will delete the roll and free up any downstream items."
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
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Submit Metallic Production</CardTitle>
            </CardHeader>
            <CardContent>
              <RotoMetallicProductionForm
                filmRolls={filmRolls}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Metallic Production Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {metallicRows.length === 0 ? (
                <EmptyState title="No entries found" description="Metallic rolls logged will appear here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>Roll ID</TableHead>
                        <TableHead className="text-right">KGs</TableHead>
                        <TableHead className="text-right">Meters</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metallicRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono font-bold text-emerald-950">{row.roll_id}</TableCell>
                          <TableCell className="text-right font-mono">{row.weight_kg}</TableCell>
                          <TableCell className="text-right font-mono">{row.meters}</TableCell>
                          <TableCell className="text-center">
                            <form action={async () => {
                                await deleteRotoMetallicProduction(row.id);
                            }}>
                              <ConfirmSubmitButton
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete metallic production entry?"
                                confirmDescription="This will delete the roll and restore the source film roll if it was fully consumed."
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
        </>
      )}
    </div>
  );
}
