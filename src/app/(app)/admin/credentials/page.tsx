import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserForm } from "@/components/app/user-form";
import { UserRowActions } from "@/components/app/user-row-actions";
import { getSessionUser, requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function CredentialsPage() {
  await requirePermission("admin.credentials");
  const sessionUser = await getSessionUser();
  const sessionUserId = sessionUser?.id ?? "";

  const supabase = await createClient();
  const [{ data }, { data: roles }, { data: employees }] = await Promise.all([
    supabase.from("users").select("*, roles(name)").is("deleted_at", null).order("full_name", { ascending: true }),
    supabase.from("roles").select("id, name").eq("is_active", true).is("deleted_at", null).order("name"),
    supabase.from("employees").select("id, user_id, employee_code, name").eq("status", "active").is("deleted_at", null).order("name"),
  ]);
  const users = (data ?? []) as any[];
  const employeeRows = (employees ?? []) as any[];
  const linkedEmployeeByUser = new Map(employeeRows.filter((employee) => employee.user_id).map((employee) => [employee.user_id, employee]));

  return (
    <>
      <PageHeader title="Login Credentials" description="Create Supabase Auth users and link them to ERP roles." />
      <Card className="mb-5">
        <CardHeader><CardTitle>Create User</CardTitle></CardHeader>
        <CardContent><UserForm roles={((roles ?? []) as any[]).map((role) => ({ id: role.id, name: role.name }))} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>ERP Users</CardTitle></CardHeader>
        <CardContent>
          {users.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Change Password</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Employee Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <UserRowActions
                        user={user}
                        sessionUserId={sessionUserId}
                        employeeRows={employeeRows}
                        linkedEmployee={linkedEmployeeByUser.get(user.id)}
                      />
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
