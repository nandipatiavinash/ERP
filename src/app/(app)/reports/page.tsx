import { PageHeader } from "@/components/app/page-header";
import { ExportButtons } from "@/components/app/export-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type Params = { from?: string; to?: string; search?: string };

type DailyProductionRow = Database["public"]["Tables"]["loom_production_entries"]["Row"] & {
  fabric_types?: { fabric_name: string | null };
  looms?: { loom_number: string | null };
};

type FabricRollRow = Database["public"]["Tables"]["fabric_rolls"]["Row"] & {
  fabric_types?: { fabric_name: string | null };
};

type SalesOrderRow = Database["public"]["Tables"]["sales_orders"]["Row"] & {
  customers?: { customer_name: string | null };
  fabric_types?: { fabric_name: string | null };
};

type AttendanceRow = Database["public"]["Tables"]["attendance"]["Row"] & {
  employees?: { name: string | null; employee_code: string | null };
};

type EmployeeRow = Database["public"]["Tables"]["employees"]["Row"];

type RawMaterialRow = Database["public"]["Tables"]["raw_materials"]["Row"];

type RawMaterialPurchaseRow = Database["public"]["Tables"]["raw_material_purchases"]["Row"] & {
  raw_materials?: { material_name: string | null; unit: string | null };
};

type ReportRow = Record<string, unknown>;

function inText(row: Record<string, unknown>, search: string) {
  if (!search) return true;
  return Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase());
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireUser();
  const params = await searchParams;
  const from = params.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  const to = params.to || new Date().toISOString().slice(0, 10);
  const search = params.search ?? "";
  const supabase = await createClient();
  const [productionResult, rollsResult, rawResult, rawPurchaseResult, salesResult, attendanceResult, employeeResult] = await Promise.all([
    supabase.from("loom_production_entries").select("*, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }),
    supabase.from("fabric_rolls").select("*, fabric_types(fabric_name)").is("deleted_at", null),
    supabase.from("raw_materials").select("*").is("deleted_at", null).order("material_name"),
    supabase.from("raw_material_purchases").select("*, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }),
    supabase.from("sales_orders").select("*, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }),
    supabase.from("attendance").select("*, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }),
    supabase.from("employees").select("*").is("deleted_at", null).order("name"),
  ]);

  const production = ((productionResult.data ?? []) as DailyProductionRow[]).map((row) => ({
    date: row.entry_date,
    serial: row.serial_number,
    fabric: row.fabric_types?.fabric_name ?? "",
    loom: row.looms?.loom_number ?? "",
    weight: Number(row.net_weight),
    meters: Number(row.net_meters),
  })).filter((row) => inText(row, search));

  const fabricStock = Object.values(((rollsResult.data ?? []) as FabricRollRow[]).filter((roll) => roll.status === "available").reduce<Record<string, { fabric: string | null; rolls: number; weight: number; meters: number }>>((acc, roll) => {
    const key = roll.fabric_type_id;
    acc[key] ??= {
      fabric: roll.fabric_types?.fabric_name ?? null,
      rolls: 0,
      weight: 0,
      meters: 0,
    };
    acc[key].rolls += 1;
    acc[key].weight += Number(roll.weight ?? "0");
    acc[key].meters += Number(roll.meters ?? "0");
    return acc;
  }, {})).filter((row) => inText(row, search));

  const rawPurchases = ((rawPurchaseResult.data ?? []) as RawMaterialPurchaseRow[]).map((row) => ({
    date: row.purchase_date,
    material: row.raw_materials?.material_name ?? "",
    supplier: row.supplier_name ?? "",
    bill: row.bill_number ?? "",
    quantity: Number(row.quantity),
    rate: Number(row.rate),
    amount: Number(row.total_amount),
  })).filter((row) => inText(row, search));

  const sales = ((salesResult.data ?? []) as SalesOrderRow[]).map((row) => ({
    date: row.order_date,
    order: row.order_number,
    customer: row.customers?.customer_name ?? "",
    fabric: row.fabric_types?.fabric_name ?? "",
    quantity: Number(row.quantity_meters),
    amount: Number(row.total_amount),
    status: row.status,
  })).filter((row) => inText(row, search));

  return (
    <>
      <PageHeader title="Reports" description="Production, inventory, sales, and HR reports with date filters and export." />
      <form className="no-print mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
        <Input type="date" name="from" defaultValue={from} />
        <Input type="date" name="to" defaultValue={to} />
        <Input name="search" defaultValue={search} placeholder="Search reports" />
        <button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply Filters</button>
      </form>
      <div className="space-y-5">
        <ReportTable title="Daily Production" filename="daily-production" rows={production} columns={["date", "serial", "fabric", "loom", "weight", "meters"]} />
        <ReportTable title="Fabric Stock" filename="fabric-stock" rows={fabricStock as ReportRow[]} columns={["fabric", "rolls", "weight", "meters"]} />
        <ReportTable title="Raw Material Stock" filename="raw-material-stock" rows={(rawResult.data ?? []) as unknown as ReportRow[]} columns={["material_name", "unit", "opening_stock", "current_stock", "status"]} />
        <ReportTable title="Raw Material Purchases" filename="raw-material-purchases" rows={rawPurchases} columns={["date", "material", "supplier", "bill", "quantity", "rate", "amount"]} />
        <ReportTable title="Customer Wise Sales" filename="sales" rows={sales} columns={["date", "order", "customer", "fabric", "quantity", "amount", "status"]} />
        <ReportTable title="Attendance Report" filename="attendance" rows={((attendanceResult.data ?? []) as AttendanceRow[]).map((row) => ({ date: row.attendance_date, employee: `${row.employees?.employee_code ?? ""} ${row.employees?.name ?? ""}`.trim(), check_in: row.check_in, check_out: row.check_out, status: row.status })).filter((row) => inText(row, search))} columns={["date", "employee", "check_in", "check_out", "status"]} />
        <ReportTable title="Employee Report" filename="employees" rows={(employeeResult.data ?? []) as unknown as ReportRow[]} columns={["employee_code", "name", "department", "designation", "salary", "status"]} />
      </div>
    </>
  );
}

function ReportTable({ title, filename, rows, columns }: { title: string; filename: string; rows: Record<string, unknown>[]; columns: string[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <ExportButtons filename={filename} rows={rows} />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{column.replaceAll("_", " ")}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => {
                    const value = row[column];
                    const display = column.includes("date") ? formatDate(String(value)) : typeof value === "number" ? formatNumber(value, column.includes("weight") ? 3 : 2) : String(value ?? "-");
                    return <TableCell key={column}>{display}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
