import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function RolesPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase.from("roles").select("*").is("deleted_at", null).order("name");
  return (
    <>
      <PageHeader title="Roles" description="Built-in roles for a simple factory permission model." />
      <Card>
        <CardContent className="pt-5">
          <Table>
            <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {((data ?? []) as any[]).map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium capitalize">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell><StatusBadge value={role.is_active ? "active" : "inactive"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
