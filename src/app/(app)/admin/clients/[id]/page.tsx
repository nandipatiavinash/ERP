import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Phone, MapPin, FileText, Hash, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("admin.clients");
  const supabase = await createClient();
  const { id } = await params;

  // Fetch customer details
  const { data: customer, error } = await (supabase.from("customers") as any)
    .select("id, customer_name, alias, phone, gst_number, address, status, customer_code, opening_debit, opening_credit")
    .eq("id", id)
    .single();

  if (error || !customer) notFound();

  // Fetch all sales orders for this customer
  const { data: orders } = await (supabase.from("sales_orders") as any)
    .select("id, order_number, order_date, status, bill_number, bill_value, created_at")
    .eq("customer_id", id)
    .is("deleted_at", null)
    .order("order_date", { ascending: false });

  const allOrders = (orders ?? []) as any[];

  // Compute summary
  const totalOrders = allOrders.length;
  const billedOrders = allOrders.filter((o) => o.bill_number);
  const totalBilled = billedOrders.reduce((s: number, o: any) => s + Number(o.bill_value ?? 0), 0);
  const pendingCount = allOrders.filter((o) => o.status === "confirmed" && !o.bill_number).length;

  const STATUS_LABEL: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Back nav */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="border border-slate-200 rounded-xl p-6 bg-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{customer.customer_name}</h1>
              {customer.alias && (
                <p className="text-sm text-slate-400 font-medium mt-0.5">{customer.alias}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {customer.customer_code && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Hash className="h-3 w-3" /> {customer.customer_code}
                  </span>
                )}
                {customer.phone && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Phone className="h-3 w-3" /> {customer.phone}
                  </span>
                )}
                {customer.gst_number && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <FileText className="h-3 w-3" /> GST: {customer.gst_number}
                  </span>
                )}
                {customer.address && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3" /> {customer.address}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            customer.status === "active"
              ? "bg-white border-slate-300 text-slate-600"
              : "bg-slate-50 border-slate-200 text-slate-400"
          }`}>
            {customer.status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: totalOrders.toString(), sub: "all time" },
          { label: "Total Billed", value: `₹${formatNumber(totalBilled, 0)}`, sub: `${billedOrders.length} billed orders` },
          { label: "Pending Dispatch", value: pendingCount.toString(), sub: "awaiting dispatch" },
        ].map((card) => (
          <div key={card.label} className="border border-slate-200 rounded-xl p-5 bg-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All Orders</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalOrders} orders, total billed ₹{formatNumber(totalBilled, 0)}</p>
          </div>
          <TrendingUp className="h-4 w-4 text-slate-300" />
        </div>

        {allOrders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400">No orders found for this client.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order No.</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill No.</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{order.order_number}</td>
                  <td className="px-4 py-3.5 text-slate-500">{formatDate(order.order_date)}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-700">
                    {order.bill_number || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      order.status === "delivered"
                        ? "border-slate-300 text-slate-600 bg-white"
                        : order.status === "dispatched"
                        ? "border-slate-200 text-slate-500 bg-slate-50"
                        : order.status === "cancelled"
                        ? "border-red-100 text-red-400 bg-red-50"
                        : "border-slate-200 text-slate-400 bg-white"
                    }`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                    {order.bill_value ? `₹${formatNumber(Number(order.bill_value), 0)}` : <span className="font-normal text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand total row */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grand Total</td>
                <td className="px-5 py-3 text-right font-mono font-black text-slate-900">
                  ₹{formatNumber(totalBilled, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
