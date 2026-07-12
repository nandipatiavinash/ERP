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
  const { data: purchases, error } = await supabase
    .from("raw_material_purchases")
    .select("created_at, purchase_date, supplier_name, total_amount")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Supabase Error:", error);
    return;
  }
  console.log("Purchase entries count:", purchases?.length);
  if (purchases && purchases.length > 0) {
    console.log("Latest 5 created purchases:");
    console.log(purchases.slice(0, 5));
  }
}

inspect();
