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
  console.log("Checking material_sales for bill_number containing '73'...");
  const { data: sales, error } = await supabase
    .from("material_sales")
    .select("*, raw_materials(material_name)")
    .ilike("bill_number", "%73%");

  if (error) {
    console.error("Error fetching material sales:", error.message);
  } else {
    console.log("Matching Material Sales:", sales);
  }
}

inspect().catch(console.error);
