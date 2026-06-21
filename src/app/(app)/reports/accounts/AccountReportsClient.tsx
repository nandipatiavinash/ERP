"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { DateRangeFilter } from "@/components/app/date-range-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";

interface Account {
  id: string;
  customer_name: string;
  alias: string | null;
  is_internal: string;
  opening_debit: string | number;
  opening_credit: string | number;
}

interface JournalEntry {
  id: string;
  journal_no: string | null;
  entry_date: string;
  account_name: string;
  entry_type: "debit" | "credit";
  amount: string | number;
  description: string | null;
  account_id?: string | null;
  customers?: {
    customer_name: string | null;
    alias: string | null;
  } | null;
}

interface AccountReportsClientProps {
  from: string;
  to: string;
  accountId: string;
  accounts: Account[];
  selectedAccount: Account | null;
  entries: JournalEntry[];
}

export function AccountReportsClient({
  from,
  to,
  accountId,
  accounts,
  selectedAccount,
  entries,
}: AccountReportsClientProps) {
  const router = useRouter();

  // Group accounts by type (is_internal)
  const groupedAccounts = useMemo(() => {
    const groups: Record<string, Account[]> = {
      "client a/c": [],
      "profit and loss a/c": [],
      "capital a/c": [],
      "loan a/c": [],
      "balance sheet a/c": [],
    };
    accounts.forEach((acc) => {
      const type = acc.is_internal || "client a/c";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(acc);
    });
    return groups;
  }, [accounts]);

  // Calculations for Case A: Specific Account Selected
  const ledgerData = useMemo(() => {
    if (!selectedAccount) return null;

    const configDebit = Number(selectedAccount.opening_debit ?? 0);
    const configCredit = Number(selectedAccount.opening_credit ?? 0);

    let historicalDebit = 0;
    let historicalCredit = 0;
    const inRangeEntries: JournalEntry[] = [];

    entries.forEach((entry) => {
      const amt = Number(entry.amount);
      if (entry.entry_date < from) {
        if (entry.entry_type === "debit") {
          historicalDebit += amt;
        } else {
          historicalCredit += amt;
        }
      } else if (entry.entry_date >= from && entry.entry_date <= to) {
        inRangeEntries.push(entry);
      }
    });

    // Net historical balance at from date
    const netOpening = (configDebit + historicalDebit) - (configCredit + historicalCredit);
    const openingDr = netOpening > 0 ? netOpening : 0;
    const openingCr = netOpening < 0 ? Math.abs(netOpening) : 0;

    // Calculate totals in range
    let rangeDrSum = 0;
    let rangeCrSum = 0;
    inRangeEntries.forEach((entry) => {
      const amt = Number(entry.amount);
      if (entry.entry_type === "debit") {
        rangeDrSum += amt;
      } else {
        rangeCrSum += amt;
      }
    });

    const totalDr = openingDr + rangeDrSum;
    const totalCr = openingCr + rangeCrSum;

    const balance = totalDr - totalCr;
    const balanceDr = balance > 0 ? balance : 0;
    const balanceCr = balance < 0 ? Math.abs(balance) : 0;

    return {
      openingDr: Math.floor(openingDr),
      openingCr: Math.floor(openingCr),
      inRangeEntries,
      totalDr: Math.floor(totalDr),
      totalCr: Math.floor(totalCr),
      balanceDr: Math.floor(balanceDr),
      balanceCr: Math.floor(balanceCr),
    };
  }, [selectedAccount, entries, from, to]);

  // Calculations for Case B: No Account Selected (Daybook)
  const daybookTotals = useMemo(() => {
    if (selectedAccount) return null;
    let totalDr = 0;
    let totalCr = 0;
    entries.forEach((entry) => {
      const amt = Number(entry.amount);
      if (entry.entry_type === "debit") {
        totalDr += amt;
      } else {
        totalCr += amt;
      }
    });
    return {
      totalDr: Math.floor(totalDr),
      totalCr: Math.floor(totalCr),
    };
  }, [selectedAccount, entries]);

  const handleAccountChange = (id: string) => {
    router.push(`/reports/accounts?from=${from}&to=${to}&accountId=${id}` as any);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Reports"
        description="View account ledger statements, debit/credit details, opening values, and transaction daybooks."
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <Label htmlFor="account-select" className="font-semibold text-sm text-slate-700">
            Select Account / Client:
          </Label>
          <select
            id="account-select"
            value={accountId}
            onChange={(e) => handleAccountChange(e.target.value)}
            className="w-full md:w-80 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="">-- All Accounts (Daybook) --</option>
            <optgroup label="Client Accounts">
              {groupedAccounts["client a/c"].map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customer_name} {acc.alias ? `(${acc.alias})` : ""}
                </option>
              ))}
            </optgroup>
            <optgroup label="Profit & Loss Accounts">
              {groupedAccounts["profit and loss a/c"].map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customer_name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Capital Accounts">
              {groupedAccounts["capital a/c"].map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customer_name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Loan Accounts">
              {groupedAccounts["loan a/c"].map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customer_name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Balance Sheet Accounts">
              {groupedAccounts["balance sheet a/c"].map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customer_name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <DateRangeFilter from={from} to={to} baseUrl="/reports/accounts" />
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {selectedAccount && ledgerData ? (
            // Case A: Ledger View
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-700 w-32">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700">Description</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right w-44">Dr. (Debit)</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right w-44">Cr. (Credit)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Opening Value Row */}
                <TableRow className="border-b border-slate-100 bg-slate-50/30">
                  <TableCell className="py-3 text-slate-550 font-medium text-sm">{from}</TableCell>
                  <TableCell className="py-3 font-bold text-slate-800 text-sm">OPENING VALUE</TableCell>
                  <TableCell className="py-3 text-right text-slate-900 font-medium text-sm">
                    {ledgerData.openingDr > 0 ? formatNumber(ledgerData.openingDr, 0) : "-"}
                  </TableCell>
                  <TableCell className="py-3 text-right text-slate-900 font-medium text-sm">
                    {ledgerData.openingCr > 0 ? formatNumber(ledgerData.openingCr, 0) : "-"}
                  </TableCell>
                </TableRow>

                {/* Range Transactions */}
                {ledgerData.inRangeEntries.length === 0 ? (
                  <TableRow className="border-b border-slate-100 last:border-0">
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                      No transactions recorded in this date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  ledgerData.inRangeEntries.map((entry) => {
                    const amt = Math.floor(Number(entry.amount));
                    return (
                      <TableRow key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/20">
                        <TableCell className="py-3 text-slate-600 text-sm">{entry.entry_date}</TableCell>
                        <TableCell className="py-3 text-slate-800 text-sm">
                          {entry.description || "Journal Entry"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-slate-900 text-sm">
                          {entry.entry_type === "debit" ? formatNumber(amt, 0) : "-"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-slate-900 text-sm">
                          {entry.entry_type === "credit" ? formatNumber(amt, 0) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {/* Total Row */}
                <TableRow className="border-t border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableCell className="py-3"></TableCell>
                  <TableCell className="py-3 font-bold text-slate-900 text-sm text-right">TOTAL</TableCell>
                  <TableCell className="py-3 text-right text-slate-950 font-bold text-sm border-t border-slate-300">
                    {ledgerData.totalDr > 0 ? formatNumber(ledgerData.totalDr, 0) : "-"}
                  </TableCell>
                  <TableCell className="py-3 text-right text-slate-950 font-bold text-sm border-t border-slate-300">
                    {ledgerData.totalCr > 0 ? formatNumber(ledgerData.totalCr, 0) : "-"}
                  </TableCell>
                </TableRow>

                {/* Balance Row */}
                <TableRow className="bg-slate-100/40 hover:bg-slate-100/40">
                  <TableCell className="py-3"></TableCell>
                  <TableCell className="py-3 font-bold text-slate-900 text-sm text-right">BALANCE</TableCell>
                  <TableCell className="py-3 text-right text-slate-950 font-black text-sm">
                    {ledgerData.balanceDr > 0 ? `${formatNumber(ledgerData.balanceDr, 0)} Dr.` : "-"}
                  </TableCell>
                  <TableCell className="py-3 text-right text-slate-950 font-black text-sm">
                    {ledgerData.balanceCr > 0 ? `${formatNumber(ledgerData.balanceCr, 0)} Cr.` : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            // Case B: General Daybook View
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-700 w-32">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700">Client / Account ID</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right w-44">Dr. (Debit)</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right w-44">Cr. (Credit)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                      No entries recorded in selected date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => {
                    const amt = Math.floor(Number(entry.amount));
                    const clientName = entry.customers?.customer_name ?? entry.account_name;
                    const alias = entry.customers?.alias;
                    const displayName = alias ? `${clientName} (${alias})` : clientName;

                    return (
                      <TableRow key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/20">
                        <TableCell className="py-3 text-slate-600 text-sm">{entry.entry_date}</TableCell>
                        <TableCell className="py-3 text-slate-800 font-medium text-sm">
                          {displayName}
                        </TableCell>
                        <TableCell className="py-3 text-right text-slate-900 text-sm">
                          {entry.entry_type === "debit" ? formatNumber(amt, 0) : "-"}
                        </TableCell>
                        <TableCell className="py-3 text-right text-slate-900 text-sm">
                          {entry.entry_type === "credit" ? formatNumber(amt, 0) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {/* Daybook Totals */}
                {entries.length > 0 && daybookTotals && (
                  <TableRow className="border-t border-slate-200 bg-slate-50 hover:bg-slate-50">
                    <TableCell className="py-3"></TableCell>
                    <TableCell className="py-3 font-bold text-slate-900 text-sm text-right">TOTAL TRANSACTIONS</TableCell>
                    <TableCell className="py-3 text-right text-slate-950 font-bold text-sm">
                      {formatNumber(daybookTotals.totalDr, 0)}
                    </TableCell>
                    <TableCell className="py-3 text-right text-slate-950 font-bold text-sm">
                      {formatNumber(daybookTotals.totalCr, 0)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
