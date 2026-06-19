import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { navGroups } from "@/lib/navigation";
import type { AppUser, RoleName } from "@/lib/database.types";

export const getSessionUser = cache(async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone, status, role_id, roles(name, is_active, deleted_at)")
    .eq("id", user.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .single();

  if (error || !profile) return null;

  const appUser = profile as AppUser;
  if (!appUser.roles?.name || appUser.roles.is_active === false || appUser.roles.deleted_at) return null;

  return appUser;
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: RoleName[]) {
  const user = await requireUser();
  const role = user.roles?.name;
  if (!role || !roles.includes(role)) redirect("/dashboard");
  return user;
}

export function fallbackPermissions(role: RoleName | undefined) {
  if (role === "admin") return navGroups.flatMap((group) => group.items.map((item) => item.permission)).concat([
    "users.create", "users.edit", "users.delete",
    "roles.create", "roles.edit", "roles.delete",
    "employees.create", "employees.edit", "employees.delete",
    "attendance.create", "attendance.edit",
    "looms.create", "looms.edit", "looms.delete",
    "fabric_types.create", "fabric_types.edit", "fabric_types.delete",
    "raw_materials.create", "raw_materials.edit", "raw_materials.delete",
    "customers.create", "customers.edit", "customers.delete",
    "production.create", "production.edit",
    "sales.create", "sales.edit",
    "reports.export",
  ]);
  if (role === "operator") return ["dashboard.view", "production.view", "production.create", "production.edit", "rolls.view", "reports.view"];
  return [];
}

const getPermissionsForRole = cache(async function getPermissionsForRole(roleId: string, role: RoleName | undefined) {
  const supabase = await createClient();
  const { data, error } = await (supabase
    .from("role_permissions")
    .select("permissions(module, action)")
    .eq("role_id", roleId) as any);

  if (error || !data?.length) return fallbackPermissions(role);

  return data
    .map((row: any) => row.permissions ? `${row.permissions.module}.${row.permissions.action}` : null)
    .filter(Boolean) as string[];
});

export async function getSessionPermissions(user?: AppUser) {
  const activeUser = user ?? await getSessionUser();
  if (!activeUser) return [];
  return getPermissionsForRole(activeUser.role_id, activeUser.roles?.name);
}

export async function requirePermission(permission: string) {
  const user = await requireUser();
  const permissions = await getSessionPermissions(user);
  if (!permissions.includes(permission)) redirect("/403");
  return user;
}

export function isAdmin(user: AppUser | null) {
  return user?.roles?.name === "admin";
}
