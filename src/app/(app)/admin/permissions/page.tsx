import { createRole, deactivateRole, saveRoleDetails, saveRolePermissions } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePermission } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function PermissionsPage() {
  await requirePermission("roles.view");
  const supabase = await createClient();
  const [{ data: roles }, { data: permissions }, { data: assigned }] = await Promise.all([
    supabase.from("roles").select("*").is("deleted_at", null).order("name"),
    supabase.from("permissions").select("*").order("module").order("action"),
    supabase.from("role_permissions").select("role_id, permission_id"),
  ]);

  const roleRows = (roles ?? []) as any[];
  const permissionRows = (permissions ?? []) as any[];
  const assignedSet = new Set(((assigned ?? []) as any[]).map((row) => `${row.role_id}:${row.permission_id}`));
  const groupedPermissions = permissionRows.reduce<Record<string, any[]>>((acc, permission) => {
    acc[permission.module] ??= [];
    acc[permission.module].push(permission);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Login Permissions" description="Create custom roles and assign module permissions for dynamic access control." />
      <Card className="mb-5">
        <CardHeader><CardTitle>Create Role</CardTitle></CardHeader>
        <CardContent>
          <form action={createRole} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" name="name" placeholder="Production Manager" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Optional role description" />
            </div>
            <ConfirmSubmitButton confirmTitle="Create role?" confirmDescription="Confirm the role name before creating it.">Create Role</ConfirmSubmitButton>
          </form>
        </CardContent>
      </Card>

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
                <CardContent className="space-y-5 border-t pt-5">
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

                  <form action={saveRolePermissions} className="space-y-4">
                    <input type="hidden" name="role_id" value={role.id} />
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-40">Module</TableHead>
                            <TableHead>Permissions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                            <TableRow key={module}>
                              <TableCell className="font-medium">{titleCase(module)}</TableCell>
                              <TableCell>
                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                  {modulePermissions.map((permission) => (
                                    <label key={permission.id} className="flex min-h-10 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                                      <input
                                        type="checkbox"
                                        name="permission_ids"
                                        value={permission.id}
                                        defaultChecked={assignedSet.has(`${role.id}:${permission.id}`)}
                                        className="h-4 w-4 accent-primary"
                                      />
                                      <span>
                                        <span className="font-medium">{permission.action}</span>
                                        <span className="ml-1 text-muted-foreground">{permission.description}</span>
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <ConfirmSubmitButton confirmTitle="Save permission matrix?" confirmDescription="This will replace the role's current permission assignments.">Save Permissions</ConfirmSubmitButton>
                  </form>
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
