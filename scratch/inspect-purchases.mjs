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

async function inspect() {
  const { data: purchases, error: pError } = await supabase
    .from("raw_material_purchases")
    .select("purchase_date, total_amount, id, supplier_name, bill_number");
    
  if (pError) {
    console.error(pError);
    return;
  }
  
  const groups = {};
  for (const p of purchases) {
    if (!groups[p.purchase_date]) {
      groups[p.purchase_date] = { count: 0, total: 0 };
    }
    groups[p.purchase_date].count++;
    groups[p.purchase_date].total += Number(p.total_amount);
  }
  
  console.log("Purchases summary by date:");
  console.log(groups);
}

inspect();
