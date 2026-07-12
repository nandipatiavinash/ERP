import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PortalCatalogView } from "./PortalCatalogView";

export default async function PortalCatalogPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const customerId = (user as any).customer_id;
  const supabase = await createClient();

  // Fetch fabric types: show general ones (customer_id IS NULL) + their own brand
  const fabricQuery = supabase
    .from("fabric_types")
    .select("id, fabric_name, gsm, width, selling_price, image_url, customer_id")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("fabric_name");

  // Fetch finishing products: same filter
  const finishingQuery = supabase
    .from("finishing_products")
    .select("id, name, image_url, description, dimensions, selling_price, customer_id")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("name");

  const [{ data: allFabrics }, { data: allFinishing }] = await Promise.all([
    fabricQuery,
    finishingQuery,
  ]);

  // Filter: show general (no customer) OR matching the client's customer_id
  const filterProducts = (products: any[]) => {
    if (!products) return [];
    // Admin sees all
    if (user.roles?.name === "admin") return products;
    // Client sees: general + their own brand
    return products.filter(
      (p) => p.customer_id === null || p.customer_id === customerId
    );
  };

  const fabricTypes = filterProducts(allFabrics ?? []);
  const finishingProducts = filterProducts(allFinishing ?? []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            href="/portal/dashboard"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">RK Global — Client Portal</p>
            <h1 className="text-sm font-bold text-white">Product Catalog</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {fabricTypes.length === 0 && finishingProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 text-sm">No products are currently available for your account.</p>
            <p className="text-slate-500 text-xs mt-1">Please contact your administrator to add products.</p>
          </div>
        ) : (
          <PortalCatalogView
            fabricTypes={fabricTypes}
            finishingProducts={finishingProducts}
            customerId={customerId ?? null}
          />
        )}
      </main>
    </div>
  );
}
