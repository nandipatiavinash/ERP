import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { DateFilter } from "@/components/app/date-filter";
import { PageHeader } from "@/components/app/page-header";
import { SalesConfirmationReportClient } from "./SalesConfirmationReportClient";

export default async function SalesConfirmationReportPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; tab?: string }>;
}) {
  await requirePermission("reports.sales_confirmation");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const tab = params.tab || "pending";

  // Fetch billed sales orders for this date
  const { data: orders } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "confirmed")
    .eq("order_date", date)
    .not("bill_number", "is", null)
    .is("deleted_at", null)
    .order("order_number", { ascending: true });

  const billedOrders = (orders ?? []) as any[];

  // 1. Fetch pending items (price is 0 or null)
  const { data: pendingItems } = await supabase
    .from("sales_order_items")
    .select("sales_order_id")
    .or("price.eq.0,price.is.null");

  const pendingOrderIds = Array.from(new Set(((pendingItems ?? []) as any[]).map(item => item.sales_order_id)));

  // 2. Fetch pending orders (all dates)
  let pendingOrders: any[] = [];
  if (pendingOrderIds.length > 0) {
    const { data: pendingRes } = await supabase
      .from("sales_orders")
      .select("*, customers(*), sales_order_items(*)")
      .eq("status", "confirmed")
      .not("bill_number", "is", null)
      .in("id", pendingOrderIds)
      .is("deleted_at", null)
      .order("order_date", { ascending: false });
    pendingOrders = pendingRes || [];
  }

  // Fetch product definitions for resolving names
  const [{ data: fabrics }, { data: roto }, { data: offset }] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name, selling_price"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
  ]);

  // Extract selected roll IDs
  const allRollIds: string[] = [];
  const combinedOrders = [...billedOrders, ...pendingOrders];
  combinedOrders.forEach((order) => {
    order.sales_order_items?.forEach((item: any) => {
      if (item.selected_roll_ids) {
        allRollIds.push(...item.selected_roll_ids);
      }
    });
  });
  const uniqueRollIds = Array.from(new Set(allRollIds));

  // Fetch rolls
  let rolls: any[] = [];
  if (uniqueRollIds.length > 0) {
    const { data: rollData } = await supabase
      .from("fabric_rolls")
      .select("id, weight")
      .in("id", uniqueRollIds)
      .is("deleted_at", null);
    rolls = rollData || [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Confirmation Report"
        description="Verify calculations, GST, rates, and outstanding balances for billed sales."
      />

      <div className="flex flex-col gap-4">
        <SalesConfirmationReportClient
          orders={billedOrders}
          pendingOrders={pendingOrders}
          date={date}
          tab={tab}
          fabrics={fabrics || []}
          rotoProducts={roto || []}
          offsetProducts={offset || []}
          rolls={rolls}
        />
      </div>
    </div>
  );
}

