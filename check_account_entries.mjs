import { createClient } from "@supabase/supabase-js";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAccount() {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, customer_name, opening_debit, opening_credit")
    .or("opening_debit.gt.0,opening_credit.gt.0")
    .limit(10);

  console.log("Customers with Opening Values:", customers);

  if (customers && customers.length > 0) {
    const c = customers[0];
    console.log(`\nInspecting ${c.customer_name} (${c.id}):`);
    const { data: journalRows } = await supabase
      .from("accounts_journal")
      .select("*")
      .or(`account_id.eq.${c.id},account_name.ilike."${c.customer_name}%"`)
      .order("entry_date", { ascending: true });

    console.log(`Journal Rows (${journalRows?.length || 0}):`);
    journalRows?.slice(0, 10).forEach((r) => {
      console.log(`Date: ${r.entry_date} | Type: ${r.entry_type} | Amt: ${r.amount} | Desc: ${r.description}`);
    });
  }
}

inspectAccount();
