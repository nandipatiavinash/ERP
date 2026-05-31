import type { Database, RoleName } from "@/lib/database.types";

export type FieldType = "text" | "number" | "date" | "time" | "textarea" | "select" | "hidden";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  step?: string;
  options?: { label: string; value: string }[];
};

export type ModuleConfig = {
  key: string;
  title: string;
  table: keyof Database["public"]["Tables"];
  path: string;
  role: RoleName[];
  fields: FieldConfig[];
  columns: { key: string; label: string }[];
  searchColumns: string[];
};

export const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const modules: Record<string, ModuleConfig> = {
  looms: {
    key: "looms",
    title: "Loom Management",
    table: "looms",
    path: "/looms",
    role: ["admin"],
    fields: [
      { name: "loom_number", label: "Loom Number", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "loom_number", label: "Loom Number" },
      { key: "status", label: "Status" },
      { key: "created_at", label: "Created" },
    ],
    searchColumns: ["loom_number", "status"],
  },
  "fabric-types": {
    key: "fabric-types",
    title: "Fabric Type Management",
    table: "fabric_types",
    path: "/fabric-types",
    role: ["admin"],
    fields: [
      { name: "fabric_name", label: "Fabric Name", type: "text", required: true },
      { name: "width", label: "Width", type: "number", step: "0.01", required: true },
      { name: "gsm", label: "GSM", type: "number", step: "0.01", required: true },
      { name: "selling_price", label: "Selling Price", type: "number", step: "0.01", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "fabric_name", label: "Fabric" },
      { key: "width", label: "Width" },
      { key: "gsm", label: "GSM" },
      { key: "selling_price", label: "Rate" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["fabric_name", "status"],
  },
  "raw-materials": {
    key: "raw-materials",
    title: "Raw Material Inventory",
    table: "raw_materials",
    path: "/raw-materials",
    role: ["admin"],
    fields: [
      { name: "material_name", label: "Material Name", type: "text", required: true },
      { name: "unit", label: "Unit", type: "text", required: true },
      { name: "opening_stock", label: "Opening Stock", type: "number", step: "0.001", required: true },
      { name: "current_stock", label: "Current Stock", type: "number", step: "0.001", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "material_name", label: "Material" },
      { key: "unit", label: "Unit" },
      { key: "opening_stock", label: "Opening" },
      { key: "current_stock", label: "Current" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["material_name", "unit", "status"],
  },
  employees: {
    key: "employees",
    title: "Employee Management",
    table: "employees",
    path: "/employees",
    role: ["admin"],
    fields: [
      { name: "employee_code", label: "Employee Code", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "designation", label: "Designation", type: "text", required: true },
      { name: "salary", label: "Salary", type: "number", step: "0.01", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "employee_code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "salary", label: "Salary" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["employee_code", "name", "department", "designation"],
  },
  customers: {
    key: "customers",
    title: "Customer Management",
    table: "customers",
    path: "/customers",
    role: ["admin"],
    fields: [
      { name: "customer_name", label: "Customer Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "gst_number", label: "GST Number", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "customer_name", label: "Customer" },
      { key: "phone", label: "Phone" },
      { key: "gst_number", label: "GST" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["customer_name", "phone", "gst_number"],
  },
};

export const attendanceStatuses = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Half Day", value: "half_day" },
  { label: "Leave", value: "leave" },
];

export const salesStatuses = [
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];
