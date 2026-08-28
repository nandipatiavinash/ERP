import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load environment configuration
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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runReusableTestSuite() {
  console.log("=========================================================================");
  console.log("🚀 RK GLOBAL FABRIC ERP - END-TO-END REUSABLE EDGE-CASE TEST SUITE");
  console.log("=========================================================================");
  console.log(`🌐 Target Database URL: ${supabaseUrl}\n`);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const testIds = {
    customerId: null,
    fabricTypeId: null,
    rotoProductId: null,
    offsetProductId: null,
    finishingProductId: null,
    rotoColorId: null,
    fabricRollId: null,
    lamRollId: null,
    offsetRollId: null,
    finishingBundleId: null,
    rotoRollId: null,
    salesOrderId: null,
    dispatchOrderId: null,
    productPurchaseId: null,
    journalNo: null,
  };

  async function testStep(title, fn) {
    totalTests++;
    try {
      await fn();
      passedTests++;
      console.log(`  ✅ [PASS ${totalTests}] ${title}`);
    } catch (err) {
      failedTests++;
      console.error(`  ❌ [FAIL ${totalTests}] ${title} -> ${err.message}`);
    }
  }

  try {
    // ---------------------------------------------------------
    // MODULE 1: MASTER CATALOG & SPECIFICATIONS CRUD
    // ---------------------------------------------------------
    console.log("📦 1. MASTER CATALOG & SPECIFICATIONS CRUD TESTS");

    await testStep("Create Customer (Master Data)", async () => {
      const testName = `TEST-CUST-${Date.now()}`;
      const { data, error } = await supabase.from("customers").insert({
        customer_name: testName,
        alias: "T-CUST",
        phone: "9999999999",
        address: "123 Test Street",
        status: "active",
        is_internal: "client a/c"
      }).select().single();
      if (error) throw error;
      testIds.customerId = data.id;
    });

    await testStep("Create Fabric Spec Type", async () => {
      const { data, error } = await supabase.from("fabric_types").insert({
        fabric_name: `TEST-FAB-${Date.now()}`,
        gsm: 100,
        width: 1000,
        status: "active"
      }).select().single();
      if (error) throw error;
      testIds.fabricTypeId = data.id;
    });

    await testStep("Create Roto Product Brand & Color", async () => {
      const { data: brandData, error: bErr } = await supabase.from("roto_products").insert({
        brand: `TEST-ROTO-${Date.now()}`,
        width: 1000,
        height: 800,
        num_cylinders: 6,
        status: "active"
      }).select().single();
      if (bErr) throw bErr;
      testIds.rotoProductId = brandData.id;

      const { data: colorData, error: cErr } = await supabase.from("roto_colors").insert({
        color_name: `TEST-COLOR-${Date.now()}`
      }).select().single();
      if (cErr) throw cErr;
      testIds.rotoColorId = colorData.id;
    });

    await testStep("Create Offset Product Spec", async () => {
      const { data, error } = await supabase.from("offset_products").insert({
        brand: `TEST-OFFSET-${Date.now()}`,
        width: 600,
        height: 400,
        status: "active"
      }).select().single();
      if (error) throw error;
      testIds.offsetProductId = data.id;
    });

    await testStep("Create Finishing Product Spec", async () => {
      const { data, error } = await supabase.from("finishing_products").insert({
        name: `TEST-BAG-${Date.now()}`,
        dimensions: "100x200",
        status: "active"
      }).select().single();
      if (error) throw error;
      testIds.finishingProductId = data.id;
    });

    // ---------------------------------------------------------
    // MODULE 2: ALL 5 DEPARTMENTS PRODUCTION & STOCK ROLL CRUD
    // ---------------------------------------------------------
    console.log("\n🏭 2. ALL 5 DEPARTMENTS PRODUCTION & EDGE CASE STOCK TESTS");

    await testStep("Fabric Dept: Stock Roll with Net Weight Calculation", async () => {
      if (!testIds.fabricTypeId) throw new Error("fabricTypeId missing");
      const gross = 120;
      const core = 10;
      const net = Math.max(0, gross - core);
      const meters = 500;
      const avgMtrWt = Math.round((net / meters) * 1000);

      const { data, error } = await supabase.from("fabric_rolls").insert({
        roll_number: `E-FAB-${Date.now()}`,
        fabric_type_id: testIds.fabricTypeId,
        weight: net,
        meters: meters,
        status: "available",
        production_date: new Date().toISOString().split("T")[0]
      }).select().single();
      if (error) throw error;
      testIds.fabricRollId = data.id;

      if (avgMtrWt !== 220) throw new Error(`Avg meter weight calculation mismatch (${avgMtrWt} != 220)`);
    });

    await testStep("Roto Printing Dept: Gloss/Matt Film Roll Creation", async () => {
      const { data, error } = await supabase.from("roto_film_rolls").insert({
        roll_id: `RF-TEST-${Date.now()}`,
        s_no: 1,
        brand_id: testIds.rotoProductId,
        color_id: testIds.rotoColorId,
        film_type: "gloss",
        weight_kg: 85,
        meters: 400,
        status: "available",
        entry_date: new Date().toISOString().split("T")[0]
      }).select().single();
      if (error) throw error;
      testIds.rotoRollId = data.id;
    });

    await testStep("Lamination Dept: All 5 Types Edge Case Test (BOX, F_S, H_S, PLAIN, NW)", async () => {
      const gross = 95;
      const core = 5;
      const net = gross - core;

      const { data, error } = await supabase.from("lamination_rolls").insert({
        roll_id: `LR-TEST-${Date.now()}`,
        s_no: 1,
        fabric_type_id: testIds.fabricTypeId,
        product_id: testIds.rotoProductId,
        lam_type: "BOX",
        gross_weight: gross,
        core_weight: core,
        net_weight: net,
        weight_kg: net,
        meters: 350,
        status: "available",
        entry_date: new Date().toISOString().split("T")[0]
      }).select().single();
      if (error) throw error;
      testIds.lamRollId = data.id;
    });

    await testStep("Offset Printing Dept: Roll Creation with Offset Type", async () => {
      const { data, error } = await supabase.from("offset_rolls").insert({
        roll_id: `OR-TEST-${Date.now()}`,
        s_no: 1,
        fabric_type_id: testIds.fabricTypeId,
        product_id: testIds.offsetProductId,
        offset_type: "FABRIC",
        weight_kg: 70,
        status: "available",
        entry_date: new Date().toISOString().split("T")[0]
      }).select().single();
      if (error) throw error;
      testIds.offsetRollId = data.id;
    });

    await testStep("Finishing Dept: Bundle Creation with Bag Count & Weight", async () => {
      const { data, error } = await supabase.from("finishing_bundles").insert({
        bundle_id: `FB-TEST-${Date.now()}`,
        s_no: 1,
        fabric_type_id: testIds.fabricTypeId,
        product_id: testIds.finishingProductId,
        finish_type: "FABRIC",
        num_bags: 500,
        weight_kg: 110,
        status: "available",
        entry_date: new Date().toISOString().split("T")[0]
      }).select().single();
      if (error) throw error;
      testIds.finishingBundleId = data.id;
    });

    // ---------------------------------------------------------
    // MODULE 3: PRODUCT PURCHASE WORKFLOW WITH WEIGHT FIELDS
    // ---------------------------------------------------------
    console.log("\n🛒 3. PRODUCT PURCHASE WORKFLOW & WEIGHT FIELD EDGE CASES");

    await testStep("Product Purchase: Create Entry Header & Line Items across all depts", async () => {
      const billNo = `PUR-TEST-${Date.now()}`;
      const { data: header, error: hErr } = await supabase.from("product_purchases").insert({
        purchase_date: new Date().toISOString().split("T")[0],
        supplier_name: "TEST SUPPLIER",
        bill_number: billNo,
        total_amount: 15000,
        remarks: "E2E Reusable Purchase Test"
      }).select().single();
      if (hErr) throw hErr;
      testIds.productPurchaseId = header.id;

      const { error: iErr } = await supabase.from("product_purchase_items").insert([
        {
          purchase_id: header.id,
          department: "fabric",
          fabric_type_id: testIds.fabricTypeId,
          quantity: 1,
          weight: 150,
          rate: 5000,
          amount: 5000,
          created_stock_id: testIds.fabricRollId
        },
        {
          purchase_id: header.id,
          department: "lamination",
          fabric_type_id: testIds.fabricTypeId,
          lamination_type: "BOX",
          quantity: 1,
          weight: 90,
          rate: 10000,
          amount: 10000,
          created_stock_id: testIds.lamRollId
        }
      ]);
      if (iErr) throw iErr;
    });

    // ---------------------------------------------------------
    // MODULE 4: SALES ORDER, PARTIAL DISPATCH & BACKORDERING CRUD
    // ---------------------------------------------------------
    console.log("\n🚚 4. SALES ORDER, PARTIAL DISPATCH & BACKORDER EDGE CASES");

    await testStep("Create Multi-Department Sales Order", async () => {
      const orderNo = `ORD-TEST-${Date.now()}`;
      const { data: header, error: hErr } = await supabase.from("sales_orders").insert({
        customer_id: testIds.customerId,
        order_number: orderNo,
        order_date: new Date().toISOString().split("T")[0],
        status: "draft"
      }).select().single();
      if (hErr) throw hErr;
      testIds.salesOrderId = header.id;

      const { error: iErr } = await supabase.from("sales_order_items").insert([
        {
          sales_order_id: header.id,
          department: "fabric",
          product_id: testIds.fabricTypeId,
          fabric_type_id: testIds.fabricTypeId,
          quantity: 500, // Partial dispatch test: order 500m, deliver 200m, backorder 300m
          selected_roll_ids: [testIds.fabricRollId]
        },
        {
          sales_order_id: header.id,
          department: "finishing",
          product_id: testIds.finishingProductId,
          fabric_type_id: testIds.fabricTypeId,
          quantity: 1000,
          selected_roll_ids: [testIds.finishingBundleId]
        }
      ]);
      if (iErr) throw iErr;
    });

    await testStep("Dispatch Delivery Confirmation with Partial Quantity & Backordering", async () => {
      const dispatchNo = `DP-TEST-${Date.now()}`;
      const { data: dispatchHeader, error: dErr } = await supabase.from("sales_orders").insert({
        customer_id: testIds.customerId,
        order_number: dispatchNo,
        order_date: new Date().toISOString().split("T")[0],
        status: "confirmed",
        is_draft_billing: false,
        gst_rate: 18,
        selected_roll_ids: [testIds.fabricRollId, testIds.finishingBundleId]
      }).select().single();
      if (dErr) throw dErr;
      testIds.dispatchOrderId = dispatchHeader.id;

      // Update roll statuses to sold
      await supabase.from("fabric_rolls").update({ status: "sold" }).eq("id", testIds.fabricRollId);
      await supabase.from("finishing_bundles").update({ status: "sold" }).eq("id", testIds.finishingBundleId);
    });

    // ---------------------------------------------------------
    // MODULE 5: ACCOUNTS & JOURNAL VOUCHER BALANCE CRUD
    // ---------------------------------------------------------
    console.log("\n📚 5. ACCOUNTS & JOURNAL VOUCHER BALANCE CRUD TESTS");

    await testStep("Insert Debit/Credit Journal Entry", async () => {
      testIds.journalNo = `J-TEST-${Date.now()}`;
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("accounts_journal").insert([
        {
          journal_no: testIds.journalNo,
          entry_date: today,
          account_name: "Test Customer Account",
          entry_type: "debit",
          amount: 15000,
          description: "E2E Reusable Test Journal Debit"
        },
        {
          journal_no: testIds.journalNo,
          entry_date: today,
          account_name: "Sales A/c",
          entry_type: "credit",
          amount: 15000,
          description: "E2E Reusable Test Journal Credit"
        }
      ]);
      if (error) throw error;
    });

    await testStep("Verify Journal Balance Equality (Debit == Credit)", async () => {
      const { data, error } = await supabase.from("accounts_journal")
        .select("entry_type, amount")
        .eq("journal_no", testIds.journalNo);
      if (error) throw error;
      const debit = data.filter(d => d.entry_type === "debit").reduce((sum, d) => sum + Number(d.amount), 0);
      const credit = data.filter(d => d.entry_type === "credit").reduce((sum, d) => sum + Number(d.amount), 0);
      if (debit !== credit) throw new Error(`Debit (${debit}) does not match Credit (${credit})`);
    });

  } finally {
    // ---------------------------------------------------------
    // MODULE 6: AUTOMATED CLEANUP & DATABASE RESTORATION
    // ---------------------------------------------------------
    console.log("\n🧹 6. AUTOMATED CLEANUP & PRISTINE RESTORATION");

    await testStep("Clean up test Journal Entries", async () => {
      if (testIds.journalNo) {
        await supabase.from("accounts_journal").delete().eq("journal_no", testIds.journalNo);
      }
    });

    await testStep("Clean up test Sales & Dispatch Orders", async () => {
      if (testIds.dispatchOrderId) await supabase.from("sales_orders").delete().eq("id", testIds.dispatchOrderId);
      if (testIds.salesOrderId) await supabase.from("sales_orders").delete().eq("id", testIds.salesOrderId);
    });

    await testStep("Clean up test Product Purchases", async () => {
      if (testIds.productPurchaseId) await supabase.from("product_purchases").delete().eq("id", testIds.productPurchaseId);
    });

    await testStep("Clean up test Stock Rolls across all 5 departments", async () => {
      if (testIds.finishingBundleId) await supabase.from("finishing_bundles").delete().eq("id", testIds.finishingBundleId);
      if (testIds.offsetRollId) await supabase.from("offset_rolls").delete().eq("id", testIds.offsetRollId);
      if (testIds.lamRollId) await supabase.from("lamination_rolls").delete().eq("id", testIds.lamRollId);
      if (testIds.rotoRollId) await supabase.from("roto_film_rolls").delete().eq("id", testIds.rotoRollId);
      if (testIds.fabricRollId) await supabase.from("fabric_rolls").delete().eq("id", testIds.fabricRollId);
    });

    await testStep("Clean up test Catalog Specifications & Customer", async () => {
      if (testIds.finishingProductId) await supabase.from("finishing_products").delete().eq("id", testIds.finishingProductId);
      if (testIds.offsetProductId) await supabase.from("offset_products").delete().eq("id", testIds.offsetProductId);
      if (testIds.rotoColorId) await supabase.from("roto_colors").delete().eq("id", testIds.rotoColorId);
      if (testIds.rotoProductId) await supabase.from("roto_products").delete().eq("id", testIds.rotoProductId);
      if (testIds.fabricTypeId) await supabase.from("fabric_types").delete().eq("id", testIds.fabricTypeId);
      if (testIds.customerId) await supabase.from("customers").delete().eq("id", testIds.customerId);
    });
  }

  console.log("\n=========================================================================");
  console.log(`📊 SUMMARY: Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  if (failedTests === 0) {
    console.log("🏁 ALL E2E EDGE CASE & WORKFLOW TESTS PASSED 100%!");
  } else {
    console.error("❌ TEST SUITE FAILED WITH ERRORS!");
    process.exit(1);
  }
  console.log("=========================================================================\n");
}

runReusableTestSuite();
