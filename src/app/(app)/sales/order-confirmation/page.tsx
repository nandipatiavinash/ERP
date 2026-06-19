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

export default async function OrderConfirmationPage() {
  await requirePermission("sales.view");
  const supabase = await createClient();

  // Fetch all active orders with customer details and order items
  const { data: orders, error: ordersError } = await supabase
    .from("sales_orders")
    .select("*, customers(*), sales_order_items(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (ordersError) throw new Error(ordersError.message);

  const orderRows = (orders ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Entry"
        description="Select a sales order to allocate rolls, review live weight tallies, and confirm deliveries."
      />

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
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
                        <Button asChild size="sm">
                          <Link href={`/sales/order-confirmation/${order.id}` as any}>
                            Open Workspace
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
    </div>
  );
}
