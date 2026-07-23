import Link from "next/link";
import { ArrowLeft, ShoppingBag, Package, PhoneCall } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/app/brand-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export default async function PortalStockPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const customerId = (user as any).customer_id;
  const supabase = await createClient();

  // Fetch all associated customer IDs
  const customerIds = [customerId].filter(Boolean);
  let customerName = "Your Account";
  let associatedFirmsCount = 0;

  if (customerId) {
    const { data: primaryCust } = await (supabase
      .from("customers") as any)
      .select("id, customer_name, linked_customer_id")
      .eq("id", customerId)
      .single();

    if (primaryCust) {
      customerName = primaryCust.customer_name;

      const parentId = primaryCust.linked_customer_id;
      const { data: siblings } = await (supabase
        .from("customers") as any)
        .select("id")
        .or(`linked_customer_id.eq.${customerId}${parentId ? `,linked_customer_id.eq.${parentId},id.eq.${parentId}` : ""}`);

      if (siblings) {
        siblings.forEach((s: any) => {
          if (!customerIds.includes(s.id)) {
            customerIds.push(s.id);
            associatedFirmsCount++;
          }
        });
      }
    }
  } else if (user.roles?.name === "admin") {
    customerName = "Admin Preview Mode";
  }

  // Fetch fabric types
  const fabricQuery = supabase
    .from("fabric_types")
    .select("id, fabric_name, gsm, width, customer_id")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("fabric_name");

  // Fetch finishing products
  const finishingQuery = supabase
    .from("finishing_products")
    .select("id, name, image_url, description, dimensions, customer_id")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("name");

  // Fetch finishing bundles in stock
  const bundlesQuery = supabase
    .from("finishing_bundles")
    .select("product_id, num_bags, status")
    .eq("status", "available")
    .is("deleted_at", null);

  const [
    { data: allFabrics },
    { data: allFinishing },
    { data: allBundles }
  ] = await Promise.all([fabricQuery, finishingQuery, bundlesQuery]) as any;

  // Map product stock counts
  const productStockMap: Record<string, number> = {};
  ((allBundles as any[]) ?? []).forEach((b) => {
    if (b.product_id) {
      productStockMap[b.product_id] = (productStockMap[b.product_id] || 0) + Number(b.num_bags || 0);
    }
  });

  // Filter: show general (no customer) OR matching any of the client's customer IDs
  const filterFabrics = (fabrics: any[]) => {
    if (!fabrics) return [];
    if (user.roles?.name === "admin") return fabrics;
    return fabrics.filter((p) => p.customer_id === null || customerIds.includes(p.customer_id));
  };

  const filterFinishing = (products: any[]) => {
    if (!products) return [];
    if (user.roles?.name === "admin") return products;
    return products.filter((p) => p.customer_id === null || customerIds.includes(p.customer_id));
  };

  const fabricTypes = filterFabrics(allFabrics ?? []);
  const finishingProducts = filterFinishing(allFinishing ?? []);

  // Split bags by own brand (includes associate brands) vs general brand
  const ownBrandBags = finishingProducts.filter((p) => p.customer_id !== null);
  const generalBrandBags = finishingProducts.filter((p) => p.customer_id === null);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={"/portal/dashboard" as any}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <div className="h-8 w-px bg-slate-200" />
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">
              <BrandLogo className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RK Global — Portal</p>
              <h1 className="text-xs font-bold text-slate-800">Available Stock Catalog</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Welcome</p>
            <h2 className="text-xl md:text-3xl font-black font-sans">
              {customerName}
              {associatedFirmsCount > 0 && (
                <span className="text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-350 border border-emerald-500/35 px-2 py-0.5 rounded-full inline-block ml-3 align-middle uppercase tracking-widest">
                  &amp; {associatedFirmsCount} Associated Firms
                </span>
              )}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl">
              Verify your active Fabric rolls catalog and view your available Bag stocks.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pr-6 pointer-events-none">
            <ShoppingBag className="h-40 w-40" />
          </div>
        </div>

        {/* Fabric Catalog Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Package className="h-5 w-5 text-slate-650" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Fabric Specifications</h3>
          </div>
          {fabricTypes.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No active fabric types linked to your account.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {fabricTypes.map((fab) => (
                <Card key={fab.id} className="border-slate-200 shadow-xs bg-white hover:border-slate-350 transition-all">
                  <CardContent className="p-4 space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fabric ID / Type</span>
                    <h4 className="font-bold text-slate-900 text-sm">{fab.fabric_name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-50">
                      <span>Width: <strong>{fab.width}″</strong></span>
                      <span>GSM: <strong>{fab.gsm}</strong></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bags - Own Brand Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <ShoppingBag className="h-5 w-5 text-indigo-650" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Our Brand Bags (In Stock)</h3>
          </div>
          {ownBrandBags.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No branded bag models found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {ownBrandBags.map((bag) => {
                const stockBags = productStockMap[bag.id] || 0;
                return (
                  <Card key={bag.id} className="border-slate-200 overflow-hidden shadow-xs bg-white flex flex-col hover:border-slate-350 transition-all">
                    {bag.image_url ? (
                      <div className="h-44 w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b">
                        <img src={bag.image_url} alt={bag.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100">
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Branded Bag ID</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{bag.name}</h4>
                        {bag.description && <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{bag.description}</p>}
                        {bag.dimensions && <p className="text-[10px] text-slate-500 font-mono mt-1">Dimensions: {bag.dimensions}</p>}
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-50 border px-2 py-0.5 rounded">
                          {formatNumber(stockBags, 0)} Bags
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Bags - General Brand Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <ShoppingBag className="h-5 w-5 text-slate-650" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">General Bags (In Stock)</h3>
          </div>
          {generalBrandBags.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No general bag models found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {generalBrandBags.map((bag) => {
                const stockBags = productStockMap[bag.id] || 0;
                return (
                  <Card key={bag.id} className="border-slate-200 overflow-hidden shadow-xs bg-white flex flex-col hover:border-slate-350 transition-all">
                    {bag.image_url ? (
                      <div className="h-44 w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b">
                        <img src={bag.image_url} alt={bag.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100">
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">General Product ID</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{bag.name}</h4>
                        {bag.description && <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{bag.description}</p>}
                        {bag.dimensions && <p className="text-[10px] text-slate-500 font-mono mt-1">Dimensions: {bag.dimensions}</p>}
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-50 border px-2 py-0.5 rounded">
                          {formatNumber(stockBags, 0)} Bags
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Support */}
        <div className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-6 text-center space-y-2 mt-8">
          <PhoneCall className="h-6 w-6 text-emerald-650 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">Need a custom dimension or custom printed design?</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our admin team is available 24/7. Call us today for support or customized orders.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TELEPHONE SUPPORT</span>
            <a href="tel:+917661076610" className="text-lg font-black text-emerald-800 hover:text-emerald-950 font-sans tracking-wide">
              FOR ANY OTHER PRODUCT PLEASE CALL 76610 76610
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
