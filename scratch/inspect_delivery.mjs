import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment variables from .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith("#")) continue;
  const parts = cleanLine.split("=");
  if (parts.length >= 2) {
    process.env[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function parseFinishingBundleId(bundleId, fabricTypes, rotoProducts, offsetProducts) {
  const upper = (bundleId || "").toUpperCase();
  
  let lamType = "PLAIN";
  if (upper.endsWith("(B)")) lamType = "BOX";
  else if (upper.endsWith("(F)")) lamType = "F_S";
  else if (upper.endsWith("(H)")) lamType = "H_S";
  else if (upper.startsWith("NW(")) lamType = "NW";

  const isMetallic = upper.includes("(MT)");

  let filmType = null;
  if (upper.includes("(G)")) filmType = "gloss";
  else if (upper.includes("(M)")) filmType = "matt";
  
  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let rotoProductId = null;
  let offsetProductId = null;

  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    if (brandName !== "PLAIN" && brandName !== "NW") {
      const rotoProduct = rotoProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (rotoProduct) {
        rotoProductId = rotoProduct.id;
      }
      const offsetProduct = offsetProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (offsetProduct) {
        offsetProductId = offsetProduct.id;
      }
    }
  }

  return { lamType, isMetallic, filmType, fabricTypeId, rotoProductId, offsetProductId };
}

async function run() {
  const { data: fabrics } = await supabase.from("fabric_types").select("id, fabric_name");
  const { data: rotoProducts } = await supabase.from("roto_products").select("id, brand, width, height");
  const { data: offsetProducts } = await supabase.from("offset_products").select("id, brand, width, height");

  const bundleId = "SANGAM-SEEDS-5KG(W-12-4)";
  const result = parseFinishingBundleId(bundleId, fabrics, rotoProducts, offsetProducts);
  console.log("Parsed result for", bundleId, ":", result);
}

run().catch(console.error);
