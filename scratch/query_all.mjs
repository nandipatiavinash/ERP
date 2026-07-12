import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith("#")) continue;
  const parts = cleanLine.split("=");
  if (parts.length >= 2) {
    process.env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function run() {
  const { data: lam } = await supabase.from("lamination_rolls").select("id, roll_id, lam_type, fabric_type_id, status, fabric_types(fabric_name)").eq("status", "available");
  console.log("--- Available Lamination Rolls ---");
  console.log(lam);

  const { data: film } = await supabase.from("roto_film_rolls").select("id, roll_id, s_no, status").eq("status", "available");
  console.log("--- Available Roto Film Rolls ---");
  console.log(film);

  const { data: metallic } = await supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, status").eq("status", "available");
  console.log("--- Available Roto Metallic Rolls ---");
  console.log(metallic);
  
  const { data: offset } = await supabase.from("offset_rolls").select("id, roll_id, offset_type, fabric_type_id, status").eq("status", "available");
  console.log("--- Available Offset Rolls ---");
  console.log(offset);
}

run().catch(console.error);
