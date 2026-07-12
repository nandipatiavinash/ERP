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
    .select("id, purchase_date, supplier_name, bill_number, raw_material_id, quantity, rate, created_at")
    .order("created_at");

  console.log("Total purchases:", purchases?.length);

  const seen = new Map();
  const duplicates = [];

  for (const p of purchases || []) {
    // Round quantity and rate to avoid small float mismatches
    const key = `${p.purchase_date}|${p.supplier_name}|${p.bill_number}|${p.raw_material_id}|${Number(p.quantity).toFixed(2)}|${Number(p.rate).toFixed(2)}`;
    
    if (seen.has(key)) {
      const first = seen.get(key);
      const diffTime = Math.abs(new Date(p.created_at) - new Date(first.created_at));
      if (diffTime < 5000) { // Created within 5 seconds of each other
        duplicates.push({ first, second: p, diffTimeMs: diffTime });
      }
    } else {
      seen.set(key, p);
    }
  }

  console.log("Found duplicate purchases:", duplicates.length);
  if (duplicates.length > 0) {
    console.log("Sample duplicates:");
    console.log(duplicates.slice(0, 5));
  }
}

check();
