import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { RotoPrintingStockClient } from "./RotoPrintingStockClient";

type Params = { tab?: string };

export default async function RotoPrintingStockPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("roto_printing.stock");
  const params = await searchParams;
  const activeTab = params.tab === "all" ? "all" : "available";
  const supabase = await createClient();

  const filmQuery = supabase
    .from("roto_film_rolls")
    .select("*, roto_products(brand)")
    .is("deleted_at", null);

  const metallicQuery = supabase
    .from("roto_metallic_rolls")
    .select("*, roto_film_rolls(brand_id, roto_products(brand))")
    .is("deleted_at", null);

  if (activeTab === "available") {
    filmQuery.eq("status", "available");
    metallicQuery.eq("status", "available");
  }

  const [filmRes, metallicRes] = await Promise.all([filmQuery, metallicQuery]);

  if (filmRes.error) throw new Error(filmRes.error.message);
  if (metallicRes.error) throw new Error(metallicRes.error.message);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roto Printing Stock Inventory"
        description="Film rolls and Metallic rolls grouped by Roto Specification ID, with roll-level drill-down."
      />

      <RotoPrintingStockClient
        filmRolls={(filmRes.data ?? []) as any[]}
        metallicRolls={(metallicRes.data ?? []) as any[]}
        tab={activeTab}
      />
    </div>
  );
}
