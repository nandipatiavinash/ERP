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

async function generateNextJournalNo() {
  const { data: dbJournals } = await supabase
    .from("accounts_journal")
    .select("journal_no")
    .is("deleted_at", null);
  const journalNos = (dbJournals ?? [])
    .map((j) => j.journal_no)
    .filter((no) => Boolean(no));
  let nextInt = 1;
  for (const no of journalNos) {
    const match = no.match(/JE-(\d+)/);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val >= nextInt) nextInt = val + 1;
    }
  }
  return `JE-${String(nextInt).padStart(6, "0")}`;
}

async function testInsert() {
  const customerName = "SV POLYTECH INDUSTRIES";
  const customerId = "c96273fe-dfac-4097-85f0-a538836ada83";
  const salesAcId = "9712f58b-5514-4acf-a837-971c46cdefa2";
  const billNumber = "73";
  const billValue = 1147814;
  const entryDate = "2026-07-12";
  const userId = "b3e61197-3ca4-446d-9f35-8767998fb0c2";
  const orderNumber = "DP-07-12-01";

  const journalNo = await generateNextJournalNo();
  const journalInserts = [
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: customerId,
      account_name: customerName,
      entry_type: "debit",
      amount: billValue,
      description: `Bill ${billNumber} for Dispatch ${orderNumber}`,
      created_by: userId,
      updated_by: userId,
    },
    {
      journal_no: journalNo,
      entry_date: entryDate,
      account_id: salesAcId,
      account_name: "Sales A/c",
      entry_type: "credit",
      amount: billValue,
      description: `Bill ${billNumber} for Dispatch ${orderNumber} (${customerName})`,
      created_by: userId,
      updated_by: userId,
    },
  ];

  console.log("Attempting test insert of journals:", journalInserts);
  const { data, error } = await supabase.from("accounts_journal").insert(journalInserts).select();

  if (error) {
    console.error("Insert failed with error:", error.message, error.details);
  } else {
    console.log("Insert succeeded! Data created:", data);
  }
}

testInsert().catch(console.error);
