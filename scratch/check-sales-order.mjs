import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMDI1OCwiZXhwIjoyMDk1Nzk2MjU4fQ.q7XXxSp8HDB2Ai7WO9A0UrqscN8nnYpX1xvw-C1QrHI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching order #DP-06-28-34...");
  const { data: orderData, error: orderError } = await supabase
    .from("sales_orders")
    .select("id, order_number, status, selected_roll_ids, sales_order_items(id, department, product_id, quantity, selected_roll_ids)")
    .eq("order_number", "DP-06-28-34");

  if (orderError) {
    console.error("Order error:", orderError);
    return;
  }

  console.log("Order Data:", JSON.stringify(orderData, null, 2));
}

main();
