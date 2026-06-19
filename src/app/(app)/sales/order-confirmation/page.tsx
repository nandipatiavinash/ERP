import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { OrderConfirmationWorkspace } from "./OrderConfirmationWorkspace";
import { PageHeader } from "@/components/app/page-header";

export default async function OrderConfirmationPage() {
  await requirePermission("sales.view");
  const supabase = await createClient();

  // Fetch all active orders with customer details and order items
  const { data: orders, error: ordersError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (ordersError) throw new Error(ordersError.message);

  // Fetch all active fabric types, roto products, and offset products to map ids to names
  const [
    { data: fabrics },
    { data: rotoProducts },
    { data: offsetProducts },
    { data: rolls }
  ] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, meters, weight, status, fabric_type_id")
      .is("deleted_at", null)
  ]);

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Order Confirmation"
          description="Allocate rolls, review live tallies against order requirements, and print proforma invoices."
        />
      </div>

      <OrderConfirmationWorkspace
        orders={(orders ?? []) as any[]}
        fabrics={(fabrics ?? []) as any[]}
        rotoProducts={(rotoProducts ?? []) as any[]}
        offsetProducts={(offsetProducts ?? []) as any[]}
        rolls={(rolls ?? []) as any[]}
      />
    </div>
  );
}
