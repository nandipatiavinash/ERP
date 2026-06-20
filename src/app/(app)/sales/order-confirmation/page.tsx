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

type Params = { page?: string };

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("sales.view");
  const supabase = await createClient();
  const params = await searchParams;
  const page = Math.max(Number(params.page ?? 1) || 1, 1);
  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  // Fetch all active orders with customer details and order items
  const { data: orders, error: ordersError, count } = await supabase
    .from("sales_orders")
    .select("id, order_number, order_date, status, customers(customer_name, alias), sales_order_items(id)", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (ordersError) throw new Error(ordersError.message);

  const orderRows = (orders ?? []) as any[];
  const totalRows = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const pageHref = (nextPage: number) => `/sales/order-confirmation${nextPage > 1 ? `?page=${nextPage}` : ""}`;

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderRows.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <TableCell className="font-bold text-emerald-950 p-0">
                        <Link href={`/sales/order-confirmation/${order.id}` as any} className="block p-4">
                          {order.order_number}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/sales/order-confirmation/${order.id}` as any} className="block p-4">
                          {formatDate(order.order_date)}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/sales/order-confirmation/${order.id}` as any} className="block p-4">
                          {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers?.alias})` : ""}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/sales/order-confirmation/${order.id}` as any} className="block p-4">
                          {order.sales_order_items?.length ?? 0} items
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/sales/order-confirmation/${order.id}` as any} className="block p-4">
                          <StatusBadge value={order.status} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div>Showing {orderRows.length} of {totalRows} orders</div>
                <div className="flex gap-2">
                  {page <= 1 ? (
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                  ) : (
                    <Button asChild variant="outline" size="sm"><Link href={pageHref(page - 1) as any}>Previous</Link></Button>
                  )}
                  {page >= totalPages ? (
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  ) : (
                    <Button asChild variant="outline" size="sm"><Link href={pageHref(page + 1) as any}>Next</Link></Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
