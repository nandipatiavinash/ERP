import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envLocal = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envLocal.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: journals, error } = await supabase
    .from("accounts_journal")
    .select("journal_no")
    .order("journal_no");

  if (error) {
    console.error(error);
    return;
  }

  // Extract all numbers from journal_no in the format JE-XXXX
  const numbers = [];
  for (const j of journals || []) {
    const match = j.journal_no ? j.journal_no.match(/JE-(\d+)/) : null;
    if (match) {
      numbers.push(parseInt(match[1], 10));
    }
  }

  const uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);
  console.log("Min Journal Number:", uniqueNumbers[0]);
  console.log("Max Journal Number:", uniqueNumbers[uniqueNumbers.length - 1]);
  console.log("Unique journal numbers count:", uniqueNumbers.length);

  // Find gaps in sequence
  const gaps = [];
  for (let i = uniqueNumbers[0]; i <= uniqueNumbers[uniqueNumbers.length - 1]; i++) {
    if (!uniqueNumbers.includes(i)) {
      gaps.push(i);
    }
  }

  console.log("Gaps found in journal_no sequence:", gaps.length);
  if (gaps.length > 0) {
    console.log("Sample gaps:", gaps.slice(0, 50));
  }
}

check();
