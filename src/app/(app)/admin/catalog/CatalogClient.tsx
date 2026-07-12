"use client";

import { useState, useTransition, useMemo } from "react";
import { saveCatalogProduct, deleteCatalogProduct } from "@/app/(app)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Layers, Search, Image as ImageIcon, X } from "lucide-react";
import { showSuccess } from "@/lib/toast";

type ClientOption = { id: string; name: string; alias?: string | null };

type CatalogItem = {
  id: string;
  type: "fabric" | "finishing";
  fabric_name?: string;
  gsm?: string;
  width?: string;
  name?: string;
  dimensions?: string;
  description?: string;
  selling_price: string | number;
  image_url?: string | null;
  customer_id?: string | null;
  customers?: { customer_name: string; alias?: string | null } | null;
};

type CatalogClientProps = {
  initialFabrics: CatalogItem[];
  initialFinishing: CatalogItem[];
  clients: ClientOption[];
};

export function CatalogClient({ initialFabrics, initialFinishing, clients }: CatalogClientProps) {
  const [tab, setTab] = useState<"fabric" | "finishing">("fabric");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<"fabric" | "finishing">("fabric");
  
  // Fabric Form Fields
  const [fabricName, setFabricName] = useState("");
  const [gsm, setGsm] = useState("");
  const [width, setWidth] = useState("");

  // Finishing Form Fields
  const [prodName, setProdName] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [description, setDescription] = useState("");

  // Shared Fields
  const [sellingPrice, setSellingPrice] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const activeItems = tab === "fabric" ? initialFabrics : initialFinishing;

  const filteredItems = useMemo(() => {
    if (!search) return activeItems;
    const q = search.toLowerCase();
    return activeItems.filter((item) => {
      const nameMatch = (item.fabric_name || item.name || "").toLowerCase().includes(q);
      const firmMatch = (item.customers?.customer_name || "").toLowerCase().includes(q);
      return nameMatch || firmMatch;
    });
  }, [activeItems, search]);

  const resetForm = () => {
    setEditingId(null);
    setCategory(tab);
    setFabricName("");
    setGsm("");
    setWidth("");
    setProdName("");
    setDimensions("");
    setDescription("");
    setSellingPrice("");
    setCustomerId("");
    setImageUrl("");
    setImageFile(null);
    setIsOpen(false);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setCategory(item.type);
    setSellingPrice(String(item.selling_price || "0"));
    setCustomerId(item.customer_id || "");
    setImageUrl(item.image_url || "");
    setImageFile(null);
    
    if (item.type === "fabric") {
      setFabricName(item.fabric_name || "");
      setGsm(item.gsm || "");
      setWidth(item.width || "");
    } else {
      setProdName(item.name || "");
      setDimensions(item.dimensions || "");
      setDescription(item.description || "");
    }
    
    setIsOpen(true);
  };

  const handleDelete = (id: string, cat: "fabric" | "finishing") => {
    if (!confirm("Are you sure you want to delete this catalogue item?")) return;
    startTransition(async () => {
      try {
        await deleteCatalogProduct(id, cat);
        showSuccess("Item deleted successfully!");
      } catch (err: any) {
        window.alert(err.message || "Failed to delete item.");
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    if (editingId) {
      formData.set("id", editingId);
    }
    formData.set("category", category);
    if (imageFile) {
      formData.set("image_file", imageFile);
    }

    startTransition(async () => {
      try {
        const res = await saveCatalogProduct(formData);
        if (res && !res.success) {
          window.alert(res.error || "Failed to save item.");
          return;
        }
        showSuccess(editingId ? "Catalogue item updated!" : "Catalogue item added!");
        resetForm();
      } catch (err: any) {
        window.alert(err.message || "Failed to save item.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Catalogue Manager</h1>
          <p className="text-sm text-slate-500">Manage fabric and finished bag models visible in client ordering portals.</p>
        </div>
        <Button onClick={() => { setCategory(tab); setIsOpen(true); }} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Create Catalogue Item
        </Button>
      </div>

      {/* Form Card (Inline expandable) */}
      {isOpen && (
        <Card className="border-slate-200 shadow-md animate-in slide-in-from-top-4 duration-200">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {editingId ? "Edit Catalogue Item" : "New Catalogue Item"}
              </CardTitle>
              <CardDescription>Configure specs, pricing, and visibility.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={resetForm} className="h-8 w-8 text-slate-400">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Department Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="category">Department Type</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    disabled={!!editingId}
                    className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="fabric">Fabric Products</option>
                    <option value="finishing">Finished Bags (Finishing)</option>
                  </select>
                </div>

                {/* Selling Price */}
                <div className="space-y-1.5">
                  <Label htmlFor="selling_price">Selling Price (INR)</Label>
                  <Input
                    id="selling_price"
                    name="selling_price"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                  />
                </div>

                {/* Customer Firm Link */}
                <div className="space-y-1.5">
                  <Label htmlFor="customer_id">Visible To (Customer Firm)</Label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="general">General (All Clients)</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.alias ? `(${c.alias})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department specific fields */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {category === "fabric" ? "Fabric Specifications" : "Finished Bag Specifications"}
                </h4>

                {category === "fabric" ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fabric_name">Fabric ID / Name</Label>
                      <Input
                        id="fabric_name"
                        name="fabric_name"
                        required
                        placeholder="e.g. 70GSM MILK WHITE"
                        value={fabricName}
                        onChange={(e) => setFabricName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="gsm">GSM</Label>
                      <Input
                        id="gsm"
                        name="gsm"
                        required
                        placeholder="e.g. 70"
                        value={gsm}
                        onChange={(e) => setGsm(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        name="width"
                        required
                        placeholder="e.g. 90"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Product Name / Bag Model</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="e.g. W-Cut Bag 30x40"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        name="dimensions"
                        placeholder="e.g. 10 W x 14 H + 3 G"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-3">
                      <Label htmlFor="description">Product Description / Technical Info</Label>
                      <textarea
                        id="description"
                        name="description"
                        rows={2}
                        placeholder="Detail materials, handles, or print limitations..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="https://example.com/product.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="image_file">Or Upload Image File</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : editingId ? "Update Item" : "Add to Catalogue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs and List Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b space-y-0 flex-wrap gap-4">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border">
            <button
              onClick={() => { setTab("fabric"); resetForm(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tab === "fabric"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Fabric Products
            </button>
            <button
              onClick={() => { setTab("finishing"); resetForm(); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tab === "finishing"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" /> Finished Bags
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No catalogue models found. Click <strong>Create Catalogue Item</strong> to populate.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>{tab === "fabric" ? "Fabric ID" : "Product Name"}</TableHead>
                    <TableHead>{tab === "fabric" ? "Specs (GSM/Width)" : "Dimensions"}</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Customer Visibility</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded border bg-slate-50 flex items-center justify-center overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt="product" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {item.fabric_name || item.name}
                        {item.description && (
                          <p className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">{item.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs font-mono">
                        {item.type === "fabric"
                          ? `${item.gsm} GSM · ${item.width} cm`
                          : item.dimensions || "—"}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700">
                        ₹{Number(item.selling_price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {item.customer_id ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {item.customers?.customer_name} {item.customers?.alias ? `(${item.customers.alias})` : ""}
                          </Badge>
                        ) : (
                          <Badge className="text-slate-400 border-slate-200 bg-slate-50/50">
                            General (All Clients)
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id, item.type)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
