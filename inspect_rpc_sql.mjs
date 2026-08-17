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

async function checkKankariyaEntriesInJune() {
  const kankariyaId = "f165ee9f-929f-495b-aa58-1baa9fb9c41b";
  const { data: customer } = await supabase.from("customers").select("*").eq("id", kankariyaId).single();

  console.log("Customer name:", customer.customer_name);

  // June entries matching page.tsx conditions
  const conditions = [
    `account_id.eq.${customer.id}`,
    `account_name.ilike."${customer.customer_name}"`,
    `account_name.ilike."${customer.customer_name} A/c"`,
  ];

  const { data: juneEntries } = await supabase
    .from("accounts_journal")
    .select("*")
    .or(conditions.join(","))
    .gte("entry_date", "2026-06-01")
    .lte("entry_date", "2026-06-30")
    .is("deleted_at", null);

  let juneDr = 0;
  let juneCr = 0;
  juneEntries?.forEach((e) => {
    const amt = Number(e.amount);
    if (e.entry_type === "debit") juneDr += amt;
    else juneCr += amt;
  });

  console.log(`June Entries Count matching page.tsx filter: ${juneEntries?.length || 0}`);
  console.log(`June Debit Sum: ${juneDr}, June Credit Sum: ${juneCr}, Net June: ${juneDr - juneCr}`);

  // Opening balance at 2026-06-01
  const { data: openBalJune } = await supabase.rpc("get_opening_balance", {
    p_account_id: kankariyaId,
    p_from_date: "2026-06-01",
  });

  console.log("Opening balance before 2026-06-01 from RPC:", openBalJune);

  // Opening balance at 2026-07-01
  const { data: openBalJuly } = await supabase.rpc("get_opening_balance", {
    p_account_id: kankariyaId,
    p_from_date: "2026-07-01",
  });

  console.log("Opening balance before 2026-07-01 from RPC:", openBalJuly);
}

checkKankariyaEntriesInJune();
