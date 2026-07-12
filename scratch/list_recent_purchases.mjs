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
  console.log("Fetching last 20 raw material purchases...");
  const { data: purchases, error } = await supabase
    .from("raw_material_purchases")
    .select("*, raw_materials(material_name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error:", error.message);
  } else {
    purchases.forEach((p) => {
      console.log(`ID: ${p.id} | Date: ${p.purchase_date} | Supplier: ${p.supplier_name} | Bill: ${p.bill_number} | Quantity: ${p.quantity} | Total: ${p.total_amount} | Created: ${p.created_at}`);
    });
  }
}

inspect().catch(console.error);
