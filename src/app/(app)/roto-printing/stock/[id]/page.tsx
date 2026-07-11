import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockRotoRollsClient } from "./StockRotoRollsClient";

export default async function RotoStockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("roto_printing.stock");
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: brandData, error: brandError },
    { data: filmRolls, error: filmError },
    { data: metallicRolls, error: metallicError },
  ] = await Promise.all([
    supabase.from("roto_products").select("brand").eq("id", id).single(),
    supabase
      .from("roto_film_rolls")
      .select("*")
      .eq("brand_id", id)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("roto_metallic_rolls")
      .select("*, roto_film_rolls(roll_id, brand_id)")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  if (brandError || filmError || metallicError) {
    throw new Error("Unable to load roto stock details.");
  }

  const brandName = (brandData as any)?.brand ?? "Roto Brand";

  // Filter metallic rolls by brand on the server
  const filteredMetallicRolls = (metallicRolls ?? []).filter((r: any) => r.roto_film_rolls?.brand_id === id);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href={"/roto-printing/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Roto Printed Stock — ${brandName}`}
        description={`Detailed view of printed film and metallic rolls for brand ${brandName}.`}
      />

      <StockRotoRollsClient
        filmRolls={(filmRolls ?? []) as any[]}
        metallicRolls={filteredMetallicRolls as any[]}
        brandName={brandName}
      />
    </div>
  );
}
