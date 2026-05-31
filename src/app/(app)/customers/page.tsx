import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("customers.view");
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("*").is("deleted_at", null).order("created_at", { ascending: false });
  const params = await searchParams;
  return <MasterPage config={modules.customers} rows={(data ?? []) as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />;
}
