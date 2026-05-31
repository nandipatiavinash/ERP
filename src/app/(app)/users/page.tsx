import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserForm } from "@/components/app/user-form";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  await requirePermission("users.view");
  const supabase = await createClient();
  const [{ data }, { data: roles }] = await Promise.all([
    supabase.from("users").select("*, roles(name)").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("roles").select("id, name").eq("is_active", true).is("deleted_at", null).order("name"),
  ]);
  const users = (data ?? []) as any[];
  return (
    <>
      <PageHeader title="Users" description="Create Supabase Auth users and link them to ERP roles." />
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
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone ?? "-"}</TableCell>
                      <TableCell className="capitalize">{user.roles?.name}</TableCell>
                      <TableCell><StatusBadge value={user.status} /></TableCell>
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
