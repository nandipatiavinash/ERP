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

async function checkColumns() {
  const { data: roto } = await supabase.from("roto_products").select("*").limit(1);
  const { data: offset } = await supabase.from("offset_products").select("*").limit(1);
  const { data: finishing } = await supabase.from("finishing_products").select("*").limit(1);
  
  console.log("roto_products columns:", roto && roto[0] ? Object.keys(roto[0]) : "empty");
  console.log("offset_products columns:", offset && offset[0] ? Object.keys(offset[0]) : "empty");
  console.log("finishing_products columns:", finishing && finishing[0] ? Object.keys(finishing[0]) : "empty");
}

checkColumns().catch(console.error);
