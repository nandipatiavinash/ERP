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
  console.log("Checking customer details for order DP-07-12-01...");
  const { data: order, error } = await supabase
    .from("sales_orders")
    .select("*, customers(*)")
    .eq("order_number", "DP-07-12-01")
    .single();

  if (error) {
    console.error("Error fetching order:", error.message);
    return;
  }
  console.log("Order Customer Name:", order.customers?.customer_name);
  console.log("Order Customer ID:", order.customer_id);

  console.log("\nSearching for 'Sales A/c' in customers...");
  const { data: salesAc } = await supabase.from("customers").select("*").ilike("customer_name", "Sales A/c").maybeSingle();
  console.log("Sales A/c:", salesAc);

  console.log("\nSearching for exact Customer by name or id...");
  const { data: custMatch } = await supabase.from("customers").select("*").eq("id", order.customer_id).maybeSingle();
  console.log("Customer match:", custMatch);
}

inspect().catch(console.error);
