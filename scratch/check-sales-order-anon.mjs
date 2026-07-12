import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ25iamlzd2Z2bGFkdWhsdGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMjAyNTgsImV4cCI6MjA5NTc5NjI1OH0.0wlfvEx-7GypBHNmUgA0uuycKThnMemAHG1y09UjB4A";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching pending orders via anon key...");
  const { data: pendingOrders, error: pendingError } = await supabase
    .from("sales_orders")
    .select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")
    .eq("status", "confirmed")
    .is("bill_number", null)
    .is("deleted_at", null)
    .order("order_date", { ascending: false });

  if (pendingError) {
    console.error("Pending error:", pendingError);
    return;
  }

  console.log("Pending Orders count:", pendingOrders?.length);
  if (pendingOrders && pendingOrders.length > 0) {
    const targetOrder = pendingOrders.find(o => o.order_number === "DP-06-28-03");
    console.log("Target Order DP-06-28-03:", JSON.stringify(targetOrder, null, 2));

    const allRollIds = [];
    for (const order of pendingOrders) {
      for (const item of order.sales_order_items || []) {
        if (item.selected_roll_ids) {
          allRollIds.push(...item.selected_roll_ids);
        }
      }
    }
    const uniqueRollIds = Array.from(new Set(allRollIds));
    console.log("Unique roll IDs count:", uniqueRollIds.length);
    console.log("Unique roll IDs:", uniqueRollIds);

    if (uniqueRollIds.length > 0) {
      const { data: rolls, error: rollsError } = await supabase
        .from("fabric_rolls")
        .select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")
        .in("id", uniqueRollIds)
        .is("deleted_at", null);

      if (rollsError) {
        console.error("Rolls error:", rollsError);
        return;
      }

      console.log("Fetched rolls count:", rolls?.length);
      console.log("Fetched rolls samples:", JSON.stringify(rolls?.slice(0, 3), null, 2));
    }
  }
}

main();
