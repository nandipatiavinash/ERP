import { JournalEntryForm } from "@/components/app/journal-entry-form";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { softDeleteJournalEntryGroup } from "@/app/(app)/_actions";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";

type JournalEntryRow = {
  id: string;
  journal_no: string | null;
  entry_date: string;
  account_name: string;
  entry_type: "debit" | "credit";
  amount: string | number;
  description: string | null;
};

export default async function AccountsJournalPage(props: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  await requirePermission("sales.view");
  const searchParams = await props.searchParams;
  const editJournalNo = searchParams?.edit ?? "";
  const isEditing = Boolean(editJournalNo);

  const supabase = await createClient();

  // 1. Fetch entries + customers (for account dropdown)
  const [{ data: entries }, { data: customers }] = await Promise.all([
    supabase
      .from("accounts_journal")
      .select("*")
      .is("deleted_at", null)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("customers")
      .select("id, customer_name, alias, gst_number")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("customer_name")
  ]);

  const accountsList = ((customers ?? []) as any[]).map((c) => ({
    category: "Clients / Firms",
    name: c.customer_name + (c.alias ? ` (${c.alias})` : ""),
  }));

  const rows = (entries ?? []) as JournalEntryRow[];

  // 2. Fetch edit details if editing
  let editRows: any[] = [];
  let editJournalDate = "";
  if (editJournalNo) {
    editRows = rows.filter(r => r.journal_no === editJournalNo);
    // If not found in limit, fetch directly
    if (editRows.length === 0) {
      const { data } = await supabase
        .from("accounts_journal")
        .select("*")
        .eq("journal_no", editJournalNo)
        .is("deleted_at", null);
      editRows = (data ?? []) as JournalEntryRow[];
    }
    if (editRows.length > 0) {
      editJournalDate = editRows[0].entry_date;
    }
  }

  // 3. Generate next Journal Number
  const { data: dbJournals } = await supabase
    .from("accounts_journal")
    .select("journal_no")
    .is("deleted_at", null);
  const journalNos = ((dbJournals ?? []) as Array<{ journal_no: string | null }>)
    .map(j => j.journal_no)
    .filter((journalNo): journalNo is string => Boolean(journalNo));
  let nextJEInt = 1;
  for (const no of journalNos) {
    const match = no.match(/JE-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val >= nextJEInt) {
        nextJEInt = val + 1;
      }
    }
  }
  const nextJournalNo = `JE-${String(nextJEInt).padStart(6, "0")}`;

  // 4. Group recent entries for grouped presentation
  const groupedJE: Record<string, {
    journal_no: string;
    entry_date: string;
    description: string;
    total: number;
    lines: Array<{
      id: string;
      account_name: string;
      entry_type: "debit" | "credit";
      amount: number;
      description: string;
    }>;
  }> = {};

  for (const row of rows) {
    const key = row.journal_no || `Legacy-${row.id}`;
    if (!groupedJE[key]) {
      groupedJE[key] = {
        journal_no: row.journal_no || "Legacy",
        entry_date: row.entry_date,
        description: row.description || "",
        total: 0,
        lines: []
      };
    }
    groupedJE[key].lines.push({
      id: row.id,
      account_name: row.account_name,
      entry_type: row.entry_type,
      amount: Number(row.amount),
      description: row.description || ""
    });
    if (row.entry_type === "debit") {
      groupedJE[key].total += Number(row.amount);
    }
  }

  const groupedList = Object.values(groupedJE);
  const totalDebit = rows.filter(r => r.entry_type === "debit").reduce((sum, r) => sum + Number(r.amount), 0);
  const totalCredit = rows.filter(r => r.entry_type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <>
      <PageHeader
        title="Double Entry Journal"
        description="Record and view double-entry accounting journal entries (debits and credits)."
      />

      <Card className="mb-5 border-emerald-100 shadow-sm">
        <CardHeader className="bg-emerald-50/20 border-b border-emerald-100 flex flex-row items-center justify-between">
          <CardTitle className="text-emerald-900">
            {isEditing ? `Edit Journal Entry: ${editJournalNo}` : "New Journal Entry"}
          </CardTitle>
          {isEditing && (
            <Link
              href="/accounts/journal"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-800"
            >
              Cancel Edit & Create New
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <JournalEntryForm
            key={editJournalNo || "new"}
            initialRows={editRows}
            nextJournalNo={nextJournalNo}
            editJournalNo={editJournalNo}
            editJournalDate={editJournalDate}
            accounts={accountsList}
          />
        </CardContent>
      </Card>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="bg-emerald-50/20 border-b border-emerald-100">
          <CardTitle className="flex items-center justify-between flex-wrap gap-4 text-emerald-900">
            <span>Recent Journal Transactions</span>
            <span className="text-sm font-normal text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Debits: ₹{formatNumber(totalDebit, 2)} | Credits: ₹{formatNumber(totalCredit, 2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {groupedList.length === 0 ? (
            <div className="p-6"><EmptyState title="No entries found" description="Journal entries will appear here after being saved." /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-emerald-50/45">
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <th className="p-3 text-left w-[140px] font-semibold text-sm text-muted-foreground uppercase tracking-wider">Journal No</th>
                    <TableHead>Account details</TableHead>
                    <TableHead className="text-right w-[150px]">Amount (₹)</TableHead>
                    <TableHead className="w-[140px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedList.map((entry: any) => (
                    <TableRow key={entry.journal_no} className="hover:bg-slate-50/40">
                      <TableCell className="align-top font-medium">{formatDate(entry.entry_date)}</TableCell>
                      <TableCell className="align-top font-bold text-emerald-950 font-mono">{entry.journal_no}</TableCell>
                      <TableCell className="p-3">
                        <div className="space-y-1.5">
                          {entry.lines.map((line: any) => (
                            <div key={line.id} className="flex items-start justify-between text-sm">
                              <div>
                                <span className={line.entry_type === "credit" ? "pl-6 text-slate-500" : "font-semibold text-slate-800"}>
                                  {line.account_name}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 block sm:inline">
                                  ({line.description})
                                </span>
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-500">
                                {line.entry_type === "debit" ? "Dr" : "Cr"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-right font-bold text-emerald-950 font-mono">
                        ₹{formatNumber(entry.total, 2)}
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          {entry.journal_no !== "Legacy" && (
                            <Link
                              href={`/accounts/journal?edit=${entry.journal_no}`}
                              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-8 px-3 border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm"
                            >
                              Edit
                            </Link>
                          )}
                          <form action={softDeleteJournalEntryGroup}>
                            <input type="hidden" name="journal_no" value={entry.journal_no} />
                            <ConfirmSubmitButton
                              size="sm"
                              variant="outline"
                              confirmTitle="Delete journal entry?"
                              confirmDescription={`This will soft-delete the entire transaction (${entry.journal_no}) and all its lines.`}
                            >
                              Delete
                            </ConfirmSubmitButton>
                          </form>
                        </div>
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
