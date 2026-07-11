import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StockLaminationRollsClient } from "./StockLaminationRollsClient";

export default async function LaminationStockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("lamination.stock");
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: fabricData, error: fabricError },
    { data: rolls, error: rollsError },
  ] = await Promise.all([
    supabase.from("fabric_types").select("fabric_name").eq("id", id).single(),
    supabase
      .from("lamination_rolls")
      .select("*")
      .eq("fabric_type_id", id)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  if (fabricError || rollsError) {
    throw new Error("Unable to load lamination stock details.");
  }

  const fabricName = (fabricData as any)?.fabric_name ?? "Fabric";

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href={"/lamination/stock" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Stock Inventory
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Laminated Rolls — ${fabricName}`}
        description={`Detailed view of laminated rolls produced using ${fabricName}.`}
      />

      <StockLaminationRollsClient
        rolls={(rolls ?? []) as any[]}
        fabricName={fabricName}
      />
    </div>
  );
}
