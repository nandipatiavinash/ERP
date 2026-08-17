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

async function testKankariyaFix() {
  console.log("=================================================");
  console.log("🚀 TESTING FIX FOR KANKARIYA POLYFAB ON 17-08-2026");
  console.log("=================================================\n");

  const kankariyaId = "f165ee9f-929f-495b-aa58-1baa9fb9c41b";
  const from = "2026-08-17";
  const to = "2026-08-17";

  const { data: customer } = await supabase.from("customers").select("*").eq("id", kankariyaId).single();
  const { data: openBalRes } = await supabase.rpc("get_opening_balance", {
    p_account_id: kankariyaId,
    p_from_date: from,
  });

  const priorJournalDr = Number(openBalRes?.[0]?.total_debit || 0);
  const priorJournalCr = Number(openBalRes?.[0]?.total_credit || 0);

  const baseDr = Number(customer.opening_debit || 0);
  const baseCr = Number(customer.opening_credit || 0);

  const totalPriorDr = baseDr + priorJournalDr;
  const totalPriorCr = baseCr + priorJournalCr;
  const netPrior = totalPriorDr - totalPriorCr;

  console.log(`Prior Debit: ${totalPriorDr}, Prior Credit: ${totalPriorCr}, Net Prior: ${netPrior}`);

  // Create single net virtual entry
  const virtualEntries = [];
  if (netPrior > 0) {
    virtualEntries.push({
      id: "virtual-dr",
      journal_no: "VIRTUAL_OPENING_DR",
      entry_date: "1970-01-01",
      account_name: customer.customer_name,
      entry_type: "debit",
      amount: netPrior,
      description: "Opening Balance",
      account_id: kankariyaId,
      created_at: "",
    });
  } else if (netPrior < 0) {
    virtualEntries.push({
      id: "virtual-cr",
      journal_no: "VIRTUAL_OPENING_CR",
      entry_date: "1970-01-01",
      account_name: customer.customer_name,
      entry_type: "credit",
      amount: Math.abs(netPrior),
      description: "Opening Balance",
      account_id: kankariyaId,
      created_at: "",
    });
  }

  const { data: entries } = await supabase
    .from("accounts_journal")
    .select("*")
    .or(`account_id.eq.${kankariyaId},account_name.ilike."${customer.customer_name}%"`)
    .gte("entry_date", from)
    .lte("entry_date", to)
    .is("deleted_at", null);

  const allEntries = [...virtualEntries, ...(entries || [])];

  const counts = {};
  allEntries.forEach((entry) => {
    const jNo = entry.journal_no || "";
    if (!counts[jNo]) counts[jNo] = { dr: 0, cr: 0 };
    if (entry.entry_type === "debit") counts[jNo].dr++;
    else counts[jNo].cr++;
  });

  const filteredEntries = allEntries.filter((entry) => {
    const jNo = entry.journal_no || "";
    if (!jNo || jNo.startsWith("VIRTUAL")) return true;
    const c = counts[jNo];
    return !(c && c.dr > 0 && c.cr > 0);
  });

  let historicalDebit = 0;
  let historicalCredit = 0;
  const inRangeEntries = [];

  filteredEntries.forEach((entry) => {
    const amt = Number(entry.amount);
    if (entry.entry_date < from) {
      if (entry.entry_type === "debit") historicalDebit += amt;
      else historicalCredit += amt;
    } else if (entry.entry_date >= from && entry.entry_date <= to) {
      inRangeEntries.push(entry);
    }
  });

  const netOpening = historicalDebit - historicalCredit;
  const openingDr = netOpening > 0 ? netOpening : 0;
  const openingCr = netOpening < 0 ? Math.abs(netOpening) : 0;

  console.log("\n=================================================");
  console.log(`Top Row OPENING VALUE on ${from}: ${openingCr > 0 ? openingCr + " Cr" : openingDr + " Dr"}`);
  console.log(`In-range transactions count: ${inRangeEntries.length}`);

  let runningBal = openingDr - openingCr;
  inRangeEntries.forEach((e) => {
    const amt = Number(e.amount);
    if (e.entry_type === "debit") runningBal += amt;
    else runningBal -= amt;
    console.log(`Transaction ${e.entry_date} (${e.description}): ${e.entry_type} ₹${amt} -> Balance: ${runningBal > 0 ? runningBal + " Dr" : Math.abs(runningBal) + " Cr"}`);
  });

  console.log(`Final Closing Balance on ${to}: ${runningBal > 0 ? runningBal + " Dr" : Math.abs(runningBal) + " Cr"}`);
  console.log("=================================================\n");
}

testKankariyaFix();
