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
  console.log("Checking sales_deliveries for delivery_number/invoice_number containing '73'...");
  const { data: deliveries, error } = await supabase
    .from("sales_deliveries")
    .select("*, sales_orders(order_number), customers(customer_name)")
    .or("delivery_number.ilike.%73%,invoice_number.ilike.%73%");

  if (error) {
    console.error("Error fetching deliveries:", error.message);
  } else {
    console.log("Matching Deliveries:", deliveries);
  }
}

inspect().catch(console.error);
