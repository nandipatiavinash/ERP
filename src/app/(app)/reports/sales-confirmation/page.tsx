import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { SalesConfirmationReportClient } from "./SalesConfirmationReportClient";

export default async function SalesConfirmationReportPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; from?: string; to?: string; tab?: string }>;
}) {
  await requirePermission("reports.sales_confirmation");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;

  const today = todayInIndia();
  const from = params.from || params.date || (today.slice(0, 8) + "01"); // Default to start of month
  const to = params.to || params.date || today;
  const tab = params.tab || "pending";

  // Fetch billed sales orders in range
  const { data: orders } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .eq("status", "confirmed")
    .gte("order_date", from)
    .lte("order_date", to)
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
  const [
    { data: fabrics },
    { data: roto },
    { data: offset },
    { data: laminationProds },
    { data: finishingProds }
  ] = await Promise.all([
    supabase.from("fabric_types").select("id, fabric_name, selling_price"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase.from("lamination_products").select("id, name"),
    supabase.from("finishing_products").select("id, name"),
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

  // Fetch rolls in chunks of 200 to avoid HeadersOverflowError
  let rolls: any[] = [];
  if (uniqueRollIds.length > 0) {
    const chunks = [];
    for (let i = 0; i < uniqueRollIds.length; i += 200) {
      chunks.push(uniqueRollIds.slice(i, i + 200));
    }
    const results = await Promise.all(
      chunks.map(chunk =>
          supabase
            .from("fabric_rolls")
            .select("id, weight")
            .in("id", chunk)
            .is("deleted_at", null)
        )
    );
    rolls = results.flatMap(res => res.data ?? []);
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
          from={from}
          to={to}
          tab={tab}
          fabrics={fabrics || []}
          rotoProducts={roto || []}
          offsetProducts={offset || []}
          laminationProducts={laminationProds || []}
          finishingProducts={finishingProds || []}
          rolls={rolls}
          permissions={permissions}
        />
      </div>
    </div>
  );
}

