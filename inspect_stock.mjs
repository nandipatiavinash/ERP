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
  const { data: rolls } = await supabase.from("fabric_rolls").select("*").limit(1);
  console.log("Fabric Roll:", rolls);

  const { data: lam } = await supabase.from("lamination_rolls").select("*").limit(1);
  console.log("Lamination Roll:", lam);

  const { data: offset } = await supabase.from("offset_rolls").select("*").limit(1);
  console.log("Offset Roll:", offset);

  const { data: finishing } = await supabase.from("finishing_bundles").select("*").limit(1);
  console.log("Finishing Bundle:", finishing);
}

run().catch(console.error);
