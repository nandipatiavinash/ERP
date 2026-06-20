"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";
import { saveJournalEntry } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";



type JournalRow = {
  id?: string;
  key: string;
  accountName: string;
  description: string;
  debit: string;
  credit: string;
  errors: {
    accountName?: string;
    description?: string;
    amount?: string;
  };
};

export function JournalEntryForm({
  initialRows = [],
  nextJournalNo = "JE-000001",
  editJournalNo = "",
  editJournalDate = "",
  accounts = [],
  row // Legacy single row fallback (e.g. prefill from Sales Page)
}: {
  initialRows?: any[];
  nextJournalNo?: string;
  editJournalNo?: string;
  editJournalDate?: string;
  accounts?: { name: string }[];
  row?: { account_name?: string; entry_type?: "debit" | "credit" };
}) {
  const isEditing = !!editJournalNo;
  const [journalNo] = useState(isEditing ? editJournalNo : nextJournalNo);
  const [entryDate, setEntryDate] = useState(
    isEditing ? editJournalDate : new Date().toISOString().slice(0, 10)
  );

  // Initialize rows: loaded edit rows, or prefill from 'row' prop, or two empty rows
  const [rows, setRows] = useState<JournalRow[]>(() => {
    if (initialRows.length > 0) {
      return initialRows.map((r) => ({
        id: r.id,
        key: `row-${r.id}-${Math.random()}`,
        accountName: r.account_name,
        description: r.description ?? "",
        debit: r.entry_type === "debit" ? String(r.amount) : "",
        credit: r.entry_type === "credit" ? String(r.amount) : "",
        errors: {}
      }));
    }

    if (row?.account_name) {
      return [
        {
          key: `row-init-1`,
          accountName: row.entry_type === "credit" ? "Accounts Receivable (Debtors)" : row.account_name,
          description: "Sales entry",
          debit: row.entry_type === "debit" ? "" : "",
          credit: "",
          errors: {}
        },
        {
          key: `row-init-2`,
          accountName: row.entry_type === "credit" ? row.account_name : "Accounts Receivable (Debtors)",
          description: "Sales entry",
          debit: "",
          credit: "",
          errors: {}
        }
      ];
    }

    return [
      { key: "row-1", accountName: "", description: "", debit: "", credit: "", errors: {} },
      { key: "row-2", accountName: "", description: "", debit: "", credit: "", errors: {} }
    ];
  });

  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Auto-focus on the newly added row's account dropdown search or input
  useEffect(() => {
    if (lastAddedKey) {
      const element = document.querySelector(`[data-row-key="${lastAddedKey}"] input`);
      if (element instanceof HTMLElement) {
        element.focus();
      }
      setLastAddedKey(null);
    }
  }, [lastAddedKey]);

  // Real-time totals
  const totalDebit = useMemo(() => {
    return rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
  }, [rows]);

  const totalCredit = useMemo(() => {
    return rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
  }, [rows]);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  // Validation function
  const validateRow = (rowObj: JournalRow): JournalRow["errors"] => {
    const errs: JournalRow["errors"] = {};
    if (!rowObj.accountName) {
      errs.accountName = "Select an account";
    }
    if (!rowObj.description.trim()) {
      errs.description = "Enter description";
    }
    const debVal = parseFloat(rowObj.debit);
    const credVal = parseFloat(rowObj.credit);

    if (!rowObj.debit && !rowObj.credit) {
      errs.amount = "Enter Debit or Credit";
    } else if (rowObj.debit && rowObj.credit) {
      errs.amount = "Cannot enter both";
    } else {
      const val = rowObj.debit ? debVal : credVal;
      if (isNaN(val)) {
        errs.amount = "Invalid number";
      } else if (val <= 0) {
        errs.amount = "Must be positive";
      } else {
        // Decimal place check
        const parts = (rowObj.debit || rowObj.credit).split(".");
        if (parts[1] && parts[1].length > 2) {
          errs.amount = "Max 2 decimals";
        }
      }
    }
    return errs;
  };

  const handleRowChange = (index: number, fields: Partial<Omit<JournalRow, "key" | "errors">>) => {
    setRows((prev) => {
      const next = [...prev];
      const updatedRow = { ...next[index], ...fields };
      updatedRow.errors = validateRow(updatedRow);
      next[index] = updatedRow;
      return next;
    });
  };

  const handleAddRow = (index: number) => {
    const newKey = `row-${Date.now()}-${Math.random()}`;
    const newRow: JournalRow = {
      key: newKey,
      accountName: "",
      description: "",
      debit: "",
      credit: "",
      errors: { accountName: "Select an account", description: "Enter description", amount: "Enter Debit or Credit" }
    };
    setRows((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, newRow);
      return next;
    });
    setLastAddedKey(newKey);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form validity check
  const hasErrors = rows.some((r) => Object.keys(r.errors).length > 0);
  const allFieldsFilled = rows.every(
    (r) => r.accountName && r.description && (r.debit || r.credit)
  );
  const isValid = rows.length >= 2 && allFieldsFilled && !hasErrors && isBalanced;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || !isValid) return;
    setIsSaving(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const formData = new FormData();
      formData.set("journal_no", journalNo);
      formData.set("entry_date", entryDate);
      if (isEditing) {
        formData.set("original_journal_no", editJournalNo);
      }

      const rowsData = rows.map((r) => ({
        account_name: r.accountName,
        description: r.description,
        debit: parseFloat(r.debit) || 0,
        credit: parseFloat(r.credit) || 0
      }));
      formData.set("rows_json", JSON.stringify(rowsData));

      await saveJournalEntry(formData);

      setSuccessText(
        isEditing ? "Journal Entry updated successfully!" : "Journal Entry logged successfully!"
      );

      if (!isEditing) {
        // Reset form
        setRows([
          { key: "row-1", accountName: "", description: "", debit: "", credit: "", errors: {} },
          { key: "row-2", accountName: "", description: "", debit: "", credit: "", errors: {} }
        ]);
        setEntryDate(new Date().toISOString().slice(0, 10));
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to save journal entry.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Section */}
      <div className="grid gap-4 sm:grid-cols-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div className="space-y-2">
          <Label className="text-emerald-900 font-medium">Journal Entry Number</Label>
          <div className="h-10 px-3 flex items-center bg-white border border-emerald-200 rounded-md font-bold text-emerald-950 font-mono shadow-sm">
            {journalNo}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-emerald-900 font-medium">Journal Date</Label>
          <Input
            type="date"
            required
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            disabled={isSaving}
            className="border-emerald-200 bg-white"
          />
        </div>
      </div>

      {/* Main Rows Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto max-h-[450px]">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-emerald-50 border-b border-emerald-100 text-xs font-semibold text-emerald-800 uppercase tracking-wider z-20">
              <tr>
                <th className="p-3 w-[260px]">Account Name</th>
                <th className="p-3 w-[320px]">Description</th>
                <th className="p-3 w-[150px] text-right">Debit (₹)</th>
                <th className="p-3 w-[150px] text-right">Credit (₹)</th>
                <th className="p-3 w-[100px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((rowObj, index) => (
                <tr
                  key={rowObj.key}
                  data-row-key={rowObj.key}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Account Name Dropdown */}
                  <td className="p-3 align-top">
                    <SearchableAccountSelect
                      value={rowObj.accountName}
                      onChange={(val) => handleRowChange(index, { accountName: val })}
                      disabled={isSaving}
                      accounts={accounts}
                    />
                    {rowObj.errors.accountName && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {rowObj.errors.accountName}
                      </p>
                    )}
                  </td>

                  {/* Description Input */}
                  <td className="p-3 align-top">
                    <Input
                      placeholder="Line item description..."
                      value={rowObj.description}
                      onChange={(e) => handleRowChange(index, { description: e.target.value })}
                      disabled={isSaving}
                      className="h-10 text-sm"
                    />
                    {rowObj.errors.description && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {rowObj.errors.description}
                      </p>
                    )}
                  </td>

                  {/* Debit Amount */}
                  <td className="p-3 align-top">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={rowObj.debit}
                      onChange={(e) =>
                        handleRowChange(index, {
                          debit: e.target.value,
                          credit: e.target.value ? "" : rowObj.credit
                        })
                      }
                      disabled={isSaving || !!rowObj.credit}
                      className="text-right font-mono h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {rowObj.errors.amount && !rowObj.credit && (
                      <p className="text-xs text-destructive mt-1 font-medium text-right">
                        {rowObj.errors.amount}
                      </p>
                    )}
                  </td>

                  {/* Credit Amount */}
                  <td className="p-3 align-top">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={rowObj.credit}
                      onChange={(e) =>
                        handleRowChange(index, {
                          credit: e.target.value,
                          debit: e.target.value ? "" : rowObj.debit
                        })
                      }
                      disabled={isSaving || !!rowObj.debit}
                      className="text-right font-mono h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {rowObj.errors.amount && !rowObj.debit && (
                      <p className="text-xs text-destructive mt-1 font-medium text-right">
                        {rowObj.errors.amount}
                      </p>
                    )}
                  </td>

                  {/* Row Actions */}
                  <td className="p-3 align-top text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddRow(index)}
                        disabled={isSaving}
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                        title="Add row below"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRow(index)}
                        disabled={isSaving || rows.length <= 1}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-md disabled:opacity-30"
                        title="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Totals and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl bg-slate-50/80">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-700 flex flex-wrap gap-x-4">
            <span>Total Debit: <span className="font-mono text-emerald-950 font-bold">₹{totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
            <span>Total Credit: <span className="font-mono text-emerald-950 font-bold">₹{totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
          </div>
          {totalDebit !== totalCredit && totalDebit > 0 && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
              Difference: ₹{Math.abs(totalDebit - totalCredit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Balanced Status Indicator */}
        <div className="shrink-0">
          {isBalanced ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
              <CheckCircle2 className="h-4 w-4" /> Balanced Journal Entry
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold shadow-sm">
              <XCircle className="h-4 w-4" /> Journal Entry Not Balanced
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorText && (
        <div className="p-3.5 text-sm bg-destructive/5 border border-destructive/20 text-destructive rounded-lg font-medium">
          {errorText}
        </div>
      )}
      {successText && (
        <div className="p-3.5 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5" /> {successText}
        </div>
      )}

      {/* Validation Message & Submission */}
      <div className="flex flex-col gap-3">
        {totalDebit !== totalCredit && totalDebit > 0 && (
          <p className="text-sm text-destructive font-semibold">
            Total Debit must be equal to Total Credit before submitting.
          </p>
        )}
        <ConfirmSubmitButton
          confirmTitle={isEditing ? "Update journal entry?" : "Log journal entry?"}
          confirmDescription="Ensure all account lines, descriptions, and debits/credits are correct before submitting."
          disabled={!isValid || isSaving}
          className="w-full h-11 text-base shadow-sm"
        >
          {isSaving
            ? "Saving..."
            : isEditing
            ? "Update Journal Entry"
            : "Submit Journal Entry"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

// Account Dropdown Component
function SearchableAccountSelect({
  value,
  onChange,
  disabled,
  accounts = []
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  accounts?: { name: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={`h-10 w-full px-3 flex items-center justify-between rounded-md border bg-background text-sm cursor-pointer shadow-sm focus-within:ring-1 focus-within:ring-primary ${
          disabled ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-emerald-300"
        } ${value ? "text-emerald-950 font-medium border-emerald-200" : "text-muted-foreground"}`}
      >
        <span className="truncate">{value || "Select account..."}</span>
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 min-w-[340px] w-max max-w-[90vw] max-h-[400px] overflow-y-auto border border-emerald-100 bg-white rounded-lg shadow-xl z-50">
          <div className="py-1">
            {accounts.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No firms / clients found
              </div>
            ) : (
              accounts.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={`px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer transition-colors ${
                    value === item.name ? "bg-emerald-50 text-emerald-900 font-semibold" : ""
                  }`}
                >
                  {item.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

