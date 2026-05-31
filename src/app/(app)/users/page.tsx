import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("*, roles(name)").is("deleted_at", null).order("created_at", { ascending: false });
  return (
    <>
      <PageHeader title="Users" description="User profiles are linked to Supabase Auth accounts." />
      <Card>
        <CardHeader><CardTitle>ERP Users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {((data ?? []) as any[]).map((user) => (
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
        </CardContent>
      </Card>
    </>
  );
}
