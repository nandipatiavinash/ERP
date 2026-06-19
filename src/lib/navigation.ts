import type { RoleName } from "@/lib/database.types";

export type NavSubItem = { href: string; label: string; roles: RoleName[]; permission: string };

export type NavGroup = {
  key: string;
  label: string;
  roles: RoleName[];
  items: NavSubItem[];
};

export const navGroups: NavGroup[] = [
  {
    key: "admin",
    label: "Admin",
    roles: ["admin"],
    items: [
      { href: "/admin/credentials", label: "Login Credentials", roles: ["admin"], permission: "users.view" },
      { href: "/admin/permissions", label: "Login Permissions", roles: ["admin"], permission: "roles.view" },
      { href: "/admin/raw-materials", label: "Raw Material IDs", roles: ["admin"], permission: "raw_materials.view" },
      { href: "/admin/products", label: "Product IDs", roles: ["admin"], permission: "fabric_types.view" },
      { href: "/admin/clients", label: "Account/Client IDs", roles: ["admin"], permission: "customers.view" },
      { href: "/admin/looms", label: "Loom IDs", roles: ["admin"], permission: "looms.view" },
      { href: "/admin/colors", label: "Printing Colour IDs", roles: ["admin"], permission: "fabric_types.view" },
      { href: "/admin/critical-levels", label: "Raw Material Critical Levels", roles: ["admin"], permission: "raw_materials.view" },
      { href: "/admin/employees", label: "Employees", roles: ["admin"], permission: "employees.view" },
      { href: "/admin/attendance", label: "Attendance", roles: ["admin"], permission: "attendance.view" },
    ],
  },
  {
    key: "fabric",
    label: "Fabric",
    roles: ["admin", "operator"],
    items: [
      { href: "/fabric/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/fabric/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/fabric/stock", label: "Stock", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "roto-printing",
    label: "Roto Printing",
    roles: ["admin", "operator"],
    items: [
      { href: "/roto-printing/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/roto-printing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/roto-printing/stock", label: "Stock", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "lamination",
    label: "Lamination",
    roles: ["admin", "operator"],
    items: [
      { href: "/lamination/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/lamination/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/lamination/stock", label: "Stock", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "offset-printing",
    label: "Offset Printing",
    roles: ["admin", "operator"],
    items: [
      { href: "/offset-printing/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/offset-printing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/offset-printing/stock", label: "Stock", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "finishing",
    label: "Finishing",
    roles: ["admin", "operator"],
    items: [
      { href: "/finishing/production", label: "Production", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/finishing/consumption", label: "Consumption", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/finishing/stock", label: "Stock", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    roles: ["admin"],
    items: [
      { href: "/sales/delivery-entry", label: "Order Confirmation", roles: ["admin"], permission: "sales.view" },
      { href: "/sales/order-confirmation", label: "Delivery Entry", roles: ["admin"], permission: "sales.view" },
    ],
  },
  {
    key: "accounts",
    label: "Accounts",
    roles: ["admin"],
    items: [
      { href: "/accounts/journal", label: "Journal Entry", roles: ["admin"], permission: "sales.view" },
      { href: "/accounts/purchase", label: "Purchase Entry", roles: ["admin"], permission: "sales.view" },
      { href: "/accounts/sales", label: "Sales Entry", roles: ["admin"], permission: "sales.view" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    roles: ["admin", "operator"],
    items: [
      { href: "/reports/sales-confirmation", label: "Sales Confirmation", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/accounts", label: "Account Reports", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/opening-balance", label: "Opening Balance", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/closing-stock", label: "Closing Stock", roles: ["admin", "operator"], permission: "reports.view" },
      { href: "/reports/profit-loss", label: "Profit & Loss", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/balance-sheet", label: "Balance Sheet", roles: ["admin"], permission: "reports.view" },
    ],
  },
];
