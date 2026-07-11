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
  const specId = decodeURIComponent(id);
  const supabase = await createClient();

  const { data: rollsData, error: rollsError } = await supabase
    .from("lamination_rolls")
    .select("*")
    .eq("roll_id", specId)
    .eq("status", "available")
    .is("deleted_at", null)
    .order("s_no", { ascending: true });

  if (rollsError) {
    throw new Error("Unable to load lamination stock details.");
  }

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
        title={`Laminated Rolls — ${specId}`}
        description={`Detailed view of laminated rolls produced for specification ${specId}.`}
      />

      <StockLaminationRollsClient
        rolls={(rollsData ?? []) as any[]}
        fabricName={specId}
      />
    </div>
  );
}
