import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
