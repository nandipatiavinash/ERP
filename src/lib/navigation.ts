import type { RoleName } from "@/lib/database.types";

export type NavItem = { href: string; label: string; roles: RoleName[] };

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "operator"] },
  { href: "/production", label: "Production", roles: ["admin", "operator"] },
  { href: "/rolls", label: "Fabric Rolls", roles: ["admin", "operator"] },
  { href: "/sales", label: "Sales", roles: ["admin"] },
  { href: "/reports", label: "Reports", roles: ["admin", "operator"] },
  { href: "/attendance", label: "Attendance", roles: ["admin"] },
  { href: "/employees", label: "Employees", roles: ["admin"] },
  { href: "/looms", label: "Looms", roles: ["admin"] },
  { href: "/fabric-types", label: "Fabric Types", roles: ["admin"] },
  { href: "/raw-materials", label: "Raw Materials", roles: ["admin"] },
  { href: "/customers", label: "Customers", roles: ["admin"] },
  { href: "/users", label: "Users", roles: ["admin"] },
  { href: "/roles", label: "Roles", roles: ["admin"] },
  { href: "/audit-logs", label: "Audit Logs", roles: ["admin"] },
];
