import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const getEnvVar = (name) => {
  const match = env.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: orders, error } = await supabase
    .from("sales_orders")
    .select("order_number, status, sales_order_items(*)")
    .is("deleted_at", null)
    .limit(10);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Orders:", orders.map(o => ({ num: o.order_number, status: o.status, items: o.sales_order_items })));
}

run();
