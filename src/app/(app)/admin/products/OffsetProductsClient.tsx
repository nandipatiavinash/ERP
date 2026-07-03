"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, Power } from "lucide-react";
import { saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/app/status-badge";

interface Client {
  id: string;
  name: string;
  alias?: string;
}

interface OffsetProduct {
  id: string;
  brand: string;
  width: number;
  height: number;
  image_url: string | null;
  status: string;
  customer_id: string | null;
  customers?: {
    customer_name: string;
    alias: string | null;
  } | null;
}

interface OffsetProductsClientProps {
  offsetData: OffsetProduct[];
  clientList: Client[];
}

export function OffsetProductsClient({
  offsetData,
  clientList,
}: OffsetProductsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialog and Preview states
  const [editingProduct, setEditingProduct] = useState<OffsetProduct | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);


  // Handle Add Product Submit
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await saveOffsetProduct(formData);
        form.reset();
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to add offset product");
      }
    });
  };

  // Handle Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await saveOffsetProduct(formData);
        setEditingProduct(null);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to update offset product");
      }
    });
  };

  // Handle Deactivate
  const handleDeactivate = (id: string) => {
    if (!confirm("Are you sure you want to deactivate this Offset printing product?")) return;
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("id", id);
        await deactivateOffsetProduct(fd);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to deactivate offset product");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Add Offset Product */}
      <Card className="border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Add Offset Printing Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g. RK-Offset" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (mm)</Label>
              <Input id="width" name="width" type="number" step="0.01" placeholder="e.g. 600.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (mm)</Label>
              <Input id="height" name="height" type="number" step="0.01" placeholder="e.g. 900.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_file">Product Image File</Label>
              <Input id="image_file" name="image_file" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_id">Client / Customer</Label>
              <select
                name="customer_id"
                id="customer_id"
                required
                className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="general">General (No Client)</option>
                {clientList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.alias ? `(${c.alias})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                name="status"
                id="status"
                required
                className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end md:col-span-2 lg:col-span-3 pt-2">
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6">
                {isPending ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card 2: Products List */}
      <Card className="border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Offset Products</CardTitle>
        </CardHeader>
        <CardContent>
          {offsetData.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic">No products found</div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offsetData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50/30">
                      <TableCell>
                        {row.image_url ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ src: row.image_url!, title: row.brand })}
                            className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-slate-200 transition-all hover:border-emerald-500"
                            title="Click to view full preview"
                          >
                            <img src={row.image_url} alt={row.brand} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-dashed">
                            No image
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.customers?.customer_name ? (
                          <span className="font-bold text-slate-800">
                            {row.customers.customer_name} {row.customers.alias ? `(${row.customers.alias})` : ""}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-sm">General</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{row.brand}</TableCell>
                      <TableCell className="font-mono text-xs">{row.width} &times; {row.height} mm</TableCell>
                      <TableCell>
                        {row.status === "inactive" ? (
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            Deactivated
                          </Badge>
                        ) : (
                          <StatusBadge value={row.status} />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(row)}
                            className="h-8 border-slate-200 hover:bg-slate-100 text-slate-700 gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          {row.status !== "inactive" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeactivate(row.id)}
                              className="h-8 border-red-200 hover:bg-red-50 text-red-600 gap-1"
                            >
                              <Power className="h-3.5 w-3.5" />
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {offsetData.length} records
          </div>
        </CardContent>
      </Card>

      {/* Editing Dialog Modal */}
      <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Edit Offset Printing Product: {editingProduct?.brand}
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
              <input type="hidden" name="id" value={editingProduct.id} />
              <input type="hidden" name="image_url" value={editingProduct.image_url || ""} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Brand</Label>
                  <Input name="brand" defaultValue={editingProduct.brand} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Width (mm)</Label>
                  <Input name="width" type="number" step="0.01" defaultValue={editingProduct.width} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Height (mm)</Label>
                  <Input name="height" type="number" step="0.01" defaultValue={editingProduct.height} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Client / Customer</Label>
                  <select
                    name="customer_id"
                    defaultValue={editingProduct.customer_id || "general"}
                    className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="general">General (No Client)</option>
                    {clientList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.alias ? `(${c.alias})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select
                    name="status"
                    defaultValue={editingProduct.status}
                    className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Update Product Image File</Label>
                  <Input name="image_file" type="file" accept="image/*" />
                  {editingProduct.image_url && (
                    <div className="flex items-center gap-2 mt-1 bg-slate-50 p-1.5 rounded border">
                      <img src={editingProduct.image_url} alt="Current" className="h-8 w-8 object-cover rounded" />
                      <span className="text-[10px] text-slate-500">Current product image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5">
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={previewImage !== null} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">
              Preview: {previewImage?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 border rounded-lg bg-slate-50 mt-2">
            {previewImage?.src && (
              <img
                src={previewImage.src}
                alt="Product preview"
                className="max-h-[500px] max-w-full rounded object-contain shadow"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
