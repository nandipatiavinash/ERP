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

async function inspect() {
  console.log("Checking sales_orders where bill_number or order_number contains '73'...");
  const { data: orders, error } = await supabase
    .from("sales_orders")
    .select("*, sales_order_items(*)")
    .or("bill_number.eq.73,order_number.ilike.%73%");

  if (error) {
    console.error("Error fetching orders:", error.message);
  } else {
    orders.forEach((o) => {
      console.log(`Order ID: ${o.id} | Order No: ${o.order_number} | Date: ${o.order_date} | Bill No: ${o.bill_number} | Bill Value: ${o.bill_value} | GST: ${o.gst_rate} | Status: ${o.status}`);
      console.log("Items:");
      o.sales_order_items.forEach((item) => {
        console.log(`  Item ID: ${item.id} | Dept: ${item.department} | Qty: ${item.quantity} | Price: ${item.price} | Selected Rolls: ${item.selected_roll_ids?.length}`);
      });
    });
  }
}

inspect().catch(console.error);
