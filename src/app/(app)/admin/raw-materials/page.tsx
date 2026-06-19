import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { fetchMasterRows } from "@/lib/master-query";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function RawMaterialsAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("raw_materials.view");
  const supabase = await createClient();
  const params = await searchParams;
  const result = await fetchMasterRows({ supabase, config: modules["raw-materials"], select: "id, material_name, description, department, critical_level, status", params, defaultSort: "material_name" });
  return (
    <MasterPage
      config={modules["raw-materials"]}
      rows={result.rows as never}
      search={params.search ?? ""}
      page={result.page}
      sort={result.sort}
      direction={result.direction}
      totalRows={result.totalRows}
    />
  );
}
