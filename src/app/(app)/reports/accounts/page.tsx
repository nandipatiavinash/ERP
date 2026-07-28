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
      // Find all child accounts that link to this selectedAccount
      const childAccounts = customers?.filter((c) => c.linked_customer_id === selectedAccount.id) || [];
      const accountIds = [selectedAccount.id, ...childAccounts.map((c) => c.id)];

      // Build OR conditions for all of these accounts
      const conditions: string[] = [];
      accountIds.forEach((id) => {
        conditions.push(`account_id.eq.${id}`);
      });

      // Fetch names and aliases for all involved accounts
      const involvedAccounts = [selectedAccount, ...childAccounts];
      involvedAccounts.forEach((acc) => {
        conditions.push(`account_name.ilike."${acc.customer_name}"`);
        const nameWithAc = acc.customer_name.toLowerCase().endsWith(" a/c")
          ? acc.customer_name
          : `${acc.customer_name} A/c`;
        conditions.push(`account_name.ilike."${nameWithAc}"`);
        if (acc.alias) {
          conditions.push(`account_name.ilike."${acc.alias}"`);
          conditions.push(`account_name.ilike."${acc.alias} A/c"`);
        }
      });
      
      query = query.or(conditions.join(","));
    } else {
      query = query.eq("account_id", accountId);
    }

    // Fetch and aggregate opening balances for selected account and its children
    const childAccountsForBal = customers?.filter((c) => c.linked_customer_id === selectedAccount?.id) || [];
    const accountIdsForBal = selectedAccount ? [selectedAccount.id, ...childAccountsForBal.map((c) => c.id)] : [accountId];

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
      });
    }

    journalEntries = [...virtualEntries, ...(entries ?? [])];
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
