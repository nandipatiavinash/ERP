"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  createUserSchema,
  assertValid,
  roleSchema
} from "./helpers";

export async function createErpUser(_: unknown, formData: FormData) {
  await requirePermission("admin.credentials");

  const parsed = createUserSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    role_id: formData.get("role_id"),
    status: formData.get("status") || "active",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid user details." };

  // Optional customer_id for client-role users
  const customerId = (formData.get("customer_id") as string) || null;

  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
    },
  });

  if (authError) return { error: "Unable to create Supabase Auth user. Verify the email is not already registered." };
  const authUserId = authData.user?.id;
  if (!authUserId) return { error: "Supabase did not return a user id." };

  const { error: profileError } = await admin.from("users").upsert({
    id: authUserId,
    role_id: parsed.data.role_id,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    status: parsed.data.status,
    customer_id: customerId,
  } as any);

  if (profileError) {
    await admin.auth.admin.deleteUser(authUserId);
    return { error: "Unable to create ERP user profile." };
  }

  revalidatePath("/users");
  revalidatePath("/admin/credentials");
  return { success: "Supabase Auth user created. Share the password securely with the user." };
}

export async function deleteErpUser(userId: string) {
  const user = await requirePermission("admin.credentials");
  const supabase = await createClient();

  if (user.id === userId) {
    throw new Error("You cannot delete your own logged-in user profile.");
  }

  const { error } = await (supabase
    .from("users") as any)
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/users");
  revalidatePath("/admin/credentials");
}

export async function changeUserPassword(formData: FormData) {
  const user = await requirePermission("admin.credentials");
  const userId = String(formData.get("user_id") ?? "");
  const newPassword = String(formData.get("new_password") ?? "").trim();

  if (!userId || !newPassword) {
    throw new Error("User ID and new password are required.");
  }
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const admin = createAdminClient();

  // 1. Update password in Supabase Auth
  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword
  });

  if (authError) {
    throw new Error("Failed to update password in Auth: " + authError.message);
  }

  // SEC-01 / API-11: Do NOT write the plaintext password to public.users.
  // Only update updated_by to record who changed the password.
  const { error: profileError } = await (admin
    .from("users") as any)
    .update({ updated_by: user.id })
    .eq("id", userId);

  if (profileError) {
    // Non-fatal — Auth password was already updated successfully
    console.error("Failed to update updated_by on user profile:", profileError.message);
  }

  revalidatePath("/admin/credentials");
}

export async function createRole(formData: FormData) {
  await requirePermission("roles.create");
  const payload = assertValid(roleSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createClient();
  const { error } = await (supabase.from("roles") as any).insert({
    name: payload.name,
    description: payload.description ?? null,
    is_active: true,
  } as any);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function saveRoleDetails(formData: FormData) {
  await requirePermission("roles.edit");
  const roleId = String(formData.get("role_id") ?? "");
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const payload = assertValid(roleSchema, {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createClient();
  const { error } = await (supabase
    .from("roles") as any)
    .update({
      name: payload.name,
      description: payload.description ?? null,
    } as any)
    .eq("id", roleId);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
  revalidatePath("/admin/permissions");
  revalidatePath(`/admin/permissions/${roleId}`);
}

export async function deactivateRole(formData: FormData) {
  await requirePermission("roles.delete");
  const roleId = String(formData.get("role_id") ?? "");
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const supabase = await createClient();
  const { error } = await (supabase
    .from("roles") as any)
    .delete()
    .eq("id", roleId);
  if (error) throw new Error(error.message);
  revalidatePath("/roles");
}

export async function saveRolePermissions(formData: FormData) {
  const user = await requirePermission("roles.edit");
  const roleId = String(formData.get("role_id") ?? "");
  const permissionIds = formData.getAll("permission_ids").map(String);
  assertValid(z.string().uuid("Select a valid role."), roleId);
  const supabase = await createClient();
  const { error: deleteError } = await (supabase.from("role_permissions") as any).delete().eq("role_id", roleId);
  if (deleteError) throw new Error(deleteError.message);
  if (permissionIds.length > 0) {
    const rows = permissionIds.map((permissionId) => ({ role_id: roleId, permission_id: permissionId, created_by: user.id }));
    const { error: insertError } = await (supabase.from("role_permissions") as any).insert(rows as any);
    if (insertError) throw new Error(insertError.message);
  }
  revalidatePath("/roles");
  revalidatePath("/admin/permissions");
  revalidatePath(`/admin/permissions/${roleId}`);
}
