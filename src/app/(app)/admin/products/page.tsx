import Link from "next/link";
import { saveRotoProduct, deactivateRotoProduct, saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";
import { MasterPage } from "@/components/app/master-page";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { fetchMasterRows } from "@/lib/master-query";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { RotoColorsPreview } from "./RotoColorsPreview";
import { RotoProductsClient } from "./RotoProductsClient";
import { OffsetProductsClient } from "./OffsetProductsClient";


type Params = { tab?: string; search?: string; sort?: string; direction?: "asc" | "desc" };

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("admin.products");
  const params = await searchParams;
  const tab = params.tab || "fabric";
  const supabase = await createClient();

  // Fetch data based on active tab
  let fabricData: any[] = [];
  let rotoData: any[] = [];
  let offsetData: any[] = [];
  let colorsList: any[] = [];
  let clientList: any[] = [];

  if (tab === "fabric") {
    // Fabric tab does not require client list or colors list
    const result = await fetchMasterRows({ supabase, config: modules["fabric-types"], select: "id, fabric_name, description, status", params, defaultSort: "fabric_name" });
    fabricData = result.rows;
  } else {
    // Load customer dropdown list for print products
    const dbCustomersPromise = supabase
      .from("customers")
      .select("id, customer_name, alias")
      .eq("status", "active")
      .eq("is_internal", "client a/c")
      .is("deleted_at", null)
      .order("customer_name");

    if (tab === "roto") {
      const [customersRes, colorsRes, rotoRes] = await Promise.all([
        dbCustomersPromise,
        supabase
          .from("roto_colors")
          .select("id, color_name")
          .eq("status", "active")
          .order("color_name"),
        supabase
          .from("roto_products")
          .select(`
            id, brand, width, height, num_cylinders, image_url, status, customer_id, 
            customers:customer_id(customer_name, alias),
            roto_product_colors(
              id,
              color_id,
              image_url,
              roto_colors(id, color_name)
            )
          `)
          .order("brand", { ascending: true })
      ]);

      const isActualClient = (name: string) => {
        const n = name.trim().toLowerCase();
        if (n.endsWith(" a/c") || n.endsWith(" a/c.")) return false;
        const blacklist = [
          "cash", "sbi", "icici", "rent", "salaries", "salary", "power bill", 
          "electricity", "machinary", "machinery", "misc", "sales", "purchase", 
          "roundoff", "round off", "bank charges", "equitas", "cgst", "sgst", 
          "igst", "gst", "tds", "tcs", "capital", "drawings", "depreciation", 
          "opening balance", "ca", "cc"
        ];
        return !blacklist.some((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, "i");
          return regex.test(n);
        });
      };

      clientList = ((customersRes.data ?? []) as any[])
        .filter((c) => isActualClient(c.customer_name))
        .map((c) => ({ id: c.id, name: c.customer_name, alias: c.alias }));

      colorsList = colorsRes.data ?? [];
      rotoData = rotoRes.data ?? [];

    } else if (tab === "offset") {
      const [customersRes, offsetRes] = await Promise.all([
        dbCustomersPromise,
        supabase
          .from("offset_products")
          .select("id, brand, width, height, image_url, status, customer_id, customers:customer_id(customer_name, alias)")
          .order("brand", { ascending: true })
      ]);

      const isActualClient = (name: string) => {
        const n = name.trim().toLowerCase();
        if (n.endsWith(" a/c") || n.endsWith(" a/c.")) return false;
        const blacklist = [
          "cash", "sbi", "icici", "rent", "salaries", "salary", "power bill", 
          "electricity", "machinary", "machinery", "misc", "sales", "purchase", 
          "roundoff", "round off", "bank charges", "equitas", "cgst", "sgst", 
          "igst", "gst", "tds", "tcs", "capital", "drawings", "depreciation", 
          "opening balance", "ca", "cc"
        ];
        return !blacklist.some((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, "i");
          return regex.test(n);
        });
      };

      clientList = ((customersRes.data ?? []) as any[])
        .filter((c) => isActualClient(c.customer_name))
        .map((c) => ({ id: c.id, name: c.customer_name, alias: c.alias }));

      offsetData = offsetRes.data ?? [];
    }
  }

  const tabClass = (key: string) =>
    cn(
      "px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors",
      tab === key
        ? "border-primary text-primary bg-background"
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
    );

  return (
    <>
      <PageHeader title="Product Profiles" description="Manage fabric type templates and custom printing products for the factory." />

      <div className="flex border-b border-muted mb-6">
        <Link href={"/admin/products?tab=fabric" as any} className={tabClass("fabric")}>
          Fabric Products
        </Link>
        <Link href={"/admin/products?tab=roto" as any} className={tabClass("roto")}>
          Roto Printing Products
        </Link>
        <Link href={"/admin/products?tab=offset" as any} className={tabClass("offset")}>
          Offset Printing Products
        </Link>
      </div>

      {tab === "fabric" && (
        <MasterPage
          config={modules["fabric-types"]}
          rows={fabricData as never}
          search={params.search ?? ""}
          sort={params.sort}
          direction={params.direction}
          queryParams={{ tab: "fabric" }}
        />
      )}

      {tab === "roto" && (
        <RotoProductsClient
          rotoData={rotoData}
          clientList={clientList}
          colorsList={colorsList}
        />
      )}

      {tab === "offset" && (
        <OffsetProductsClient
          offsetData={offsetData}
          clientList={clientList}
        />
      )}
    </>
  );
}
