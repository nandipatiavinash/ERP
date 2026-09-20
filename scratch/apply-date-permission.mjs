import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
