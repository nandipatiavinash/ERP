import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { LaminationProductionClient } from "./LaminationProductionClient";

export default async function LaminationProductionPage() {
  await requirePermission("lamination.production");
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [
    { data: activeFabricTypes },
    { data: activeRotoFilm },
    { data: activeRotoMetallic },
    { data: todayLaminationEntries },
    activeFabricRolls,
    pendingOrdersRes,
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("roto_film_rolls")
      .select("id, roll_id, s_no")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("roto_metallic_rolls")
      .select("id, roll_id, s_no")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("lamination_rolls")
      .select("*, fabric_types(fabric_name)")
      .is("deleted_at", null)
      .eq("entry_date", today)
      .order("created_at", { ascending: false }),
    supabase
      .from("fabric_rolls")
      .select("fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null),
    supabase
      .from("sales_orders")
      .select(`
        id,
        order_number,
        order_date,
        priority,
        customers(customer_name, alias),
        sales_order_items(id, department, quantity, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type)
      `)
      .eq("status", "draft")
      .is("deleted_at", null)
      .order("order_date", { ascending: true })
  ]);

  const availableFabricTypeIds = new Set((activeFabricRolls?.data || []).map((fr: any) => fr.fabric_type_id));
  
  // Wait, let's load all active fabric types for details mapping, and filter the ones for available rolls
  const rawFabricTypes = (activeFabricTypes ?? []) as any[];
  const fabricTypes = rawFabricTypes.filter((ft) => availableFabricTypeIds.has(ft.id));
  
  const rotoProducts = [
    ...((activeRotoFilm ?? []) as any[]),
    ...((activeRotoMetallic ?? []) as any[])
  ];
  const laminationRows = (todayLaminationEntries ?? []) as any[];

  // Flatten pending order items for lamination
  const rawOrders = (pendingOrdersRes.data ?? []) as any[];
  const pendingOrders: any[] = [];
  for (const order of rawOrders) {
    const cust = order.customers;
    const customerName = cust ? (cust.alias || cust.customer_name) : "General";
    for (const item of (order.sales_order_items ?? [])) {
      if (item.department === "lamination") {
        const fab = rawFabricTypes.find(f => f.id === item.fabric_type_id);
        const roto = rotoProducts.find(r => r.id === item.roto_product_id);
        
        pendingOrders.push({
          id: item.id,
          sales_order_id: order.id,
          order_number: order.order_number,
          order_date: order.order_date,
          priority: Number(order.priority ?? 0),
          customerName,
          department: item.department,
          quantity: Number(item.quantity ?? 0),
          fabricTypeId: item.fabric_type_id,
          fabricName: fab?.fabric_name ?? "Fabric",
          fabricWidth: fab?.width, // In case width is there
          rotoProductId: item.roto_product_id,
          rotoBrand: roto?.roll_id ?? "PLAIN",
          lamination_type: item.lamination_type,
          is_metallic: item.is_metallic,
          raw_item: item,
        });
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lamination Production"
        description="Log lamination output using a fabric type or raw NW material."
      />

      <LaminationProductionClient
        fabricTypes={fabricTypes}
        rotoProducts={rotoProducts}
        laminationRows={laminationRows}
        pendingOrders={pendingOrders}
      />
    </div>
  );
}
