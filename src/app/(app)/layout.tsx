import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { AppShell } from "@/components/app/app-shell";
import { getSessionPermissions, requireUser } from "@/lib/auth";
import type { RoleName } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

// ISS-017 / PERF-02: Cache low-stock lookup so it is not re-queried on every
// page navigation. TTL = 60 s; also tagged "low-stock" so any raw-material
// mutation can call revalidateTag("low-stock") to invalidate it immediately.
const getLowStockItems = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data: rawMaterials } = await supabase
      .from("raw_materials")
      .select("material_name, current_stock, critical_level, unit")
      .eq("status", "active")
      .is("deleted_at", null);

    return (rawMaterials ?? [])
      .filter((m: any) => Number(m.current_stock ?? 0) <= Number(m.critical_level ?? 0))
      .map((m: any) => ({
        name: m.material_name,
        stock: Number(m.current_stock ?? 0),
        limit: Number(m.critical_level ?? 0),
        unit: m.unit,
      }));
  },
  ["low-stock-items"],
  { revalidate: 60, tags: ["low-stock"] }
);

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!user.roles?.name) redirect("/login");
  const role = user.roles.name;
  const permissions = await getSessionPermissions(user);

  const lowStockItems = await getLowStockItems();

  return (
    <AppShell
      user={{ ...user, roles: { name: role as RoleName } }}
      permissions={permissions}
      lowStockItems={lowStockItems}
    >
      {children}
    </AppShell>
  );
}
