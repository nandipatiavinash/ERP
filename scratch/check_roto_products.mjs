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

async function checkRoto() {
  const { data: rotoProducts, error } = await supabase
    .from("roto_products")
    .select("*");
    
  console.log("Roto Products in Database:", rotoProducts?.length);
  if (rotoProducts && rotoProducts.length > 0) {
    console.log("Sample 5 records:");
    console.log(rotoProducts.slice(0, 5));
  }
}

checkRoto().catch(console.error);
