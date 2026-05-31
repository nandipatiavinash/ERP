import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { SalesForm } from "@/components/app/sales-form";
import { StatusBadge } from "@/components/app/status-badge";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function SalesPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const [{ data: customers }, { data: fabrics }, { data: rolls }, { data: orders }] = await Promise.all([
    supabase.from("customers").select("id, customer_name").eq("status", "active").is("deleted_at", null).order("customer_name"),
    supabase.from("fabric_types").select("id, fabric_name").eq("status", "active").is("deleted_at", null).order("fabric_name"),
    supabase.from("fabric_rolls").select("id, roll_number, fabric_type_id, meters, status").in("status", ["available", "reserved"]).is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("sales_orders").select("*, customers(customer_name), fabric_types(fabric_name)").is("deleted_at", null).order("created_at", { ascending: false }),
  ]);
  const orderRows = (orders ?? []) as any[];
  return (
    <>
      <PageHeader title="Sales Orders" description="Create orders, select rolls, and confirm sales to mark rolls sold." />
      <Card className="mb-5">
        <CardHeader><CardTitle>New Sales Order</CardTitle></CardHeader>
        <CardContent>
          <SalesForm
            customers={((customers ?? []) as any[]).map((customer) => ({ id: customer.id, label: customer.customer_name }))}
            fabrics={((fabrics ?? []) as any[]).map((fabric) => ({ id: fabric.id, label: fabric.fabric_name }))}
            rolls={((rolls ?? []) as any[]).map((roll) => ({ ...roll, meters: Number(roll.meters) }))}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
        <CardContent>
          {orderRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Fabric</TableHead><TableHead>Qty</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderRows.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>{order.customers?.customer_name}</TableCell>
                      <TableCell>{order.fabric_types?.fabric_name}</TableCell>
                      <TableCell>{formatNumber(order.quantity_meters)}</TableCell>
                      <TableCell>{formatNumber(order.total_amount)}</TableCell>
                      <TableCell><StatusBadge value={order.status} /></TableCell>
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
