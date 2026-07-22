import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { todayInIndia } from "@/app/(app)/_actions/helpers";
import {
  TapeLineForm,
  LoomShiftMetersForm,
  ElectricityUnitsForm
} from "@/components/app/daily-data-forms";
import {
  deleteTapeLineEntry,
  deleteLoomShiftMeters,
  deleteElectricityUnits
} from "@/app/(app)/_actions";
import { formatNumber } from "@/lib/utils";

export default async function DailyDataPage() {
  await requirePermission("fabric.daily_data");
  const supabase = await createClient();
  const today = todayInIndia();

  // Fetch all looms + today's logs for each section
  const [
    loomsRes,
    tapeRes,
    loomMetersRes,
    electricityRes
  ] = await Promise.all([
    supabase
      .from("looms")
      .select("id, loom_number")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("loom_number"),
    supabase
      .from("tape_line_entries")
      .select("*")
      .eq("entry_date", today)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("loom_shift_meters")
      .select("*, looms(loom_number)")
      .eq("entry_date", today)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("electricity_units_entries")
      .select("*")
      .eq("entry_date", today)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
  ]);

  const looms = (loomsRes.data ?? []) as any[];
  const tapeEntries = (tapeRes.data ?? []) as any[];
  const loomMetersEntries = (loomMetersRes.data ?? []) as any[];
  const electricityEntries = (electricityRes.data ?? []) as any[];

  return (
    <>
      <PageHeader
        title="Daily Data Entry"
        description="Operators enter daily production loads, loom shift running meters, and electricity units."
      />

      {/* System Date Indicator */}
      <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Date</span>
          <h2 className="text-lg font-bold text-slate-800 font-sans mt-0.5">{today}</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 tracking-wider">
          SYSTEM DATE LOCKED
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tape Line Section */}
        <div className="space-y-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Tape Line Entry</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <TapeLineForm />
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Today's Tape Loads</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {tapeEntries.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No loads logged today" description="Submit the form above to record today's tape loads." />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Type</TableHead>
                      <TableHead>No. of Loads</TableHead>
                      <TableHead className="text-right w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tapeEntries.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-slate-800">{row.tape_type}</TableCell>
                        <TableCell className="font-mono">{formatNumber(row.loads, 2)}</TableCell>
                        <TableCell className="text-right">
                          <form action={deleteTapeLineEntry}>
                            <input type="hidden" name="id" value={row.id} />
                            <ConfirmSubmitButton
                              variant="ghost"
                              size="sm"
                              confirmTitle="Delete Tape Line Entry?"
                              confirmDescription="This will remove this tape line entry."
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </ConfirmSubmitButton>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Electricity Units Section */}
        <div className="space-y-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Electricity Units Entry</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <ElectricityUnitsForm />
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Today's Electricity Units</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {electricityEntries.length === 0 ? (
                <div className="p-6">
                  <EmptyState title="No electricity data today" description="Submit the form above to record units." />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Units</TableHead>
                      <TableHead className="text-right w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {electricityEntries.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-lg font-bold text-slate-800">{formatNumber(row.units, 2)} units</TableCell>
                        <TableCell className="text-right">
                          <form action={deleteElectricityUnits}>
                            <input type="hidden" name="id" value={row.id} />
                            <ConfirmSubmitButton
                              variant="ghost"
                              size="sm"
                              confirmTitle="Delete Electricity Units?"
                              confirmDescription="This will remove today's electricity units entry."
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </ConfirmSubmitButton>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loom Shift Meters Section */}
      <div className="mt-6 space-y-6">
        <Card className="shadow-xs border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">Loom Shift Meters Entry</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <LoomShiftMetersForm looms={looms.map(l => ({ id: l.id, label: l.loom_number }))} />
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">Today's Loom Shift Meters</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loomMetersEntries.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No loom shifts logged today" description="Submit the form above to record loom shift meters." />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Loom ID</TableHead>
                    <TableHead>Day Shift (Mtrs)</TableHead>
                    <TableHead>Night Shift (Mtrs)</TableHead>
                    <TableHead>Total (Mtrs)</TableHead>
                    <TableHead className="text-right w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loomMetersEntries.map((row) => {
                    const day = Number(row.day_shift_meters || 0);
                    const night = Number(row.night_shift_meters || 0);
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold text-slate-800">{row.looms?.loom_number ?? "Unknown"}</TableCell>
                        <TableCell className="font-mono">{formatNumber(day, 2)}</TableCell>
                        <TableCell className="font-mono">{formatNumber(night, 2)}</TableCell>
                        <TableCell className="font-mono font-bold text-slate-900">{formatNumber(day + night, 2)}</TableCell>
                        <TableCell className="text-right">
                          <form action={deleteLoomShiftMeters}>
                            <input type="hidden" name="id" value={row.id} />
                            <ConfirmSubmitButton
                              variant="ghost"
                              size="sm"
                              confirmTitle="Delete Loom Shift entry?"
                              confirmDescription="This will remove this loom shift meters entry."
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
