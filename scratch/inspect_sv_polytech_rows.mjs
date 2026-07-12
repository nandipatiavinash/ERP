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
  console.log("Checking customer SV POLYTECH INDUSTRIES matches...");
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_name, deleted_at, status")
    .ilike("customer_name", "SV POLYTECH INDUSTRIES");

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Matches:", data);
  }
}

inspect().catch(console.error);
