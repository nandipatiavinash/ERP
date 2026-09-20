import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  // Query Kankariya customer info
  const { data: customers, error: err1 } = await supabase
    .from("customers")
    .select("*")
    .ilike("customer_name", "%Kankariya%");
  
  console.log("CUSTOMERS:", customers);

  if (customers && customers.length > 0) {
    const kankariya = customers[0];
    
    // Query summaries by date RPC
    const { data: summary, error: err2 } = await supabase
      .rpc("get_accounts_journal_summary_by_date", { p_date: "2026-07-02" });
    
    const kankariyaSummary = summary?.filter(s => s.account_id === kankariya.id || s.account_name.includes("KANKARIYA"));
    console.log("RPC SUMMARY FOR KANKARIYA:", kankariyaSummary);

    // Query journal entries
    const { data: journals, error: err3 } = await supabase
      .from("accounts_journal")
      .select("*")
      .or(`account_id.eq.${kankariya.id},account_name.ilike.%Kankariya%`)
      .is("deleted_at", null);
    
    console.log(`JOURNAL ENTRIES COUNT: ${journals?.length}`);
    let sumDr = 0;
    let sumCr = 0;
    journals?.forEach(j => {
      console.log(`- Date: ${j.entry_date}, Type: ${j.entry_type}, Amount: ${j.amount}, Desc: ${j.description}`);
      if (j.entry_type === "debit") sumDr += Number(j.amount);
      else sumCr += Number(j.amount);
    });
    console.log(`SUM DR: ${sumDr}, SUM CR: ${sumCr}`);
  }
}

inspect();
