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

async function run() {
  const customer_name = 'KIRAN GNT';
  const conditions = [
    `account_id.eq.aaa62721-e24d-4bff-a858-e03a495d9f11`,
    `account_name.ilike."${customer_name}"`,
    `account_name.ilike."${customer_name} A/c"`,
  ];
  const { data: priorEntries } = await supabase.from('accounts_journal').select('*').or(conditions.join(',')).lt('entry_date', '2026-07-01').is('deleted_at', null);

  let totalDebit = 0;
  let totalCredit = 0;
  priorEntries?.forEach((entry) => {
    if (entry.entry_type === 'debit') {
      totalDebit += Number(entry.amount || 0);
    } else {
      totalCredit += Number(entry.amount || 0);
    }
  });
  console.log('KIRAN GNT Total Debit:', totalDebit);
  console.log('KIRAN GNT Total Credit:', totalCredit);
  console.log('KIRAN GNT Net:', totalCredit - totalDebit, 'Cr');
}

run();
