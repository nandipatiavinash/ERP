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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDashboardQueries() {
  console.log("=================================================");
  console.log("📊 DASHBOARD PAGE 26-QUERY FETCH VERIFICATION");
  console.log("=================================================\n");

  const from = new Date().toISOString().split("T")[0];
  const to = from;

  try {
    const results = await Promise.all([
      supabase.from("raw_material_consumptions").select("quantity, consumption_date, department").gte("consumption_date", from).lte("consumption_date", to).is("deleted_at", null),
      supabase.from("loom_production_entries").select("net_weight, net_meters, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("roto_film_rolls").select("weight_kg, meters, entry_date, brand_id").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("roto_metallic_rolls").select("weight_kg, meters, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("lamination_rolls").select("weight_kg, meters, entry_date, roll_id").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("offset_rolls").select("weight_kg, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("finishing_bundles").select("weight_kg, num_bags, entry_date, product_id").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("tape_line_entries").select("id, tape_type, loads, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("loom_shift_meters").select("day_shift_meters, night_shift_meters, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("electricity_units_entries").select("units, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("accounts_journal").select("account_id, account_name, entry_type, amount, entry_date").lte("entry_date", to).is("deleted_at", null),
      supabase.from("sales_orders").select("id, order_date, status, bill_number, sales_order_items(id, department, quantity, selected_roll_ids, product_id)").gte("order_date", from).lte("order_date", to).is("deleted_at", null),
      supabase.from("roto_products").select("id, brand"),
      supabase.from("finishing_products").select("id, name, dimensions, roto_product_id, lamination_type, offset_type, is_metallic"),
      supabase.from("fabric_rolls").select("weight, updated_at").eq("status", "consumed").in("current_stage", ["lamination", "lamination_consumption"]).gte("updated_at", `${from}T00:00:00+05:30`).lte("updated_at", `${to}T23:59:59.999+05:30`).is("deleted_at", null),
      supabase.from("roto_metallic_rolls").select("weight_kg, updated_at").eq("status", "consumed").gte("updated_at", `${from}T00:00:00+05:30`).lte("updated_at", `${to}T23:59:59.999+05:30`).is("deleted_at", null),
      supabase.from("roto_film_rolls").select("weight_kg, updated_at").eq("status", "consumed").gte("updated_at", `${from}T00:00:00+05:30`).lte("updated_at", `${to}T23:59:59.999+05:30`).is("deleted_at", null),
      supabase.from("daily_waste_entries").select("plant_waste, bobon_waste, loom_waste, pipe_cutting_waste, entry_date").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null),
      supabase.from("raw_material_purchases").select("quantity, total_amount, purchase_date").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null),
      supabase.from("customers").select("id, customer_name, is_internal, opening_debit, opening_credit").eq("status", "active").is("deleted_at", null),
      supabase.from("material_sales").select("quantity, type, sale_date").gte("sale_date", from).lte("sale_date", to).is("deleted_at", null),
      supabase.from("looms").select("id, loom_number").eq("status", "active").is("deleted_at", null),
      supabase.from("operator_dashboard_status").select("sales_order_item_id, department, is_closed").eq("is_closed", true),
      supabase.from("fabric_rolls").select("fabric_type_id").eq("status", "available").is("deleted_at", null),
      supabase.from("roto_film_rolls").select("brand_id").eq("status", "available").is("deleted_at", null),
      supabase.from("lamination_rolls").select("product_id").eq("status", "available").is("deleted_at", null),
      supabase.from("fabric_types").select("id, fabric_name"),
      supabase.from("loom_production_entries").select("loom_id, fabric_type_id, entry_date, created_at").lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).order("created_at", { ascending: false })
    ]);

    for (let i = 0; i < results.length; i++) {
      if (results[i].error) {
        throw new Error(`Query ${i + 1} failed: ${results[i].error.message}`);
      }
    }

    console.log("=================================================");
    console.log("🏁 ALL 28 DASHBOARD QUERIES PASSED WITH 0 ERRORS!");
    console.log("=================================================");
  } catch (err) {
    console.error(`❌ DASHBOARD QUERY FAILED: ${err.message}`);
    process.exit(1);
  }
}

testDashboardQueries();
