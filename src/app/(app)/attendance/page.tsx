import { checkInAttendance, checkOutAttendance } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSessionPermissions, requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatTimeInIndia(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function formatDateTimeInIndia(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function hoursBetween(start: string | null | undefined, end: string | null | undefined) {
  if (!start || !end) return 0;
  return Math.max((new Date(end).getTime() - new Date(start).getTime()) / 36e5, 0);
}

function overtimeHours(row: any) {
  if (!row?.check_out_at || !row.attendance_date) return Number(row?.overtime_hours ?? 0);
  const shiftEnd = row.employees?.shift_end ?? "18:00:00";
  const shiftEndAt = new Date(`${row.attendance_date}T${shiftEnd}+05:30`).getTime();
  return Math.max((new Date(row.check_out_at).getTime() - shiftEndAt) / 36e5, 0);
}

function attendanceStatus(row: any) {
  if (!row?.check_in_at && !row?.check_in) return row?.status;
  if (row.check_in_at && !row.check_out_at) return "present";
  if (row.check_in_at && row.check_out_at) {
    const hours = hoursBetween(row.check_in_at, row.check_out_at);
    if (hours === 0) return "absent";
    if (hours < 4) return "half_day";
    return "present";
  }
  return row.status;
}

export default async function AttendancePage() {
  const user = await requirePermission("attendance.view");
  const permissions = await getSessionPermissions(user);
  const canManageAllAttendance = permissions.includes("employees.view") || permissions.includes("users.view");
  const supabase = await createClient();
  const today = todayInIndia();
  const employeeQuery = supabase
    .from("employees")
    .select("id, user_id, name, employee_code, shift_start, shift_end")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("name");
  const { data: employees } = await (canManageAllAttendance ? employeeQuery : employeeQuery.eq("user_id", user.id));
  const employeeIds = ((employees ?? []) as any[]).map((employee) => employee.id);
  let attendanceQuery = supabase
    .from("attendance")
    .select("*, employees(name, employee_code, shift_start, shift_end)")
    .is("deleted_at", null)
    .order("attendance_date", { ascending: false })
    .limit(100);
  if (!canManageAllAttendance) attendanceQuery = attendanceQuery.in("employee_id", employeeIds.length ? employeeIds : ["00000000-0000-0000-0000-000000000000"]);
  const { data: rows } = await attendanceQuery;
  const attendanceRows = (rows ?? []) as any[];
  const todayByEmployee = new Map(attendanceRows.filter((row) => row.attendance_date === today).map((row) => [row.employee_id, row]));

  return (
    <>
      <PageHeader title="Attendance" description="Use server-time check in and check out. Status and hours are calculated automatically." />
      <Card className="mb-5">
        <CardHeader><CardTitle>Today</CardTitle></CardHeader>
        <CardContent>
          {(employees ?? []).length === 0 ? <EmptyState title="No linked employee" description={canManageAllAttendance ? "Add active employees before recording attendance." : "Ask an admin to link your ERP user to an employee record."} /> : (
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
                    const hasCheckedIn = Boolean(attendance?.check_in_at || attendance?.check_in);
                    const hasCheckedOut = Boolean(attendance?.check_out_at || attendance?.check_out);
                    const status = attendanceStatus(attendance);
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="font-medium">{employee.employee_code}</div>
                          <div className="text-sm text-muted-foreground">{employee.name}</div>
                        </TableCell>
                        <TableCell>{employee.shift_start} - {employee.shift_end}</TableCell>
                        <TableCell>{attendance?.check_in_at ? formatTimeInIndia(attendance.check_in_at) : attendance?.check_in ?? "-"}</TableCell>
                        <TableCell>{attendance?.check_out_at ? formatTimeInIndia(attendance.check_out_at) : attendance?.check_out ?? "-"}</TableCell>
                        <TableCell>{status ? <StatusBadge value={status} /> : "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <form action={checkInAttendance}>
                              <input type="hidden" name="employee_id" value={employee.id} />
                              <ConfirmSubmitButton size="sm" disabled={hasCheckedIn} confirmTitle="Check in employee?" confirmDescription="This will record the current server time as the check-in time.">Check In</ConfirmSubmitButton>
                            </form>
                            <form action={checkOutAttendance}>
                              <input type="hidden" name="employee_id" value={employee.id} />
                              <ConfirmSubmitButton size="sm" variant="outline" disabled={!hasCheckedIn || hasCheckedOut} confirmTitle="Check out employee?" confirmDescription="This will record the current server time as the check-out time.">Check Out</ConfirmSubmitButton>
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
                    <TableHead>Recorded At</TableHead>
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
                      <TableCell>{formatDateTimeInIndia(row.updated_at ?? row.created_at)}</TableCell>
                      <TableCell>{row.employees?.employee_code} - {row.employees?.name}</TableCell>
                      <TableCell>{row.check_in_at ? formatTimeInIndia(row.check_in_at) : row.check_in ?? "-"}</TableCell>
                      <TableCell>{row.check_out_at ? formatTimeInIndia(row.check_out_at) : row.check_out ?? "-"}</TableCell>
                      <TableCell>{formatNumber(row.check_in_at && row.check_out_at ? hoursBetween(row.check_in_at, row.check_out_at) : row.working_hours, 2)}</TableCell>
                      <TableCell>{formatNumber(overtimeHours(row), 2)}</TableCell>
                      <TableCell><StatusBadge value={attendanceStatus(row)} /></TableCell>
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
