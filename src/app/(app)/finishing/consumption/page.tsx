import { ConsumptionForm } from "@/components/app/consumption-form";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { DateFilter } from "@/components/app/date-filter";
import {
  softDeleteRawMaterialConsumption,
  consumeFabricRoll,
  revertFabricRollConsumption,
  consumeLaminationRoll,
  revertLaminationRollConsumption,
  consumeOffsetRoll,
  revertOffsetRollConsumption
} from "@/app/(app)/_actions";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";

export default async function FinishingConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("finishing.consumption");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const isToday = date === todayInIndia();

  const [
    rawMaterialsRes,
    rawConsumptionsRes,
    availableFabricRes,
    consumedFabricRes,
    availableLamRes,
    consumedLamRes,
    availableOffsetRes,
    consumedOffsetRes
  ] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status, current_stock")
      .eq("department", "finishing")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name"),
    supabase
      .from("raw_material_consumptions")
      .select("*, raw_materials(material_name, unit)")
      .eq("department", "finishing")
      .eq("consumption_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters")
      .eq("status", "available")
      .eq("current_stage", "loom")
      .is("deleted_at", null)
      .order("roll_number"),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, updated_at")
      .eq("status", "consumed")
      .eq("current_stage", "finishing")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg, meters")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, weight_kg, meters, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, weight_kg")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, weight_kg, updated_at")
      .eq("status", "consumed")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
  ]);

  const materials = (rawMaterialsRes.data ?? []) as any[];
  const rawRows = (rawConsumptionsRes.data ?? []) as any[];
  const availableFabric = (availableFabricRes.data ?? []) as any[];
  const consumedFabric = (consumedFabricRes.data ?? []) as any[];
  const availableLam = (availableLamRes.data ?? []) as any[];
  const consumedLam = (consumedLamRes.data ?? []) as any[];
  const availableOffset = (availableOffsetRes.data ?? []) as any[];
  const consumedOffset = (consumedOffsetRes.data ?? []) as any[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Finishing Consumption"
        description="Log and review consumed raw materials, fabric rolls, laminated rolls, and offset rolls in finishing."
      />

      <div className="flex justify-end">
        <DateFilter date={date} baseUrl="/finishing/consumption" />
      </div>

      {!isToday && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm font-medium">
          Viewing historical records. Logging and deleting are only allowed on the current day.
        </div>
      )}

      {/* SECTION A: Raw Materials Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {isToday && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Log Raw Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionForm department="finishing" materials={materials} />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Raw Materials Consumed on {formatDate(date)}</CardTitle>
            </CardHeader>
            <CardContent>
              {rawRows.length === 0 ? (
                <EmptyState title="No logs found" description="Consumed finishing raw materials will show here." />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
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
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION B: Fabric Rolls Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {isToday && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Consume Fabric Roll</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  action={async (fd) => {
                    "use server";
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeFabricRoll(rollId, "finishing");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Fabric Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      required
                    >
                      <option value="">Select available roll</option>
                      {availableFabric.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_number} ({r.weight}kg · {r.meters}m)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Mark Fabric Roll Consumed
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fabric Rolls Consumed in Finishing</CardTitle>
            </CardHeader>
            <CardContent>
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
                                "use server";
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
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION C: Laminated Rolls Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {isToday && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Consume Laminated Roll</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  action={async (fd) => {
                    "use server";
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeLaminationRoll(rollId);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Laminated Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      required
                    >
                      <option value="">Select available laminated roll</option>
                      {availableLam.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_id} ({r.weight_kg}kg · {r.meters}m)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Mark Lamination Roll Consumed
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lamination Rolls Consumed in Finishing</CardTitle>
            </CardHeader>
            <CardContent>
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
                                "use server";
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
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION D: Offset Rolls Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {isToday && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Consume Offset Roll</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  action={async (fd) => {
                    "use server";
                    const rollId = String(fd.get("roll_id") ?? "");
                    if (rollId) {
                      await consumeOffsetRoll(rollId);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Offset Printed Roll</Label>
                    <select
                      name="roll_id"
                      className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      required
                    >
                      <option value="">Select available offset roll</option>
                      {availableOffset.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roll_id} ({r.weight_kg}kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Mark Offset Roll Consumed
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Offset Printed Rolls Consumed in Finishing</CardTitle>
            </CardHeader>
            <CardContent>
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
                                "use server";
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
