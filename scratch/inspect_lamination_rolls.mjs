import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const content = readFileSync(".env.local", "utf8");
const env = {};
content.split(/\r?\n/).forEach(line => {
  const i = line.indexOf("=");
  if (i > 0) env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
});

const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { error } = await s.from("lamination_rolls").insert({ non_existent_col: "test" });
console.log("Error response:", error?.message);
