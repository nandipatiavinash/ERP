// Script: create-test-client.mjs
// Creates a test client user linked to Kankariya (or similar) customer firm
// Run: node scratch/create-test-client.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Parse .env.local
const env = {};
fs.readFileSync(".env.local", "utf8").split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,  // service role = bypasses RLS
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log("🔍 Step 1: Finding all customers...");
  const { data: customers, error: custErr } = await supabase
    .from("customers")
    .select("id, customer_name")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("customer_name");

  if (custErr) { console.error("❌ Customers error:", custErr.message); process.exit(1); }

  console.log("📋 Available customers:");
  customers.forEach((c, i) => console.log(`  ${i + 1}. ${c.customer_name} (${c.id})`));

  // Find Kankariya (or first matching)
  const target = customers.find((c) =>
    c.customer_name.toLowerCase().includes("kankariya") ||
    c.customer_name.toLowerCase().includes("kankar")
  ) || customers[0];

  if (!target) { console.error("❌ No customers found."); process.exit(1); }
  console.log(`\n✅ Using customer: ${target.customer_name} (${target.id})`);

  console.log("\n🔍 Step 2: Finding 'client' role...");
  const { data: roles } = await supabase.from("roles").select("id, name");
  console.log("📋 Roles:", roles?.map((r) => r.name).join(", "));

  const clientRole = roles?.find((r) => r.name === "client");
  if (!clientRole) {
    console.error("❌ 'client' role not found. Run migration 045 first.");
    process.exit(1);
  }
  console.log(`✅ Client role id: ${clientRole.id}`);

  const TEST_EMAIL = "client.test@kankariya.com";
  const TEST_PASSWORD = "Kankariya@123";
  const TEST_NAME = `${target.customer_name} - Client`;

  console.log(`\n🔍 Step 3: Creating Supabase Auth user: ${TEST_EMAIL}...`);

  // Check if already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === TEST_EMAIL);

  let authUserId;
  if (existing) {
    console.log(`⚠️  Auth user already exists. Reusing id: ${existing.id}`);
    authUserId = existing.id;
  } else {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_NAME },
    });
    if (authErr) { console.error("❌ Auth user error:", authErr.message); process.exit(1); }
    authUserId = authData.user.id;
    console.log(`✅ Auth user created: ${authUserId}`);
  }

  console.log("\n🔍 Step 4: Creating/updating public.users profile...");
  const { error: profileErr } = await supabase.from("users").upsert({
    id: authUserId,
    role_id: clientRole.id,
    full_name: TEST_NAME,
    email: TEST_EMAIL,
    status: "active",
    customer_id: target.id,
  });

  if (profileErr) { console.error("❌ Profile error:", profileErr.message); process.exit(1); }
  console.log("✅ User profile saved with customer_id linked!");

  console.log("\n🎉 ========================================");
  console.log("   TEST CLIENT ACCOUNT CREATED");
  console.log("========================================");
  console.log(`   Customer Firm : ${target.customer_name}`);
  console.log(`   Email         : ${TEST_EMAIL}`);
  console.log(`   Password      : ${TEST_PASSWORD}`);
  console.log(`   Role          : client`);
  console.log("========================================");
  console.log("\n👉 Now login at /login with these credentials.");
  console.log("   You should be redirected to /portal/dashboard automatically.\n");
}

main().catch(console.error);
