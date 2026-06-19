import { PurchaseForm } from "@/components/app/purchase-form";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function PurchaseEntryPage() {
  await requirePermission("sales.view"); // Matches navGroups permission for this page
  const supabase = await createClient();

  const [{ data: materials }, { data: customers }, { data: purchases }] = await Promise.all([
    supabase
      .from("raw_materials")
      .select("id, material_name, unit, status")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("material_name", { ascending: true }),
    supabase
      .from("customers")
      .select("id, customer_name, alias")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("customer_name"),
    supabase
      .from("raw_material_purchases")
      .select("id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const activeMaterials = (materials ?? []).filter((m: any) => m.status === "active");
  const customerList = (customers ?? []) as any[];
  const purchaseRows = (purchases ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Entry"
        description="Accounting purchase entry and ledger updates."
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>New Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm
            materials={activeMaterials}
            customers={customerList}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseRows.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Bill</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRows.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                      <TableCell>
                        {purchase.raw_materials?.material_name ?? "-"}
                      </TableCell>
                      <TableCell>{purchase.supplier_name ?? "-"}</TableCell>
                      <TableCell>{purchase.bill_number ?? "-"}</TableCell>
                      <TableCell>
                        {formatNumber(purchase.quantity, 2)} {purchase.raw_materials?.unit ?? ""}
                      </TableCell>
                      <TableCell>₹{formatNumber(purchase.rate, 2)}</TableCell>
                      <TableCell>₹{formatNumber(purchase.total_amount, 2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
