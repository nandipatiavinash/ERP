import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdgnbjiswfvladuhltcx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Running pending orders query...");
  const { data, error } = await supabase
    .from("sales_orders")
    .select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")
    .eq("status", "confirmed")
    .is("bill_number", null)
    .is("deleted_at", null)
    .order("order_date", { ascending: false });

  if (error) {
    console.error("Query error:", error);
    return;
  }

  console.log("Total orders returned:", data?.length);
  const target = data?.find(o => o.order_number === "DP-06-28-03");
  console.log("Target order items details:", JSON.stringify(target?.sales_order_items, null, 2));
}

main();
