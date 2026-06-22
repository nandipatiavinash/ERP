import { createRole, deactivateRole, saveRoleDetails, saveRolePermissions } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";

// Section grouping for display — maps module name → section label + order
const SECTION_META: Record<string, { label: string; order: number }> = {
  admin:            { label: "Admin",           order: 0 },
  fabric:           { label: "Fabric",          order: 1 },
  roto_printing:    { label: "Roto Printing",   order: 2 },
  lamination:       { label: "Lamination",      order: 3 },
  offset_printing:  { label: "Offset Printing", order: 4 },
  finishing:        { label: "Finishing",        order: 5 },
  sales:            { label: "Sales",           order: 6 },
  accounts:         { label: "Accounts",        order: 7 },
  reports:          { label: "Reports",         order: 8 },
};

// Human-friendly action (page) labels
const ACTION_LABELS: Record<string, string> = {
  credentials:       "Login Credentials",
  permissions:       "Login Permissions",
  raw_materials:     "Raw Material IDs",
  products:          "Product IDs",
  clients:           "Account / Client IDs",
  looms:             "Loom IDs",
  colors:            "Printing Colour IDs",
  critical_levels:   "Raw Material Critical Levels",
  employees:         "Employees",
  attendance:        "Attendance",
  reset:             "System Reset",
  production:        "Production",
  consumption:       "Consumption",
  stock:             "Stock",
  order_confirmation:"Order Confirmation",
  delivery_entry:    "Delivery Entry",
  journal:           "Journal Entry",
  purchase:          "Purchase Entry",
  sales:             "Sales Entry",
  material:          "Material Sales",
  sales_confirmation:"Sales Confirmation",
  accounts:          "Account Reports",
  opening_balance:   "Opening Balance",
  profit_loss:       "Profit & Loss",
  balance_sheet:     "Balance Sheet",
};

function sectionLabel(module: string) {
  return SECTION_META[module]?.label ?? module.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function PermissionsPage() {
  await requirePermission("admin.permissions");
  const supabase = await createClient();
  const [{ data: roles }, { data: permissions }, { data: assigned }] = await Promise.all([
    supabase.from("roles").select("*").is("deleted_at", null).order("name"),
    supabase.from("permissions").select("*").order("module").order("action"),
    supabase.from("role_permissions").select("role_id, permission_id"),
  ]);

  const roleRows = (roles ?? []) as any[];
  const permissionRows = (permissions ?? []) as any[];;
  const assignedSet = new Set(((assigned ?? []) as any[]).map((row) => `${row.role_id}:${row.permission_id}`));

  // Group by module, sorted by SECTION_META order
  const groupedPermissions = permissionRows.reduce<Record<string, any[]>>((acc, permission) => {
    acc[permission.module] ??= [];
    acc[permission.module].push(permission);
    return acc;
  }, {});

  const sortedModules = Object.keys(groupedPermissions).sort((a, b) => {
    const oa = SECTION_META[a]?.order ?? 99;
    const ob = SECTION_META[b]?.order ?? 99;
    return oa - ob;
  });

  return (
    <>
      <PageHeader title="Login Permissions" description="Create custom roles and assign page-level access permissions, grouped by section." />

      {/* Create Role */}
      <Card className="mb-5">
        <CardHeader><CardTitle>Create Role</CardTitle></CardHeader>
        <CardContent>
          <form action={createRole} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" name="name" placeholder="e.g. Fabric Operator" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Optional role description" />
            </div>
            <ConfirmSubmitButton confirmTitle="Create role?" confirmDescription="Confirm the role name before creating it.">Create Role</ConfirmSubmitButton>
          </form>
        </CardContent>
      </Card>

      {/* Role Cards */}
      {roleRows.length === 0 ? <EmptyState title="No roles found" description="Create a role before assigning permissions." /> : (
        <div className="space-y-5">
          {roleRows.map((role) => (
            <Card key={role.id}>
              <details className="group" name="role-accordion">
                <summary className="flex items-center justify-between list-none cursor-pointer p-5 select-none [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between flex-1 mr-4">
                    <div>
                      <CardTitle className="capitalize">{role.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{role.description || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={role.is_active ? "active" : "inactive"} />
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 transition-transform duration-200 group-open:rotate-90 text-muted-foreground shrink-0" />
                </summary>

                <CardContent className="space-y-6 border-t pt-5">
                  {/* Edit role name/description */}
                  <form action={saveRoleDetails} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
                    <input type="hidden" name="role_id" value={role.id} />
                    <div className="space-y-2">
                      <Label htmlFor={`name-${role.id}`}>Role Name</Label>
                      <Input id={`name-${role.id}`} name="name" defaultValue={role.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${role.id}`}>Description</Label>
                      <Input id={`description-${role.id}`} name="description" defaultValue={role.description ?? ""} />
                    </div>
                    <ConfirmSubmitButton variant="outline" confirmTitle="Save role changes?" confirmDescription="Confirm the role name and description before saving.">Save Role</ConfirmSubmitButton>
                  </form>

                  {/* Permission assignment — grouped by section */}
                  <form action={saveRolePermissions} className="space-y-5">
                    <input type="hidden" name="role_id" value={role.id} />

                    <div className="space-y-4">
                      {sortedModules.map((module) => {
                        const modulePerms = groupedPermissions[module];
                        const allIds = modulePerms.map((p: any) => p.id);
                        const checkedCount = allIds.filter((id: string) => assignedSet.has(`${role.id}:${id}`)).length;

                        return (
                          <div key={module} className="rounded-lg border overflow-hidden">
                            {/* Section header */}
                            <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b">
                              <span className="text-sm font-semibold tracking-wide">{sectionLabel(module)}</span>
                              <span className="text-xs text-muted-foreground">{checkedCount}/{allIds.length} enabled</span>
                            </div>

                            {/* Page-level checkboxes */}
                            <div className="grid gap-0 divide-y">
                              {modulePerms.map((permission: any) => {
                                const isChecked = assignedSet.has(`${role.id}:${permission.id}`);
                                return (
                                  <label
                                    key={permission.id}
                                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/30 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      name="permission_ids"
                                      value={permission.id}
                                      defaultChecked={isChecked}
                                      className="h-4 w-4 accent-primary shrink-0"
                                    />
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-medium">{actionLabel(permission.action)}</span>
                                      {permission.description && (
                                        <span className="text-xs text-muted-foreground">{permission.description}</span>
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <ConfirmSubmitButton confirmTitle="Save permission matrix?" confirmDescription="This will replace the role's current permission assignments.">Save Permissions</ConfirmSubmitButton>
                  </form>

                  {/* Deactivate */}
                  <form action={deactivateRole}>
                    <input type="hidden" name="role_id" value={role.id} />
                    <ConfirmSubmitButton variant="outline" confirmTitle="Deactivate role?" confirmDescription="This role will be marked inactive and hidden from active role selections.">Deactivate Role</ConfirmSubmitButton>
                  </form>
                </CardContent>
              </details>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
