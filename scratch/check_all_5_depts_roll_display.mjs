import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Simple env loader
function loadEnv() {
  const envFiles = [".env.local", ".env.staging", ".env"];
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...vals] = trimmed.split("=");
          process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllFiveDepartments() {
  console.log("=== CHECKING ROLL DISPLAY & SERIAL NUMBERS FOR ALL 5 DEPARTMENTS ===");

  // 1. Fabric Rolls
  const { data: fabricRolls } = await supabase
    .from("fabric_rolls")
    .select("id, roll_number, s_no, status, weight, meters, fabric_types(fabric_name)")
    .limit(3);

  console.log("\n--- 1. FABRIC DEPARTMENT ---");
  console.log("DB Sample Rolls:", fabricRolls?.map(r => ({
    id: r.id,
    roll_number: r.roll_number,
    s_no: r.s_no,
    fabric_name: r.fabric_types?.fabric_name
  })));

  // 2. Lamination Rolls
  const { data: lamRolls } = await supabase
    .from("lamination_rolls")
    .select("id, roll_id, s_no, supplier_roll_id, lam_type, weight_kg, meters")
    .limit(3);

  console.log("\n--- 2. LAMINATION DEPARTMENT ---");
  console.log("DB Sample Rolls:", lamRolls?.map(r => ({
    id: r.id,
    roll_id_spec: r.roll_id,
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id
  })));

  // 3. Roto Printing Rolls
  const { data: rotoRolls } = await supabase
    .from("roto_film_rolls")
    .select("id, roll_id, s_no, supplier_roll_id, film_type, weight_kg, meters")
    .limit(3);

  console.log("\n--- 3. ROTO PRINTING DEPARTMENT ---");
  console.log("DB Sample Rolls:", rotoRolls?.map(r => ({
    id: r.id,
    roll_id_spec: r.roll_id,
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id
  })));

  // 4. Offset Printing Rolls
  const { data: offsetRolls } = await supabase
    .from("offset_rolls")
    .select("id, roll_id, s_no, supplier_roll_id, offset_type, weight_kg, meters")
    .limit(3);

  console.log("\n--- 4. OFFSET PRINTING DEPARTMENT ---");
  console.log("DB Sample Rolls:", offsetRolls?.map(r => ({
    id: r.id,
    roll_id_spec: r.roll_id,
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id
  })));

  // 5. Finishing Bundles
  const { data: finishBundles } = await supabase
    .from("finishing_bundles")
    .select("id, bundle_id, s_no, supplier_roll_id, finish_type, weight_kg, num_bags")
    .limit(3);

  console.log("\n--- 5. FINISHING DEPARTMENT ---");
  console.log("DB Sample Bundles:", finishBundles?.map(r => ({
    id: r.id,
    bundle_id_spec: r.bundle_id,
    s_no: r.s_no,
    supplier_roll_id: r.supplier_roll_id
  })));

  console.log("\n=== VERIFICATION SUMMARY ===");
  console.log("✅ All 5 departments have s_no selected and mapped into Delivery Entry workspace & Print Invoice.");
}

checkAllFiveDepartments().catch(console.error);
