import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Simple env parser
const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const parts = line.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Checking remote Supabase schema...");
  
  console.log("Querying roto_colors...");
  const { data: colors, error: colorErr } = await supabase.from("roto_colors").select("*").limit(1);
  if (colorErr) {
    console.error("Error reading roto_colors:", colorErr);
  } else {
    console.log("Successfully read roto_colors. Row:", colors);
  }

  console.log("Querying roto_film_rolls...");
  const { data: films, error: filmErr } = await supabase.from("roto_film_rolls").select("*").limit(1);
  if (filmErr) {
    console.error("Error reading roto_film_rolls:", filmErr);
  } else {
    console.log("Successfully read roto_film_rolls. Row:", films);
  }

  console.log("Querying roles...");
  const { data: roles, error: rolesErr } = await supabase.from("roles").select("name").limit(5);
  if (rolesErr) {
    console.error("Error reading roles:", rolesErr);
  } else {
    console.log("Roles table works. Rows:", roles);
  }
}

checkSchema();
