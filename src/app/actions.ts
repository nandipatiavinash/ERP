"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const origin = String(formData.get("origin") ?? "");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) return { error: error.message };
  return { success: "Password reset email sent." };
}

export async function logLogin(userId: string) {
  const supabase = await createClient();
  await (supabase.from("audit_logs") as any).insert({
    user_id: userId,
    action: "login",
    module: "auth",
    record_id: userId,
    new_data: { event: "login" },
  });
}

export async function revalidateApp(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}
