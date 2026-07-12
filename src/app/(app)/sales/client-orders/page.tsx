import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClientOrdersList } from "./ClientOrdersList";

export default async function ClientOrdersReviewPage() {
  await requirePermission("sales.order_confirmation"); // staff with order confirmation permission can review client orders
  
  const supabase = await createClient();

  // Fetch pending client orders with customer name and items
  const { data: orders } = await supabase
    .from("client_orders")
    .select(`
      *, 
      customers(customer_name, alias),
      client_order_items(
        *,
        fabric:fabric_type_id(fabric_name, gsm, width),
        finishing:finishing_product_id(name),
        roto:roto_product_id(brand),
        offset:offset_product_id(brand)
      )
    `)
    .eq("status", "pending")
    .is("deleted_at", null)
    .order("created_at", { ascending: false }) as any;

  return (
    <>
      <PageHeader
        title="Client Portal Orders"
        description="Review, customize, and approve orders submitted by clients from their online portal."
      />
      <div className="max-w-5xl mx-auto py-4">
        <ClientOrdersList orders={orders ?? []} />
      </div>
    </>
  );
}
