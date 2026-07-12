import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching user rkglobal@gmail.com...");
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, full_name, email, role_id, roles(id, name)")
    .eq("email", "rkglobal@gmail.com")
    .single();

  if (userError) {
    console.error("User error:", userError);
    return;
  }

  console.log("User details:", userData);

  if (userData && userData.role_id) {
    console.log("Fetching permissions for role_id:", userData.role_id);
    const { data: permData, error: permError } = await supabase
      .from("role_permissions")
      .select("permission_id, permissions(id, module, action)")
      .eq("role_id", userData.role_id);

    if (permError) {
      console.error("Permissions query error:", permError);
      return;
    }

    const permissionStrings = permData.map(p => p.permissions ? `${p.permissions.module}.${p.permissions.action}` : null).filter(Boolean);
    console.log("User's permission strings:", permissionStrings);
  }
}

main();
