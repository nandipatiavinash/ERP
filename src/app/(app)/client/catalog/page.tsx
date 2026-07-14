import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { ClientCatalogView } from "./ClientCatalogView";

export default async function ClientCatalogPage() {
  const user = await requireUser();
  const customerId = user.customer_id;

  if (!customerId && user.roles?.name !== "admin") {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
        <h4 className="font-bold">Account Association Required</h4>
        <p className="text-xs mt-1">Your user account is not linked to any Customer Firm in the system.</p>
      </div>
    );
  }

  const supabase = await createClient();

  // Fetch fabric types and bag specifications in parallel
  const [
    { data: fabricTypes },
    { data: finishingProducts }
  ] = await Promise.all([
    supabase
      .from("fabric_types")
      .select("*")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name", { ascending: true }),
    supabase
      .from("finishing_products")
      .select("*")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("name", { ascending: true })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href={"/client/dashboard" as any} passHref>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Visual Product Catalog"
        description="Select fabrics or finished bags from the catalog, view detailed specifications, and check out instantly."
      />

      <ClientCatalogView
        fabricTypes={(fabricTypes ?? []) as any[]}
        finishingProducts={(finishingProducts ?? []) as any[]}
      />
    </div>
  );
}
