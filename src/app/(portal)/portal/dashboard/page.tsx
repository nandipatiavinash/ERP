import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock, Plus, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import { signOut } from "@/app/actions";
import { BrandLogo } from "@/components/app/brand-logo";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  pending:    { label: "Pending",    color: "text-amber-700 bg-amber-50 border-amber-200/60",       icon: <Clock className="h-3 w-3" />,        step: 1 },
  confirmed:  { label: "Confirmed",  color: "text-blue-700 bg-blue-50 border-blue-200/60",          icon: <Package className="h-3 w-3" />,      step: 2 },
  dispatched: { label: "Dispatched", color: "text-violet-700 bg-violet-50 border-violet-200/60",    icon: <Truck className="h-3 w-3" />,         step: 3 },
  delivered:  { label: "Delivered",  color: "text-emerald-700 bg-emerald-50 border-emerald-200/60", icon: <CheckCircle className="h-3 w-3" />,   step: 4 },
  cancelled:  { label: "Cancelled",  color: "text-red-700 bg-red-50 border-red-200/60",             icon: <XCircle className="h-3 w-3" />,       step: 0 },
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
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">
              <BrandLogo className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RK Global — Portal</p>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {customerName}
                {customerCode && <span className="ml-2 text-xs font-normal text-slate-500">#{customerCode}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={"/portal/stock" as any}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
            >
              Available Stock
            </Link>
            <Link
              href={"/portal/catalog" as any}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Place Order
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-xs font-medium transition-all"
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
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800 text-xs font-semibold">
            <strong className="font-bold">Account not linked.</strong> Your account is not associated with any customer firm. Please contact your administrator.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders",   value: total,     color: "bg-white border-slate-200/60",   text: "text-slate-900" },
            { label: "Total Billed",   value: `₹${formatNumber(totalBilled, 0)}`, color: "bg-white border-slate-200/60", text: "text-emerald-700" },
            { label: "In Progress",    value: active,    color: "bg-white border-slate-200/60",     text: "text-blue-700" },
            { label: "Delivered",      value: delivered, color: "bg-white border-slate-200/60", text: "text-violet-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border ${stat.color} p-5 shadow-xs`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold font-sans ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Order History</h2>
            <span className="text-xs text-slate-400 font-semibold">{total} orders</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 px-5 py-3 border-b border-slate-100/50 overflow-x-auto bg-slate-50/30">
            {filterTabs.map((tab) => {
              const isActive = filterStatus === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/portal/dashboard?status=${tab.key}` as any}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-slate-950 text-white border-slate-950"
                      : "text-slate-500 bg-white border-slate-200 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-24 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-sm font-bold text-slate-700">
                {!customerId && user.roles?.name !== "admin"
                  ? "No firm linked to your account"
                  : total === 0
                  ? "No orders found"
                  : "No orders in this category"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {total === 0 && customerId ? "Your orders will appear here once dispatched." : ""}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {filteredOrders.map((order: any) => {
                  const orderStatus = order.bill_number ? "delivered" : (order.status === "draft" ? "pending" : order.status);
                  const statusCfg = STATUS_CONFIG[orderStatus] ?? STATUS_CONFIG.pending;
                  const billValue = Number(order.bill_value ?? 0);

                  return (
                    <div key={order.id} className="px-5 py-4.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-sm font-bold text-slate-950">{order.order_number}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${statusCfg.color}`}>
                              {statusCfg.icon} {statusCfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            <span>{formatDate(order.order_date)}</span>
                            {order.bill_number && (
                              <span className="font-mono">Bill: {order.bill_number}</span>
                            )}
                            {/* admin sees firm name */}
                            {user.roles?.name === "admin" && order.customers?.customer_name && (
                              <span className="text-slate-500 font-semibold">{order.customers.customer_name}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {billValue > 0 ? (
                            <p className="text-sm font-bold text-slate-900">₹{formatNumber(billValue, 0)}</p>
                          ) : (
                            <p className="text-xs text-slate-400 font-medium italic">Pending bill</p>
                          )}
                          {order.status !== "cancelled" && (
                            <div className="flex items-center gap-1.5 mt-2 justify-end">
                              {[1, 2, 3, 4].map((step) => (
                                <div
                                  key={step}
                                  className={`h-1.5 w-6 rounded-full ${step <= statusCfg.step ? "bg-slate-950" : "bg-slate-100"}`}
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
                <div className="px-5 py-4 border-t border-slate-100 text-center">
                  <Link href={"/portal/dashboard?status=all" as any} className="text-xs text-slate-900 hover:text-slate-700 font-bold transition-colors">
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
