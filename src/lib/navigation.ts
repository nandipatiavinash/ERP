import {
  BarChart3,
  Boxes,
  CalendarCheck,
  Factory,
  FileText,
  Gauge,
  Package,
  Receipt,
  Settings,
  Shirt,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { RoleName } from "@/lib/database.types";

export type NavItem = { href: string; label: string; icon: typeof Gauge; roles: RoleName[] };

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge, roles: ["admin", "operator"] },
  { href: "/production", label: "Production", icon: Factory, roles: ["admin", "operator"] },
  { href: "/rolls", label: "Fabric Rolls", icon: Package, roles: ["admin", "operator"] },
  { href: "/sales", label: "Sales", icon: ShoppingCart, roles: ["admin"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["admin", "operator"] },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["admin"] },
  { href: "/employees", label: "Employees", icon: Users, roles: ["admin"] },
  { href: "/looms", label: "Looms", icon: Settings, roles: ["admin"] },
  { href: "/fabric-types", label: "Fabric Types", icon: Shirt, roles: ["admin"] },
  { href: "/raw-materials", label: "Raw Materials", icon: Boxes, roles: ["admin"] },
  { href: "/customers", label: "Customers", icon: Receipt, roles: ["admin"] },
  { href: "/users", label: "Users", icon: Users, roles: ["admin"] },
  { href: "/roles", label: "Roles", icon: Settings, roles: ["admin"] },
  { href: "/audit-logs", label: "Audit Logs", icon: FileText, roles: ["admin"] },
];
