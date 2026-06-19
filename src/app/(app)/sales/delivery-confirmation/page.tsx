import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function DeliveryConfirmationPage() {
  await requirePermission("sales.view");
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("sales_orders")
    .select("*, customers(customer_name, alias), sales_order_items(id, department, quantity)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const orderRows = (orders ?? []) as any[];

  return (
    <>
      <PageHeader title="Delivery Confirmation" description="Assign inventory rolls to placed orders and confirm sales deliveries." />
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders for Roll Allocation</CardTitle>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
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
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant={order.status === "confirmed" ? "outline" : "default"}>
                          <Link href={`/sales/delivery-confirmation/${order.id}` as any}>
                            {order.status === "confirmed" ? "Edit Roll Allocation" : "Allocate Rolls"}
                          </Link>
                        </Button>
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
