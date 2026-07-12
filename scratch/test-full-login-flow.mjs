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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("Attempting sign in with password...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'rkglobal@gmail.com',
    password: 'password123' // assuming this or the correct password, or we can see if it authenticates
  });

  if (error) {
    console.error("❌ Auth Sign In Failed:", error.message);
    return;
  }

  const userId = data.user?.id;
  console.log("✅ Auth Sign In Succeeded. User ID:", userId);

  console.log("Executing profile query using logged-in session...");
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, status, deleted_at, roles(name, is_active, deleted_at)")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("❌ PROFILE QUERY FAILED!");
    console.error("Message:", profileError.message);
    console.error("Code:", profileError.code);
    console.error("Details:", profileError.details);
  } else {
    console.log("✅ PROFILE QUERY SUCCEEDED!");
    console.log("Profile Data:", JSON.stringify(profile, null, 2));
  }
}

testLogin();
