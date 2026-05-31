import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

type Params = { module?: string; action?: string };

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("audit_logs.view");
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("audit_logs").select("*, users(full_name)").order("created_at", { ascending: false }).limit(200);
  if (params.module) query = query.ilike("module", `%${params.module}%`);
  if (params.action) query = query.ilike("action", `%${params.action}%`);
  const { data } = await query;
  const logs = (data ?? []) as any[];
  return (
    <>
      <PageHeader title="Audit Logs" description="Every create, update, soft delete, and login is tracked." />
      <form className="mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1fr_auto]">
        <Input name="module" defaultValue={params.module ?? ""} placeholder="Filter module" />
        <Input name="action" defaultValue={params.action ?? ""} placeholder="Filter action" />
        <Button type="submit">Filter</Button>
      </form>
      <Card>
        <CardContent className="pt-5">
          {logs.length === 0 ? <EmptyState title="No audit logs" description="No logs match the current filters." /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Module</TableHead><TableHead>Record</TableHead></TableRow></TableHeader>
                <TableBody>
                  {logs.map((log) => (
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
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
