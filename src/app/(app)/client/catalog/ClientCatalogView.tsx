"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Trash2, Tag, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClientSalesOrder, ClientOrderItemPayload } from "@/app/(app)/_actions/client-sales";
import { formatNumber } from "@/lib/utils";

type CatalogProduct = {
  id: string;
  name?: string; // for finishing products
  fabric_name?: string; // for fabric types
  width?: number;
  gsm?: number;
  selling_price: number;
  image_url?: string | null;
  description?: string | null;
  dimensions?: string | null;
};

type CartItem = {
  productId: string;
  category: "fabric" | "finishing";
  name: string;
  quantity: number;
  price: number;
  details: string;
};

export function ClientCatalogView({
  fabricTypes,
  finishingProducts,
}: {
  fabricTypes: CatalogProduct[];
  finishingProducts: CatalogProduct[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "fabric" | "finishing">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{ product: CatalogProduct; category: "fabric" | "finishing" } | null>(null);
  const [orderQuantity, setOrderQuantity] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Group products
  const productsList = useMemo(() => {
    const list: Array<{ product: CatalogProduct; category: "fabric" | "finishing" }> = [];

    if (activeTab === "all" || activeTab === "fabric") {
      fabricTypes.forEach((f) => list.push({ product: f, category: "fabric" }));
    }
    if (activeTab === "all" || activeTab === "finishing") {
      finishingProducts.forEach((f) => list.push({ product: f, category: "finishing" }));
    }

    return list.filter((item) => {
      const name = item.category === "fabric" ? item.product.fabric_name : item.product.name;
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [fabricTypes, finishingProducts, activeTab, searchTerm]);

  // Cart operations
  const handleAddToCart = () => {
    if (!selectedProduct || !orderQuantity) return;
    const qty = Number(orderQuantity);
    if (isNaN(qty) || qty <= 0) return;

    const prod = selectedProduct.product;
    const category = selectedProduct.category;
    const name = category === "fabric" ? prod.fabric_name! : prod.name!;
    const price = Number(prod.selling_price || 0);

    const details = category === "fabric"
      ? `Width: ${prod.width}" | GSM: ${prod.gsm}`
      : `${prod.dimensions || "Standard Bags"}`;

    const existingIndex = cart.findIndex((item) => item.productId === prod.id && item.category === category);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += qty;
      setCart(newCart);
    } else {
      setCart((prev) => [...prev, { productId: prod.id, category, name, quantity: qty, price, details }]);
    }

    setSelectedProduct(null);
    setOrderQuantity("");
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const itemsPayload: ClientOrderItemPayload[] = cart.map((item) => ({
        category: item.category,
        productId: item.productId,
        quantity: item.quantity,
      }));

      await createClientSalesOrder(itemsPayload);
      setSuccessText("Order placed successfully! Redirecting...");
      setCart([]);
      setTimeout(() => {
        router.push("/client/dashboard" as any);
      }, 1500);
    } catch (err: any) {
      setErrorText(err.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Products Catalog - 2 cols on lg */}
      <div className="lg:col-span-2 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className="text-xs h-8 flex-1 sm:flex-none"
            >
              All Items
            </Button>
            <Button
              variant={activeTab === "fabric" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("fabric")}
              className="text-xs h-8 flex-1 sm:flex-none"
            >
              Fabrics
            </Button>
            <Button
              variant={activeTab === "finishing" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("finishing")}
              className="text-xs h-8 flex-1 sm:flex-none"
            >
              Bags
            </Button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 shadow-none border-slate-200 font-semibold"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {productsList.map(({ product, category }) => {
            const name = category === "fabric" ? product.fabric_name : product.name;
            const price = Number(product.selling_price || 0);

            // Generate premium placeholder pattern using product name hash
            const hue = (name?.charCodeAt(0) || 0) * 12 % 360;
            const placeholderStyle = {
              background: `linear-gradient(135deg, hsl(${hue}, 70%, 80%) 0%, hsl(${(hue + 60) % 360}, 60%, 90%) 100%)`,
            };

            return (
              <Card
                key={product.id}
                onClick={() => setSelectedProduct({ product, category })}
                className="group cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200 border-slate-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Thumbnail */}
                <div
                  style={placeholderStyle}
                  className="h-32 w-full flex items-center justify-center relative select-none"
                >
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm capitalize">
                    {category}
                  </span>
                  {category === "fabric" ? (
                    <Layers className="h-10 w-10 text-slate-700/40" />
                  ) : (
                    <Tag className="h-10 w-10 text-slate-700/40" />
                  )}
                </div>

                <CardContent className="p-4 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {category === "fabric"
                      ? `Width: ${product.width}" | GSM: ${product.gsm}`
                      : `${product.dimensions || "Standard Bags"}`
                    }
                  </p>
                </CardContent>

                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">
                    ₹{formatNumber(price, 2)} {category === "fabric" ? "/ m" : "/ bag"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 group-hover:underline">
                    View Specs & Order
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer Panel - 1 col on lg */}
      <div className="space-y-4">
        {errorText && <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-md flex gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" /> {errorText}</div>}
        {successText && <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md flex gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> {successText}</div>}

        <Card className="shadow-none border-slate-200 bg-white sticky top-4">
          <CardHeader className="py-4 bg-slate-50/40 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" /> Your Order Cart
            </CardTitle>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {cart.length} items
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ShoppingCart className="mx-auto h-8 w-8 text-slate-300 stroke-[1.5]" />
                <p className="text-xs text-slate-400 font-medium">Add items from the catalog to build your order.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="p-4 flex justify-between items-start text-xs hover:bg-slate-50/30">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium capitalize">
                        {item.category} • {item.details}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {formatNumber(item.quantity, 0)} {item.category === "fabric" ? "meters" : "bags"} @ ₹{formatNumber(item.price, 2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <span className="font-bold text-slate-900">₹{formatNumber(item.quantity * item.price, 2)}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveFromCart(index)}
                        className="h-6 w-6 text-rose-500 hover:text-rose-700 hover:bg-rose-50 shadow-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Grand Total Estimate:</span>
                  <span className="text-sm font-black text-slate-950">₹{formatNumber(cartTotal, 2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
                >
                  {isSubmitting ? "Submitting Order..." : "Place Purchase Order"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Specifications Details Modal */}
      {selectedProduct && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) setSelectedProduct(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-800">
                {selectedProduct.category === "fabric"
                  ? selectedProduct.product.fabric_name
                  : selectedProduct.product.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Technical Specifications & Quote Estimate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Image Placeholder */}
              <div
                style={{
                  background: `linear-gradient(135deg, hsl(${((selectedProduct.category === "fabric" ? selectedProduct.product.fabric_name : selectedProduct.product.name)?.charCodeAt(0) || 0) * 12 % 360}, 70%, 80%) 0%, hsl(${( ((selectedProduct.category === "fabric" ? selectedProduct.product.fabric_name : selectedProduct.product.name)?.charCodeAt(0) || 0) * 12 + 60) % 360}, 60%, 90%) 100%)`
                }}
                className="h-40 w-full rounded-md flex items-center justify-center select-none"
              >
                {selectedProduct.category === "fabric" ? (
                  <Layers className="h-12 w-12 text-slate-700/30" />
                ) : (
                  <Tag className="h-12 w-12 text-slate-700/30" />
                )}
              </div>

              {/* Product Info Table */}
              <div className="rounded border border-slate-100 overflow-hidden text-xs">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold text-slate-500">Category</TableCell>
                      <TableCell className="capitalize font-semibold text-slate-800">{selectedProduct.category}</TableCell>
                    </TableRow>
                    {selectedProduct.category === "fabric" ? (
                      <>
                        <TableRow>
                          <TableCell className="font-bold text-slate-500">Width</TableCell>
                          <TableCell className="font-mono font-semibold text-slate-800">{selectedProduct.product.width} inches</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold text-slate-500">GSM</TableCell>
                          <TableCell className="font-mono font-semibold text-slate-800">{selectedProduct.product.gsm} gsm</TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell className="font-bold text-slate-500">Dimensions</TableCell>
                          <TableCell className="font-semibold text-slate-800">{selectedProduct.product.dimensions || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold text-slate-500">Description</TableCell>
                          <TableCell className="text-slate-700">{selectedProduct.product.description || "Premium laminated/printed finished bag spec."}</TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow>
                      <TableCell className="font-bold text-slate-500">Unit Selling Price</TableCell>
                      <TableCell className="font-mono font-bold text-emerald-700">₹{formatNumber(selectedProduct.product.selling_price || 0, 2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Order input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 block">
                  {selectedProduct.category === "fabric" ? "Order Quantity (Meters)" : "Order Quantity (Pieces)"}
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min="1"
                    placeholder={selectedProduct.category === "fabric" ? "1000" : "5000"}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="h-8 text-xs font-semibold w-full shadow-none border-slate-200"
                  />
                  {orderQuantity && !isNaN(Number(orderQuantity)) && Number(orderQuantity) > 0 && (
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded">
                      Est: ₹{formatNumber(Number(orderQuantity) * Number(selectedProduct.product.selling_price || 0), 2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setSelectedProduct(null)} className="h-9 text-xs font-semibold text-slate-500">
                Cancel
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!orderQuantity || isNaN(Number(orderQuantity)) || Number(orderQuantity) <= 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
