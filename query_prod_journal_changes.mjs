import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment configuration
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

// Production DB Credentials
const prodUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pdgnbjiswfvladuhltcx.supabase.co";
const prodKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!prodKey) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(prodUrl, prodKey);

async function getProdChanges() {
  console.log("=================================================");
  console.log("🔍 QUERYING PRODUCTION DATABASE ACCOUNT CHANGES");
  console.log("=================================================\n");

  // 1. Fetch Journal Entries created/dated in last 2 days (2026-08-15 to 2026-08-17)
  const { data: journalEntries, error: jErr } = await supabase
    .from("accounts_journal")
    .select("id, journal_no, entry_date, entry_type, amount, description, account_name, created_at")
    .gte("entry_date", "2026-08-15")
    .order("entry_date", { ascending: false });

  if (jErr) {
    console.error("Error fetching journal entries:", jErr);
  } else {
    console.log(`📋 Accounts Journal Entries (Entry Date >= 2026-08-15): ${journalEntries?.length || 0} entries`);
    journalEntries?.forEach((e) => {
      console.log(`  • [${e.entry_date}] JNo: ${e.journal_no} | ${e.account_name} | ${e.entry_type.toUpperCase()} ₹${Number(e.amount).toLocaleString("en-IN")} | ${e.description} (Logged: ${e.created_at})`);
    });
  }

  // 2. Fetch Product Purchase entries in last 2 days
  const { data: purchases, error: pErr } = await supabase
    .from("product_purchase_headers")
    .select("id, bill_number, bill_date, department, supplier_account_id, net_amount, customers(customer_name), created_at")
    .gte("bill_date", "2026-08-15")
    .order("bill_date", { ascending: false });

  if (pErr) {
    console.error("\nError fetching product purchases:", pErr);
  } else {
    console.log(`\n📦 Product Purchases (Bill Date >= 2026-08-15): ${purchases?.length || 0} purchases`);
    purchases?.forEach((p) => {
      console.log(`  • [Bill #${p.bill_number}] Date: ${p.bill_date} | Supplier: ${p.customers?.customer_name} | Dept: ${p.department} | Amount: ₹${Number(p.net_amount).toLocaleString("en-IN")} (Logged: ${p.created_at})`);
    });
  }

  // 3. Fetch recently created or updated accounts
  const { data: accounts, error: aErr } = await supabase
    .from("customers")
    .select("id, customer_name, opening_debit, opening_credit, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (aErr) {
    console.error("\nError fetching accounts:", aErr);
  } else {
    console.log(`\n👥 Latest Accounts / Customers Registered:`);
    accounts?.forEach((a) => {
      console.log(`  • ${a.customer_name} | Op Dr: ₹${a.opening_debit} | Op Cr: ₹${a.opening_credit} | Created: ${a.created_at}`);
    });
  }

  // 4. Check entries logged in last 48 hours by created_at timestamp
  const twoDaysAgo = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  const { data: recentlyCreatedJournal, error: rErr } = await supabase
    .from("accounts_journal")
    .select("id, journal_no, entry_date, entry_type, amount, description, account_name, created_at")
    .gte("created_at", twoDaysAgo)
    .order("created_at", { ascending: false });

  if (!rErr && recentlyCreatedJournal && recentlyCreatedJournal.length > 0) {
    console.log(`\n⏱️ Journal Entries Logged in Last 48 Hours: ${recentlyCreatedJournal.length} entries`);
    recentlyCreatedJournal.forEach((e) => {
      console.log(`  • Logged: ${e.created_at} | Date: ${e.entry_date} | JNo: ${e.journal_no} | ${e.account_name} | ${e.entry_type.toUpperCase()} ₹${Number(e.amount).toLocaleString("en-IN")} | ${e.description}`);
    });
  } else {
    console.log(`\n⏱️ No new journal entries were created/logged in the Production database by system activity in the last 48 hours.`);
  }

  // 5. Let's also check transactions across August 2026 generally (e.g. from 2026-08-01 onwards)
  const { data: augEntries } = await supabase
    .from("accounts_journal")
    .select("id, journal_no, entry_date, entry_type, amount, description, account_name, created_at")
    .gte("entry_date", "2026-08-01")
    .order("entry_date", { ascending: false });

  console.log(`\n📅 Total August 2026 Transactions (since 2026-08-01): ${augEntries?.length || 0} entries`);
  augEntries?.slice(0, 15).forEach((e) => {
    console.log(`  • [${e.entry_date}] JNo: ${e.journal_no} | ${e.account_name} | ${e.entry_type.toUpperCase()} ₹${Number(e.amount).toLocaleString("en-IN")} | ${e.description}`);
  });
}

getProdChanges();
