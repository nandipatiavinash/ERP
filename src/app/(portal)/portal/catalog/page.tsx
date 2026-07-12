import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PortalCatalogView } from "./PortalCatalogView";
import { BrandLogo } from "@/components/app/brand-logo";

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
    .select("id, name, image_url, description, dimensions, selling_price, customer_id, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("name");

  const [{ data: allFabrics }, { data: allFinishing }, { data: rotoProds }, { data: offsetProds }] = await Promise.all([
    fabricQuery,
    finishingQuery,
    supabase.from("roto_products").select("id, brand, status").eq("status", "active"),
    supabase.from("offset_products").select("id, brand, status").eq("status", "active"),
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
              <h1 className="text-xs font-bold text-slate-800">Product Catalog</h1>
            </div>
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
            rotoProducts={rotoProds ?? []}
            offsetProducts={offsetProds ?? []}
            customerId={customerId ?? null}
          />
        )}
      </main>
    </div>
  );
}
