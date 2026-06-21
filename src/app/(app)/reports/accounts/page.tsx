import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { AccountReportsClient } from "./AccountReportsClient";

type Params = { from?: string; to?: string; accountId?: string };

export default async function AccountReportsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("reports.view");
  const params = await searchParams;
  const today = todayInIndia();
  const from = params.from || (today.slice(0, 8) + "01"); // Default to start of month
  const to = params.to || today;
  const accountId = params.accountId || "";

  const supabase = await createClient();

  // Fetch active customers for the dropdown selection
  const { data: customersData } = await supabase
    .from("customers")
    .select("id, customer_name, alias, is_internal, opening_debit, opening_credit")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("customer_name");

  const customers = (customersData ?? []) as any[];

  let journalEntries: any[] = [];
  let selectedAccount: any = null;

  if (accountId) {
    selectedAccount = customers?.find((c) => c.id === accountId) || null;
    
    // Fetch all journal entries for this account up to the 'to' date
    // (This includes historical ones before 'from' to compute the opening balance)
    const { data: entries } = await supabase
      .from("accounts_journal")
      .select("*")
      .eq("account_id", accountId)
      .lte("entry_date", to)
      .is("deleted_at", null)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true });

    journalEntries = entries || [];
  } else {
    // If nothing selected, fetch all journal entries in the range
    const { data: entries } = await supabase
      .from("accounts_journal")
      .select("*, customers(customer_name, alias)")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true });

    journalEntries = entries || [];
  }

  return (
    <AccountReportsClient
      from={from}
      to={to}
      accountId={accountId}
      accounts={(customers ?? []) as any[]}
      selectedAccount={selectedAccount}
      entries={journalEntries}
    />
  );
}
