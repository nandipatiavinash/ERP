import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";
import { DateFilter } from "@/components/app/date-filter";
import { ProductPurchaseForm } from "./ProductPurchaseForm";
import { DeleteProductPurchaseButton } from "./delete-button";

export default async function ProductPurchasePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("accounts.product_purchase");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();

  // Fetch catalogs and recent purchases
  const [
    { data: customers },
    { data: fabricTypes },
    { data: rotoProducts },
    { data: offsetProducts },
    { data: laminationProducts },
    { data: finishingProducts },
    { data: purchases }
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("id, customer_name, alias")
      .eq("status", "active")
      .eq("is_internal", "client a/c")
      .is("deleted_at", null)
      .order("customer_name"),
    supabase
      .from("fabric_types")
      .select("id, fabric_name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("fabric_name"),
    supabase
      .from("roto_products")
      .select("id, brand, width, height")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("brand"),
    supabase
      .from("offset_products")
      .select("id, brand, width, height")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("brand"),
    supabase
      .from("lamination_products")
      .select("id, name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("finishing_products")
      .select("id, name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("product_purchases")
      .select(`
        id, purchase_date, supplier_name, bill_number, total_amount, remarks,
        product_purchase_items(id, department, quantity, weight, rate, amount)
      `)
      .eq("purchase_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
  ]);

  const supplierList = (customers ?? []) as any[];
  const purchaseRows = (purchases ?? []) as any[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Purchase"
        description="Record finished product purchases from external suppliers to stock and accounting journals."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Purchase form */}
        <div className="lg:col-span-1">
          <ProductPurchaseForm
            suppliers={supplierList}
            fabricTypes={fabricTypes ?? []}
            rotoProducts={rotoProducts ?? []}
            offsetProducts={offsetProducts ?? []}
            laminationProducts={laminationProducts ?? []}
            finishingProducts={finishingProducts ?? []}
            selectedDate={date}
          />
        </div>

        {/* Purchase Entries List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <span className="text-sm font-semibold text-slate-800">Purchase logs on date</span>
            <DateFilter date={date} baseUrl="/accounts/product-purchase" />
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold text-slate-800">Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {purchaseRows.length === 0 ? (
                <div className="py-12">
                  <EmptyState title="No entries found" description="Select another date or add a new product purchase entry." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-500">
                        <TableHead className="pl-4">Supplier</TableHead>
                        <TableHead>Bill No</TableHead>
                        <TableHead>Items Info</TableHead>
                        <TableHead className="text-right">Total Amount (₹)</TableHead>
                        <TableHead className="w-20 text-center pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseRows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-slate-50/30 border-b border-slate-100 last:border-0">
                          <TableCell className="pl-4 font-semibold text-slate-800 text-xs py-3.5">
                            {row.supplier_name}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs font-mono">
                            {row.bill_number}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 space-y-0.5">
                            {(row.product_purchase_items ?? []).map((item: any) => (
                              <div key={item.id} className="flex gap-2 items-center">
                                <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">
                                  {item.department.replace("-printing", "")}
                                </span>
                                <span>
                                  {formatNumber(item.quantity, 0)} qty / {formatNumber(item.weight, 1)} kg @ ₹{formatNumber(item.rate, 2)}
                                </span>
                              </div>
                            ))}
                          </TableCell>
                          <TableCell className="text-right font-black text-slate-900 text-xs tabular-nums">
                            ₹{formatNumber(row.total_amount, 2)}
                          </TableCell>
                          <TableCell className="text-center pr-4">
                            <DeleteProductPurchaseButton id={row.id} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
