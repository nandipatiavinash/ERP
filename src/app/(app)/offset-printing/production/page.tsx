import { requirePermission, getSessionPermissions, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { OffsetProductionClient } from "./OffsetProductionClient";

export default async function OffsetPrintingProductionPage() {
  await requirePermission("offset_printing.production");
  const permissions = await getSessionPermissions();
  const user = await getSessionUser();
  const userRole = user?.roles?.name || "";
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [
    { data: activeFabricTypes },
    { data: activeLamRolls },
    { data: activeOffsetProducts },
    { data: todayOffsetEntries },
    { data: availableRolls },
    pendingOrdersRes,
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, lam_type, weight_kg, fabric_type_id, fabric_types(fabric_name)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("offset_products")
      .select("id, brand, width, height")
      .eq("status", "active")
      .order("brand"),
    supabase
      .from("offset_rolls")
      .select("*, offset_products(brand), fabric_types(fabric_name), lamination_rolls(roll_id)")
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

  const availableFabricTypeIds = Array.from(
    new Set((availableRolls ?? []).map((r: any) => r.fabric_type_id).filter(Boolean))
  );

  const rawFabricTypes = (activeFabricTypes ?? []) as any[];
  const fabricTypes = rawFabricTypes.filter((t) =>
    availableFabricTypeIds.includes(t.id)
  );
  const laminationRolls = (activeLamRolls ?? []) as any[];
  const offsetProducts = (activeOffsetProducts ?? []) as any[];
  const offsetRows = (todayOffsetEntries ?? []) as any[];

  // Flatten pending order items for offset
  const rawOrders = (pendingOrdersRes.data ?? []) as any[];
  const pendingOrders: any[] = [];
  for (const order of rawOrders) {
    const cust = order.customers;
    const customerName = cust ? (cust.alias || cust.customer_name) : "General";
    for (const item of (order.sales_order_items ?? [])) {
      if (item.department === "offset-printing") {
        const fab = rawFabricTypes.find(f => f.id === item.fabric_type_id);
        const prod = offsetProducts.find(p => p.id === item.offset_product_id);
        
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
          fabricWidth: fab?.width,
          offsetProductId: item.offset_product_id,
          offsetBrand: prod?.brand ?? "Offset Product",
          offsetWidth: prod?.width,
          offsetHeight: prod?.height,
          offset_type: item.offset_type,
          raw_item: item,
        });
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offset Printing Production"
        description="Log offset printing output using a fabric type, laminated NW/Plain roll, or raw NW material."
      />

      <OffsetProductionClient
        fabricTypes={fabricTypes}
        laminationRolls={laminationRolls}
        offsetProducts={offsetProducts}
        offsetRows={offsetRows}
        pendingOrders={pendingOrders}
        permissions={permissions}
        userRole={userRole}
      />
    </div>
  );
}
