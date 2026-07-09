import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { RolePermissionsEditor } from "@/components/app/role-permissions-editor";

const SECTION_META: Record<string, { label: string; order: number }> = {
  admin:           { label: "Admin",           order: 0 },
  fabric:          { label: "Fabric",          order: 1 },
  roto_printing:   { label: "Roto Printing",   order: 2 },
  lamination:      { label: "Lamination",      order: 3 },
  offset_printing: { label: "Offset Printing", order: 4 },
  finishing:       { label: "Finishing",       order: 5 },
  sales:           { label: "Sales",           order: 6 },
  accounts:        { label: "Accounts",        order: 7 },
  reports:         { label: "Reports",         order: 8 },
  roto_products:   { label: "Roto Products",   order: 9 },
  offset_products: { label: "Offset Products", order: 10 },
};

export default async function RolePermissionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("admin.permissions");
  const { id: roleId } = await params;

  const supabase = await createClient();
  const [{ data: roleData }, { data: permissions }, { data: assigned }] = await Promise.all([
    (supabase.from("roles") as any).select("*").eq("id", roleId).is("deleted_at", null).single(),
    supabase.from("permissions").select("*").order("module").order("action"),
    supabase.from("role_permissions").select("permission_id").eq("role_id", roleId),
  ]);

  if (!roleData) notFound();

  const role = roleData as any;
  const permissionRows = (permissions ?? []) as any[];
  const assignedIdsArray = ((assigned ?? []) as any[]).map((r) => r.permission_id);

  // Group by module, sorted by section order
  const groupedPermissions = permissionRows.reduce<Record<string, any[]>>((acc, p) => {
    acc[p.module] ??= [];
    acc[p.module].push(p);
    return acc;
  }, {});

  const sortedModules = Object.keys(groupedPermissions).sort((a, b) => {
    const oa = SECTION_META[a]?.order ?? 99;
    const ob = SECTION_META[b]?.order ?? 99;
    return oa - ob;
  });

  return (
    <>
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/admin/permissions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Link>
      </div>

      <PageHeader
        title={role.name.charAt(0).toUpperCase() + role.name.slice(1)}
        description={role.description || "No description"}
      >
        <StatusBadge value={role.is_active ? "active" : "inactive"} />
      </PageHeader>

      <RolePermissionsEditor
        role={role}
        sortedModules={sortedModules}
        groupedPermissions={groupedPermissions}
        assignedIdsArray={assignedIdsArray}
        totalPermissionsCount={permissionRows.length}
      />
    </>
  );
}
