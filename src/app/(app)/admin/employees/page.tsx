import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function EmployeesAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("employees.view");
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select("id, employee_code, name, department, designation, salary, joining_date, shift_start, shift_end, status")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(500);
  const params = await searchParams;
  return <MasterPage config={modules.employees} rows={(data ?? []) as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />;
}
