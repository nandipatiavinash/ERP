import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data: entry } = await supabase.from("loom_production_entries").select("*").limit(1);
  console.log("loom_production_entries row:", entry);

  const { data: roll } = await supabase.from("fabric_rolls").select("*").limit(1);
  console.log("fabric_rolls row:", roll);
}

inspect();
