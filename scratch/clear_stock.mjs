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

async function clearStock() {
  const tables = [
    "finishing_bundles",
    "offset_rolls",
    "lamination_rolls",
    "roto_metallic_rolls",
    "roto_film_rolls"
  ];

  console.log("Starting stock clearance...");
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all rows

    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
    } else {
      console.log(`Successfully cleared table: ${table}`);
    }
  }
  console.log("Stock clearance complete!");
}

clearStock().catch(console.error);
