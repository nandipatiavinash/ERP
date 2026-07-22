import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { RotoProductionClient } from "./RotoProductionClient";

export default async function RotoPrintingProductionPage() {
  await requirePermission("roto_printing.production");
  const supabase = await createClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [
    { data: activeProducts },
    { data: activeColors },
    { data: activeCustomers },
    { data: availableFilmRolls },
    { data: todayFilmEntries },
    { data: todayMetallicEntries },
    pendingOrdersRes,
  ] = await Promise.all([
    supabase.from("roto_products").select("id, brand, customer_id, width, height").eq("status", "active").order("brand"),
    supabase.from("roto_colors").select("id, color_name").eq("status", "active").order("color_name"),
    supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),
    supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),
    supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).eq("entry_date", today).order("created_at", { ascending: false }),
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

  const rotoProducts = (activeProducts ?? []) as any[];
  const rotoColors = (activeColors ?? []) as any[];
  const customers = (activeCustomers ?? []) as any[];
  const filmRolls = (availableFilmRolls ?? []) as any[];
  const filmRows = (todayFilmEntries ?? []) as any[];
  const metallicRows = (todayMetallicEntries ?? []) as any[];

  // Flatten pending order items
  const rawOrders = (pendingOrdersRes.data ?? []) as any[];
  const pendingOrders: any[] = [];
  for (const order of rawOrders) {
    const cust = order.customers;
    const customerName = cust ? (cust.alias || cust.customer_name) : "General";
    for (const item of (order.sales_order_items ?? [])) {
      if (item.department === "roto-printing") {
        const prod = rotoProducts.find(p => p.id === item.roto_product_id);
        pendingOrders.push({
          id: item.id,
          sales_order_id: order.id,
          order_number: order.order_number,
          order_date: order.order_date,
          priority: Number(order.priority ?? 0),
          customerName,
          department: item.department,
          quantity: Number(item.quantity ?? 0),
          rotoProductId: item.roto_product_id,
          rotoBrand: prod?.brand ?? "Roto Product",
          rotoWidth: prod?.width,
          rotoHeight: prod?.height,
          film_type: item.film_type,
          is_metallic: item.is_metallic,
          raw_item: item,
        });
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Roto Printing Production"
        description="Record Film Production and Metallic Production outputs."
      />

      <RotoProductionClient
        rotoProducts={rotoProducts}
        rotoColors={rotoColors}
        customers={customers}
        filmRolls={filmRolls}
        filmRows={filmRows}
        metallicRows={metallicRows}
        pendingOrders={pendingOrders}
      />
    </>
  );
}
