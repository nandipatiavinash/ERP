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
  console.log("Checking journal entries for '73'...");
  const { data: journals, error } = await supabase
    .from("accounts_journal")
    .select("*")
    .or("description.ilike.%73%,journal_no.ilike.%73%");

  if (error) {
    console.error("Error fetching journals:", error.message);
  } else {
    console.log("Matching Journals:", journals);
  }

  console.log("\nChecking product purchases...");
  const { data: purchases, error: purError } = await supabase
    .from("product_purchases")
    .select("*")
    .or("bill_number.ilike.%73%,supplier_name.ilike.%73%");

  if (purError) {
    console.error("Error fetching purchases:", purError.message);
  } else {
    console.log("Matching Product Purchases:", purchases);
  }
}

inspect().catch(console.error);
