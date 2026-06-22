"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Printer } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BSAccount {
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

interface BalanceSheetClientProps {
  date: string;
  accounts: BSAccount[];
  entries: JournalEntry[];
  closingStockValue: number;
  netProfit: number;
  netLoss: number;
}

export function BalanceSheetClient({
  date,
  accounts,
  entries,
  closingStockValue,
  netProfit,
  netLoss,
}: BalanceSheetClientProps) {
  // Collapse/Expand state for each group of details
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculations = useMemo(() => {
    // 1. Calculate balance for each account up to date D
    const accountBalances: Record<
      string,
      { name: string; alias?: string | null; balance: number; category: string }
    > = {};

    accounts.forEach((acc) => {
      accountBalances[acc.id] = {
        name: acc.customer_name,
        alias: acc.alias,
        balance: Number(acc.opening_debit ?? 0) - Number(acc.opening_credit ?? 0),
        category: acc.is_internal || "other",
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

      if (accId && accountBalances[accId]) {
        if (entry.entry_type === "debit") {
          accountBalances[accId].balance += amt;
        } else {
          accountBalances[accId].balance -= amt;
        }
      }
    });

    // 2. Classify into Liabilities (Credit) and Assets (Debit) categories
    const groups = {
      capital: { dr: [] as any[], cr: [] as any[], drSum: 0, crSum: 0 },
      loan: { dr: [] as any[], cr: [] as any[], drSum: 0, crSum: 0 },
      client: { dr: [] as any[], cr: [] as any[], drSum: 0, crSum: 0 },
      otherBs: { dr: [] as any[], cr: [] as any[], drSum: 0, crSum: 0 },
    };

    Object.entries(accountBalances).forEach(([id, data]) => {
      const net = data.balance;
      const cat = data.category.toLowerCase();

      // Skip profit and loss accounts as they are closed into Net Profit/Loss
      if (cat === "profit and loss a/c" || cat === "p&l") {
        return;
      }

      let groupKey: "capital" | "loan" | "client" | "otherBs" = "otherBs";
      if (cat === "capital a/c" || cat === "capital") {
        groupKey = "capital";
      } else if (cat === "loan a/c" || cat === "loan") {
        groupKey = "loan";
      } else if (cat === "client a/c" || cat === "client") {
        groupKey = "client";
      }

      const accInfo = {
        id,
        name: data.name,
        alias: data.alias,
        amount: Math.abs(net),
      };

      if (net > 0) {
        groups[groupKey].dr.push(accInfo);
        groups[groupKey].drSum += net;
      } else if (net < 0) {
        groups[groupKey].cr.push(accInfo);
        groups[groupKey].crSum += Math.abs(net);
      }
    });

    return groups;
  }, [accounts, entries]);

  // Sort detail lists
  const sortedCapitalCr = useMemo(() => [...calculations.capital.cr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedCapitalDr = useMemo(() => [...calculations.capital.dr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedLoanCr = useMemo(() => [...calculations.loan.cr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedLoanDr = useMemo(() => [...calculations.loan.dr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedClientCr = useMemo(() => [...calculations.client.cr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedClientDr = useMemo(() => [...calculations.client.dr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedOtherCr = useMemo(() => [...calculations.otherBs.cr].sort((a, b) => b.amount - a.amount), [calculations]);
  const sortedOtherDr = useMemo(() => [...calculations.otherBs.dr].sort((a, b) => b.amount - a.amount), [calculations]);

  // Sum sides
  const totalLiabilities =
    calculations.capital.crSum +
    netProfit +
    calculations.loan.crSum +
    calculations.client.crSum +
    calculations.otherBs.crSum;

  const totalAssets =
    closingStockValue +
    netLoss +
    calculations.loan.drSum +
    calculations.client.drSum +
    calculations.otherBs.drSum;

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Print Only Simple Header */}
      <div className="hidden print:block text-center font-black text-xl mb-6 uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-3">
        BALANCE SHEET AS ON {formattedDate}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div>
            <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider">
              Balance Sheet Statement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">As on {formattedDate}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Balanced
            </span>
            <Button onClick={() => window.print()} variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-200 shadow-none">
              <Printer className="h-4 w-4" /> Print Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 divide-y md:divide-y-0 md:divide-x print:divide-y-0 print:divide-x divide-slate-200">
          {/* LIABILITIES SIDE */}
          <div className="flex flex-col h-full">
            <div className="bg-slate-100/50 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between uppercase">
              <span>Liabilities &amp; Capital</span>
              <span>Amount (₹)</span>
            </div>

            <div className="flex-1 divide-y divide-slate-100 min-h-[350px]">
              {/* 1. CAPITAL ACCOUNTS */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("capitalCr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["capitalCr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      1. Capital Accounts
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.capital.crSum, 2)}
                  </span>
                </button>

                {expandedGroups["capitalCr"] && sortedCapitalCr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedCapitalCr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. PROFIT / LOSS Cr. BALANCE */}
              <div className="px-4 py-3.5 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700 uppercase tracking-wide pl-6">
                  2. Profit &amp; Loss A/c (Net Profit)
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {netProfit > 0 ? `₹${formatNumber(netProfit, 2)}` : "—"}
                </span>
              </div>

              {/* 3. LOAN ACCOUNTS (CREDIT) */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("loanCr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["loanCr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      3. Loan Accounts (Credit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.loan.crSum, 2)}
                  </span>
                </button>

                {expandedGroups["loanCr"] && sortedLoanCr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedLoanCr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. CLIENTS WITH CREDIT BALANCE */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("clientCr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["clientCr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      4. Client Accounts (Credit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.client.crSum, 2)}
                  </span>
                </button>

                {expandedGroups["clientCr"] && sortedClientCr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedClientCr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. OTHER BALANCE SHEET CREDIT */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("otherCr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["otherCr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      5. Other BS Accounts (Credit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.otherBs.crSum, 2)}
                  </span>
                </button>

                {expandedGroups["otherCr"] && sortedOtherCr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedOtherCr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Liabilities Grand Total */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center font-black text-sm text-slate-900">
              <span className="uppercase tracking-wider">Total Liabilities</span>
              <span className="font-mono text-base">₹{formatNumber(totalLiabilities, 2)}</span>
            </div>
          </div>

          {/* ASSETS SIDE */}
          <div className="flex flex-col h-full">
            <div className="bg-slate-100/50 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between uppercase">
              <span>Assets</span>
              <span>Amount (₹)</span>
            </div>

            <div className="flex-1 divide-y divide-slate-100 min-h-[350px]">
              {/* 1. CLOSING STOCK VALUE */}
              <div className="px-4 py-3.5 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700 uppercase tracking-wide pl-6">
                  1. Closing Stock Value
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{formatNumber(closingStockValue, 2)}
                </span>
              </div>

              {/* 2. PROFIT / LOSS Dr. BALANCE */}
              <div className="px-4 py-3.5 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700 uppercase tracking-wide pl-6">
                  2. Profit &amp; Loss A/c (Net Loss)
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {netLoss > 0 ? `₹${formatNumber(netLoss, 2)}` : "—"}
                </span>
              </div>

              {/* 3. LOAN ACCOUNTS (DEBIT) */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("loanDr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["loanDr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      3. Loan Accounts (Debit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.loan.drSum, 2)}
                  </span>
                </button>

                {expandedGroups["loanDr"] && sortedLoanDr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedLoanDr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. CLIENTS WITH DEBIT BALANCE */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("clientDr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["clientDr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      4. Client Accounts (Debit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.client.drSum, 2)}
                  </span>
                </button>

                {expandedGroups["clientDr"] && sortedClientDr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedClientDr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. OTHER BALANCE SHEET DEBIT */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleGroup("otherDr")}
                  className="w-full px-4 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups["otherDr"] ? (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      5. Other BS Accounts (Debit Balance)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{formatNumber(calculations.otherBs.drSum, 2)}
                  </span>
                </button>

                {expandedGroups["otherDr"] && sortedOtherDr.length > 0 && (
                  <div className="bg-slate-50/40 px-8 py-2 divide-y divide-slate-100/80 text-xs">
                    {sortedOtherDr.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between text-slate-600">
                        <span className="capitalize">{item.name} {item.alias ? `(${item.alias})` : ""}</span>
                        <span className="font-semibold font-mono">₹{formatNumber(item.amount, 2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assets Grand Total */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center font-black text-sm text-slate-900">
              <span className="uppercase tracking-wider">Total Assets</span>
              <span className="font-mono text-base">₹{formatNumber(totalAssets, 2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
