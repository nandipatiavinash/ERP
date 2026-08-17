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

async function testAllDeptStockDisplay() {
  console.log("=================================================");
  console.log("🚀 TESTING STOCK DISPLAY FOR ALL 5 DEPARTMENTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. Fetch catalogs
  const [
    { data: customers },
    { data: fabricTypes },
    { data: rotoProducts },
    { data: offsetProducts },
  ] = await Promise.all([
    supabase.from("customers").select("id, customer_name").limit(1),
    supabase.from("fabric_types").select("id, fabric_name").limit(1),
    supabase.from("roto_products").select("id, brand").limit(1),
    supabase.from("offset_products").select("id, brand").limit(1),
  ]);

  const supplier = customers[0];
  const fabric = fabricTypes[0];
  const roto = rotoProducts[0];
  const offset = offsetProducts[0];
  const today = new Date().toISOString().split("T")[0];

  const cleanupIds = {
    fabric: null,
    roto: null,
    lamination: null,
    offset: null,
    finishing: null,
  };

  try {
    // A. FABRIC STOCK DISPLAY
    console.log("🔹 Testing Department A: FABRIC");
    const { count: eCount } = await supabase
      .from("fabric_rolls")
      .select("id", { count: "exact", head: true })
      .like("roll_number", "E-%")
      .is("deleted_at", null);
    const fabRollNo = `E-${(eCount ?? 0) + 1}`;

    const { data: fabStock, error: fabErr } = await supabase
      .from("fabric_rolls")
      .insert({
        roll_number: fabRollNo,
        fabric_type_id: fabric.id,
        weight: 85.0,
        meters: 300,
        production_date: today,
        status: "available",
      })
      .select()
      .single();

    if (fabErr || !fabStock) throw new Error(`Fabric insert failed: ${fabErr?.message}`);
    cleanupIds.fabric = fabStock.id;

    const { data: fabQuery } = await supabase
      .from("fabric_rolls")
      .select("*, fabric_types(fabric_name)")
      .eq("id", fabStock.id)
      .single();

    if (fabQuery && fabQuery.weight === 85.0 && fabQuery.meters === 300) {
      console.log(`   ✅ PASS: Fabric Roll ${fabStock.roll_number} active with Weight: ${fabQuery.weight}kg, Meters: ${fabQuery.meters}m`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Fabric stock verification failed.`);
      failed++;
    }

    // B. ROTO PRINTING STOCK DISPLAY
    console.log("\n🔹 Testing Department B: ROTO PRINTING");
    const rotoRollId = `TEST-ROTO-${Date.now()}`;
    const { data: rotoStock, error: rotoErr } = await supabase
      .from("roto_film_rolls")
      .insert({
        roll_id: rotoRollId,
        s_no: 1,
        brand_id: roto.id,
        film_type: "gloss",
        weight_kg: 45.0,
        meters: 500,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (rotoErr || !rotoStock) throw new Error(`Roto insert failed: ${rotoErr?.message}`);
    cleanupIds.roto = rotoStock.id;

    const { data: rotoQuery } = await supabase
      .from("roto_film_rolls")
      .select("*")
      .eq("id", rotoStock.id)
      .single();

    if (rotoQuery && rotoQuery.weight_kg === 45.0 && rotoQuery.meters === 500) {
      console.log(`   ✅ PASS: Roto Film Roll ${rotoStock.roll_id} active with Weight: ${rotoQuery.weight_kg}kg, Meters: ${rotoQuery.meters}m`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Roto stock verification failed.`);
      failed++;
    }

    // C. LAMINATION STOCK DISPLAY
    console.log("\n🔹 Testing Department C: LAMINATION");
    const lamRollId = `TEST-LAM-${Date.now()}`;
    const { data: lamStock, error: lamErr } = await supabase
      .from("lamination_rolls")
      .insert({
        roll_id: lamRollId,
        s_no: 1,
        lam_type: "BOX",
        fabric_type_id: fabric.id,
        weight_kg: 120.0,
        meters: 1500,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (lamErr || !lamStock) throw new Error(`Lamination insert failed: ${lamErr?.message}`);
    cleanupIds.lamination = lamStock.id;

    const { data: lamQuery } = await supabase
      .from("lamination_rolls")
      .select("*")
      .eq("id", lamStock.id)
      .single();

    if (lamQuery && lamQuery.weight_kg === 120.0 && lamQuery.meters === 1500) {
      console.log(`   ✅ PASS: Lamination Roll ${lamStock.roll_id} active with Weight: ${lamQuery.weight_kg}kg, Meters: ${lamQuery.meters}m`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Lamination stock verification failed.`);
      failed++;
    }

    // D. OFFSET PRINTING STOCK DISPLAY
    console.log("\n🔹 Testing Department D: OFFSET PRINTING");
    const offsetRollId = `TEST-OFF-${Date.now()}`;
    const { data: offsetStock, error: offErr } = await supabase
      .from("offset_rolls")
      .insert({
        roll_id: offsetRollId,
        s_no: 1,
        fabric_type_id: fabric.id,
        offset_type: "FABRIC",
        brand_id: offset.id,
        weight_kg: 90.0,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (offErr || !offsetStock) throw new Error(`Offset insert failed: ${offErr?.message}`);
    cleanupIds.offset = offsetStock.id;

    const { data: offQuery } = await supabase
      .from("offset_rolls")
      .select("*")
      .eq("id", offsetStock.id)
      .single();

    if (offQuery && offQuery.weight_kg === 90.0) {
      console.log(`   ✅ PASS: Offset Roll ${offsetStock.roll_id} active with Weight: ${offQuery.weight_kg}kg`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Offset stock verification failed.`);
      failed++;
    }

    // E. FINISHING STOCK DISPLAY
    console.log("\n🔹 Testing Department E: FINISHING / BAGS");
    const bundleId = `TEST-FIN-${Date.now()}`;
    const { data: finStock, error: finErr } = await supabase
      .from("finishing_bundles")
      .insert({
        bundle_id: bundleId,
        s_no: 1,
        finish_type: "FABRIC",
        num_bags: 500,
        weight_kg: 65.0,
        entry_date: today,
        status: "available",
      })
      .select()
      .single();

    if (finErr || !finStock) throw new Error(`Finishing insert failed: ${finErr?.message}`);
    cleanupIds.finishing = finStock.id;

    const { data: finQuery } = await supabase
      .from("finishing_bundles")
      .select("*")
      .eq("id", finStock.id)
      .single();

    if (finQuery && finQuery.num_bags === 500 && finQuery.weight_kg === 65.0) {
      console.log(`   ✅ PASS: Finishing Bundle ${finStock.bundle_id} active with Bags: ${finQuery.num_bags}, Weight: ${finQuery.weight_kg}kg`);
      passed++;
    } else {
      console.log(`   ❌ FAIL: Finishing stock verification failed.`);
      failed++;
    }

  } catch (error) {
    console.error(`\n❌ TEST ERROR:`, error.message || error);
    failed++;
  } finally {
    console.log("\n🧹 Cleaning up test stock records...");
    if (cleanupIds.fabric) await supabase.from("fabric_rolls").delete().eq("id", cleanupIds.fabric);
    if (cleanupIds.roto) await supabase.from("roto_film_rolls").delete().eq("id", cleanupIds.roto);
    if (cleanupIds.lamination) await supabase.from("lamination_rolls").delete().eq("id", cleanupIds.lamination);
    if (cleanupIds.offset) await supabase.from("offset_rolls").delete().eq("id", cleanupIds.offset);
    if (cleanupIds.finishing) await supabase.from("finishing_bundles").delete().eq("id", cleanupIds.finishing);
    console.log("   ✅ Cleanup complete.");
  }

  console.log("\n=================================================");
  console.log(`🏁 DEPT STOCK DISPLAY SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) process.exit(1);
}

testAllDeptStockDisplay();
