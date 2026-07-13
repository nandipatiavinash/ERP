import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  const env = {};
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const env = { ...loadEnvFile(resolve(".env.local")), ...process.env };
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function analyzeInconsistencies() {
  console.log("Analyzing product purchases and sales entries for inconsistencies...");

  // 1. Fetch recent product purchases (last 5 days)
  const { data: purchases, error: pErr } = await supabase
    .from("product_purchases")
    .select(`
      id, purchase_date, supplier_name, bill_number, total_amount, created_at,
      product_purchase_items(id, department, quantity, weight, rate, amount)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (pErr) {
    console.error("Failed to fetch purchases:", pErr);
    return;
  }

  console.log(`\n--- Product Purchases Analysis (Total: ${purchases.length}) ---`);
  
  const orphanedPurchases = [];
  const mismatchedAmounts = [];

  for (const p of purchases) {
    const items = p.product_purchase_items || [];
    const itemsSum = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    
    if (items.length === 0) {
      orphanedPurchases.push(p);
    } else if (Math.abs(itemsSum - Number(p.total_amount)) > 0.01) {
      mismatchedAmounts.push({ purchase: p, itemsSum });
    }
  }

  console.log(`Found ${orphanedPurchases.length} orphaned purchases (headers with no items):`);
  orphanedPurchases.forEach(p => {
    console.log(`- Date: ${p.purchase_date}, Supplier: ${p.supplier_name}, Bill: ${p.bill_number}, Amount: ₹${p.total_amount}, Created: ${p.created_at}`);
  });

  console.log(`\nFound ${mismatchedAmounts.length} purchases with sum of items not matching total amount:`);
  mismatchedAmounts.forEach(m => {
    console.log(`- Date: ${m.purchase.purchase_date}, Bill: ${m.purchase.bill_number}, Header Amount: ₹${m.purchase.total_amount}, Items Sum: ₹${m.itemsSum}`);
  });

  // 2. Fetch journal entries for these bills to see if they exist or are orphaned
  console.log("\n--- Checking Journal Entries for Purchases ---");
  for (const p of purchases) {
    const descExact = `Product Purchase: ${p.bill_number}`;
    const descPrefix = `Product Purchase: ${p.bill_number} (%`;
    const { data: journals } = await supabase
      .from("accounts_journal")
      .select("id, journal_no, entry_date, account_name, entry_type, amount, description")
      .or(`description.eq."${descExact}",description.like."${descPrefix}"`);

    if (!journals || journals.length === 0) {
      console.log(`- MISSING JOURNAL: Bill ${p.bill_number} (${p.supplier_name}, Amount: ₹${p.total_amount}) has NO journal entries!`);
    } else {
      const debitSum = journals.filter(j => j.entry_type === "debit").reduce((sum, j) => sum + Number(j.amount), 0);
      const creditSum = journals.filter(j => j.entry_type === "credit").reduce((sum, j) => sum + Number(j.amount), 0);
      if (Math.abs(debitSum - creditSum) > 0.01) {
        console.log(`- UNBALANCED JOURNAL for Bill ${p.bill_number}: Debit sum ₹${debitSum} !== Credit sum ₹${creditSum}`);
      }
    }
  }

  console.log("\nAnalysis complete.");
}

analyzeInconsistencies();
