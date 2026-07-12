import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load env variables manually
const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith("#")) continue;
  const parts = cleanLine.split("=");
  if (parts.length >= 2) {
    process.env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function run() {
  const { data, error } = await supabase
    .from("fabric_types")
    .select("id, fabric_name, status");
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log(data);
  }
}

run().catch(console.error);
