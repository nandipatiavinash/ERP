import { saveRawMaterialPurchase } from "@/app/(app)/_actions";
import { MasterPage } from "@/components/app/master-page";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function RawMaterialsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const [{ data }, { data: purchases }] = await Promise.all([
    supabase.from("raw_materials").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase
      .from("raw_material_purchases")
      .select("*, raw_materials(material_name, unit)")
      .is("deleted_at", null)
      .order("purchase_date", { ascending: false })
      .limit(25),
  ]);
  const params = await searchParams;
  const materials = (data ?? []) as any[];
  const purchaseRows = (purchases ?? []) as any[];
  return (
    <>
      <MasterPage config={modules["raw-materials"]} rows={materials as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />

      <PageHeader title="Raw Material Purchases" description="Record real purchase receipts and update stock through Supabase." />
      <Card className="mb-5">
        <CardHeader><CardTitle>New Purchase</CardTitle></CardHeader>
        <CardContent>
          <form action={saveRawMaterialPurchase} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Raw Material</Label>
              <select name="raw_material_id" required className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                <option value="" disabled>Select material</option>
                {materials.filter((material) => material.status === "active").map((material) => (
                  <option key={material.id} value={material.id}>{material.material_name} ({material.unit})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2"><Label>Purchase Date</Label><Input name="purchase_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></div>
            <div className="space-y-2"><Label>Supplier</Label><Input name="supplier_name" /></div>
            <div className="space-y-2"><Label>Bill Number</Label><Input name="bill_number" /></div>
            <div className="space-y-2"><Label>Quantity</Label><Input name="quantity" type="number" step="0.001" required /></div>
            <div className="space-y-2"><Label>Rate</Label><Input name="rate" type="number" step="0.01" required /></div>
            <div className="space-y-2 md:col-span-3"><Label>Remarks</Label><Textarea name="remarks" /></div>
            <div className="md:col-span-3"><Button type="submit">Save Purchase</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Purchases</CardTitle></CardHeader>
        <CardContent>
          {purchaseRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead><TableHead>Material</TableHead><TableHead>Supplier</TableHead><TableHead>Bill</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRows.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                      <TableCell>{purchase.raw_materials?.material_name ?? "-"}</TableCell>
                      <TableCell>{purchase.supplier_name ?? "-"}</TableCell>
                      <TableCell>{purchase.bill_number ?? "-"}</TableCell>
                      <TableCell>{formatNumber(purchase.quantity, 3)} {purchase.raw_materials?.unit ?? ""}</TableCell>
                      <TableCell>{formatNumber(purchase.rate, 2)}</TableCell>
                      <TableCell>{formatNumber(purchase.total_amount, 2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
