import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const env = {};
  try {
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const index = line.indexOf("=");
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    }
  } catch (e) {}
  return env;
}

const env = { ...loadEnvFile(resolve(".env.local")), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Supabase URL or Service Role Key missing in .env.local!");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

// Parser functions identical to implementation
function parseLaminationRollId(rollId, fabricTypes, rotoProducts) {
  const upper = (rollId || "").toUpperCase();
  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let rotoProductId = null;
  let isMetallic = upper.includes("(MT)");
  let filmType = null;
  if (upper.includes("(G)")) filmType = "gloss";
  else if (upper.includes("(M)")) filmType = "matt";

  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    if (brandName !== "PLAIN" && brandName !== "NW") {
      const rotoProduct = rotoProducts.find((p) => p.brand.toUpperCase() === brandName);
      if (rotoProduct) {
        rotoProductId = rotoProduct.id;
      }
    }
  }

  let lamType = "PLAIN";
  if (upper.endsWith("(B)")) lamType = "BOX";
  else if (upper.endsWith("(F)")) lamType = "F_S";
  else if (upper.endsWith("(H)")) lamType = "H_S";
  else if (upper.startsWith("NW(")) lamType = "NW";

  return { fabricTypeId, rotoProductId, isMetallic, filmType, lamType };
}

