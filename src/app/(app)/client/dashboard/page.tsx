import Link from "next/link";
import { Plus, Package, ShoppingBag, Truck, ClipboardList } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function ClientDashboardPage() {
  const user = await requireUser();
  const customerId = user.customer_id;

  if (!customerId && user.roles?.name !== "admin") {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
        <h4 className="font-bold">Account Association Required</h4>
        <p className="text-xs mt-1">Your user account is not linked to any Customer Firm in the system. Please ask your administrator to link your profile to a customer record.</p>
      </div>
    );
  }

  const supabase = await createClient();

  // 1. Fetch customer details
  let customerName = "Administrator (Demo)";
  if (customerId) {
    const { data: cust } = await (supabase
      .from("customers") as any)
      .select("customer_name")
      .eq("id", customerId)
      .single();
    if (cust) {
      customerName = cust.customer_name;
    }
  }

  // 2. Fetch sales orders with item details
  const query = (supabase
    .from("sales_orders") as any)
    .select(`
      *,
      sales_order_items(
        *,
        fabric_types(fabric_name),
        finishing_products(name)
      )
    `)
    .is("deleted_at", null)
    .order("order_date", { ascending: false })
    .limit(100);

  if (customerId) {
    (query as any).eq("customer_id", customerId);
  }

  const { data: ordersData } = await query;
  const orders = ordersData || [];

  // 3. Compute stats
  const totalCount = orders.length;
  const pendingCount = orders.filter((o: any) => o.status === "draft").length;
  const activeCount = orders.filter((o: any) => o.status === "confirmed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={`Client Dashboard — ${customerName}`}
          description="Manage your purchase orders, browse our catalog, and track your shipments."
        />
        <Link href={"/client/catalog" as any} passHref>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 h-9">
            <Plus className="h-4 w-4" /> Place New Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Lifetime orders placed</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Awaiting backend approval</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Active & Dispatched</CardTitle>
            <Truck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeCount}</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Approved or shipped orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Logs Table */}
      <Card className="shadow-none border-slate-200 bg-white">
        <CardHeader className="py-4 bg-slate-50/40 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">Your Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 stroke-[1.5]" />
              <h3 className="mt-2 text-sm font-semibold text-slate-700">No orders placed yet</h3>
              <p className="mt-1 text-xs text-slate-500">Select items from our visual catalog to place your first order.</p>
              <div className="mt-4">
                <Link href={"/client/catalog" as any} passHref>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Ordered Items</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking Step</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => {
                    const items = (order.sales_order_items ?? []) as any[];
                    // Sum total price estimate based on item price & quantity
                    const totalPrice = items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.price || 0), 0);

                    return (
                      <TableRow key={order.id} className="hover:bg-slate-50/30">
                        <TableCell className="font-mono font-bold text-slate-900">{order.order_number}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(order.order_date)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <div key={item.id} className="text-xs font-semibold text-slate-700">
                                <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 mr-1.5">
                                  {item.department}
                                </span>
                                {item.department === "fabric"
                                  ? `${item.fabric_types?.fabric_name ?? "Fabric"} — ${formatNumber(item.quantity, 0)} m`
                                  : `${item.finishing_products?.name ?? "Bags"} — ${formatNumber(item.quantity, 0)} bags`
                                }
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-slate-900">
                          {totalPrice > 0 ? `₹${formatNumber(totalPrice, 2)}` : "Pending Quote"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={order.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {order.status === "draft" && (
                            <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              1. Pending Review
                            </span>
                          )}
                          {order.status === "confirmed" && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              2. Confirmed & Active
                            </span>
                          )}
                          {order.status === "cancelled" && (
                            <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              Cancelled
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
