import { createClient } from "@supabase/supabase-js";

import fs from "fs";
import path from "path";

const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const getEnvVar = (name) => {
  const match = envLocal.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
};

const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const correctKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, correctKey);

async function main() {
  console.log("Fetching duplicate journal entries...");
  const ids = [
    "34ebfcef-f009-4edc-b5da-36eef2bbb530",
    "520fc69b-931c-4c95-a46a-f89f8012fe69",
    "26b8c731-c1af-41b7-b191-d97d34637909"
  ];
  const { data, error } = await supabase
    .from("accounts_journal")
    .select("*")
    .in("id", ids);
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

main();
