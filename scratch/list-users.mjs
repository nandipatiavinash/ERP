import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role_id, roles(name)")
    .eq("status", "active")
    .is("deleted_at", null);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Users in system:", data);
}

main();
