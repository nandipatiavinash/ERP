import { saveAttendance } from "@/app/(app)/_actions";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { attendanceStatuses } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AttendancePage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const [{ data: employees }, { data: rows }] = await Promise.all([
    supabase.from("employees").select("id, name, employee_code").eq("status", "active").is("deleted_at", null).order("name"),
    supabase.from("attendance").select("*, employees(name, employee_code)").is("deleted_at", null).order("attendance_date", { ascending: false }).limit(100),
  ]);
  const attendanceRows = (rows ?? []) as any[];

  return (
    <>
      <PageHeader title="Attendance" description="Daily and monthly HR attendance records." />
      <Card className="mb-5">
        <CardHeader><CardTitle>Add Attendance</CardTitle></CardHeader>
        <CardContent>
          <form action={saveAttendance} className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Employee</Label>
              <select name="employee_id" required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                <option value="" disabled>Select employee</option>
                {((employees ?? []) as any[]).map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.employee_code} - {employee.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input name="attendance_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></div>
            <div className="space-y-2"><Label>Check In</Label><Input name="check_in" type="time" /></div>
            <div className="space-y-2"><Label>Check Out</Label><Input name="check_out" type="time" /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select name="status" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                {attendanceStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-5"><Button type="submit">Save Attendance</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
        <CardContent>
          {attendanceRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {attendanceRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.attendance_date)}</TableCell>
                      <TableCell>{row.employees?.employee_code} - {row.employees?.name}</TableCell>
                      <TableCell>{row.check_in ?? "-"}</TableCell>
                      <TableCell>{row.check_out ?? "-"}</TableCell>
                      <TableCell><StatusBadge value={row.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
