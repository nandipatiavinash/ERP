import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data: entry } = await supabase.from("loom_production_entries").select("*").limit(1);
  console.log("loom_production_entries row:", entry);

  const { data: roll } = await supabase.from("fabric_rolls").select("*").limit(1);
  console.log("fabric_rolls row:", roll);
}

inspect();
