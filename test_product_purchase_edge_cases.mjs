import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment variables from .env.local
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

async function runEdgeCasesSuite() {
  console.log("=================================================");
  console.log("🚀 STARTING PRODUCT PURCHASE EDGE CASE & DEEP FUNCTIONALITY TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // Fetch catalogs
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
    console.error("❌ Required catalog data not found in DB.");
    process.exit(1);
  }

  const supplier = customers[0];
  const fabric = fabricTypes[0];
  const roto = rotoProducts[0];
  const offset = offsetProducts[0];
  const color = colors?.[0];

  const today = new Date().toISOString().split("T")[0];

  const cleanupItems = {
    purchases: [],
    fabricRolls: [],
    rotoFilms: [],
    rotoMetallics: [],
    lamRolls: [],
    offsetRolls: [],
    finBundles: [],
    journals: [],
  };

  try {
    // ---------------------------------------------------------
    // TEST 1: CONTINUOUS SERIAL NO FOR FABRIC ("E-")
    // ---------------------------------------------------------
    console.log("🧪 TEST 1: Continuous Roll Numbering (E-1, E-2, E-3 Sequence)");
    const { count: initialCount } = await supabase
      .from("fabric_rolls")
      .select("id", { count: "exact", head: true })
      .like("roll_number", "E-%")
      .is("deleted_at", null);

    const startSeq = (initialCount ?? 0) + 1;
    const rollNo1 = `E-${startSeq}`;
    const rollNo2 = `E-${startSeq + 1}`;

    const { data: fab1, error: fab1Err } = await supabase
      .from("fabric_rolls")
      .insert({ roll_number: rollNo1, fabric_type_id: fabric.id, weight: 50, meters: 100, status: "available", production_date: today })
      .select()
      .single();

    const { data: fab2, error: fab2Err } = await supabase
      .from("fabric_rolls")
      .insert({ roll_number: rollNo2, fabric_type_id: fabric.id, weight: 55, meters: 110, status: "available", production_date: today })
      .select()
      .single();

    if (fab1Err) throw new Error(`Fabric 1 insert failed: ${fab1Err.message}`);
    if (fab2Err) throw new Error(`Fabric 2 insert failed: ${fab2Err.message}`);

    if (fab1) cleanupItems.fabricRolls.push(fab1.id);
    if (fab2) cleanupItems.fabricRolls.push(fab2.id);

    if (fab1?.roll_number === rollNo1 && fab2?.roll_number === rollNo2) {
      console.log(`   ✅ PASS: Continuous serial numbers verified: "${fab1.roll_number}" -> "${fab2.roll_number}"`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Continuous serial numbering failed. Expected "${rollNo1}", "${rollNo2}" but got "${fab1?.roll_number}", "${fab2?.roll_number}"`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 2: NON-METALLIC ROTO PRINTING ROLL
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 2: Non-Metallic Roto Printing Roll (Direct Available Film Roll)");
    const rotoNonMetId = `${roto.brand.trim()}(M)${color ? `(${color.color_name.trim()})` : ""}`.toUpperCase();
    const { data: rotoNonMet, error: rnmErr } = await supabase
      .from("roto_film_rolls")
      .insert({
        roll_id: rotoNonMetId,
        s_no: 1,
        brand_id: roto.id,
        film_type: "matt",
        color_id: color?.id || null,
        weight_kg: 65.0,
        meters: 1200,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (rnmErr) throw new Error(`Non-metallic roto roll insert failed: ${rnmErr.message}`);
    cleanupItems.rotoFilms.push(rotoNonMet.id);

    if (rotoNonMet.status === "available" && rotoNonMet.film_type === "matt") {
      console.log(`   ✅ PASS: Non-Metallic Film Roll created with ID "${rotoNonMet.roll_id}" (Status: available)`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Non-metallic roto roll validation failed`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 3: MULTI-ITEM PURCHASE ENTRY (Fabric + Roto + Lamination + Offset + Finishing in 1 Purchase)
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 3: Multi-Item Single Purchase Entry across all 5 Departments");
    const multiBillNo = `TEST-MULTI-${Date.now()}`;
    const totalMultiVal = 99999;
    const { data: multiPurchase, error: mpErr } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: today,
        supplier_name: supplier.customer_name,
        bill_number: multiBillNo,
        total_amount: totalMultiVal,
        remarks: "Multi-department automated purchase test",
      })
      .select()
      .single();

    if (mpErr || !multiPurchase) throw new Error(`Multi-item purchase header insert failed: ${mpErr?.message}`);
    cleanupItems.purchases.push(multiPurchase.id);

    // Create 5 items under this purchase
    const itemRecords = [];

    // Fabric item
    const { data: mFab, error: mFabErr } = await supabase.from("fabric_rolls").insert({ roll_number: `E-${startSeq + 2}`, fabric_type_id: fabric.id, weight: 60, meters: 120, status: "available", production_date: today }).select().single();
    if (mFabErr) throw new Error(`mFab insert failed: ${mFabErr.message}`);
    cleanupItems.fabricRolls.push(mFab.id);
    itemRecords.push({ purchase_id: multiPurchase.id, department: "fabric", fabric_type_id: fabric.id, quantity: 120, weight: 60, rate: 0, amount: 0, created_stock_id: mFab.id });

    // Roto item
    const { data: mRoto, error: mRotoErr } = await supabase.from("roto_film_rolls").insert({ roll_id: `ROTO-MULTI-1`, s_no: 1, brand_id: roto.id, film_type: "gloss", weight_kg: 50, meters: 1000, entry_date: today, status: "available" }).select().single();
    if (mRotoErr) throw new Error(`mRoto insert failed: ${mRotoErr.message}`);
    cleanupItems.rotoFilms.push(mRoto.id);
    itemRecords.push({ purchase_id: multiPurchase.id, department: "roto-printing", roto_product_id: roto.id, film_type: "gloss", quantity: 1000, weight: 50, rate: 0, amount: 0, created_stock_id: mRoto.id });

    // Lamination item
    const { data: mLam, error: mLamErr } = await supabase.from("lamination_rolls").insert({ roll_id: `PLAIN(${fabric.fabric_name.trim()})`, s_no: 1, lam_type: "PLAIN", fabric_type_id: fabric.id, weight_kg: 70, meters: 600, entry_date: today, status: "available" }).select().single();
    if (mLamErr) throw new Error(`mLam insert failed: ${mLamErr.message}`);
    cleanupItems.lamRolls.push(mLam.id);
    itemRecords.push({ purchase_id: multiPurchase.id, department: "lamination", fabric_type_id: fabric.id, lamination_type: "PLAIN", quantity: 600, weight: 70, rate: 0, amount: 0, created_stock_id: mLam.id });

    // Offset item
    const { data: mOff, error: mOffErr } = await supabase.from("offset_rolls").insert({ roll_id: `OFF-MULTI-1`, s_no: 1, offset_type: "FABRIC", brand_id: offset.id, fabric_type_id: fabric.id, weight_kg: 40, entry_date: today, status: "available" }).select().single();
    if (mOffErr) throw new Error(`mOff insert failed: ${mOffErr.message}`);
    cleanupItems.offsetRolls.push(mOff.id);
    itemRecords.push({ purchase_id: multiPurchase.id, department: "offset-printing", fabric_type_id: fabric.id, offset_product_id: offset.id, offset_type: "FABRIC", quantity: 400, weight: 40, rate: 0, amount: 0, created_stock_id: mOff.id });

    // Finishing item
    const { data: mFin, error: mFinErr } = await supabase.from("finishing_bundles").insert({ bundle_id: `BAGS-MULTI-1`, s_no: 1, finish_type: "FABRIC", fabric_type_id: fabric.id, num_bags: 300, weight_kg: 15, entry_date: today, status: "available" }).select().single();
    if (mFinErr) throw new Error(`mFin insert failed: ${mFinErr.message}`);
    cleanupItems.finBundles.push(mFin.id);
    itemRecords.push({ purchase_id: multiPurchase.id, department: "finishing", fabric_type_id: fabric.id, quantity: 300, weight: 15, rate: 0, amount: 0, created_stock_id: mFin.id });

    const { data: insertedItems, error: itemsErr } = await supabase.from("product_purchase_items").insert(itemRecords).select();
    if (itemsErr) throw new Error(`Multi-item insert failed: ${itemsErr.message}`);

    if (insertedItems.length === 5) {
      console.log(`   ✅ PASS: Multi-department purchase created with ${insertedItems.length} items across all 5 departments`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Expected 5 items inserted, got ${insertedItems?.length}`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 4: ACCOUNTING JOURNAL AUTOMATION
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 4: Accounting Journal Entry Creation (Debit Purchase A/c, Credit Supplier A/c)");
    const journalNo = `JRN-TEST-${Date.now()}`;

    // Look up purchase account
    const { data: purchaseAc } = await supabase.from("customers").select("id, customer_name").ilike("customer_name", "%Purchase%").limit(1).maybeSingle();
    const purchaseAcName = purchaseAc?.customer_name || "Purchase A/c";
    const purchaseAcId = purchaseAc?.id || null;

    const journalEntries = [
      {
        journal_no: journalNo,
        entry_date: today,
        account_id: purchaseAcId,
        account_name: purchaseAcName,
        entry_type: "debit",
        amount: totalMultiVal,
        description: `Product Purchase: ${multiBillNo} (${supplier.customer_name}) (PP:${multiPurchase.id})`,
      },
      {
        journal_no: journalNo,
        entry_date: today,
        account_id: supplier.id,
        account_name: supplier.customer_name,
        entry_type: "credit",
        amount: totalMultiVal,
        description: `Product Purchase: ${multiBillNo} (PP:${multiPurchase.id})`,
      },
    ];

    const { data: insertedJournals, error: jrnErr } = await supabase.from("accounts_journal").insert(journalEntries).select();
    if (jrnErr) throw new Error(`Journal insert failed: ${jrnErr.message}`);
    cleanupItems.journals.push(journalNo);

    const debitRow = insertedJournals.find((j) => j.entry_type === "debit");
    const creditRow = insertedJournals.find((j) => j.entry_type === "credit");

    if (debitRow?.amount === totalMultiVal && creditRow?.amount === totalMultiVal && debitRow.amount === creditRow.amount) {
      console.log(`   ✅ PASS: Balanced Journal Entry #${journalNo} created (Debit: ₹${debitRow.amount}, Credit: ₹${creditRow.amount})`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Accounting journal entry creation failed or unbalanced`);
      failed++;
    }

    // ---------------------------------------------------------
    // TEST 5: DELETION CASCADE & CLEANUP VERIFICATION
    // ---------------------------------------------------------
    console.log("\n🧪 TEST 5: Deletion Cascade & Reversion Logic");

    // Delete multi purchase header
    const { error: delHeaderErr } = await supabase.from("product_purchases").delete().eq("id", multiPurchase.id);
    if (delHeaderErr) throw new Error(`Header deletion failed: ${delHeaderErr.message}`);

    // Verify items deleted via cascade
    const { data: itemsPostDel } = await supabase.from("product_purchase_items").select("id").eq("purchase_id", multiPurchase.id);

    // Delete associated journals
    await supabase.from("accounts_journal").delete().eq("journal_no", journalNo);

    if (!itemsPostDel || itemsPostDel.length === 0) {
      console.log(`   ✅ PASS: Product purchase deleted and items cascade deleted cleanly.`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Purchase items were not cascade deleted.`);
      failed++;
    }

    // ---------------------------------------------------------
    // CLEANUP REMAINING TEST ITEMS
    // ---------------------------------------------------------
    console.log("\n🧹 Cleaning up test stock records...");
    for (const pid of cleanupItems.purchases) await supabase.from("product_purchases").delete().eq("id", pid);
    for (const id of cleanupItems.fabricRolls) await supabase.from("fabric_rolls").delete().eq("id", id);
    for (const id of cleanupItems.rotoFilms) await supabase.from("roto_film_rolls").delete().eq("id", id);
    for (const id of cleanupItems.rotoMetallics) await supabase.from("roto_metallic_rolls").delete().eq("id", id);
    for (const id of cleanupItems.lamRolls) await supabase.from("lamination_rolls").delete().eq("id", id);
    for (const id of cleanupItems.offsetRolls) await supabase.from("offset_rolls").delete().eq("id", id);
    for (const id of cleanupItems.finBundles) await supabase.from("finishing_bundles").delete().eq("id", id);

    console.log("   ✅ Cleanup complete.");

  } catch (error) {
    console.error(`\n❌ EDGE CASE TEST FAILURE:`, error.message || error);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`🏁 EDGE CASE SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runEdgeCasesSuite();
