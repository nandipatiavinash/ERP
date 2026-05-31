import type { RoleName } from "@/lib/database.types";

export type NavItem = { href: string; label: string; roles: RoleName[]; permission: string };

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "operator"], permission: "dashboard.view" },
  { href: "/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
  { href: "/rolls", label: "Fabric Rolls", roles: ["admin", "operator"], permission: "rolls.view" },
  { href: "/sales", label: "Sales", roles: ["admin"], permission: "sales.view" },
  { href: "/reports", label: "Reports", roles: ["admin", "operator"], permission: "reports.view" },
  { href: "/attendance", label: "Attendance", roles: ["admin"], permission: "attendance.view" },
  { href: "/employees", label: "Employees", roles: ["admin"], permission: "employees.view" },
  { href: "/looms", label: "Looms", roles: ["admin"], permission: "looms.view" },
  { href: "/fabric-types", label: "Fabric Types", roles: ["admin"], permission: "fabric_types.view" },
  { href: "/raw-materials", label: "Raw Materials", roles: ["admin"], permission: "raw_materials.view" },
  { href: "/customers", label: "Customers", roles: ["admin"], permission: "customers.view" },
  { href: "/users", label: "Users", roles: ["admin"], permission: "users.view" },
  { href: "/roles", label: "Roles", roles: ["admin"], permission: "roles.view" },
  { href: "/audit-logs", label: "Audit Logs", roles: ["admin"], permission: "audit_logs.view" },
];
