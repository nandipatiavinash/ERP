import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AuditLogsPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase.from("audit_logs").select("*, users(full_name)").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <PageHeader title="Audit Logs" description="Every create, update, soft delete, and login is tracked." />
      <Card>
        <CardContent className="pt-5">
          <Table>
            <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Module</TableHead><TableHead>Record</TableHead></TableRow></TableHeader>
            <TableBody>
              {((data ?? []) as any[]).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell>{log.users?.full_name ?? "System"}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell className="font-mono text-xs">{log.record_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
