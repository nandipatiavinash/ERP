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
    
    // Find all family account IDs (parent + children)
    const familyIds = [accountId];
    if (selectedAccount) {
      if (selectedAccount.linked_customer_id) {
        familyIds.push(selectedAccount.linked_customer_id);
        const siblings = customers.filter(
          (c) => c.linked_customer_id === selectedAccount.linked_customer_id && c.id !== accountId
        );
        siblings.forEach((s) => familyIds.push(s.id));
      } else {
        const children = customers.filter((c) => c.linked_customer_id === selectedAccount.id);
        children.forEach((c) => familyIds.push(c.id));
      }
    }

    // Fetch only journal entries within the selected range to prevent full table scans
    let query = supabase
      .from("accounts_journal")
      .select("*")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null);

    const conditions: string[] = [];
    familyIds.forEach((id) => {
      conditions.push(`account_id.eq.${id}`);
      const accObj = customers.find((c) => c.id === id);
      if (accObj) {
        conditions.push(`account_name.ilike."${accObj.customer_name}"`);
        if (accObj.alias) {
          conditions.push(`account_name.ilike."${accObj.alias}"`);
          conditions.push(`account_name.ilike."${accObj.alias} A/c"`);
        }
        const nameWithAc = accObj.customer_name.toLowerCase().endsWith(" a/c")
          ? accObj.customer_name
          : `${accObj.customer_name} A/c`;
        conditions.push(`account_name.ilike."${nameWithAc}"`);
      }
    });

    query = query.or(conditions.join(","));

    // Fetch opening balance and journal entries
    const [openingBalances, { data: entries }] = await Promise.all([
      Promise.all(
        familyIds.map((id) =>
          (supabase as any).rpc("get_opening_balance", { p_account_id: id, p_from_date: from })
        )
      ),
      query
        .order("entry_date", { ascending: true })
        .order("created_at", { ascending: true })
    ]);

    // Sum up opening balances across all family/reference accounts
    let totalDebit = 0;
    let totalCredit = 0;
    openingBalances.forEach(({ data }) => {
      if (data && data.length > 0) {
        totalDebit += Number(data[0].total_debit || 0);
        totalCredit += Number(data[0].total_credit || 0);
      }
    });

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
