import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock, Plus, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  pending:    { label: "Pending Review",  color: "text-amber-400 bg-amber-400/10 border-amber-400/20",    icon: <Clock className="h-3 w-3" />,        step: 1 },
  confirmed:  { label: "Confirmed",       color: "text-blue-400 bg-blue-400/10 border-blue-400/20",       icon: <Package className="h-3 w-3" />,      step: 2 },
  dispatched: { label: "Dispatched",      color: "text-violet-400 bg-violet-400/10 border-violet-400/20", icon: <Truck className="h-3 w-3" />,         step: 3 },
  delivered:  { label: "Delivered",       color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: <CheckCircle className="h-3 w-3" />, step: 4 },
  cancelled:  { label: "Cancelled",       color: "text-red-400 bg-red-400/10 border-red-400/20",          icon: <XCircle className="h-3 w-3" />,       step: 0 },
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

  // Fetch customer name
  let customerName = "Your Account";
  let customerCode = "";
  if (customerId) {
    const { data: cust } = await (supabase.from("customers") as any)
      .select("customer_name, customer_code")
      .eq("id", customerId)
      .single();
    if (cust) {
      customerName = cust.customer_name;
      customerCode = cust.customer_code ?? "";
    }
  } else if (user.roles?.name === "admin") {
    customerName = "Administrator Preview";
  }

  // Fetch ALL orders (no limit)
  let ordersData: any[] = [];
  if (customerId || user.roles?.name === "admin") {
    const q = (supabase.from("client_orders") as any)
      .select(`
        id, order_number, order_date, status, notes, created_at,
        client_order_items (
          id, item_type, quantity, unit, unit_price,
          fabric_types ( fabric_name, gsm, width ),
          finishing_products ( name )
        )
      `)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (customerId) q.eq("customer_id", customerId);
    const { data } = await q;
    ordersData = data ?? [];
  }

  // Stats (always from full dataset)
  const total = ordersData.length;
  const pending = ordersData.filter((o) => o.status === "pending").length;
  const active = ordersData.filter((o) => ["confirmed", "dispatched"].includes(o.status)).length;
  const delivered = ordersData.filter((o) => o.status === "delivered").length;

  // Apply filter tab
  const filteredOrders = filterStatus === "all"
    ? ordersData
    : filterStatus === "active"
    ? ordersData.filter((o) => ["confirmed", "dispatched"].includes(o.status))
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Place Order
            </Link>
            <form action="/api/auth/signout" method="POST">
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
            <strong className="font-semibold">Account not linked.</strong> Your user account is not associated with any customer firm. Please contact your administrator to link your account.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Orders", value: total, color: "from-slate-500/20 to-slate-600/10", text: "text-slate-100" },
            { label: "Pending Review", value: pending, color: "from-amber-500/20 to-amber-600/10", text: "text-amber-300" },
            { label: "In Progress", value: active, color: "from-blue-500/20 to-blue-600/10", text: "text-blue-300" },
            { label: "Delivered", value: delivered, color: "from-emerald-500/20 to-emerald-600/10", text: "text-emerald-300" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} p-4`}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Your Orders</h2>
            <span className="text-xs text-slate-400">{total} total</span>
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
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>
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
                {total === 0 ? "No orders yet" : `No ${filterStatus === "all" ? "" : filterStatus} orders`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {total === 0 ? "Browse our catalog to place your first order." : "Try a different filter above."}
              </p>
              {total === 0 && (
                <Link
                  href={"/portal/catalog" as any}
                  className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Browse Catalog
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredOrders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const items = (order.client_order_items ?? []) as any[];
                const totalValue = items.reduce((s: number, i: any) => s + Number(i.quantity) * Number(i.unit_price), 0);

                return (
                  <div key={order.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-bold text-white">{order.order_number}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${statusCfg.color}`}>
                            {statusCfg.icon} {statusCfg.label}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex items-center gap-2 text-xs text-slate-400">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                item.item_type === "fabric" ? "bg-blue-500/20 text-blue-300" : "bg-violet-500/20 text-violet-300"
                              }`}>
                                {item.item_type}
                              </span>
                              <span>
                                {item.item_type === "fabric"
                                  ? `${item.fabric_types?.fabric_name ?? "Fabric"} — ${item.quantity} m`
                                  : `${item.finishing_products?.name ?? "Product"} — ${item.quantity} ${item.unit}`}
                              </span>
                            </div>
                          ))}
                          {items.length > 3 && (
                            <p className="text-[10px] text-slate-500">+{items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-500">{formatDate(order.order_date)}</p>
                        {totalValue > 0 && (
                          <p className="text-sm font-bold text-white mt-1">₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                        )}
                        {order.status !== "cancelled" && (
                          <div className="flex items-center gap-1 mt-2 justify-end">
                            {[1,2,3,4].map((step) => (
                              <div key={step} className={`h-1 w-5 rounded-full transition-all ${
                                step <= statusCfg.step ? "bg-emerald-400" : "bg-white/10"
                              }`} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5 text-center">
              <p className="text-[10px] text-slate-500">
                Showing {filteredOrders.length} of {total} total orders
                {filterStatus !== "all" && (
                  <Link href={"/portal/dashboard?status=all" as any} className="ml-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    View All →
                  </Link>
                )}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
