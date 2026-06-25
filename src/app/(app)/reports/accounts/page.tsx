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
    .select("id, customer_name, alias, is_internal, opening_debit, opening_credit")
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
      const conditions = [`account_id.eq.${accountId}`];
      conditions.push(`account_name.ilike."${selectedAccount.customer_name}"`);
      if (selectedAccount.alias) {
        conditions.push(`account_name.ilike."${selectedAccount.alias}"`);
        conditions.push(`account_name.ilike."${selectedAccount.alias} A/c"`);
      }
      const nameWithAc = selectedAccount.customer_name.toLowerCase().endsWith(" a/c")
        ? selectedAccount.customer_name
        : `${selectedAccount.customer_name} A/c`;
      conditions.push(`account_name.ilike."${nameWithAc}"`);
      
      query = query.or(conditions.join(","));
    } else {
      query = query.eq("account_id", accountId);
    }

    const [{ data: openingBalData }, { data: entries }] = await Promise.all([
      (supabase as any).rpc("get_opening_balance", { p_account_id: accountId, p_from_date: from }),
      query
        .order("entry_date", { ascending: true })
        .order("created_at", { ascending: true })
    ]);

    // Construct virtual entries dated before 'from' to represent the opening balance in the frontend
    const virtualEntries = [];
    if (openingBalData && openingBalData.length > 0) {
      const { total_debit, total_credit } = openingBalData[0];
      if (Number(total_debit) > 0) {
        virtualEntries.push({
          id: "virtual-dr",
          journal_no: "OPENING",
          entry_date: "1970-01-01",
          account_name: selectedAccount?.customer_name ?? "",
          entry_type: "debit" as const,
          amount: Number(total_debit),
          description: "Opening Balance",
          account_id: accountId,
        });
      }
      if (Number(total_credit) > 0) {
        virtualEntries.push({
          id: "virtual-cr",
          journal_no: "OPENING",
          entry_date: "1970-01-01",
          account_name: selectedAccount?.customer_name ?? "",
          entry_type: "credit" as const,
          amount: Number(total_credit),
          description: "Opening Balance",
          account_id: accountId,
        });
      }
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
