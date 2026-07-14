import { getSessionUser, requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CatalogClient } from "./CatalogClient";

export default async function AdminCatalogPage() {
  await requirePermission("admin.products"); // Admin permission for managing products

  const supabase = await createClient();

  // Fetch catalog specifications and options in parallel
  const [
    { data: fabrics },
    { data: finishing },
    { data: dbCustomers },
    { data: rotoProds },
    { data: offsetProds }
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("*, customers:customer_id(customer_name, alias)")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("finishing_products")
      .select("*, customers:customer_id(customer_name, alias), roto:roto_product_id(brand), offset:offset_product_id(brand), fabric:fabric_type_id(fabric_name)")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("customers")
      .select("id, customer_name, alias")
      .eq("status", "active")
      .eq("is_internal", "client a/c")
      .is("deleted_at", null)
      .order("customer_name"),
    supabase.from("roto_products").select("id, brand").eq("status", "active"),
    supabase.from("offset_products").select("id, brand").eq("status", "active")
  ]);

  const clients = ((dbCustomers ?? []) as any[]).map((c: any) => ({
    id: c.id,
    name: c.customer_name,
    alias: c.alias,
  }));

  const mappedFabrics = ((fabrics ?? []) as any[]).map((f: any) => ({
    id: f.id,
    fabric_name: f.fabric_name,
    gsm: f.gsm,
    width: f.width,
    selling_price: f.selling_price,
    image_url: f.image_url,
    customer_id: f.customer_id,
    customers: f.customers,
    type: "fabric" as const
  }));

  const mappedFinishing = ((finishing ?? []) as any[]).map((f: any) => ({
    id: f.id,
    name: f.name,
    dimensions: f.dimensions,
    description: f.description,
    selling_price: f.selling_price,
    image_url: f.image_url,
    customer_id: f.customer_id,
    customers: f.customers,
    type: "finishing" as const,
    
    // Add production default fields
    fabric_type_id: f.fabric_type_id,
    roto_product_id: f.roto_product_id,
    offset_product_id: f.offset_product_id,
    film_type: f.film_type,
    is_metallic: f.is_metallic,
    lamination_type: f.lamination_type,
    offset_type: f.offset_type,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <CatalogClient
        initialFabrics={mappedFabrics}
        initialFinishing={mappedFinishing}
        clients={clients}
        fabricTypes={mappedFabrics}
        rotoProducts={rotoProds ?? []}
        offsetProducts={offsetProds ?? []}
      />
    </div>
  );
}
