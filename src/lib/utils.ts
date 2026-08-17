import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | null | undefined, fractionDigits = 2) {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(number);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export function formatShortDate(value: string | null | undefined) {
  if (!value) return "-";
  const parts = String(value).split("-");
  if (parts.length >= 3) {
    const y = parts[0].slice(-2);
    const m = parts[1];
    const d = parts[2].slice(0, 2);
    return `${d}-${m}-${y}`;
  }
  return value;
}

export function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function todayInIndia() {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const r = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${r}`;
}

export async function fetchPagedData<T = any>(
  queryBuilder: any,
  pageSize = 1000
): Promise<T[]> {
  const allData: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await queryBuilder.range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    allData.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allData;
}

export function isRedirectError(err: any): boolean {
  return (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    typeof err.digest === "string" &&
    err.digest.startsWith("NEXT_REDIRECT")
  );
}

export function cleanJournalDescription(description: string | null | undefined): string {
  if (!description) return "";
  return description.replace(/\s*\((RM|SO|PP):[^)]+\)/gi, "").trim();
}
