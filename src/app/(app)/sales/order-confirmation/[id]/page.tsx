import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { OrderConfirmationWorkspace } from "../OrderConfirmationWorkspace";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export default async function OrderWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("sales.view");
  const { id } = await params;
  const supabase = await createClient();

  // Fetch all active orders with customer details and order items
  const [{ data: orders }, { data: fabrics }, { data: rotoProducts }, { data: offsetProducts }, { data: rolls }] = await Promise.all([
    supabase.from("sales_orders").select("*, customers(*), sales_order_items(*)").is("deleted_at", null).order("created_at", { ascending: true }),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase.from("fabric_rolls").select("id, roll_number, meters, weight, status, fabric_type_id, looms(loom_number), loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").is("deleted_at", null)
  ]);

  return (
    <div className="space-y-6">
      <div className="no-print mb-4">
        <Link href={"/sales/order-confirmation" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Delivery Entry List
          </Button>
        </Link>
      </div>

      <OrderConfirmationWorkspace
        orders={(orders ?? []) as any[]}
        fabrics={(fabrics ?? []) as any[]}
        rotoProducts={(rotoProducts ?? []) as any[]}
        offsetProducts={(offsetProducts ?? []) as any[]}
        rolls={(rolls ?? []) as any[]}
        initialOrderId={id}
        singleViewMode={true}
      />
    </div>
  );
}
