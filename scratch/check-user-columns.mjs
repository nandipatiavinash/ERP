import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse env file
const envFile = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in envVars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, customer_id')
    .limit(1);

  if (error) {
    console.log("\n❌ DIAGNOSTIC RESULT: Query Failed!");
    console.log("Error Message:", error.message);
    console.log("Code:", error.code);
    if (error.message.includes("column users.customer_id does not exist") || error.message.includes("column \"customer_id\" does not exist")) {
      console.log("\n💡 CAUSE: The 'customer_id' column is missing from the 'users' table in your database.");
      console.log("👉 FIX: You must run the 045_client_portal_setup.sql migration on this database.");
    }
  } else {
    console.log("\n✅ DIAGNOSTIC RESULT: Query Succeeded! 'customer_id' column is present.");
    console.log("Sample Data:", data);
  }
}

check();
