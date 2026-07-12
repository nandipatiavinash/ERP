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
// Use service role key to inspect database records bypassing RLS
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log("Reading profile and role using service role bypass...");
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, status, deleted_at, role_id, roles(name, is_active, deleted_at)")
    .eq("id", "b3e61197-3ca4-446d-9f35-8767998fb0c2")
    .single();

  if (profileError) {
    console.error("❌ PROFILE QUERY FAILED:", profileError.message);
  } else {
    console.log("✅ PROFILE DATA:", JSON.stringify(profile, null, 2));
  }
}

testQuery();
