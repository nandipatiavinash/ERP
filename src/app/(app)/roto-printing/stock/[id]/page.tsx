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
  const specId = decodeURIComponent(id);
  const supabase = await createClient();

  const [
    { data: filmRolls, error: filmError },
    { data: metallicRolls, error: metallicError },
  ] = await Promise.all([
    supabase
      .from("roto_film_rolls")
      .select("*")
      .eq("roll_id", specId)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("s_no", { ascending: true }),
    supabase
      .from("roto_metallic_rolls")
      .select("*")
      .eq("roll_id", specId)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("s_no", { ascending: true }),
  ]);

  if (filmError || metallicError) {
    throw new Error("Unable to load roto stock details.");
  }

  const brandName = specId;

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
        description={`Detailed view of printed film and metallic rolls for specification ${brandName}.`}
      />

      <StockRotoRollsClient
        filmRolls={(filmRolls ?? []) as any[]}
        metallicRolls={(metallicRolls ?? []) as any[]}
        brandName={brandName}
      />
    </div>
  );
}
