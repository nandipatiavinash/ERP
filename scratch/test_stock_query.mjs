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
  const [
    { data: fabricRolls },
    { data: lamRolls },
    { data: offsetRolls },
    { data: finishingBundles },
    { data: rotoFilmRolls },
    { data: rotoMetallicRolls },
  ] = await Promise.all([
    supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, weight, production_date, status, current_stage").is("deleted_at", null),
    supabase.from("lamination_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),
    supabase.from("offset_rolls").select("id, roll_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),
    supabase.from("finishing_bundles").select("id, bundle_id, fabric_type_id, weight_kg, entry_date, status").is("deleted_at", null),
    supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),
    supabase.from("roto_metallic_rolls").select("id, roll_id, weight_kg, entry_date, status").is("deleted_at", null),
  ]);

  const rolls = [
    ...((fabricRolls ?? [])).map(r => ({
      id: r.id,
      roll_number: r.roll_number,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight || 0),
      production_date: r.production_date,
      status: r.status,
      current_stage: r.current_stage || "loom",
    })),
    ...((lamRolls ?? [])).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "lamination",
    })),
    ...((offsetRolls ?? [])).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "offset_printing",
    })),
    ...((finishingBundles ?? [])).map(r => ({
      id: r.id,
      roll_number: r.bundle_id,
      fabric_type_id: r.fabric_type_id,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "finishing",
    })),
    ...((rotoFilmRolls ?? [])).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: null,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "roto_printing",
    })),
    ...((rotoMetallicRolls ?? [])).map(r => ({
      id: r.id,
      roll_number: r.roll_id,
      fabric_type_id: null,
      weight: Number(r.weight_kg || 0),
      production_date: r.entry_date,
      status: r.status,
      current_stage: "roto_printing",
    })),
  ];

  console.log("Total Mapped Rolls:", rolls.length);
  console.log("Stages:", Array.from(new Set(rolls.map(r => r.current_stage))));
  console.log("Lamination rolls mapped count:", rolls.filter(r => r.current_stage === "lamination").length);
  console.log("Lamination rolls details:", rolls.filter(r => r.current_stage === "lamination"));
}

run().catch(console.error);
