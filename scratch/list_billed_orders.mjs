import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const env = {};
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const env = { ...loadEnvFile(resolve(".env.local")), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceRoleKey);

console.log("Listing all billed sales_orders...");
const { data, error } = await supabase
  .from("sales_orders")
  .select("id, order_number, order_date, status, bill_number, bill_value, is_draft_billing, deleted_at")
  .not("bill_number", "is", null);

if (error) {
  console.error(error);
} else {
  console.log(`Found ${data.length} billed sales orders:`);
  console.table(data);
}
