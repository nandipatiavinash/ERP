import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth";
import { navItems } from "@/lib/navigation";
import type { RoleName } from "@/lib/database.types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!user.roles?.name) redirect("/login");
  const role = user.roles.name;
  const items = navItems.filter((item) => item.roles.includes(role));

  return <AppShell user={{ ...user, roles: { name: role as RoleName } }} items={items}>{children}</AppShell>;
}
