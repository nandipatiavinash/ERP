import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching profiles for rkglobal@gmail.com...");
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("email", "rkglobal@gmail.com")
    .single();

  if (profileError) {
    console.error("Profile error:", profileError);
    return;
  }

  console.log("Profile Data:", profileData);

  console.log("Fetching permissions for user role:", profileData.role);
  const { data: permData, error: permError } = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("role", profileData.role);

  if (permError) {
    console.error("Permission error:", permError);
    return;
  }

  console.log("Permissions list:", permData.map(p => p.permission));
}

main();
