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

async function testOpeningBalanceLogic() {
  console.log("=================================================");
  console.log("🚀 TESTING ACCOUNT LEDGER OPENING BALANCE LOGIC");
  console.log("=================================================\n");

  // Fetch a customer with an opening credit
  const { data: customer } = await supabase
    .from("customers")
    .select("id, customer_name, opening_debit, opening_credit")
    .gt("opening_credit", 0)
    .limit(1)
    .single();

  if (!customer) {
    console.log("No customer with opening credit found.");
    return;
  }

  console.log(`Testing with Customer: ${customer.customer_name} (ID: ${customer.id})`);
  console.log(`Base Config Opening Credit: ₹${customer.opening_credit}`);

  // Function simulating backend logic in page.tsx + AccountReportsClient.tsx
  async function computeLedger(from, to) {
    const { data: openBalRes } = await supabase.rpc("get_opening_balance", {
      p_account_id: customer.id,
      p_from_date: from,
    });

    const priorJournalDr = Number(openBalRes?.[0]?.total_debit || 0);
    const priorJournalCr = Number(openBalRes?.[0]?.total_credit || 0);

    const baseDr = Number(customer.opening_debit || 0);
    const baseCr = Number(customer.opening_credit || 0);

    const totalPriorDr = baseDr + priorJournalDr;
    const totalPriorCr = baseCr + priorJournalCr;

    const netOpening = totalPriorDr - totalPriorCr;
    const openingDr = netOpening > 0 ? netOpening : 0;
    const openingCr = netOpening < 0 ? Math.abs(netOpening) : 0;

    const { data: entries } = await supabase
      .from("accounts_journal")
      .select("*")
      .or(`account_id.eq.${customer.id},account_name.ilike."${customer.customer_name}%"`)
      .gte("entry_date", from)
      .lte("entry_date", to)
      .is("deleted_at", null)
      .order("entry_date", { ascending: true });

    let runningBal = totalPriorDr - totalPriorCr;
    const ledgerRows = [];

    entries?.forEach((entry) => {
      const amt = Number(entry.amount);
      if (entry.entry_type === "debit") {
        runningBal += amt;
      } else {
        runningBal -= amt;
      }
      ledgerRows.push({
        date: entry.entry_date,
        desc: entry.description,
        dr: entry.entry_type === "debit" ? amt : 0,
        cr: entry.entry_type === "credit" ? amt : 0,
        balance: runningBal > 0 ? `${runningBal} Dr` : `${Math.abs(runningBal)} Cr`,
      });
    });

    return {
      openingDr,
      openingCr,
      openingDisplay: netOpening > 0 ? `${openingDr} Dr` : `${openingCr} Cr`,
      closingBalance: runningBal > 0 ? `${runningBal} Dr` : `${Math.abs(runningBal)} Cr`,
      ledgerRows,
    };
  }

  // Range 1: 01-06-2026 to 17-08-2026
  console.log("\n-------------------------------------------------");
  console.log("📅 RANGE 1: 2026-06-01 to 2026-08-17");
  const r1 = await computeLedger("2026-06-01", "2026-08-17");
  console.log(`Top Row OPENING VALUE on 2026-06-01: ${r1.openingDisplay}`);
  console.log(`Number of in-range transactions: ${r1.ledgerRows.length}`);
  if (r1.ledgerRows.length > 0) {
    console.log(`First transaction on ${r1.ledgerRows[0].date}: ${r1.ledgerRows[0].desc} -> Balance after: ${r1.ledgerRows[0].balance}`);
  }
  console.log(`Closing Balance on 2026-08-17: ${r1.closingBalance}`);

  // Range 2: 17-08-2026 to 01-09-2026
  console.log("\n-------------------------------------------------");
  console.log("📅 RANGE 2: 2026-08-17 to 2026-09-01");
  const r2 = await computeLedger("2026-08-17", "2026-09-01");
  console.log(`Top Row OPENING VALUE on 2026-08-17: ${r2.openingDisplay}`);
  console.log(`Closing Balance on 2026-09-01: ${r2.closingBalance}`);

  // Check continuity: Closing balance of Range 1 (up to Aug 17) should equal Opening value of Range 2 (starting Aug 17)
  if (r1.closingBalance === r2.openingDisplay) {
    console.log("\n✅ SUCCESS: Opening Value on 2026-08-17 EXACTLY matches the closing balance before 2026-08-17!");
  } else {
    console.log(`\n❌ MISMATCH: Range 1 Closing (${r1.closingBalance}) vs Range 2 Opening (${r2.openingDisplay})`);
  }
}

testOpeningBalanceLogic();
