import type { ModuleConfig } from "@/lib/modules";

type MasterParams = {
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
};

function cleanSearch(value: string) {
  return value.trim().replace(/[%,()]/g, " ");
}

export async function fetchMasterRows({
  supabase,
  config,
  select,
  params,
  defaultSort,
}: {
  supabase: any;
  config: ModuleConfig;
  select: string;
  params: MasterParams;
  defaultSort: string;
}) {
  const direction: "asc" | "desc" = params.direction === "desc" ? "desc" : "asc";
  const sort = config.columns.some((column) => column.key === params.sort) ? String(params.sort) : defaultSort;
  const search = cleanSearch(params.search ?? "");

  let query = supabase
    .from(config.table)
    .select(select)
    .is("deleted_at", null);

  if (search) {
    query = query.or(config.searchColumns.map((column: string) => `${column}.ilike.%${search}%`).join(","));
  }

  let response = await query.order(sort, { ascending: direction === "asc" });

  if (
    response.error &&
    (response.error.code === "42703" || /deleted_at.*does not exist|column .*deleted_at.*does not exist/i.test(response.error.message))
  ) {
    let fallbackQuery = supabase
      .from(config.table)
      .select(select);

    if (search) {
      fallbackQuery = fallbackQuery.or(config.searchColumns.map((column: string) => `${column}.ilike.%${search}%`).join(","));
    }

    response = await fallbackQuery.order(sort, { ascending: direction === "asc" });
  }

  const { data, error } = response;
  if (error) throw new Error(error.message);

  return {
    rows: data ?? [],
    sort,
    direction,
  };
}
