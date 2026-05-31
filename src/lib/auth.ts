import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppUser, RoleName } from "@/lib/database.types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, email, phone, status, role_id, roles(name)")
    .eq("id", user.id)
    .single();

  return profile as AppUser | null;
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
