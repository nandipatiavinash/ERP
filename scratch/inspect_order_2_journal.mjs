import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith("#")) continue;
  const parts = cleanLine.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function inspect() {
  console.log("Checking journal entries with amount = 1147814...");
  const { data: list1 } = await supabase.from("accounts_journal").select("*").eq("amount", 1147814);
  console.log("By exact amount:", list1);

  console.log("\nChecking journal entries with description containing '73' around 2026-07-12...");
  const { data: list2 } = await supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-12");
  console.log("Journals on 2026-07-12:", list2);
}

inspect().catch(console.error);
