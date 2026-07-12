import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envLocal = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envLocal.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: purchases } = await supabase
    .from("raw_material_purchases")
    .select("id, purchase_date, supplier_name, bill_number, total_amount");

  const { data: journals, error } = await supabase
    .from("accounts_journal")
    .select("journal_no, entry_date, description, account_name, entry_type, amount");

  if (error) {
    console.error("Supabase error for accounts_journal:", error);
    return;
  }

  console.log("Total purchases in DB:", purchases?.length);
  console.log("Total journal entries in DB:", journals?.length);

  // Group journals by journal_no
  const journalsByNo = {};
  for (const j of journals || []) {
    if (!journalsByNo[j.journal_no]) {
      journalsByNo[j.journal_no] = [];
    }
    journalsByNo[j.journal_no].push(j);
  }

  // Check which purchases have matching journals
  const purchasesWithoutJournals = [];
  const purchasesWithJournals = [];

  for (const p of purchases || []) {
    let matched = false;
    for (const jNo in journalsByNo) {
      const rows = journalsByNo[jNo];
      // Check if any row in this journal entry matches the bill number and supplier
      const matchedRow = rows.find(r => {
        const desc = (r.description || "").toLowerCase();
        const supplier = (p.supplier_name || "").toLowerCase();
        const bill = (p.bill_number || "").toLowerCase();
        return bill && desc.includes(bill) && desc.includes(supplier);
      });
      if (matchedRow) {
        matched = true;
        break;
      }
    }
    
    if (matched) {
      purchasesWithJournals.push(p);
    } else {
      purchasesWithoutJournals.push(p);
    }
  }

  console.log("Purchases WITH matching journals:", purchasesWithJournals.length);
  console.log("Purchases WITHOUT matching journals:", purchasesWithoutJournals.length);
  
  if (purchasesWithoutJournals.length > 0) {
    console.log("\nSome purchases missing journals:");
    console.log(purchasesWithoutJournals.slice(0, 10));
  }
}

check();
