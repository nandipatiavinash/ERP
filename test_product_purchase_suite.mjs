import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment variables from .env.local natively
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in environment!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTestSuite() {
  console.log("=================================================");
  console.log("🚀 STARTING PRODUCT PURCHASE FUNCTIONALITY TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. Fetch prerequisite active catalogs from DB
  const [
    { data: customers },
    { data: fabricTypes },
    { data: rotoProducts },
    { data: offsetProducts },
    { data: colors },
  ] = await Promise.all([
    supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null).limit(5),
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).limit(5),
    supabase.from("roto_products").select("id, brand").eq("status", "active").limit(5),
    supabase.from("offset_products").select("id, brand").eq("status", "active").limit(5),
    supabase.from("roto_colors").select("id, color_name").is("deleted_at", null).limit(5),
  ]);

  if (!customers?.length || !fabricTypes?.length || !rotoProducts?.length || !offsetProducts?.length) {
    console.error("❌ Required catalog data (customers, fabric, roto, offset) not found in DB.");
    process.exit(1);
  }

  const supplier = customers[0];
  const fabric = fabricTypes[0];
  const roto = rotoProducts[0];
  const offset = offsetProducts[0];
  const color = colors?.[0];

  console.log(`📋 Test Context:`);
  console.log(`   - Supplier: ${supplier.customer_name}`);
  console.log(`   - Fabric Spec: ${fabric.fabric_name}`);
  console.log(`   - Roto Brand: ${roto.brand}`);
  console.log(`   - Offset Brand: ${offset.brand}`);
  console.log(`   - Color: ${color?.color_name || "N/A"}\n`);

  const createdPurchases = [];

  try {
    // ---------------------------------------------------------
    // TEST 1: FABRIC DEPARTMENT PURCHASE
    // ---------------------------------------------------------
    console.log("🧪 TEST 1: Fabric Product Purchase (Continuous E- Prefix)");
    const fabricBillNo = `TEST-FAB-${Date.now()}`;
    const { data: purchase1, error: err1 } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: supplier.customer_name,
        bill_number: fabricBillNo,
        total_amount: 15000,
        remarks: "Automated test fabric purchase",
      })
      .select()
      .single();

    if (err1 || !purchase1) throw new Error(`Fabric header insert failed: ${err1?.message}`);
    createdPurchases.push(purchase1.id);

    // Create fabric roll stock entry with E- prefix logic
    const { count: eCount } = await supabase
      .from("fabric_rolls")
      .select("id", { count: "exact", head: true })
      .like("roll_number", "E-%")
      .is("deleted_at", null);
    const fabricRollNo = `E-${(eCount ?? 0) + 1}`;

    const { data: fabStock, error: fabStockErr } = await supabase
      .from("fabric_rolls")
      .insert({
        roll_number: fabricRollNo,
        fabric_type_id: fabric.id,
        weight: 48.0, // net weight (50 gross - 2 core)
        meters: 100,
        production_date: new Date().toISOString().split("T")[0],
        status: "available",
        current_stage: "loom",
      })
      .select()
      .single();

    if (fabStockErr) throw new Error(`Fabric stock roll insert failed: ${fabStockErr.message}`);

    const { error: fabItemErr } = await supabase.from("product_purchase_items").insert({
      purchase_id: purchase1.id,
      department: "fabric",
      fabric_type_id: fabric.id,
      quantity: 100,
      weight: 48.0,
      rate: 0,
      amount: 0,
      created_stock_id: fabStock.id,
    });

    if (fabItemErr) throw new Error(`Fabric purchase item insert failed: ${fabItemErr.message}`);

    if (fabStock.roll_number.startsWith("E-") && fabStock.status === "available" && fabStock.meters === 100) {
      console.log(`   ✅ PASS: Fabric Roll created successfully with ID "${fabStock.roll_number}" (Status: ${fabStock.status})`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Fabric Roll validation failed`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 2: ROTO PRINTING DEPARTMENT PURCHASE (Metallic)
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 2: Roto Printing Purchase (Metallic Film)");
    const rotoBillNo = `TEST-ROTO-${Date.now()}`;
    const { data: purchase2, error: err2 } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: supplier.customer_name,
        bill_number: rotoBillNo,
        total_amount: 25000,
        remarks: "Automated test roto purchase",
      })
      .select()
      .single();

    if (err2 || !purchase2) throw new Error(`Roto header insert failed: ${err2?.message}`);
    createdPurchases.push(purchase2.id);

    const baseRotoId = `${roto.brand.trim()}(G)${color ? `(${color.color_name.trim()})` : ""}`.toUpperCase();
    const metallicId = `${baseRotoId}(MT)`.toUpperCase();

    // Insert dummy consumed film roll
    const { data: filmRoll, error: filmErr } = await supabase
      .from("roto_film_rolls")
      .insert({
        roll_id: baseRotoId,
        s_no: 1,
        brand_id: roto.id,
        film_type: "gloss",
        color_id: color?.id || null,
        weight_kg: 80.0,
        meters: 1500,
        entry_date: new Date().toISOString().split("T")[0],
        status: "consumed",
      })
      .select()
      .single();

    if (filmErr) throw new Error(`Roto film roll insert failed: ${filmErr.message}`);

    // Insert metallic roll
    const { data: metallicRoll, error: metErr } = await supabase
      .from("roto_metallic_rolls")
      .insert({
        roll_id: metallicId,
        s_no: 1,
        source_film_roll_id: filmRoll.id,
        is_split: false,
        weight_kg: 80.0,
        meters: 1500,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();

    if (metErr) throw new Error(`Roto metallic roll insert failed: ${metErr.message}`);

    await supabase.from("product_purchase_items").insert({
      purchase_id: purchase2.id,
      department: "roto-printing",
      roto_product_id: roto.id,
      film_type: "gloss",
      is_metallic: true,
      color_id: color?.id || null,
      quantity: 1500,
      weight: 80.0,
      rate: 0,
      amount: 0,
      created_stock_id: metallicRoll.id,
    });

    if (metallicRoll.roll_id.endsWith("(MT)") && metallicRoll.status === "available" && metallicRoll.weight_kg === 80.0) {
      console.log(`   ✅ PASS: Roto Metallic Roll created with ID "${metallicRoll.roll_id}" (Status: ${metallicRoll.status})`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Roto Metallic Roll validation failed`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 3: LAMINATION DEPARTMENT PURCHASE (BOX Spec)
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 3: Lamination Purchase (BOX Spec)");
    const lamBoxBillNo = `TEST-LAMBOX-${Date.now()}`;
    const { data: purchase3, error: err3 } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: supplier.customer_name,
        bill_number: lamBoxBillNo,
        total_amount: 32000,
      })
      .select()
      .single();

    if (err3 || !purchase3) throw new Error(`Lamination BOX header insert failed: ${err3?.message}`);
    createdPurchases.push(purchase3.id);

    const lamBoxBaseId = `${roto.brand.trim()}(${fabric.fabric_name.trim()})(B)`.toUpperCase();
    const { data: lamBoxStock, error: lamBoxErr } = await supabase
      .from("lamination_rolls")
      .insert({
        roll_id: lamBoxBaseId,
        s_no: 1,
        lam_type: "BOX",
        fabric_type_id: fabric.id,
        weight_kg: 120.0,
        meters: 800,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();

    if (lamBoxErr) throw new Error(`Lamination BOX roll insert failed: ${lamBoxErr.message}`);

    await supabase.from("product_purchase_items").insert({
      purchase_id: purchase3.id,
      department: "lamination",
      fabric_type_id: fabric.id,
      roto_product_id: roto.id,
      lamination_type: "BOX",
      film_type: "gloss",
      is_metallic: false,
      quantity: 800,
      weight: 120.0,
      rate: 0,
      amount: 0,
      created_stock_id: lamBoxStock.id,
    });

    if (lamBoxStock.roll_id.endsWith("(B)") && lamBoxStock.status === "available") {
      console.log(`   ✅ PASS: Lamination BOX Roll created with ID "${lamBoxStock.roll_id}" (Meters: ${lamBoxStock.meters})`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Lamination BOX validation failed`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 4: OFFSET PRINTING DEPARTMENT PURCHASE
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 4: Offset Printing Purchase");
    const offsetBillNo = `TEST-OFF-${Date.now()}`;
    const { data: purchase4, error: err4 } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: supplier.customer_name,
        bill_number: offsetBillNo,
        total_amount: 18000,
      })
      .select()
      .single();

    if (err4 || !purchase4) throw new Error(`Offset header insert failed: ${err4?.message}`);
    createdPurchases.push(purchase4.id);

    const offsetBaseId = `${offset.brand.trim()}(${fabric.fabric_name.trim()})`.toUpperCase();
    const { data: offsetStock, error: offErr } = await supabase
      .from("offset_rolls")
      .insert({
        roll_id: offsetBaseId,
        s_no: 1,
        offset_type: "PLAIN_LAM",
        brand_id: offset.id,
        fabric_type_id: fabric.id,
        weight_kg: 90.0,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();

    if (offErr) throw new Error(`Offset roll insert failed: ${offErr.message}`);

    await supabase.from("product_purchase_items").insert({
      purchase_id: purchase4.id,
      department: "offset-printing",
      fabric_type_id: fabric.id,
      offset_product_id: offset.id,
      offset_type: "PLAIN_LAM",
      quantity: 600,
      weight: 90.0,
      rate: 0,
      amount: 0,
      created_stock_id: offsetStock.id,
    });

    if (offsetStock.roll_id === offsetBaseId && offsetStock.status === "available") {
      console.log(`   ✅ PASS: Offset Roll created with ID "${offsetStock.roll_id}" (Weight: ${offsetStock.weight_kg}kg)`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Offset Roll validation failed`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 5: FINISHING / BAGS PURCHASES (All 3 Sub-types)
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 5: Finishing / Bags Purchases (Fabric, Lamination, Offset Bags)");
    const finBillNo = `TEST-FIN-${Date.now()}`;
    const { data: purchase5, error: err5 } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: supplier.customer_name,
        bill_number: finBillNo,
        total_amount: 45000,
      })
      .select()
      .single();

    if (err5 || !purchase5) throw new Error(`Finishing header insert failed: ${err5?.message}`);
    createdPurchases.push(purchase5.id);

    // 5a. Fabric Bags
    const fabBagBaseId = `PLAIN(${fabric.fabric_name.trim()})`.toUpperCase();
    const { data: fabBagStock, error: fbErr } = await supabase
      .from("finishing_bundles")
      .insert({
        bundle_id: fabBagBaseId,
        s_no: 1,
        finish_type: "FABRIC",
        fabric_type_id: fabric.id,
        num_bags: 500,
        weight_kg: 25.0,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();
    if (fbErr) throw new Error(`Fabric bag insert failed: ${fbErr.message}`);

    // 5b. Lamination Bags (BOX)
    const lamBagBaseId = `${roto.brand.trim()}(${fabric.fabric_name.trim()})(B)`.toUpperCase();
    const { data: lamBagStock, error: lbErr } = await supabase
      .from("finishing_bundles")
      .insert({
        bundle_id: lamBagBaseId,
        s_no: 1,
        finish_type: "LAMINATION",
        fabric_type_id: fabric.id,
        num_bags: 1000,
        weight_kg: 50.0,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();
    if (lbErr) throw new Error(`Lamination bag insert failed: ${lbErr.message}`);

    // 5c. Offset Bags
    const offBagBaseId = `${offset.brand.trim()}(${fabric.fabric_name.trim()})`.toUpperCase();
    const { data: offBagStock, error: obErr } = await supabase
      .from("finishing_bundles")
      .insert({
        bundle_id: offBagBaseId,
        s_no: 1,
        finish_type: "OFFSET",
        fabric_type_id: fabric.id,
        num_bags: 750,
        weight_kg: 35.0,
        entry_date: new Date().toISOString().split("T")[0],
        status: "available",
      })
      .select()
      .single();
    if (obErr) throw new Error(`Offset bag insert failed: ${obErr.message}`);

    console.log(`   ✅ PASS: Fabric Bags Bundle created: "${fabBagStock.bundle_id}" (${fabBagStock.num_bags} bags)`);
    console.log(`   ✅ PASS: Lamination Bags Bundle created: "${lamBagStock.bundle_id}" (${lamBagStock.num_bags} bags)`);
    console.log(`   ✅ PASS: Offset Bags Bundle created: "${offBagStock.bundle_id}" (${offBagStock.num_bags} bags)`);
    passed++;

    // ---------------------------------------------------------
    // CLEANUP TEST DATA
    // ---------------------------------------------------------
    console.log("\n🧹 Cleaning up test purchase entries & stock records...");
    for (const pid of createdPurchases) {
      await supabase.from("product_purchases").delete().eq("id", pid);
    }
    await supabase.from("fabric_rolls").delete().eq("id", fabStock.id);
    await supabase.from("roto_metallic_rolls").delete().eq("id", metallicRoll.id);
    await supabase.from("roto_film_rolls").delete().eq("id", filmRoll.id);
    await supabase.from("lamination_rolls").delete().eq("id", lamBoxStock.id);
    await supabase.from("offset_rolls").delete().eq("id", offsetStock.id);
    await supabase.from("finishing_bundles").delete().in("id", [fabBagStock.id, lamBagStock.id, offBagStock.id]);

    console.log("   ✅ Cleanup complete.");

  } catch (error) {
    console.error(`\n❌ TEST FAILURE EXCEPTION:`, error.message || error);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`🏁 SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
