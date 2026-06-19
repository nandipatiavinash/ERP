import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function ColorsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("fabric_types.view"); // Using existing permission, or colors permission if custom
  const supabase = await createClient();
  const { data } = await supabase
    .from("roto_colors")
    .select("id, color_name, description, status")
    .is("deleted_at", null)
    .order("color_name", { ascending: true })
    .limit(500);
  const params = await searchParams;
  return <MasterPage config={modules["roto-colors"]} rows={(data ?? []) as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />;
}
