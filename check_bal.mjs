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

async function checkOpen() {
  const { data: byId } = await supabase.from('accounts_journal').select('amount, entry_type').eq('account_id', 'f165ee9f-929f-495b-aa58-1baa9fb9c41b').lt('entry_date', '2026-07-01').is('deleted_at', null);
  
  const customer_name = 'KANKARIYA POLYFAB';
  const conditions = [
    `account_id.eq.f165ee9f-929f-495b-aa58-1baa9fb9c41b`,
    `account_name.ilike."${customer_name}"`,
    `account_name.ilike."${customer_name} A/c"`,
  ];
  const { data: byCondition } = await supabase.from('accounts_journal').select('amount, entry_type').or(conditions.join(',')).lt('entry_date', '2026-07-01').is('deleted_at', null);

  console.log('By ID Count:', byId?.length);
  console.log('By Condition Count:', byCondition?.length);

  let idDr = 0, idCr = 0;
  byId?.forEach(e => e.entry_type === 'debit' ? idDr += Number(e.amount) : idCr += Number(e.amount));

  let condDr = 0, condCr = 0;
  byCondition?.forEach(e => e.entry_type === 'debit' ? condDr += Number(e.amount) : condCr += Number(e.amount));

  console.log('By ID:', idDr, 'Dr,', idCr, 'Cr -> Net:', idDr - idCr);
  console.log('By Cond:', condDr, 'Dr,', condCr, 'Cr -> Net:', condDr - condCr);
}

checkOpen();
