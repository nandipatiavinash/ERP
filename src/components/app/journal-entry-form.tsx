"use client";

import { useState } from "react";
import { saveJournalEntry } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function JournalEntryForm({ row }: { row?: Record<string, any> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [accountName, setAccountName] = useState(row?.account_name ?? "");
  const [entryType, setEntryType] = useState(row?.entry_type ?? "");
  const [amount, setAmount] = useState(row?.amount == null ? "" : String(row.amount));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setErrorText(null);
    try {
      const formData = new FormData(event.currentTarget);
      if (row?.id) formData.set("id", row.id);
      await saveJournalEntry(formData);
      if (!row?.id) {
        setAccountName("");
        setEntryType("");
        setAmount("");
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to save journal entry.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
      {row?.id && <input type="hidden" name="id" value={row.id} />}

      <div className="space-y-2">
        <Label>Entry Date</Label>
        <Input
          name="entry_date"
          type="date"
          required
          defaultValue={row?.entry_date ?? new Date().toISOString().slice(0, 10)}
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label>Account Name</Label>
        <Input
          name="account_name"
          required
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="e.g. Cash, Bank, Sales"
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label>Entry Type</Label>
        <select
          name="entry_type"
          value={entryType}
          onChange={(e) => setEntryType(e.target.value)}
          required
          disabled={isSaving}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="" disabled>Select type</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Amount (₹)</Label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          placeholder="Optional description..."
          defaultValue={row?.description ?? ""}
          rows={1}
          disabled={isSaving}
          className="min-h-10 h-10 resize-none py-2"
        />
      </div>

      <div className="md:col-span-2 lg:col-span-5 flex flex-col gap-2">
        {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        <ConfirmSubmitButton
          confirmTitle={row?.id ? "Update journal entry?" : "Create journal entry?"}
          confirmDescription="Confirm the account, type, and amount before saving."
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : (row?.id ? "Save Changes" : "Log Journal Entry")}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
