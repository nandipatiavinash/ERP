import { checkInAttendance, checkOutAttendance } from "@/app/(app)/_actions";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function AttendancePage() {
  await requirePermission("attendance.view");
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: employees }, { data: rows }] = await Promise.all([
    supabase.from("employees").select("id, name, employee_code, shift_start, shift_end").eq("status", "active").is("deleted_at", null).order("name"),
    supabase.from("attendance").select("*, employees(name, employee_code, shift_start, shift_end)").is("deleted_at", null).order("attendance_date", { ascending: false }).limit(100),
  ]);
  const attendanceRows = (rows ?? []) as any[];
  const todayByEmployee = new Map(attendanceRows.filter((row) => row.attendance_date === today).map((row) => [row.employee_id, row]));

  return (
    <>
      <PageHeader title="Attendance" description="Use server-time check in and check out. Status and hours are calculated automatically." />
      <Card className="mb-5">
        <CardHeader><CardTitle>Today</CardTitle></CardHeader>
        <CardContent>
          {(employees ?? []).length === 0 ? <EmptyState title="No active employees" description="Add active employees before recording attendance." /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {((employees ?? []) as any[]).map((employee) => {
                    const attendance = todayByEmployee.get(employee.id) as any;
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="font-medium">{employee.employee_code}</div>
                          <div className="text-sm text-muted-foreground">{employee.name}</div>
                        </TableCell>
                        <TableCell>{employee.shift_start} - {employee.shift_end}</TableCell>
                        <TableCell>{attendance?.check_in ?? "-"}</TableCell>
                        <TableCell>{attendance?.check_out ?? "-"}</TableCell>
                        <TableCell>{attendance?.status ? <StatusBadge value={attendance.status} /> : "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <form action={checkInAttendance}>
                              <input type="hidden" name="employee_id" value={employee.id} />
                              <Button type="submit" size="sm" disabled={Boolean(attendance?.check_in_at)}>Check In</Button>
                            </form>
                            <form action={checkOutAttendance}>
                              <input type="hidden" name="employee_id" value={employee.id} />
                              <Button type="submit" size="sm" variant="outline" disabled={!attendance?.check_in_at || Boolean(attendance?.check_out_at)}>Check Out</Button>
                            </form>
                          </div>
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

      <Card>
        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
        <CardContent>
          {attendanceRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.attendance_date)}</TableCell>
                      <TableCell>{row.employees?.employee_code} - {row.employees?.name}</TableCell>
                      <TableCell>{row.check_in ?? "-"}</TableCell>
                      <TableCell>{row.check_out ?? "-"}</TableCell>
                      <TableCell>{formatNumber(row.working_hours, 2)}</TableCell>
                      <TableCell>{formatNumber(row.overtime_hours, 2)}</TableCell>
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
