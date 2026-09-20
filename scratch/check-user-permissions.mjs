import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
