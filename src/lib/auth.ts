import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppUser, RoleName } from "@/lib/database.types";

export async function getSessionUser() {
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
}

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

export function isAdmin(user: AppUser | null) {
  return user?.roles?.name === "admin";
}
