import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const userEmail = "nandipatiavinash19@gmail.com";
const userId = "537a9ad7-fe07-4b47-926f-a87467e9dd0b";
const tempPassword = "TempPassword123!";

async function main() {
  console.log("Updating password for test user...");
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: tempPassword
  });

  if (updateError) {
    console.error("Password update error:", updateError);
    return;
  }

  console.log("Signing in as test user...");
  const supabaseClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMjAyNTgsImV4cCI6MjA5NTc5NjI1OH0.0wlfvEx-7GypBHNmUgA0uuycKThnMemAHG1y09UjB4A");
  const { data: sessionData, error: signInError } = await supabaseClient.auth.signInWithPassword({
    email: userEmail,
    password: tempPassword
  });

  if (signInError) {
    console.error("Sign in error:", signInError);
    return;
  }

  console.log("Signed in successfully. Token active.");

  // Fetch pending orders
  console.log("Fetching pending orders as user...");
  const { data: pendingOrders, error: pendingError } = await supabaseClient
    .from("sales_orders")
    .select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")
    .eq("status", "confirmed")
    .is("bill_number", null)
    .is("deleted_at", null)
    .order("order_date", { ascending: false });

  if (pendingError) {
    console.error("Pending orders error:", pendingError);
    return;
  }

  console.log("Pending orders count:", pendingOrders?.length);

  const targetOrder = pendingOrders?.find(o => o.order_number === "DP-06-28-34");
  console.log("Target Order DP-06-28-34 items:", JSON.stringify(targetOrder?.sales_order_items, null, 2));

  // Gather roll IDs
  const allRollIds = [];
  for (const order of pendingOrders || []) {
    for (const item of order.sales_order_items || []) {
      if (item.selected_roll_ids) {
        allRollIds.push(...item.selected_roll_ids);
      }
    }
  }
  const uniqueRollIds = Array.from(new Set(allRollIds));
  console.log("Gathered roll IDs count:", uniqueRollIds.length);

  if (uniqueRollIds.length > 0) {
    console.log("Fetching rolls as user...");
    const { data: rolls, error: rollsError } = await supabaseClient
      .from("fabric_rolls")
      .select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
      .in("id", uniqueRollIds)
      .is("deleted_at", null);

    if (rollsError) {
      console.error("Rolls fetch error:", rollsError);
      return;
    }

    console.log("Fetched rolls count:", rolls?.length);
    const targetRollIds = targetOrder?.sales_order_items?.flatMap(item => item.selected_roll_ids || []) || [];
    const targetRollsFetched = rolls?.filter(r => targetRollIds.includes(r.id));
    console.log("Fetched rolls matching target order:", JSON.stringify(targetRollsFetched, null, 2));
  }
}

main();
