import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { saveMaster, deactivateMaster } from "@/app/(app)/_actions";
import type { ModuleConfig } from "@/lib/modules";
import { formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string };

function Field({ field, value }: { field: ModuleConfig["fields"][number]; value?: unknown }) {
  const defaultValue = String(value ?? (field.name === "status" ? "active" : ""));
  return (
    <div className="space-y-2">
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

function RecordForm({ config, row }: { config: ModuleConfig; row?: Row }) {
  const action = saveMaster.bind(null, config.key);
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {row ? <input type="hidden" name="id" value={row.id} /> : null}
      {config.fields.map((field) => <Field key={field.name} field={field} value={row?.[field.name]} />)}
      <div className="flex items-end md:col-span-2">
        <Button type="submit">{row ? "Save Changes" : "Add Record"}</Button>
      </div>
    </form>
  );
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
  page = 1,
  sort,
  direction = "asc",
}: {
  config: ModuleConfig;
  rows: Row[];
  search: string;
  page?: number;
  sort?: string;
  direction?: "asc" | "desc";
}) {
  const filteredRows = rows
    .filter((row) => matchesSearch(row, config.searchColumns, search))
    .sort((a, b) => {
      if (!sort) return 0;
      const left = String(a[sort] ?? "");
      const right = String(b[sort] ?? "");
      return direction === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });
  const pageSize = 10;
  const totalPages = Math.max(Math.ceil(filteredRows.length / pageSize), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const query = (nextPage: number, nextSort = sort, nextDirection = direction) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextSort) params.set("sort", nextSort);
    if (nextSort) params.set("direction", nextDirection);
    return `${config.path}${params.size ? `?${params.toString()}` : ""}`;
  };
  return (
    <>
      <PageHeader title={config.title} description="Admin master data. Records are deactivated with soft delete, never hard deleted." />

      <Card className="mb-5">
        <CardHeader><CardTitle>Add {config.title.replace("Management", "").trim()}</CardTitle></CardHeader>
        <CardContent><RecordForm config={config} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Records</CardTitle>
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
                        <TableHead key={column.key}>
                          <Link href={query(1, column.key, nextDirection) as any} className="inline-flex items-center gap-1 hover:text-foreground">
                            {column.label}
                          </Link>
                        </TableHead>
                      );
                    })}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedRows.map((row) => (
                    <TableRow key={row.id}>
                      {config.columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.key === "status" ? <StatusBadge value={String(row[column.key])} /> : column.key.endsWith("_at") ? formatDate(String(row[column.key])) : String(row[column.key] ?? "-")}
                        </TableCell>
                      ))}
                      <TableCell className="min-w-80">
                        <details className="space-y-3">
                          <summary className="cursor-pointer text-sm font-medium text-primary">Edit</summary>
                          <RecordForm config={config} row={row} />
                        </details>
                        <form action={deactivateMaster.bind(null, config.key)} className="mt-3">
                          <input type="hidden" name="id" value={row.id} />
                          <Button size="sm" variant="outline" type="submit">Deactivate</Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div>Showing {pagedRows.length} of {filteredRows.length} records</div>
                <div className="flex gap-2">
                  {currentPage <= 1 ? (
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                  ) : (
                    <Button asChild variant="outline" size="sm"><Link href={query(currentPage - 1) as any}>Previous</Link></Button>
                  )}
                  {currentPage >= totalPages ? (
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  ) : (
                    <Button asChild variant="outline" size="sm"><Link href={query(currentPage + 1) as any}>Next</Link></Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
