import { getSessionUser, requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CatalogClient } from "./CatalogClient";

export default async function AdminCatalogPage() {
  await requirePermission("admin.products"); // Admin permission for managing products

  const supabase = await createClient();

  // Fetch all active fabric types (not soft deleted)
  const { data: fabrics } = await (supabase
    .from("fabric_types") as any)
    .select("*, customers:customer_id(customer_name, alias)")
    .is("deleted_at", null)
    .order("fabric_name");

  // Fetch all active finishing products (not soft deleted)
  const { data: finishing } = await (supabase
    .from("finishing_products") as any)
    .select("*, customers:customer_id(customer_name, alias)")
    .is("deleted_at", null)
    .order("name");

  // Fetch customer clients list for selection dropdown
  const { data: dbCustomers } = await (supabase
    .from("customers") as any)
    .select("id, customer_name, alias")
    .eq("status", "active")
    .eq("is_internal", "client a/c")
    .is("deleted_at", null)
    .order("customer_name");

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
    type: "finishing" as const
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <CatalogClient
        initialFabrics={mappedFabrics}
        initialFinishing={mappedFinishing}
        clients={clients}
      />
    </div>
  );
}
