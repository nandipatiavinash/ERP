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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const res = await supabase.from('sales_orders').select(`
      id,
      order_number,
      order_date,
      status,
      customers(customer_name, alias),
      sales_order_items(
        id,
        department,
        quantity,
        product_id,
        fabric_type_id,
        selected_roll_ids
      )
    `).eq('status', 'confirmed').is('deleted_at', null).order('order_date', { ascending: true }).limit(1);
  console.log(res.error || "SUCCESS");
}
run();
