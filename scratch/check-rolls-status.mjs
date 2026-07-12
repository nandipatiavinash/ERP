import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const rollIds = [
    "b6e291c7-7a38-4faa-9239-41897b979e8f",
    "58f648a8-6542-43c2-8e7c-eb893fbf92f6",
    "a1a160f1-1b17-4894-9709-f711266053fb",
    "fad10574-75e4-448c-aec3-865578a2d121",
    "93d60d45-6774-4a0a-ab0c-f6c6c403bad3",
    "e5b90ad3-6bae-4e14-b4c7-d476a7345df6",
    "e00977dc-f6cc-443f-8825-88247a7e43f6"
  ];

  console.log("Checking rolls in fabric_rolls...");
  const { data, error } = await supabase
    .from("fabric_rolls")
    .select("id, roll_number, status, deleted_at")
    .in("id", rollIds);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Rolls found in DB:", data);
}

main();
