import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, todayInIndia } from "@/lib/utils";
import { DateFilter } from "@/components/app/date-filter";
import { Badge } from "@/components/ui/badge";

type Params = { date?: string; tab?: string };

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("sales.delivery_entry");
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();
  const tab = params.tab || "pending";

  // 1. Fetch pending confirmation orders (drafts)
  const { data: pendingOrders, error: pendingError } = await supabase
    .from("sales_orders")
    .select("id, order_number, order_date, status, customers(customer_name, alias), sales_order_items(id)")
    .eq("status", "draft")
    .is("deleted_at", null)
    .order("order_date", { ascending: true })
    .order("order_number", { ascending: true });

  if (pendingError) throw new Error(pendingError.message);

  // 2. Fetch confirmed deliveries for selected date
  const { data: confirmedOrders, error: confirmedError } = await supabase
    .from("sales_orders")
    .select("id, order_number, order_date, status, customers(customer_name, alias), sales_order_items(id)")
    .neq("status", "draft")
    .eq("order_date", date)
    .is("deleted_at", null)
    .order("order_date", { ascending: false })
    .order("order_number", { ascending: true });

  if (confirmedError) throw new Error(confirmedError.message);

  const pendingRows = (pendingOrders ?? []) as any[];
  const confirmedRows = (confirmedOrders ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Entry"
        description="Select a sales order to allocate rolls, review live weight tallies, and confirm deliveries."
      />

      {/* Premium Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex">
          <Link
            href="/sales/order-confirmation?tab=pending"
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
              tab === "pending"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Confirmation ({pendingRows.length})
          </Link>
          <Link
            href={`/sales/order-confirmation?tab=completed&date=${date}`}
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all ${
              tab === "completed"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Confirmed Deliveries ({confirmedRows.length})
          </Link>
        </div>

        {tab === "completed" && (
          <div className="pb-1">
            <DateFilter date={date} baseUrl="/sales/order-confirmation?tab=completed" />
          </div>
        )}
      </div>

      {/* Tab Contents */}
      {tab === "pending" ? (
        /* Card 1: Pending Confirmation */
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              Pending Confirmation
              <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                {pendingRows.length}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Draft sales orders awaiting roll allocation and confirmation.</p>
          </CardHeader>
          <CardContent>
            {pendingRows.length === 0 ? (
              <EmptyState
                title="No pending confirmations"
                description="Draft sales orders awaiting confirmation will appear here."
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50/20">
                      <TableHead>Order Number</TableHead>
                      <TableHead>Firm Name</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRows.map((order) => (
                      <TableRow key={order.id} className="hover:bg-white/60 transition-colors cursor-pointer bg-white">
                        <TableCell className="font-bold text-emerald-950 p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers?.alias})` : ""}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.sales_order_items?.length ?? 0} items
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {formatDate(order.order_date)}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            <StatusBadge value={order.status} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Card 2: Confirmed Deliveries */
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              Confirmed Deliveries
              <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                {confirmedRows.length}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Deliveries confirmed on the selected date.</p>
          </CardHeader>
          <CardContent>
            {confirmedRows.length === 0 ? (
              <EmptyState
                title="No confirmed deliveries today"
                description="Deliveries confirmed on this date will appear here."
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50/20">
                      <TableHead>Order Number</TableHead>
                      <TableHead>Firm Name</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmedRows.map((order) => (
                      <TableRow key={order.id} className="hover:bg-white/60 transition-colors cursor-pointer bg-white">
                        <TableCell className="font-bold text-emerald-950 p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.customers?.customer_name} {order.customers?.alias ? `(${order.customers?.alias})` : ""}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {order.sales_order_items?.length ?? 0} items
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            {formatDate(order.order_date)}
                          </Link>
                        </TableCell>
                        <TableCell className="p-0">
                          <Link href={`/sales/order-confirmation/${order.id}` as any} prefetch={false} className="block p-4">
                            <StatusBadge value={order.status} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
