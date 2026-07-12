import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith("#")) continue;
  const parts = cleanLine.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function inspect() {
  console.log("1. Checking raw_material_purchases for bill_number = '73'...");
  const { data: rm } = await supabase.from("raw_material_purchases").select("*").eq("bill_number", "73");
  console.log("RM Purchases:", rm);

  console.log("\n2. Checking sales_orders for order_number or id matching '73'...");
  const { data: so } = await supabase.from("sales_orders").select("*").ilike("order_number", "%73%");
  console.log("Sales Orders:", so);

  console.log("\n3. Checking sales_deliveries...");
  const { data: sd } = await supabase.from("sales_orders").select("*").ilike("order_number", "DP-%73%");
  console.log("Deliveries (DP):", sd);

  console.log("\n4. Checking all accounts_journal lines with description '73'...");
  const { data: aj } = await supabase.from("accounts_journal").select("*").eq("description", "73");
  console.log("Journal lines with exact desc '73':", aj);

  console.log("\n5. Checking all accounts_journal lines with description '73 (something)'...");
  const { data: aj2 } = await supabase.from("accounts_journal").select("*").ilike("description", "73 (%");
  console.log("Journal lines with desc '73 (%)':", aj2);
}

inspect().catch(console.error);
