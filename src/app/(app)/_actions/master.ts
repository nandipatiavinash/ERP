"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { createClient } from "@/lib/supabase/server";
import {
  ALLOWED_MODULE_KEYS,
  modulePermissionKey,
  validateMasterPayload,
  readPayload
} from "./helpers";

export async function saveMaster(moduleKey: string, formData: FormData) {
  // SEC-15 / ISS-020: validate moduleKey against allowlist before using it
  if (!ALLOWED_MODULE_KEYS.has(moduleKey)) throw new Error("Invalid module key.");
  const id = String(formData.get("id") ?? "");
  const user = await requirePermission(`${modulePermissionKey(moduleKey)}.${id ? "edit" : "create"}`);

  const config = modules[moduleKey];
  const supabase = await createClient();
  const payload = validateMasterPayload(moduleKey, readPayload(formData, config.fields.map((field) => field.name))) as any;

  let finalPayload = { ...payload };
  if (moduleKey === "customers") {
    if (finalPayload.customer_name) {
      finalPayload.customer_name = String(finalPayload.customer_name).toUpperCase().trim();
    }
    if (finalPayload.linked_customer_id === "") {
      finalPayload.linked_customer_id = null;
    }
  }

  if (moduleKey === "fabric-types" && !id) {
    finalPayload.width = 1;
    finalPayload.gsm = 1;
    finalPayload.selling_price = 0;
  }
  if (moduleKey === "raw-materials" && !finalPayload.unit) {
    finalPayload.unit = "-";
  }
  finalPayload.updated_by = user.id;
  const table = config.table as any;

  const buildQuery = (p: Record<string, unknown>) =>
    id
      ? (supabase.from(table) as any).update(p).eq("id", id)
      : (supabase.from(table) as any).insert({ ...p, created_by: user.id, updated_by: user.id });

  let { error } = await buildQuery(finalPayload) as any;

  // If description column doesn't exist yet in DB (migration pending), retry without it
  if (error && /could not find the 'description' column/i.test(error.message)) {
    const { description: _dropped, ...payloadWithoutDesc } = finalPayload;
    finalPayload = payloadWithoutDesc;
    const retry = await buildQuery(finalPayload) as any;
    error = retry.error;
  }

  if (error) {
    console.error('saveMaster error for module', moduleKey, ':', error);
    throw new Error(`Failed to save ${moduleKey}: ${error.message}`);
  }

  revalidatePath(config.path);
}

export async function deactivateMaster(moduleKey: string, formData: FormData) {
  // SEC-15 / ISS-020: validate moduleKey against allowlist before using it
  if (!ALLOWED_MODULE_KEYS.has(moduleKey)) throw new Error("Invalid module key.");
  const user = await requirePermission(`${modulePermissionKey(moduleKey)}.delete`);

  const config = modules[moduleKey];
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const table = config.table as any;
  const { error } = await (supabase
    .from(table) as any)
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id } as any)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(config.path);
}

