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
  const customer_name = 'KANKARIYA POLYFAB';
  const conditions = [
    `account_id.eq.04d7e466-88a4-41a3-8094-05929952d673`,
    `account_name.ilike."${customer_name}"`,
    `account_name.ilike."${customer_name} A/c"`,
  ];
  
  const { data: priorEntries } = await supabase.from('accounts_journal').select('*').or(conditions.join(',')).lte('entry_date', '2026-06-30').is('deleted_at', null).limit(2000);
  
  const counts = {};
  priorEntries.forEach(entry => {
    const jNo = entry.journal_no || "";
    if (!counts[jNo]) counts[jNo] = { dr: 0, cr: 0 };
    if (entry.entry_type === "debit") counts[jNo].dr++;
    else counts[jNo].cr++;
  });

  const filteredEntries = priorEntries.filter(entry => {
    const jNo = entry.journal_no || "";
    if (!jNo || jNo.startsWith("VIRTUAL") || jNo.startsWith("OPENING")) return true;
    const c = counts[jNo];
    return !(c && c.dr > 0 && c.cr > 0);
  });

  let d = 0;
  let c = 0;
  filteredEntries.forEach(e => {
    if(e.entry_type==='debit') d+=Number(e.amount);
    else c+=Number(e.amount);
  });

  console.log('Filtered Debits:', d, 'Credits:', c, 'Net:', c-d);
  console.log('Plus Opening Credit:', 1539199 + c - d);
}
run();
