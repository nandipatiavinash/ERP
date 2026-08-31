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

  // Fetch Catalogs + Available stock rolls for linkage + Colors list for Roto specs
  const [
    { data: customers },
    { data: fabricTypes },
    { data: rotoProducts },
    { data: offsetProducts },
    { data: finishingProducts },
    { data: colors },
    { data: availableFabricRolls },
    { data: availableLaminationRolls },
    { data: availableOffsetRolls },
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
      .order("brand"),
    supabase
      .from("offset_products")
      .select("id, brand, width, height")
      .eq("status", "active")
      .order("brand"),
    supabase
      .from("finishing_products")
      .select("id, name")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("roto_colors")
      .select("id, color_name")
      .is("deleted_at", null)
      .order("color_name"),
    supabase
      .from("fabric_rolls")
      .select("id, roll_number, weight, meters, fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_number"),
    supabase
      .from("lamination_rolls")
      .select("id, roll_id, s_no, weight_kg, meters, fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("offset_rolls")
      .select("id, roll_id, s_no, weight_kg, fabric_type_id")
      .eq("status", "available")
      .is("deleted_at", null)
      .order("roll_id"),
    supabase
      .from("product_purchases")
      .select(`
        id, purchase_date, supplier_name, bill_number, total_amount, remarks,
        product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)
      `)
      .eq("purchase_date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
  ]);

  const supplierList = (customers ?? []) as any[];
  const purchaseRows = (purchases ?? []) as any[];

  // Map created stock IDs to their generated roll_id / roll_number for user visibility
  const stockIdsByDept: Record<string, string[]> = {
    fabric: [],
    lamination: [],
    "offset-printing": [],
    "roto-printing": [],
    finishing: []
  };

  const allItems = purchaseRows.flatMap(p => p.product_purchase_items || []);
  allItems.forEach((item: any) => {
    if (item.created_stock_id) {
      stockIdsByDept[item.department]?.push(item.created_stock_id);
    }
  });

  const [
    { data: dbFabricRolls },
    { data: dbLamRolls },
    { data: dbOffsetRolls },
    { data: dbFilmRolls },
    { data: dbMetallicRolls },
    { data: dbFinishBundles }
  ] = await Promise.all([
    stockIdsByDept.fabric.length > 0
      ? supabase.from("fabric_rolls").select("id, roll_number").in("id", stockIdsByDept.fabric)
      : Promise.resolve({ data: [] }),
    stockIdsByDept.lamination.length > 0
      ? supabase.from("lamination_rolls").select("id, roll_id").in("id", stockIdsByDept.lamination)
      : Promise.resolve({ data: [] }),
    stockIdsByDept["offset-printing"].length > 0
      ? supabase.from("offset_rolls").select("id, roll_id").in("id", stockIdsByDept["offset-printing"])
      : Promise.resolve({ data: [] }),
    stockIdsByDept["roto-printing"].length > 0
      ? supabase.from("roto_film_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])
      : Promise.resolve({ data: [] }),
    stockIdsByDept["roto-printing"].length > 0
      ? supabase.from("roto_metallic_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])
      : Promise.resolve({ data: [] }),
    stockIdsByDept.finishing.length > 0
      ? supabase.from("finishing_bundles").select("id, bundle_id").in("id", stockIdsByDept.finishing)
      : Promise.resolve({ data: [] }),
  ]);

  const stockMap = new Map<string, string>();
  (dbFabricRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_number));
  (dbLamRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));
  (dbOffsetRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));
  (dbFilmRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));
  (dbMetallicRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));
  (dbFinishBundles || []).forEach((r: any) => stockMap.set(r.id, r.bundle_id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Purchase"
        description="Record finished product purchases from external suppliers to stock and accounting journals."
      />

      <div className="space-y-6">
        {/* Purchase form */}
        <div>
          <ProductPurchaseForm
            suppliers={supplierList}
            fabricTypes={fabricTypes ?? []}
            rotoProducts={rotoProducts ?? []}
            offsetProducts={offsetProducts ?? []}
            finishingProducts={finishingProducts ?? []}
            colors={colors ?? []}
            availableFabricRolls={availableFabricRolls ?? []}
            availableLaminationRolls={availableLaminationRolls ?? []}
            availableOffsetRolls={availableOffsetRolls ?? []}
            selectedDate={date}
          />
        </div>

        {/* Purchase Entries List */}
        <div className="space-y-4">
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
                          <TableCell className="text-xs text-slate-600 space-y-1">
                            {(row.product_purchase_items ?? []).map((item: any) => {
                              const generatedId = item.created_stock_id ? stockMap.get(item.created_stock_id) : null;
                              return (
                                <div key={item.id} className="flex flex-col gap-0.5 border-l-2 border-emerald-500 pl-2">
                                  <div className="flex gap-2 items-center">
                                    <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">
                                      {item.department.replace("-printing", "")}
                                    </span>
                                    <span className="font-semibold">
                                      {formatNumber(item.quantity, 0)} {item.department === "finishing" ? "bags" : "mtrs"} / {formatNumber(item.weight, 1)} kg
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 pt-0.5 flex-wrap">
                                    {generatedId && (
                                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">
                                        Roll Tag: {generatedId}
                                      </span>
                                    )}
                                    {item.supplier_roll_id && (
                                      <span className="text-slate-600">
                                        Supplier ID: <strong className="text-slate-800 font-semibold">{item.supplier_roll_id}</strong>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
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
