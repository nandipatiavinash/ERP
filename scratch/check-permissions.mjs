import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const env = {};
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const env = { ...loadEnvFile(resolve(".env.local")), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceRoleKey);

async function check() {
  console.log("--- USERS ---");
  const { data: users, error: errUsers } = await supabase
    .from("users")
    .select("id, email, full_name, role_id, status, roles(name)");
  console.log("Users:", users);

  console.log("--- ROLES ---");
  const { data: roles, error: errRoles } = await supabase
    .from("roles")
    .select("*");
  console.log("Roles:", roles);

  console.log("--- ROLE PERMISSIONS ---");
  const { data: rolePerms, error: errRolePerms } = await supabase
    .from("role_permissions")
    .select("role_id, roles(name), permission_id, permissions(module, action)");
  console.log("Role Permissions count:", rolePerms?.length);
  if (rolePerms) {
    const grouped = {};
    for (const rp of rolePerms) {
      const rname = rp.roles?.name || rp.role_id;
      grouped[rname] ??= [];
      if (rp.permissions) {
        grouped[rname].push(`${rp.permissions.module}.${rp.permissions.action}`);
      } else {
        grouped[rname].push(`null-permission-id-${rp.permission_id}`);
      }
    }
    console.log("Grouped by role:", JSON.stringify(grouped, null, 2));
  }
}

check();
