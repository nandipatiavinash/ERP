import { DeliveryEntryForm } from "@/components/app/delivery-entry-form";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayInIndia } from "@/lib/utils";
import { DateFilter } from "@/components/app/date-filter";
import { RecentOrdersTable } from "@/components/app/recent-orders-table";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("sales.order_confirmation");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();

  const [
    { data: customers },
    { data: fabrics },
    { data: roto },
    { data: offset },
    { data: laminationProds },
    { data: finishingProds },
    { data: colors },
    { data: orders }
  ] = await Promise.all([
    supabase.from("customers").select("id, customer_name, alias").eq("status", "active").eq("is_internal", "client a/c").is("deleted_at", null).order("customer_name"),
    supabase.from("fabric_types").select("id, fabric_name, status").is("deleted_at", null).order("fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height, status").order("brand"),
    supabase.from("offset_products").select("id, brand, width, height, status").order("brand"),
    supabase.from("lamination_products").select("id, name, status").is("deleted_at", null).order("name"),
    supabase.from("finishing_products").select("id, name, status").is("deleted_at", null).order("name"),
    supabase.from("roto_colors").select("id, color_name, status").is("deleted_at", null).order("color_name"),
    supabase
      .from("sales_orders")
      .select("*, customers(customer_name, alias), sales_order_items(id, department, quantity, product_id, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id, color_id)")
      .or(`order_date.eq.${date},status.eq.draft`)
      .is("deleted_at", null)
      .order("order_date", { ascending: true })
      .order("order_number", { ascending: true })
      .limit(100),
  ]);

  const isActualClient = (name: string) => {
    const n = name.trim().toLowerCase();
    if (n.endsWith(" a/c") || n.endsWith(" a/c.")) return false;
    const blacklist = [
      "cash",
      "sbi",
      "icici",
      "rent",
      "salaries",
      "salary",
      "power bill",
      "electricity",
      "machinary",
      "machinery",
      "misc",
      "sales",
      "purchase",
      "roundoff",
      "round off",
      "bank charges",
      "equitas",
      "cgst",
      "sgst",
      "igst",
      "gst",
      "tds",
      "tcs",
      "capital",
      "drawings",
      "depreciation",
      "opening balance",
      "ca",
      "cc",
      "bank charges",
    ];
    return !blacklist.some((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      return regex.test(n);
    });
  };

  const customerRows = ((customers ?? []) as any[])
    .filter((c) => isActualClient(c.customer_name))
    .map((c) => ({ id: c.id, name: c.customer_name, alias: c.alias }));
  const fabricOptionsAll = ((fabrics ?? []) as any[]).map((f) => ({ id: f.id, label: f.fabric_name }));
  const fabricOptionsActive = ((fabrics ?? []) as any[]).filter(f => f.status === "active").map((f) => ({ id: f.id, label: f.fabric_name }));

  const rotoOptionsAll = ((roto ?? []) as any[]).map((r) => ({ id: r.id, label: r.brand }));
  const rotoOptionsActive = ((roto ?? []) as any[]).filter(r => r.status === "active").map((r) => ({ id: r.id, label: r.brand }));

  const offsetOptionsAll = ((offset ?? []) as any[]).map((o) => ({ id: o.id, label: o.brand }));
  const offsetOptionsActive = ((offset ?? []) as any[]).filter(o => o.status === "active").map((o) => ({ id: o.id, label: o.brand }));

  const laminationOptions = ((laminationProds ?? []) as any[]).filter(l => l.status === "active").map((l) => ({ id: l.id, label: l.name }));
  const finishingOptions = ((finishingProds ?? []) as any[]).filter(f => f.status === "active").map((f) => ({ id: f.id, label: f.name }));
  const colorOptions = ((colors ?? []) as any[]).filter(c => c.status === "active").map((c) => ({ id: c.id, label: c.color_name }));
  const colorOptionsAll = ((colors ?? []) as any[]).map((c) => ({ id: c.id, label: c.color_name }));
  const orderRows = (orders ?? []) as any[];

  return (
    <>
      <PageHeader title="Order Confirmation" description="Create multi-item orders across production departments." />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Place New Sales Order</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryEntryForm
            customers={customerRows}
            fabricProducts={fabricOptionsActive}
            rotoProducts={rotoOptionsActive}
            offsetProducts={offsetOptionsActive}
            laminationProducts={laminationOptions}
            finishingProducts={finishingOptions}
            colorProducts={colorOptions}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recent Orders</CardTitle>
          {permissions.includes("reports.filter_by_date") && (
            <DateFilter date={date} baseUrl="/sales/order-confirmation" />
          )}
        </CardHeader>
        <CardContent>
          {orderRows.length === 0 ? (
            <EmptyState />
          ) : (
            <RecentOrdersTable 
              orders={orderRows} 
              fabrics={fabricOptionsAll}
              rotoProducts={rotoOptionsAll}
              offsetProducts={offsetOptionsAll}
              colors={colorOptionsAll}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
