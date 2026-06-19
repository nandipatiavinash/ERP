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
    label: "ADMIN",
    roles: ["admin"],
    items: [
      { href: "/admin/credentials", label: "LOGIN CREDENTIALS", roles: ["admin"], permission: "users.view" },
      { href: "/admin/permissions", label: "LOGIN PERMISSIONS", roles: ["admin"], permission: "roles.view" },
      { href: "/admin/raw-materials", label: "RAW MATERIAL ID’s", roles: ["admin"], permission: "raw_materials.view" },
      { href: "/admin/products", label: "PRODUCT ID’s", roles: ["admin"], permission: "fabric_types.view" },
      { href: "/admin/clients", label: "ACCOUNT/CLIENT ID’s", roles: ["admin"], permission: "customers.view" },
      { href: "/admin/looms", label: "LOOM ID’s", roles: ["admin"], permission: "looms.view" },
      { href: "/admin/colors", label: "PRINTING COLOUR ID’s", roles: ["admin"], permission: "fabric_types.view" },
      { href: "/admin/critical-levels", label: "RAW MATERIAL CRITICAL LEVELS", roles: ["admin"], permission: "raw_materials.view" },
      { href: "/admin/employees", label: "EMPLOYEES", roles: ["admin"], permission: "employees.view" },
      { href: "/admin/attendance", label: "ATTENDANCE", roles: ["admin"], permission: "attendance.view" },
    ],
  },
  {
    key: "fabric",
    label: "FABRIC",
    roles: ["admin", "operator"],
    items: [
      { href: "/fabric/production", label: "PRODUCTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/fabric/consumption", label: "CONSUMPTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/fabric/stock", label: "STOCK", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "roto-printing",
    label: "ROTO – PRINTING",
    roles: ["admin", "operator"],
    items: [
      { href: "/roto-printing/production", label: "PRODUCTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/roto-printing/consumption", label: "CONSUMPTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/roto-printing/stock", label: "STOCK", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "lamination",
    label: "LAMINATION",
    roles: ["admin", "operator"],
    items: [
      { href: "/lamination/production", label: "PRODUCTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/lamination/consumption", label: "CONSUMPTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/lamination/stock", label: "STOCK", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "offset-printing",
    label: "OFF – SET PRINTING",
    roles: ["admin", "operator"],
    items: [
      { href: "/offset-printing/production", label: "PRODUCTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/offset-printing/consumption", label: "CONSUMPTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/offset-printing/stock", label: "STOCK", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "finishing",
    label: "FINISHING",
    roles: ["admin", "operator"],
    items: [
      { href: "/finishing/production", label: "PRODUCTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/finishing/consumption", label: "CONSUMPTION", roles: ["admin", "operator"], permission: "production.view" },
      { href: "/finishing/stock", label: "STOCK", roles: ["admin", "operator"], permission: "rolls.view" },
    ],
  },
  {
    key: "sales",
    label: "SALES",
    roles: ["admin"],
    items: [
      { href: "/sales/delivery-entry", label: "DELIVERY ENTRY", roles: ["admin"], permission: "sales.view" },
      { href: "/sales/delivery-confirmation", label: "DELIVERY CONFIRMATION (SMS)", roles: ["admin"], permission: "sales.view" },
      { href: "/sales/order-confirmation", label: "ORDER CONFIRMATION", roles: ["admin"], permission: "sales.view" },
    ],
  },
  {
    key: "accounts",
    label: "ACCOUNTS",
    roles: ["admin"],
    items: [
      { href: "/accounts/journal", label: "JOURNAL ENTRY", roles: ["admin"], permission: "sales.view" },
      { href: "/accounts/purchase", label: "PURCHASE ENTRY", roles: ["admin"], permission: "sales.view" },
      { href: "/accounts/sales", label: "SALES ENTRY", roles: ["admin"], permission: "sales.view" },
    ],
  },
  {
    key: "reports",
    label: "REPORTS",
    roles: ["admin", "operator"],
    items: [
      { href: "/reports/sales-confirmation", label: "SALES CONFIRMATION", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/accounts", label: "ACCOUNT REPORTS", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/opening-balance", label: "OPENING BALANCE", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/closing-stock", label: "CLOSING STOCK", roles: ["admin", "operator"], permission: "reports.view" },
      { href: "/reports/profit-loss", label: "PROFIT & LOSS", roles: ["admin"], permission: "reports.view" },
      { href: "/reports/balance-sheet", label: "BALANCE SHEET", roles: ["admin"], permission: "reports.view" },
    ],
  },
];
