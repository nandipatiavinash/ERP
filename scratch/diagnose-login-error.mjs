import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey || !anonKey) {
  console.error("Missing credentials in envVars");
  process.exit(1);
}

const adminSupabase = createClient(supabaseUrl, serviceKey);
const clientSupabase = createClient(supabaseUrl, anonKey);

async function diagnose() {
  const email = 'rkglobal@gmail.com';
  const newPassword = 'password123';
  const userId = 'b3e61197-3ca4-446d-9f35-8767998fb0c2';

  console.log(`Setting temporary password for ${email}...`);
  const { error: resetErr } = await adminSupabase.auth.admin.updateUserById(userId, {
    password: newPassword
  });

  if (resetErr) {
    console.error("❌ Failed to set password:", resetErr.message);
    return;
  }
  console.log("✅ Password updated successfully.");

  console.log("Signing in using clientSupabase...");
  const { data: authData, error: authErr } = await clientSupabase.auth.signInWithPassword({
    email,
    password: newPassword
  });

  if (authErr) {
    console.error("❌ Sign In Failed:", authErr.message);
    return;
  }
  console.log("✅ Auth Sign In Succeeded.");

  console.log("Running user profile lookup query...");
  const { data: profile, error: profileError } = await clientSupabase
    .from("users")
    .select("id, status, deleted_at, roles(name, is_active, deleted_at)")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.log("\n❌ DIAGNOSTIC RESULT: Profile query failed!");
    console.log("Error Message:", profileError.message);
    console.log("Code:", profileError.code);
    console.log("Details:", profileError.details);
    console.log("Hint:", profileError.hint);
  } else {
    console.log("\n✅ DIAGNOSTIC RESULT: Profile query succeeded!");
    console.log("Returned Profile Data:", JSON.stringify(profile, null, 2));
  }
}

diagnose();
