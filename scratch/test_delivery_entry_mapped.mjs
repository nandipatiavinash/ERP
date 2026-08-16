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
  console.log("Fetching supporting tables...");
  const [
    fabricsRes,
    rotoProductsRes,
    offsetProductsRes
  ] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height")
  ]);

  const fabrics = fabricsRes.data || [];
  const rotoProducts = rotoProductsRes.data || [];
  const offsetProducts = offsetProductsRes.data || [];

  console.log("Fetching finishing bundles using our updated query...");
  const { data: availableFinishing, error } = await supabase
    .from("finishing_bundles")
    .select(`
      id,
      bundle_id,
      weight_kg,
      num_bags,
      status,
      fabric_type_id,
      product_id,
      finish_type,
      offset_rolls:source_offset_roll_id (
        offset_type
      ),
      lamination_rolls:source_lam_roll_id (
        lam_type
      )
    `)
    .eq("status", "available")
    .is("deleted_at", null);

  if (error) {
    console.error("Fetch failed:", error);
    return;
  }

  console.log("Mapping bundles using the updated mapping logic...");
  const mappedFinishing = (availableFinishing ?? []).map((r) => {
    const parsed = parseFinishingBundleId(r.bundle_id, fabrics, rotoProducts, offsetProducts);
    return {
      id: r.id,
      roll_number: r.bundle_id,
      weight: Number(r.weight_kg || 0),
      meters: Number(r.num_bags || 0),
      status: r.status,
      fabric_type_id: r.fabric_type_id || parsed.fabricTypeId,
      product_id: r.product_id,
      finish_type: r.finish_type,
      lam_type: r.lamination_rolls?.lam_type || parsed.lamType,
      offset_type: r.offset_rolls?.offset_type || null,
      film_type: parsed.filmType,
      is_metallic: parsed.isMetallic,
      roto_product_id: parsed.rotoProductId,
      offset_product_id: parsed.offsetProductId,
      department: "finishing"
    };
  });

  console.log("Mapped results:", JSON.stringify(mappedFinishing, null, 2));

  // Let's also check if the SANGAM-SEEDS bundle matches the draft finishing order items.
  const draftOrderItem = {
    id: "2fb1f5dc-8971-4fa9-a31f-63d141debcca",
    department: "finishing",
    fabric_type_id: "3fee4972-0647-41a6-b337-7c576ba27b82",
    offset_type: "FABRIC",
    offset_product_id: "4227a00d-e1dc-4a25-b442-b718dc0f08a7"
  };

  console.log("\nSimulating getItemRolls matching for finishing order item:");
  console.log("Order Item:", draftOrderItem);

  const matched = mappedFinishing.filter(r => {
    if (r.department !== draftOrderItem.department) return false;
    
    // finishing matching logic from getItemRolls in DeliveryEntryWorkspace.tsx:
    const finishType = draftOrderItem.offset_type !== "none" && draftOrderItem.offset_type ? "OFFSET" : "FABRIC";
    if (r.finish_type !== finishType) return false;
    
    const matchesFabric = r.fabric_type_id === draftOrderItem.fabric_type_id;
    if (!matchesFabric) return false;

    if (finishType === "OFFSET") {
      const matchesOffsetType = r.offset_type === draftOrderItem.offset_type;
      const matchesBrand = r.offset_product_id === draftOrderItem.offset_product_id;
      return matchesOffsetType && matchesBrand;
    }
    return true;
  });

  console.log("Matched available stock count:", matched.length);
  console.log("Matched items:", matched);
}

run().catch(console.error);
