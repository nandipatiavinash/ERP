import type { Database, RoleName } from "@/lib/database.types";

export type FieldType = "text" | "number" | "date" | "time" | "textarea" | "select" | "hidden";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  step?: string;
  fullWidth?: boolean;
  options?: { label: string; value: string }[];
};

export type ModuleConfig = {
  key: string;
  title: string;
  table: string;
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
    path: "/admin/looms",
    role: ["admin"],
    fields: [
      { name: "loom_number", label: "Loom ID", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "loom_number", label: "Loom ID" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["loom_number", "description", "status"],
  },
  "fabric-types": {
    key: "fabric-types",
    title: "Fabric Type Management",
    table: "fabric_types",
    path: "/admin/products",
    role: ["admin"],
    fields: [
      { name: "fabric_name", label: "Fabric ID", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "fabric_name", label: "Fabric ID" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["fabric_name", "description", "status"],
  },
  "raw-materials": {
    key: "raw-materials",
    title: "Raw Materials ID",
    table: "raw_materials",
    path: "/admin/raw-materials",
    role: ["admin"],
    fields: [
      { name: "department", label: "Department", type: "select", fullWidth: true, options: [
        { label: "Fabric", value: "fabric" },
        { label: "Roto Printing", value: "roto-printing" },
        { label: "Lamination", value: "lamination" },
        { label: "Off-set Printing", value: "offset-printing" },
        { label: "Finishing", value: "finishing" },
      ], required: true },
      { name: "material_name", label: "Raw Material ID", type: "text", required: true },
      { name: "description", label: "Description", type: "text", required: false },
      { name: "critical_level", label: "Critical Stock Level", type: "number", step: "0.01", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "department", label: "Department" },
      { key: "material_name", label: "Raw Material ID" },
      { key: "description", label: "Description" },
      { key: "critical_level", label: "Critical Level" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["material_name", "description", "department", "status"],
  },
  employees: {
    key: "employees",
    title: "Employee Management",
    table: "employees",
    path: "/admin/employees",
    role: ["admin"],
    fields: [
      { name: "employee_code", label: "Employee Code", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "designation", label: "Designation", type: "text", required: true },
      { name: "salary", label: "Salary", type: "number", step: "0.01", required: true },
      { name: "joining_date", label: "Joining Date", type: "date" },
      { name: "shift_start", label: "Shift Start", type: "time", required: true },
      { name: "shift_end", label: "Shift End", type: "time", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "employee_code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "joining_date", label: "Joined" },
      { key: "shift_start", label: "Shift Start" },
      { key: "shift_end", label: "Shift End" },
      { key: "salary", label: "Salary" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["employee_code", "name", "department", "designation"],
  },
  customers: {
    key: "customers",
    title: "Firm Management",
    table: "customers",
    path: "/admin/clients",
    role: ["admin"],
    fields: [
      { name: "customer_name", label: "Firm Name", type: "text", required: true },
      { name: "linked_customer_id", label: "Linked Account", type: "select" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "gst_number", label: "GST Number", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "is_internal", label: "Account Type", type: "select", options: [
        { label: "client a/c", value: "client a/c" },
        { label: "profit and loss a/c", value: "profit and loss a/c" },
        { label: "capital a/c", value: "capital a/c" },
        { label: "loan a/c", value: "loan a/c" },
        { label: "balance sheet a/c", value: "balance sheet a/c" },
        { label: "reference a/c", value: "reference a/c" },
      ], required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "customer_name", label: "Firm Name" },
      { key: "linked_customer_id", label: "Linked Account ID" },
      { key: "phone", label: "Phone" },
      { key: "gst_number", label: "GST" },
      { key: "is_internal", label: "Account Type" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["customer_name", "linked_customer_id", "phone", "gst_number"],
  },
  "roto-colors": {
    key: "roto-colors",
    title: "Printing Color Management",
    table: "roto_colors",
    path: "/admin/colors",
    role: ["admin"],
    fields: [
      { name: "color_name", label: "Color ID/Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "color_name", label: "Color ID/Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["color_name", "description", "status"],
  },
  "lamination-products": {
    key: "lamination-products",
    title: "Lamination Film Product Management",
    table: "lamination_products",
    path: "/admin/products",
    role: ["admin"],
    fields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "name", label: "Product Name" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["name", "status"],
  },
  "finishing-products": {
    key: "finishing-products",
    title: "Finished Bag Product Management",
    table: "finishing_products",
    path: "/admin/products",
    role: ["admin"],
    fields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
    ],
    columns: [
      { key: "name", label: "Product Name" },
      { key: "status", label: "Status" },
    ],
    searchColumns: ["name", "status"],
  },
};

export const attendanceStatuses = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Half Day", value: "half_day" },
  { label: "Leave", value: "leave" },
];

export const salesStatuses = [
  { label: "Pending", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];
