import { JournalEntryForm } from "@/components/app/journal-entry-form";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { softDeleteJournalEntry } from "@/app/(app)/_actions";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AccountsJournalPage() {
  await requirePermission("sales.view");
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("accounts_journal")
    .select("*")
    .is("deleted_at", null)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (entries ?? []) as any[];

  const totalDebit = rows.filter(r => r.entry_type === "debit").reduce((sum, r) => sum + Number(r.amount), 0);
  const totalCredit = rows.filter(r => r.entry_type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <>
      <PageHeader
        title="Double Entry Journal"
        description="Record and view double-entry accounting journal entries (debits and credits)."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalEntryForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            Recent Journal Entries
            <span className="text-sm font-normal text-muted-foreground">
              Debits: ₹{formatNumber(totalDebit, 2)} | Credits: ₹{formatNumber(totalCredit, 2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState title="No entries found" description="Journal entries will appear here after being saved." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.entry_date)}</TableCell>
                      <TableCell className="font-medium">{row.account_name}</TableCell>
                      <TableCell>
                        <Badge className={row.entry_type === "debit" ? "bg-red-100 text-red-800 border-red-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}>
                          {row.entry_type === "debit" ? "Dr" : "Cr"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(row.amount, 2)}
                      </TableCell>
                      <TableCell>{row.description ?? "-"}</TableCell>
                      <TableCell>
                        <form action={softDeleteJournalEntry}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmitButton
                            size="sm"
                            variant="outline"
                            confirmTitle="Delete journal entry?"
                            confirmDescription="This will soft-delete the journal entry."
                          >
                            Delete
                          </ConfirmSubmitButton>
                        </form>
                      </TableCell>
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
