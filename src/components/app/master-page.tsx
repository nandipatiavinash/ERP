"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { saveMaster, deactivateMaster } from "@/app/(app)/_actions";
import type { ModuleConfig } from "@/lib/modules";
import { formatDate, formatNumber } from "@/lib/utils";
import { showSuccess } from "@/lib/toast";

type Row = Record<string, unknown> & { id: string };

function Field({ field, value, isEdit = false }: { field: ModuleConfig["fields"][number]; value?: unknown; isEdit?: boolean }) {
  const defaultValue = String(value ?? (field.name === "status" ? "active" : field.name === "department" ? "fabric" : field.name === "shift_start" ? "09:00" : field.name === "shift_end" ? "18:00" : ""));
  return (
    <div className={(field.fullWidth && !isEdit) ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <Label htmlFor={field.name}>{field.label}</Label>
      {field.type === "select" ? (
        <select name={field.name} id={field.name} defaultValue={defaultValue} required={field.required} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <Textarea name={field.name} id={field.name} defaultValue={defaultValue} required={field.required} />
      ) : (
        <Input name={field.name} id={field.name} type={field.type} step={field.step} defaultValue={defaultValue} required={field.required} />
      )}
    </div>
  );
}

function RecordForm({ config, row, isEdit = false, onSaved }: { config: ModuleConfig; row?: Row; isEdit?: boolean; onSaved?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (row?.id) {
      formData.set("id", row.id);
    }

    startTransition(async () => {
      try {
        await saveMaster(config.key, formData);
        showSuccess(row ? "Record updated successfully!" : "Record created successfully!");
        // Clear non-edit form inputs
        if (!row) {
          form.reset();
        }
        onSaved?.();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to save record.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`grid gap-4 ${isEdit ? "grid-cols-1" : "md:grid-cols-2"} text-left`}>
      {row ? <input type="hidden" name="id" value={row.id} /> : null}
      {config.fields.map((field) => <Field key={field.name} field={field} value={row?.[field.name]} isEdit={isEdit} />)}
      {errorMsg && <p className="text-sm text-destructive md:col-span-2">{errorMsg}</p>}
      <div className={`flex items-end ${isEdit ? "" : "md:col-span-2"}`}>
        <ConfirmSubmitButton disabled={isPending} confirmTitle={row ? "Save record changes?" : "Create new record?"} confirmDescription="Review the details before confirming this record change.">
          {isPending ? "Saving..." : row ? "Save Changes" : "Add Record"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}

function RowActions({ config, row }: { config: ModuleConfig; row: Row }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs font-semibold h-8">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {config.title.replace("Management", "").trim()}</DialogTitle>
            <DialogDescription>Modify the fields below to update the record details.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <RecordForm config={config} row={row} isEdit={true} onSaved={() => setIsDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <form onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          try {
            const fd = new FormData(e.currentTarget);
            await deactivateMaster(config.key, fd);
            showSuccess("Record deleted successfully!");
          } catch (err: any) {
            alert(err.message || "Failed to delete record.");
          }
        });
      }}>
        <input type="hidden" name="id" value={row.id} />
        <ConfirmSubmitButton
          disabled={isPending}
          size="sm"
          variant="outline"
          className="h-8 border-red-200 hover:bg-red-50 text-red-600"
          confirmTitle="Delete this record?"
          confirmDescription="This will permanently delete the record. This action cannot be undone."
        >
          {isPending ? "Deleting..." : "Delete"}
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}

function formatRecordValue(row: Row, columnKey: string) {
  const value = row[columnKey];
  if (columnKey === "status") return <StatusBadge value={String(value)} />;
  if (columnKey.endsWith("_at") || columnKey.endsWith("_date")) return formatDate(value == null ? null : String(value));
  if (columnKey === "phone" || columnKey.includes("phone") || columnKey.includes("mobile")) return String(value ?? "-");

  const number = Number(value);
  if (!Number.isNaN(number) && value !== null && value !== undefined && value !== "") {
    if (columnKey.includes("stock")) return `${formatNumber(number, 2)} ${row.unit ?? ""}`.trim();
    if (columnKey === "salary" || columnKey.includes("price")) return `₹${formatNumber(number, 2)}`;
    if (columnKey === "width") return `${formatNumber(number, 2)} in`;
    if (columnKey === "gsm") return `${formatNumber(number, 2)} GSM`;
    return formatNumber(number, 2);
  }

  return String(value ?? "-");
}

function matchesSearch(row: Row, columns: string[], search: string) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return columns.some((column) => String(row[column] ?? "").toLowerCase().includes(needle));
}

export function MasterPage({
  config,
  rows,
  search,
  sort,
  direction = "asc",
  queryParams,
}: {
  config: ModuleConfig;
  rows: Row[];
  search: string;
  sort?: string;
  direction?: "asc" | "desc";
  queryParams?: Record<string, string | undefined>;
}) {
  const filteredRows = rows
    .filter((row) => matchesSearch(row, config.searchColumns, search))
    .sort((a, b) => {
      if (!sort) return 0;
      const left = String(a[sort] ?? "");
      const right = String(b[sort] ?? "");
      return direction === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });

  const query = (nextSort = sort, nextDirection = direction) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams ?? {})) {
      if (value) params.set(key, value);
    }
    if (search) params.set("search", search);
    if (nextSort) params.set("sort", nextSort);
    if (nextSort) params.set("direction", nextDirection);
    return `${config.path}${params.size ? `?${params.toString()}` : ""}`;
  };

  return (
    <>
      <PageHeader title={config.title} description="Admin master data. Records are permanently deleted when removed." />

      <Card className="mb-5">
        <CardHeader><CardTitle>Add {config.title.replace("Management", "").trim()}</CardTitle></CardHeader>
        <CardContent><RecordForm config={config} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Records <span className="text-sm font-normal text-muted-foreground">({filteredRows.length})</span></CardTitle>
            <form className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input name="search" defaultValue={search} placeholder="Search" className="pl-9" />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {config.columns.map((column) => {
                      const nextDirection = sort === column.key && direction === "asc" ? "desc" : "asc";
                      return (
                        <TableHead key={column.key} className="text-center">
                          <Link href={query(column.key, nextDirection) as any} className="inline-flex items-center justify-center gap-1 hover:text-foreground w-full">
                            {column.label}
                            {sort === column.key && (
                              <span className="text-xs">{direction === "asc" ? "↑" : "↓"}</span>
                            )}
                          </Link>
                        </TableHead>
                      );
                    })}
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.id}>
                      {config.columns.map((column) => (
                        <TableCell key={column.key} className="text-center">
                          {formatRecordValue(row, column.key)}
                        </TableCell>
                      ))}
                       <TableCell className="text-center">
                         <RowActions config={config} row={row} />
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
