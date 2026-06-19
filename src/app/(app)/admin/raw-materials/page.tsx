import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function RawMaterialsAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("raw_materials.view");
  const supabase = await createClient();
  const { data } = await supabase
    .from("raw_materials")
    .select("id, material_name, description, unit, department, critical_level, status")
    .is("deleted_at", null)
    .order("material_name", { ascending: true })
    .limit(500);

  const params = await searchParams;
  const materials = (data ?? []) as any[];
  return (
    <MasterPage
      config={modules["raw-materials"]}
      rows={materials as never}
      search={params.search ?? ""}
      page={Number(params.page ?? 1)}
      sort={params.sort}
      direction={params.direction}
    />
  );
}
