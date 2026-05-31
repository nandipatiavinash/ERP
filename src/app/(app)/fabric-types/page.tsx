import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function FabricTypesPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("fabric_types.view");
  const supabase = await createClient();
  const { data } = await supabase.from("fabric_types").select("*").is("deleted_at", null).order("created_at", { ascending: false });
  const params = await searchParams;
  return <MasterPage config={modules["fabric-types"]} rows={(data ?? []) as never} search={params.search ?? ""} page={Number(params.page ?? 1)} sort={params.sort} direction={params.direction} />;
}
