import { DeliveryEntryForm } from "@/components/app/delivery-entry-form";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function DeliveryEntryPage() {
  await requirePermission("sales.view");
  const supabase = await createClient();

  const [{ data: customers }, { data: fabrics }, { data: roto }, { data: offset }, { data: orders }] = await Promise.all([
    supabase.from("customers").select("id, customer_name, alias").eq("status", "active").is("deleted_at", null).order("customer_name"),
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height").eq("status", "active").order("brand"),
    supabase.from("offset_products").select("id, brand, width, height").eq("status", "active").order("brand"),
    supabase
      .from("sales_orders")
      .select("*, customers(customer_name, alias), sales_order_items(id, department, quantity)")
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .limit(100),
  ]);

  const customerRows = ((customers ?? []) as any[]).map((c) => ({ id: c.id, name: c.customer_name, alias: c.alias }));
  const fabricOptions = ((fabrics ?? []) as any[]).map((f) => ({ id: f.id, label: f.fabric_name }));
  const rotoOptions = ((roto ?? []) as any[]).map((r) => ({ id: r.id, label: `${r.brand} (${r.width}x${r.height} in)` }));
  const offsetOptions = ((offset ?? []) as any[]).map((o) => ({ id: o.id, label: `${o.brand} (${o.width}x${o.height} in)` }));
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
            fabricProducts={fabricOptions}
            rotoProducts={rotoOptions}
            offsetProducts={offsetOptions}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orderRows.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Firm Name</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderRows.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold text-emerald-950">{order.order_number}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>
                        {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers?.alias})` : ""}
                      </TableCell>
                      <TableCell>{order.sales_order_items?.length ?? 0} items</TableCell>
                      <TableCell>
                        <StatusBadge value={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
