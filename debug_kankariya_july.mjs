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

async function debugJuly() {
  console.log("=================================================");
  console.log("🔍 DEBUGGING KANKARIYA JULY OPENING BALANCE");
  console.log("=================================================\n");

  const kankariyaId = "f165ee9f-929f-495b-aa58-1baa9fb9c41b";
  const { data: customer } = await supabase.from("customers").select("*").eq("id", kankariyaId).single();

  console.log("Base Customer Config:", {
    name: customer.customer_name,
    opening_debit: customer.opening_debit,
    opening_credit: customer.opening_credit,
  });

  // 1. Fetch entries prior to 2026-07-01 directly
  const { data: priorEntries } = await supabase
    .from("accounts_journal")
    .select("*")
    .or(`account_id.eq.${kankariyaId},account_name.ilike."${customer.customer_name}%"`)
    .lt("entry_date", "2026-07-01")
    .is("deleted_at", null);

  let directDr = 0;
  let directCr = 0;
  priorEntries?.forEach((e) => {
    const amt = Number(e.amount);
    if (e.entry_type === "debit") directDr += amt;
    else directCr += amt;
  });

  console.log(`Direct Journal Query prior to 2026-07-01 (${priorEntries?.length || 0} entries):`);
  console.log(`Direct Debit Sum: ${directDr}, Direct Credit Sum: ${directCr}, Net: ${directDr - directCr}`);

  // 2. Query get_opening_balance RPC for 2026-07-01
  const { data: rpcRes, error: rpcErr } = await supabase.rpc("get_opening_balance", {
    p_account_id: kankariyaId,
    p_from_date: "2026-07-01",
  });

  console.log("\nRPC get_opening_balance('2026-07-01'):", rpcRes, rpcErr);

  // 3. Query all entries up to 2026-06-30
  const baseDr = Number(customer.opening_debit || 0);
  const baseCr = Number(customer.opening_credit || 0);

  const rpcDr = Number(rpcRes?.[0]?.total_debit || 0);
  const rpcCr = Number(rpcRes?.[0]?.total_credit || 0);

  const netOpeningRPC = (baseDr + rpcDr) - (baseCr + rpcCr);
  const netOpeningDirect = (baseDr + directDr) - (baseCr + directCr);

  console.log(`Net Opening (RPC): ${netOpeningRPC} (${netOpeningRPC > 0 ? "Dr" : "Cr"})`);
  console.log(`Net Opening (Direct): ${netOpeningDirect} (${netOpeningDirect > 0 ? "Dr" : "Cr"})`);
}

debugJuly();
