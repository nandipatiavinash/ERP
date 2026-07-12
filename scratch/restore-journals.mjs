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

async function generateNextJournalNo() {
  const { data, error } = await supabase.rpc("get_next_journal_no");
  if (!error && data) {
    return String(data);
  }
  
  // App-level fallback
  const { data: dbJournals } = await supabase
    .from("accounts_journal")
    .select("journal_no")
    .is("deleted_at", null);

  const numbers = (dbJournals || [])
    .map((j) => {
      const match = j.journal_no ? j.journal_no.match(/^JE-(\d+)$/) : null;
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextVal = maxNo + 1;
  return `JE-${String(nextVal).padStart(6, "0")}`;
}

async function restore() {
  const missingPurchases = [
    {
      id: '26d82da0-24c3-4d6c-8c5e-c7e35374d7f2',
      purchase_date: '2026-06-27',
      supplier_name: 'MANTRALAYA AGENCIES',
      bill_number: '2241',
      total_amount: 910000
    },
    {
      id: 'fd2a148b-1bd5-4eab-9ab6-4851443a73ab',
      purchase_date: '2026-06-29',
      supplier_name: 'SV POLYTECH INDUSTRIES',
      bill_number: '541',
      total_amount: 840000
    }
  ];

  // Fetch Purchase A/c
  const { data: purchaseAc } = await supabase
    .from("customers")
    .select("id, customer_name")
    .ilike("customer_name", "Purchase A/c")
    .is("deleted_at", null)
    .maybeSingle();

  if (!purchaseAc) {
    console.error("Purchase A/c not found in customers table!");
    return;
  }

  for (const p of missingPurchases) {
    console.log(`Restoring journals for purchase ${p.id} (${p.supplier_name}, Bill ${p.bill_number})...`);
    
    // Fetch supplier account
    const { data: supplierAc } = await supabase
      .from("customers")
      .select("id, customer_name")
      .ilike("customer_name", p.supplier_name)
      .is("deleted_at", null)
      .maybeSingle();

    if (!supplierAc) {
      console.error(`Supplier account not found for ${p.supplier_name}!`);
      continue;
    }

    const journalNo = await generateNextJournalNo();
    console.log(`Assigned journal number: ${journalNo}`);

    const journalInserts = [
      {
        journal_no: journalNo,
        entry_date: p.purchase_date,
        account_id: purchaseAc.id,
        account_name: purchaseAc.customer_name,
        entry_type: "debit",
        amount: p.total_amount,
        description: `[PURCHASE_REF:${p.id}] ${p.bill_number} (${supplierAc.customer_name})`,
      },
      {
        journal_no: journalNo,
        entry_date: p.purchase_date,
        account_id: supplierAc.id,
        account_name: supplierAc.customer_name,
        entry_type: "credit",
        amount: p.total_amount,
        description: `[PURCHASE_REF:${p.id}] ${p.bill_number}`,
      }
    ];

    const { error: insertErr } = await supabase
      .from("accounts_journal")
      .insert(journalInserts);

    if (insertErr) {
      console.error("Error inserting journal entries:", insertErr);
    } else {
      console.log(`Successfully restored journal entries for ${p.supplier_name}!`);
    }
  }
}

restore();
