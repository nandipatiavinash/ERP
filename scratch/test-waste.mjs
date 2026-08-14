import { createClient } from "@supabase/supabase-js";

// Staging environment keys
const STAGING_URL = "https://ywoygyqtoyxygftqkcbk.supabase.co";
const STAGING_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3b3lneXF0b3l4eWdmdHFrY2JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk5ODA1MSwiZXhwIjoyMDk5NTc0MDUxfQ.7sAHj-zANH1FVyZIPeze1uxDITVWS8K8GAKdWfLSO7c";

const supabase = createClient(STAGING_URL, STAGING_SERVICE_ROLE_KEY);

async function runTest() {
  console.log("Starting functional testing for daily_waste_entries on staging database...");

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Clean up any existing active entry for today in daily_waste_entries
  console.log("\n1. Cleaning up today's existing entries...");
  const { error: deleteErr } = await supabase
    .from("daily_waste_entries")
    .delete()
    .eq("entry_date", todayStr);

  if (deleteErr) {
    console.error("Cleanup failed:", deleteErr);
    process.exit(1);
  }
  console.log("Cleanup complete.");

  // 2. Insert a new daily waste entry
  console.log("\n2. Testing INSERT...");
  const mockInsert = {
    entry_date: todayStr,
    plant_waste: 120.50,
    bobon_waste: 45.75,
    loom_waste: 89.20,
    pipe_cutting_waste: 15.00
  };

  const { data: insertData, error: insertErr } = await supabase
    .from("daily_waste_entries")
    .insert(mockInsert)
    .select();

  if (insertErr) {
    console.error("Insert failed:", insertErr);
    process.exit(1);
  }
  console.log("Insert successful! Result:", insertData);

  // Validate fields
  const insertedRow = insertData[0];
  if (
    Number(insertedRow.plant_waste) !== 120.50 ||
    Number(insertedRow.bobon_waste) !== 45.75 ||
    Number(insertedRow.loom_waste) !== 89.20 ||
    Number(insertedRow.pipe_cutting_waste) !== 15.00
  ) {
    console.error("Data validation failed: values do not match inserted values.");
    process.exit(1);
  }
  console.log("Data validation passed.");

  // 3. Test UNIQUE constraint (inserting same date again should fail)
  console.log("\n3. Testing UNIQUE constraint on active entries...");
  const { error: uniqueErr } = await supabase
    .from("daily_waste_entries")
    .insert(mockInsert);

  if (uniqueErr) {
    console.log("Unique constraint worked correctly! Error received (as expected):", uniqueErr.message);
  } else {
    console.error("Error: Unique constraint failed. Inserted duplicate date entry!");
    process.exit(1);
  }

  // 4. Test UPDATE (simulating operator resubmitting the form)
  console.log("\n4. Testing UPDATE...");
  const mockUpdate = {
    plant_waste: 130.00,
    bobon_waste: 50.00,
    loom_waste: 95.00,
    pipe_cutting_waste: 20.00
  };

  const { data: updateData, error: updateErr } = await supabase
    .from("daily_waste_entries")
    .update(mockUpdate)
    .eq("id", insertedRow.id)
    .select();

  if (updateErr) {
    console.error("Update failed:", updateErr);
    process.exit(1);
  }
  console.log("Update successful! Result:", updateData);

  // Validate fields
  const updatedRow = updateData[0];
  if (
    Number(updatedRow.plant_waste) !== 130.00 ||
    Number(updatedRow.bobon_waste) !== 50.00 ||
    Number(updatedRow.loom_waste) !== 95.00 ||
    Number(updatedRow.pipe_cutting_waste) !== 20.00
  ) {
    console.error("Update validation failed: values do not match updated values.");
    process.exit(1);
  }
  console.log("Update validation passed.");

  // 5. Test SOFT DELETE
  console.log("\n5. Testing SOFT DELETE...");
  const { data: deleteData, error: softDeleteErr } = await supabase
    .from("daily_waste_entries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", insertedRow.id)
    .select();

  if (softDeleteErr) {
    console.error("Soft delete failed:", softDeleteErr);
    process.exit(1);
  }
  console.log("Soft delete successful! Result:", deleteData);

  // 6. Verify that it is filtered out when querying active entries
  console.log("\n6. Querying active entries (should be empty due to soft delete)...");
  const { data: activeEntries, error: selectErr } = await supabase
    .from("daily_waste_entries")
    .select("*")
    .eq("entry_date", todayStr)
    .is("deleted_at", null);

  if (selectErr) {
    console.error("Select failed:", selectErr);
    process.exit(1);
  }

  if (activeEntries.length > 0) {
    console.error("Error: Soft-deleted entry is still visible in active query!");
    process.exit(1);
  }
  console.log("Success! Active query returned 0 rows.");

  // Final cleanup: hard delete test row
  await supabase
    .from("daily_waste_entries")
    .delete()
    .eq("id", insertedRow.id);

  console.log("\nAll functional tests completed successfully!");
}

runTest();
