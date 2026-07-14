// Latency Profiling Test Suite for all Next.js App Router pages
// Run using: node latency_test_suite.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize Supabase
let supabase;
try {
  const envFile = readFileSync(".env.local", "utf-8");
  const env = {};
  envFile.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration in .env.local");
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`Connected to Supabase at: ${supabaseUrl}`);
} catch (err) {
  console.error("Error setting up Supabase:", err.message);
  process.exit(1);
}

// Helper to measure latency of a promise
async function measure(name, queryPromise) {
  const start = performance.now();
  try {
    const { data, error } = await queryPromise;
    const end = performance.now();
    const duration = Math.round(end - start);
    if (error) {
      return { name, duration, success: false, count: 0, error: error.message };
    }
    return { name, duration, success: true, count: data ? (Array.isArray(data) ? data.length : 1) : 0 };
  } catch (err) {
    const end = performance.now();
    return { name, duration: Math.round(end - start), success: false, count: 0, error: err.message };
  }
}

// 2. Define page-level simulation tests
const tests = [
  {
    page: "Accounts - Journal Page",
    run: async () => Promise.all([
      measure("Fetch journal entries (eq date)", supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-13").is("deleted_at", null)),
      measure("Fetch active customers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))
    ])
  },
  {
    page: "Accounts - Material Page",
    run: async () => Promise.all([
      measure("Fetch materials", supabase.from("raw_materials").select("*").is("deleted_at", null)),
      measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Accounts - Product Purchase Page",
    run: async () => Promise.all([
      measure("Fetch product purchases (gte date)", supabase.from("product_purchases").select("id, purchase_date, supplier_name, bill_number, total_amount, remarks, product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)").gte("purchase_date", "2026-07-13").is("deleted_at", null)),
      measure("Fetch active suppliers", supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null))
    ])
  },
  {
    page: "Accounts - Purchase Page",
    run: async () => Promise.all([
      measure("Fetch material purchases (gte date)", supabase.from("raw_material_purchases").select("*, raw_materials(material_name)").gte("purchase_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Accounts - Sales Page",
    run: async () => Promise.all([
      measure("Fetch draft sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "draft").is("deleted_at", null)),
      measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").eq("order_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Fabric Consumption",
    run: async () => Promise.all([
      measure("Fetch fabric consumption entries", supabase.from("fabric_rolls").select("*, loom_production_entries(*)").eq("status", "consumed").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Fabric Production",
    run: async () => Promise.all([
      measure("Fetch loom production (eq date)", supabase.from("loom_production_entries").select("*, looms(*), fabric_types(*)").eq("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Fabric Stock",
    run: async () => Promise.all([
      measure("Fetch available fabric rolls", supabase.from("fabric_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Lamination Consumption",
    run: async () => Promise.all([
      measure("Fetch lamination consumption (gte date)", supabase.from("lamination_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Lamination Production",
    run: async () => Promise.all([
      measure("Fetch lamination production (eq date)", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Lamination Stock",
    run: async () => Promise.all([
      measure("Fetch available lamination rolls", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Offset Consumption",
    run: async () => Promise.all([
      measure("Fetch offset consumption (gte date)", supabase.from("offset_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Offset Production",
    run: async () => Promise.all([
      measure("Fetch offset production (eq date)", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Offset Stock",
    run: async () => Promise.all([
      measure("Fetch available offset rolls", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Finishing Consumption",
    run: async () => Promise.all([
      measure("Fetch finishing consumption (gte date)", supabase.from("finishing_bundles").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Finishing Production",
    run: async () => Promise.all([
      measure("Fetch finishing production (eq date)", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Finishing Stock",
    run: async () => Promise.all([
      measure("Fetch available finishing bundles", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("status", "available").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Roto Consumption",
    run: async () => Promise.all([
      measure("Fetch roto consumption (gte date)", supabase.from("roto_film_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Roto Production",
    run: async () => Promise.all([
      measure("Fetch roto production (eq date)", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("entry_date", "2026-07-13").is("deleted_at", null))
    ])
  },
  {
    page: "Production - Roto Stock",
    run: async () => Promise.all([
      measure("Fetch available roto rolls", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("status", "available").is("deleted_at", null))
    ])
  },
  {
    page: "Reports - Balance Sheet",
    run: async () => Promise.all([
      measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))
    ])
  },
  {
    page: "Reports - Profit & Loss",
    run: async () => Promise.all([
      measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))
    ])
  },
  {
    page: "Reports - Sales Confirmation",
    run: async () => Promise.all([
      measure("Fetch confirmed sales orders", supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").eq("status", "confirmed").gte("order_date", "2026-07-01").lte("order_date", "2026-07-14").is("deleted_at", null))
    ])
  },
  {
    page: "Reports - Stock Report",
    run: async () => Promise.all([
      measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),
      measure("Fetch sales orders basic info", supabase.from("sales_orders").select("id, status, sales_order_items(id, department, selected_roll_ids)").is("deleted_at", null))
    ])
  },
  {
    page: "Admin - Products Page",
    run: async () => Promise.all([
      measure("Fetch fabric types definitions", supabase.from("fabric_types").select("*")),
      measure("Fetch roto products definitions", supabase.from("roto_products").select("*")),
      measure("Fetch lamination products definitions", supabase.from("lamination_products").select("*")),
      measure("Fetch offset products definitions", supabase.from("offset_products").select("*")),
      measure("Fetch finishing products definitions", supabase.from("finishing_products").select("*"))
    ])
  },
  {
    page: "Admin - Users Page",
    run: async () => Promise.all([
      measure("Fetch users", supabase.from("users").select("*, roles(name)").is("deleted_at", null))
    ])
  },
  {
    page: "Admin - Settings Page",
    run: async () => Promise.all([
      measure("Fetch setting records", supabase.from("settings").select("*"))
    ])
  },
  {
    page: "Admin - Looms Page",
    run: async () => Promise.all([
      measure("Fetch looms definitions", supabase.from("looms").select("*").is("deleted_at", null))
    ])
  },
  {
    page: "Admin - Colors Page",
    run: async () => Promise.all([
      measure("Fetch roto colors definitions", supabase.from("roto_colors").select("*").is("deleted_at", null))
    ])
  },
  {
    page: "Admin - Clients Page",
    run: async () => Promise.all([
      measure("Fetch customers list", supabase.from("customers").select("*").is("deleted_at", null).order("customer_name"))
    ])
  }
];

// 3. Execute all tests
async function runTestSuite() {
  console.log("\n========================================================");
  console.log("            ERP LATENCY AUDIT TEST SUITE                ");
  console.log("========================================================\n");

  let totalLatency = 0;
  let slowCount = 0;
  let fastCount = 0;
  let acceptableCount = 0;

  for (const t of tests) {
    console.log(`Running: ${t.page}...`);
    const results = await t.run();
    
    let maxDuration = 0;
    results.forEach((r) => {
      if (r.duration > maxDuration) {
        maxDuration = r.duration;
      }
      
      const statusIcon = r.success ? "✓" : "✗";
      let colorCode = "\x1b[32m"; // Green
      if (r.duration > 400) {
        colorCode = "\x1b[31m"; // Red
        slowCount++;
      } else if (r.duration > 150) {
        colorCode = "\x1b[33m"; // Yellow
        acceptableCount++;
      } else {
        fastCount++;
      }
      
      console.log(`   ${colorCode}${statusIcon} [${r.duration}ms]\x1b[0m - ${r.name} (${r.count} rows)`);
      if (r.error) {
        console.error(`      Error: ${r.error}`);
      }
    });

    totalLatency += maxDuration;
  }

  console.log("\n========================================================");
  console.log("            AUDIT PERFORMANCE SUMMARY                   ");
  console.log("========================================================");
  console.log(`Total Pages Tested: ${tests.length}`);
  console.log(`Fast Queries (<150ms): \x1b[32m${fastCount}\x1b[0m`);
  console.log(`Acceptable Queries (150ms-400ms): \x1b[33m${acceptableCount}\x1b[0m`);
  console.log(`Slow Queries (>400ms): \x1b[31m${slowCount}\x1b[0m`);
  console.log(`Total Simulated Latency: ${totalLatency}ms`);
  console.log("========================================================\n");
}

runTestSuite();
