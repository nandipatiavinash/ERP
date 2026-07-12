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
  console.log("Checking details of DP-07-12-01...");
  const { data: order, error } = await supabase
    .from("sales_orders")
    .select("id, order_number, bill_number, bill_value, is_draft_billing, status, created_at")
    .eq("order_number", "DP-07-12-01")
    .single();

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Order DP-07-12-01:", order);
  }
}

inspect().catch(console.error);
