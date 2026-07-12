import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  const { data, error } = await supabase
    .from("permissions")
    .insert({
      module: "reports",
      action: "filter_by_date",
      description: "Allows filtering reports and entries by custom dates"
    })
    .select();

  if (error) {
    if (error.code === "23505") {
      console.log("Permission reports.filter_by_date already exists in the database.");
    } else {
      console.error("Error inserting permission:", error);
    }
  } else {
    console.log("Successfully inserted permission:", data);
  }
}

apply();
