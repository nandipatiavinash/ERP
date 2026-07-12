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

// Use service role key if available to inspect auth.users
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in envVars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
  console.log("Fetching public.users profiles...");
  const { data: profiles, error: profErr } = await supabase
    .from('users')
    .select('id, full_name, email, role_id, status');

  if (profErr) {
    console.error("Error fetching profiles:", profErr.message);
  } else {
    console.log(`Found ${profiles.length} profiles in public.users:`);
    profiles.forEach(p => {
      console.log(`- ID: ${p.id} | Email: ${p.email} | Name: ${p.full_name} | RoleID: ${p.role_id} | Status: ${p.status}`);
    });
  }

  // Attempt to fetch from auth.users (requires service role key)
  if (envVars.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("\nFetching auth.users (via service role)...");
    const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers();
    if (authErr) {
      console.error("Error listing auth users:", authErr.message);
    } else {
      console.log(`Found ${users.length} users in auth.users:`);
      users.forEach(u => {
        console.log(`- ID: ${u.id} | Email: ${u.email} | Created At: ${u.created_at}`);
      });
    }
  } else {
    console.log("\n⚠️ Service role key not found in env. Cannot fetch auth.users directly.");
  }
}

listUsers();
