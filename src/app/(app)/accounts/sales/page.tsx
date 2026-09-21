import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { requirePermission, getSessionPermissions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SalesEntryClient } from "./SalesEntryClient";
import { DateFilter } from "@/components/app/date-filter";

export default async function AccountsSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("accounts.sales");
  const permissions = await getSessionPermissions();
  const supabase = await createClient();
  const params = await searchParams;
  const date = params.date || todayInIndia();

  // 1. Fetch pending orders, billed orders, and catalogs concurrently
  const [
    pendingRes,
    billedRes,
    fabricTypesRes,
    rotoRes,
    offsetRes,
    laminationRes,
    finishingRes
  ] = await Promise.all([
    (supabase.from("sales_orders") as any)
      .select("id, order_number, order_date, customer_id, status, vehicle_number, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")
      .eq("status", "confirmed")
      .is("bill_number", null)
      .is("deleted_at", null)
      .order("order_date", { ascending: false }),
    (supabase.from("sales_orders") as any)
      .select("id, order_number, order_date, vehicle_number, bill_number, bill_value, customers(customer_name), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")
      .eq("status", "confirmed")
      .eq("order_date", date)
      .not("bill_number", "is", null)
      .is("deleted_at", null)
      .order("order_date", { ascending: false }),
    supabase.from("fabric_types").select("id, fabric_name"),
    supabase.from("roto_products").select("id, brand, width, height"),
    supabase.from("offset_products").select("id, brand, width, height"),
    supabase.from("lamination_products").select("id, name"),
    supabase.from("finishing_products").select("id, name"),
  ]);

  const pendingOrders = pendingRes.data;
  const billedOrders = billedRes.data;

  // 2. Gather all roll IDs across pending + billed orders to fetch roll data
  const allOrders = [
    ...((pendingOrders ?? []) as any[]),
    ...((billedOrders ?? []) as any[])
  ];
  const allRollIds: string[] = [];
  for (const order of allOrders) {
    for (const item of ((order as any).sales_order_items ?? []) as any[]) {
      const ids = ((item.selected_roll_ids ?? []) as string[]);
      allRollIds.push(...ids);
    }
  }
  const uniqueRollIds = Array.from(new Set(allRollIds));

  // 3. Fetch roll details from all roll tables in chunks of 200 to avoid HeadersOverflowError
  let rolls: any[] = [];
  if (uniqueRollIds.length > 0) {
    const chunks = [];
    for (let i = 0; i < uniqueRollIds.length; i += 200) {
      chunks.push(uniqueRollIds.slice(i, i + 200));
    }
    
    const [
      fabricRes,
      lamRes,
      offsetRes,
      finishingRes,
      rotoFilmRes,
      rotoMetRes
    ] = await Promise.all([
      Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),
      Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, gross_weight, core_weight, net_weight, meters").in("id", chunk).is("deleted_at", null))),
      Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, s_no, supplier_roll_id, weight_kg, gross_weight, core_weight, net_weight, meters").in("id", chunk).is("deleted_at", null))),
      Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, s_no, supplier_roll_id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),
      Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, roll_id, s_no, meters, weight_kg").in("id", chunk).is("deleted_at", null))),
      Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, roll_id, s_no, meters, weight_kg").in("id", chunk).is("deleted_at", null)))
    ]);

    const fabricRolls = fabricRes.flatMap(res => (res.data ?? []) as any[]).map(r => {
      const lpe = Array.isArray(r.loom_production_entries) ? r.loom_production_entries[0] : r.loom_production_entries;
      const netW = Number(lpe?.net_weight ?? r.weight ?? 0);
      const netM = Number(lpe?.net_meters ?? r.meters ?? 0);
      const grossW = Number(lpe?.gross_weight ?? (netW > 0 ? netW + Number(lpe?.core_weight || 0) : 0));
      const coreW = Number(lpe?.core_weight ?? 0);
      return {
        id: r.id,
        roll_number: r.roll_number,
        s_no: r.roll_number,
        weight: netW,
        gross_weight: grossW,
        core_weight: coreW,
        net_weight: netW,
        meters: netM,
        fabric_type_id: r.fabric_type_id,
        loom_production_entries: lpe ? {
          gross_weight: grossW,
          core_weight: coreW,
          net_weight: netW,
          net_meters: netM,
          average_meter_weight: Number(lpe?.average_meter_weight ?? (netM > 0 ? (netW / netM) * 1000 : 0))
        } : null
      };
    });
    const lamRolls = lamRes.flatMap(res => (res.data ?? []) as any[]).map(r => {
      const netW = Number(r.net_weight || r.weight_kg || 0);
      const grossW = Number(r.gross_weight || (netW > 0 ? netW + Number(r.core_weight || 0) : netW));
      const coreW = Number(r.core_weight || 0);
      return {
        id: r.id,
        roll_number: r.s_no ? String(r.s_no) : (r.supplier_roll_id || r.roll_id),
        s_no: r.s_no ?? r.supplier_roll_id ?? r.roll_id,
        weight: netW,
        gross_weight: grossW,
        core_weight: coreW,
        net_weight: netW,
        meters: Number(r.meters || 0),
        fabric_type_id: null
      };
    });
    const offsetRolls = offsetRes.flatMap(res => (res.data ?? []) as any[]).map(r => {
      const netW = Number(r.net_weight || r.weight_kg || 0);
      const grossW = Number(r.gross_weight || (netW > 0 ? netW + Number(r.core_weight || 0) : netW));
      const coreW = Number(r.core_weight || 0);
      return {
        id: r.id,
        roll_number: r.s_no ? String(r.s_no) : (r.supplier_roll_id || r.roll_id),
        s_no: r.s_no ?? r.supplier_roll_id ?? r.roll_id,
        weight: netW,
        gross_weight: grossW,
        core_weight: coreW,
        net_weight: netW,
        meters: Number(r.meters || 0),
        fabric_type_id: null
      };
    });
    const finishingRolls = finishingRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.s_no ? String(r.s_no) : (r.supplier_roll_id || r.bundle_id),
      s_no: r.s_no ?? r.supplier_roll_id ?? r.bundle_id,
      weight: Number(r.weight_kg || 0),
      gross_weight: Number(r.weight_kg || 0),
      core_weight: 0,
      net_weight: Number(r.weight_kg || 0),
      meters: Number(r.num_bags || 0),
      fabric_type_id: null
    }));
    const rotoFilmRolls = rotoFilmRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.s_no ? String(r.s_no) : r.roll_id,
      s_no: r.s_no ?? r.roll_id,
      weight: Number(r.weight_kg || 0),
      gross_weight: Number(r.weight_kg || 0),
      core_weight: 0,
      net_weight: Number(r.weight_kg || 0),
      meters: Number(r.meters || 0),
      fabric_type_id: null
    }));
    const rotoMetRolls = rotoMetRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({
      id: r.id,
      roll_number: r.s_no ? String(r.s_no) : r.roll_id,
      s_no: r.s_no ?? r.roll_id,
      weight: Number(r.weight_kg || 0),
      gross_weight: Number(r.weight_kg || 0),
      core_weight: 0,
      net_weight: Number(r.weight_kg || 0),
      meters: Number(r.meters || 0),
      fabric_type_id: null
    }));

    rolls = [
      ...fabricRolls,
      ...lamRolls,
      ...offsetRolls,
      ...finishingRolls,
      ...rotoFilmRolls,
      ...rotoMetRolls
    ];
  }

  return (
    <>
      <div data-print-hide>
        <PageHeader
          title="Sales Entry"
          description="View confirmed deliveries, enter billing details, and generate journal entries."
        />
      </div>

      <div className="flex flex-col gap-4">
        {permissions.includes("reports.filter_by_date") && (
          <div className="flex justify-end">
            <DateFilter date={date} baseUrl="/accounts/sales" />
          </div>
        )}

        <SalesEntryClient
          pendingOrders={(pendingOrders ?? []) as any[]}
          billedOrders={(billedOrders ?? []) as any[]}
          rolls={rolls}
          fabricTypes={(fabricTypesRes.data ?? []) as any[]}
          rotoProducts={(rotoRes.data ?? []) as any[]}
          offsetProducts={(offsetRes.data ?? []) as any[]}
          laminationProducts={(laminationRes.data ?? []) as any[]}
          finishingProducts={(finishingRes.data ?? []) as any[]}
        />
      </div>
    </>
  );
}
