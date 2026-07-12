import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock, Plus, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import { signOut } from "@/app/actions";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  pending:    { label: "Pending",    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",       icon: <Clock className="h-3 w-3" />,        step: 1 },
  confirmed:  { label: "Confirmed",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20",          icon: <Package className="h-3 w-3" />,      step: 2 },
  dispatched: { label: "Dispatched", color: "text-violet-400 bg-violet-400/10 border-violet-400/20",    icon: <Truck className="h-3 w-3" />,         step: 3 },
  delivered:  { label: "Delivered",  color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: <CheckCircle className="h-3 w-3" />,   step: 4 },
  cancelled:  { label: "Cancelled",  color: "text-red-400 bg-red-400/10 border-red-400/20",             icon: <XCircle className="h-3 w-3" />,       step: 0 },
};

export default async function PortalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const customerId = (user as any).customer_id;
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const filterStatus = resolvedParams?.status ?? "all";

  // Redirect non-client, non-admin users
  if (!customerId && user.roles?.name !== "admin") {
    // still show page with warning
  }

  // Fetch customer details
  let customerName = "Your Account";
  let customerCode = "";
  if (customerId) {
    const { data: cust } = await (supabase.from("customers") as any)
      .select("customer_name, alias")
      .eq("id", customerId)
      .single();
    if (cust) {
      customerName = cust.customer_name;
      customerCode = cust.alias ?? "";
    }
  } else if (user.roles?.name === "admin") {
    customerName = "Admin Preview";
  }

  // Fetch ALL sales orders for this customer (real ERP orders)
  let ordersData: any[] = [];
  if (customerId) {
    const { data } = await (supabase.from("sales_orders") as any)
      .select("id, order_number, order_date, status, bill_number, bill_value, created_at")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("order_date", { ascending: false });
    ordersData = data ?? [];
  } else if (user.roles?.name === "admin") {
    // Admin: show recent 50 from all customers for preview
    const { data } = await (supabase.from("sales_orders") as any)
      .select("id, order_number, order_date, status, bill_number, bill_value, created_at, customers(customer_name)")
      .is("deleted_at", null)
      .order("order_date", { ascending: false })
      .limit(50);
    ordersData = data ?? [];
  }

  // Stats from full dataset
  const total = ordersData.length;
  const pending  = ordersData.filter((o) => !o.bill_number && (o.status === "pending" || o.status === "draft")).length;
  const active   = ordersData.filter((o) => !o.bill_number && ["confirmed", "dispatched"].includes(o.status)).length;
  const delivered = ordersData.filter((o) => !!o.bill_number || o.status === "delivered").length;
  const totalBilled = ordersData.reduce((s, o) => s + Number(o.bill_value ?? 0), 0);

  // Filter
  const filteredOrders = filterStatus === "all"
    ? ordersData
    : filterStatus === "pending"
    ? ordersData.filter((o) => !o.bill_number && (o.status === "pending" || o.status === "draft"))
    : filterStatus === "active"
    ? ordersData.filter((o) => !o.bill_number && ["confirmed", "dispatched"].includes(o.status))
    : filterStatus === "delivered"
    ? ordersData.filter((o) => !!o.bill_number || o.status === "delivered")
    : ordersData.filter((o) => o.status === filterStatus);

  const filterTabs = [
    { key: "all",       label: "All Orders",  count: total },
    { key: "pending",   label: "Pending",     count: pending },
    { key: "active",    label: "In Progress", count: active },
    { key: "delivered", label: "Delivered",   count: delivered },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShoppingBag className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">RK Global — Client Portal</p>
              <h1 className="text-sm font-bold text-white leading-tight">
                {customerName}
                {customerCode && <span className="ml-2 text-xs font-normal text-slate-400">#{customerCode}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={"/portal/catalog" as any}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25"
            >
              <Plus className="h-3.5 w-3.5" />
              Place Order
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Warning for unlinked accounts */}
        {!customerId && user.roles?.name !== "admin" && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-300 text-sm">
            <strong className="font-semibold">Account not linked.</strong> Your account is not associated with any customer firm. Please contact your administrator.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Orders",   value: total,     color: "from-slate-500/20 to-slate-600/10",   text: "text-slate-100" },
            { label: "Total Billed",   value: `₹${formatNumber(totalBilled, 0)}`, color: "from-emerald-500/20 to-emerald-600/10", text: "text-emerald-300" },
            { label: "In Progress",    value: active,    color: "from-blue-500/20 to-blue-600/10",     text: "text-blue-300" },
            { label: "Delivered",      value: delivered, color: "from-violet-500/20 to-violet-600/10", text: "text-violet-300" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} p-4`}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Order History</h2>
            <span className="text-xs text-slate-400">{total} orders</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-white/5 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = filterStatus === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/portal/dashboard?status=${tab.key}` as any}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-300">
                {!customerId && user.roles?.name !== "admin"
                  ? "No firm linked to your account"
                  : total === 0
                  ? "No orders found"
                  : "No orders in this category"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {total === 0 && customerId ? "Your orders will appear here once dispatched." : ""}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/5">
                {filteredOrders.map((order: any) => {
                  const orderStatus = order.bill_number ? "delivered" : (order.status === "draft" ? "pending" : order.status);
                  const statusCfg = STATUS_CONFIG[orderStatus] ?? STATUS_CONFIG.pending;
                  const billValue = Number(order.bill_value ?? 0);

                  return (
                    <div key={order.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-bold text-white">{order.order_number}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${statusCfg.color}`}>
                              {statusCfg.icon} {statusCfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span>{formatDate(order.order_date)}</span>
                            {order.bill_number && (
                              <span className="font-mono">Bill: {order.bill_number}</span>
                            )}
                            {/* admin sees firm name */}
                            {user.roles?.name === "admin" && order.customers?.customer_name && (
                              <span className="text-slate-400">{order.customers.customer_name}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {billValue > 0 ? (
                            <p className="text-sm font-bold text-white">₹{formatNumber(billValue, 0)}</p>
                          ) : (
                            <p className="text-xs text-slate-500">Pending bill</p>
                          )}
                          {order.status !== "cancelled" && (
                            <div className="flex items-center gap-1 mt-1.5 justify-end">
                              {[1, 2, 3, 4].map((step) => (
                                <div
                                  key={step}
                                  className={`h-1 w-5 rounded-full ${step <= statusCfg.step ? "bg-emerald-400" : "bg-white/10"}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filterStatus !== "all" && (
                <div className="px-5 py-3 border-t border-white/5 text-center">
                  <Link href={"/portal/dashboard?status=all" as any} className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold">
                    View All Orders →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
