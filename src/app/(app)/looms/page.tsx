import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function LoomsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("looms.view");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("looms")
    .select("id, loom_number, description, status, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const params = await searchParams;
  return <MasterPage config={modules.looms} rows={(data ?? []) as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />;
}
