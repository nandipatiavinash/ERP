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
  console.log("Checking customer with ID '9712f58b-5514-4acf-a837-971c46cdefa2'...");
  const { data: cust } = await supabase.from("customers").select("*").eq("id", "9712f58b-5514-4acf-a837-971c46cdefa2");
  console.log("Customer:", cust);

  console.log("Searching for any customer with name containing 'Sales'...");
  const { data: list } = await supabase.from("customers").select("*").ilike("customer_name", "%Sales%");
  console.log("List:", list);
}

inspect().catch(console.error);
