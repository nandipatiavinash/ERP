import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { getSessionPermissions, requireUser } from "@/lib/auth";
import type { RoleName } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!user.roles?.name) redirect("/login");
  const role = user.roles.name;

  // Client users get the portal, not the ERP shell
  if (role === "client") redirect("/portal/dashboard" as any);

  const permissions = await getSessionPermissions(user);

  const supabase = await createClient();
  const { data: rawMaterials } = await supabase
    .from("raw_materials")
    .select("material_name, current_stock, critical_level, unit")
    .eq("status", "active")
    .is("deleted_at", null);

  const lowStockItems = (rawMaterials ?? [])
    .filter((m: any) => Number(m.current_stock ?? 0) <= Number(m.critical_level ?? 0))
    .map((m: any) => ({
      name: m.material_name,
      stock: Number(m.current_stock ?? 0),
      limit: Number(m.critical_level ?? 0),
      unit: m.unit,
    }));

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
