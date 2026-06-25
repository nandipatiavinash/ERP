import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { RotoProductionClient } from "./RotoProductionClient";

export default async function RotoPrintingProductionPage() {
  await requirePermission("roto_printing.production");
  const supabase = await createClient();

  const [
    { data: activeProducts },
    { data: activeColors },
    { data: activeCustomers },
    { data: availableFilmRolls },
    { data: todayFilmEntries },
    { data: todayMetallicEntries },
  ] = await Promise.all([
    supabase.from("roto_products").select("id, brand, customer_id").eq("status", "active").order("brand"),
    supabase.from("roto_colors").select("id, color_name").eq("status", "active").order("color_name"),
    supabase.from("customers").select("id, customer_name, alias").is("deleted_at", null).order("customer_name"),
    supabase.from("roto_film_rolls").select("id, roll_id, weight_kg, meters").eq("status", "available").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("roto_film_rolls").select("*, roto_products(brand), roto_colors(color_name)").is("deleted_at", null).order("created_at", { ascending: false }).limit(30),
    supabase.from("roto_metallic_rolls").select("*, roto_film_rolls(roll_id)").is("deleted_at", null).order("created_at", { ascending: false }).limit(30),
  ]);

  const rotoProducts = (activeProducts ?? []) as any[];
  const rotoColors = (activeColors ?? []) as any[];
  const customers = (activeCustomers ?? []) as any[];
  const filmRolls = (availableFilmRolls ?? []) as any[];
  const filmRows = (todayFilmEntries ?? []) as any[];
  const metallicRows = (todayMetallicEntries ?? []) as any[];

  return (
    <>
      <PageHeader
        title="Roto Printing Production"
        description="Record Film Production and Metallic Production outputs."
      />

      <RotoProductionClient
        rotoProducts={rotoProducts}
        rotoColors={rotoColors}
        customers={customers}
        filmRolls={filmRolls}
        filmRows={filmRows}
        metallicRows={metallicRows}
      />
    </>
  );
}