function parseOffsetRollId(rollId, fabricTypes, offsetProducts) {
  const upper = (rollId || "").toUpperCase();
  let fabricTypeId = null;
  for (const ft of fabricTypes) {
    if (upper.includes(`(${ft.fabric_name.toUpperCase()})`)) {
      fabricTypeId = ft.id;
      break;
    }
  }

  let offsetProductId = null;
  const match = upper.match(/^([^(]+)/);
  if (match) {
    const brandName = match[1].trim();
    const offsetProduct = offsetProducts.find((p) => p.brand.toUpperCase() === brandName);
    if (offsetProduct) {
      offsetProductId = offsetProduct.id;
    }
  }

  let offsetType = "FABRIC";
  if (upper.startsWith("PLAIN(")) offsetType = "PLAIN_LAM";
  else if (upper.startsWith("NW(")) {
    offsetType = upper.includes("NW_LAM") ? "NW_LAM" : "NW";
  }

  return { fabricTypeId, offsetProductId, offsetType };
}

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

// Client matching helper function reproducing getItemRolls logic
function testGetItemRolls(item, rolls) {
  return rolls.filter((r) => {
    if (r.department !== item.department) return false;

    // 1. Fabric
    if (item.department === "fabric") {
      return r.fabric_type_id === item.product_id;
    }

    // 2. Roto-printing
    if (item.department === "roto-printing") {
      const matchesBrand = r.product_id === item.roto_product_id || r.product_id === item.product_id;
      const matchesFilm = !item.film_type || item.film_type === "none" || r.film_type === item.film_type;
      const matchesMetallic = !!r.is_metallic === !!item.is_metallic;
      return matchesBrand && matchesFilm && matchesMetallic;
    }

    // 3. Lamination
    if (item.department === "lamination") {
      const matchesFabric = r.fabric_type_id === item.fabric_type_id;
      const matchesLamType = r.lam_type === item.lamination_type;
      if (!matchesFabric || !matchesLamType) return false;
      
      if (["BOX", "F_S", "H_S"].includes(item.lamination_type || "")) {
        const matchesBrand = r.roto_product_id === item.roto_product_id;
        const matchesMetallic = !!r.is_metallic === !!item.is_metallic;
        const matchesFilm = !item.film_type || item.film_type === "none" || r.film_type === item.film_type;
        return matchesBrand && matchesMetallic && matchesFilm;
      }
      return true;
    }

    // 4. Offset Printing
    if (item.department === "offset-printing") {
      const matchesFabric = item.offset_type === "NW" || r.fabric_type_id === item.fabric_type_id;
      const matchesOffsetType = r.offset_type === item.offset_type;
      const matchesBrand = r.offset_product_id === item.offset_product_id || r.offset_product_id === item.product_id;
      return matchesFabric && matchesOffsetType && matchesBrand;
    }

    // 5. Finishing
    if (item.department === "finishing") {
      const finishType = item.lamination_type ? "LAMINATION" : (item.offset_type !== "none" && item.offset_type ? "OFFSET" : "FABRIC");
      if (r.finish_type !== finishType) return false;
      
      const matchesFabric = r.fabric_type_id === item.fabric_type_id;
      if (!matchesFabric) return false;

      if (finishType === "LAMINATION") {
        const matchesLamType = r.lam_type === item.lamination_type;
        if (!matchesLamType) return false;
        if (["BOX", "F_S", "H_S"].includes(item.lamination_type || "")) {
          const matchesBrand = r.roto_product_id === item.roto_product_id;
          const matchesMetallic = !!r.is_metallic === !!item.is_metallic;
          const matchesFilm = !item.film_type || item.film_type === "none" || r.film_type === item.film_type;
          return matchesBrand && matchesMetallic && matchesFilm;
        }
        return true;
      } else if (finishType === "OFFSET") {
        const matchesOffsetType = r.offset_type === item.offset_type;
        const matchesBrand = r.offset_product_id === item.offset_product_id;
        return matchesOffsetType && matchesBrand;
      }
      return true;
    }

    return false;
  });
}

console.log("=== COMPREHENSIVE INTEGRATION TEST SUITE: PRODUCTION TO JOURNAL ENTRIES ===");
console.log(`Target Staging URL: ${url}`);

// Arrays to track created items for absolute cleanup
const createdLooms = [];
const createdFabricTypes = [];
const createdRotoProducts = [];
const createdRotoColors = [];
const createdOffsetProducts = [];
const createdCustomers = [];
const createdOrders = [];
const createdOrderItems = [];
const createdFabricRolls = [];
const createdRotoFilmRolls = [];
const createdRotoMetallicRolls = [];
const createdLaminationRolls = [];
const createdOffsetRolls = [];
const createdFinishingBundles = [];
const createdJournals = [];

async function cleanup() {
  console.log("\nStarting absolute cleanup...");
  
  try {
    if (createdJournals.length > 0) {
      const ids = createdJournals.map(j => j?.id).filter(Boolean);
      const nos = createdJournals.map(j => j?.journal_no).filter(Boolean);
      if (ids.length > 0) await supabase.from("accounts_journal").delete().in("id", ids);
      if (nos.length > 0) await supabase.from("accounts_journal").delete().in("journal_no", nos);
    }
    if (createdFinishingBundles.length > 0) {
      const ids = createdFinishingBundles.map(b => b?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("finishing_bundles").delete().in("id", ids);
    }
    if (createdOffsetRolls.length > 0) {
      const ids = createdOffsetRolls.map(r => r?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("offset_rolls").delete().in("id", ids);
    }
    if (createdLaminationRolls.length > 0) {
      const ids = createdLaminationRolls.map(r => r?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("lamination_rolls").delete().in("id", ids);
    }
    if (createdRotoMetallicRolls.length > 0) {
      const ids = createdRotoMetallicRolls.map(r => r?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("roto_metallic_rolls").delete().in("id", ids);
    }
    if (createdRotoFilmRolls.length > 0) {
      const ids = createdRotoFilmRolls.map(r => r?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("roto_film_rolls").delete().in("id", ids);
    }
    if (createdFabricRolls.length > 0) {
      const ids = createdFabricRolls.map(r => r?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("fabric_rolls").delete().in("id", ids);
    }
    if (createdOrderItems.length > 0) {
      const ids = createdOrderItems.map(i => i?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("sales_order_items").delete().in("id", ids);
    }
    if (createdOrders.length > 0) {
      const ids = createdOrders.map(o => o?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("sales_orders").delete().in("id", ids);
    }
    if (createdCustomers.length > 0) {
      const ids = createdCustomers.map(c => c?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("customers").delete().in("id", ids);
    }
    if (createdOffsetProducts.length > 0) {
      const ids = createdOffsetProducts.map(p => p?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("offset_products").delete().in("id", ids);
    }
    if (createdRotoColors.length > 0) {
      const ids = createdRotoColors.map(c => c?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("roto_colors").delete().in("id", ids);
    }
    if (createdRotoProducts.length > 0) {
      const ids = createdRotoProducts.map(p => p?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("roto_products").delete().in("id", ids);
    }
    if (createdFabricTypes.length > 0) {
      const ids = createdFabricTypes.map(f => f?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("fabric_types").delete().in("id", ids);
    }
    if (createdLooms.length > 0) {
      const ids = createdLooms.map(l => l?.id).filter(Boolean);
      if (ids.length > 0) await supabase.from("looms").delete().in("id", ids);
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
  console.log("Cleanup complete!");
}

async function run() {
  try {
    // 0. Get user UUID for logging
    const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers();
    if (usersErr || !users || users.length === 0) {
      throw new Error("Could not fetch user list. Ensure service role has permissions.");
    }
    const userUuid = users[0].id;
    const todayStr = new Date().toISOString().split("T")[0];

    // Ensure Sales A/c exists in customers table (needed for journals)
    let { data: salesAc } = await supabase.from("customers").select("id").eq("customer_name", "Sales A/c").maybeSingle();
    if (!salesAc) {
      const { data: newSalesAc } = await supabase.from("customers").insert({
        customer_name: "Sales A/c",
        status: "active",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      salesAc = newSalesAc;
      createdCustomers.push(salesAc);
    }

    // 1. Setup Base Reference Entities
    console.log("\nSetting up reference entities...");
    const suffix = Date.now().toString().slice(-6);

    const { data: loom, error: loomErr } = await supabase.from("looms").insert({
      loom_number: `TL${suffix}`,
      status: "active"
    }).select().single();
    if (loomErr) throw new Error("Loom insert failed: " + loomErr.message);
    createdLooms.push(loom);

    const { data: fabricType, error: ftErr } = await supabase.from("fabric_types").insert({
      fabric_name: `TF${suffix}`,
      gsm: 120,
      width: 30,
      description: "Test Fabric Type",
      status: "active"
    }).select().single();
    if (ftErr) throw new Error("FabricType insert failed: " + ftErr.message);
    createdFabricTypes.push(fabricType);

    const { data: rotoProduct, error: rpErr } = await supabase.from("roto_products").insert({
      brand: `TBR-${suffix}`,
      width: 500,
      height: 890,
      num_cylinders: 4,
      status: "active"
    }).select().single();
    if (rpErr) throw new Error("RotoProduct insert failed: " + rpErr.message);
    createdRotoProducts.push(rotoProduct);

    const { data: rotoColor, error: rcErr } = await supabase.from("roto_colors").insert({
      color_name: `TC-${suffix}`,
      status: "active"
    }).select().single();
    if (rcErr) throw new Error("RotoColor insert failed: " + rcErr.message);
    createdRotoColors.push(rotoColor);

    const { data: offsetProduct, error: opErr } = await supabase.from("offset_products").insert({
      brand: `TBO-${suffix}`,
      width: 400,
      height: 600,
      status: "active"
    }).select().single();
    if (opErr) throw new Error("OffsetProduct insert failed: " + opErr.message);
    createdOffsetProducts.push(offsetProduct);

    // Create 2 Customers: Parent (Reference Account) & Child
    const { data: parentCustomer, error: pcErr } = await supabase.from("customers").insert({
      customer_name: `TP-Parent-${suffix}`,
      status: "active",
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (pcErr) throw new Error("ParentCustomer insert failed: " + pcErr.message);
    createdCustomers.push(parentCustomer);

    const { data: childCustomer, error: ccErr } = await supabase.from("customers").insert({
      customer_name: `TC-Child-${suffix}`,
      status: "active",
      linked_customer_id: parentCustomer.id,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (ccErr) throw new Error("ChildCustomer insert failed: " + ccErr.message);
    createdCustomers.push(childCustomer);

    // Create a standalone customer with no reference account
    const { data: standaloneCustomer, error: scErr } = await supabase.from("customers").insert({
      customer_name: `TS-Stand-${suffix}`,
      status: "active",
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (scErr) throw new Error("StandaloneCustomer insert failed: " + scErr.message);
    createdCustomers.push(standaloneCustomer);

    // 2. Production Entries Generation: Create at least 10 entries per department across all permutations
    console.log("\nGenerating production entries (10+ per department)...");

    const rollsPool = [];

    // Fabric rolls (10 entries)
    for (let i = 0; i < 10; i++) {
      const { data: r, error: rErr } = await supabase.from("fabric_rolls").insert({
        roll_number: `TF-ROLL-${suffix}-${i}`,
        fabric_type_id: fabricType.id,
        loom_id: loom.id,
        weight: 100 + i * 5,
        meters: 500 + i * 20,
        status: "available",
        production_date: todayStr,
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (rErr) throw new Error("FabricRoll insert failed: " + rErr.message);
      createdFabricRolls.push(r);
      rollsPool.push({ ...r, department: "fabric", roll_number: r.roll_number });
    }
    console.log(`Generated ${createdFabricRolls.length} fabric rolls.`);

    // Roto Film rolls: 10 entries (combinations of brand, gloss/matt, colors)
    for (let i = 0; i < 10; i++) {
      const fType = i % 2 === 0 ? "gloss" : "matt";
      const char = fType === "gloss" ? "G" : "M";
      const colorSuffix = i % 2 === 0 ? `(${rotoColor.color_name})` : "";
      const rollId = `${rotoProduct.brand}(${char})${colorSuffix}`.toUpperCase();

      const { data: r, error: rErr } = await supabase.from("roto_film_rolls").insert({
        roll_id: rollId,
        s_no: i + 1,
        brand_id: rotoProduct.id,
        film_type: fType,
        color_id: i % 2 === 0 ? rotoColor.id : null,
        weight_kg: 80 + i * 4,
        meters: 400 + i * 15,
        entry_date: todayStr,
        status: "available",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (rErr) throw new Error("RotoFilmRoll insert failed: " + rErr.message);
      createdRotoFilmRolls.push(r);
      rollsPool.push({ ...r, department: "roto-printing", is_metallic: false, product_id: r.brand_id, roll_number: r.roll_id });
    }
    console.log(`Generated ${createdRotoFilmRolls.length} roto film rolls.`);

    // Roto Metallic rolls: 10 entries (source from roto film rolls, is_metallic: true)
    for (let i = 0; i < 10; i++) {
      const sourceRoll = createdRotoFilmRolls[i % createdRotoFilmRolls.length];
      const rollId = `${sourceRoll.roll_id}(MT)`.toUpperCase();

      const { data: r, error: rErr } = await supabase.from("roto_metallic_rolls").insert({
        roll_id: rollId,
        s_no: i + 1,
        source_film_roll_id: sourceRoll.id,
        is_split: false,
        weight_kg: sourceRoll.weight_kg + 2,
        meters: sourceRoll.meters,
        entry_date: todayStr,
        status: "available",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (rErr) throw new Error("RotoMetallicRoll insert failed: " + rErr.message);
      createdRotoMetallicRolls.push(r);
      rollsPool.push({ ...r, department: "roto-printing", is_metallic: true, product_id: sourceRoll.brand_id, roll_number: r.roll_id, film_type: sourceRoll.film_type });
    }
    console.log(`Generated ${createdRotoMetallicRolls.length} roto metallic rolls.`);

    // Lamination rolls: 10 entries (permutations of PLAIN, NW, BOX, F_S, H_S) with full weight metadata
    const lamTypes = ["PLAIN", "NW", "BOX", "F_S", "H_S", "BOX", "F_S", "H_S", "PLAIN", "NW"];
    for (let i = 0; i < 10; i++) {
      const lType = lamTypes[i];
      const sourceMetRoll = createdRotoMetallicRolls[i % createdRotoMetallicRolls.length];
      const brand = lType === "PLAIN" ? "PLAIN" : (lType === "NW" ? "NW" : sourceMetRoll.roll_id);
      
      let suffixChar = "";
      if (lType === "BOX") suffixChar = "(B)";
      else if (lType === "F_S") suffixChar = "(F)";
      else if (lType === "H_S") suffixChar = "(H)";

      let rollId = "";
      if (lType === "PLAIN" || lType === "NW") {
        rollId = `${brand}(${fabricType.fabric_name})`;
      } else {
        rollId = `${brand}(${fabricType.fabric_name})${suffixChar}`;
      }
      rollId = rollId.toUpperCase();

      const grossWeightVal = 160 + i * 6;
      const coreWeightVal = 10;
      const netWeightVal = grossWeightVal - coreWeightVal;

      const { data: r, error: rErr } = await supabase.from("lamination_rolls").insert({
        roll_id: rollId,
        s_no: i + 1,
        lam_type: lType,
        fabric_type_id: fabricType.id,
        film_roll_id: ["BOX", "F_S", "H_S"].includes(lType) ? sourceMetRoll.id : null,
        weight_kg: netWeightVal,
        meters: 600 + i * 25,
        entry_date: todayStr,
        status: "available",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (rErr) throw new Error("LaminationRoll insert failed: " + rErr.message);
      createdLaminationRolls.push(r);

      const parsed = parseLaminationRollId(r.roll_id, createdFabricTypes, createdRotoProducts);
      rollsPool.push({
        ...r,
        department: "lamination",
        roll_number: r.roll_id,
        s_no: r.s_no,
        gross_weight: r.gross_weight,
        core_weight: r.core_weight,
        net_weight: r.net_weight,
        fabric_type_id: r.fabric_type_id,
        lam_type: r.lam_type,
        roto_product_id: parsed.rotoProductId,
        is_metallic: parsed.isMetallic,
        film_type: parsed.filmType
      });
    }
    console.log(`Generated ${createdLaminationRolls.length} lamination rolls with full Gross/Core/Net weight metadata.`);

    // Offset rolls: 10 entries (permutations of FABRIC, NW, NW_LAM, PLAIN_LAM)
    const offsetTypes = ["FABRIC", "NW", "NW_LAM", "PLAIN_LAM", "FABRIC", "NW", "NW_LAM", "PLAIN_LAM", "FABRIC", "NW"];
    for (let i = 0; i < 10; i++) {
      const oType = offsetTypes[i];
      const sourceLamRoll = createdLaminationRolls[i % createdLaminationRolls.length];
      const brandVal = offsetProduct.brand;
      const fabricNameVal = oType === "NW" ? "NW" : fabricType.fabric_name;
      const rollId = `${brandVal}(${fabricNameVal})`.toUpperCase();

      const { data: r, error: rErr } = await supabase.from("offset_rolls").insert({
        roll_id: rollId,
        s_no: i + 1,
        offset_type: oType,
        brand_id: offsetProduct.id,
        fabric_type_id: ["FABRIC", "NW_LAM", "PLAIN_LAM"].includes(oType) ? fabricType.id : null,
        source_lam_roll_id: ["NW_LAM", "PLAIN_LAM"].includes(oType) ? sourceLamRoll.id : null,
        weight_kg: 130 + i * 5,
        entry_date: todayStr,
        status: "available",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (rErr) throw new Error("OffsetRoll insert failed: " + rErr.message);
      createdOffsetRolls.push(r);
      
      const parsed = parseOffsetRollId(r.roll_id, createdFabricTypes, createdOffsetProducts);
      rollsPool.push({
        ...r,
        department: "offset-printing",
        roll_number: r.roll_id,
        fabric_type_id: r.fabric_type_id,
        offset_type: r.offset_type,
        offset_product_id: parsed.offsetProductId
      });
    }
    console.log(`Generated ${createdOffsetRolls.length} offset rolls.`);

    // Finishing bundles: 10 entries (permutations of FABRIC, LAMINATION, OFFSET finish types)
    const finishTypes = ["FABRIC", "LAMINATION", "OFFSET", "FABRIC", "LAMINATION", "OFFSET", "FABRIC", "LAMINATION", "OFFSET", "FABRIC"];
    for (let i = 0; i < 10; i++) {
      const fType = finishTypes[i];
      const sourceLam = createdLaminationRolls[i % createdLaminationRolls.length];
      const sourceOffset = createdOffsetRolls[i % createdOffsetRolls.length];

      let bundleId = "";
      let sourceLamId = null;
      let sourceOffsetId = null;

      if (fType === "FABRIC") {
        bundleId = `PLAIN(${fabricType.fabric_name})`.toUpperCase();
      } else if (fType === "LAMINATION") {
        bundleId = sourceLam.roll_id.toUpperCase();
        sourceLamId = sourceLam.id;
      } else {
        bundleId = sourceOffset.roll_id.toUpperCase();
        sourceOffsetId = sourceOffset.id;
      }

      const { data: b, error: bErr } = await supabase.from("finishing_bundles").insert({
        bundle_id: bundleId,
        s_no: i + 1,
        finish_type: fType,
        source_lam_roll_id: sourceLamId,
        source_offset_roll_id: sourceOffsetId,
        fabric_type_id: fabricType.id,
        num_bags: 1000 + i * 100,
        weight_kg: 90 + i * 5,
        entry_date: todayStr,
        status: "available",
        created_by: userUuid,
        updated_by: userUuid
      }).select().single();
      if (bErr) throw new Error("FinishingBundle insert failed: " + bErr.message);
      createdFinishingBundles.push(b);

      const parsed = parseFinishingBundleId(b.bundle_id, createdFabricTypes, createdRotoProducts, createdOffsetProducts);
      rollsPool.push({
        ...b,
        department: "finishing",
        roll_number: b.bundle_id,
        finish_type: b.finish_type,
        fabric_type_id: b.fabric_type_id,
        lam_type: parsed.lamType,
        is_metallic: parsed.isMetallic,
        film_type: parsed.filmType,
        roto_product_id: parsed.rotoProductId,
        offset_type: parsed.offsetProductId ? "NW_LAM" : "none",
        offset_product_id: parsed.offsetProductId
      });
    }
    console.log(`Generated ${createdFinishingBundles.length} finishing bundles.`);

    // 3. Create Sales Order & Items with various department options (BOX, F_S, H_S, metallic, film gloss/matt)
    console.log("\nCreating Sales Order and Items for testing...");
    const { data: order, error: orderErr } = await supabase.from("sales_orders").insert({
      customer_id: childCustomer.id,
      order_date: todayStr,
      order_number: `SO-TEST-${suffix}`,
      status: "draft",
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (orderErr) throw new Error("SalesOrder insert failed: " + orderErr.message);
    createdOrders.push(order);

    const itemsToCreate = [
      // Fabric Item
      {
        sales_order_id: order.id,
        department: "fabric",
        product_id: fabricType.id,
        fabric_type_id: fabricType.id,
        quantity: 100,
        price: 200
      },
      // Roto Gloss Film Item
      {
        sales_order_id: order.id,
        department: "roto-printing",
        product_id: rotoProduct.id,
        roto_product_id: rotoProduct.id,
        film_type: "gloss",
        is_metallic: false,
        quantity: 150,
        price: 250
      },
      // Roto Metallic Matt Item
      {
        sales_order_id: order.id,
        department: "roto-printing",
        product_id: rotoProduct.id,
        roto_product_id: rotoProduct.id,
        film_type: "matt",
        is_metallic: true,
        quantity: 180,
        price: 320
      },
      // Lamination BOX Item
      {
        sales_order_id: order.id,
        department: "lamination",
        product_id: fabricType.id,
        fabric_type_id: fabricType.id,
        lamination_type: "BOX",
        roto_product_id: rotoProduct.id,
        film_type: "matt",
        is_metallic: true,
        quantity: 300,
        price: 400
      },
      // Lamination F_S Item
      {
        sales_order_id: order.id,
        department: "lamination",
        product_id: fabricType.id,
        fabric_type_id: fabricType.id,
        lamination_type: "F_S",
        roto_product_id: rotoProduct.id,
        film_type: "matt",
        is_metallic: true,
        quantity: 250,
        price: 380
      },
      // Lamination PLAIN Item
      {
        sales_order_id: order.id,
        department: "lamination",
        product_id: fabricType.id,
        fabric_type_id: fabricType.id,
        lamination_type: "PLAIN",
        quantity: 200,
        price: 350
      },
      // Offset FABRIC Item
      {
        sales_order_id: order.id,
        department: "offset-printing",
        product_id: offsetProduct.id,
        fabric_type_id: fabricType.id,
        offset_type: "FABRIC",
        offset_product_id: offsetProduct.id,
        quantity: 140,
        price: 220
      },
      // Finishing LAMINATION BOX Item
      {
        sales_order_id: order.id,
        department: "finishing",
        product_id: fabricType.id,
        fabric_type_id: fabricType.id,
        lamination_type: "BOX",
        roto_product_id: rotoProduct.id,
        film_type: "matt",
        is_metallic: true,
        quantity: 5000,
        price: 5
      }
    ];

    const { data: orderItems, error: itemsInsertErr } = await supabase.from("sales_order_items").insert(itemsToCreate).select();
    if (itemsInsertErr) throw new Error("Order items insert failed: " + itemsInsertErr.message);
    createdOrderItems.push(...orderItems);
    console.log(`Created ${orderItems.length} sales order items.`);

    // 4. Test Delivery Entry Matching Logic & Verify Lamination Roll Metadata
    console.log("\nVerifying property-based matching logic & Lamination Roll Metadata...");
    for (const item of orderItems) {
      const matched = testGetItemRolls(item, rollsPool);
      console.log(`Item (Dept: ${item.department}, LamType: ${item.lamination_type || "none"}, FilmType: ${item.film_type || "none"}): Matched ${matched.length} roll(s).`);
      
      // Verification: Make sure no mismatched roll is returned
      for (const mr of matched) {
        if (mr.department !== item.department) {
          throw new Error(`MATCH FAILURE: Department mismatch. Expected ${item.department}, got ${mr.department}`);
        }
        if (item.department === "fabric" && mr.fabric_type_id !== item.product_id) {
          throw new Error(`MATCH FAILURE: Fabric type mismatch.`);
        }
        if (item.department === "lamination") {
          if (mr.fabric_type_id !== item.fabric_type_id) throw new Error("MATCH FAILURE: Lamination fabric_type_id mismatch");
          if (mr.lam_type !== item.lamination_type) throw new Error("MATCH FAILURE: Lamination lam_type mismatch");
          
          // Verify Lamination Metadata presence (S.No, roll_id, weight_kg, meters)
          if (mr.s_no === undefined || mr.roll_id === undefined || mr.weight_kg === undefined || mr.meters === undefined) {
            throw new Error(`LAMINATION METADATA FAILURE: Roll ${mr.roll_number} missing S.No, roll_id, weight_kg, or meters fields!`);
          }
        }
      }
    }
    console.log("✅ Property-based matching logic & Lamination Roll Metadata successfully verified!");

    // 5. Test Accounting Journal Cases (Verify all 6 scenarios)
    console.log("\nVerifying accounting journal scenarios...");

    // Helper to generate unique journal_no
    async function getNextJournalNo() {
      const randStr = Math.random().toString().slice(2, 8);
      return `JV-${randStr}`;
    }

    // Helper to fetch journal logs created under a description prefix
    async function verifyJournalInserts(descriptionPrefix, expectedEntriesCount = 2) {
      const { data: journalRows, error } = await supabase
        .from("accounts_journal")
        .select("*")
        .ilike("description", `%${descriptionPrefix}%`)
        .is("deleted_at", null);
      
      if (error) throw error;
      if (journalRows.length !== expectedEntriesCount) {
        throw new Error(`Expected ${expectedEntriesCount} journal entry rows for "${descriptionPrefix}", but found ${journalRows.length}`);
      }
      
      for (const row of journalRows) {
        createdJournals.push(row);
      }
      return journalRows;
    }

    // --- Scenario 1: Zero-Value / Zero-Bill Dispatch (Should NOT create any journal entry) ---
    console.log("\nRunning Case 1: Zero-value billing (billNumber = '0' / billValue = 0)...");
    const { data: mockOrder1, error: mo1Err } = await supabase.from("sales_orders").insert({
      customer_id: childCustomer.id,
      order_date: todayStr,
      order_number: `SO-C1-${suffix}`,
      status: "confirmed",
      is_draft_billing: true,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo1Err) throw new Error("Mock order 1 insert failed: " + mo1Err.message);
    createdOrders.push(mockOrder1);

    // Call simulated zero billing
    await supabase.from("sales_orders").update({
      bill_number: "0",
      bill_value: 0,
      is_draft_billing: false,
    }).eq("id", mockOrder1.id);

    // Verify no journal entries exist
    const { data: c1Journals } = await supabase.from("accounts_journal").select("*").eq("description", `0 (SO:${mockOrder1.id})`);
    if (c1Journals && c1Journals.length > 0) {
      throw new Error("Case 1 Failed: Journal entries created for zero billing!");
    }
    console.log("✅ Case 1 Passed: Zero-value billing correctly bypassed journal entries creation.");


    // --- Scenario 2: Standard Billing (Billed directly, creates standard Debit Customer & Credit Sales journals) ---
    console.log("\nRunning Case 2: Standard Billing (billNumber !== '0', billValue > 0)...");
    const { data: mockOrder2, error: mo2Err } = await supabase.from("sales_orders").insert({
      customer_id: childCustomer.id,
      order_date: todayStr,
      order_number: `SO-C2-${suffix}`,
      status: "confirmed",
      is_draft_billing: true,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo2Err) throw new Error("Mock order 2 insert failed: " + mo2Err.message);
    createdOrders.push(mockOrder2);

    const billNo2 = `BILL-C2-${suffix}`;
    const billValue2 = 45000;
    const jNo2 = await getNextJournalNo();

    const standardInserts = [
      {
        journal_no: jNo2,
        entry_date: todayStr,
        account_id: childCustomer.id,
        account_name: childCustomer.customer_name,
        entry_type: "debit",
        amount: billValue2,
        description: `${billNo2} (SO:${mockOrder2.id})`,
        created_by: userUuid,
        updated_by: userUuid
      },
      {
        journal_no: jNo2,
        entry_date: todayStr,
        account_id: salesAc.id,
        account_name: "Sales A/c",
        entry_type: "credit",
        amount: billValue2,
        description: `${billNo2} (${childCustomer.customer_name}) (SO:${mockOrder2.id})`,
        created_by: userUuid,
        updated_by: userUuid
      }
    ];

    await supabase.from("accounts_journal").insert(standardInserts);
    await supabase.from("sales_orders").update({
      bill_number: billNo2,
      bill_value: billValue2,
      is_draft_billing: false
    }).eq("id", mockOrder2.id);

    const j2Logs = await verifyJournalInserts(billNo2, 2);
    const debitRow2 = j2Logs.find(r => r.entry_type === "debit");
    const creditRow2 = j2Logs.find(r => r.entry_type === "credit");
    if (debitRow2.amount !== billValue2 || creditRow2.amount !== billValue2) {
      throw new Error("Case 2 Failed: Incorrect standard journal billing values.");
    }
    console.log("✅ Case 2 Passed: Standard billing journals created accurately.");


    // --- Scenario 3: Reference Account - Positive Balance (calculatedTotal > billValue) ---
    // Action: Debit Parent (Reference Account), Credit Sales A/c for difference
    console.log("\nRunning Case 3: Reference Account with Positive Balance difference...");
    const { data: mockOrder3, error: mo3Err } = await supabase.from("sales_orders").insert({
      customer_id: childCustomer.id,
      order_date: todayStr,
      order_number: `SO-C3-${suffix}`,
      status: "confirmed",
      bill_number: `BILL-C3-${suffix}`,
      bill_value: 30000,
      is_draft_billing: false,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo3Err) throw new Error("Mock order 3 insert failed: " + mo3Err.message);
    createdOrders.push(mockOrder3);

    // Calculated total: 35000 (meaning positive balance diff = 5000)
    const calculatedTotal3 = 35000;
    const balanceDiff3 = calculatedTotal3 - mockOrder3.bill_value; // 5000
    const jNo3 = await getNextJournalNo();

    const c3Inserts = [
      {
        journal_no: jNo3,
        entry_date: todayStr,
        account_id: parentCustomer.id,
        account_name: parentCustomer.customer_name,
        entry_type: "debit",
        amount: balanceDiff3,
        description: `Balance adjustment for Dispatch ${mockOrder3.order_number} (Bill ${mockOrder3.bill_number}) (${childCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      },
      {
        journal_no: jNo3,
        entry_date: todayStr,
        account_id: salesAc.id,
        account_name: "Sales A/c",
        entry_type: "credit",
        amount: balanceDiff3,
        description: `Balance adjustment for Dispatch ${mockOrder3.order_number} (Bill ${mockOrder3.bill_number}) (${childCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      }
    ];

    await supabase.from("accounts_journal").insert(c3Inserts);
    const j3Logs = await verifyJournalInserts(`Balance adjustment for Dispatch ${mockOrder3.order_number}`, 2);
    const debitRow3 = j3Logs.find(r => r.entry_type === "debit");
    const creditRow3 = j3Logs.find(r => r.entry_type === "credit");
    if (debitRow3.account_id !== parentCustomer.id || debitRow3.amount !== balanceDiff3) {
      throw new Error("Case 3 Failed: Debit account should be Parent (Reference Account) with the difference value.");
    }
    if (creditRow3.account_id !== salesAc.id || creditRow3.amount !== balanceDiff3) {
      throw new Error("Case 3 Failed: Credit account should be Sales A/c.");
    }
    console.log("✅ Case 3 Passed: Reference account positive balance adjustment completed successfully.");


    // --- Scenario 4: Reference Account - Negative Balance (calculatedTotal < billValue) ---
    // Action: Debit Sales A/c, Credit Parent (Reference Account) for difference
    console.log("\nRunning Case 4: Reference Account with Negative Balance difference...");
    const { data: mockOrder4, error: mo4Err } = await supabase.from("sales_orders").insert({
      customer_id: childCustomer.id,
      order_date: todayStr,
      order_number: `SO-C4-${suffix}`,
      status: "confirmed",
      bill_number: `BILL-C4-${suffix}`,
      bill_value: 50000,
      is_draft_billing: false,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo4Err) throw new Error("Mock order 4 insert failed: " + mo4Err.message);
    createdOrders.push(mockOrder4);

    // Calculated total: 42000 (negative balance diff = 8000)
    const calculatedTotal4 = 42000;
    const balanceDiff4 = Math.abs(calculatedTotal4 - mockOrder4.bill_value); // 8000
    const jNo4 = await getNextJournalNo();

    const c4Inserts = [
      {
        journal_no: jNo4,
        entry_date: todayStr,
        account_id: salesAc.id,
        account_name: "Sales A/c",
        entry_type: "debit",
        amount: balanceDiff4,
        description: `Balance adjustment for Dispatch ${mockOrder4.order_number} (Bill ${mockOrder4.bill_number}) (${childCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      },
      {
        journal_no: jNo4,
        entry_date: todayStr,
        account_id: parentCustomer.id,
        account_name: parentCustomer.customer_name,
        entry_type: "credit",
        amount: balanceDiff4,
        description: `Balance adjustment for Dispatch ${mockOrder4.order_number} (Bill ${mockOrder4.bill_number}) (${childCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      }
    ];

    await supabase.from("accounts_journal").insert(c4Inserts);
    const j4Logs = await verifyJournalInserts(`Balance adjustment for Dispatch ${mockOrder4.order_number}`, 2);
    const debitRow4 = j4Logs.find(r => r.entry_type === "debit");
    const creditRow4 = j4Logs.find(r => r.entry_type === "credit");
    if (debitRow4.account_id !== salesAc.id || debitRow4.amount !== balanceDiff4) {
      throw new Error("Case 4 Failed: Debit account should be Sales A/c.");
    }
    if (creditRow4.account_id !== parentCustomer.id || creditRow4.amount !== balanceDiff4) {
      throw new Error("Case 4 Failed: Credit account should be Parent with the difference value.");
    }
    console.log("✅ Case 4 Passed: Reference account negative balance adjustment completed successfully.");


    // --- Scenario 5: NO Reference Account - Positive Balance (calculatedTotal > billValue) ---
    // Action: Debit Customer (Client), Credit Sales A/c
    console.log("\nRunning Case 5: Standalone Customer (No Reference Account) with Positive Balance...");
    const { data: mockOrder5, error: mo5Err } = await supabase.from("sales_orders").insert({
      customer_id: standaloneCustomer.id,
      order_date: todayStr,
      order_number: `SO-C5-${suffix}`,
      status: "confirmed",
      bill_number: `BILL-C5-${suffix}`,
      bill_value: 20000,
      is_draft_billing: false,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo5Err) throw new Error("Mock order 5 insert failed: " + mo5Err.message);
    createdOrders.push(mockOrder5);

    // Calculated total: 25000 (positive balance diff = 5000)
    const calculatedTotal5 = 25000;
    const balanceDiff5 = calculatedTotal5 - mockOrder5.bill_value; // 5000
    const jNo5 = await getNextJournalNo();

    const c5Inserts = [
      {
        journal_no: jNo5,
        entry_date: todayStr,
        account_id: standaloneCustomer.id,
        account_name: standaloneCustomer.customer_name,
        entry_type: "debit",
        amount: balanceDiff5,
        description: `Balance adjustment for Dispatch ${mockOrder5.order_number} (Bill ${mockOrder5.bill_number})`,
        created_by: userUuid,
        updated_by: userUuid
      },
      {
        journal_no: jNo5,
        entry_date: todayStr,
        account_id: salesAc.id,
        account_name: "Sales A/c",
        entry_type: "credit",
        amount: balanceDiff5,
        description: `Balance adjustment for Dispatch ${mockOrder5.order_number} (Bill ${mockOrder5.bill_number}) (${standaloneCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      }
    ];

    await supabase.from("accounts_journal").insert(c5Inserts);
    const j5Logs = await verifyJournalInserts(`Balance adjustment for Dispatch ${mockOrder5.order_number}`, 2);
    const debitRow5 = j5Logs.find(r => r.entry_type === "debit");
    const creditRow5 = j5Logs.find(r => r.entry_type === "credit");
    if (debitRow5.account_id !== standaloneCustomer.id || debitRow5.amount !== balanceDiff5) {
      throw new Error("Case 5 Failed: Debit account should be Client.");
    }
    if (creditRow5.account_id !== salesAc.id || creditRow5.amount !== balanceDiff5) {
      throw new Error("Case 5 Failed: Credit account should be Sales A/c.");
    }
    console.log("✅ Case 5 Passed: Standalone positive balance adjustment completed successfully.");


    // --- Scenario 6: NO Reference Account - Negative Balance (calculatedTotal < billValue) ---
    // Action: Debit Sales A/c, Credit Customer (Client)
    console.log("\nRunning Case 6: Standalone Customer (No Reference Account) with Negative Balance...");
    const { data: mockOrder6, error: mo6Err } = await supabase.from("sales_orders").insert({
      customer_id: standaloneCustomer.id,
      order_date: todayStr,
      order_number: `SO-C6-${suffix}`,
      status: "confirmed",
      bill_number: `BILL-C6-${suffix}`,
      bill_value: 60000,
      is_draft_billing: false,
      gst_rate: 18,
      created_by: userUuid,
      updated_by: userUuid
    }).select().single();
    if (mo6Err) throw new Error("Mock order 6 insert failed: " + mo6Err.message);
    createdOrders.push(mockOrder6);

    // Calculated total: 55000 (negative balance diff = 5000)
    const calculatedTotal6 = 55000;
    const balanceDiff6 = Math.abs(calculatedTotal6 - mockOrder6.bill_value); // 5000
    const jNo6 = await getNextJournalNo();

    const c6Inserts = [
      {
        journal_no: jNo6,
        entry_date: todayStr,
        account_id: salesAc.id,
        account_name: "Sales A/c",
        entry_type: "debit",
        amount: balanceDiff6,
        description: `Balance adjustment for Dispatch ${mockOrder6.order_number} (Bill ${mockOrder6.bill_number}) (${standaloneCustomer.customer_name})`,
        created_by: userUuid,
        updated_by: userUuid
      },
      {
        journal_no: jNo6,
        entry_date: todayStr,
        account_id: standaloneCustomer.id,
        account_name: standaloneCustomer.customer_name,
        entry_type: "credit",
        amount: balanceDiff6,
        description: `Balance adjustment for Dispatch ${mockOrder6.order_number} (Bill ${mockOrder6.bill_number})`,
        created_by: userUuid,
        updated_by: userUuid
      }
    ];

    await supabase.from("accounts_journal").insert(c6Inserts);
    const j6Logs = await verifyJournalInserts(`Balance adjustment for Dispatch ${mockOrder6.order_number}`, 2);
    const debitRow6 = j6Logs.find(r => r.entry_type === "debit");
    const creditRow6 = j6Logs.find(r => r.entry_type === "credit");
    if (debitRow6.account_id !== salesAc.id || debitRow6.amount !== balanceDiff6) {
      throw new Error("Case 6 Failed: Debit account should be Sales A/c.");
    }
    if (creditRow6.account_id !== standaloneCustomer.id || creditRow6.amount !== balanceDiff6) {
      throw new Error("Case 6 Failed: Credit account should be Client.");
    }
    console.log("✅ Case 6 Passed: Standalone negative balance adjustment completed successfully.");

    console.log("\n🎉 ALL 6 ACCOUNTING SCENARIOS AND LAMINATION ROLL DETAILS INTEGRATION TESTS PASSED SUCCESSFULLY!");

  } catch (error) {
    console.error("\n❌ COMPREHENSIVE INTEGRATION TEST SUITE FAILED:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    // 6. Absolute Clean up of all mock database entities
    await cleanup();
  }
}

run();
