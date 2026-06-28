"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Printer, Plus, Trash2, Edit, X, Eye, Power } from "lucide-react";
import { saveRotoProduct, deactivateRotoProduct } from "@/app/(app)/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/app/status-badge";
import { RotoColorsPreview } from "./RotoColorsPreview";

interface Color {
  id: string;
  color_name: string;
}

interface Client {
  id: string;
  name: string;
  alias?: string;
}

interface RotoProductColor {
  id: string;
  color_id: string;
  image_url: string | null;
  roto_colors?: Color | null;
}

interface RotoProduct {
  id: string;
  brand: string;
  width: number;
  height: number;
  num_cylinders: number;
  image_url: string | null;
  status: string;
  customer_id: string | null;
  customers?: {
    customer_name: string;
    alias: string | null;
  } | null;
  roto_product_colors?: RotoProductColor[];
}

interface RotoProductsClientProps {
  rotoData: RotoProduct[];
  clientList: Client[];
  colorsList: Color[];
  productPage: number;
  rotoTotal: number;
}

export function RotoProductsClient({
  rotoData,
  clientList,
  colorsList,
  productPage,
  rotoTotal,
}: RotoProductsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State for Add Product form
  const [addColors, setAddColors] = useState<{ id: string; name: string }[]>([]);
  const [selectedColorToAdd, setSelectedColorToAdd] = useState("");

  // Modal / Editing states
  const [editingProduct, setEditingProduct] = useState<RotoProduct | null>(null);
  const [editColors, setEditColors] = useState<{ id: string; name: string; existingImage?: string | null }[]>([]);
  const [selectedColorToEditAdd, setSelectedColorToEditAdd] = useState("");

  // Preview Image Modal state
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  // Pagination helper
  const totalPages = Math.max(Math.ceil(rotoTotal / 10), 1);

  // Add color to Add Form list
  const handleAddColorToAddForm = () => {
    if (!selectedColorToAdd) return;
    const colorObj = colorsList.find((c) => c.id === selectedColorToAdd);
    if (colorObj && !addColors.some((c) => c.id === colorObj.id)) {
      setAddColors((prev) => [...prev, { id: colorObj.id, name: colorObj.color_name }]);
    }
    setSelectedColorToAdd("");
  };

  // Remove color from Add Form list
  const handleRemoveColorFromAddForm = (colorId: string) => {
    setAddColors((prev) => prev.filter((c) => c.id !== colorId));
  };

  // Add color to Edit Form list
  const handleAddColorToEditForm = () => {
    if (!selectedColorToEditAdd) return;
    const colorObj = colorsList.find((c) => c.id === selectedColorToEditAdd);
    if (colorObj && !editColors.some((c) => c.id === colorObj.id)) {
      setEditColors((prev) => [...prev, { id: colorObj.id, name: colorObj.color_name }]);
    }
    setSelectedColorToEditAdd("");
  };

  // Remove color from Edit Form list
  const handleRemoveColorFromEditForm = (colorId: string) => {
    setEditColors((prev) => prev.filter((c) => c.id !== colorId));
  };

  // Trigger editing modal
  const handleOpenEdit = (product: RotoProduct) => {
    setEditingProduct(product);
    const existing = (product.roto_product_colors ?? []).map((ac) => ({
      id: ac.color_id,
      name: ac.roto_colors?.color_name ?? "Unknown Color",
      existingImage: ac.image_url,
    }));
    setEditColors(existing);
  };

  // Handle Add Product Submit
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await saveRotoProduct(formData);
        e.currentTarget.reset();
        setAddColors([]);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to add roto product");
      }
    });
  };

  // Handle Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await saveRotoProduct(formData);
        setEditingProduct(null);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to update roto product");
      }
    });
  };

  // Handle Deactivate Action
  const handleDeactivate = (id: string) => {
    if (!confirm("Are you sure you want to deactivate this Roto printing product?")) return;
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("id", id);
        await deactivateRotoProduct(fd);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Failed to deactivate roto product");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Add Roto Product */}
      <Card className="border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Add Roto Printing Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g. RK-Rotogravure" required />
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
              <Label htmlFor="num_cylinders">Number of Cylinders</Label>
              <Input id="num_cylinders" name="num_cylinders" type="number" placeholder="e.g. 6" required />
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

            {/* Colors Section */}
            <div className="space-y-3 md:col-span-2 lg:col-span-3 border-t pt-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <Label htmlFor="add_color_select">Add Color to Brand</Label>
                  <select
                    id="add_color_select"
                    value={selectedColorToAdd}
                    onChange={(e) => setSelectedColorToAdd(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose Color --</option>
                    {colorsList
                      .filter((col) => !addColors.some((ac) => ac.id === col.id))
                      .map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.color_name}
                        </option>
                      ))}
                  </select>
                </div>
                <Button
                  type="button"
                  onClick={handleAddColorToAddForm}
                  className="h-10 bg-slate-800 hover:bg-slate-700 text-white gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Color
                </Button>
              </div>

              {addColors.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 border p-3.5 rounded-lg bg-slate-50/50 mt-2">
                  {addColors.map((color) => (
                    <div key={color.id} className="border border-slate-200 p-3 rounded-lg bg-white shadow-sm flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">{color.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveColorFromAddForm(color.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <input type="hidden" name="color_ids" value={color.id} />
                      <div className="space-y-1">
                        <Label className="text-[9px] text-muted-foreground uppercase">Upload Image</Label>
                        <Input
                          name={`image_file_${color.id}`}
                          type="file"
                          accept="image/*"
                          className="h-8 py-1 text-xs cursor-pointer border-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <CardTitle className="text-lg font-bold text-slate-800">Roto Products</CardTitle>
        </CardHeader>
        <CardContent>
          {rotoData.length === 0 ? (
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
                    <TableHead>Cylinders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotoData.map((row) => (
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
                        <RotoColorsPreview
                          firmName={row.customers?.customer_name ?? "General"}
                          brandName={row.brand}
                          colors={row.roto_product_colors ?? []}
                          defaultImageUrl={row.image_url}
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{row.brand}</TableCell>
                      <TableCell className="font-mono text-xs">{row.width} &times; {row.height} mm</TableCell>
                      <TableCell>{row.num_cylinders}</TableCell>
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
                            onClick={() => handleOpenEdit(row)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div>
                Showing {rotoData.length} of {rotoTotal} records
              </div>
              <div className="flex items-center gap-1.5">
                {productPage <= 1 ? (
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products?tab=roto&page=${productPage - 1}` as any)}
                  >
                    Previous
                  </Button>
                )}

                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = pageNum === productPage;
                  return (
                    <Button
                      key={pageNum}
                      type="button"
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      className={isCurrent ? "pointer-events-none font-bold" : ""}
                      disabled={isCurrent}
                      onClick={() => router.push(`/admin/products?tab=roto&page=${pageNum}` as any)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {productPage >= totalPages ? (
                  <Button variant="outline" size="sm" disabled>Next</Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products?tab=roto&page=${productPage + 1}` as any)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editing Dialog Modal */}
      <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Edit Roto Printing Product: {editingProduct?.brand}
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
                  <Label>Cylinders</Label>
                  <Input name="num_cylinders" type="number" defaultValue={editingProduct.num_cylinders} required />
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
                      <span className="text-[10px] text-slate-500">Current primary image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Colors Section */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[200px] space-y-1.5">
                    <Label htmlFor="edit_color_select">Add Color to Brand</Label>
                    <select
                      id="edit_color_select"
                      value={selectedColorToEditAdd}
                      onChange={(e) => setSelectedColorToEditAdd(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Choose Color --</option>
                      {colorsList
                        .filter((col) => !editColors.some((ac) => ac.id === col.id))
                        .map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.color_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddColorToEditForm}
                    className="h-10 bg-slate-800 hover:bg-slate-700 text-white gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Color
                  </Button>
                </div>

                {editColors.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2 border p-3 rounded-lg bg-slate-50/50 mt-2 max-h-56 overflow-y-auto">
                    {editColors.map((color) => (
                      <div key={color.id} className="border border-slate-200 p-2.5 rounded-lg bg-white shadow-sm flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{color.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveColorFromEditForm(color.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <input type="hidden" name="color_ids" value={color.id} />
                        
                        {color.existingImage && (
                          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded border">
                            <img src={color.existingImage} alt="Current Color" className="h-6 w-6 object-cover rounded" />
                            <span className="text-[9px] text-slate-500 truncate max-w-[120px]">Has image</span>
                            <input type="hidden" name={`existing_image_${color.id}`} value={color.existingImage} />
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <Label className="text-[9px] text-muted-foreground uppercase">Change Image</Label>
                          <Input
                            name={`image_file_${color.id}`}
                            type="file"
                            accept="image/*"
                            className="h-7 py-0.5 text-xs cursor-pointer border-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
