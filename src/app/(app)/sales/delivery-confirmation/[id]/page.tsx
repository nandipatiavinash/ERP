import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RollAllocationForm } from "@/components/app/roll-allocation-form";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function OrderAllocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("sales.view");
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Order Header
  const { data: orderData, error: orderError } = await (supabase
    .from("sales_orders") as any)
    .select("*, customers(customer_name, alias)")
    .eq("id", id)
    .single();

  if (orderError || !orderData) {
    throw new Error("Sales order not found.");
  }

  const order = orderData as any;

  // 2. Fetch Order Items
  const { data: items, error: itemsError } = await (supabase
    .from("sales_order_items") as any)
    .select("*")
    .eq("sales_order_id", id);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  // 3. Resolve product names and available rolls for each item in parallel
  const resolvedItems = await Promise.all(
    ((items ?? []) as any[]).map(async (item: any) => {
      let product_name = "Unknown Product";
      let availableRolls: any[] = [];

      if (item.department === "fabric") {
        // Fetch Fabric Type Name
        const { data: fabric } = await (supabase
          .from("fabric_types") as any)
          .select("fabric_name")
          .eq("id", item.product_id)
          .single();
        const fabricRow = fabric as any;
        product_name = fabricRow?.fabric_name ?? "Fabric";

        // Fetch Rolls: Available OR already selected by this item
        const { data: available } = await (supabase
          .from("fabric_rolls") as any)
          .select("id, roll_number, meters, weight, status")
          .eq("fabric_type_id", item.product_id)
          .is("deleted_at", null)
          .eq("status", "available");

        let allocated: any[] = [];
        if (item.selected_roll_ids && item.selected_roll_ids.length > 0) {
          const { data: res } = await (supabase
            .from("fabric_rolls") as any)
            .select("id, roll_number, meters, weight, status")
            .in("id", item.selected_roll_ids);
          allocated = res ?? [];
        }

        availableRolls = [...allocated, ...(available ?? [])]
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
      } else if (item.department === "roto-printing") {
        const { data: roto } = await (supabase
          .from("roto_products") as any)
          .select("brand, width, height")
          .eq("id", item.product_id)
          .single();
        const rotoRow = roto as any;
        product_name = rotoRow ? `${rotoRow.brand} (${rotoRow.width}x${rotoRow.height} in)` : "Roto Product";
      } else if (item.department === "offset-printing") {
        const { data: offset } = await (supabase
          .from("offset_products") as any)
          .select("brand, width, height")
          .eq("id", item.product_id)
          .single();
        const offsetRow = offset as any;
        product_name = offsetRow ? `${offsetRow.brand} (${offsetRow.width}x${offsetRow.height} in)` : "Offset Product";
      } else if (item.department === "lamination") {
        product_name = item.product_id === "lam-film-25" ? "Laminated Film 2.5 mil" : "Laminated Film 3.0 mil";
      } else if (item.department === "finishing") {
        product_name = item.product_id === "finished-bags-28" ? "Finished Bags W-28" : "Finished Bags W-32";
      }

      return {
        id: item.id,
        department: item.department,
        product_id: item.product_id,
        product_name,
        quantity: Number(item.quantity ?? 0),
        selected_roll_ids: (item.selected_roll_ids as string[]) || [],
        availableRolls,
      };
    })
  );

  return (
    <>
      <div className="mb-4">
        <Link href={"/sales/delivery-confirmation" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Confirmations List
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Allocation - Order #${order.order_number}`}
        description={`Allocate roll inventory for ${order.customers?.customer_name} (${order.customers?.alias || "No Alias"}).`}
      />

      <RollAllocationForm
        orderId={order.id}
        orderNumber={order.order_number}
        customerName={order.customers?.customer_name ?? "Customer"}
        items={resolvedItems}
      />
    </>
  );
}
