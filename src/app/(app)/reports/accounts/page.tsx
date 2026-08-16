import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { AccountReportsClient } from "./AccountReportsClient";

type Params = { from?: string; to?: string; accountId?: string };

export default async function AccountReportsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("reports.accounts");
  const params = await searchParams;
  const today = todayInIndia();
  const from = params.from || (today.slice(0, 8) + "01"); // Default to start of month
  const to = params.to || today;
  const accountId = params.accountId || "";

  const supabase = await createClient();

  // Fetch active customers for the dropdown selection
  const { data: customersData } = await supabase
    .from("customers")
    .select("id, customer_name, alias, is_internal, opening_debit, opening_credit, linked_customer_id")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("customer_name");

  const customers = (customersData ?? []) as any[];

  let journalEntries: any[] = [];
  let selectedAccount: any = null;

  if (accountId) {
    selectedAccount = customers?.find((c) => c.id === accountId) || null;
    
    // Fetch only journal entries within the selected range to prevent full table scans
    let query = supabase
      .from("accounts_journal")
      .select("*")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null);

    if (selectedAccount) {
      // Each account's ledger shows only its own directly posted entries.
      // Reference accounts (those that other clients link to) should NOT pull in
      // child/client entries — those belong in the client's own ledger only.
      const conditions: string[] = [];
      conditions.push(`account_id.eq.${selectedAccount.id}`);
      conditions.push(`account_name.ilike."${selectedAccount.customer_name}"`);
      const nameWithAc = selectedAccount.customer_name.toLowerCase().endsWith(" a/c")
        ? selectedAccount.customer_name
        : `${selectedAccount.customer_name} A/c`;
      conditions.push(`account_name.ilike."${nameWithAc}"`);
      if (selectedAccount.alias) {
        conditions.push(`account_name.ilike."${selectedAccount.alias}"`);
        conditions.push(`account_name.ilike."${selectedAccount.alias} A/c"`);
      }
      query = query.or(conditions.join(","));
    } else {
      query = query.eq("account_id", accountId);
    }

    // Opening balance: only for the selected account itself (not children)
    const childAccountsForBal: any[] = [];
    const accountIdsForBal = selectedAccount ? [selectedAccount.id] : [accountId];

    const openingBalancesRes = await Promise.all(
      accountIdsForBal.map((id) =>
        (supabase as any).rpc("get_opening_balance", { p_account_id: id, p_from_date: from })
      )
    );

    let totalDebit = 0;
    let totalCredit = 0;
    openingBalancesRes.forEach((res) => {
      if (res.data && res.data.length > 0) {
        totalDebit += Number(res.data[0].total_debit || 0);
        totalCredit += Number(res.data[0].total_credit || 0);
      }
    });

    // If starting after 01st June 2026, roll the base opening balance into the starting opening balance
    if (selectedAccount && from > "2026-06-01") {
      totalDebit += Number(selectedAccount.opening_debit ?? 0);
      totalCredit += Number(selectedAccount.opening_credit ?? 0);
    }

    const { data: entries } = await query
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true });

    // Construct virtual entries dated before 'from' to represent the opening balance in the frontend
    const virtualEntries = [];
    if (totalDebit > 0) {
      virtualEntries.push({
        id: "virtual-dr",
        journal_no: "OPENING",
        entry_date: "1970-01-01",
        account_name: selectedAccount?.customer_name ?? "",
        entry_type: "debit" as const,
        amount: totalDebit,
        description: "Opening Balance",
        account_id: accountId,
        created_at: "",
      });
    }
    if (totalCredit > 0) {
      virtualEntries.push({
        id: "virtual-cr",
        journal_no: "OPENING",
        entry_date: "1970-01-01",
        account_name: selectedAccount?.customer_name ?? "",
        entry_type: "credit" as const,
        amount: totalCredit,
        description: "Opening Balance",
        account_id: accountId,
        created_at: "",
      });
    }

    // If starting on or before 01st June 2026 and range covers it, show base opening balance as a line item on 2026-06-01
    const baseOpeningEntries = [];
    if (selectedAccount && from <= "2026-06-01" && to >= "2026-06-01") {
      const baseDebit = Number(selectedAccount.opening_debit ?? 0);
      const baseCredit = Number(selectedAccount.opening_credit ?? 0);
      if (baseDebit > 0) {
        baseOpeningEntries.push({
          id: "virtual-base-dr",
          journal_no: "OPENING_BASE",
          entry_date: "2026-06-01",
          account_name: selectedAccount.customer_name,
          entry_type: "debit" as const,
          amount: baseDebit,
          description: "Opening Balance (Base)",
          account_id: accountId,
          created_at: "",
        });
      }
      if (baseCredit > 0) {
        baseOpeningEntries.push({
          id: "virtual-base-cr",
          journal_no: "OPENING_BASE",
          entry_date: "2026-06-01",
          account_name: selectedAccount.customer_name,
          entry_type: "credit" as const,
          amount: baseCredit,
          description: "Opening Balance (Base)",
          account_id: accountId,
          created_at: "",
        });
      }
    }

    const rawEntries = [...(entries ?? []), ...baseOpeningEntries];
    rawEntries.sort((a, b) => {
      const cmp = a.entry_date.localeCompare(b.entry_date);
      if (cmp !== 0) return cmp;
      return (a.created_at || "").localeCompare(b.created_at || "");
    });

    journalEntries = [...virtualEntries, ...rawEntries];
  } else {
    // If nothing selected, fetch aggregated trial balance summary up to 'to' date
    const { data: entries } = await (supabase as any)
      .rpc("get_accounts_journal_summary_by_date", { p_date: to });

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
