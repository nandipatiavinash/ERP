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
  console.log("Checking raw material purchases for bill number containing '73'...");
  const { data: purchases, error } = await supabase
    .from("raw_material_purchases")
    .select("*, raw_materials(material_name)")
    .ilike("bill_number", "%73%");

  if (error) {
    console.error("Error fetching purchases:", error.message);
  } else {
    console.log("Matching Raw Material Purchases:", purchases);
  }
}

inspect().catch(console.error);
