"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";
import { saveProfitLoss } from "@/app/(app)/_actions";
import { Printer } from "lucide-react";


interface PLAccount {
  id: string;
  customer_name: string;
  alias: string | null;
  opening_debit: number;
  opening_credit: number;
  is_internal: string;
}

interface JournalEntry {
  account_id: string | null;
  account_name: string;
  entry_type: "debit" | "credit";
  amount: string | number;
}

interface ProfitLossReportClientProps {
  date: string;
  accounts: PLAccount[];
  entries: JournalEntry[];
  closingStockValue: number;
  submittedPL: any;
}

export function ProfitLossReportClient({
  date,
  accounts,
  entries,
  closingStockValue,
  submittedPL,
}: ProfitLossReportClientProps) {
  const router = useRouter();

  // Manual Expenses till date state
  const [manualExpensesInput, setManualExpensesInput] = useState<string>(() => {
    return submittedPL?.manualExpenses !== undefined ? String(submittedPL.manualExpenses) : "0";
  });

  const [submitted, setSubmitted] = useState(() => !!submittedPL);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setManualExpensesInput(submittedPL?.manualExpenses !== undefined ? String(submittedPL.manualExpenses) : "0");
    setSubmitted(!!submittedPL);
  }, [submittedPL]);

  const manualExpenses = Math.max(0, Number(manualExpensesInput) || 0);

  // Calculate net balances for each P&L account
  const accountBalances = useMemo(() => {
    const balances: Record<string, { name: string; alias?: string | null; balance: number }> = {};

    accounts.forEach((acc) => {
      balances[acc.id] = {
        name: acc.customer_name,
        alias: acc.alias,
        balance: Number(acc.opening_debit ?? 0) - Number(acc.opening_credit ?? 0),
      };
    });

    entries.forEach((entry) => {
      const amt = Number(entry.amount);
      let accId = entry.account_id;

      if (!accId && entry.account_name) {
        const match = accounts.find(
          (acc) =>
            acc.customer_name.toLowerCase().trim() === entry.account_name.toLowerCase().trim() ||
            (acc.alias && acc.alias.toLowerCase().trim() === entry.account_name.toLowerCase().trim())
        );
        if (match) accId = match.id;
      }

      if (accId && balances[accId]) {
        if (entry.entry_type === "debit") {
          balances[accId].balance += amt;
        } else {
          balances[accId].balance -= amt;
        }
      }
    });

    return Object.entries(balances)
      .map(([id, data]) => {
        const net = data.balance;
        return {
          id,
          name: data.name,
          alias: data.alias,
          amount: Math.abs(net),
          type: net >= 0 ? ("debit" as const) : ("credit" as const),
        };
      })
      .filter((acc) => acc.amount > 0);
  }, [accounts, entries]);

  // Group and sort
  const debitAccounts = useMemo(() => {
    return accountBalances.filter((a) => a.type === "debit").sort((a, b) => b.amount - a.amount);
  }, [accountBalances]);

  const creditAccounts = useMemo(() => {
    return accountBalances.filter((a) => a.type === "credit").sort((a, b) => b.amount - a.amount);
  }, [accountBalances]);

  // Summarize sides
  const debitAccountsSum = debitAccounts.reduce((s, a) => s + a.amount, 0);
  const creditAccountsSum = creditAccounts.reduce((s, a) => s + a.amount, 0);

  const baseCreditTotal = closingStockValue + creditAccountsSum;
  const baseDebitTotal = debitAccountsSum + manualExpenses;

  // Balancing logic
  let netProfit = 0;
  let netLoss = 0;
  if (baseCreditTotal > baseDebitTotal) {
    netProfit = baseCreditTotal - baseDebitTotal;
  } else if (baseDebitTotal > baseCreditTotal) {
    netLoss = baseDebitTotal - baseCreditTotal;
  }

  const finalCreditTotal = baseCreditTotal + netLoss;
  const finalDebitTotal = baseDebitTotal + netProfit;

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await saveProfitLoss(date, manualExpenses, netProfit, netLoss);
      setSubmitted(true);
      router.refresh();
    } catch (err: any) {
      alert("Failed to submit Profit & Loss: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Print Only Simple Header */}
      <div className="hidden print:block text-center font-black text-xl mb-8 uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-3">
        PROFIT &amp; LOSS UPTO THE DATE {formattedDate}
      </div>

      {/* Pre-population/Submission Banner */}
      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between no-print">
          <span className="font-semibold">✓ Profit & Loss statement for {formattedDate} has been submitted.</span>
          <span className="text-xs text-emerald-600">
            Net: {netProfit > 0 ? `₹${formatNumber(netProfit, 0)} Profit` : `₹${formatNumber(netLoss, 0)} Loss`}
          </span>
        </div>
      )}

      {/* Header and Print Actions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">
              PROFIT &amp; LOSS UPTO THE DATE {formattedDate}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Financial Statement</p>
          </div>
          <Button onClick={() => window.print()} variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-200 shadow-none">
            <Printer className="h-4 w-4" /> Print Statement
          </Button>
        </div>
      </div>

      {/* Stacked Layout with Gap */}
      <div className="space-y-8 print:space-y-8">
        {/* CREDIT / INCOME CARD */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-100/50 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between uppercase">
            <span>Credit Particulars (Incomes)</span>
            <span>Amount (₹)</span>
          </div>

          <div className="divide-y divide-slate-100 min-h-[150px]">
            {creditAccounts.map((acc) => (
              <div key={acc.id} className="px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 capitalize">
                  {acc.name} {acc.alias ? `(${acc.alias})` : ""}
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{formatNumber(acc.amount, 2)}
                </span>
              </div>
            ))}

            {/* Closing Stock Value item */}
            <div className="px-4 py-3.5 flex justify-between items-center text-sm bg-emerald-50/10 border-b border-slate-100">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-emerald-950">CLOSING STOCK VALUE</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">Submitted Value</span>
              </div>
              <span className="font-bold text-emerald-900 font-mono text-sm">
                ₹{formatNumber(closingStockValue, 2)}
              </span>
            </div>

            {/* Net Loss Balancing Line */}
            {netLoss > 0 && (
              <div className="px-4 py-3 flex justify-between items-center text-sm bg-rose-50/20 font-bold border-t border-rose-100">
                <span className="text-rose-800 uppercase tracking-wide">
                  Net Loss transferred to Balance Sheet
                </span>
                <span className="text-rose-800 font-mono text-base">
                  ₹{formatNumber(netLoss, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Credit Grand Total */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center font-black text-sm text-slate-900">
            <span className="uppercase tracking-wider">Total Cr</span>
            <span className="font-mono text-base">₹{formatNumber(finalCreditTotal, 2)}</span>
          </div>
        </div>

        {/* DEBIT / EXPENSES CARD */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-100/50 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between uppercase">
            <span>Debit Particulars (Expenses)</span>
            <span>Amount (₹)</span>
          </div>

          <div className="divide-y divide-slate-100 min-h-[150px]">
            {debitAccounts.map((acc) => (
              <div key={acc.id} className="px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 capitalize">
                  {acc.name} {acc.alias ? `(${acc.alias})` : ""}
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{formatNumber(acc.amount, 2)}
                </span>
              </div>
            ))}

            {/* Manual Expenses entry cell */}
            <div className="px-4 py-3.5 flex justify-between items-center text-sm bg-slate-50/50">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-rose-950">EXPENSES TILL DATE</span>
                <span className="text-[10px] text-rose-600 font-semibold uppercase">Manual Entry</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-muted-foreground text-xs no-print">₹</span>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={manualExpensesInput === "0" ? "" : manualExpensesInput}
                  placeholder="0.00"
                  onChange={(e) => setManualExpensesInput(e.target.value)}
                  className="w-36 h-8 pl-6 pr-2 text-right text-sm font-semibold border-slate-300 focus-visible:ring-emerald-500 shadow-none ml-auto no-print"
                />
                <span className="hidden print:inline font-bold font-mono text-slate-900">
                  ₹{formatNumber(manualExpenses, 2)}
                </span>
              </div>
            </div>

            {/* Net Profit Balancing Line */}
            {netProfit > 0 && (
              <div className="px-4 py-3 flex justify-between items-center text-sm bg-emerald-50/20 font-bold border-t border-emerald-100">
                <span className="text-emerald-800 uppercase tracking-wide">
                  Net Profit transferred to Balance Sheet
                </span>
                <span className="text-emerald-800 font-mono text-base">
                  ₹{formatNumber(netProfit, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Debit Grand Total */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center font-black text-sm text-slate-900">
            <span className="uppercase tracking-wider">Total Dr</span>
            <span className="font-mono text-base">₹{formatNumber(finalDebitTotal, 2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Block */}
      <div className="flex justify-end px-5 py-4 border border-slate-200 rounded-lg bg-white no-print shadow-sm">
        {submitted ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-emerald-600">✓ Submitted successfully</span>
            <Button onClick={handleSubmit} disabled={isSaving} variant="outline" className="px-8 border-slate-200">
              {isSaving ? "Updating..." : "Update Submission"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
