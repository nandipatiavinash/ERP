import { createClient } from "@supabase/supabase-js";
import fs from "fs";

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
const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2ETest() {
  console.log("=================================================");
  console.log("🚀 END-TO-END PRODUCT PURCHASE & ACCOUNTS/STOCK VERIFICATION");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. Fetch catalog data
  const [
    { data: customers },
    { data: fabricTypes },
    { data: rotoProducts },
  ] = await Promise.all([
    supabase.from("customers").select("id, customer_name").eq("status", "active").limit(5),
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").limit(5),
    supabase.from("roto_products").select("id, brand").eq("status", "active").limit(5),
  ]);

  const supplier = customers[0];
  const fabric = fabricTypes[0];
  const roto = rotoProducts[0];
  const today = new Date().toISOString().split("T")[0];
  const testBillNo = `E2E-BILL-${Date.now()}`;
  const testAmount = 54321;

  console.log(`📋 Test Context:`);
  console.log(`   - Supplier: ${supplier.customer_name}`);
  console.log(`   - Bill No: ${testBillNo}`);
  console.log(`   - Bill Amount: ₹${testAmount}\n`);

  let purchaseId = null;
  let fabStockId = null;
  let rotoStockId = null;
  let journalNo = null;

  try {
    // ---------------------------------------------------------
    // STEP 1: CREATE PRODUCT PURCHASE HEADER
    // ---------------------------------------------------------
    console.log("📍 STEP 1: Creating Product Purchase Header");
    const { data: purchase, error: pErr } = await supabase
      .from("product_purchases")
      .insert({
        purchase_date: today,
        supplier_name: supplier.customer_name,
        bill_number: testBillNo,
        total_amount: testAmount,
        remarks: "Full E2E verification test",
      })
      .select()
      .single();

    if (pErr || !purchase) throw new Error(`Purchase header insert failed: ${pErr?.message}`);
    purchaseId = purchase.id;
    console.log(`   ✅ Header created with ID: ${purchaseId}`);

    // ---------------------------------------------------------
    // STEP 2: CREATE FABRIC ROLL STOCK & ITEM
    // ---------------------------------------------------------
    console.log("\n📍 STEP 2: Creating Fabric Purchase Item & Stock Roll");
    const { count: eCount } = await supabase
      .from("fabric_rolls")
      .select("id", { count: "exact", head: true })
      .like("roll_number", "E-%")
      .is("deleted_at", null);
    const rollNo = `E-${(eCount ?? 0) + 1}`;

    const { data: fabStock, error: fsErr } = await supabase
      .from("fabric_rolls")
      .insert({
        roll_number: rollNo,
        fabric_type_id: fabric.id,
        weight: 95.5,
        meters: 250,
        production_date: today,
        status: "available",
        current_stage: "loom",
      })
      .select()
      .single();

    if (fsErr || !fabStock) throw new Error(`Fabric stock roll insert failed: ${fsErr?.message}`);
    fabStockId = fabStock.id;

    await supabase.from("product_purchase_items").insert({
      purchase_id: purchaseId,
      department: "fabric",
      fabric_type_id: fabric.id,
      quantity: 250,
      weight: 95.5,
      rate: 0,
      amount: 0,
      created_stock_id: fabStockId,
    });

    console.log(`   ✅ Fabric stock created: Roll Number "${fabStock.roll_number}" (Status: ${fabStock.status}, Meters: ${fabStock.meters})`);

    // ---------------------------------------------------------
    // STEP 3: CREATE ROTO PRINTING STOCK & ITEM
    // ---------------------------------------------------------
    console.log("\n📍 STEP 3: Creating Roto Printing Purchase Item & Stock Roll");
    const rotoId = `${roto.brand.trim()}(G)`.toUpperCase();
    const { data: rotoStock, error: rsErr } = await supabase
      .from("roto_film_rolls")
      .insert({
        roll_id: rotoId,
        s_no: 1,
        brand_id: roto.id,
        film_type: "gloss",
        weight_kg: 110.0,
        meters: 2000,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (rsErr || !rotoStock) throw new Error(`Roto stock roll insert failed: ${rsErr?.message}`);
    rotoStockId = rotoStock.id;

    await supabase.from("product_purchase_items").insert({
      purchase_id: purchaseId,
      department: "roto-printing",
      roto_product_id: roto.id,
      film_type: "gloss",
      quantity: 2000,
      weight: 110.0,
      rate: 0,
      amount: 0,
      created_stock_id: rotoStockId,
    });

    console.log(`   ✅ Roto stock created: Roll ID "${rotoStock.roll_id}" (Status: ${rotoStock.status}, Weight: ${rotoStock.weight_kg}kg)`);

    // ---------------------------------------------------------
    // STEP 4: VERIFY STOCK AVAILABILITY IN STOCK REGISTERS
    // ---------------------------------------------------------
    console.log("\n📍 STEP 4: Verifying Stock Register Visibility");
    const { data: fabStockCheck } = await supabase
      .from("fabric_rolls")
      .select("id, roll_number, status")
      .eq("id", fabStockId)
      .single();

    const { data: rotoStockCheck } = await supabase
      .from("roto_film_rolls")
      .select("id, roll_id, status")
      .eq("id", rotoStockId)
      .single();

    if (fabStockCheck?.status === "available" && rotoStockCheck?.status === "available") {
      console.log(`   ✅ PASS: Both Fabric (${fabStockCheck.roll_number}) and Roto (${rotoStockCheck.roll_id}) are active and 'available' in stock registers.`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Stock register verification failed.`);
      failed++;
    }

    // ---------------------------------------------------------
    // STEP 5: CREATE & VERIFY ACCOUNTS JOURNAL ENTRIES
    // ---------------------------------------------------------
    console.log("\n📍 STEP 5: Creating & Verifying Accounts Journal Entries");
    journalNo = `JRN-E2E-${Date.now()}`;
    const journalEntries = [
      {
        journal_no: journalNo,
        entry_date: today,
        account_name: "Purchase A/c",
        entry_type: "debit",
        amount: testAmount,
        description: `Product Purchase: ${testBillNo} (${supplier.customer_name}) (PP:${purchaseId})`,
      },
      {
        journal_no: journalNo,
        entry_date: today,
        account_id: supplier.id,
        account_name: supplier.customer_name,
        entry_type: "credit",
        amount: testAmount,
        description: `Product Purchase: ${testBillNo} (PP:${purchaseId})`,
      },
    ];

    const { data: jrnRows, error: jErr } = await supabase.from("accounts_journal").insert(journalEntries).select();
    if (jErr || !jrnRows) throw new Error(`Journal insert failed: ${jErr?.message}`);

    // Verify journal query for Supplier Ledger
    const { data: supplierLedgerCheck } = await supabase
      .from("accounts_journal")
      .select("*")
      .eq("account_id", supplier.id)
      .eq("journal_no", journalNo)
      .single();

    if (supplierLedgerCheck && supplierLedgerCheck.amount === testAmount && supplierLedgerCheck.entry_type === "credit") {
      console.log(`   ✅ PASS: Credit of ₹${supplierLedgerCheck.amount} posted to Supplier (${supplier.customer_name}) Ledger under Journal #${journalNo}`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Supplier ledger journal verification failed.`);
      failed++;
    }

    // ---------------------------------------------------------
    // STEP 6: CLEANUP / ROLLBACK VERIFICATION
    // ---------------------------------------------------------
    console.log("\n📍 STEP 6: Cleaning up test purchase, stock, and journal entries...");
    await supabase.from("product_purchases").delete().eq("id", purchaseId);
    await supabase.from("fabric_rolls").delete().eq("id", fabStockId);
    await supabase.from("roto_film_rolls").delete().eq("id", rotoStockId);
    await supabase.from("accounts_journal").delete().eq("journal_no", journalNo);
    console.log("   ✅ Cleanup complete.");

  } catch (error) {
    console.error(`\n❌ E2E FAILURE:`, error.message || error);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`🏁 E2E VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) process.exit(1);
}

runE2ETest();
